"use client";

import { FormEvent, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import type { CodeSearchItem } from "@/lib/github/types";

export function CodeSearch({ owner, repo }: { owner: string; repo: string }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CodeSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    const response = await fetch(`/api/github/search?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&q=${encodeURIComponent(query)}`);
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setError(data.error);
    setItems(data.items ?? []);
  }
  return <section className="search-card"><div><h3>Search repository code</h3><p>Uses GitHub code search and shows matching context.</p></div><form onSubmit={submit} className="code-search-form"><label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search symbols, functions, or text" /></label><button className="button button-secondary" disabled={loading || query.trim().length < 2}>{loading ? "Searching…" : "Search"}</button></form>{error && <p className="error-message">{error}</p>}{!loading && query && !error && !items.length && <p className="empty-inline">No matching code found.</p>}{items.length > 0 && <div className="search-results">{items.map((item) => <a href={item.html_url} target="_blank" rel="noreferrer" key={`${item.path}-${item.html_url}`}><div><strong>{item.path}</strong><small>{item.repository.full_name}</small>{item.text_matches?.[0]?.fragment && <pre>{item.text_matches[0].fragment}</pre>}</div><ExternalLink size={15} /></a>)}</div>}</section>;
}
