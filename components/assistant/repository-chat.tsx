"use client";

import { FormEvent, useState } from "react";
import { ArrowUp, Bot, FileCode2, Sparkles, User } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string; sources?: string[] };
const starters = ["What does this repository do?", "Explain the authentication architecture.", "Which files should I read first?", "Find possible bugs or risky areas."];

export function RepositoryChat({ owner, repo }: { owner: string; repo: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  async function ask(value = question) {
    const trimmed = value.trim(); if (!trimmed || loading) return;
    setMessages((current) => [...current, { role: "user", content: trimmed }]); setQuestion(""); setLoading(true);
    const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ owner, repo, question: trimmed }) });
    const data = await response.json(); setLoading(false);
    setMessages((current) => [...current, { role: "assistant", content: response.ok ? data.answer : data.error, sources: data.sources }]);
  }
  return <div className="chat-layout"><div className="chat-main"><div className="chat-heading"><span className="feature-icon"><Bot size={21} /></span><div><h2>Ask about {repo}</h2><p>Answers are grounded in verified repository files.</p></div></div><div className="messages" aria-live="polite">{!messages.length && <div className="chat-welcome"><Sparkles size={26} /><h3>Start with a question</h3><p>I’ll inspect a bounded set of relevant files and cite the ones used.</p></div>}{messages.map((message, index) => <div className={`message ${message.role}`} key={index}><span className="message-avatar">{message.role === "user" ? <User size={16} /> : <Bot size={16} />}</span><div><strong>{message.role === "user" ? "You" : "RepoLens AI"}</strong><div className="message-copy">{message.content.split("\n").map((line, lineIndex) => <p key={lineIndex}>{line || "\u00a0"}</p>)}</div>{message.sources && message.sources.length > 0 && <div className="message-sources"><span><FileCode2 size={14} /> Sources</span>{message.sources.map((source) => <code key={source}>{source}</code>)}</div>}</div></div>)}{loading && <div className="message assistant"><span className="message-avatar"><Bot size={16} /></span><div><strong>RepoLens AI</strong><div className="thinking"><i /><i /><i /></div></div></div>}</div><form className="chat-composer" onSubmit={(event: FormEvent) => { event.preventDefault(); ask(); }}><textarea value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(); } }} placeholder={`Ask a question about ${owner}/${repo}…`} maxLength={4000} /><button aria-label="Send question" disabled={loading || question.trim().length < 2}><ArrowUp size={18} /></button><small>Enter to send · Shift + Enter for a new line</small></form></div><aside className="prompt-sidebar"><h3>Suggested questions</h3>{starters.map((starter) => <button onClick={() => ask(starter)} key={starter}>{starter}</button>)}<div className="privacy-note large"><span className="status-dot online" /><div><strong>Local processing</strong><small>Context is sent only to your configured Ollama instance.</small></div></div></aside></div>;
}
