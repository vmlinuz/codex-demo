import type { JSONContent } from "@tiptap/react";

export const MAX_NOTE_CONTENT_SIZE = 256 * 1024;
export const NOTE_EXCERPT_LENGTH = 160;

export type NoteDocument = JSONContent;

export const EMPTY_NOTE_DOCUMENT: NoteDocument = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function createEmptyNoteDocument(): NoteDocument {
  return structuredClone(EMPTY_NOTE_DOCUMENT);
}

export function isNoteDocument(value: unknown): value is NoteDocument {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as { type?: unknown }).type === "doc"
  );
}

export function parseNoteDocument(serialized: string): NoteDocument | null {
  try {
    const value = JSON.parse(serialized) as unknown;

    return isNoteDocument(value) ? value : null;
  } catch {
    return null;
  }
}

export function serializeNoteDocument(document: NoteDocument): string {
  return JSON.stringify(document);
}

export function getNotePlainText(document: NoteDocument): string {
  return collectNodeText(document).replace(/\s+/g, " ").trim();
}

export function hasMeaningfulNoteContent(document: NoteDocument): boolean {
  return getNotePlainText(document).length > 0;
}

export function getNoteExcerpt(document: NoteDocument, maxLength = NOTE_EXCERPT_LENGTH): string {
  const plainText = getNotePlainText(document);

  if (!plainText) {
    return "";
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength - 3).trimEnd()}...`;
}

function collectNodeText(node: NoteDocument | NoteDocument[] | undefined): string {
  if (!node) {
    return "";
  }

  if (Array.isArray(node)) {
    return node.map(collectNodeText).filter(Boolean).join(" ");
  }

  const text = typeof node.text === "string" ? node.text : "";
  const nestedText = collectNodeText(node.content);

  return [text, nestedText].filter(Boolean).join(" ");
}
