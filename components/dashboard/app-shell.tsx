import Image from "next/image";
import Link from "next/link";
import { Bot, CircleDot, FolderGit2, Gauge, GitPullRequest, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { ModelStatus } from "@/components/dashboard/model-status";
import { SignOutButton } from "@/components/auth/github-sign-in";

const navigation = [
  ["Dashboard", "/dashboard", Gauge], ["Repositories", "/repositories", FolderGit2], ["AI Assistant", "/repositories", Bot], ["Pull Requests", "/repositories", GitPullRequest], ["Issues", "/repositories", CircleDot], ["Settings", "/settings", Settings],
] as const;

export function AppShell({ children, user, selectedRepository }: { children: ReactNode; user: { name: string; image?: string | null; email: string }; selectedRepository?: string }) {
  return <div className="app-shell">
    <aside className="sidebar"><div className="sidebar-brand"><Logo /></div><nav aria-label="Main navigation">{navigation.map(([label, href, Icon]) => <Link href={href} key={label}><Icon size={18} /><span>{label}</span></Link>)}</nav><div className="privacy-note"><span className="status-dot online" /><div><strong>Local AI privacy</strong><small>Code stays on your machine</small></div></div></aside>
    <div className="app-column"><header className="app-header"><div className="mobile-logo"><Logo compact /></div><div className="repo-crumb"><span>Repository</span><strong>{selectedRepository ?? "Choose a repository"}</strong></div><div className="header-actions"><ModelStatus /><ThemeSwitch /><div className="account"><Image src={user.image ?? `https://github.com/identicons/${encodeURIComponent(user.email)}.png`} alt="" width={32} height={32} /><span>{user.name}</span><SignOutButton /></div></div></header><main className="app-main">{children}</main></div>
  </div>;
}
