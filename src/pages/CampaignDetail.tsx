import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { DataTable, Column } from "@/components/DataTable";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ChevronLeft, Phone, CheckCircle, XCircle, Clock, Pause, Download, Play,
  Bot, FileText, Globe, Link2, Settings, Calendar, Users, TrendingUp,
  BarChart3, PhoneCall, PhoneOff, Voicemail, UserCheck, ArrowRight,
  BookOpen, Zap, Volume2, Copy, Edit, Hash, DollarSign, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Mock Data ─────────────────────────────────────────── */

const campaignCalls = [
  { id: "c1", contact: "+1 (555) 101-0101", contactName: "Sarah Johnson", status: "live" as const, duration: "2:15", outcome: "Booked demo", sentiment: "Positive", time: "5 min ago", cost: "$0.12" },
  { id: "c2", contact: "+1 (555) 202-0202", contactName: "Mike Chen", status: "live" as const, duration: "3:42", outcome: "Interested", sentiment: "Positive", time: "12 min ago", cost: "$0.18" },
  { id: "c3", contact: "+1 (555) 303-0303", contactName: "Lisa Park", status: "error" as const, duration: "0:08", outcome: "No answer", sentiment: "—", time: "15 min ago", cost: "$0.02" },
  { id: "c4", contact: "+1 (555) 404-0404", contactName: "David Kim", status: "live" as const, duration: "1:55", outcome: "Not interested", sentiment: "Negative", time: "22 min ago", cost: "$0.09" },
  { id: "c5", contact: "+1 (555) 505-0505", contactName: "Emma Wilson", status: "paused" as const, duration: "—", outcome: "Pending", sentiment: "—", time: "Scheduled", cost: "—" },
  { id: "c6", contact: "+1 (555) 606-0606", contactName: "Tom Brown", status: "live" as const, duration: "4:12", outcome: "Booked demo", sentiment: "Positive", time: "30 min ago", cost: "$0.21" },
  { id: "c7", contact: "+1 (555) 707-0707", contactName: "Ana Garcia", status: "error" as const, duration: "0:03", outcome: "Busy", sentiment: "—", time: "35 min ago", cost: "$0.01" },
  { id: "c8", contact: "+1 (555) 808-0808", contactName: "James Lee", status: "live" as const, duration: "2:48", outcome: "Follow-up", sentiment: "Neutral", time: "42 min ago", cost: "$0.14" },
];

const callColumns: Column<typeof campaignCalls[0]>[] = [
  { key: "contactName", label: "Name", render: (r) => <span className="font-medium">{r.contactName}</span> },
  { key: "contact", label: "Number", hideOnMobile: true, render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.contact}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "duration", label: "Duration", hideOnMobile: true, render: (r) => <span className="font-mono text-sm">{r.duration}</span> },
  { key: "outcome", label: "Outcome", hideOnMobile: true, render: (r) => (
    <Badge variant="secondary" className="text-xs font-normal">{r.outcome}</Badge>
  )},
  { key: "sentiment", label: "Sentiment", hideOnMobile: true, render: (r) => (
    <span className={cn("text-xs font-medium",
      r.sentiment === "Positive" && "text-success",
      r.sentiment === "Negative" && "text-destructive",
      r.sentiment === "Neutral" && "text-warning",
      r.sentiment === "—" && "text-muted-foreground"
    )}>{r.sentiment}</span>
  )},
  { key: "cost", label: "Cost", hideOnMobile: true, render: (r) => <span className="font-mono text-xs">{r.cost}</span> },
];

const agentInfo = {
  name: "Sales Bot Pro",
  model: "GPT-4o",
  voice: "Nova (Female, Warm)",
  language: "English (US)",
  maxDuration: "5 min",
  firstMessage: "Hi! This is Alex from Acme Corp. I'm reaching out because you recently showed interest in our platform. Do you have a quick moment to chat?",
  systemPrompt: "You are Alex, a friendly and professional sales representative for Acme Corp. Your goal is to qualify leads and book product demos. Be conversational, empathetic, and never pushy. If the prospect is not interested, thank them politely and end the call.",
  tools: ["book_demo", "check_calendar", "send_email", "transfer_call"],
  temperature: 0.7,
  interruptionThreshold: 150,
};

const phoneNumbers = [
  { number: "+1 (555) 100-2000", label: "Primary Outbound", type: "Local", callsMade: 642, status: "live" as const },
  { number: "+1 (555) 200-3000", label: "Backup Line", type: "Local", callsMade: 200, status: "live" as const },
  { number: "+1 (800) 400-5000", label: "Toll-free Fallback", type: "Toll-free", callsMade: 0, status: "paused" as const },
];

