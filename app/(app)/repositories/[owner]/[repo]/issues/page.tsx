import { notFound } from "next/navigation";
import { IssueList } from "@/components/github/issue-list";
import { RepositoryTabs } from "@/components/repositories/repository-tabs";
import { getServerGitHubClient } from "@/lib/github/server";
import { repositoryParamsSchema } from "@/lib/validation";

export default async function IssuesPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const parsed = repositoryParamsSchema.safeParse(await params); if (!parsed.success) notFound(); const { owner, repo } = parsed.data;
  const client = await getServerGitHubClient(); const issues = client ? await client.listIssues(owner, repo).catch(() => []) : [];
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">{owner} / {repo}</span><h1>Issues</h1><p>Triage open work with evidence-backed, local AI assistance.</p></div><span className="count-badge">{issues.length} open</span></div><RepositoryTabs owner={owner} repo={repo} active="issues" /><section className="panel"><div className="data-legend"><span className="badge">GitHub data</span><p>Issue content and labels come from GitHub. Summaries, plans, and drafts are suggestions only.</p></div><IssueList issues={issues} owner={owner} repo={repo} /></section></div>;
}
