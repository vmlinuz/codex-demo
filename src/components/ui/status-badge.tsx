import type { ReactNode } from "react";

const toneClasses = {
  accent: "border-accent/15 bg-accent/10 text-accent-strong",
  danger: "border-danger-line bg-danger-soft text-danger",
  muted: "border-line bg-white/65 text-muted",
  strong: "border-accent/20 bg-accent-soft text-accent-strong",
} as const;

type StatusBadgeProps = {
  children: ReactNode;
  tone?: keyof typeof toneClasses;
};

export function StatusBadge({ children, tone = "accent" }: Readonly<StatusBadgeProps>) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-badge ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
