import { execFileSync } from "node:child_process";

const cliArgs = process.argv.slice(2);
const hasExplicitProject = cliArgs.some(
  (argument, index) =>
    argument === "--project" ||
    argument.startsWith("--project=") ||
    (cliArgs[index - 1] === "--project" && Boolean(argument)),
);

const projects = hasExplicitProject ? [null] : ["chromium", "firefox", "webkit"];

for (const project of projects) {
  const commandArgs = ["./node_modules/playwright/cli.js", "test", ...cliArgs];

  if (project) {
    commandArgs.push(`--project=${project}`);
  }

  execFileSync("node", commandArgs, {
    env: process.env,
    stdio: "inherit",
  });
}
