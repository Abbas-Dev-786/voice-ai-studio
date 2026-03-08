import { EmptyState } from "@/components/EmptyState";
import { Construction } from "lucide-react";

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <EmptyState
        icon={Construction}
        title="Coming soon"
        description={`The ${title.toLowerCase()} feature is under development.`}
      />
    </div>
  );
}
