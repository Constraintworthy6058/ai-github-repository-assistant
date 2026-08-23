import { notFound } from "next/navigation";
import { BookOpen, CircleDot, GitFork, GitPullRequest, Scale, Star } from "lucide-react";
import { AnalyzeRepositoryButton } from "@/components/assistant/analyze-button";
import { CommitList } from "@/components/github/commit-list";
import { CodeSearch } from "@/components/repositories/code-search";
import { RepositoryExplorer } from "@/components/repositories/repository-explorer";
import { RepositoryTabs } from "@/components/repositories/repository-tabs";
import { getServerGitHubClient } from "@/lib/github/server";
import { formatCompactNumber } from "@/lib/utils/format";
import { repositoryParamsSchema } from "@/lib/validation";

export default async function RepositoryPage({ params, searchParams }: { params: Promise<{ owner: string; repo: string }>; searchParams: Promise<{ tab?: string }> }) {
  const raw = await params; const parsed = repositoryParamsSchema.safeParse(raw); if (!parsed.success) notFound();
  const { owner, repo } = parsed.data; const tab = (await searchParams).tab;
  const client = await getServerGitHubClient(); if (!client) notFound();
  const [repository, commits, pulls, issues] = await Promise.all([client.getRepository(owner, repo), client.listCommits(owner, repo), client.listPulls(owner, repo), client.listIssues(owner, repo)]).catch(() => [null, [], [], []] as const);
  if (!repository) notFound();
  if (tab === "explorer") return <div className="page-stack"><RepositoryHeader owner={owner} repo={repo} description={repository.description} isPrivate={repository.private} /><RepositoryTabs owner={owner} repo={repo} active="explorer" /><RepositoryExplorer owner={owner} repo={repo} /></div>;
  return <div className="page-stack"><RepositoryHeader owner={owner} repo={repo} description={repository.description} isPrivate={repository.private} /><RepositoryTabs owner={owner} repo={repo} active="overview" /><section className="repo-summary"><div><span className="repo-avatar"><BookOpen /></span><div><small>Repository</small><h2>{repository.full_name}</h2><p>{repository.description ?? "No description provided."}</p></div></div><a className="button button-secondary" href={repository.html_url} target="_blank" rel="noreferrer">Open on GitHub</a></section>
    <section className="stats-grid repo-stats"><article><span className="stat-icon violet"><span className="language-dot" /></span><div><small>Primary language</small><strong>{repository.language ?? "Unknown"}</strong></div></article><article><span className="stat-icon amber"><Star /></span><div><small>Stars</small><strong>{formatCompactNumber(repository.stargazers_count)}</strong></div></article><article><span className="stat-icon blue"><GitFork /></span><div><small>Forks</small><strong>{formatCompactNumber(repository.forks_count)}</strong></div></article><article><span className="stat-icon green"><CircleDot /></span><div><small>Issues / PRs</small><strong>{issues.length} / {pulls.length}</strong></div></article></section>
    <section className="analysis-cta"><div><span className="feature-icon"><Scale size={20} /></span><div><h2>Repository intelligence report</h2><p>Analyze verified files for architecture, entry points, risks, tests, documentation, and improvements.</p></div></div><AnalyzeRepositoryButton owner={owner} repo={repo} /></section>
    <div className="dashboard-grid repo-grid"><section className="panel"><div className="panel-heading"><div><h2>Recent commits</h2><p>Actual data from the GitHub REST API.</p></div></div><CommitList commits={commits} owner={owner} repo={repo} /></section><aside className="panel repository-facts"><h2>Repository facts</h2><dl><div><dt>Default branch</dt><dd><code>{repository.default_branch}</code></dd></div><div><dt>Visibility</dt><dd>{repository.private ? "Private" : "Public"}</dd></div><div><dt>Open pull requests</dt><dd><GitPullRequest size={14} /> {pulls.length}</dd></div><div><dt>Open issues</dt><dd><CircleDot size={14} /> {issues.length}</dd></div></dl></aside></div><CodeSearch owner={owner} repo={repo} /></div>;
}

function RepositoryHeader({ owner, repo, description, isPrivate }: { owner: string; repo: string; description: string | null; isPrivate: boolean }) {
  return <div className="page-heading repo-page-heading"><div><span className="eyebrow">{owner} / {isPrivate ? "Private repository" : "Public repository"}</span><h1>{repo}</h1><p>{description ?? "Explore and understand this repository."}</p></div></div>;
}
