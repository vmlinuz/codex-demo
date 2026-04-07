import { PublicPageShell } from "@/components/layout/public-page-shell";
import { CredentialsForm } from "@/components/auth/credentials-form";
import { redirectIfAuthenticated } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <PublicPageShell className="max-w-xl">
      <CredentialsForm
        companionHref="/register"
        companionLabel="Create an account"
        description="Sign in with the email and password attached to your TinyNotes account."
        mode="login"
        submitLabel="Sign in"
        title="Welcome back to TinyNotes"
      />
    </PublicPageShell>
  );
}
