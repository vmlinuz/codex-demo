"use client";

import { useState } from "react";

import { authClient } from "@/auth/client";
import { replaceLocation } from "@/auth/client-navigation";
import {
  bodyErrorTextClassName,
  compactErrorTextClassName,
  ghostPillButtonClassName,
  surfacePillButtonClassName,
} from "@/components/ui/tailwind-recipes";

type SignOutButtonProps = {
  variant?: "default" | "header";
};

export function SignOutButton({ variant = "default" }: SignOutButtonProps) {
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

      replaceLocation("/login");
    } catch {
      setErrorMessage("Unable to sign out right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={["space-y-2", isHeaderVariant ? "w-fit" : null].filter(Boolean).join(" ")}>
      <button
        className={
          isHeaderVariant
            ? `inline-flex items-center justify-center ${ghostPillButtonClassName} disabled:cursor-not-allowed disabled:opacity-65`
            : `inline-flex items-center ${surfacePillButtonClassName} min-h-11 w-full justify-center rounded-2xl font-semibold disabled:cursor-not-allowed disabled:opacity-65`
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
          className={isHeaderVariant ? compactErrorTextClassName : bodyErrorTextClassName}
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
