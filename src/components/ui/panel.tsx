import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
};

export function Panel({ children, className }: Readonly<PanelProps>) {
  return (
    <section
      className={[
        "rounded-panel border border-white/70 bg-surface p-6 shadow-panel backdrop-blur",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}
