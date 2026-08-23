"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, GitFork, Lock, Search, Star } from "lucide-react";
import type { GitHubRepository } from "@/lib/github/types";
import { formatCompactNumber, formatRelativeDate } from "@/lib/utils/format";

export function RepositoryList({ repositories }: { repositories: GitHubRepository[] }) {
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState("all");
  const filtered = useMemo(() => repositories.filter((repo) => {
    const matchesQuery = repo.full_name.toLowerCase().includes(query.toLowerCase()) || repo.description?.toLowerCase().includes(query.toLowerCase());
    const matchesVisibility = visibility === "all" || (visibility === "private" ? repo.private : !repo.private);
    return matchesQuery && matchesVisibility;
  }), [repositories, query, visibility]);
  return <><div className="toolbar"><label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your repositories…" aria-label="Search repositories" /></label><div className="segmented" aria-label="Repository visibility">{["all", "public", "private"].map((item) => <button className={visibility === item ? "active" : ""} key={item} onClick={() => setVisibility(item)}>{item}</button>)}</div></div>
    <div className="repository-list">{filtered.map((repo) => <article className="repository-row" key={repo.id}><div className="repo-icon">{repo.private ? <Lock size={20} /> : <BookOpen size={20} />}</div><div className="repo-details"><div className="repo-title"><Link href={`/repositories/${repo.owner.login}/${repo.name}`}>{repo.name}</Link><span className="badge">{repo.private ? "Private" : "Public"}</span></div><p>{repo.description ?? "No description provided."}</p><div className="repo-meta">{repo.language && <span><i className="language-dot" />{repo.language}</span>}<span><Star size={14} />{formatCompactNumber(repo.stargazers_count)}</span><span><GitFork size={14} />{formatCompactNumber(repo.forks_count)}</span><span>Updated {formatRelativeDate(repo.updated_at)}</span></div></div><Link className="icon-button" href={`/repositories/${repo.owner.login}/${repo.name}`} aria-label={`Open ${repo.name}`}><ArrowUpRight size={18} /></Link></article>)}{!filtered.length && <div className="empty-inline">No repositories match your filters.</div>}</div></>;
}
