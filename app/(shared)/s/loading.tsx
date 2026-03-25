import { LoadingStatePlaceholder } from "@/components/placeholders/loading-state-placeholder";

export default function SharedNoteLoading() {
  return (
    <LoadingStatePlaceholder
      caption="Public route"
      description="The token route is in place. Token validation, note lookup, and sanitization will be implemented later."
      title="Loading shared note"
    />
  );
}
