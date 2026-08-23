import { buildAnalysisPrompt, getAIProvider, REPOSITORY_SYSTEM_PROMPT } from "@/lib/ai";
import { aiErrorMessage } from "@/lib/ai/errors";
import { requireGitHubClient } from "@/lib/api/auth";
import { collectRepositoryContext } from "@/lib/github/context";
import { repositoryParamsSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const auth = await requireGitHubClient();
  if ("error" in auth) return auth.error;
  const parsed = repositoryParamsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid repository." }, { status: 400 });
  try {
    const { files, context } = await collectRepositoryContext(auth.client, parsed.data.owner, parsed.data.repo);
    if (!files.length) return Response.json({ error: "No analyzable repository files were found." }, { status: 422 });
    const result = await getAIProvider().complete({
      messages: [
        { role: "system", content: REPOSITORY_SYSTEM_PROMPT },
        { role: "user", content: buildAnalysisPrompt(`${parsed.data.owner}/${parsed.data.repo}`, files, context) },
      ],
    });
    await import("@/lib/db/prisma").then(({ prisma }) =>
      prisma.analysis.create({ data: { userId: auth.session.user.id, repository: `${parsed.data.owner}/${parsed.data.repo}`, kind: "repository", result } }),
    );
    return Response.json({ result, sources: files });
  } catch (error) {
    return Response.json({ error: aiErrorMessage(error) }, { status: 503 });
  }
}
