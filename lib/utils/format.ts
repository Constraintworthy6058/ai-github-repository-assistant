export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatRelativeDate(value: string | Date, now = new Date()) {
  const date = new Date(value);
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const divisions: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [60, "second"], [60, "minute"], [24, "hour"], [7, "day"], [4.345, "week"], [12, "month"], [Number.POSITIVE_INFINITY, "year"],
  ];
  let duration = seconds;
  for (const [amount, unit] of divisions) {
    if (Math.abs(duration) < amount) return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(Math.round(duration), unit);
    duration /= amount;
  }
  return date.toLocaleDateString();
}

export function getLanguageFromPath(path: string) {
  const extension = path.split(".").pop()?.toLowerCase();
  const languages: Record<string, string> = { ts: "TypeScript", tsx: "TSX", js: "JavaScript", jsx: "JSX", py: "Python", go: "Go", rs: "Rust", java: "Java", css: "CSS", html: "HTML", md: "Markdown", json: "JSON", yml: "YAML", yaml: "YAML", prisma: "Prisma", sql: "SQL", sh: "Shell" };
  return languages[extension ?? ""] ?? "Plain text";
}
