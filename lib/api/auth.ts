import { getSession } from "@/lib/auth/session";
import { getGitHubAccessToken } from "@/lib/auth/token";
import { GitHubClient } from "@/lib/github/client";

export async function requireGitHubClient() {
  const session = await getSession();
  if (!session) return { error: Response.json({ error: "Authentication required." }, { status: 401 }) } as const;
  const token = await getGitHubAccessToken(session.user.id);
  if (!token) return { error: Response.json({ error: "GitHub access is unavailable. Sign in again." }, { status: 401 }) } as const;
  return { session, client: new GitHubClient(token) } as const;
}
