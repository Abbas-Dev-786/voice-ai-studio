import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

const numbers = [
  { id: "1", number: "+1 (555) 100-2000", label: "Primary Outbound", campaign: "Q1 Outreach", status: "live" as const, type: "Local", calls: 642 },
  { id: "2", number: "+1 (555) 200-3000", label: "Backup Line", campaign: "Q1 Outreach", status: "live" as const, type: "Local", calls: 200 },
  { id: "3", number: "+1 (555) 300-4000", label: "Support Line", campaign: "Product Launch", status: "live" as const, type: "Toll-free", calls: 156 },
  { id: "4", number: "+1 (800) 400-5000", label: "Toll-free Fallback", campaign: "Q1 Outreach", status: "paused" as const, type: "Toll-free", calls: 0 },
];

const columns: Column<typeof numbers[0]>[] = [
  { key: "number", label: "Number", render: (r) => <span className="font-mono text-sm font-medium">{r.number}</span> },
  { key: "label", label: "Label" },
  { key: "campaign", label: "Campaign", hideOnMobile: true, render: (r) => (
    <Badge variant="secondary" className="text-xs font-normal">{r.campaign}</Badge>
  )},
  { key: "type", label: "Type", hideOnMobile: true, render: (r) => <Badge variant="secondary">{r.type}</Badge> },
  { key: "calls", label: "Calls", hideOnMobile: true, sortable: true },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

export default function PhoneNumbers() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Phone Numbers</h1>
          <p className="text-sm text-muted-foreground">All phone numbers across your campaigns. Manage numbers within each campaign.</p>
        </div>
      </div>

      {numbers.length > 0 ? (
        <DataTable columns={columns} data={numbers} searchKey="number" searchPlaceholder="Search numbers..." />
      ) : (
        <EmptyState icon={Phone} title="No phone numbers" description="Add phone numbers within a campaign to get started." actionLabel="Go to Campaigns" onAction={() => navigate("/campaigns")} />
      )}
    </div>
  );
}
