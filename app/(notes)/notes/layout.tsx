import type { ReactNode } from "react";

import { NotesShell } from "@/components/layout/notes-shell";
import { requireAuthSession } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function NotesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireAuthSession();

  return (
    <NotesShell userEmail={session.user.email} userName={session.user.name}>
      {children}
    </NotesShell>
  );
}
