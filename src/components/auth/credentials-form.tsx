"use client";

import type { FormEvent } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/auth/client";
import { deriveDisplayNameFromEmail } from "@/auth/derive-display-name";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";

type CredentialsFormProps = {
  companionHref: string;
  companionLabel: string;
  description: string;
  mode: "login" | "register";
  submitLabel: string;
  title: string;
};

const fieldClassName =
  "w-full rounded-2xl border border-line bg-white/80 px-4 py-4 text-sm text-foreground outline-none transition placeholder:text-muted/80 focus:border-accent/40 focus:ring-4 focus:ring-accent/10 disabled:cursor-not-allowed disabled:opacity-65";

const submitClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-accent/25 bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:border-accent/40 hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-65";

export function CredentialsForm({
  companionHref,
  companionLabel,
  description,
  mode,
  submitLabel,
  title,
}: Readonly<CredentialsFormProps>) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genericErrorMessage =
    mode === "login"
      ? "Unable to sign in with those credentials."
      : "Unable to create account with those details.";

  const statusLabel = isSubmitting
    ? mode === "login"
      ? "Signing in"
      : "Creating account"
    : "Credentials only";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response =
        mode === "login"
          ? await authClient.signIn.email({
              email,
              password,
            })
          : await authClient.signUp.email({
              email,
              name: deriveDisplayNameFromEmail(email),
              password,
            });

      if (response.error) {
        setErrorMessage(genericErrorMessage);
        return;
      }

      router.replace("/notes");
      router.refresh();
    } catch {
      setErrorMessage(genericErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Panel className="w-full max-w-xl space-y-8 p-8 sm:p-10">
      <SectionHeading description={description} eyebrow="Public route" title={title} />
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <label
            className="flex items-center justify-between text-sm font-medium text-foreground"
            htmlFor={`${mode}-email`}
          >
            <span>Email address</span>
            <StatusBadge tone={isSubmitting ? "accent" : "muted"}>{statusLabel}</StatusBadge>
          </label>
          <input
            autoComplete="email"
            className={fieldClassName}
            disabled={isSubmitting}
            id={`${mode}-email`}
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>
        <div className="space-y-3">
          <label
            className="flex items-center justify-between text-sm font-medium text-foreground"
            htmlFor={`${mode}-password`}
          >
            <span>Password</span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Min 8 chars
            </span>
          </label>
          <input
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className={fieldClassName}
            disabled={isSubmitting}
            id={`${mode}-password`}
            minLength={8}
            name="password"
            placeholder="Enter a secure password"
            required
            type="password"
          />
        </div>
        <div className="rounded-[1.35rem] border border-accent/15 bg-accent/10 p-5">
          <p className="text-sm font-semibold text-foreground">{submitLabel}</p>
          <p className="mt-2 text-sm leading-7 text-muted">
            Sessions are stored in secure cookies and credentials are handled through Better Auth.
          </p>
          {errorMessage ? (
            <div
              aria-live="polite"
              className="mt-4 rounded-2xl border border-[rgba(191,76,91,0.18)] bg-[rgba(191,76,91,0.08)] px-4 py-3 text-sm text-foreground"
            >
              {errorMessage}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-accent/20 bg-white/55 px-4 py-3 text-sm text-muted">
              {mode === "login"
                ? "Use the email and password for your existing TinyNotes account."
                : "A display name will be derived from your email when the account is created."}
            </div>
          )}
        </div>
        <button className={submitClassName} disabled={isSubmitting} type="submit">
          {isSubmitting ? "Please wait..." : submitLabel}
        </button>
      </form>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-sm text-muted">
        <span>Credentials-only auth path, as required by the spec.</span>
        <Link className="font-semibold text-accent-strong" href={companionHref}>
          {companionLabel}
        </Link>
      </div>
    </Panel>
  );
}
