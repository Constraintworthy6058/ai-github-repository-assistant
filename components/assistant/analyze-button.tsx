"use client";

import { useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import { AIResult } from "@/components/assistant/ai-result";

export function AnalyzeRepositoryButton({ owner, repo }: { owner: string; repo: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [error, setError] = useState("");
  async function analyze() {
    setLoading(true); setError(""); setResult("");
    const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ owner, repo }) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setError(data.error);
    setResult(data.result); setSources(data.sources);
  }
  return <><button className="button button-primary" onClick={analyze} disabled={loading}>{loading ? <LoaderCircle className="spin" size={17} /> : <Sparkles size={17} />}{loading ? "Analyzing verified files…" : "Analyze repository"}</button>{error && <p className="error-message">{error}</p>}{result && <AIResult content={result} sources={sources} />}</>;
}
