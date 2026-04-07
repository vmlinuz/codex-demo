import { PublicPageShell } from "@/components/layout/public-page-shell";
import { LoadingStatePlaceholder } from "@/components/placeholders/loading-state-placeholder";

export default function SharedNoteLoading() {
  return (
    <PublicPageShell className="max-w-5xl">
      <LoadingStatePlaceholder
        caption="Public route"
        description="The public route now validates share tokens and note existence on the server. Sanitized HTML rendering is still pending."
        title="Loading shared note"
      />
    </PublicPageShell>
  );
}
