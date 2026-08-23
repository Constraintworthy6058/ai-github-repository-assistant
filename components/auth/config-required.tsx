import Link from "next/link";
import { CircleAlert, KeyRound } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function ConfigRequired() {
  return <main className="setup-page"><div className="setup-card"><Logo /><span className="setup-icon"><KeyRound /></span><span className="eyebrow"><CircleAlert size={14} /> Setup needed</span><h1>Connect your GitHub OAuth app</h1><p>This installation is healthy, but GitHub sign-in is not configured yet. Add the three values below to <code>.env</code>, then restart the app.</p><div className="env-list"><code>GITHUB_CLIENT_ID</code><code>GITHUB_CLIENT_SECRET</code><code>AUTH_SECRET</code></div><p className="muted">Your GitHub token is stored only in the server-side database and is never sent to browser code.</p><Link className="button button-secondary" href="/login">View setup instructions</Link></div></main>;
}
