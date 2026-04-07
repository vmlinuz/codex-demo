import Link from "next/link";

import { Panel } from "@/components/ui/panel";
import { PlaceholderLines } from "@/components/ui/placeholder-lines";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { primaryPillButtonClassName, subtleCardClassName } from "@/components/ui/tailwind-recipes";

const sampleNotes = [
  { title: "Project kickoff notes", updated: "updated_at placeholder" },
  { title: "Editorial outline", updated: "updated_at placeholder" },
  { title: "Private research draft", updated: "updated_at placeholder" },
];

export function NotesListPlaceholder() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Panel className="space-y-6">
        <SectionHeading
          actions={
            <Link className={primaryPillButtonClassName} href="/notes/new">
              New note route
            </Link>
          }
          description="This page reserves the fixed note-list structure from the spec: no search, no filters, no alternate sort modes."
          eyebrow="GET /notes"
          title="Your notes"
        />
        <div className="grid gap-4">
          {sampleNotes.map((note) => (
            <article
              key={note.title}
              className={`${subtleCardClassName} transition hover:border-accent/25 hover:bg-white`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{note.title}</h3>
                  <PlaceholderLines lines={2} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge>Private</StatusBadge>
                  <StatusBadge tone="muted">{note.updated}</StatusBadge>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Panel>
      <div className="space-y-6">
        <Panel className="space-y-4">
          <SectionHeading
            description="A dedicated empty state is part of the route scaffold, even before the real data layer exists."
            eyebrow="Empty state"
            title="No notes yet"
          />
          <p className="text-sm leading-7 text-muted">
            When the database layer is added, this panel can appear when the authenticated user has
            not created any notes.
          </p>
        </Panel>
        <Panel className="space-y-4">
          <SectionHeading
            description="Future behaviors reserved here so the page shape is stable before implementation."
            eyebrow="Future hooks"
            title="Reserved slots"
          />
          <div className="space-y-3 text-sm leading-7 text-muted">
            <p>Sorted by `updated_at DESC`.</p>
            <p>No query params, search, or filtering surfaces.</p>
            <p>Share state and timestamps will become real note metadata later.</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
