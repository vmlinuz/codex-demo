import Link from "next/link";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";

export function NotFoundPlaceholder() {
  return (
    <PublicPageShell className="flex min-h-[calc(100vh-11rem)] max-w-3xl items-center justify-center">
      <div className="w-full">
        <Panel className="w-full space-y-8 p-8 text-center sm:p-10">
          <div className="flex justify-center">
            <StatusBadge tone="strong">404</StatusBadge>
          </div>
          <SectionHeading
            description="The spec requires a custom not-found experience for unknown pages and missing resources. This static version reserves that route now."
            eyebrow="Custom not-found"
            title="This page drifted out of the acqua current"
          />
          <div className="rounded-[1.35rem] border border-line bg-white/70 p-5 text-sm leading-7 text-muted">
            Later, missing notes and invalid public shares can route into this same branded
            experience without exposing implementation details.
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              className="rounded-full border border-accent/20 bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
              href="/"
            >
              Back to root placeholder
            </Link>
            <Link
              className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent/25"
              href="/notes"
            >
              Open notes shell
            </Link>
          </div>
        </Panel>
      </div>
    </PublicPageShell>
  );
}
