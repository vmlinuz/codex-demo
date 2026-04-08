import "server-only";

import { createHash } from "node:crypto";

import { createEmptyNoteDocument, getNoteExcerpt, parseNoteDocument } from "@/notes/document";
import type { NoteDetail, NoteSummary } from "@/notes/types";
import { getDb } from "@/server/db/client";

const SELECT_OWNED_NOTE_SQL = `
  SELECT
    id,
    title,
    content_json AS contentJson,
    share_enabled AS shareEnabled,
    created_at AS createdAt,
    updated_at AS updatedAt
  FROM note
  WHERE id = ? AND user_id = ?
  LIMIT 1;
`;

const SELECT_OWNED_NOTES_SQL = `
  SELECT
    id,
    title,
    content_json AS contentJson,
    share_enabled AS shareEnabled,
    created_at AS createdAt,
    updated_at AS updatedAt
  FROM note
  WHERE user_id = ?
  ORDER BY updated_at DESC;
`;

const INSERT_NOTE_SQL = `
  INSERT INTO note (id, user_id, title, content_json, share_enabled, created_at, updated_at)
  VALUES (?, ?, ?, ?, 0, ?, ?);
`;

const UPDATE_NOTE_SQL = `
  UPDATE note
  SET title = ?, content_json = ?, updated_at = ?
  WHERE id = ? AND user_id = ?;
`;

const SELECT_NOTE_SHARE_STATE_SQL = `
  SELECT share_enabled AS shareEnabled
  FROM note
  WHERE id = ? AND user_id = ?
  LIMIT 1;
`;

const SELECT_SHARED_NOTE_SQL = `
  SELECT
    n.id,
    n.title,
    n.created_at AS createdAt,
    n.updated_at AS updatedAt
  FROM note_share s
  JOIN note n ON n.id = s.note_id
  WHERE s.token_hash = ?
    AND s.enabled = 1
    AND n.share_enabled = 1
  LIMIT 1;
`;

type OwnedNoteRow = {
  contentJson: string;
  createdAt: string;
  id: string;
  shareEnabled: number;
  title: string;
  updatedAt: string;
};

type SharedNoteRow = {
  createdAt: string;
  id: string;
  title: string;
  updatedAt: string;
};

export type SharedNote = {
  createdAt: string;
  id: string;
  title: string;
  updatedAt: string;
};

export function listOwnedNotes(userId: string): NoteSummary[] {
  const rows = getDb().prepare(SELECT_OWNED_NOTES_SQL).all(userId) as OwnedNoteRow[];

  return rows.map((row) => {
    const content = parseNoteDocument(row.contentJson);

    if (!content) {
      console.error("Stored note content is invalid JSON.", {
        noteId: row.id,
        userId,
      });
    }

    return {
      createdAt: row.createdAt,
      excerpt: content ? getNoteExcerpt(content) : "",
      id: row.id,
      shareEnabled: Boolean(row.shareEnabled),
      title: row.title,
      updatedAt: row.updatedAt,
    };
  });
}

export function findOwnedNoteById({
  noteId,
  userId,
}: Readonly<{
  noteId: string;
  userId: string;
}>): NoteDetail | null {
  const row = getDb().prepare(SELECT_OWNED_NOTE_SQL).get(noteId, userId) as OwnedNoteRow | null;

  if (!row) {
    return null;
  }

  const content = parseNoteDocument(row.contentJson);

  if (!content) {
    console.error("Stored note content is invalid JSON.", {
      noteId,
      userId,
    });
  }

  return {
    content: content ?? createEmptyNoteDocument(),
    createdAt: row.createdAt,
    id: row.id,
    shareEnabled: Boolean(row.shareEnabled),
    title: row.title,
    updatedAt: row.updatedAt,
  };
}

export function createOwnedNote({
  contentJson,
  title,
  userId,
}: Readonly<{
  contentJson: string;
  title: string;
  userId: string;
}>): { id: string } {
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  getDb().prepare(INSERT_NOTE_SQL).run(id, userId, title, contentJson, timestamp, timestamp);

  return { id };
}

export function updateOwnedNote({
  contentJson,
  noteId,
  title,
  userId,
}: Readonly<{
  contentJson: string;
  noteId: string;
  title: string;
  userId: string;
}>): { shareEnabled: boolean; updatedAt: string } | null {
  const updatedAt = new Date().toISOString();
  const result = getDb()
    .prepare(UPDATE_NOTE_SQL)
    .run(title, contentJson, updatedAt, noteId, userId) as { changes: number };

  if (!result.changes) {
    return null;
  }

  const shareState = getDb().prepare(SELECT_NOTE_SHARE_STATE_SQL).get(noteId, userId) as {
    shareEnabled: number;
  } | null;

  return {
    shareEnabled: Boolean(shareState?.shareEnabled),
    updatedAt,
  };
}

function hashShareToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function findSharedNoteByToken(token: string): SharedNote | null {
  const row = getDb()
    .prepare(SELECT_SHARED_NOTE_SQL)
    .get(hashShareToken(token)) as SharedNoteRow | null;

  if (!row) {
    return null;
  }

  return {
    createdAt: row.createdAt,
    id: row.id,
    title: row.title,
    updatedAt: row.updatedAt,
  };
}
