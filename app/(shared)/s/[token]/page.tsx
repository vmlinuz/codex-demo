import { PublicNotePlaceholder } from "@/components/placeholders/public-note-placeholder";

export default async function SharedNotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <PublicNotePlaceholder token={token} />;
}
