import Link from "next/link";
import type { ReactNode } from "react";

import { StatusBadge } from "@/components/ui/status-badge";

export function SharedNoteShell({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="min-h-screen px-6 py-8 text-foreground">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[1.75rem] border border-white/70 bg-surface-soft px-6 py-5 shadow-[0_18px_45px_var(--shadow)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Link className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-strong" href="/">
              TinyNotes
            </Link>
            <p className="max-w-2xl text-sm leading-7 text-muted">
              Public share route scaffold. Future work will resolve the token, render sanitized
              HTML, and collapse invalid cases into the same 404 behavior.
            </p>
          </div>
          <StatusBadge tone="muted">Public note shell</StatusBadge>
        </header>
        {children}
      </div>
    </main>
  );
}
