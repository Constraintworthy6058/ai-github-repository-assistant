import { z } from "zod";

const optionalString = z.preprocess((value) => value || undefined, z.string().optional());

const envSchema = z.object({
  DATABASE_URL: z.string().default("file:./dev.db"),
  GITHUB_CLIENT_ID: optionalString,
  GITHUB_CLIENT_SECRET: optionalString,
  AUTH_SECRET: optionalString,
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  OLLAMA_BASE_URL: z.string().url().default("http://localhost:11434"),
  OLLAMA_MODEL: z.string().default("qwen2.5:3b"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  OLLAMA_MODEL: process.env.OLLAMA_MODEL,
});

export const isGitHubAuthConfigured = Boolean(
  env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.AUTH_SECRET,
);
