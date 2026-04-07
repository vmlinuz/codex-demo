import { LoadingStatePlaceholder } from "@/components/placeholders/loading-state-placeholder";

export default function NotesLoading() {
  return (
    <LoadingStatePlaceholder
      caption="Authenticated area"
      description="The notes shell already exists. Session enforcement is active, and detail routes now load owned notes before rendering."
      title="Preparing your notes workspace"
    />
  );
}
