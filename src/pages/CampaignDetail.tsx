import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { DataTable, Column } from "@/components/DataTable";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft, Phone, CheckCircle, XCircle, Clock, Pause, Download, Play,
  Bot, FileText, Globe, Link2, Settings, Calendar, Users, TrendingUp,
  BarChart3, PhoneCall, PhoneOff, Voicemail, UserCheck, ArrowRight,
  BookOpen, Webhook, Mail, MessageSquare, Zap, Volume2, Copy, Edit,
} from "lucide-react";

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
  { key: "contactName", label: "Name" },
  { key: "contact", label: "Number", render: (r) => <span className="font-mono text-sm">{r.contact}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "duration", label: "Duration", hideOnMobile: true, render: (r) => <span className="font-mono text-sm">{r.duration}</span> },
  { key: "outcome", label: "Outcome", hideOnMobile: true },
  { key: "sentiment", label: "Sentiment", hideOnMobile: true, render: (r) => (
    <Badge variant="secondary" className={
      r.sentiment === "Positive" ? "bg-success/10 text-success border-0" :
      r.sentiment === "Negative" ? "bg-destructive/10 text-destructive border-0" :
      r.sentiment === "Neutral" ? "bg-warning/10 text-warning border-0" : ""
    }>{r.sentiment}</Badge>
  )},
  { key: "cost", label: "Cost", hideOnMobile: true },
  { key: "time", label: "Time", hideOnMobile: true },
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

