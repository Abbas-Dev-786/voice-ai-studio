import { EmptyState } from "@/components/EmptyState";
import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Call volume, success rates, and cost analysis</p>
      </div>
      <EmptyState
        icon={BarChart3}
        title="Analytics coming soon"
        description="Call volume charts, success/failure rates, average duration, and cost analysis will appear here."
      />
    </div>
  );
}
