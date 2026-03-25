import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
};

export function SectionHeading({
  title,
  description,
  eyebrow,
  actions,
}: Readonly<SectionHeadingProps>) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-strong">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h2 className="font-display text-3xl leading-tight text-foreground">{title}</h2>
          {description ? <p className="max-w-2xl text-sm leading-7 text-muted">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
