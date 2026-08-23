import { describe, expect, it } from "vitest";
import { isSafeCallbackPath, maskIdentifier } from "@/lib/auth/security";

describe("authentication helpers", () => {
  it("allows local callback paths", () => expect(isSafeCallbackPath("/dashboard")).toBe(true));
  it("rejects protocol-relative and backslash callbacks", () => {
    expect(isSafeCallbackPath("//evil.example")).toBe(false);
    expect(isSafeCallbackPath("/\\evil.example")).toBe(false);
  });
  it("masks identifiers", () => expect(maskIdentifier("client_123456")).toBe("••••3456"));
});
