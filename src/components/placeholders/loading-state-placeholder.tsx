import { Panel } from "@/components/ui/panel";
import { PlaceholderLines } from "@/components/ui/placeholder-lines";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { accentInsetClassName } from "@/components/ui/tailwind-recipes";

type LoadingStatePlaceholderProps = {
  title: string;
  description: string;
  caption: string;
};

export function LoadingStatePlaceholder({
  title,
  description,
  caption,
}: Readonly<LoadingStatePlaceholderProps>) {
  return (
    <Panel className="space-y-6">
      <SectionHeading description={description} eyebrow={caption} title={title} />
      <div className={accentInsetClassName}>
        <div className="mb-4 flex items-center gap-3">
          <StatusBadge>Loading state</StatusBadge>
          <StatusBadge tone="muted">Static placeholder</StatusBadge>
        </div>
        <PlaceholderLines lines={4} />
      </div>
    </Panel>
  );
}
