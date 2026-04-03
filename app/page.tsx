import { PublicPageShell } from "@/components/layout/public-page-shell";
import { HomeRedirectPlaceholder } from "@/components/placeholders/home-redirect-placeholder";

export default function HomePage() {
  return (
    <PublicPageShell className="flex max-w-2xl justify-center">
      <HomeRedirectPlaceholder />
    </PublicPageShell>
  );
}
