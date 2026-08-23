import { z } from "zod";

export const repositoryParamsSchema = z.object({
  owner: z.string().regex(/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/, "Invalid repository owner"),
  repo: z.string().regex(/^[A-Za-z0-9._-]{1,100}$/, "Invalid repository name"),
});

export const pathSchema = z.string().max(500).refine((path) => !path.includes("..") && !path.startsWith("/"), "Invalid path");

export const assistantRequestSchema = repositoryParamsSchema.extend({
  question: z.string().trim().min(2).max(4000),
  filePath: pathSchema.optional(),
  selectedCode: z.string().max(20_000).optional(),
});

export const searchRequestSchema = repositoryParamsSchema.extend({ query: z.string().trim().min(2).max(200) });

export const itemAnalysisSchema = repositoryParamsSchema.extend({
  kind: z.enum(["pull", "issue", "commit", "file"]),
  action: z.enum(["summarize", "explain", "risks", "bugs", "improvements", "checklist", "review-comments", "categorize", "labels", "plan", "related-files", "draft-response"]),
  number: z.number().int().positive().optional(),
  sha: z.string().regex(/^[a-f0-9]{7,40}$/i).optional(),
  path: pathSchema.optional(),
});

export function safeJsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
