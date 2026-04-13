"use server";

import { revalidatePath } from "next/cache";

import { validateCreateNoteInput, validateUpdateNoteInput } from "@/notes/validation";
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

  const validatedInput = validateCreateNoteInput(input);

  if (!validatedInput.ok) {
    return createActionError("VALIDATION_ERROR", validatedInput.message);
  }

  try {
    const note = createOwnedNote({
      contentJson: validatedInput.value.contentJson,
      title: validatedInput.value.title,
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

  const validatedInput = validateUpdateNoteInput(input);

  if (!validatedInput.ok) {
    return createActionError("VALIDATION_ERROR", validatedInput.message);
  }

  const noteId = validatedInput.value.id;

  if (!noteId) {
    return createActionError("VALIDATION_ERROR", updateErrorMessage);
  }

  try {
    const updatedNote = updateOwnedNote({
      contentJson: validatedInput.value.contentJson,
      noteId,
      title: validatedInput.value.title,
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
