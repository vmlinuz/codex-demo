"use server";

import { revalidatePath } from "next/cache";

import {
  validateCreateNoteInput,
  validateNoteIdInput,
  validateUpdateNoteInput,
} from "@/notes/validation";
import type {
  CreateNoteActionInput,
  CreateNoteActionResult,
  DeleteNoteActionInput,
  DeleteNoteActionResult,
  DisableShareActionInput,
  DisableShareActionResult,
  EnableShareActionInput,
  EnableShareActionResult,
  NoteActionError,
  NoteActionErrorCode,
  UpdateNoteActionInput,
  UpdateNoteActionResult,
} from "@/notes/types";
import { getAuthSession } from "@/server/auth";
import {
  createOwnedNote,
  deleteOwnedNote,
  disableNoteShare,
  enableNoteShare,
  updateOwnedNote,
} from "@/server/notes";

const createErrorMessage = "Unable to create note right now.";
const updateErrorMessage = "Unable to save note right now.";
const deleteErrorMessage = "Unable to delete note right now.";
const enableShareErrorMessage = "Unable to enable sharing right now.";
const disableShareErrorMessage = "Unable to disable sharing right now.";

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

export async function deleteNoteAction(
  input: DeleteNoteActionInput,
): Promise<DeleteNoteActionResult> {
  const session = await getAuthSession();

  if (!session?.user) {
    return createActionError("UNAUTHORIZED", deleteErrorMessage);
  }

  const validatedInput = validateNoteIdInput(input);

  if (!validatedInput.ok) {
    return createActionError("VALIDATION_ERROR", validatedInput.message);
  }

  try {
    const deleted = deleteOwnedNote({
      noteId: validatedInput.value.id,
      userId: session.user.id,
    });

    if (!deleted) {
      return createActionError("NOT_FOUND", "That note is no longer available.");
    }

    revalidatePath("/notes");
    revalidatePath(`/notes/${validatedInput.value.id}`);

    return {
      deleted: true,
    };
  } catch (error) {
    console.error("Unable to delete note.", {
      error,
      noteId: validatedInput.value.id,
      userId: session.user.id,
    });

    return createActionError("INTERNAL_ERROR", deleteErrorMessage);
  }
}

export async function enableShareAction(
  input: EnableShareActionInput,
): Promise<EnableShareActionResult> {
  const session = await getAuthSession();

  if (!session?.user) {
    return createActionError("UNAUTHORIZED", enableShareErrorMessage);
  }

  const validatedInput = validateNoteIdInput(input);

  if (!validatedInput.ok) {
    return createActionError("VALIDATION_ERROR", validatedInput.message);
  }

  try {
    const result = enableNoteShare({
      noteId: validatedInput.value.id,
      userId: session.user.id,
    });

    if (!result) {
      return createActionError("NOT_FOUND", "That note is no longer available.");
    }

    revalidatePath("/notes");
    revalidatePath(`/notes/${validatedInput.value.id}`);

    return {
      shareEnabled: true,
      shareUrl: `/s/${result.shareToken}`,
      updatedAt: result.updatedAt,
    };
  } catch (error) {
    console.error("Unable to enable note sharing.", {
      error,
      noteId: validatedInput.value.id,
      userId: session.user.id,
    });

    return createActionError("INTERNAL_ERROR", enableShareErrorMessage);
  }
}

export async function disableShareAction(
  input: DisableShareActionInput,
): Promise<DisableShareActionResult> {
  const session = await getAuthSession();

  if (!session?.user) {
    return createActionError("UNAUTHORIZED", disableShareErrorMessage);
  }

  const validatedInput = validateNoteIdInput(input);

  if (!validatedInput.ok) {
    return createActionError("VALIDATION_ERROR", validatedInput.message);
  }

  try {
    const result = disableNoteShare({
      noteId: validatedInput.value.id,
      userId: session.user.id,
    });

    if (!result) {
      return createActionError("NOT_FOUND", "That note is no longer available.");
    }

    revalidatePath("/notes");
    revalidatePath(`/notes/${validatedInput.value.id}`);

    return {
      shareEnabled: false,
      updatedAt: result.updatedAt,
    };
  } catch (error) {
    console.error("Unable to disable note sharing.", {
      error,
      noteId: validatedInput.value.id,
      userId: session.user.id,
    });

    return createActionError("INTERNAL_ERROR", disableShareErrorMessage);
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
