import { NotesList } from "@/components/notes/notes-list";
import { requireAuthSession } from "@/server/auth";
import { listOwnedNotes } from "@/server/notes";

export default async function NotesPage() {
  const session = await requireAuthSession();
  const notes = listOwnedNotes(session.user.id);

  return <NotesList notes={notes} />;
}
