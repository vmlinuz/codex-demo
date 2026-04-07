import { notFound } from "next/navigation";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { PublicNotePlaceholder } from "@/components/placeholders/public-note-placeholder";
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
      <PublicNotePlaceholder title={noteTitle} updatedAtLabel={note.updatedAt} />
    </PublicPageShell>
  );
}
