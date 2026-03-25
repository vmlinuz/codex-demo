import Link from "next/link";
import type { ReactNode } from "react";

import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";

export function EntryShell({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="min-h-screen px-6 py-8 text-foreground">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel className="flex flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(238,248,246,0.78)_100%)] p-8 sm:p-10">
          <div className="space-y-10">
            <div className="flex items-center justify-between gap-4">
              <Link className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-strong" href="/">
                TinyNotes
              </Link>
              <StatusBadge tone="strong">Scaffold only</StatusBadge>
            </div>
            <div className="space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-accent-strong">
                Elegant acqua workspace
              </p>
              <h1 className="max-w-xl font-display text-5xl leading-tight text-foreground sm:text-6xl">
                Route-ready foundations for notes, auth, and public sharing.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted">
                These public pages establish the eventual entry flow without introducing auth logic,
                form handling, or real redirects yet.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["App Router", "Rooted in server-rendered pages and layouts."],
              ["Shared shells", "Reusable entry, notes, and public-note wrappers."],
              ["Placeholder states", "Loading, empty, and error-ready page sections."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-[1.35rem] border border-white/70 bg-white/70 p-4">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </div>
            ))}
          </div>
        </Panel>
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </main>
  );
}
