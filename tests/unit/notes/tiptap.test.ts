import { describe, expect, it } from "vitest";

import { normalizeHttpUrl } from "@/notes/tiptap";

describe("normalizeHttpUrl", () => {
  it("normalizes bare domains to https urls", () => {
    expect(normalizeHttpUrl("example.com/docs")).toBe("https://example.com/docs");
  });

  it("preserves valid http urls and rejects unsafe protocols", () => {
    expect(normalizeHttpUrl("http://example.com")).toBe("http://example.com/");
    expect(normalizeHttpUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeHttpUrl("mailto:test@example.com")).toBeNull();
  });
});
