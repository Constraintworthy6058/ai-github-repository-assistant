"use client";

import { useEffect } from "react";
import { CircleAlert } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("A page failed to render", error.digest); }, [error]);
  return <main className="setup-page"><div className="setup-card"><span className="setup-icon"><CircleAlert /></span><h1>Something went wrong</h1><p>The request could not be completed. No secrets or internal stack trace have been displayed.</p><button className="button button-primary" onClick={reset}>Try again</button></div></main>;
}
