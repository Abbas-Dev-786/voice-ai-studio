import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { DataTable, Column } from "@/components/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Play, Settings, History, Trash2, Mic, Wrench, BookOpen, Globe, BarChart3 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { VoiceSettings, defaultVoiceConfig } from "@/components/VoiceSettings";
import { ConversationFlowSettings, defaultConversationFlowConfig } from "@/components/ConversationFlowSettings";
import { ToolsConfig, defaultToolConfig } from "@/components/ToolsConfig";
import { WebWidgetConfig } from "@/components/WebWidgetConfig";

const agentCallHistory = [
  { contact: "+1 (555) 111-2222", duration: "2:34", status: "live" as const, time: "10 min ago", cost: "$0.08" },
  { contact: "+1 (555) 333-4444", duration: "5:12", status: "live" as const, time: "1 hr ago", cost: "$0.18" },
  { contact: "+1 (555) 555-6666", duration: "0:22", status: "error" as const, time: "2 hrs ago", cost: "$0.02" },
  { contact: "+1 (555) 777-8888", duration: "3:45", status: "live" as const, time: "3 hrs ago", cost: "$0.12" },
];

const callColumns: Column<typeof agentCallHistory[0]>[] = [
  { key: "contact", label: "Contact", render: (r) => <span className="font-mono text-sm">{r.contact}</span> },
  { key: "duration", label: "Duration", hideOnMobile: true, render: (r) => <span className="font-mono text-sm">{r.duration}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "cost", label: "Cost", hideOnMobile: true, render: (r) => <span className="font-mono text-sm">{r.cost}</span> },
  { key: "time", label: "Time", hideOnMobile: true },
];

const llmModels = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
];

export default function AgentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [voiceConfig, setVoiceConfig] = useState(defaultVoiceConfig);
  const [flowConfig, setFlowConfig] = useState(defaultConversationFlowConfig);
  const [toolConfig, setToolConfig] = useState(defaultToolConfig);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/agents")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Sales Bot</h1>
              <StatusBadge status="live" />
            </div>
            <p className="text-sm text-muted-foreground">Agent ID: {id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/agents/${id}/playground`)}>
            <Play className="mr-2 h-4 w-4" /> Test
          </Button>
          <Button variant="destructive" size="icon" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="config">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="config" className="gap-1.5"><Settings className="h-3.5 w-3.5" /> Config</TabsTrigger>
          <TabsTrigger value="voice" className="gap-1.5"><Mic className="h-3.5 w-3.5" /> Voice</TabsTrigger>
          <TabsTrigger value="conversation" className="gap-1.5"><Settings className="h-3.5 w-3.5" /> Conversation</TabsTrigger>
          <TabsTrigger value="tools" className="gap-1.5"><Wrench className="h-3.5 w-3.5" /> Tools</TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Knowledge</TabsTrigger>
          <TabsTrigger value="deploy" className="gap-1.5"><Globe className="h-3.5 w-3.5" /> Deploy</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5"><History className="h-3.5 w-3.5" /> History</TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Analytics</TabsTrigger>
        </TabsList>

        {/* Config Tab */}
        <TabsContent value="config" className="space-y-6 mt-4">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Agent Name</Label>
              <Input defaultValue="Sales Bot" />
            </div>
            <div className="space-y-2">
              <Label>LLM Model</Label>
              <Select defaultValue="gpt-4o">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {llmModels.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input type="number" step="0.1" min="0" max="2" defaultValue="0.7" />
            </div>
            <div className="space-y-2">
              <Label>Max Tokens</Label>
              <Input type="number" defaultValue="1024" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>System Prompt</Label>
            <Textarea
              defaultValue="You are a professional sales assistant for Acme Corp. Your goal is to qualify leads and schedule demo calls."
              className="min-h-[150px] font-mono text-sm"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => toast({ title: "Changes saved", description: "Agent configuration has been updated." })}>
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Voice Tab */}
        <TabsContent value="voice" className="mt-4">
          <VoiceSettings config={voiceConfig} onChange={setVoiceConfig} />
          <div className="flex justify-end mt-6">
            <Button onClick={() => toast({ title: "Voice updated", description: "Voice settings have been saved." })}>
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Conversation Tab */}
        <TabsContent value="conversation" className="mt-4">
          <ConversationFlowSettings config={flowConfig} onChange={setFlowConfig} />
          <div className="flex justify-end mt-6">
            <Button onClick={() => toast({ title: "Settings saved", description: "Conversation flow updated." })}>
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="mt-4">
          <ToolsConfig config={toolConfig} onChange={setToolConfig} />
          <div className="flex justify-end mt-6">
            <Button onClick={() => toast({ title: "Tools saved", description: "Tool configuration updated." })}>
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">Upload documents for the agent to use as a knowledge base (RAG). Supported: PDF, DOCX, TXT, CSV, URLs.</p>
          <div className="rounded-xl border border-dashed p-8 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium">Drag & drop files or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT, CSV up to 50MB</p>
            <Button variant="outline" className="mt-4">Upload Document</Button>
          </div>
          <div className="space-y-2">
            <Label>URL Sources</Label>
            <div className="flex gap-2">
              <Input placeholder="https://docs.example.com" className="flex-1" />
              <Button variant="outline">Add URL</Button>
            </div>
            <p className="text-xs text-muted-foreground">The agent will crawl and index the page content.</p>
          </div>
        </TabsContent>

        {/* Deploy Tab */}
        <TabsContent value="deploy" className="mt-4">
          <WebWidgetConfig agentId={id} />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          <DataTable columns={callColumns} data={agentCallHistory} searchKey="contact" searchPlaceholder="Search conversations..." />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Total Conversations", value: "1,847" },
              { label: "Avg Duration", value: "2:34" },
              { label: "Success Rate", value: "94.2%" },
              { label: "Total Cost", value: "$142.50" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-4 shadow-sm">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Agent"
        description="Are you sure you want to delete Sales Bot? This will stop all active campaigns using this agent. This action cannot be undone."
        onConfirm={() => { setDeleteOpen(false); navigate("/agents"); }}
      />
    </div>
  );
}
