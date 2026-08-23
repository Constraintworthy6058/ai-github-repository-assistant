import Link from "next/link";
import { Bot, CircleDot, Files, GitPullRequest, LayoutDashboard } from "lucide-react";

export function RepositoryTabs({ owner, repo, active }: { owner: string; repo: string; active: "overview" | "explorer" | "assistant" | "pulls" | "issues" }) {
  const base = `/repositories/${owner}/${repo}`;
  const links = [
    ["overview", "Overview", base, LayoutDashboard], ["explorer", "Explorer", `${base}?tab=explorer`, Files], ["assistant", "Assistant", `${base}/assistant`, Bot], ["pulls", "Pull requests", `${base}/pulls`, GitPullRequest], ["issues", "Issues", `${base}/issues`, CircleDot],
  ] as const;
  return <nav className="repo-tabs" aria-label="Repository navigation">{links.map(([key, label, href, Icon]) => <Link className={active === key ? "active" : ""} href={href} key={key}><Icon size={16} />{label}</Link>)}</nav>;
}
