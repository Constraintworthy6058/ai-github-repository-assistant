import { notFound } from "next/navigation";
import { RepositoryChat } from "@/components/assistant/repository-chat";
import { RepositoryTabs } from "@/components/repositories/repository-tabs";
import { repositoryParamsSchema } from "@/lib/validation";

export default async function AssistantPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const parsed = repositoryParamsSchema.safeParse(await params); if (!parsed.success) notFound(); const { owner, repo } = parsed.data;
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">{owner} / {repo}</span><h1>Repository assistant</h1><p>Ask questions grounded in verified source files from this repository.</p></div></div><RepositoryTabs owner={owner} repo={repo} active="assistant" /><RepositoryChat owner={owner} repo={repo} /></div>;
}
