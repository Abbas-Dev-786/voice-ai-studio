import { useState, forwardRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { DataTable, Column } from "@/components/DataTable";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BuyPhoneNumberDialog } from "@/components/dialogs/BuyPhoneNumberDialog";
import { UploadDocumentDialog } from "@/components/dialogs/UploadDocumentDialog";
import { ConnectIntegrationDialog } from "@/components/dialogs/ConnectIntegrationDialog";
import { CreateAgentDialog } from "@/components/dialogs/CreateAgentDialog";
import { UploadContactsDialog } from "@/components/dialogs/UploadContactsDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { ExportDataDialog } from "@/components/dialogs/ExportDataDialog";
import {
  ChevronLeft, Phone, CheckCircle, XCircle, Clock, Pause, Download, Play,
  Bot, FileText, Globe, Link2, Settings, Calendar, Users, TrendingUp,
  BarChart3, PhoneCall, PhoneOff, Voicemail, UserCheck, ArrowRight,
  BookOpen, Zap, Volume2, Copy, Edit, Hash, DollarSign, Activity,
  Plus, Trash2, Search, Upload, ExternalLink, File, UserPlus, Contact,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

/* ── Mock Data ─────────────────────────────────────────── */

const campaignCalls = [
  { id: "c1", contact: "+1 (555) 101-0101", contactName: "Sarah Johnson", status: "live" as const, duration: "2:15", outcome: "Booked demo", sentiment: "Positive", time: "5 min ago", cost: "$0.12", agent: "Sales Bot Pro" },
  { id: "c2", contact: "+1 (555) 202-0202", contactName: "Mike Chen", status: "live" as const, duration: "3:42", outcome: "Interested", sentiment: "Positive", time: "12 min ago", cost: "$0.18", agent: "Sales Bot Pro" },
  { id: "c3", contact: "+1 (555) 303-0303", contactName: "Lisa Park", status: "error" as const, duration: "0:08", outcome: "No answer", sentiment: "—", time: "15 min ago", cost: "$0.02", agent: "Sales Bot Pro" },
  { id: "c4", contact: "+1 (555) 404-0404", contactName: "David Kim", status: "live" as const, duration: "1:55", outcome: "Not interested", sentiment: "Negative", time: "22 min ago", cost: "$0.09", agent: "Sales Bot Pro" },
  { id: "c5", contact: "+1 (555) 505-0505", contactName: "Emma Wilson", status: "paused" as const, duration: "—", outcome: "Pending", sentiment: "—", time: "Scheduled", cost: "—", agent: "Follow-up Agent" },
  { id: "c6", contact: "+1 (555) 606-0606", contactName: "Tom Brown", status: "live" as const, duration: "4:12", outcome: "Booked demo", sentiment: "Positive", time: "30 min ago", cost: "$0.21", agent: "Sales Bot Pro" },
  { id: "c7", contact: "+1 (555) 707-0707", contactName: "Ana Garcia", status: "error" as const, duration: "0:03", outcome: "Busy", sentiment: "—", time: "35 min ago", cost: "$0.01", agent: "Sales Bot Pro" },
  { id: "c8", contact: "+1 (555) 808-0808", contactName: "James Lee", status: "live" as const, duration: "2:48", outcome: "Follow-up", sentiment: "Neutral", time: "42 min ago", cost: "$0.14", agent: "Follow-up Agent" },
];

const callColumns: Column<typeof campaignCalls[0]>[] = [
  { key: "contactName", label: "Name", render: (r) => <span className="font-medium">{r.contactName}</span> },
  { key: "contact", label: "Number", hideOnMobile: true, render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.contact}</span> },
  { key: "agent", label: "Agent", hideOnMobile: true, render: (r) => <span className="text-xs">{r.agent}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "duration", label: "Duration", hideOnMobile: true, render: (r) => <span className="font-mono text-sm">{r.duration}</span> },
  { key: "outcome", label: "Outcome", hideOnMobile: true, render: (r) => <Badge variant="secondary" className="text-xs font-normal">{r.outcome}</Badge> },
  { key: "cost", label: "Cost", hideOnMobile: true, render: (r) => <span className="font-mono text-xs">{r.cost}</span> },
];

