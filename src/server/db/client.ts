import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { Database } from "bun:sqlite";

import { getServerEnv } from "../env";

type DatabaseCache = typeof globalThis & {
  __tinynotesDb?: Database;
};

const globalForDatabase = globalThis as DatabaseCache;

export function createSqliteDatabase(filename: string) {
  mkdirSync(dirname(filename), { recursive: true });

  return new Database(filename, { create: true });
}

export function getDb() {
  if (globalForDatabase.__tinynotesDb) {
    return globalForDatabase.__tinynotesDb;
  }

  const { dbFilePath } = getServerEnv();

  globalForDatabase.__tinynotesDb = createSqliteDatabase(dbFilePath);

  return globalForDatabase.__tinynotesDb;
}
