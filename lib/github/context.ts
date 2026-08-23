import type { GitHubContent } from "@/lib/github/types";
import { GitHubClient } from "@/lib/github/client";

const TEXT_EXTENSIONS = new Set([
  "md", "mdx", "txt", "json", "yaml", "yml", "toml", "js", "mjs", "cjs", "jsx", "ts", "tsx", "py", "go", "rs", "java", "kt", "rb", "php", "cs", "cpp", "c", "h", "css", "scss", "html", "sql", "prisma", "sh", "ps1", "dockerfile",
]);
const PRIORITY_NAMES = new Set([
  "readme.md", "readme.mdx", "package.json", "pyproject.toml", "cargo.toml", "go.mod", "dockerfile", "docker-compose.yml", "compose.yml", "prisma.schema", "next.config.ts", "next.config.js", "vite.config.ts", "tsconfig.json",
]);
const MANIFEST_NAMES = new Set([
  "package.json", "pyproject.toml", "cargo.toml", "go.mod", "pom.xml", "build.gradle", "requirements.txt", "gemfile", "composer.json", "mix.exs",
]);
const ENTRY_POINT_NAMES = new Set([
  "page.tsx", "page.ts", "layout.tsx", "main.ts", "main.tsx", "main.js", "index.ts", "index.tsx", "index.js", "app.ts", "app.tsx", "server.ts", "manage.py", "main.py",
]);
const ROOT_SOURCE_DIRECTORIES = new Set([
  "app", "src", "lib", "server", "api", "prisma", "docs", "test", "tests", "config", "scripts", "packages", "components", "pages", "routes",
]);
const IGNORED_DIRECTORY_NAMES = new Set([
  "node_modules", ".next", "dist", "build", "coverage", ".git", "generated", "vendor", "target", "out", ".cache", "cache", "tmp", "temp", "bin", "obj", ".turbo", ".vercel",
]);
const IGNORED_FILE_NAMES = new Set([
  "package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb", "cargo.lock", "composer.lock", "gemfile.lock", "poetry.lock", "pdm.lock",
]);

export type RepositoryContextLimits = {
  maxFiles: number;
  maxFileBytes: number;
  maxFileChars: number;
  maxTotalChars: number;
  maxDirectories: number;
  maxDepth: number;
};

export type RepositoryContextDocument = {
  path: string;
  content: string;
  originalChars: number;
  truncated: boolean;
};

export const DEFAULT_CONTEXT_LIMITS: RepositoryContextLimits = {
  maxFiles: 18,
  maxFileBytes: 100_000,
  maxFileChars: 12_000,
  maxTotalChars: 90_000,
  maxDirectories: 8,
  maxDepth: 2,
};

export const ANALYSIS_CONTEXT_LIMITS: RepositoryContextLimits = {
  maxFiles: 16,
  maxFileBytes: 80_000,
  maxFileChars: 5_000,
  maxTotalChars: 30_000,
  maxDirectories: 12,
  maxDepth: 2,
};

export function isIgnoredPath(path: string) {
  const parts = path.replace(/\\/g, "/").toLowerCase().split("/").filter(Boolean);
  const name = parts.at(-1) ?? "";
  return parts.some((part, index) => index < parts.length - 1 && IGNORED_DIRECTORY_NAMES.has(part))
    || IGNORED_DIRECTORY_NAMES.has(name)
    || IGNORED_FILE_NAMES.has(name)
    || name.endsWith(".min.js")
    || name.endsWith(".map")
    || name.endsWith(".lock");
}

export function isAnalyzableFile(path: string, size: number, maxFileBytes = DEFAULT_CONTEXT_LIMITS.maxFileBytes) {
  const name = path.split("/").pop()?.toLowerCase() ?? "";
  const extension = name.includes(".") ? name.split(".").pop() ?? "" : name;
  return size <= maxFileBytes && !isIgnoredPath(path) && (TEXT_EXTENSIONS.has(extension) || PRIORITY_NAMES.has(name) || MANIFEST_NAMES.has(name));
}