const campaignAgents = [
  { id: "1", name: "Sales Bot Pro", model: "GPT-4o", voice: "Nova", status: "live" as const, calls: 642, successRate: "72%", role: "Primary outbound" },
  { id: "2", name: "Follow-up Agent", model: "GPT-4o-mini", voice: "Alloy", status: "live" as const, calls: 200, successRate: "58%", role: "Retry & follow-up" },
  { id: "3", name: "Survey Agent", model: "GPT-3.5", voice: "Echo", status: "draft" as const, calls: 0, successRate: "—", role: "Post-call survey" },
];

const agentColumns: Column<typeof campaignAgents[0]>[] = [
  { key: "name", label: "Agent", render: (r) => (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-primary/10 p-1.5"><Bot className="h-3.5 w-3.5 text-primary" /></div>
      <div>
        <p className="font-medium text-sm">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.role}</p>
      </div>
    </div>
  )},
  { key: "model", label: "Model", hideOnMobile: true, render: (r) => <Badge variant="secondary" className="text-xs">{r.model}</Badge> },
  { key: "voice", label: "Voice", hideOnMobile: true },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "calls", label: "Calls", hideOnMobile: true, sortable: true },
  { key: "successRate", label: "Success", hideOnMobile: true },
];

const initialContacts = [
  { id: "1", name: "Sarah Johnson", phone: "+1 (555) 101-0101", email: "sarah@example.com", status: "called" as const, outcome: "Booked demo", lastCall: "5 min ago" },
  { id: "2", name: "Mike Chen", phone: "+1 (555) 202-0202", email: "mike@example.com", status: "called" as const, outcome: "Interested", lastCall: "12 min ago" },
  { id: "3", name: "Lisa Park", phone: "+1 (555) 303-0303", email: "lisa@example.com", status: "failed" as const, outcome: "No answer", lastCall: "15 min ago" },
  { id: "4", name: "David Kim", phone: "+1 (555) 404-0404", email: "david@example.com", status: "called" as const, outcome: "Not interested", lastCall: "22 min ago" },
  { id: "5", name: "Emma Wilson", phone: "+1 (555) 505-0505", email: "emma@example.com", status: "pending" as const, outcome: "—", lastCall: "—" },
  { id: "6", name: "Tom Brown", phone: "+1 (555) 606-0606", email: "tom@example.com", status: "called" as const, outcome: "Booked demo", lastCall: "30 min ago" },
];

const contactColumns: Column<typeof contacts[0]>[] = [
  { key: "name", label: "Name", sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "phone", label: "Phone", hideOnMobile: true, render: (r) => <span className="font-mono text-xs">{r.phone}</span> },
  { key: "email", label: "Email", hideOnMobile: true, render: (r) => <span className="text-xs text-muted-foreground">{r.email}</span> },
  { key: "status", label: "Status", render: (r) => (
    <Badge variant="secondary" className={cn("text-xs capitalize",
      r.status === "called" && "bg-success/10 text-success",
      r.status === "failed" && "bg-destructive/10 text-destructive",
      r.status === "pending" && "bg-muted text-muted-foreground",
    )}>{r.status}</Badge>
  )},
  { key: "outcome", label: "Outcome", hideOnMobile: true },
  { key: "lastCall", label: "Last Call", hideOnMobile: true },
];

const phoneNumbers = [
  { id: "1", number: "+1 (555) 100-2000", label: "Primary Outbound", type: "Local", callsMade: 642, status: "live" as const },
  { id: "2", number: "+1 (555) 200-3000", label: "Backup Line", type: "Local", callsMade: 200, status: "live" as const },
  { id: "3", number: "+1 (800) 400-5000", label: "Toll-free Fallback", type: "Toll-free", callsMade: 0, status: "paused" as const },
];

const knowledgeDocs = [
  { id: "1", name: "Product Overview 2024.pdf", type: "PDF", size: "2.4 MB", pages: 32, lastUpdated: "2 days ago" },
  { id: "2", name: "Pricing & Plans.pdf", type: "PDF", size: "850 KB", pages: 8, lastUpdated: "1 week ago" },
  { id: "3", name: "FAQ Database", type: "Web Scrape", size: "1.1 MB", pages: 156, lastUpdated: "3 days ago" },
  { id: "4", name: "Case Studies Collection", type: "PDF", size: "4.8 MB", pages: 45, lastUpdated: "5 days ago" },
];

