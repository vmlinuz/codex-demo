"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/auth/client";

type SignOutButtonProps = {
  variant?: "default" | "header";
};

export function SignOutButton({ variant = "default" }: SignOutButtonProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isHeaderVariant = variant === "header";

  async function handleSignOut() {
    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await authClient.signOut();

      if (response.error) {
        setErrorMessage("Unable to sign out right now.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setErrorMessage("Unable to sign out right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={isHeaderVariant ? "w-fit space-y-2" : "space-y-2"}>
      <button
        className={
          isHeaderVariant
            ? "inline-flex items-center justify-center rounded-full border border-transparent px-4 py-2 text-sm font-medium text-muted transition hover:border-accent/15 hover:bg-white/70 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-65"
            : "inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-accent/20 bg-white/80 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:bg-white disabled:cursor-not-allowed disabled:opacity-65"
        }
        disabled={isSubmitting}
        onClick={handleSignOut}
        type="button"
      >
        {isSubmitting ? "Signing out..." : "Sign out"}
      </button>
      {errorMessage ? (
        <p
          aria-live="polite"
          className={
            isHeaderVariant
              ? "max-w-40 text-xs text-[rgba(155,57,72,1)]"
              : "text-sm text-[rgba(155,57,72,1)]"
          }
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
