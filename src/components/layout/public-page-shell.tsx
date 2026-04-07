import type { ReactNode } from "react";

type PublicPageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PublicPageShell({ children, className }: Readonly<PublicPageShellProps>) {
  return (
    <main className="px-6 py-10 text-foreground sm:py-12">
      <div className={["mx-auto w-full", className].filter(Boolean).join(" ")}>{children}</div>
    </main>
  );
}
