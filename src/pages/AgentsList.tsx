import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

const agents = [
  { id: "1", name: "Sales Bot Pro", status: "live" as const, model: "GPT-4o", voice: "Rachel", campaignsCount: 2 },
  { id: "2", name: "Support AI", status: "live" as const, model: "Claude 3.5 Sonnet", voice: "Adam", campaignsCount: 1 },
  { id: "3", name: "Outreach Pro", status: "paused" as const, model: "GPT-4o Mini", voice: "Bella", campaignsCount: 1 },
  { id: "4", name: "Follow-up Agent", status: "live" as const, model: "GPT-4o", voice: "Antoni", campaignsCount: 1 },
  { id: "5", name: "Survey Agent", status: "draft" as const, model: "Gemini 1.5 Flash", voice: "Elli", campaignsCount: 0 },
];

const columns: Column<typeof agents[0]>[] = [
  { key: "name", label: "Agent Name", sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "model", label: "Model", sortable: true, hideOnMobile: true, render: (r) => (
    <Badge variant="secondary" className="text-xs font-normal">{r.model}</Badge>
  )},
  { key: "voice", label: "Voice", sortable: true, hideOnMobile: true },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "campaignsCount", label: "Campaigns", sortable: true, hideOnMobile: true, render: (r) => (
    <span className="text-sm text-muted-foreground">{r.campaignsCount}</span>
  )},
];

export default function AgentsList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
          <p className="text-sm text-muted-foreground">Agent configurations & templates. Create and manage agents within campaigns.</p>
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
