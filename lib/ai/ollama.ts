import { AIProviderError } from "@/lib/ai/errors";
import type { AICompletionOptions, AIHealth, AIProvider } from "@/lib/ai/types";

type Fetcher = typeof fetch;

export class OllamaProvider implements AIProvider {
  readonly name = "Ollama";

  constructor(
    private readonly baseUrl: string,
    private readonly defaultModel: string,
    private readonly fetcher: Fetcher = fetch,
  ) {}

  async health(): Promise<AIHealth> {
    try {
      const response = await this.fetcher(`${this.baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000), cache: "no-store" });
      if (!response.ok) throw new Error("health request failed");
      const data = (await response.json()) as { models?: Array<{ name: string; model?: string }> };
      const modelAvailable = Boolean(data.models?.some((item) => item.name === this.defaultModel || item.model === this.defaultModel));
      return {
        available: true,
        modelAvailable,
        model: this.defaultModel,
        message: modelAvailable ? `${this.defaultModel} is ready.` : `Ollama is running, but ${this.defaultModel} is not installed.`,
      };
    } catch {
      return { available: false, modelAvailable: false, model: this.defaultModel, message: "Ollama is not currently running." };
    }
  }

  async complete(options: AICompletionOptions) {
    let response: Response;
    try {
      response = await this.fetcher(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: options.model ?? this.defaultModel,
          messages: options.messages,
          stream: false,
          options: {
            temperature: options.temperature ?? 0.2,
            ...(options.maxTokens ? { num_predict: options.maxTokens } : {}),
            ...(options.contextWindow ? { num_ctx: options.contextWindow } : {}),
          },
        }),
        signal: options.signal ?? AbortSignal.timeout(options.timeoutMs ?? 120_000),
        cache: "no-store",
      });
    } catch (error) {
      if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) throw new AIProviderError("The AI request timed out.", "TIMEOUT");
      throw new AIProviderError("Ollama is not currently running.", "UNAVAILABLE");
    }
    if (!response.ok) {
      const detail = (await response.json().catch(() => ({}))) as { error?: string };
      if (response.status === 404 || detail.error?.includes("not found")) {
        throw new AIProviderError(`The model ${options.model ?? this.defaultModel} is not installed.`, "MODEL_MISSING");
      }
      throw new AIProviderError("Ollama could not complete the request.", "INVALID_RESPONSE");
    }
    const data = (await response.json()) as { message?: { content?: string } };
    if (!data.message?.content) throw new AIProviderError("Ollama returned an empty response.", "INVALID_RESPONSE");
    return data.message.content;
  }
}
