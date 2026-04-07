import "server-only";

import { createHash } from "node:crypto";

import { getDb } from "@/server/db/client";

const SELECT_OWNED_NOTE_SQL = `
  SELECT
    id,
    title,
    share_enabled AS shareEnabled,
    created_at AS createdAt,
    updated_at AS updatedAt
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

export type OwnedNote = {
  createdAt: string;
  id: string;
  shareEnabled: boolean;
  title: string;
  updatedAt: string;
};

export type SharedNote = {
  createdAt: string;
  id: string;
  title: string;
  updatedAt: string;
};

function hashShareToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function findOwnedNoteById({
  noteId,
  userId,
}: Readonly<{
  noteId: string;
  userId: string;
}>): OwnedNote | null {
  const row = getDb().prepare(SELECT_OWNED_NOTE_SQL).get(noteId, userId) as OwnedNoteRow | null;

  if (!row) {
    return null;
  }

  return {
    createdAt: row.createdAt,
    id: row.id,
    shareEnabled: Boolean(row.shareEnabled),
    title: row.title,
    updatedAt: row.updatedAt,
  };
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
