import { StatCard } from "@/components/StatCard";
import { PhoneCall, TrendingUp, Clock, DollarSign } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const volumeData = [
  { date: "Mon", calls: 180, success: 165, failed: 15 },
  { date: "Tue", calls: 220, success: 198, failed: 22 },
  { date: "Wed", calls: 195, success: 178, failed: 17 },
  { date: "Thu", calls: 260, success: 240, failed: 20 },
  { date: "Fri", calls: 240, success: 218, failed: 22 },
  { date: "Sat", calls: 90, success: 82, failed: 8 },
  { date: "Sun", calls: 65, success: 60, failed: 5 },
];

const costData = [
  { date: "Week 1", telephony: 42, ai: 85 },
  { date: "Week 2", telephony: 55, ai: 110 },
  { date: "Week 3", telephony: 48, ai: 95 },
  { date: "Week 4", telephony: 60, ai: 120 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Call volume, success rates, and cost analysis</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Calls" value="1,250" trend={{ value: "18%", positive: true }} icon={<PhoneCall className="h-4 w-4" />} />
        <StatCard label="Success Rate" value="92.4%" trend={{ value: "1.2%", positive: true }} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Avg Duration" value="2:48" icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Total Cost" value="$415" trend={{ value: "8%", positive: false }} icon={<DollarSign className="h-4 w-4" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Call Volume</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(220 10% 46%)' }} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(220 10% 46%)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(0 0% 100%)', border: '1px solid hsl(30 15% 90%)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="success" stackId="1" stroke="hsl(152 69% 40%)" fill="hsl(152 69% 40% / 0.2)" />
                <Area type="monotone" dataKey="failed" stackId="1" stroke="hsl(0 72% 51%)" fill="hsl(0 72% 51% / 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Cost Breakdown</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(220 10% 46%)' }} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(220 10% 46%)' }} prefix="$" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(0 0% 100%)', border: '1px solid hsl(30 15% 90%)', borderRadius: '8px' }} />
                <Bar dataKey="telephony" fill="hsl(15 90% 55% / 0.7)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ai" fill="hsl(15 90% 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
