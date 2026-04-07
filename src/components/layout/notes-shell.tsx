import Link from "next/link";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { accentCalloutClassName, eyebrowClassName } from "@/components/ui/tailwind-recipes";

const navItems = [
  { href: "/notes", label: "All notes" },
  { href: "/notes/new", label: "New note" },
  { href: "/s/example-token", label: "Public preview" },
];

export function NotesShell({
  children,
  userEmail,
  userName,
}: Readonly<{
  children: ReactNode;
  userEmail: string;
  userName: string;
}>) {
  return (
    <main className="px-6 py-8 text-foreground">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Panel className="flex h-full flex-col gap-8 p-6">
          <div className="space-y-4">
            <StatusBadge>Authenticated</StatusBadge>
            <div className="space-y-2">
              <h1 className="font-display text-3xl text-foreground">Notes workspace</h1>
              <p className="text-sm leading-7 text-muted">
                Signed in as <span className="font-semibold text-foreground">{userName}</span>. Your
                notes remain private unless you explicitly enable sharing.
              </p>
              <p className="text-sm text-muted">{userEmail}</p>
            </div>
            <SignOutButton />
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
          <div className={`${accentCalloutClassName} mt-auto p-4`}>
            <p className={eyebrowClassName}>Session status</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Better Auth is protecting these routes now. Note reads, edits, and sharing controls
              still land in the placeholder workspace until the note feature slice is implemented.
            </p>
          </div>
        </Panel>
        <div className="space-y-6">
          <header className="flex flex-col gap-4 rounded-panel border border-white/70 bg-surface-soft px-6 py-5 shadow-shell backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className={eyebrowClassName}>Authenticated routes</p>
              <h2 className="mt-2 font-display text-3xl text-foreground">Your notes</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <StatusBadge>{userName}</StatusBadge>
              <StatusBadge tone="muted">{userEmail}</StatusBadge>
              <StatusBadge tone="muted">Server actions later</StatusBadge>
            </div>
          </header>
          {children}
        </div>
      </div>
    </main>
  );
}
