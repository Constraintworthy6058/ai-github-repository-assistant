export function isSafeCallbackPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") && !value.includes("\0");
}

export function maskIdentifier(value?: string) {
  if (!value) return "Not set";
  return value.length <= 4 ? "••••" : `••••${value.slice(-4)}`;
}
