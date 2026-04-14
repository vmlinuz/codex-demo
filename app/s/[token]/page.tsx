import { notFound } from "next/navigation";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatNoteDate } from "@/notes/formatting";
import { findSharedNoteByToken } from "@/server/notes";

export default async function SharedNotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const note = findSharedNoteByToken(token);

  if (!note) {
    notFound();
  }

  const noteTitle = note.title.trim() || "Untitled shared note";

  return (
    <PublicPageShell className="max-w-5xl">
      <article className="rounded-panel border border-line bg-surface p-8 shadow-panel sm:p-10">
        <header className="space-y-4 border-b border-line pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge tone="muted">Shared note</StatusBadge>
            <StatusBadge tone="muted">updated_at: {formatNoteDate(note.updatedAt)}</StatusBadge>
          </div>
          <h1 className="font-display text-4xl text-foreground">{noteTitle}</h1>
        </header>
        <div
          className="note-rich-text mt-8"
          dangerouslySetInnerHTML={{ __html: note.contentHtml }}
        />
      </article>
    </PublicPageShell>
  );
}
