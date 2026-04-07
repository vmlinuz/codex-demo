import { PublicPageShell } from "@/components/layout/public-page-shell";
import { CredentialsForm } from "@/components/auth/credentials-form";
import { redirectIfAuthenticated } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <PublicPageShell className="flex max-w-xl justify-center">
      <CredentialsForm
        companionHref="/login"
        companionLabel="Already have an account?"
        description="Create a credentials-only TinyNotes account and start with an authenticated workspace."
        mode="register"
        submitLabel="Create account"
        title="Create your TinyNotes account"
      />
    </PublicPageShell>
  );
}
