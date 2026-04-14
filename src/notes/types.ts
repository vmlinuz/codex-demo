import type { NoteDocument } from "@/notes/document";

export type NoteActionErrorCode =
  | "INTERNAL_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR";

export type NoteActionError = {
  error: {
    code: NoteActionErrorCode;
    message: string;
  };
};

export type CreateNoteActionInput = {
  contentJson: NoteDocument;
  title: string;
};

export type CreateNoteActionResult =
  | {
      noteId: string;
    }
  | NoteActionError;

export type UpdateNoteActionInput = {
  contentJson: NoteDocument;
  id: string;
  title: string;
};

export type UpdateNoteActionResult =
  | {
      shareEnabled: boolean;
      updatedAt: string;
    }
  | NoteActionError;

export type DeleteNoteActionInput = {
  id: string;
};

export type DeleteNoteActionResult =
  | {
      deleted: true;
    }
  | NoteActionError;

export type EnableShareActionInput = {
  id: string;
};

export type EnableShareActionResult =
  | {
      shareEnabled: true;
      shareUrl: string;
      updatedAt: string;
    }
  | NoteActionError;

export type DisableShareActionInput = {
  id: string;
};

export type DisableShareActionResult =
  | {
      shareEnabled: false;
      updatedAt: string;
    }
  | NoteActionError;

export type NoteSummary = {
  createdAt: string;
  excerpt: string;
  id: string;
  shareEnabled: boolean;
  title: string;
  updatedAt: string;
};

export type NoteDetail = {
  content: NoteDocument;
  createdAt: string;
  id: string;
  shareEnabled: boolean;
  title: string;
  updatedAt: string;
};
