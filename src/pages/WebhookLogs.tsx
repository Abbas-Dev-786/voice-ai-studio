import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";

const webhookEvents = [
  { id: "1", event: "call.completed", endpoint: "https://api.acme.com/hooks/calls", status: "live" as const, responseCode: "200", time: "2 min ago" },
  { id: "2", event: "call.completed", endpoint: "https://api.acme.com/hooks/calls", status: "live" as const, responseCode: "200", time: "5 min ago" },
  { id: "3", event: "campaign.updated", endpoint: "https://api.acme.com/hooks/campaigns", status: "error" as const, responseCode: "500", time: "12 min ago" },
  { id: "4", event: "call.failed", endpoint: "https://api.acme.com/hooks/calls", status: "live" as const, responseCode: "200", time: "18 min ago" },
  { id: "5", event: "agent.created", endpoint: "https://api.acme.com/hooks/agents", status: "live" as const, responseCode: "201", time: "1 hr ago" },
  { id: "6", event: "call.completed", endpoint: "https://api.acme.com/hooks/calls", status: "error" as const, responseCode: "timeout", time: "2 hrs ago" },
];

const columns: Column<typeof webhookEvents[0]>[] = [
  { key: "event", label: "Event", render: (r) => <Badge variant="secondary" className="font-mono text-xs">{r.event}</Badge> },
  { key: "endpoint", label: "Endpoint", hideOnMobile: true, render: (r) => <span className="font-mono text-xs truncate max-w-[200px] block">{r.endpoint}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "responseCode", label: "Response", hideOnMobile: true, render: (r) => (
    <span className={`font-mono text-sm ${r.responseCode.startsWith("2") ? "text-success" : "text-destructive"}`}>{r.responseCode}</span>
  )},
  { key: "time", label: "Time", hideOnMobile: true },
  { key: "actions", label: "", render: (r) => r.status === "error" ? (
    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => e.stopPropagation()}>
      <RefreshCw className="mr-1 h-3 w-3" /> Retry
    </Button>
  ) : null },
];

export default function WebhookLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Webhook Logs</h1>
        <p className="text-sm text-muted-foreground">Monitor webhook events and retry failures</p>
      </div>
      <DataTable columns={columns} data={webhookEvents} searchKey="event" searchPlaceholder="Search events..." />
    </div>
  );
}
