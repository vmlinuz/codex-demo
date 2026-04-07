import { notFound } from "next/navigation";

import { NoteEditorPlaceholder } from "@/components/placeholders/note-editor-placeholder";
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

  const noteTitle = note.title.trim() || "Untitled note";

  return (
    <NoteEditorPlaceholder
      createdAtLabel={note.createdAt}
      mode="existing"
      noteId={note.id}
      noteLabel="Owned note"
      shareStatusLabel={note.shareEnabled ? "share_enabled: on" : "share_enabled: off"}
      title={noteTitle}
      updatedAtLabel={note.updatedAt}
    />
  );
}
