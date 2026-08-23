import { afterEach, describe, expect, it, vi } from "vitest";

describe("GET /api/ai/status", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("returns a graceful offline status when Ollama is down", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const { GET } = await import("@/app/api/ai/status/route");
    const response = await GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ available: false, message: "Ollama is not currently running." });
  });
});
