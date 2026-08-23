import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return <main className="setup-page"><div className="setup-card"><span className="setup-icon"><FileQuestion /></span><h1>Repository not found</h1><p>It may not exist, your GitHub account may not have access, or the repository address is invalid.</p><Link href="/repositories" className="button button-primary">Back to repositories</Link></div></main>;
}
