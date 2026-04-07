"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/auth/client";

export function SignOutButton() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="space-y-2">
      <button
        className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-accent/20 bg-white/80 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-accent/35 hover:bg-white disabled:cursor-not-allowed disabled:opacity-65"
        disabled={isSubmitting}
        onClick={handleSignOut}
        type="button"
      >
        {isSubmitting ? "Signing out..." : "Sign out"}
      </button>
      {errorMessage ? (
        <p aria-live="polite" className="text-sm text-[rgba(155,57,72,1)]">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
