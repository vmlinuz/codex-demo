This repository is the starting point for `TinyNotes`, a Bun + TypeScript + Next.js app defined in [SPEC.MD](C:\Users\ROG\prj\playground\starting-project\SPEC.MD).

The current architecture constraints are:

- No `context_text`
- No query params, search, or filtering for notes
- React Server Components for note/page reads
- Next.js Server Actions for all mutations

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

The app is still at scaffold stage. Use [SPEC.MD](C:\Users\ROG\prj\playground\starting-project\SPEC.MD) as the source of truth for the implementation.
