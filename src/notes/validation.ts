import {
  MAX_NOTE_CONTENT_SIZE,
  hasMeaningfulNoteContent,
  isNoteDocument,
  serializeNoteDocument,
} from "@/notes/document";

const createFallbackMessage = "Unable to create note right now.";
const createBlankDocumentMessage = "Provide a title or note content before creating a note.";
const updateFallbackMessage = "Unable to save note right now.";
const noteIdFallbackMessage = "Unable to process that note right now.";

type ValidatedNoteInput = {
  contentJson: string;
  id?: string;
  title: string;
};

type ValidatedNoteIdInput = {
  id: string;
};

type NoteInputValidationResult =
  | {
      ok: true;
      value: ValidatedNoteInput;
    }
  | {
      message: string;
      ok: false;
    };

type NoteIdValidationResult =
  | {
      ok: true;
      value: ValidatedNoteIdInput;
    }
  | {
      message: string;
      ok: false;
    };

type NoteInputShape = {
  contentJson: unknown;
  id?: unknown;
  title: unknown;
};

type NoteIdInputShape = {
  id: unknown;
};

export function validateCreateNoteInput(input: unknown): NoteInputValidationResult {
  return validateNoteInput(input, {
    allowBlankDocument: false,
    blankDocumentMessage: createBlankDocumentMessage,
    fallbackMessage: createFallbackMessage,
    requireId: false,
  });
}

export function validateUpdateNoteInput(input: unknown): NoteInputValidationResult {
  return validateNoteInput(input, {
    allowBlankDocument: true,
    blankDocumentMessage: updateFallbackMessage,
    fallbackMessage: updateFallbackMessage,
    requireId: true,
  });
}

export function validateNoteIdInput(input: unknown): NoteIdValidationResult {
  if (typeof input !== "object" || input === null) {
    return {
      message: noteIdFallbackMessage,
      ok: false,
    };
  }

  const noteInput = input as NoteIdInputShape;

  if (typeof noteInput.id !== "string" || !noteInput.id.trim()) {
    return {
      message: noteIdFallbackMessage,
      ok: false,
    };
  }

  return {
    ok: true,
    value: {
      id: noteInput.id,
    },
  };
}

function validateNoteInput(
  input: unknown,
  options: Readonly<{
    allowBlankDocument: boolean;
    blankDocumentMessage: string;
    fallbackMessage: string;
    requireId: boolean;
  }>,
): NoteInputValidationResult {
  if (typeof input !== "object" || input === null) {
    return {
      message: options.fallbackMessage,
      ok: false,
    };
  }

  const noteInput = input as NoteInputShape;

  if (typeof noteInput.title !== "string" || !isNoteDocument(noteInput.contentJson)) {
    return {
      message: options.fallbackMessage,
      ok: false,
    };
  }

  if (options.requireId && (typeof noteInput.id !== "string" || !noteInput.id.trim())) {
    return {
      message: options.fallbackMessage,
      ok: false,
    };
  }

  const serializedDocument = serializeNoteDocument(noteInput.contentJson);

  if (serializedDocument.length > MAX_NOTE_CONTENT_SIZE) {
    return {
      message: "Note content is too large.",
      ok: false,
    };
  }

  if (
    !options.allowBlankDocument &&
    !noteInput.title.trim() &&
    !hasMeaningfulNoteContent(noteInput.contentJson)
  ) {
    return {
      message: options.blankDocumentMessage,
      ok: false,
    };
  }

  return {
    ok: true,
    value: {
      contentJson: serializedDocument,
      id: typeof noteInput.id === "string" ? noteInput.id : undefined,
      title: noteInput.title,
    },
  };
}
