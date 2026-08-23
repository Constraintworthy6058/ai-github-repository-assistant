"use client";

import { useState } from "react";
import { LoaderCircle, Sparkles, X } from "lucide-react";
import { AIResult } from "@/components/assistant/ai-result";

type Props = { owner: string; repo: string; kind: "pull" | "issue" | "commit" | "file"; action: string; number?: number; sha?: string; path?: string; label: string };

export function ItemAction(props: Props) {
  const [open, setOpen] = useState(false); const [loading, setLoading] = useState(false); const [result, setResult] = useState(""); const [sources, setSources] = useState<string[]>([]); const [error, setError] = useState("");
  async function run() {
    setOpen(true); setLoading(true); setError("");
    const response = await fetch("/api/analyze-item", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(props) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setError(data.error); setResult(data.result); setSources(data.sources ?? []);
  }
  return <><button className="button button-small button-secondary" onClick={run}><Sparkles size={14} />{props.label}</button>{open && <div className="modal-backdrop" onMouseDown={() => setOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-label={`${props.label} result`} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close icon-button" onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>{loading ? <div className="modal-loading"><LoaderCircle className="spin" /><p>Analyzing verified GitHub data with local AI…</p></div> : error ? <p className="error-message">{error}</p> : <AIResult title={props.label} content={result} sources={sources} />}</section></div>}</>;
}
