import Link from "next/link";
import { ArrowLeft, CheckCircle2, GitBranch as Github, KeyRound, LockKeyhole, Terminal } from "lucide-react";
import { GitHubSignIn } from "@/components/auth/github-sign-in";
import { Logo } from "@/components/ui/logo";
import { isGitHubAuthConfigured } from "@/lib/env";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return <main className="login-page"><section className="login-story"><Link href="/"><Logo /></Link><div><span className="eyebrow"><LockKeyhole size={14} /> Private by design</span><h1>Your repository context belongs to you.</h1><p>Authenticate directly with GitHub. Analyze code locally with Ollama. Nothing is posted back without your explicit action.</p><ul><li><CheckCircle2 /> Server-only token handling</li><li><CheckCircle2 /> Local SQLite persistence</li><li><CheckCircle2 /> Read-only assistant workflow</li></ul></div><small>Open source · MIT licensed</small></section><section className="login-panel"><div className="login-card">{isGitHubAuthConfigured ? <><span className="login-icon"><Github /></span><h2>Welcome back</h2><p>Sign in to access repositories available to your GitHub account.</p><GitHubSignIn label="Continue with GitHub" /><span className="legal">By continuing, you authorize read access according to your OAuth app scopes.</span></> : <><span className="login-icon"><KeyRound /></span><h2>Finish local setup</h2><p>Create a GitHub OAuth app, then copy <code>.env.example</code> to <code>.env</code> and set:</p><div className="code-panel"><code>GITHUB_CLIENT_ID=...</code><code>GITHUB_CLIENT_SECRET=...</code><code>AUTH_SECRET=...</code></div><div className="callback"><small>Authorization callback URL</small><code>http://localhost:3000/api/auth/callback/github</code></div><Link className="button button-primary" href="https://github.com/settings/developers" target="_blank"><Github size={18} /> Open GitHub Developer Settings</Link><p className="hint"><Terminal size={15} /> Generate a secret with <code>npx auth@latest secret</code></p></>}<Link className="back-link" href="/"><ArrowLeft size={15} /> Back to home</Link></div></section></main>;
}
