import { PublicPageShell } from "@/components/layout/public-page-shell";
import { LoadingStatePlaceholder } from "@/components/placeholders/loading-state-placeholder";

export default function SharedNoteLoading() {
  return (
    <PublicPageShell className="max-w-5xl">
      <LoadingStatePlaceholder
        caption="Public route"
        description="Loading validated shared-note content from the server."
        title="Loading shared note"
      />
    </PublicPageShell>
  );
}
