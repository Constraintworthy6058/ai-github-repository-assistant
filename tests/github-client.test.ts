import { describe, expect, it, vi } from "vitest";
import { GitHubClient } from "@/lib/github/client";
import { GitHubApiError } from "@/lib/github/errors";

describe("GitHubClient", () => {
  it("sends the token only in a server request header", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    await new GitHubClient("secret-token", fetcher).listRepositories();
    const [, init] = fetcher.mock.calls[0];
    expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer secret-token");
    expect(fetcher.mock.calls[0][0]).not.toContain("secret-token");
  });

  it("encodes repository path segments", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    await new GitHubClient("token", fetcher).getContents("owner", "repo", "src/a file.ts");
    expect(fetcher.mock.calls[0][0]).toContain("src/a%20file.ts");
  });

  it("decodes base64 file content", async () => {
    const body = { name: "a.ts", path: "a.ts", sha: "1", size: 5, type: "file", html_url: null, download_url: null, encoding: "base64", content: Buffer.from("hello").toString("base64") };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));
    await expect(new GitHubClient("token", fetcher).getTextFile("owner", "repo", "a.ts")).resolves.toMatchObject({ text: "hello" });
  });

  it("filters pull requests from the issues endpoint", async () => {
    const rows = [{ number: 1, pull_request: {} }, { number: 2 }];
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(rows), { status: 200 }));
    const issues = await new GitHubClient("token", fetcher).listIssues("owner", "repo");
    expect(issues).toHaveLength(1);
    expect(issues[0].number).toBe(2);
  });

  it("preserves rate-limit metadata in errors", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ message: "rate limited" }), { status: 403, headers: { "x-ratelimit-remaining": "0", "x-ratelimit-reset": "123" } }));
    await expect(new GitHubClient("token", fetcher).listRepositories()).rejects.toMatchObject({ status: 403, rateLimitRemaining: "0" } satisfies Partial<GitHubApiError>);
  });
});
