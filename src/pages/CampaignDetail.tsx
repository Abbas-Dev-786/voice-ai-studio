import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { DataTable, Column } from "@/components/DataTable";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Phone, CheckCircle, XCircle, Clock, Pause, Download } from "lucide-react";

const campaignCalls = [
  { contact: "+1 (555) 101-0101", status: "live" as const, duration: "2:15", outcome: "Booked demo", time: "5 min ago" },
  { contact: "+1 (555) 202-0202", status: "live" as const, duration: "3:42", outcome: "Interested", time: "12 min ago" },
  { contact: "+1 (555) 303-0303", status: "error" as const, duration: "0:08", outcome: "No answer", time: "15 min ago" },
  { contact: "+1 (555) 404-0404", status: "live" as const, duration: "1:55", outcome: "Not interested", time: "22 min ago" },
  { contact: "+1 (555) 505-0505", status: "paused" as const, duration: "—", outcome: "Pending", time: "Scheduled" },
];

const columns: Column<typeof campaignCalls[0]>[] = [
  { key: "contact", label: "Contact", render: (r) => <span className="font-mono text-sm">{r.contact}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "duration", label: "Duration", hideOnMobile: true, render: (r) => <span className="font-mono text-sm">{r.duration}</span> },
  { key: "outcome", label: "Outcome", hideOnMobile: true },
  { key: "time", label: "Time", hideOnMobile: true },
];

export default function CampaignDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/campaigns")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Q1 Outreach</h1>
              <StatusBadge status="live" />
            </div>
            <p className="text-sm text-muted-foreground">Campaign #{id} · Sales Bot</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Pause className="mr-2 h-4 w-4" /> Pause</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Contacted" value="842" icon={<Phone className="h-4 w-4" />}>
          <Progress value={70} className="mt-2 h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">842 / 1,200</p>
        </StatCard>
        <StatCard label="Success Rate" value="68%" icon={<CheckCircle className="h-4 w-4" />} trend={{ value: "3%", positive: true }} />
        <StatCard label="Failed" value="58" icon={<XCircle className="h-4 w-4" />} />
        <StatCard label="Avg Duration" value="2:34" icon={<Clock className="h-4 w-4" />} />
      </div>

      <div>
        <h2 className="mb-4 font-semibold">Call Log</h2>
        <DataTable columns={columns} data={campaignCalls} searchKey="contact" searchPlaceholder="Search contacts..." />
      </div>
    </div>
  );
}
