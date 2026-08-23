import { GitHubApiError } from "@/lib/github/errors";
import type {
  CodeSearchItem,
  GitHubCommit,
  GitHubContent,
  GitHubIssue,
  GitHubPull,
  GitHubRepository,
} from "@/lib/github/types";

const API_ROOT = "https://api.github.com";

type Fetcher = typeof fetch;

export class GitHubClient {
  constructor(
    private readonly token: string,
    private readonly fetcher: Fetcher = fetch,
  ) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await this.fetcher(`${API_ROOT}${path}`, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ai-github-repository-assistant",
        ...init?.headers,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { message?: string };
      throw new GitHubApiError(
        body.message ?? `GitHub request failed (${response.status})`,
        response.status,
        response.headers.get("x-ratelimit-remaining"),
        response.headers.get("x-ratelimit-reset"),
      );
    }
    return response.json() as Promise<T>;
  }

  listRepositories(page = 1, perPage = 30) {
    return this.request<GitHubRepository[]>(`/user/repos?sort=updated&visibility=all&affiliation=owner,collaborator,organization_member&page=${page}&per_page=${perPage}`);
  }

  getRepository(owner: string, repo: string) {
    return this.request<GitHubRepository>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
  }

  getContents(owner: string, repo: string, path = "", ref?: string) {
    const suffix = ref ? `?ref=${encodeURIComponent(ref)}` : "";
    return this.request<GitHubContent | GitHubContent[]>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path.split("/").map(encodeURIComponent).join("/")}${suffix}`);
  }

  async getTextFile(owner: string, repo: string, path: string, ref?: string) {
    const item = await this.getContents(owner, repo, path, ref);
    if (Array.isArray(item) || item.type !== "file" || !item.content) throw new GitHubApiError("File content is unavailable.", 422);
    return { ...item, text: Buffer.from(item.content.replace(/\n/g, ""), "base64").toString("utf8") };
  }

  listCommits(owner: string, repo: string, perPage = 8) {
    return this.request<GitHubCommit[]>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=${perPage}`);
  }

  getCommit(owner: string, repo: string, sha: string) {
    return this.request<GitHubCommit>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits/${encodeURIComponent(sha)}`);
  }

  listPulls(owner: string, repo: string) {
    return this.request<GitHubPull[]>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls?state=open&per_page=50`);
  }

  getPull(owner: string, repo: string, number: number) {
    return this.request<GitHubPull>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${number}`);
  }

  getPullFiles(owner: string, repo: string, number: number) {
    return this.request<Array<{ filename: string; status: string; additions: number; deletions: number; changes: number; patch?: string }>>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${number}/files?per_page=100`);
  }

  async listIssues(owner: string, repo: string) {
    const rows = await this.request<GitHubIssue[]>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues?state=open&per_page=50`);
    return rows.filter((issue) => !issue.pull_request);
  }

  searchCode(owner: string, repo: string, query: string) {
    const q = encodeURIComponent(`${query} repo:${owner}/${repo}`);
    return this.request<{ total_count: number; items: CodeSearchItem[] }>(`/search/code?q=${q}&per_page=30`, {
      headers: { Accept: "application/vnd.github.text-match+json" },
    });
  }
}
