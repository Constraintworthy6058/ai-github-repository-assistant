import { Bot, FileCode2 } from "lucide-react";

export function AIResult({ title = "AI-generated analysis", content, sources }: { title?: string; content: string; sources?: string[] }) {
  return <div className="ai-result"><div className="ai-result-label"><Bot size={16} /><strong>{title}</strong><span className="badge badge-ai">Suggestion</span></div><div className="ai-copy">{content.split("\n").map((line, index) => line.startsWith("#") ? <h3 key={index}>{line.replace(/^#+\s*/, "")}</h3> : line.startsWith("- ") ? <p className="bullet" key={index}>{line}</p> : line ? <p key={index}>{line}</p> : <br key={index} />)}</div>{sources && sources.length > 0 && <div className="source-list"><strong><FileCode2 size={15} /> Verified sources</strong>{sources.map((source) => <code key={source}>{source}</code>)}</div>}</div>;
}
