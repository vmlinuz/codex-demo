import { LoadingStatePlaceholder } from "@/components/placeholders/loading-state-placeholder";

export default function NotesLoading() {
  return (
    <LoadingStatePlaceholder
      caption="Authenticated area"
      description="The notes shell already exists. Real session checks and note loading will be attached in a later implementation pass."
      title="Preparing your notes workspace"
    />
  );
}
