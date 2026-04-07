import Link from "next/link";

import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  primaryPillButtonClassName,
  secondaryPillButtonClassName,
  subtleCardClassName,
} from "@/components/ui/tailwind-recipes";

export function HomeRedirectPlaceholder() {
  return (
    <Panel className="w-full max-w-2xl space-y-8 p-8 sm:p-10">
      <SectionHeading
        description="The real root route will inspect the session and redirect to `/notes` or `/login`. This placeholder keeps the route visible without adding auth logic yet."
        eyebrow="Root route"
        title="Future redirect staging page"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`${subtleCardClassName} bg-white/70`}>
          <StatusBadge>Authenticated</StatusBadge>
          <p className="mt-4 text-lg font-semibold text-foreground">
            Eventually redirects to `/notes`
          </p>
          <p className="mt-2 text-sm leading-7 text-muted">
            The notes dashboard is already scaffolded and ready for real session-aware routing
            later.
          </p>
        </div>
        <div className={`${subtleCardClassName} bg-white/70`}>
          <StatusBadge tone="muted">Unauthenticated</StatusBadge>
          <p className="mt-4 text-lg font-semibold text-foreground">
            Eventually redirects to `/login`
          </p>
          <p className="mt-2 text-sm leading-7 text-muted">
            The auth entry pages are present, but the credential flow is intentionally not wired
            yet.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link className={primaryPillButtonClassName} href="/login">
          Visit login placeholder
        </Link>
        <Link className={secondaryPillButtonClassName} href="/notes">
          Visit notes shell
        </Link>
      </div>
    </Panel>
  );
}