const campaignIntegrations = [
  { id: "hubspot", name: "HubSpot", description: "Sync contacts and deals", icon: "🔶", status: "Connected" },
  { id: "salesforce", name: "Salesforce", description: "Log call outcomes to CRM", icon: "☁️", status: "Connected" },
  { id: "calendar", name: "Google Calendar", description: "Book demos in available slots", icon: "📅", status: "Connected" },
  { id: "slack", name: "Slack", description: "Demo booked notifications", icon: "💬", status: "Connected" },
  { id: "webhooks", name: "Custom Webhooks", description: "POST results to endpoint", icon: "🔗", status: "Active" },
  { id: "zapier", name: "Zapier", description: "Not configured yet", icon: "⚡", status: "Inactive" },
];

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

const pieData = [
  { name: "Booked Demo", value: 285, color: "hsl(152 69% 40%)" },
  { name: "Interested", value: 189, color: "hsl(15 90% 55%)" },
  { name: "Not Interested", value: 168, color: "hsl(38 92% 50%)" },
  { name: "No Answer", value: 142, color: "hsl(220 10% 46%)" },
  { name: "Voicemail", value: 58, color: "hsl(220 10% 70%)" },
];

const campaignSettings = {
  schedule: { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], startTime: "9:00 AM", endTime: "5:00 PM", timezone: "US/Eastern" },
  retryPolicy: { maxRetries: 3, retryDelay: "30 min", retryOn: ["No answer", "Busy", "Voicemail"] },
  concurrency: 5,
  contactListSize: 1200,
  contactsRemaining: 358,
  createdAt: "Jan 15, 2025",
  lastModified: "Mar 6, 2025",
  owner: "Alex Thompson",
};

/* ── Tabs ──────────────────────────────────────────────── */

