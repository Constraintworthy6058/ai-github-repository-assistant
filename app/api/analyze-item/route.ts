import { getAIProvider, REPOSITORY_SYSTEM_PROMPT } from "@/lib/ai";
import { aiErrorMessage } from "@/lib/ai/errors";
import { requireGitHubClient } from "@/lib/api/auth";
import { itemAnalysisSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const auth = await requireGitHubClient();
  if ("error" in auth) return auth.error;
  const parsed = itemAnalysisSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid analysis request." }, { status: 400 });
  const { owner, repo, kind, action, number, sha, path } = parsed.data;
  try {
    let evidence = "";
    let sources: string[] = [];
    if (kind === "pull" && number) {
      const [pull, files] = await Promise.all([auth.client.getPull(owner, repo, number), auth.client.getPullFiles(owner, repo, number)]);
      sources = files.map((file) => file.filename);
      evidence = `Pull request #${number}: ${pull.title}\nBody: ${pull.body ?? "No body"}\nChanged files:\n${files.map((file) => `--- ${file.filename} (+${file.additions}/-${file.deletions}) ---\n${file.patch ?? "Patch unavailable"}`).join("\n")}`;
    } else if (kind === "issue" && number) {
      const issues = await auth.client.listIssues(owner, repo);
      const issue = issues.find((item) => item.number === number);
      if (!issue) return Response.json({ error: "Issue not found." }, { status: 404 });
      evidence = `Issue #${number}: ${issue.title}\nLabels: ${issue.labels.map((label) => label.name).join(", ") || "none"}\nBody: ${issue.body ?? "No body"}`;
    } else if (kind === "commit" && sha) {
      const commit = await auth.client.getCommit(owner, repo, sha);
      sources = commit.files?.map((file) => file.filename) ?? [];
      evidence = `Commit ${sha}: ${commit.commit.message}\n${commit.files?.map((file) => `--- ${file.filename} ---\n${file.patch ?? "Patch unavailable"}`).join("\n") ?? "No file data"}`;
    } else if (kind === "file" && path) {
      const file = await auth.client.getTextFile(owner, repo, path);
      sources = [path];
      evidence = `File ${path}:\n${file.text.slice(0, 60_000)}`;
    } else {
      return Response.json({ error: "The requested item identifier is missing." }, { status: 400 });
    }
    const result = await getAIProvider().complete({
      messages: [
        { role: "system", content: REPOSITORY_SYSTEM_PROMPT },
        { role: "user", content: `Repository: ${owner}/${repo}\nTask: ${action} this ${kind}. Clearly separate verified facts from suggestions. Never post or modify anything on GitHub.\n\n${evidence.slice(0, 90_000)}` },
      ],
    });
    return Response.json({ result, sources });
  } catch (error) {
    return Response.json({ error: aiErrorMessage(error) }, { status: 503 });
  }
}
