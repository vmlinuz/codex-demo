import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createSqliteDatabase } from "../src/server/db/client";
import { getServerEnv } from "../src/server/env";

const ENSURE_MIGRATIONS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL
  );
`;

const SELECT_APPLIED_MIGRATIONS_SQL = `
  SELECT version
  FROM schema_migrations
  ORDER BY version;
`;

const INSERT_MIGRATION_SQL = `
  INSERT INTO schema_migrations (version, applied_at)
  VALUES (?, ?);
`;

type AppliedMigrationRow = {
  version: string;
};

function getMigrationFilenames(migrationsDirectory: string) {
  return readdirSync(migrationsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function main() {
  const migrationsDirectory = resolve(process.cwd(), "migrations");
  const { dbFilePath } = getServerEnv();
  const database = createSqliteDatabase(dbFilePath);

  try {
    database.exec(ENSURE_MIGRATIONS_TABLE_SQL);

    const appliedMigrations = new Set(
      (database.prepare(SELECT_APPLIED_MIGRATIONS_SQL).all() as AppliedMigrationRow[]).map(
        (migration) => migration.version,
      ),
    );

    const migrationFiles = getMigrationFilenames(migrationsDirectory);

    if (migrationFiles.length === 0) {
      console.log("No migrations found.");
      return;
    }

    const insertMigration = database.prepare(INSERT_MIGRATION_SQL);
    const applyMigration = database.transaction(
      (version: string, sql: string, appliedAt: string) => {
        database.exec(sql);
        insertMigration.run(version, appliedAt);
      },
    );

    for (const migrationFile of migrationFiles) {
      if (appliedMigrations.has(migrationFile)) {
        continue;
      }

      const migrationPath = resolve(migrationsDirectory, migrationFile);
      const sql = readFileSync(migrationPath, "utf8").trim();

      if (!sql) {
        throw new Error(`Migration "${migrationFile}" is empty.`);
      }

      console.log(`Applying ${migrationFile}...`);
      applyMigration(migrationFile, sql, new Date().toISOString());
      console.log(`Applied ${migrationFile}.`);
    }

    console.log("Migrations are up to date.");
  } catch (error) {
    console.error("Migration failed.");
    console.error(error);
    process.exitCode = 1;
  } finally {
    database.close();
  }
}

main();
