"use client";

import { useState } from "react";
import { GitBranch as Github, LoaderCircle } from "lucide-react";
import { createAuthClient } from "better-auth/react";
import { useRouter } from "next/navigation";

const authClient = createAuthClient();

export function GitHubSignIn({ label = "Sign in with GitHub" }: { label?: string }) {
  const [loading, setLoading] = useState(false);
  return <button className="button button-primary" disabled={loading} onClick={async () => { setLoading(true); await authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" }); setLoading(false); }}>{loading ? <LoaderCircle size={18} className="spin" /> : <Github size={18} />} {label}</button>;
}

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return <button className="button button-ghost button-small" disabled={loading} onClick={async () => { setLoading(true); await authClient.signOut(); router.push("/"); router.refresh(); }}>Sign out</button>;
}
