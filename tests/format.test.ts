import { describe, expect, it } from "vitest";
import { formatCompactNumber, formatRelativeDate, getLanguageFromPath } from "@/lib/utils/format";

describe("format utilities", () => {
  it("formats compact counts", () => expect(formatCompactNumber(12500)).toMatch(/12\.5K/i));
  it("formats relative dates deterministically", () => expect(formatRelativeDate("2026-08-22T12:00:00Z", new Date("2026-08-23T12:00:00Z"))).toBe("yesterday"));
  it("recognizes common source languages", () => {
    expect(getLanguageFromPath("app/page.tsx")).toBe("TSX");
    expect(getLanguageFromPath("README.unknown")).toBe("Plain text");
  });
});
