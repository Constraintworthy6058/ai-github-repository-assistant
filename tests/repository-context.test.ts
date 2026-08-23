import { describe, expect, it } from "vitest";
import { isAnalyzableFile, rankFiles } from "@/lib/github/context";
import type { GitHubContent } from "@/lib/github/types";

function file(name: string): GitHubContent { return { name, path: name, sha: name, size: 100, type: "file", html_url: null, download_url: null }; }

describe("repository context selection", () => {
  it("accepts text source and rejects binary or oversized files", () => {
    expect(isAnalyzableFile("src/app.ts", 2000)).toBe(true);
    expect(isAnalyzableFile("logo.png", 2000)).toBe(false);
    expect(isAnalyzableFile("src/app.ts", 100001)).toBe(false);
  });
  it("prioritizes repository manifests and readmes", () => {
    const ranked = rankFiles([file("z.ts"), file("README.md"), file("package.json")]);
    expect(ranked.slice(0, 2).map((item) => item.name)).toEqual(["README.md", "package.json"]);
  });
});

