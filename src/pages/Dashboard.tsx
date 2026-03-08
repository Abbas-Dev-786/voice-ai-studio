import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { DataTable, Column } from "@/components/DataTable";
import { PhoneCall, TrendingUp, Bot, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const recentCalls = [
  { contact: "+1 (555) 123-4567", agent: "Sales Bot", duration: "3:42", status: "live" as const, time: "2 min ago" },
  { contact: "+1 (555) 987-6543", agent: "Support AI", duration: "1:15", status: "live" as const, time: "5 min ago" },
  { contact: "+1 (555) 456-7890", agent: "Outreach Pro", duration: "5:08", status: "paused" as const, time: "12 min ago" },
  { contact: "+1 (555) 321-0987", agent: "Sales Bot", duration: "0:45", status: "error" as const, time: "18 min ago" },
  { contact: "+1 (555) 654-3210", agent: "Survey Agent", duration: "2:33", status: "live" as const, time: "25 min ago" },
  { contact: "+1 (555) 789-0123", agent: "Support AI", duration: "4:12", status: "draft" as const, time: "30 min ago" },
  { contact: "+1 (555) 234-5678", agent: "Outreach Pro", duration: "1:58", status: "live" as const, time: "35 min ago" },
  { contact: "+1 (555) 876-5432", agent: "Sales Bot", duration: "3:05", status: "live" as const, time: "42 min ago" },
];

const callColumns: Column<typeof recentCalls[0]>[] = [
  { key: "contact", label: "Contact", sortable: true, render: (r) => <span className="font-mono text-sm">{r.contact}</span> },
  { key: "agent", label: "Agent", sortable: true },
  { key: "duration", label: "Duration", sortable: true, render: (r) => <span className="font-mono text-sm">{r.duration}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "time", label: "Time", sortable: true },
];

const activeAgents = [
  { name: "Sales Bot", calls: 24, status: "live" as const },
  { name: "Support AI", calls: 18, status: "live" as const },
  { name: "Outreach Pro", calls: 7, status: "paused" as const },
  { name: "Survey Agent", calls: 0, status: "draft" as const },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your voice AI operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Calls Today"
          value="1,284"
          trend={{ value: "12%", positive: true }}
          icon={<PhoneCall className="h-4 w-4" />}
        />
        <StatCard
          label="Success Rate"
          value="94.2%"
          trend={{ value: "2.1%", positive: true }}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Active Agents"
          value="3"
          icon={<Bot className="h-4 w-4" />}
        />
        <StatCard label="Minutes Used" value="4,320" icon={<Clock className="h-4 w-4" />}>
          <Progress value={43} className="mt-3 h-1.5" />
          <p className="mt-1 text-xs text-muted-foreground">4,320 / 10,000 min</p>
        </StatCard>
      </div>

      {/* Two columns */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-lg font-semibold">Recent Calls</h2>
          <DataTable columns={callColumns} data={recentCalls} searchKey="contact" searchPlaceholder="Search contacts..." />
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Active Agents</h2>
          <div className="space-y-3">
            {activeAgents.map((agent) => (
              <div key={agent.name} className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">{agent.calls} calls today</p>
                </div>
                <StatusBadge status={agent.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage bar */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex-1">
          <p className="text-sm font-medium">You have used <span className="text-primary">1,250</span> of <span className="font-semibold">5,000</span> calls this month</p>
          <Progress value={25} className="mt-2 h-2 max-w-md" />
        </div>
        <a href="/settings/billing" className="text-sm font-medium text-primary hover:underline">
          Upgrade Plan →
        </a>
      </div>
    </div>
  );
}
