import { readdirSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

import { createSqliteDatabase } from "../src/server/db/client";
import { getServerEnv } from "../src/server/env";

const ENSURE_MIGRATIONS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL
  );
`;

const SELECT_APPLIED_MIGRATIONS_SQL = `
  SELECT version, applied_at
  FROM schema_migrations
  ORDER BY version;
`;

const INSERT_MIGRATION_SQL = `
  INSERT INTO schema_migrations (version, applied_at)
  VALUES (?, ?);
`;

const DELETE_MIGRATION_SQL = `
  DELETE FROM schema_migrations
  WHERE version = ?;
`;

type AppliedMigrationRow = {
  applied_at: string;
  version: string;
};

type AppliedMigration = {
  storedVersion: string;
  version: string;
};

type MigrationDefinition = {
  downPath: string;
  upPath: string;
  version: string;
};

type MigrationDirection = "up" | "down";

type MigrationCommand = {
  count: number;
  direction: MigrationDirection;
};

function getUsage() {
  return "Usage: bun run migrate [--down|--down=N]";
}

function parseCommand(args: string[]): MigrationCommand {
  if (args.length === 0) {
    return { count: 0, direction: "up" };
  }

  if (args.length === 1 && args[0] === "--down") {
    return { count: 1, direction: "down" };
  }

  if (args.length === 1 && args[0].startsWith("--down=")) {
    const rawCount = args[0].slice("--down=".length);

    if (!/^[1-9]\d*$/.test(rawCount)) {
      throw new Error(`Invalid rollback count.\n${getUsage()}`);
    }

    return { count: Number(rawCount), direction: "down" };
  }

  throw new Error(`Invalid arguments.\n${getUsage()}`);
}

function getMigrationDefinitions(migrationsDirectory: string) {
  const migrationFiles = new Map<string, Partial<Record<MigrationDirection, string>>>();

  const filenames = readdirSync(migrationsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  for (const filename of filenames) {
    const match = filename.match(/^(.+)\.(up|down)\.sql$/);

    if (!match) {
      throw new Error(
        `Invalid migration filename "${filename}". Expected "*.up.sql" or "*.down.sql".`,
      );
    }

    const version = match[1];
    const direction = match[2] as MigrationDirection;
    const files = migrationFiles.get(version) ?? {};

    if (files[direction]) {
      throw new Error(`Duplicate ${direction.toUpperCase()} migration for version "${version}".`);
    }

    files[direction] = filename;
    migrationFiles.set(version, files);
  }

  return migrationFiles;
}

function buildMigrationDefinitions(migrationsDirectory: string) {
  const migrationFiles = getMigrationDefinitions(migrationsDirectory);

  return [...migrationFiles.entries()]
    .map(([version, files]) => {
      if (!files.up || !files.down) {
        throw new Error(`Migration "${version}" must include both UP and DOWN SQL files.`);
      }

      return {
        downPath: resolve(migrationsDirectory, files.down),
        upPath: resolve(migrationsDirectory, files.up),
        version,
      } satisfies MigrationDefinition;
    })
    .sort((left, right) => left.version.localeCompare(right.version));
}

function readMigrationSql(path: string) {
  const sql = readFileSync(path, "utf8").trim();

  if (!sql) {
    throw new Error(`Migration "${basename(path)}" is empty.`);
  }

  return sql;
}

function normalizeAppliedVersion(version: string, knownVersions: Set<string>) {
  if (knownVersions.has(version)) {
    return version;
  }

  if (version.endsWith(".sql")) {
    const legacyVersion = version.slice(0, -".sql".length);

    if (knownVersions.has(legacyVersion)) {
      return legacyVersion;
    }
  }

  return version;
}

function getAppliedMigrations(appliedRows: AppliedMigrationRow[], knownVersions: Set<string>) {
  const appliedMigrations = new Map<string, AppliedMigration>();

  for (const row of appliedRows) {
    const version = normalizeAppliedVersion(row.version, knownVersions);

    if (!knownVersions.has(version)) {
      throw new Error(`Applied migration "${row.version}" does not have matching migration files.`);
    }

    if (appliedMigrations.has(version)) {
      const existing = appliedMigrations.get(version);

      throw new Error(
        `Duplicate applied migration entries for version "${version}" (${existing?.storedVersion}, ${row.version}).`,
      );
    }

    appliedMigrations.set(version, {
      storedVersion: row.version,
      version,
    });
  }

  return [...appliedMigrations.values()].sort((left, right) =>
    left.version.localeCompare(right.version),
  );
}

function main() {
  const command = parseCommand(process.argv.slice(2));
  const migrationsDirectory = resolve(process.cwd(), "migrations");
  const { dbFilePath } = getServerEnv();
  const database = createSqliteDatabase(dbFilePath);

  try {
    database.exec(ENSURE_MIGRATIONS_TABLE_SQL);

    const migrations = buildMigrationDefinitions(migrationsDirectory);

    if (migrations.length === 0) {
      console.log("No migrations found.");
      return;
    }

    const knownVersions = new Set(migrations.map((migration) => migration.version));
    const appliedMigrations = getAppliedMigrations(
      database.prepare(SELECT_APPLIED_MIGRATIONS_SQL).all() as AppliedMigrationRow[],
      knownVersions,
    );
    const appliedVersionSet = new Set(appliedMigrations.map((migration) => migration.version));
    const insertMigration = database.prepare(INSERT_MIGRATION_SQL);
    const deleteMigration = database.prepare(DELETE_MIGRATION_SQL);
    const applyMigration = database.transaction(
      (version: string, sql: string, appliedAt: string) => {
        database.exec(sql);
        insertMigration.run(version, appliedAt);
      },
    );
    const rollbackMigration = database.transaction((storedVersion: string, sql: string) => {
      database.exec(sql);
      deleteMigration.run(storedVersion);
    });

    if (command.direction === "up") {
      const pendingMigrations = migrations.filter(
        (migration) => !appliedVersionSet.has(migration.version),
      );

      for (const migration of pendingMigrations) {
        const sql = readMigrationSql(migration.upPath);

        console.log(`Applying ${basename(migration.upPath)}...`);
        applyMigration(migration.version, sql, new Date().toISOString());
        console.log(`Applied ${migration.version}.`);
      }

      console.log("Migrations are up to date.");
      return;
    }

    if (appliedMigrations.length === 0) {
      console.log("No applied migrations to roll back.");
      return;
    }

    const rollbackTargets = appliedMigrations.slice(-command.count).reverse();
    const migrationsByVersion = new Map(
      migrations.map((migration) => [migration.version, migration]),
    );

    for (const appliedMigration of rollbackTargets) {
      const migration = migrationsByVersion.get(appliedMigration.version);

      if (!migration) {
        throw new Error(
          `Missing migration files for applied version "${appliedMigration.version}".`,
        );
      }

      const sql = readMigrationSql(migration.downPath);

      console.log(`Rolling back ${basename(migration.downPath)}...`);
      rollbackMigration(appliedMigration.storedVersion, sql);
      console.log(`Rolled back ${appliedMigration.version}.`);
    }

    console.log("Rollback complete.");
  } catch (error) {
    console.error("Migration failed.");
    console.error(error);
    process.exitCode = 1;
  } finally {
    database.close();
  }
}

main();