const knowledgeDocs = [
  { name: "Product Overview 2024.pdf", type: "PDF", size: "2.4 MB", pages: 32, lastUpdated: "2 days ago" },
  { name: "Pricing & Plans.pdf", type: "PDF", size: "850 KB", pages: 8, lastUpdated: "1 week ago" },
  { name: "FAQ Database", type: "Web Scrape", size: "1.1 MB", pages: 156, lastUpdated: "3 days ago" },
  { name: "Case Studies Collection", type: "PDF", size: "4.8 MB", pages: 45, lastUpdated: "5 days ago" },
  { name: "Competitor Analysis", type: "Document", size: "1.2 MB", pages: 18, lastUpdated: "1 week ago" },
];

const integrations = [
  { name: "Salesforce CRM", icon: "🔗", status: "Connected", description: "Sync contacts & log outcomes", lastSync: "2 min ago" },
  { name: "HubSpot", icon: "🟠", status: "Connected", description: "Push leads and deals", lastSync: "5 min ago" },
  { name: "Google Calendar", icon: "📅", status: "Connected", description: "Book demos in available slots", lastSync: "Real-time" },
  { name: "Slack", icon: "💬", status: "Connected", description: "Demo booked notifications", lastSync: "Real-time" },
  { name: "Webhook", icon: "🔁", status: "Active", description: "POST results to endpoint", lastSync: "Per call" },
  { name: "Zapier", icon: "⚡", status: "Inactive", description: "Not configured", lastSync: "—" },
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

/* ── Tab Navigation ────────────────────────────────────── */

const tabs = [
  { value: "overview", label: "Overview", icon: BarChart3 },
  { value: "calls", label: "Call Logs", icon: PhoneCall },
  { value: "agent", label: "Agent", icon: Bot },
  { value: "phones", label: "Phone Numbers", icon: Phone },
  { value: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { value: "integrations", label: "Integrations", icon: Link2 },
  { value: "settings", label: "Settings", icon: Settings },
] as const;

/* ── Reusable info row ─────────────────────────────────── */

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium", mono && "font-mono")}>{value}</span>
    </div>
  );
}

/* ── Component ─────────────────────────────────────────── */

