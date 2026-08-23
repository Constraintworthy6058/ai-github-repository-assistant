import { getSession } from "@/lib/auth/session";
import { getGitHubAccessToken } from "@/lib/auth/token";
import { GitHubClient } from "@/lib/github/client";

export async function getServerGitHubClient() {
  const session = await getSession();
  if (!session) return null;
  const token = await getGitHubAccessToken(session.user.id);
  return token ? new GitHubClient(token) : null;
}
