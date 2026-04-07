import type { Metadata } from "next";
import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { hasAuthSessionCookie } from "@/server/auth";

import "./globals.css";

export const metadata: Metadata = {
  title: "TinyNotes",
  description:
    "Private notes with secure sharing, built around React Server Components and Server Actions.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = await hasAuthSessionCookie();

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen">
          <header className="border-b border-white/70 bg-[rgba(245,252,250,0.82)] backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
              <Link
                className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-strong"
                href="/"
              >
                TinyNotes
              </Link>
              <nav className="flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      className="rounded-full border border-accent/20 bg-white/80 px-4 py-2 text-sm font-medium text-foreground shadow-[0_12px_30px_var(--shadow)] transition hover:border-accent/35 hover:bg-white"
                      href="/notes"
                    >
                      Notes
                    </Link>
                    <SignOutButton variant="header" />
                  </>
                ) : (
                  <>
                    <Link
                      className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-muted transition hover:border-accent/15 hover:bg-white/70 hover:text-foreground"
                      href="/login"
                    >
                      Login
                    </Link>
                    <Link
                      className="rounded-full border border-accent/20 bg-white/80 px-4 py-2 text-sm font-medium text-foreground shadow-[0_12px_30px_var(--shadow)] transition hover:border-accent/35 hover:bg-white"
                      href="/register"
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
