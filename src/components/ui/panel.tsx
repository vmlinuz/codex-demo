import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
};

export function Panel({ children, className }: Readonly<PanelProps>) {
  return (
    <section
      className={`rounded-[1.75rem] border border-white/70 bg-surface p-6 shadow-[0_24px_60px_var(--shadow)] backdrop-blur ${className ?? ""}`}
    >
      {children}
    </section>
  );
}
