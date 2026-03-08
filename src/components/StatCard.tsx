import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, trend, icon, children, className }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <p className="text-2xl font-semibold font-display tracking-tight">{value}</p>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium mb-0.5",
              trend.positive ? "text-success" : "text-destructive"
            )}
          >
            {trend.positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
