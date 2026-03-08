import { cn } from "@/lib/utils";

type Status = "live" | "paused" | "error" | "draft";

const statusConfig: Record<Status, { label: string; dotClass: string; bgClass: string; textClass: string }> = {
  live: {
    label: "Live",
    dotClass: "bg-success animate-pulse-dot",
    bgClass: "bg-success/10",
    textClass: "text-success",
  },
  paused: {
    label: "Paused",
    dotClass: "bg-warning",
    bgClass: "bg-warning/10",
    textClass: "text-warning",
  },
  error: {
    label: "Error",
    dotClass: "bg-destructive",
    bgClass: "bg-destructive/10",
    textClass: "text-destructive",
  },
  draft: {
    label: "Draft",
    dotClass: "bg-muted-foreground",
    bgClass: "bg-muted",
    textClass: "text-muted-foreground",
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
}
