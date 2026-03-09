import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

const agents = [
  { id: "1", name: "Sales Bot Pro", status: "live" as const, calls: 1284, successRate: "94.2%", campaign: "Q1 Outreach", lastActive: "2 min ago" },
  { id: "2", name: "Support AI", status: "live" as const, calls: 856, successRate: "97.1%", campaign: "Product Launch", lastActive: "5 min ago" },
  { id: "3", name: "Outreach Pro", status: "paused" as const, calls: 432, successRate: "88.5%", campaign: "Q1 Outreach", lastActive: "1 hr ago" },
  { id: "4", name: "Follow-up Agent", status: "live" as const, calls: 200, successRate: "58%", campaign: "Q1 Outreach", lastActive: "12 min ago" },
  { id: "5", name: "Survey Agent", status: "draft" as const, calls: 0, successRate: "—", campaign: "Survey Q1", lastActive: "Never" },
];

const columns: Column<typeof agents[0]>[] = [
  { key: "name", label: "Agent Name", sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "campaign", label: "Campaign", sortable: true, hideOnMobile: true, render: (r) => (
    <Badge variant="secondary" className="text-xs font-normal">{r.campaign}</Badge>
  )},
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "calls", label: "Total Calls", sortable: true, hideOnMobile: true },
  { key: "successRate", label: "Success Rate", sortable: true, hideOnMobile: true },
  { key: "lastActive", label: "Last Active", sortable: true, hideOnMobile: true },
];

export default function AgentsList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
          <p className="text-sm text-muted-foreground">All agents across your campaigns. Create & manage agents within each campaign.</p>
        </div>
      </div>

      {agents.length > 0 ? (
        <DataTable
          columns={columns}
          data={agents}
          searchKey="name"
          searchPlaceholder="Search agents..."
          onRowClick={(row) => navigate(`/agents/${row.id}`)}
        />
      ) : (
        <EmptyState
          icon={Bot}
          title="No agents yet"
          description="Create agents within a campaign to get started."
          actionLabel="Go to Campaigns"
          onAction={() => navigate("/campaigns")}
        />
      )}
    </div>
  );
}
