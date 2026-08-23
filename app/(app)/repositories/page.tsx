import { BookOpen } from "lucide-react";
import { RepositoryList } from "@/components/repositories/repository-list";
import { EmptyState } from "@/components/ui/empty-state";
import { getServerGitHubClient } from "@/lib/github/server";

export const metadata = { title: "Repositories" };

export default async function RepositoriesPage() {
  const client = await getServerGitHubClient();
  const repositories = client ? await client.listRepositories(1, 100).catch(() => []) : [];
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">GitHub workspace</span><h1>Repositories</h1><p>Select a repository to explore its source, activity, issues, and pull requests.</p></div><span className="count-badge">{repositories.length} loaded</span></div><section className="panel repository-panel">{repositories.length ? <RepositoryList repositories={repositories} /> : <EmptyState icon={<BookOpen />} title="No repositories available" description="Confirm your GitHub OAuth app requests repository access, then sign in again." />}</section></div>;
}
