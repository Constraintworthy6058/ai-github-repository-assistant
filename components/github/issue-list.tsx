import { CircleDot, MessageSquare, Tag } from "lucide-react";
import type { GitHubIssue } from "@/lib/github/types";
import { formatRelativeDate } from "@/lib/utils/format";
import { ItemAction } from "@/components/assistant/item-action";

export function IssueList({ issues, owner, repo }: { issues: GitHubIssue[]; owner: string; repo: string }) {
  if (!issues.length) return <div className="empty-state"><CircleDot /><h3>No open issues</h3><p>This repository has no open issues right now.</p></div>;
  return <div className="issue-list">{issues.map((issue) => <article className="issue-row" key={issue.number}>
    <span className="issue-state"><CircleDot size={18} /></span>
    <div className="issue-content"><div className="issue-title"><a href={issue.html_url} target="_blank" rel="noreferrer">{issue.title}</a></div><p>#{issue.number} opened {formatRelativeDate(issue.created_at)} by {issue.user?.login ?? "unknown"} · <MessageSquare size={13} /> {issue.comments}</p>
      {issue.labels.length > 0 && <div className="labels"><Tag size={13} />{issue.labels.map((label) => <span key={label.name}>{label.name}</span>)}</div>}
      <div className="row-actions"><ItemAction owner={owner} repo={repo} kind="issue" number={issue.number} action="summarize" label="Summarize" /><ItemAction owner={owner} repo={repo} kind="issue" number={issue.number} action="categorize" label="Categorize" /><ItemAction owner={owner} repo={repo} kind="issue" number={issue.number} action="labels" label="Suggest labels" /><ItemAction owner={owner} repo={repo} kind="issue" number={issue.number} action="plan" label="Implementation plan" /><ItemAction owner={owner} repo={repo} kind="issue" number={issue.number} action="related-files" label="Related files" /><ItemAction owner={owner} repo={repo} kind="issue" number={issue.number} action="draft-response" label="Draft response" /></div>
    </div>
  </article>)}</div>;
}
