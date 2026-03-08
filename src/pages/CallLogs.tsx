import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { PhoneCall } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

const calls = [
  { id: "1", contact: "+1 (555) 123-4567", agent: "Sales Bot", direction: "Outbound", duration: "3:42", status: "live" as const, cost: "$0.12", time: "2 min ago" },
  { id: "2", contact: "+1 (555) 987-6543", agent: "Support AI", direction: "Inbound", duration: "1:15", status: "live" as const, cost: "$0.04", time: "5 min ago" },
  { id: "3", contact: "+1 (555) 456-7890", agent: "Outreach Pro", direction: "Outbound", duration: "5:08", status: "live" as const, cost: "$0.18", time: "12 min ago" },
  { id: "4", contact: "+1 (555) 321-0987", agent: "Sales Bot", direction: "Outbound", duration: "0:45", status: "error" as const, cost: "$0.02", time: "18 min ago" },
  { id: "5", contact: "+1 (555) 654-3210", agent: "Survey Agent", direction: "Outbound", duration: "2:33", status: "live" as const, cost: "$0.09", time: "25 min ago" },
  { id: "6", contact: "+1 (555) 789-0123", agent: "Support AI", direction: "Inbound", duration: "4:12", status: "live" as const, cost: "$0.15", time: "30 min ago" },
  { id: "7", contact: "+1 (555) 234-5678", agent: "Outreach Pro", direction: "Outbound", duration: "1:58", status: "live" as const, cost: "$0.07", time: "35 min ago" },
  { id: "8", contact: "+1 (555) 876-5432", agent: "Sales Bot", direction: "Outbound", duration: "0:12", status: "error" as const, cost: "$0.01", time: "42 min ago" },
];

const columns: Column<typeof calls[0]>[] = [
  { key: "contact", label: "Contact", sortable: true, render: (r) => <span className="font-mono text-sm">{r.contact}</span> },
  { key: "agent", label: "Agent", sortable: true, hideOnMobile: true },
  { key: "direction", label: "Direction", hideOnMobile: true },
  { key: "duration", label: "Duration", sortable: true, hideOnMobile: true, render: (r) => <span className="font-mono text-sm">{r.duration}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "cost", label: "Cost", sortable: true, hideOnMobile: true },
  { key: "time", label: "Time", sortable: true, hideOnMobile: true },
];

export default function CallLogs() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Call Logs</h1>
        <p className="text-sm text-muted-foreground">Browse all call records</p>
      </div>

      {calls.length > 0 ? (
        <DataTable columns={columns} data={calls} searchKey="contact" searchPlaceholder="Search calls..." onRowClick={(r) => navigate(`/calls/${r.id}`)} />
      ) : (
        <EmptyState icon={PhoneCall} title="No calls yet" description="Call logs will appear here once your agents start making calls." />
      )}
    </div>
  );
}
