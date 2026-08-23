import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/dashboard/app-shell";
import { ConfigRequired } from "@/components/auth/config-required";
import { getSession } from "@/lib/auth/session";
import { isGitHubAuthConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  if (!isGitHubAuthConfigured) return <ConfigRequired />;
  const session = await getSession();
  if (!session) redirect("/login");
  return <AppShell user={session.user}>{children}</AppShell>;
}
