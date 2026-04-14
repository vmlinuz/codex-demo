import Link from "next/link";

import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  primaryPillButtonClassName,
  secondaryPillButtonClassName,
  subtleCardClassName,
} from "@/components/ui/tailwind-recipes";
import { formatNoteDate } from "@/notes/formatting";
import type { NoteSummary } from "@/notes/types";

type NotesListProps = {
  notes: NoteSummary[];
};

export function NotesList({ notes }: Readonly<NotesListProps>) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Panel className="space-y-6">
        <SectionHeading
          actions={
            <Link className={primaryPillButtonClassName} href="/notes/new">
              New note
            </Link>
          }
          description="Rich text notes are private by default, sorted by the latest saved change, and opened directly without search or filter detours."
          eyebrow="GET /notes"
          title="Your notes"
        />
        {notes.length ? (
          <div className="grid gap-4">
            {notes.map((note) => (
              <Link
                key={note.id}
                className={`${subtleCardClassName} block transition hover:border-accent/25 hover:bg-white`}
                href={`/notes/${note.id}`}
              >
                <article className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl leading-tight text-foreground">
                        {note.title.trim() || "Untitled note"}
                      </h3>
                      <p className="max-w-2xl text-sm leading-7 text-muted">
                        {note.excerpt || "No content yet. Open the note to start writing."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge tone={note.shareEnabled ? "strong" : "muted"}>
                        {note.shareEnabled ? "Shared" : "Private"}
                      </StatusBadge>
                      <StatusBadge tone="muted">{formatNoteDate(note.updatedAt)}</StatusBadge>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-card-lg border border-dashed border-accent/20 bg-accent/5 px-6 py-8">
            <h3 className="font-display text-2xl text-foreground">No notes yet</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              Create your first note to open the authenticated TipTap workspace. Notes can be shared
              later from the note detail page.
            </p>
            <div className="mt-5">
              <Link className={secondaryPillButtonClassName} href="/notes/new">
                Create your first note
              </Link>
            </div>
          </div>
        )}
      </Panel>
      <div className="space-y-6">
        <Panel className="space-y-4">
          <SectionHeading
            description="The authenticated notes area uses server reads and server-side mutations while keeping ownership checks in the data layer."
            eyebrow="Workspace rules"
            title="How it behaves"
          />
          <div className="space-y-3 text-sm leading-7 text-muted">
            <p>Reads happen in React Server Components.</p>
            <p>Creates and edits go through Server Actions only.</p>
            <p>Autosave starts after a note has been created.</p>
          </div>
        </Panel>
        <Panel className="space-y-4">
          <SectionHeading
            description="Delete and share controls are available per note without changing the streamlined list workflow."
            eyebrow="Current scope"
            title="What is included"
          />
          <div className="space-y-3 text-sm leading-7 text-muted">
            <p>Delete and share controls live on the note detail route.</p>
            <p>Public links are tokenized and can be rotated by re-enabling sharing.</p>
            <p>No search, filtering, or alternate sort modes are introduced.</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
