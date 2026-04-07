import Link from "next/link";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  primaryPillButtonClassName,
  secondaryPillButtonClassName,
  subtleCardClassName,
} from "@/components/ui/tailwind-recipes";

export function NotFoundPlaceholder() {
  return (
    <PublicPageShell className="grid min-h-[calc(100svh-11rem)] max-w-3xl place-items-center">
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
          <div className={`${subtleCardClassName} bg-white/70 text-sm leading-7 text-muted`}>
            Later, missing notes and invalid public shares can route into this same branded
            experience without exposing implementation details.
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link className={primaryPillButtonClassName} href="/">
              Back to root placeholder
            </Link>
            <Link className={secondaryPillButtonClassName} href="/notes">
              Open notes shell
            </Link>
          </div>
        </Panel>
      </div>
    </PublicPageShell>
  );
}
