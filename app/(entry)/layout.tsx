import type { ReactNode } from "react";

import { EntryShell } from "@/components/layout/entry-shell";

export default function EntryLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <EntryShell>{children}</EntryShell>;
}
