import { requireGitHubClient } from "@/lib/api/auth";
import { githubErrorMessage } from "@/lib/github/errors";
import { searchRequestSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const auth = await requireGitHubClient();
  if ("error" in auth) return auth.error;
  const url = new URL(request.url);
  const parsed = searchRequestSchema.safeParse({ owner: url.searchParams.get("owner"), repo: url.searchParams.get("repo"), query: url.searchParams.get("q") });
  if (!parsed.success) return Response.json({ error: "Enter at least two characters to search." }, { status: 400 });
  try {
    return Response.json(await auth.client.searchCode(parsed.data.owner, parsed.data.repo, parsed.data.query));
  } catch (error) {
    return Response.json({ error: githubErrorMessage(error) }, { status: 502 });
  }
}
