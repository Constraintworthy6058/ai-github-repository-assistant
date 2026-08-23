import { GitPullRequest, GitCommitHorizontal, Plus, Minus, User } from "lucide-react";
import type { GitHubPull } from "@/lib/github/types";
import { formatRelativeDate } from "@/lib/utils/format";
import { ItemAction } from "@/components/assistant/item-action";

export function PullRequestList({ pulls, owner, repo }: { pulls: GitHubPull[]; owner: string; repo: string }) {
  if (!pulls.length) return <div className="empty-state"><GitPullRequest /><h3>No open pull requests</h3><p>This repository has no open pull requests right now.</p></div>;
  return <div className="issue-list">{pulls.map((pull) => <article className="issue-row" key={pull.number}>
    <span className="issue-state pull"><GitPullRequest size={18} /></span>
    <div className="issue-content"><div className="issue-title"><a href={pull.html_url} target="_blank" rel="noreferrer">{pull.title}</a>{pull.draft && <span className="badge">Draft</span>}</div><p>#{pull.number} opened {formatRelativeDate(pull.created_at)} by {pull.user?.login ?? "unknown"}</p>
      <div className="actual-data"><span><User size={13} /> {pull.user?.login ?? "unknown"}</span>{typeof pull.changed_files === "number" && <span><GitCommitHorizontal size={13} /> {pull.changed_files} files</span>}{typeof pull.additions === "number" && <span className="addition"><Plus size={13} />{pull.additions}</span>}{typeof pull.deletions === "number" && <span className="deletion"><Minus size={13} />{pull.deletions}</span>}</div>
      <div className="row-actions"><ItemAction owner={owner} repo={repo} kind="pull" number={pull.number} action="summarize" label="Summarize" /><ItemAction owner={owner} repo={repo} kind="pull" number={pull.number} action="explain" label="Explain changes" /><ItemAction owner={owner} repo={repo} kind="pull" number={pull.number} action="risks" label="Find risks" /><ItemAction owner={owner} repo={repo} kind="pull" number={pull.number} action="bugs" label="Find bugs" /><ItemAction owner={owner} repo={repo} kind="pull" number={pull.number} action="review-comments" label="Review comments" /><ItemAction owner={owner} repo={repo} kind="pull" number={pull.number} action="checklist" label="Review checklist" /></div>
    </div>
  </article>)}</div>;
}
