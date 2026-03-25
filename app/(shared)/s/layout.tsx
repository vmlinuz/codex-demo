import type { ReactNode } from "react";

import { SharedNoteShell } from "@/components/layout/shared-note-shell";

export default function SharedRouteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <SharedNoteShell>{children}</SharedNoteShell>;
}
