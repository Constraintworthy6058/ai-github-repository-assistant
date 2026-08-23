import Link from "next/link";
import { ArrowRight, Bot, Braces, Check, CircleDot, GitBranch as Github, GitPullRequest, LockKeyhole, Search, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { GitHubSignIn } from "@/components/auth/github-sign-in";
import { isGitHubAuthConfigured } from "@/lib/env";

const features = [
  [Braces, "Repository analysis", "Map architecture, entry points, technologies, risks, tests, and important files."],
  [Bot, "AI code explanation", "Ask grounded questions and get answers that cite real files instead of inventing context."],
  [GitPullRequest, "PR review assistance", "Understand diffs, surface risky changes, and generate a focused review checklist."],
  [CircleDot, "Issue intelligence", "Summarize issues, suggest labels, identify likely files, and draft a response."],
  [LockKeyhole, "Local AI privacy", "Use Ollama on your machine. Repository context never needs a paid cloud AI provider."],
  [Search, "Developer-first workflow", "Browse trees, inspect files, search code, and review recent commits in one workspace."],
] as const;

export default function Home() {
  return <main className="landing"><nav className="landing-nav"><Logo /><div className="nav-links"><a href="#features">Features</a><a href="#privacy">Privacy</a><a href="https://github.com/Wadan3/ai-github-repository-assistant" target="_blank" rel="noreferrer">GitHub</a></div><div className="nav-actions"><ThemeSwitch /><Link href="/login" className="button button-ghost">Sign in</Link></div></nav>
    <section className="hero"><div className="hero-glow" /><div className="hero-copy"><span className="eyebrow"><Sparkles size={14} /> Open source · Local AI</span><h1>Understand repositories <span>at the speed of thought.</span></h1><p>Explore unfamiliar codebases, review pull requests, triage issues, and ask questions grounded in real repository files—with AI that runs privately on your machine.</p><div className="hero-actions">{isGitHubAuthConfigured ? <GitHubSignIn /> : <Link href="/login" className="button button-primary"><Github size={18} /> Set up GitHub <ArrowRight size={17} /></Link>}<a className="button button-secondary" href="https://github.com/Wadan3/ai-github-repository-assistant" target="_blank" rel="noreferrer">View GitHub repository</a></div><div className="trust-row"><span><Check size={15} /> Free & open source</span><span><Check size={15} /> No paid AI required</span><span><Check size={15} /> Read-only by default</span></div></div>
      <div className="product-preview" aria-label="Product preview"><div className="preview-bar"><span className="preview-dot red" /><span className="preview-dot amber" /><span className="preview-dot green" /><span className="preview-path">Wadan3 / ai-github-repository-assistant</span></div><div className="preview-body"><div className="preview-side"><span className="active">Overview</span><span>Explorer</span><span>Assistant</span><span>Pull requests</span><span>Issues</span></div><div className="preview-content"><span className="preview-kicker">REPOSITORY INTELLIGENCE</span><h3>Architecture at a glance</h3><p>Next.js App Router application with server-only GitHub access, Prisma persistence, and a provider-based local AI layer.</p><div className="preview-grid"><div><small>PRIMARY LANGUAGE</small><strong>TypeScript</strong></div><div><small>AI PROVIDER</small><strong><i /> Ollama ready</strong></div></div><div className="preview-answer"><Bot size={18} /><div><b>Suggested reading order</b><p><code>app/layout.tsx</code> → <code>lib/github/client.ts</code> → <code>lib/ai/ollama.ts</code></p></div></div></div></div></div>
    </section>
    <section className="proof-strip"><span>One workspace for</span><strong>Repository discovery</strong><i /><strong>Code understanding</strong><i /><strong>Review intelligence</strong><i /><strong>Private AI</strong></section>
    <section className="features" id="features"><div className="section-heading"><span className="eyebrow">A sharper way to read code</span><h2>Everything you need to get oriented—and get useful.</h2><p>Built for the moment you open a repository and need trustworthy answers, quickly.</p></div><div className="feature-grid">{features.map(([Icon, title, description]) => <article className="feature-card" key={title}><span className="feature-icon"><Icon size={21} /></span><h3>{title}</h3><p>{description}</p><span className="learn-link">Learn more <ArrowRight size={14} /></span></article>)}</div></section>
    <section className="privacy-banner" id="privacy"><div><span className="eyebrow"><LockKeyhole size={14} /> Privacy by architecture</span><h2>Your code stays close.</h2><p>With Ollama, repository context is processed on your own computer. GitHub credentials remain server-side, and the application never executes repository code.</p></div><div className="privacy-flow"><span>GitHub API</span><ArrowRight /><span>Your machine</span><ArrowRight /><span>Ollama</span></div></section>
    <footer><Logo /><p>Open source under the MIT License.</p><a href="https://github.com/Wadan3/ai-github-repository-assistant">GitHub <ArrowRight size={14} /></a></footer>
  </main>;
}
