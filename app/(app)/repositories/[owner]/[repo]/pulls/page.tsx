import { notFound } from "next/navigation";
import { PullRequestList } from "@/components/github/pull-request-list";
import { RepositoryTabs } from "@/components/repositories/repository-tabs";
import { getServerGitHubClient } from "@/lib/github/server";
import { repositoryParamsSchema } from "@/lib/validation";

export default async function PullsPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const parsed = repositoryParamsSchema.safeParse(await params); if (!parsed.success) notFound(); const { owner, repo } = parsed.data;
  const client = await getServerGitHubClient(); const summary = client ? await client.listPulls(owner, repo).catch(() => []) : [];
  const pulls = client ? await Promise.all(summary.map((pull) => client.getPull(owner, repo, pull.number).catch(() => pull))) : [];
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">{owner} / {repo}</span><h1>Pull requests</h1><p>Review actual GitHub data, then request clearly labeled AI suggestions.</p></div><span className="count-badge">{pulls.length} open</span></div><RepositoryTabs owner={owner} repo={repo} active="pulls" /><section className="panel"><div className="data-legend"><span className="badge">GitHub data</span><p>Titles, authors, status, and change counts come from GitHub. AI output is always labeled “Suggestion” and is never submitted automatically.</p></div><PullRequestList pulls={pulls} owner={owner} repo={repo} /></section></div>;
}
