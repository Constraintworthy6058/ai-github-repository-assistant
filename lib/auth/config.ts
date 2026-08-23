import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/prisma";
import { env, isGitHubAuthConfigured } from "@/lib/env";

export const auth = betterAuth({
  appName: "AI GitHub Repository Assistant",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.AUTH_SECRET ?? "development-only-placeholder-change-me-before-oauth",
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  socialProviders: isGitHubAuthConfigured
    ? {
        github: {
          clientId: env.GITHUB_CLIENT_ID!,
          clientSecret: env.GITHUB_CLIENT_SECRET!,
          scope: ["read:user", "user:email", "repo"],
        },
      }
    : {},
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  advanced: { useSecureCookies: process.env.NODE_ENV === "production" },
});
