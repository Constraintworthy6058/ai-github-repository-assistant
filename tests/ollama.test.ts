import { describe, expect, it, vi } from "vitest";
import { OllamaProvider } from "@/lib/ai/ollama";

describe("OllamaProvider", () => {
  it("reports unavailable without throwing", async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error("offline"));
    await expect(new OllamaProvider("http://localhost:11434", "qwen2.5:3b", fetcher).health()).resolves.toMatchObject({ available: false, message: "Ollama is not currently running." });
  });

  it("detects an installed model", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ models: [{ name: "qwen2.5:3b" }] }), { status: 200 }));
    await expect(new OllamaProvider("http://localhost:11434", "qwen2.5:3b", fetcher).health()).resolves.toMatchObject({ available: true, modelAvailable: true });
  });

  it("sends non-streaming chat requests and returns content", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ message: { content: "Grounded answer" } }), { status: 200 }));
    const result = await new OllamaProvider("http://localhost:11434", "qwen2.5:3b", fetcher).complete({ messages: [{ role: "user", content: "Explain" }] });
    expect(result).toBe("Grounded answer");
    expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toMatchObject({ stream: false, model: "qwen2.5:3b" });
  });

  it("returns a useful model-missing error", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ error: "model not found" }), { status: 404 }));
    await expect(new OllamaProvider("http://localhost:11434", "missing", fetcher).complete({ messages: [] })).rejects.toThrow("not installed");
  });
});
