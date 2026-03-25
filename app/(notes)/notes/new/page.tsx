import { NoteEditorPlaceholder } from "@/components/placeholders/note-editor-placeholder";

export default function NewNotePage() {
  return (
    <NoteEditorPlaceholder
      createdAtLabel="Will be assigned when a note is created"
      mode="new"
      noteLabel="Draft route"
      title="Create a new note"
      updatedAtLabel="Waiting for first save"
    />
  );
}
