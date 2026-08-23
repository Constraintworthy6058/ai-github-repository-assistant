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
    return Response.json({ pulls: await auth.client.listPulls(parsed.data.owner, parsed.data.repo) });
  } catch (error) {
    return Response.json({ error: githubErrorMessage(error) }, { status: 502 });
  }
}
