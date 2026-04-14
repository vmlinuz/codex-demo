import { describe, expect, it } from "vitest";

import { MAX_NOTE_CONTENT_SIZE, createEmptyNoteDocument } from "@/notes/document";
import {
  validateCreateNoteInput,
  validateNoteIdInput,
  validateUpdateNoteInput,
} from "@/notes/validation";

describe("note input validation", () => {
  it("rejects blank create requests with the user-facing validation message", () => {
    expect(
      validateCreateNoteInput({
        contentJson: createEmptyNoteDocument(),
        title: "",
      }),
    ).toEqual({
      message: "Provide a title or note content before creating a note.",
      ok: false,
    });
  });

  it("serializes valid create requests", () => {
    const result = validateCreateNoteInput({
      contentJson: {
        content: [{ content: [{ text: "Body", type: "text" }], type: "paragraph" }],
        type: "doc",
      },
      title: "Title",
    });

    expect(result).toEqual({
      ok: true,
      value: {
        contentJson:
          '{"content":[{"content":[{"text":"Body","type":"text"}],"type":"paragraph"}],"type":"doc"}',
        id: undefined,
        title: "Title",
      },
    });
  });

  it("requires an id for updates but still allows blank content", () => {
    expect(
      validateUpdateNoteInput({
        contentJson: createEmptyNoteDocument(),
        title: "Still valid",
      }),
    ).toEqual({
      message: "Unable to save note right now.",
      ok: false,
    });

    expect(
      validateUpdateNoteInput({
        contentJson: createEmptyNoteDocument(),
        id: "note-123",
        title: "",
      }),
    ).toEqual({
      ok: true,
      value: {
        contentJson: '{"type":"doc","content":[{"type":"paragraph"}]}',
        id: "note-123",
        title: "",
      },
    });
  });

  it("validates note-id-only payloads for delete/share actions", () => {
    expect(validateNoteIdInput({})).toEqual({
      message: "Unable to process that note right now.",
      ok: false,
    });

    expect(validateNoteIdInput({ id: "note-123" })).toEqual({
      ok: true,
      value: {
        id: "note-123",
      },
    });
  });

  it("rejects content that exceeds the storage limit", () => {
    const oversizedText = "x".repeat(MAX_NOTE_CONTENT_SIZE);

    expect(
      validateCreateNoteInput({
        contentJson: {
          content: [{ content: [{ text: oversizedText, type: "text" }], type: "paragraph" }],
          type: "doc",
        },
        title: "Too large",
      }),
    ).toEqual({
      message: "Note content is too large.",
      ok: false,
    });
  });
});
