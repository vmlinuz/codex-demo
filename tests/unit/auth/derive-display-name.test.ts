import { describe, expect, it } from "vitest";

import { deriveDisplayNameFromEmail } from "@/auth/derive-display-name";

describe("deriveDisplayNameFromEmail", () => {
  it("splits common local-part delimiters into a readable name", () => {
    expect(deriveDisplayNameFromEmail("jane_doe+ops-team@example.com")).toBe("Jane Doe Ops Team");
  });

  it("falls back when the email local part does not contain usable tokens", () => {
    expect(deriveDisplayNameFromEmail(".-+@example.com")).toBe("TinyNotes User");
  });
});
