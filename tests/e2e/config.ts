import { resolve } from "node:path";

export const E2E_PORT = 3100;
export const E2E_APP_URL = `http://127.0.0.1:${E2E_PORT}`;
export const E2E_AUTH_SECRET = "playwright-test-secret-0123456789abcdef";
export const E2E_DB_PATH = resolve("data", "test", "e2e.sqlite");

export const SEEDED_SHARED_NOTE = {
  disabledToken: "shared-note-disabled-token",
  enabledToken: "shared-note-enabled-token",
  paragraphText: "This seeded shared note is publicly readable.",
  title: "Seeded public note",
} as const;