export default function CampaignDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
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
    <div className="space-y-6 pb-8">
      {/* ── Header ──────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate("/campaigns")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Campaigns</span>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm font-medium">Q1 Outreach</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Q1 Outreach</h1>
              <StatusBadge status={isPaused ? "paused" : "live"} />
            </div>
            <p className="text-sm text-muted-foreground">
              Campaign #{id} · {campaignSettings.owner} · Last updated {campaignSettings.lastModified}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? <Play className="mr-1.5 h-3.5 w-3.5" /> : <Pause className="mr-1.5 h-3.5 w-3.5" />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
            <Button size="sm"><Edit className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
          </div>
        </div>
      </div>

      {/* ── KPI Strip ───────────────────────── */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2"><Users className="h-4 w-4 text-primary" /></div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Contacted</p>
              <p className="text-xl font-bold tracking-tight">842 <span className="text-xs font-normal text-muted-foreground">/ 1,200</span></p>
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
                <p className="text-xl font-bold tracking-tight">68%</p>
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
              <p className="text-xl font-bold tracking-tight">58</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent p-2"><Clock className="h-4 w-4 text-muted-foreground" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Duration</p>
              <p className="text-xl font-bold tracking-tight font-mono">2:34</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Tab Navigation ──────────────────── */}
      <div className="border-b">
        <ScrollArea className="w-full">
          <div className="flex gap-1 pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  activeTab === tab.value
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* ── Tab Content ─────────────────────── */}

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {/* Outcome Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Outcome Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {outcomes.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 py-2">
                    <item.icon className={cn("h-4 w-4 shrink-0", item.color)} />
                    <span className="text-sm flex-1">{item.label}</span>
                    <span className="text-sm font-semibold tabular-nums">{item.count}</span>
                    <div className="w-16">
                      <Progress value={item.pct} className="h-1.5" />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">{item.pct}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Campaign Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Campaign Info</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                <InfoRow label="Agent" value={agentInfo.name} />
                <InfoRow label="Phone Lines" value={`${phoneNumbers.length} numbers`} />
                <InfoRow label="Knowledge Docs" value={`${knowledgeDocs.length} documents`} />
                <InfoRow label="Active Integrations" value={`${integrations.filter(i => i.status !== "Inactive").length} connected`} />
                <InfoRow label="Contact List" value={`${campaignSettings.contactListSize} contacts`} />
                <InfoRow label="Schedule" value={`${campaignSettings.schedule.startTime} – ${campaignSettings.schedule.endTime}`} />
              </CardContent>
            </Card>

            {/* Cost Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cost Summary</CardTitle>
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

      {/* Call Logs */}
      {activeTab === "calls" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{campaignCalls.length} total calls</p>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV</Button>
          </div>
          <DataTable columns={callColumns} data={campaignCalls} searchKey="contactName" searchPlaceholder="Search by name..." onRowClick={(r) => navigate(`/calls/${r.id}`)} />
        </div>
      )}

      {/* Agent */}
      {activeTab === "agent" && (
        <div className="space-y-4">
          {/* Agent card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{agentInfo.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{agentInfo.model}</Badge>
                      <Badge variant="secondary" className="text-xs">{agentInfo.voice}</Badge>
                      <Badge variant="secondary" className="text-xs">{agentInfo.language}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate("/agents/1/playground")}>
                    <Play className="mr-1.5 h-3.5 w-3.5" /> Test
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate("/agents/1")}>
                    View Agent <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Config */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                <InfoRow label="Max Call Duration" value={agentInfo.maxDuration} />
                <InfoRow label="Temperature" value={String(agentInfo.temperature)} mono />
                <InfoRow label="Interruption Threshold" value={`${agentInfo.interruptionThreshold}ms`} mono />
              </CardContent>
            </Card>

            {/* Tools */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Enabled Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {agentInfo.tools.map((tool) => (
                    <Badge key={tool} variant="secondary" className="font-mono text-xs py-1.5 px-3">
                      <Zap className="mr-1.5 h-3 w-3 text-primary" /> {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* First Message */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">First Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/60 p-4 border border-border/50">
                  <p className="text-sm leading-relaxed italic text-muted-foreground">"{agentInfo.firstMessage}"</p>
                </div>
              </CardContent>
            </Card>

            {/* System Prompt */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">System Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/60 p-4 border border-border/50">
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{agentInfo.systemPrompt}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Phone Numbers */}
      {activeTab === "phones" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{phoneNumbers.length} numbers assigned</p>
            <Button size="sm"><Phone className="mr-1.5 h-3.5 w-3.5" /> Add Number</Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {phoneNumbers.map((pn) => (
              <Card key={pn.number} className={cn("transition-shadow hover:shadow-md", pn.status === "live" && "ring-1 ring-success/20")}>
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
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Caller ID Settings</CardTitle>
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

      {/* Knowledge Base */}
      {activeTab === "knowledge" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{knowledgeDocs.length} documents for RAG</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Globe className="mr-1.5 h-3.5 w-3.5" /> Add URL</Button>
              <Button size="sm"><FileText className="mr-1.5 h-3.5 w-3.5" /> Upload</Button>
            </div>
          </div>

          <div className="space-y-2">
            {knowledgeDocs.map((doc) => (
              <Card key={doc.name} className="transition-shadow hover:shadow-md">
                <CardContent className="py-3 px-4 flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.size} · {doc.pages} chunks</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-4">
                    <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{doc.lastUpdated}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">RAG Configuration</CardTitle>
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

      {/* Integrations */}
      {activeTab === "integrations" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{integrations.filter(i => i.status !== "Inactive").length} active integrations</p>
            <Button size="sm"><Link2 className="mr-1.5 h-3.5 w-3.5" /> Add Integration</Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((int) => (
              <Card key={int.name} className={cn("transition-shadow hover:shadow-md", int.status !== "Inactive" && "ring-1 ring-success/20")}>
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
                  <div className="text-xs text-muted-foreground">Last sync: {int.lastSync}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Webhook</CardTitle>
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

      {/* Settings */}
      {activeTab === "settings" && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Schedule */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Schedule</CardTitle>
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

          {/* Retry */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Retry Policy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <InfoRow label="Max Retries" value={String(campaignSettings.retryPolicy.maxRetries)} />
              <InfoRow label="Retry Delay" value={campaignSettings.retryPolicy.retryDelay} />
              <InfoRow label="Retry On" value={campaignSettings.retryPolicy.retryOn.join(", ")} />
            </CardContent>
          </Card>

          {/* General */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">General</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <InfoRow label="Max Concurrency" value={`${campaignSettings.concurrency} calls`} />
              <InfoRow label="Contact List" value={`${campaignSettings.contactListSize} total`} />
              <InfoRow label="Remaining" value={String(campaignSettings.contactsRemaining)} />
              <InfoRow label="Created" value={campaignSettings.createdAt} />
              <InfoRow label="Last Modified" value={campaignSettings.lastModified} />
              <InfoRow label="Owner" value={campaignSettings.owner} />
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Compliance</CardTitle>
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
      )}
    </div>
  );
}
