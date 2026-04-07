import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";

import type { Database } from "bun:sqlite";

import { getServerEnv } from "../env";

type DatabaseCache = typeof globalThis & {
  __tinynotesDb?: Database;
};

const globalForDatabase = globalThis as DatabaseCache;
const require = createRequire(import.meta.url);

function getBunSqliteModule() {
  if (!process.versions.bun) {
    throw new Error("bun:sqlite is only available when running under Bun.");
  }

  return require("bun:sqlite") as typeof import("bun:sqlite");
}

export function createSqliteDatabase(filename: string) {
  mkdirSync(dirname(filename), { recursive: true });

  const { Database } = getBunSqliteModule();
  const database = new Database(filename, {
    create: true,
    strict: true,
  });

  // SQLite keeps foreign-key enforcement disabled by default.
  database.exec("PRAGMA foreign_keys = ON;");

  return database;
}

export function getDb() {
  if (globalForDatabase.__tinynotesDb) {
    return globalForDatabase.__tinynotesDb;
  }

  const { dbFilePath } = getServerEnv();

  globalForDatabase.__tinynotesDb = createSqliteDatabase(dbFilePath);

  return globalForDatabase.__tinynotesDb;
}