function filePriority(file: GitHubContent) {
  const name = file.name.toLowerCase();
  const path = file.path.toLowerCase();
  let score = 0;
  if (name.startsWith("readme.")) score += 1_000;
  if (MANIFEST_NAMES.has(name)) score += 900;
  if (PRIORITY_NAMES.has(name)) score += 750;
  if (ENTRY_POINT_NAMES.has(name)) score += 600;
  if (/^(next|vite|vitest|jest|eslint|tsconfig|docker|compose|prisma)/.test(name)) score += 450;
  if (/(^|\/)(docs?|architecture)(\/|$)/.test(path)) score += 350;
  if (/(^|\/)(tests?|__tests__)(\/|$)/.test(path) || /\.(test|spec)\./.test(name)) score += 300;
  if (/(^|\/)(app|src|lib|server|api)(\/|$)/.test(path)) score += 250;
  score -= path.split("/").length * 4;
  score -= Math.min(file.size / 10_000, 20);
  return score;
}

export function rankFiles(files: GitHubContent[]) {
  return [...files].sort((a, b) => filePriority(b) - filePriority(a) || a.path.localeCompare(b.path));
}

async function collectCandidateFiles(
  client: GitHubClient,
  owner: string,
  repo: string,
  root: GitHubContent[],
  limits: RepositoryContextLimits,
) {
  const candidates = root.filter((item) => item.type === "file" && isAnalyzableFile(item.path, item.size, limits.maxFileBytes));
  const queue = root
    .filter((item) => item.type === "dir" && ROOT_SOURCE_DIRECTORIES.has(item.name.toLowerCase()) && !isIgnoredPath(item.path))
    .map((item) => ({ directory: item, depth: 1 }));
  let visitedDirectories = 0;

  while (queue.length && visitedDirectories < limits.maxDirectories) {
    const next = queue.shift();
    if (!next) break;
    visitedDirectories += 1;
    const contents = await client.getContents(owner, repo, next.directory.path).catch(() => [] as GitHubContent[]);
    if (!Array.isArray(contents)) continue;
    candidates.push(...contents.filter((item) => item.type === "file" && isAnalyzableFile(item.path, item.size, limits.maxFileBytes)));
    if (next.depth < limits.maxDepth) {
      queue.push(...contents
        .filter((item) => item.type === "dir" && !isIgnoredPath(item.path))
        .map((directory) => ({ directory, depth: next.depth + 1 })));
    }
  }

  return [...new Map(candidates.map((file) => [file.path, file])).values()];
}

export async function collectRepositoryContext(
  client: GitHubClient,
  owner: string,
  repo: string,
  limits: RepositoryContextLimits = DEFAULT_CONTEXT_LIMITS,
) {
  const root = await client.getContents(owner, repo);
  if (!Array.isArray(root)) return { files: [], context: "", documents: [] as RepositoryContextDocument[], totalChars: 0 };
  const candidates = await collectCandidateFiles(client, owner, repo, root, limits);
  const selected = rankFiles(candidates).slice(0, limits.maxFiles);
  const retrieved = await Promise.all(selected.map(async (file) => {
    const value = await client.getTextFile(owner, repo, file.path).catch(() => null);
    return value ? { file, text: value.text } : null;
  }));

  const documents: RepositoryContextDocument[] = [];
  let totalChars = 0;
  for (const item of retrieved) {
    if (!item || totalChars >= limits.maxTotalChars) continue;
    const available = Math.min(limits.maxFileChars, limits.maxTotalChars - totalChars);
    const content = item.text.slice(0, available);
    if (!content.trim()) continue;
    documents.push({ path: item.file.path, content, originalChars: item.text.length, truncated: item.text.length > content.length });
    totalChars += content.length;
  }

  const context = documents.map((document) => `\n--- FILE: ${document.path}${document.truncated ? " (truncated)" : ""} ---\n${document.content}`).join("\n");
  return { files: documents.map((document) => document.path), context, documents, totalChars };
}
