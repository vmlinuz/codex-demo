import { NoteEditorPlaceholder } from "@/components/placeholders/note-editor-placeholder";

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <NoteEditorPlaceholder
      createdAtLabel="Placeholder timestamp"
      mode="existing"
      noteId={id}
      noteLabel="Owned note route"
      title="Edit note"
      updatedAtLabel="Placeholder updated_at"
    />
  );
}
