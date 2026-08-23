import { env } from "@/lib/env";
import { OllamaProvider } from "@/lib/ai/ollama";

export function getAIProvider() {
  return new OllamaProvider(env.OLLAMA_BASE_URL, env.OLLAMA_MODEL);
}

export const REPOSITORY_SYSTEM_PROMPT = `You are a careful repository analyst. Use only the repository context supplied by the user.
Never invent file names, code, dependencies, behavior, tests, or architecture. If evidence is missing, say so.
When making a claim about code, cite one or more verified file paths using inline backticks.
End with a Sources section containing only files that were actually supplied. Keep advice clearly labeled as suggestion.`;

export function buildAnalysisPrompt(repository: string, files: string[], context: string) {
  return `Analyze ${repository} using the verified files below.

Return these sections: Repository Summary, Architecture, Main Technologies, Entry Points, Important Files, Possible Risks, Code Quality Observations, Testing Status, Documentation Quality, Suggested Improvements.

Verified paths:\n${files.map((file) => `- ${file}`).join("\n")}

Repository context:\n${context}`;
}
