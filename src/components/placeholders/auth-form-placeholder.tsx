import Link from "next/link";

import { Panel } from "@/components/ui/panel";
import { PlaceholderLines } from "@/components/ui/placeholder-lines";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { accentCalloutClassName, splitMetaRowClassName } from "@/components/ui/tailwind-recipes";

type AuthFormPlaceholderProps = {
  title: string;
  description: string;
  submitLabel: string;
  companionLabel: string;
  companionHref: string;
  modeLabel: string;
};

export function AuthFormPlaceholder({
  title,
  description,
  submitLabel,
  companionLabel,
  companionHref,
  modeLabel,
}: Readonly<AuthFormPlaceholderProps>) {
  return (
    <Panel className="w-full max-w-xl space-y-8 p-8 sm:p-10">
      <SectionHeading description={description} eyebrow={modeLabel} title={title} />
      <div className="space-y-5">
        {["Email address", "Password"].map((field) => (
          <div key={field} className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium text-foreground">
              <span>{field}</span>
              <StatusBadge tone="muted">Placeholder</StatusBadge>
            </div>
            <div className="rounded-2xl border border-line bg-white/70 px-4 py-4 text-sm text-muted">
              Input shell reserved for future form wiring
            </div>
          </div>
        ))}
      </div>
      <div className={accentCalloutClassName}>
        <p className="text-sm font-semibold text-foreground">{submitLabel}</p>
        <p className="mt-2 text-sm leading-7 text-muted">
          Server-side validation, generic error messages, and session creation will be added later.
        </p>
        <div className="mt-4 rounded-2xl border border-dashed border-accent/20 bg-white/55 p-4">
          <PlaceholderLines lines={3} />
        </div>
      </div>
      <div className={splitMetaRowClassName}>
        <span>Credentials-only auth path reserved by spec.</span>
        <Link className="font-semibold text-accent-strong" href={companionHref}>
          {companionLabel}
        </Link>
      </div>
    </Panel>
  );
}
