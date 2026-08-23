import { GitCommitHorizontal } from "lucide-react";
import type { GitHubCommit } from "@/lib/github/types";
import { formatRelativeDate } from "@/lib/utils/format";
import { ItemAction } from "@/components/assistant/item-action";

export function CommitList({ commits, owner, repo }: { commits: GitHubCommit[]; owner: string; repo: string }) {
  return <div className="commit-list">{commits.map((commit) => <article key={commit.sha}>
    <span className="commit-icon"><GitCommitHorizontal size={16} /></span>
    <div><a href={commit.html_url} target="_blank" rel="noreferrer">{commit.commit.message.split("\n")[0]}</a><p>{commit.author?.login ?? commit.commit.author?.name ?? "Unknown"} committed {commit.commit.author?.date ? formatRelativeDate(commit.commit.author.date) : "recently"} · <code>{commit.sha.slice(0, 7)}</code></p></div>
    <div className="row-actions"><ItemAction owner={owner} repo={repo} kind="commit" sha={commit.sha} action="summarize" label="Summarize" /><ItemAction owner={owner} repo={repo} kind="commit" sha={commit.sha} action="explain" label="Explain" /><ItemAction owner={owner} repo={repo} kind="commit" sha={commit.sha} action="risks" label="Check risks" /></div>
  </article>)}</div>;
}
