import { AuthFormPlaceholder } from "@/components/placeholders/auth-form-placeholder";

export default function LoginPage() {
  return (
    <AuthFormPlaceholder
      companionHref="/register"
      companionLabel="Create an account"
      description="Credential sign-in will live here once better-auth is wired in. For now, this page only defines the final route and visual structure."
      modeLabel="Public route"
      submitLabel="Sign in"
      title="Welcome back to TinyNotes"
    />
  );
}
