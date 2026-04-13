import { describe, expect, it } from "vitest";

import {
  createEmptyNoteDocument,
  getNoteExcerpt,
  getNotePlainText,
  hasMeaningfulNoteContent,
  parseNoteDocument,
  serializeNoteDocument,
} from "@/notes/document";

describe("note document helpers", () => {
  it("round-trips documents and extracts normalized plain text", () => {
    const document = {
      content: [
        {
          content: [
            { text: "Quarterly", type: "text" },
            { text: " plan", type: "text" },
          ],
          type: "heading",
        },
        {
          content: [{ text: "Action items", type: "text" }],
          type: "paragraph",
        },
      ],
      type: "doc",
    };

    const serialized = serializeNoteDocument(document);

    expect(parseNoteDocument(serialized)).toEqual(document);
    expect(getNotePlainText(document)).toBe("Quarterly plan Action items");
    expect(hasMeaningfulNoteContent(document)).toBe(true);
  });

  it("returns null for invalid serialized note content", () => {
    expect(parseNoteDocument("{bad json")).toBeNull();
    expect(parseNoteDocument(JSON.stringify({ type: "paragraph" }))).toBeNull();
  });

  it("builds excerpts and treats empty documents as blank", () => {
    const blankDocument = createEmptyNoteDocument();
    const longDocument = {
      content: [
        {
          content: [
            {
              text: "This note contains enough words to require truncation in the excerpt helper.",
              type: "text",
            },
          ],
          type: "paragraph",
        },
      ],
      type: "doc",
    };

    expect(hasMeaningfulNoteContent(blankDocument)).toBe(false);
    expect(getNoteExcerpt(blankDocument)).toBe("");
    expect(getNoteExcerpt(longDocument, 32)).toBe("This note contains enough wor...");
  });
});
