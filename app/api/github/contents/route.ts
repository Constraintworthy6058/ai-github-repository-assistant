import { requireGitHubClient } from "@/lib/api/auth";
import { githubErrorMessage } from "@/lib/github/errors";
import { pathSchema, repositoryParamsSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const auth = await requireGitHubClient();
  if ("error" in auth) return auth.error;
  const url = new URL(request.url);
  const repository = repositoryParamsSchema.safeParse({ owner: url.searchParams.get("owner"), repo: url.searchParams.get("repo") });
  const path = pathSchema.safeParse(url.searchParams.get("path") ?? "");
  if (!repository.success || !path.success) return Response.json({ error: "Invalid repository path." }, { status: 400 });
  try {
    const content = await auth.client.getContents(repository.data.owner, repository.data.repo, path.data);
    if (!Array.isArray(content) && content.type === "file" && content.content) {
      return Response.json({ content: { ...content, text: Buffer.from(content.content.replace(/\n/g, ""), "base64").toString("utf8"), content: undefined } });
    }
    return Response.json({ content });
  } catch (error) {
    return Response.json({ error: githubErrorMessage(error) }, { status: 502 });
  }
}
