import { Panel } from "@/components/ui/panel";
import { PlaceholderLines } from "@/components/ui/placeholder-lines";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { accentInsetClassName, surfaceInsetCardClassName } from "@/components/ui/tailwind-recipes";

export function PublicNotePlaceholder({
  title,
  updatedAtLabel,
}: Readonly<{
  title: string;
  updatedAtLabel: string;
}>) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <Panel className="space-y-8 p-8 sm:p-10">
        <SectionHeading
          actions={
            <>
              <StatusBadge tone="muted">Validated share</StatusBadge>
              <StatusBadge tone="muted">updated_at: {updatedAtLabel}</StatusBadge>
            </>
          }
          description="In the real implementation, this page will render server-generated sanitized HTML for a publicly shared note."
          eyebrow="GET /s/[token]"
          title="Shared note placeholder"
        />
        <div className="rounded-card-lg border border-line bg-white/75 p-6">
          <div className="space-y-4">
            <h2 className="font-display text-3xl text-foreground">{title}</h2>
            <p className="text-sm leading-7 text-muted">
              This content block stands in for the future sanitized TipTap HTML output.
            </p>
          </div>
          <div className={`${accentInsetClassName} mt-6 space-y-5`}>
            <PlaceholderLines lines={4} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className={surfaceInsetCardClassName}>
                <p className="text-sm font-semibold text-foreground">Rendered prose</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Paragraphs, headings, lists, and links will be sanitized and rendered here.
                </p>
              </div>
              <div className={surfaceInsetCardClassName}>
                <p className="text-sm font-semibold text-foreground">Security boundary</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Invalid, disabled, or missing shares now collapse to the same 404 path.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Panel>
      <Panel className="space-y-4">
        <SectionHeading
          description="Reserved metadata and public-route notes without leaking any implementation details."
          eyebrow="Public view"
          title="Pending behavior"
        />
        <div className="space-y-3 text-sm leading-7 text-muted">
          <p>Share token validation happens on the server before this route renders.</p>
          <p>Sanitization and rendering are not implemented yet.</p>
          <p>No auth is required here once the share is valid.</p>
        </div>
      </Panel>
    </div>
  );
}
