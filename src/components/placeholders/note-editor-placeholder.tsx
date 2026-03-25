import { Panel } from "@/components/ui/panel";
import { PlaceholderLines } from "@/components/ui/placeholder-lines";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";

type NoteEditorPlaceholderProps = {
  mode: "new" | "existing";
  title: string;
  noteLabel: string;
  createdAtLabel: string;
  updatedAtLabel: string;
  noteId?: string;
};

export function NoteEditorPlaceholder({
  mode,
  title,
  noteLabel,
  createdAtLabel,
  updatedAtLabel,
  noteId,
}: Readonly<NoteEditorPlaceholderProps>) {
  const isExisting = mode === "existing";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Panel className="space-y-6">
        <SectionHeading
          actions={
            <>
              <StatusBadge>{noteLabel}</StatusBadge>
              {noteId ? <StatusBadge tone="muted">id: {noteId}</StatusBadge> : null}
            </>
          }
          description="This reserves the editor route structure only. TipTap, autosave, validation, and Server Actions are intentionally deferred."
          eyebrow={isExisting ? "GET /notes/[id]" : "GET /notes/new"}
          title={title}
        />
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="rounded-[1.35rem] border border-line bg-white/75 p-5">
              <p className="text-sm font-medium text-foreground">Title field placeholder</p>
              <p className="mt-2 text-sm leading-7 text-muted">
                A simple title input will live here once note creation and updates are implemented.
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-line bg-white/75 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">Editor surface placeholder</p>
                <StatusBadge tone="muted">TipTap later</StatusBadge>
              </div>
              <div className="mt-4 rounded-[1.15rem] border border-dashed border-accent/20 bg-accent/5 p-5">
                <PlaceholderLines lines={5} />
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
                    <p className="text-sm font-semibold text-foreground">Formatting rail</p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      Toolbar and editor-only client interactivity will be introduced here later.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
                    <p className="text-sm font-semibold text-foreground">Content canvas</p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      JSON storage and sanitized HTML rendering are not connected in this pass.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-[1.35rem] border border-line bg-white/75 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-strong">
                Save status slot
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Placeholder for future saving, saved, and generic error states.
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-line bg-white/75 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-strong">
                Share controls slot
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Enable and disable share actions will appear here once the sharing flow exists.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge tone="muted">share_enabled: placeholder</StatusBadge>
                <StatusBadge tone="muted">token: placeholder</StatusBadge>
              </div>
            </div>
            <div className="rounded-[1.35rem] border border-line bg-white/75 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-strong">
                Note metadata
              </p>
              <dl className="mt-4 space-y-3 text-sm text-muted">
                <div className="flex items-center justify-between gap-4">
                  <dt>created_at</dt>
                  <dd>{createdAtLabel}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>updated_at</dt>
                  <dd>{updatedAtLabel}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>mode</dt>
                  <dd>{mode}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Panel>
      <Panel className="space-y-4">
        <SectionHeading
          description="This sidebar keeps the future implementation boundaries visible while the route is still static."
          eyebrow="Spec guardrails"
          title="What comes later"
        />
        <div className="space-y-3 text-sm leading-7 text-muted">
          <p>No client-side fetch for initial note data.</p>
          <p>Server Actions handle create, update, delete, and share toggles.</p>
          <p>Payload validation, ownership checks, and error contracts are still pending.</p>
        </div>
      </Panel>
    </div>
  );
}
