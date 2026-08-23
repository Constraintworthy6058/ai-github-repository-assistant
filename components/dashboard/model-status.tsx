"use client";

import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";

type Status = { available: boolean; modelAvailable: boolean; model: string; message: string };

export function ModelStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => { fetch("/api/ai/status").then((response) => response.json()).then(setStatus).catch(() => setStatus({ available: false, modelAvailable: false, model: "Ollama", message: "Ollama is not currently running." })); }, []);
  const healthy = status?.available && status.modelAvailable;
  return <div className="model-status" title={status?.message ?? "Checking Ollama status"}><span className={`status-dot ${status ? (healthy ? "online" : "offline") : "checking"}`} /><Cpu size={15} /><span>{status ? (healthy ? status.model : "AI offline") : "Checking AI"}</span></div>;
}
