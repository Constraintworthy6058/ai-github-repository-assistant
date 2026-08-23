import Link from "next/link";
import { GitBranch } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="AI GitHub Repository Assistant home">
      <span className="logo-mark"><GitBranch size={19} strokeWidth={2.2} /></span>
      {!compact && <span>Repo<span className="logo-accent">Lens</span><sup>AI</sup></span>}
    </Link>
  );
}
