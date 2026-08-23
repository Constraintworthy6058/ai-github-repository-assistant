"use client";

import { useState } from "react";
import { Code2, LoaderCircle, X } from "lucide-react";
import { AIResult } from "@/components/assistant/ai-result";

export function SelectedCodeAction({ owner, repo, path }: { owner: string; repo: string; path: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function run() {
    const selectedCode = window.getSelection()?.toString().trim() ?? "";
    setOpen(true);
    if (!selectedCode) { setError("Select a code fragment in the viewer first, then choose this action again."); return; }
    if (selectedCode.length > 20_000) { setError("The selection is too large. Select 20,000 characters or fewer."); return; }
    setLoading(true); setError("");
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, repo, filePath: path, selectedCode, question: "Explain the selected code, including its purpose, control flow, inputs, outputs, side effects, and any important edge cases." }),
    });
    const data = await response.json(); setLoading(false);
    if (!response.ok) setError(data.error); else setResult(data.answer);
  }

  return <><button className="button button-small button-secondary" onClick={run}><Code2 size={14} />Explain selected code</button>{open && <div className="modal-backdrop" onMouseDown={() => setOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-label="Selected code explanation" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close icon-button" onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>{loading ? <div className="modal-loading"><LoaderCircle className="spin" /><p>Explaining the selected code with local AI…</p></div> : error ? <p className="error-message">{error}</p> : <AIResult title="Selected code explanation" content={result} sources={[path]} />}</section></div>}</>;
}
