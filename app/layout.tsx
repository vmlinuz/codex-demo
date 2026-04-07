import type { Metadata } from "next";
import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  eyebrowClassName,
  ghostPillButtonClassName,
  surfacePillButtonClassName,
} from "@/components/ui/tailwind-recipes";
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
          <header className="border-b border-white/70 bg-surface-header backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
              <Link className={eyebrowClassName} href="/">
                TinyNotes
              </Link>
              <nav className="flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <Link className={surfacePillButtonClassName} href="/notes">
                      Notes
                    </Link>
                    <SignOutButton variant="header" />
                  </>
                ) : (
                  <>
                    <Link className={ghostPillButtonClassName} href="/login">
                      Login
                    </Link>
                    <Link className={surfacePillButtonClassName} href="/register">
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