const phoneColumns: Column<typeof phoneNumbers[0]>[] = [
  { key: "number", label: "Number", render: (r) => <span className="font-mono text-sm font-medium">{r.number}</span> },
  { key: "label", label: "Label" },
  { key: "type", label: "Type", hideOnMobile: true, render: (r) => <Badge variant="secondary">{r.type}</Badge> },
  { key: "callsMade", label: "Calls Made", hideOnMobile: true },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

const knowledgeDocs = [
  { name: "Product Overview 2024.pdf", type: "PDF", size: "2.4 MB", pages: 32, lastUpdated: "2 days ago" },
  { name: "Pricing & Plans.pdf", type: "PDF", size: "850 KB", pages: 8, lastUpdated: "1 week ago" },
  { name: "FAQ Database", type: "Web Scrape", size: "1.1 MB", pages: 156, lastUpdated: "3 days ago" },
  { name: "Case Studies Collection", type: "PDF", size: "4.8 MB", pages: 45, lastUpdated: "5 days ago" },
  { name: "Competitor Analysis", type: "Document", size: "1.2 MB", pages: 18, lastUpdated: "1 week ago" },
];

const kbColumns: Column<typeof knowledgeDocs[0]>[] = [
  { key: "name", label: "Document", render: (r) => (
    <div className="flex items-center gap-2">
      <FileText className="h-4 w-4 text-primary" />
      <span className="font-medium">{r.name}</span>
    </div>
  )},
  { key: "type", label: "Type", hideOnMobile: true, render: (r) => <Badge variant="secondary">{r.type}</Badge> },
  { key: "size", label: "Size", hideOnMobile: true },
  { key: "pages", label: "Chunks", hideOnMobile: true },
  { key: "lastUpdated", label: "Updated", hideOnMobile: true },
];

const integrations = [
  { name: "Salesforce CRM", icon: "🔗", status: "Connected", description: "Sync contacts & log call outcomes", lastSync: "2 min ago" },
  { name: "HubSpot", icon: "🟠", status: "Connected", description: "Push leads and deal updates", lastSync: "5 min ago" },
  { name: "Google Calendar", icon: "📅", status: "Connected", description: "Book demos in available slots", lastSync: "Real-time" },
  { name: "Slack", icon: "💬", status: "Connected", description: "Notifications for booked demos", lastSync: "Real-time" },
  { name: "Webhook", icon: "🔁", status: "Active", description: "POST call results to endpoint", lastSync: "Per call" },
  { name: "Zapier", icon: "⚡", status: "Inactive", description: "Not configured for this campaign", lastSync: "—" },
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

/* ── Component ─────────────────────────────────────────── */

export default function CampaignDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/campaigns")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">Q1 Outreach</h1>
              <StatusBadge status={isPaused ? "paused" : "live"} />
            </div>
            <p className="text-sm text-muted-foreground">Campaign #{id} · Created {campaignSettings.createdAt} · {campaignSettings.owner}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Contacted" value="842" icon={<Phone className="h-4 w-4" />}>
          <Progress value={70} className="mt-2 h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">842 / 1,200</p>
        </StatCard>
        <StatCard label="Success Rate" value="68%" icon={<CheckCircle className="h-4 w-4" />} trend={{ value: "3%", positive: true }} />
        <StatCard label="Failed" value="58" icon={<XCircle className="h-4 w-4" />} />
        <StatCard label="Avg Duration" value="2:34" icon={<Clock className="h-4 w-4" />} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calls">Call Logs</TabsTrigger>
          <TabsTrigger value="agent">Agent</TabsTrigger>
          <TabsTrigger value="phones">Phone Numbers</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ──────────────────── */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Outcome Breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Outcome Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Booked Demo", count: 285, pct: 34, icon: UserCheck, color: "text-success" },
                  { label: "Interested", count: 189, pct: 22, icon: TrendingUp, color: "text-primary" },
                  { label: "Not Interested", count: 168, pct: 20, icon: PhoneOff, color: "text-warning" },
                  { label: "No Answer", count: 142, pct: 17, icon: PhoneCall, color: "text-muted-foreground" },
                  { label: "Voicemail", count: 58, pct: 7, icon: Voicemail, color: "text-muted-foreground" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{item.count}</span>
                      <div className="w-16">
                        <Progress value={item.pct} className="h-1.5" />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{item.pct}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Campaign Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Agent", value: agentInfo.name, icon: Bot },
                  { label: "Phone Lines", value: `${phoneNumbers.length} numbers`, icon: Phone },
                  { label: "Knowledge Docs", value: `${knowledgeDocs.length} documents`, icon: BookOpen },
                  { label: "Integrations", value: `${integrations.filter(i => i.status === "Connected" || i.status === "Active").length} active`, icon: Link2 },
                  { label: "Contact List", value: `${campaignSettings.contactListSize} contacts`, icon: Users },
                  { label: "Schedule", value: `${campaignSettings.schedule.days.join(", ")}`, icon: Calendar },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cost Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Cost Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Total Spend", value: "$127.40" },
                  { label: "Avg Cost/Call", value: "$0.15" },
                  { label: "Telephony", value: "$42.80" },
                  { label: "AI / LLM", value: "$68.20" },
                  { label: "TTS / STT", value: "$16.40" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-mono font-medium">{item.value}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Projected Total</span>
                  <span className="text-sm font-mono font-bold text-primary">$181.70</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Calls */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent Calls</h2>
              <Button variant="ghost" size="sm" className="text-primary">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <DataTable columns={callColumns} data={campaignCalls.slice(0, 5)} searchKey="contactName" searchPlaceholder="Search contacts..." onRowClick={(r) => navigate(`/calls/${r.id}`)} />
          </div>
        </TabsContent>

        {/* ── Call Logs Tab ─────────────────── */}
        <TabsContent value="calls" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">All Call Logs</h2>
              <p className="text-sm text-muted-foreground">{campaignCalls.length} total calls in this campaign</p>
            </div>
            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
          </div>
          <DataTable columns={callColumns} data={campaignCalls} searchKey="contactName" searchPlaceholder="Search by name..." onRowClick={(r) => navigate(`/calls/${r.id}`)} />
        </TabsContent>

        {/* ── Agent Tab ────────────────────── */}
        <TabsContent value="agent" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Assigned Agent</h2>
              <p className="text-sm text-muted-foreground">AI agent powering this campaign</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/agents/1/playground")}>
                <Play className="mr-2 h-4 w-4" /> Test in Playground
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/agents/1")}>
                <ArrowRight className="mr-2 h-4 w-4" /> View Agent
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{agentInfo.name}</CardTitle>
                    <CardDescription>Model: {agentInfo.model} · Voice: {agentInfo.voice}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Language", value: agentInfo.language },
                  { label: "Max Call Duration", value: agentInfo.maxDuration },
                  { label: "Temperature", value: String(agentInfo.temperature) },
                  { label: "Interruption Threshold", value: `${agentInfo.interruptionThreshold}ms` },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">First Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm italic text-muted-foreground">"{agentInfo.firstMessage}"</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">System Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{agentInfo.systemPrompt}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Enabled Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {agentInfo.tools.map((tool) => (
                    <Badge key={tool} variant="secondary" className="font-mono text-xs">
                      <Zap className="mr-1 h-3 w-3" /> {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Phone Numbers Tab ────────────── */}
        <TabsContent value="phones" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Phone Numbers</h2>
              <p className="text-sm text-muted-foreground">{phoneNumbers.length} numbers assigned to this campaign</p>
            </div>
            <Button variant="outline" size="sm"><Phone className="mr-2 h-4 w-4" /> Add Number</Button>
          </div>
          <DataTable columns={phoneColumns} data={phoneNumbers} searchKey="number" searchPlaceholder="Search numbers..." />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Caller ID Settings</CardTitle>
              <CardDescription>How your calls appear to recipients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Display Name", value: "Acme Corporation" },
                { label: "Rotation Strategy", value: "Round-robin" },
                { label: "Fallback Number", value: "+1 (800) 400-5000" },
                { label: "CNAM Registration", value: "Active" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Knowledge Base Tab ───────────── */}
        <TabsContent value="knowledge" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Knowledge Base</h2>
              <p className="text-sm text-muted-foreground">{knowledgeDocs.length} documents used for RAG during calls</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4" /> Upload Document</Button>
              <Button variant="outline" size="sm"><Globe className="mr-2 h-4 w-4" /> Add URL</Button>
            </div>
          </div>
          <DataTable columns={kbColumns} data={knowledgeDocs} searchKey="name" searchPlaceholder="Search documents..." />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">RAG Configuration</CardTitle>
              <CardDescription>How the knowledge base is used during calls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Chunk Size", value: "512 tokens" },
                { label: "Overlap", value: "50 tokens" },
                { label: "Top-K Results", value: "5" },
                { label: "Similarity Threshold", value: "0.78" },
                { label: "Embedding Model", value: "text-embedding-3-small" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-mono font-medium">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Integrations Tab ─────────────── */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Integrations</h2>
              <p className="text-sm text-muted-foreground">Connected services for this campaign</p>
            </div>
            <Button variant="outline" size="sm"><Link2 className="mr-2 h-4 w-4" /> Add Integration</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <Card key={integration.name}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <Badge variant={integration.status === "Inactive" ? "secondary" : "default"} className={
                      integration.status !== "Inactive" ? "bg-success/10 text-success border-0" : ""
                    }>
                      {integration.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Last sync: {integration.lastSync}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Webhook Configuration</CardTitle>
              <CardDescription>Real-time event notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Endpoint URL</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">https://api.acme.com/webhooks/calls</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3" /></Button>
                </div>
              </div>
              {[
                { label: "Events", value: "call.completed, call.failed, demo.booked" },
                { label: "Format", value: "JSON" },
                { label: "Retries", value: "3 attempts" },
                { label: "Signing Secret", value: "••••••••••••" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-mono font-medium">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Settings Tab ─────────────────── */}
        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-lg font-semibold">Campaign Settings</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" /> Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Days</span>
                  <div className="flex gap-1">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <Badge
                        key={day}
                        variant={campaignSettings.schedule.days.includes(day) ? "default" : "secondary"}
                        className="text-xs px-1.5"
                      >
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
                {[
                  { label: "Calling Window", value: `${campaignSettings.schedule.startTime} – ${campaignSettings.schedule.endTime}` },
                  { label: "Timezone", value: campaignSettings.schedule.timezone },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Phone className="h-4 w-4" /> Retry Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Max Retries", value: String(campaignSettings.retryPolicy.maxRetries) },
                  { label: "Retry Delay", value: campaignSettings.retryPolicy.retryDelay },
                  { label: "Retry On", value: campaignSettings.retryPolicy.retryOn.join(", ") },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Settings className="h-4 w-4" /> General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Max Concurrency", value: `${campaignSettings.concurrency} calls` },
                  { label: "Contact List Size", value: String(campaignSettings.contactListSize) },
                  { label: "Remaining", value: String(campaignSettings.contactsRemaining) },
                  { label: "Created", value: campaignSettings.createdAt },
                  { label: "Last Modified", value: campaignSettings.lastModified },
                  { label: "Owner", value: campaignSettings.owner },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Volume2 className="h-4 w-4" /> Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Do Not Call (DNC) check", enabled: true },
                  { label: "Record all calls", enabled: true },
                  { label: "TCPA compliance mode", enabled: true },
                  { label: "Voicemail detection", enabled: true },
                  { label: "Leave voicemail message", enabled: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <Switch checked={item.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
