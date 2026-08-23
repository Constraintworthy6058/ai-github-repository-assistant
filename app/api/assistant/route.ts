import { getAIProvider, REPOSITORY_SYSTEM_PROMPT } from "@/lib/ai";
import { aiErrorMessage } from "@/lib/ai/errors";
import { requireGitHubClient } from "@/lib/api/auth";
import { collectRepositoryContext } from "@/lib/github/context";
import { assistantRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const auth = await requireGitHubClient();
  if ("error" in auth) return auth.error;
  const parsed = assistantRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid assistant request." }, { status: 400 });
  const { owner, repo, question, filePath, selectedCode } = parsed.data;
  try {
    let files: string[];
    let context: string;
    if (filePath) {
      const file = await auth.client.getTextFile(owner, repo, filePath);
      files = [filePath];
      context = `--- FILE: ${filePath} ---\n${file.text.slice(0, 60_000)}`;
    } else {
      ({ files, context } = await collectRepositoryContext(auth.client, owner, repo));
    }
    const answer = await getAIProvider().complete({
      messages: [
        { role: "system", content: REPOSITORY_SYSTEM_PROMPT },
        { role: "user", content: `Repository: ${owner}/${repo}\nQuestion: ${question}\n${selectedCode ? `Selected code:\n${selectedCode}\n` : ""}Verified context:\n${context}` },
      ],
    });
    return Response.json({ answer, sources: files });
  } catch (error) {
    return Response.json({ error: aiErrorMessage(error) }, { status: 503 });
  }
}
