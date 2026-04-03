import { PublicPageShell } from "@/components/layout/public-page-shell";
import { PublicNotePlaceholder } from "@/components/placeholders/public-note-placeholder";

export default async function SharedNotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <PublicPageShell className="max-w-5xl">
      <PublicNotePlaceholder token={token} />
    </PublicPageShell>
  );
}
