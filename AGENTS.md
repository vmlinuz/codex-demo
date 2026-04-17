# Repository Guidelines

## General Instructions

- ALWAYS run `bun run format` AFTER you're done with your task and you edited all files that needed editing
- ALWAYS run `bun run lint` after making any changes => fix any linting errors you get
- ALWAYS check for type errors via `bun tsc --noEmit`
- ALWAYS run unit tests via `bun run test`
- ALWAYS run e2e tests via `bun run test:e2e`

## Project Structure & Module Organization

This repository is a Next.js App Router project (TypeScript + Tailwind v4).

- `app/`: Route tree, layouts, and page entry points (for example `app/(app)/notes/page.tsx`).
- `src/components/`: Shared UI and layout building blocks (for example `src/components/layout/` and `src/components/ui/`).
- `public/`: Static assets served directly.
- Root config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`.
- Product requirements/spec: `SPEC.MD`.

Keep route-level concerns in `app/` and reusable presentation components in `src/components/`.

## Build, Test, and Development Commands

Use Bun (lockfile is `bun.lock`), but npm equivalents also work.

- `bun run dev`: Start local dev server at `http://localhost:3000` using Next.js webpack mode.
- `bun run build`: Create a production build.
- `bun run start`: Run the production server.
- `bun run migrate`: Apply pending SQLite migrations from `migrations/` to the configured database.
- `bun run migrate -- --down` / `bun run migrate -- --down=N`: Roll back the latest migration or the latest `N` migrations.
- `bun run test`: Run the unit test suite (alias for `bun run test:unit`).
- `bun run test:unit`: Run the Vitest unit suite.
- `bun run test:unit:watch`: Run Vitest in watch mode for local iteration.
- `bun run test:e2e`: Build the app and run the Playwright end-to-end suite across Chromium, Firefox, and WebKit.
- `bun run test:e2e:playwright -- --project=<browser>`: Run Playwright directly for targeted local debugging against a single browser project.
- `bun run test:all`: Run unit and e2e suites in sequence.
- `bun run lint`: Run `oxlint` for static checks.
- `bun run format`: Run `oxfmt` to format code.

The default SQLite database path is `./data/tinynotes.db` unless `DB_PATH` is set.
The e2e harness uses an isolated SQLite database at `data/test/e2e.sqlite` and starts the app on `http://127.0.0.1:3100`.

Run `bun run lint && bun run build` before opening a PR.

## Coding Style & Naming Conventions

- Language: TypeScript (`.ts` / `.tsx`).
- Indentation: 2 spaces; keep lines readable and components focused.
- Components/files: use kebab-case file names (for example `placeholder-page.tsx`).
- Routes: follow App Router conventions (`page.tsx`, `layout.tsx`, dynamic segments like `[id]`).
- Prefer server components by default; use client components only when interactivity is required.

## Commit & Pull Request Guidelines

Recent commits use concise, imperative summaries (for example: `Scaffold TinyNotes base routes`).

- Commit messages: short subject line, verb-first, scoped to one logical change.
- PRs should include:
  - What changed and why.
  - Linked issue/spec section (`SPEC.MD` reference when relevant).
  - Screenshots/GIFs for UI-affecting changes.
  - Verification notes (commands run, e.g. `bun run lint`, `bun run build`).

## Security & Configuration Tips

- Do not commit secrets; use environment variables for sensitive values.
- Keep error messages generic in UI-facing code.
- Validate changes against `SPEC.MD` before implementation.
