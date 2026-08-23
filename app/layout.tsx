import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "RepoLens AI — Understand repositories faster", template: "%s · RepoLens AI" },
  description: "A privacy-first, local AI assistant for understanding GitHub repositories, pull requests, issues, commits, and source code.",
  metadataBase: new URL(process.env.BETTER_AUTH_URL ?? "http://localhost:3000"),
  openGraph: { title: "RepoLens AI", description: "Understand repositories faster with private, local AI.", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "RepoLens AI — Understand repositories faster with private, local AI." }] },
  twitter: { card: "summary_large_image", title: "RepoLens AI", description: "Understand repositories faster with private, local AI.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`${inter.variable} ${mono.variable}`}>{children}</body></html>;
}
