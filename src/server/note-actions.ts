"use server";

import { revalidatePath } from "next/cache";

import {
  MAX_NOTE_CONTENT_SIZE,
  hasMeaningfulNoteContent,
  isNoteDocument,
  serializeNoteDocument,
} from "@/notes/document";
import type {
  CreateNoteActionInput,
  CreateNoteActionResult,
  NoteActionError,
  NoteActionErrorCode,
  UpdateNoteActionInput,
  UpdateNoteActionResult,
} from "@/notes/types";
import { getAuthSession } from "@/server/auth";
import { createOwnedNote, updateOwnedNote } from "@/server/notes";

const createErrorMessage = "Unable to create note right now.";
const updateErrorMessage = "Unable to save note right now.";

export async function createNoteAction(
  input: CreateNoteActionInput,
): Promise<CreateNoteActionResult> {
  const session = await getAuthSession();

  if (!session?.user) {
    return createActionError("UNAUTHORIZED", createErrorMessage);
  }

  const validatedInput = validateNoteInput(input, {
    allowBlankDocument: false,
    blankDocumentMessage: "Provide a title or note content before creating a note.",
    fallbackMessage: createErrorMessage,
    requireId: false,
  });

  if ("error" in validatedInput) {
    return validatedInput;
  }

  try {
    const note = createOwnedNote({
      contentJson: validatedInput.contentJson,
      title: validatedInput.title,
      userId: session.user.id,
    });

    revalidatePath("/notes");

    return {
      noteId: note.id,
    };
  } catch (error) {
    console.error("Unable to create note.", {
      error,
      userId: session.user.id,
    });

    return createActionError("INTERNAL_ERROR", createErrorMessage);
  }
}

export async function updateNoteAction(
  input: UpdateNoteActionInput,
): Promise<UpdateNoteActionResult> {
  const session = await getAuthSession();

  if (!session?.user) {
    return createActionError("UNAUTHORIZED", updateErrorMessage);
  }

  const validatedInput = validateNoteInput(input, {
    allowBlankDocument: true,
    blankDocumentMessage: updateErrorMessage,
    fallbackMessage: updateErrorMessage,
    requireId: true,
  });

  if ("error" in validatedInput) {
    return validatedInput;
  }

  const noteId = validatedInput.id;

  if (!noteId) {
    return createActionError("VALIDATION_ERROR", updateErrorMessage);
  }

  try {
    const updatedNote = updateOwnedNote({
      contentJson: validatedInput.contentJson,
      noteId,
      title: validatedInput.title,
      userId: session.user.id,
    });

    if (!updatedNote) {
      return createActionError("NOT_FOUND", "That note is no longer available.");
    }

    revalidatePath("/notes");
    revalidatePath(`/notes/${noteId}`);

    return updatedNote;
  } catch (error) {
    console.error("Unable to update note.", {
      error,
      noteId,
      userId: session.user.id,
    });

    return createActionError("INTERNAL_ERROR", updateErrorMessage);
  }
}

function createActionError(code: NoteActionErrorCode, message: string): NoteActionError {
  return {
    error: {
      code,
      message,
    },
  };
}

function validateNoteInput(
  input: CreateNoteActionInput | UpdateNoteActionInput,
  options: Readonly<{
    allowBlankDocument: boolean;
    blankDocumentMessage: string;
    fallbackMessage: string;
    requireId: boolean;
  }>,
) {
  if (
    typeof input !== "object" ||
    input === null ||
    typeof input.title !== "string" ||
    !isNoteDocument(input.contentJson)
  ) {
    return createActionError("VALIDATION_ERROR", options.fallbackMessage);
  }

  if (options.requireId && (!("id" in input) || typeof input.id !== "string" || !input.id.trim())) {
    return createActionError("VALIDATION_ERROR", options.fallbackMessage);
  }

  const serializedDocument = serializeNoteDocument(input.contentJson);

  if (serializedDocument.length > MAX_NOTE_CONTENT_SIZE) {
    return createActionError("VALIDATION_ERROR", "Note content is too large.");
  }

  if (
    !options.allowBlankDocument &&
    !input.title.trim() &&
    !hasMeaningfulNoteContent(input.contentJson)
  ) {
    return createActionError("VALIDATION_ERROR", options.blankDocumentMessage);
  }

  return {
    contentJson: serializedDocument,
    id: "id" in input ? input.id : undefined,
    title: input.title,
  };
}
