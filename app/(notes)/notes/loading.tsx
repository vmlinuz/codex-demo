import { LoadingStatePlaceholder } from "@/components/placeholders/loading-state-placeholder";

export default function NotesLoading() {
  return (
    <LoadingStatePlaceholder
      caption="Authenticated area"
      description="The authenticated notes workspace is loading server-rendered note data and preparing the TipTap editor surface."
      title="Preparing your notes workspace"
    />
  );
}
