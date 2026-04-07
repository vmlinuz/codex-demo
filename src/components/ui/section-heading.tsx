import type { ReactNode } from "react";

import { eyebrowClassName } from "@/components/ui/tailwind-recipes";

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
        {eyebrow ? <p className={eyebrowClassName}>{eyebrow}</p> : null}
        <div className="space-y-1">
          <h2 className="font-display text-3xl leading-tight text-foreground">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-7 text-muted">{description}</p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
