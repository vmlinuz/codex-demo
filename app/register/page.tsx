import { PublicPageShell } from "@/components/layout/public-page-shell";
import { AuthFormPlaceholder } from "@/components/placeholders/auth-form-placeholder";

export default function RegisterPage() {
  return (
    <PublicPageShell className="flex max-w-xl justify-center">
      <AuthFormPlaceholder
        companionHref="/login"
        companionLabel="Already have an account?"
        description="Account creation will be connected later. This scaffold only reserves the form, status area, and supporting content."
        modeLabel="Public route"
        submitLabel="Create account"
        title="Create your TinyNotes account"
      />
    </PublicPageShell>
  );
}
