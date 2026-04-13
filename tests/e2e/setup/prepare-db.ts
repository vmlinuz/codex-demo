import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { Database } from "bun:sqlite";

import { createEmptyNoteDocument, serializeNoteDocument } from "../../../src/notes/document";
import { E2E_DB_PATH, SEEDED_SHARED_NOTE } from "../config";

const MIGRATION_PATHS = [
  resolve("migrations", "0001_init.up.sql"),
  resolve("migrations", "0002_notes.up.sql"),
] as const;

function hashShareToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function main() {
  if (existsSync(E2E_DB_PATH)) {
    rmSync(E2E_DB_PATH, { force: true });
  }

  mkdirSync(dirname(E2E_DB_PATH), { recursive: true });

  const database = new Database(E2E_DB_PATH, {
    create: true,
    strict: true,
  });

  try {
    database.exec("PRAGMA foreign_keys = ON;");

    for (const migrationPath of MIGRATION_PATHS) {
      database.exec(readFileSync(migrationPath, "utf8"));
    }

    const seededUserId = randomUUID();
    const enabledNoteId = randomUUID();
    const disabledNoteId = randomUUID();
    const timestamp = new Date("2026-04-13T08:00:00.000Z").toISOString();
    const contentJson = serializeNoteDocument(createEmptyNoteDocument());

    database
      .prepare(
        `
          INSERT INTO user (id, name, email, emailVerified, image, createdAt, updatedAt)
          VALUES (?, ?, ?, 1, NULL, ?, ?);
        `,
      )
      .run(seededUserId, "Playwright Seed", "seeded-public-note@example.com", timestamp, timestamp);

    database
      .prepare(
        `
          INSERT INTO note (id, user_id, title, content_json, share_enabled, created_at, updated_at)
          VALUES (?, ?, ?, ?, 1, ?, ?);
        `,
      )
      .run(
        enabledNoteId,
        seededUserId,
        SEEDED_SHARED_NOTE.title,
        contentJson,
        timestamp,
        timestamp,
      );

    database
      .prepare(
        `
          INSERT INTO note_share (id, note_id, token_hash, enabled, created_at, disabled_at)
          VALUES (?, ?, ?, 1, ?, NULL);
        `,
      )
      .run(randomUUID(), enabledNoteId, hashShareToken(SEEDED_SHARED_NOTE.enabledToken), timestamp);

    database
      .prepare(
        `
          INSERT INTO note (id, user_id, title, content_json, share_enabled, created_at, updated_at)
          VALUES (?, ?, ?, ?, 0, ?, ?);
        `,
      )
      .run(disabledNoteId, seededUserId, "Disabled public note", contentJson, timestamp, timestamp);

    database
      .prepare(
        `
          INSERT INTO note_share (id, note_id, token_hash, enabled, created_at, disabled_at)
          VALUES (?, ?, ?, 0, ?, ?);
        `,
      )
      .run(
        randomUUID(),
        disabledNoteId,
        hashShareToken(SEEDED_SHARED_NOTE.disabledToken),
        timestamp,
        timestamp,
      );
  } finally {
    database.close();
  }
}

main();
