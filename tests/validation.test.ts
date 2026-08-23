import { describe, expect, it } from "vitest";
import { assistantRequestSchema, pathSchema, repositoryParamsSchema, searchRequestSchema } from "@/lib/validation";

describe("request validation", () => {
  it("accepts valid repository names", () => expect(repositoryParamsSchema.safeParse({ owner: "openai", repo: "codex" }).success).toBe(true));
  it("rejects traversal paths", () => expect(pathSchema.safeParse("../../.env").success).toBe(false));
  it("rejects invalid owners", () => expect(repositoryParamsSchema.safeParse({ owner: "bad owner!", repo: "repo" }).success).toBe(false));
  it("bounds assistant questions", () => expect(assistantRequestSchema.safeParse({ owner: "openai", repo: "codex", question: "x".repeat(4001) }).success).toBe(false));
  it("requires useful search queries", () => expect(searchRequestSchema.safeParse({ owner: "openai", repo: "codex", query: "x" }).success).toBe(false));
});
