export class AIProviderError extends Error {
  constructor(message: string, public readonly code: "UNAVAILABLE" | "MODEL_MISSING" | "INVALID_RESPONSE" | "TIMEOUT") {
    super(message);
    this.name = "AIProviderError";
  }
}

export function aiErrorMessage(error: unknown) {
  if (error instanceof AIProviderError) return error.message;
  return "The AI provider could not complete this request.";
}
