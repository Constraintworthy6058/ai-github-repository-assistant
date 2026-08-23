"use client";

import { useEffect, useState } from "react";
import { ChevronRight, File, Folder, FolderOpen, GitBranch as Github, LoaderCircle } from "lucide-react";
import type { GitHubContent } from "@/lib/github/types";
import { getLanguageFromPath } from "@/lib/utils/format";
import { ItemAction } from "@/components/assistant/item-action";
import { SelectedCodeAction } from "@/components/assistant/selected-code-action";

export function RepositoryExplorer({ owner, repo }: { owner: string; repo: string }) {
  const [path, setPath] = useState("");
  const [content, setContent] = useState<GitHubContent | GitHubContent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/github/contents?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}`, { signal: controller.signal })
      .then(async (response) => ({ ok: response.ok, data: await response.json() }))
      .then(({ ok, data }) => {
        setLoading(false);
        if (!ok) setError(data.error);
        else setContent(data.content);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof Error && requestError.name === "AbortError") return;
        setLoading(false);
        setError("Repository contents could not be loaded.");
      });
    return () => controller.abort();
  }, [owner, repo, path]);

  function navigate(nextPath: string) {
    if (nextPath === path) return;
    setLoading(true);
    setError("");
    setPath(nextPath);
  }

  const parts = path.split("/").filter(Boolean);
  const sorted = Array.isArray(content)
    ? [...content].sort((a, b) => Number(b.type === "dir") - Number(a.type === "dir") || a.name.localeCompare(b.name))
    : [];

  return <section className="explorer">
    <div className="explorer-header"><div className="breadcrumbs"><button onClick={() => navigate("")}><Github size={16} />{repo}</button>{parts.map((part, index) => <span key={`${part}-${index}`}><ChevronRight size={14} /><button onClick={() => navigate(parts.slice(0, index + 1).join("/"))}>{part}</button></span>)}</div>{!Array.isArray(content) && content?.type === "file" && <span className="badge">{getLanguageFromPath(content.path)}</span>}</div>
    {loading ? <div className="explorer-loading"><LoaderCircle className="spin" /> Loading repository contents…</div>
      : error ? <p className="error-message panel-message">{error}</p>
      : Array.isArray(content) ? <div className="file-list">{sorted.map((item) => <button key={item.sha} onClick={() => navigate(item.path)}><span>{item.type === "dir" ? <Folder size={18} /> : <File size={18} />}{item.name}</span><small>{item.type === "dir" ? "Directory" : formatBytes(item.size)}</small><ChevronRight size={15} /></button>)}</div>
      : content ? <div className="code-view"><div className="code-toolbar"><div><strong>{content.name}</strong><span>{content.path} · {formatBytes(content.size)}</span></div><div className="code-actions"><ItemAction owner={owner} repo={repo} kind="file" path={content.path} action="explain" label="Explain file" /><ItemAction owner={owner} repo={repo} kind="file" path={content.path} action="summarize" label="Summarize" /><ItemAction owner={owner} repo={repo} kind="file" path={content.path} action="bugs" label="Find bugs" /><ItemAction owner={owner} repo={repo} kind="file" path={content.path} action="improvements" label="Improvements" /><SelectedCodeAction owner={owner} repo={repo} path={content.path} /></div></div><pre className="source-code"><code>{(content as GitHubContent & { text?: string }).text ?? "File content is unavailable."}</code></pre></div>
      : <div className="empty-state"><FolderOpen /><p>This directory is empty.</p></div>}
  </section>;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
