import type { ReactNode } from "react";

import { NotesShell } from "@/components/layout/notes-shell";

export default function NotesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <NotesShell>{children}</NotesShell>;
}
