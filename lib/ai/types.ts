export type AIMessage = { role: "system" | "user" | "assistant"; content: string };
export type AICompletionOptions = {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  signal?: AbortSignal;
  timeoutMs?: number;
  maxTokens?: number;
  contextWindow?: number;
};
export type AIHealth = { available: boolean; modelAvailable: boolean; model: string; message: string };

export interface AIProvider {
  readonly name: string;
  health(): Promise<AIHealth>;
  complete(options: AICompletionOptions): Promise<string>;
}
