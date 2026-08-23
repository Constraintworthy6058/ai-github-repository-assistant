import { requireGitHubClient } from "@/lib/api/auth";
import { githubErrorMessage } from "@/lib/github/errors";

export async function GET() {
  const auth = await requireGitHubClient();
  if ("error" in auth) return auth.error;
  try {
    return Response.json({ repositories: await auth.client.listRepositories() });
  } catch (error) {
    return Response.json({ error: githubErrorMessage(error) }, { status: 502 });
  }
}
