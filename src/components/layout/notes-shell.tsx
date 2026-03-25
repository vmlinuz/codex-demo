import Link from "next/link";
import type { ReactNode } from "react";

import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";

const navItems = [
  { href: "/notes", label: "All notes" },
  { href: "/notes/new", label: "New note" },
  { href: "/s/example-token", label: "Public preview" },
];

export function NotesShell({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="min-h-screen px-6 py-8 text-foreground">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Panel className="flex h-full flex-col gap-8 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <Link className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-strong" href="/notes">
                TinyNotes
              </Link>
              <StatusBadge tone="muted">Auth shell</StatusBadge>
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-3xl text-foreground">Notes workspace</h1>
              <p className="text-sm leading-7 text-muted">
                Placeholder navigation and page framing for the authenticated routes.
              </p>
            </div>
          </div>
          <nav className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="flex items-center justify-between rounded-2xl border border-line bg-white/65 px-4 py-3 text-sm font-medium text-foreground transition hover:border-accent/25 hover:bg-white"
                href={item.href}
              >
                <span>{item.label}</span>
                <span className="text-muted">→</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-[1.4rem] border border-accent/15 bg-accent/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent-strong">
              Future behavior
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Real session checks, note reads, and mutations are intentionally omitted in this
              scaffold pass.
            </p>
          </div>
        </Panel>
        <div className="space-y-6">
          <header className="flex flex-col gap-4 rounded-[1.75rem] border border-white/70 bg-surface-soft px-6 py-5 shadow-[0_16px_42px_var(--shadow)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-strong">
                Authenticated routes
              </p>
              <h2 className="mt-2 font-display text-3xl text-foreground">Notes route skeleton</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <StatusBadge>Server component reads later</StatusBadge>
              <StatusBadge tone="muted">Server actions later</StatusBadge>
            </div>
          </header>
          {children}
        </div>
      </div>
    </main>
  );
}
