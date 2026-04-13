import { execFileSync, spawn } from "node:child_process";

const E2E_PORT = 3100;

execFileSync("bun", ["run", "tests/e2e/setup/prepare-db.ts"], {
  env: process.env,
  stdio: "inherit",
});

const child = spawn("bun", ["--bun", "next", "start", "-p", String(E2E_PORT)], {
  env: process.env,
  stdio: "inherit",
});

const closeChild = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on("SIGINT", () => closeChild("SIGINT"));
process.on("SIGTERM", () => closeChild("SIGTERM"));

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