const tabs = [
  { value: "dashboard", label: "Dashboard", icon: BarChart3 },
  { value: "agents", label: "Agents", icon: Bot },
  { value: "contacts", label: "Contacts", icon: Users },
  { value: "calls", label: "Call Logs", icon: PhoneCall },
  { value: "phones", label: "Phone Numbers", icon: Phone },
  { value: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { value: "integrations", label: "Integrations", icon: Link2 },
  { value: "analytics", label: "Analytics", icon: TrendingUp },
  { value: "settings", label: "Settings", icon: Settings },
] as const;

/* ── Helpers ───────────────────────────────────────────── */

const InfoRow = forwardRef<HTMLDivElement, { label: string; value: string; mono?: boolean }>(
  ({ label, value, mono }, ref) => (
    <div ref={ref} className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium", mono && "font-mono")}>{value}</span>
    </div>
  )
);
InfoRow.displayName = "InfoRow";

/* ── Component ─────────────────────────────────────────── */

export default function CampaignDetail() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [buyNumberOpen, setBuyNumberOpen] = useState(false);
  const [uploadDocOpen, setUploadDocOpen] = useState(false);
  const [createAgentOpen, setCreateAgentOpen] = useState(false);
  const [uploadContactsOpen, setUploadContactsOpen] = useState(false);
  const [connectIntOpen, setConnectIntOpen] = useState(false);
  const [connectTarget, setConnectTarget] = useState<any>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [compliance, setCompliance] = useState({
    dnc: true, record: true, tcpa: true, voicemailDetect: true, leaveVoicemail: false,
  });

  const outcomes = [
    { label: "Booked Demo", count: 285, pct: 34, icon: UserCheck, color: "text-success" },
    { label: "Interested", count: 189, pct: 22, icon: TrendingUp, color: "text-primary" },
    { label: "Not Interested", count: 168, pct: 20, icon: PhoneOff, color: "text-warning" },
    { label: "No Answer", count: 142, pct: 17, icon: PhoneCall, color: "text-muted-foreground" },
    { label: "Voicemail", count: 58, pct: 7, icon: Voicemail, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* ── Header ──────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => navigate("/campaigns")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => navigate("/campaigns")}>Campaigns</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Q1 Outreach</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Q1 Outreach</h1>
            <StatusBadge status={isPaused ? "paused" : "live"} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? <Play className="mr-1.5 h-3.5 w-3.5" /> : <Pause className="mr-1.5 h-3.5 w-3.5" />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ──────────────────── */}
      <div className="border-b -mx-1">
        <ScrollArea className="w-full">
          <div className="flex gap-0.5 px-1 pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0",
                  activeTab === tab.value
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* ── DASHBOARD TAB ──────────────────── */}
      {/* ══════════════════════════════════════ */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2"><Users className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Contacted</p>
                  <p className="text-xl font-bold">842 <span className="text-xs font-normal text-muted-foreground">/ 1,200</span></p>
                </div>
              </div>
              <Progress value={70} className="mt-3 h-1.5" />
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2"><CheckCircle className="h-4 w-4 text-success" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-bold">68%</p>
                    <span className="text-xs font-medium text-success">↑ 3%</span>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-destructive/10 p-2"><XCircle className="h-4 w-4 text-destructive" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Failed</p>
                  <p className="text-xl font-bold">58</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent p-2"><DollarSign className="h-4 w-4 text-muted-foreground" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spend</p>
                  <p className="text-xl font-bold font-mono">$127.40</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Outcome Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {outcomes.map((o) => (
                  <div key={o.label} className="flex items-center gap-3 py-1.5">
                    <o.icon className={cn("h-4 w-4 shrink-0", o.color)} />
                    <span className="text-sm flex-1">{o.label}</span>
                    <span className="text-sm font-semibold tabular-nums">{o.count}</span>
                    <div className="w-14"><Progress value={o.pct} className="h-1.5" /></div>
                    <span className="text-xs text-muted-foreground w-7 text-right tabular-nums">{o.pct}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Campaign Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  { label: "Agents", value: `${campaignAgents.length}`, click: "agents" },
                  { label: "Phone Numbers", value: `${phoneNumbers.length}`, click: "phones" },
                  { label: "Knowledge Docs", value: `${knowledgeDocs.length}`, click: "knowledge" },
                  { label: "Integrations", value: `${campaignIntegrations.filter(i => i.status !== "Inactive").length} active`, click: "integrations" },
                  { label: "Contacts", value: `${contacts.length} / ${campaignSettings.contactListSize}`, click: "contacts" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveTab(item.click)}
                    className="flex items-center justify-between py-2 w-full text-left hover:bg-accent/50 rounded-md px-2 -mx-2 transition-colors"
                  >
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      {item.value} <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Cost Summary</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                <InfoRow label="Total Spend" value="$127.40" mono />
                <InfoRow label="Avg Cost/Call" value="$0.15" mono />
                <InfoRow label="Telephony" value="$42.80" mono />
                <InfoRow label="AI / LLM" value="$68.20" mono />
                <InfoRow label="TTS / STT" value="$16.40" mono />
                <div className="flex items-center justify-between pt-3">
                  <span className="text-sm font-semibold">Projected Total</span>
                  <span className="text-sm font-mono font-bold text-primary">$181.70</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Calls */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">Recent Calls</h2>
              <Button variant="ghost" size="sm" className="text-primary text-xs" onClick={() => setActiveTab("calls")}>
                View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
            <DataTable columns={callColumns} data={campaignCalls.slice(0, 5)} onRowClick={(r) => navigate(`/calls/${r.id}`)} />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* ── AGENTS TAB ─────────────────────── */}
      {/* ══════════════════════════════════════ */}
      {activeTab === "agents" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Campaign Agents</h2>
              <p className="text-sm text-muted-foreground">Agents assigned to this campaign. Create new or assign existing agents.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><UserPlus className="mr-1.5 h-3.5 w-3.5" /> Assign Existing</Button>
              <Button size="sm" onClick={() => setCreateAgentOpen(true)}><Plus className="mr-1.5 h-3.5 w-3.5" /> Create Agent</Button>
            </div>
          </div>
          <DataTable
            columns={agentColumns}
            data={campaignAgents}
            searchKey="name"
            searchPlaceholder="Search agents..."
            onRowClick={(r) => navigate(`/agents/${r.id}`)}
          />

          {/* Quick agent config preview */}
          <div className="grid gap-4 md:grid-cols-2">
            {campaignAgents.filter(a => a.status !== "draft").map((agent) => (
              <Card key={agent.id}>
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary/10 p-2"><Bot className="h-4 w-4 text-primary" /></div>
                      <div>
                        <p className="font-medium text-sm">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.role}</p>
                      </div>
                    </div>
                    <StatusBadge status={agent.status} />
                  </div>
                  <Separator className="mb-3" />
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-bold">{agent.calls}</p>
                      <p className="text-xs text-muted-foreground">Calls</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{agent.successRate}</p>
                      <p className="text-xs text-muted-foreground">Success</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{agent.model}</p>
                      <p className="text-xs text-muted-foreground">Model</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate(`/agents/${agent.id}`)}>
                    View Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* ── CONTACTS TAB ───────────────────── */}
      {/* ══════════════════════════════════════ */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Contact List</h2>
              <p className="text-sm text-muted-foreground">{contacts.length} of {campaignSettings.contactListSize} contacts loaded · {campaignSettings.contactsRemaining} remaining</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
              <Button size="sm" onClick={() => setUploadContactsOpen(true)}><Upload className="mr-1.5 h-3.5 w-3.5" /> Upload CSV</Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total", value: campaignSettings.contactListSize, color: "" },
              { label: "Called", value: contacts.filter(c => c.status === "called").length * 200, color: "text-success" },
              { label: "Failed", value: contacts.filter(c => c.status === "failed").length * 50, color: "text-destructive" },
              { label: "Pending", value: campaignSettings.contactsRemaining, color: "text-muted-foreground" },
            ].map((s) => (
              <Card key={s.label} className="p-3 text-center">
                <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </Card>
            ))}
          </div>

          <DataTable
            columns={contactColumns}
            data={contacts}
            searchKey="name"
            searchPlaceholder="Search contacts..."
          />
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* ── CALL LOGS TAB ──────────────────── */}
      {/* ══════════════════════════════════════ */}
      {activeTab === "calls" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Call Logs</h2>
              <p className="text-sm text-muted-foreground">{campaignCalls.length} total calls for this campaign</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
            </Button>
          </div>
          <DataTable columns={callColumns} data={campaignCalls} searchKey="contactName" searchPlaceholder="Search by name..." onRowClick={(r) => navigate(`/calls/${r.id}`)} />
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* ── PHONE NUMBERS TAB ──────────────── */}
      {/* ══════════════════════════════════════ */}
      {activeTab === "phones" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Phone Numbers</h2>
              <p className="text-sm text-muted-foreground">{phoneNumbers.length} numbers assigned to this campaign</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Phone className="mr-1.5 h-3.5 w-3.5" /> Assign Existing</Button>
              <Button size="sm" onClick={() => setBuyNumberOpen(true)}><Plus className="mr-1.5 h-3.5 w-3.5" /> Buy Number</Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {phoneNumbers.map((pn) => (
              <Card key={pn.id} className={cn("transition-shadow hover:shadow-md", pn.status === "live" && "ring-1 ring-success/20")}>
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-sm font-semibold">{pn.number}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{pn.label}</p>
                    </div>
                    <StatusBadge status={pn.status} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{pn.type}</span>
                    <span>{pn.callsMade} calls made</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Caller ID Settings</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <InfoRow label="Display Name" value="Acme Corporation" />
              <InfoRow label="Rotation Strategy" value="Round-robin" />
              <InfoRow label="Fallback Number" value="+1 (800) 400-5000" mono />
              <InfoRow label="CNAM Registration" value="Active" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* ── KNOWLEDGE BASE TAB ─────────────── */}
      {/* ══════════════════════════════════════ */}
      {activeTab === "knowledge" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Knowledge Base</h2>
              <p className="text-sm text-muted-foreground">{knowledgeDocs.length} documents for agent RAG reference</p>
            </div>
            <Button size="sm" onClick={() => setUploadDocOpen(true)}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Knowledge</Button>
          </div>

          <div className="space-y-2">
            {knowledgeDocs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:shadow-sm transition-shadow">
                <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.size} · {doc.pages} chunks</p>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{doc.lastUpdated}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => setDeleteTarget(doc.name)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">RAG Configuration</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <InfoRow label="Chunk Size" value="512 tokens" mono />
              <InfoRow label="Overlap" value="50 tokens" mono />
              <InfoRow label="Top-K Results" value="5" mono />
              <InfoRow label="Similarity Threshold" value="0.78" mono />
              <InfoRow label="Embedding Model" value="text-embedding-3-small" mono />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* ── INTEGRATIONS TAB ───────────────── */}
      {/* ══════════════════════════════════════ */}
      {activeTab === "integrations" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Integrations</h2>
              <p className="text-sm text-muted-foreground">{campaignIntegrations.filter(i => i.status !== "Inactive").length} active integrations for this campaign</p>
            </div>
            <Button size="sm" onClick={() => { const inactive = campaignIntegrations.find(i => i.status === "Inactive"); setConnectTarget(inactive || campaignIntegrations[0]); setConnectIntOpen(true); }}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Integration
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {campaignIntegrations.map((int) => (
              <Card key={int.id} className={cn("transition-shadow hover:shadow-md cursor-pointer", int.status !== "Inactive" && "ring-1 ring-success/20")}
                onClick={() => { setConnectTarget(int); setConnectIntOpen(true); }}>
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{int.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{int.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{int.description}</p>
                    </div>
                    <Badge variant={int.status === "Inactive" ? "secondary" : "default"} className={cn(
                      "text-xs shrink-0",
                      int.status !== "Inactive" && "bg-success/10 text-success border-0"
                    )}>
                      {int.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Webhook Configuration</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Endpoint</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">https://api.acme.com/webhooks/calls</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0"><Copy className="h-3 w-3" /></Button>
                </div>
              </div>
              <InfoRow label="Events" value="call.completed, call.failed, demo.booked" mono />
              <InfoRow label="Retries" value="3 attempts" />
              <InfoRow label="Signing Secret" value="••••••••••••" mono />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* ── ANALYTICS TAB ──────────────────── */}
      {/* ══════════════════════════════════════ */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Campaign Analytics</h2>
            <p className="text-sm text-muted-foreground">Performance metrics specific to this campaign</p>
          </div>

          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Calls" value="842" trend={{ value: "18%", positive: true }} icon={<PhoneCall className="h-4 w-4" />} />
            <StatCard label="Conversion Rate" value="33.8%" trend={{ value: "4.2%", positive: true }} icon={<TrendingUp className="h-4 w-4" />} />
            <StatCard label="Avg Duration" value="2:34" icon={<Clock className="h-4 w-4" />} />
            <StatCard label="Cost / Conversion" value="$0.45" trend={{ value: "12%", positive: true }} icon={<DollarSign className="h-4 w-4" />} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold mb-4">Call Volume (This Week)</h3>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(220 10% 46%)' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(220 10% 46%)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="success" stackId="1" stroke="hsl(152 69% 40%)" fill="hsl(152 69% 40% / 0.2)" />
                    <Area type="monotone" dataKey="failed" stackId="1" stroke="hsl(0 72% 51%)" fill="hsl(0 72% 51% / 0.2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold mb-4">Cost Breakdown (Weekly)</h3>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(220 10% 46%)' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(220 10% 46%)' }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="telephony" fill="hsl(15 90% 55% / 0.7)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ai" fill="hsl(15 90% 55%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold mb-4">Outcome Distribution</h3>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold mb-4">Agent Performance</h3>
              <div className="space-y-4">
                {campaignAgents.filter(a => a.calls > 0).map((agent) => (
                  <div key={agent.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{agent.name}</span>
                      <span className="text-sm text-muted-foreground">{agent.calls} calls · {agent.successRate}</span>
                    </div>
                    <Progress value={parseInt(agent.successRate)} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════ */}
      {/* ── SETTINGS TAB ───────────────────── */}
      {/* ══════════════════════════════════════ */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Campaign Settings</h2>
            <p className="text-sm text-muted-foreground">Configure scheduling, retry policies, and compliance rules</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Schedule</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-1.5">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <Badge
                      key={day}
                      variant={campaignSettings.schedule.days.includes(day) ? "default" : "secondary"}
                      className="text-xs px-2 py-1"
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
                <div className="divide-y divide-border">
                  <InfoRow label="Calling Window" value={`${campaignSettings.schedule.startTime} – ${campaignSettings.schedule.endTime}`} />
                  <InfoRow label="Timezone" value={campaignSettings.schedule.timezone} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Retry Policy</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                <InfoRow label="Max Retries" value={String(campaignSettings.retryPolicy.maxRetries)} />
                <InfoRow label="Retry Delay" value={campaignSettings.retryPolicy.retryDelay} />
                <InfoRow label="Retry On" value={campaignSettings.retryPolicy.retryOn.join(", ")} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">General</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                <InfoRow label="Max Concurrency" value={`${campaignSettings.concurrency} calls`} />
                <InfoRow label="Contact List" value={`${campaignSettings.contactListSize} total`} />
                <InfoRow label="Remaining" value={String(campaignSettings.contactsRemaining)} />
                <InfoRow label="Created" value={campaignSettings.createdAt} />
                <InfoRow label="Owner" value={campaignSettings.owner} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                {([
                  { key: "dnc" as const, label: "Do Not Call (DNC) check" },
                  { key: "record" as const, label: "Record all calls" },
                  { key: "tcpa" as const, label: "TCPA compliance mode" },
                  { key: "voicemailDetect" as const, label: "Voicemail detection" },
                  { key: "leaveVoicemail" as const, label: "Leave voicemail message" },
                ]).map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2.5">
                    <span className="text-sm">{item.label}</span>
                    <Switch
                      checked={compliance[item.key]}
                      onCheckedChange={(checked) => setCompliance(prev => ({ ...prev, [item.key]: checked }))}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Danger zone */}
          <Card className="border-destructive/30">
            <CardContent className="pt-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-destructive">Danger Zone</p>
                  <p className="text-sm text-muted-foreground">Permanently delete this campaign and all associated data.</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => setDeleteTarget("campaign")}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Dialogs ─────────────────────────── */}
      <BuyPhoneNumberDialog open={buyNumberOpen} onOpenChange={(open) => { setBuyNumberOpen(open); if (!open && buyNumberOpen) toast({ title: "Phone number purchased", description: "The number has been added to this campaign." }); }} />
      <UploadDocumentDialog open={uploadDocOpen} onOpenChange={(open) => { setUploadDocOpen(open); if (!open && uploadDocOpen) toast({ title: "Document uploaded", description: "Knowledge base has been updated." }); }} />
      <CreateAgentDialog open={createAgentOpen} onOpenChange={setCreateAgentOpen} onCreated={(agent) => toast({ title: "Agent created", description: `${agent.name} has been added to this campaign.` })} />
      <UploadContactsDialog open={uploadContactsOpen} onOpenChange={setUploadContactsOpen} onImported={(count) => toast({ title: "Contacts imported", description: `${count} contacts have been added to this campaign.` })} />
      <ConnectIntegrationDialog open={connectIntOpen} onOpenChange={(open) => { setConnectIntOpen(open); if (!open && connectIntOpen) toast({ title: "Integration updated", description: `${connectTarget?.name || "Integration"} configuration saved.` }); }} integration={connectTarget} />
      <ExportDataDialog open={exportOpen} onOpenChange={setExportOpen} title="Export Campaign Data" description="Download campaign data in your preferred format." />
      <DeleteConfirmDialog
        open={deleteTarget === "campaign"}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Campaign"
        description="Are you sure you want to delete this campaign? This will remove all agents, contacts, call logs, and integrations associated with it. This action cannot be undone."
        onConfirm={() => { setDeleteTarget(null); toast({ title: "Campaign deleted", description: "The campaign has been permanently removed." }); navigate("/campaigns"); }}
      />
      <DeleteConfirmDialog
        open={!!deleteTarget && deleteTarget !== "campaign"}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove Document"
        description={`Are you sure you want to remove "${deleteTarget}" from this campaign's knowledge base?`}
        onConfirm={() => { toast({ title: "Document removed", description: `"${deleteTarget}" has been removed from the knowledge base.` }); setDeleteTarget(null); }}
      />
    </div>
  );
}
