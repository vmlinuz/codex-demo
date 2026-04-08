import { notFound } from "next/navigation";

import { NoteEditor } from "@/components/notes/note-editor";
import { requireAuthSession } from "@/server/auth";
import { findOwnedNoteById } from "@/server/notes";

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuthSession();
  const { id } = await params;
  const note = findOwnedNoteById({
    noteId: id,
    userId: session.user.id,
  });

  if (!note) {
    notFound();
  }

  return <NoteEditor mode="existing" note={note} />;
}
