import { requireGitHubClient } from "@/lib/api/auth";
import { githubErrorMessage } from "@/lib/github/errors";
import { repositoryParamsSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const auth = await requireGitHubClient();
  if ("error" in auth) return auth.error;
  const url = new URL(request.url);
  const parsed = repositoryParamsSchema.safeParse({ owner: url.searchParams.get("owner"), repo: url.searchParams.get("repo") });
  if (!parsed.success) return Response.json({ error: "Invalid repository." }, { status: 400 });
  try {
    const [repository, commits, pulls, issues] = await Promise.all([
      auth.client.getRepository(parsed.data.owner, parsed.data.repo),
      auth.client.listCommits(parsed.data.owner, parsed.data.repo),
      auth.client.listPulls(parsed.data.owner, parsed.data.repo),
      auth.client.listIssues(parsed.data.owner, parsed.data.repo),
    ]);
    return Response.json({ repository, commits, pulls, issues });
  } catch (error) {
    return Response.json({ error: githubErrorMessage(error) }, { status: 502 });
  }
}
