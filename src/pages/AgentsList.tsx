import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Bot } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

const agents = [
  { id: "1", name: "Sales Bot", status: "live" as const, calls: 1284, successRate: "94.2%", lastActive: "2 min ago" },
  { id: "2", name: "Support AI", status: "live" as const, calls: 856, successRate: "97.1%", lastActive: "5 min ago" },
  { id: "3", name: "Outreach Pro", status: "paused" as const, calls: 432, successRate: "88.5%", lastActive: "1 hr ago" },
  { id: "4", name: "Survey Agent", status: "draft" as const, calls: 0, successRate: "—", lastActive: "Never" },
];

const columns: Column<typeof agents[0]>[] = [
  { key: "name", label: "Agent Name", sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "calls", label: "Total Calls", sortable: true },
  { key: "successRate", label: "Success Rate", sortable: true },
  { key: "lastActive", label: "Last Active", sortable: true },
];

export default function AgentsList() {
  const navigate = useNavigate();
  const hasAgents = agents.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
          <p className="text-sm text-muted-foreground">Manage your voice AI agents</p>
        </div>
        <Button onClick={() => navigate("/agents/new")}>
          <Plus className="mr-2 h-4 w-4" /> Create Agent
        </Button>
      </div>

      {hasAgents ? (
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
          description="Create your first voice AI agent to start making calls."
          actionLabel="Create Agent"
          onAction={() => navigate("/agents/new")}
        />
      )}
    </div>
  );
}
