import { resolve } from "node:path";

const DEFAULT_DB_PATH = "./data/tinynotes.db";
const DEFAULT_APP_URL = "http://localhost:3000";

type ServerEnv = {
  appUrl: string;
  authSecret?: string;
  dbFilePath: string;
  dbPath: string;
};

let cachedEnv: ServerEnv | undefined;

function getTrimmedEnv(name: string) {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

export function getRequiredEnv(name: string) {
  const value = getTrimmedEnv(name);

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

export function getServerEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const dbPath = getTrimmedEnv("DB_PATH") ?? DEFAULT_DB_PATH;
  const appUrl = getTrimmedEnv("APP_URL") ?? DEFAULT_APP_URL;

  try {
    new URL(appUrl);
  } catch {
    throw new Error("APP_URL must be a valid absolute URL.");
  }

  cachedEnv = {
    appUrl,
    authSecret: getTrimmedEnv("AUTH_SECRET"),
    dbFilePath: resolve(process.cwd(), dbPath),
    dbPath,
  };

  return cachedEnv;
}
