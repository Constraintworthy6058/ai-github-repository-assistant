import { prisma } from "@/lib/db/prisma";

export async function getGitHubAccessToken(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, providerId: "github" },
    select: { accessToken: true },
  });
  return account?.accessToken ?? null;
}
