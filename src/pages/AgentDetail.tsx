import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { ChevronLeft, Settings, Trash2, Mic, Wrench, BookOpen, Globe, Phone } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { VoiceSettings, defaultVoiceConfig } from "@/components/VoiceSettings";
import { ConversationFlowSettings, defaultConversationFlowConfig } from "@/components/ConversationFlowSettings";
import { ToolsConfig, defaultToolConfig } from "@/components/ToolsConfig";
import { WebWidgetConfig } from "@/components/WebWidgetConfig";
import { VoicePlayground } from "@/components/VoicePlayground";
import { useIsMobile } from "@/hooks/use-mobile";




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
  const isMobile = useIsMobile();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [voiceConfig, setVoiceConfig] = useState(defaultVoiceConfig);
  const [flowConfig, setFlowConfig] = useState(defaultConversationFlowConfig);
  const [toolConfig, setToolConfig] = useState(defaultToolConfig);

  const playgroundPanel = (
    <VoicePlayground
      voiceConfig={voiceConfig}
      onVoiceConfigChange={setVoiceConfig}
      agentName="Sales Bot"
    />
  );

  return (
    <div className="space-y-6">
      {/* Header */}
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
          {isMobile && (
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>
              <Phone className="mr-2 h-4 w-4" /> Test Agent
            </Button>
          )}
          <Button variant="destructive" size="icon" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Left: Tabs */}
        <div className="flex-1 min-w-0">
          <Tabs defaultValue="config">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="config" className="gap-1.5"><Settings className="h-3.5 w-3.5" /> Config</TabsTrigger>
              <TabsTrigger value="voice" className="gap-1.5"><Mic className="h-3.5 w-3.5" /> Voice</TabsTrigger>
              <TabsTrigger value="conversation" className="gap-1.5"><Settings className="h-3.5 w-3.5" /> Conversation</TabsTrigger>
              <TabsTrigger value="tools" className="gap-1.5"><Wrench className="h-3.5 w-3.5" /> Tools</TabsTrigger>
              <TabsTrigger value="knowledge" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Knowledge</TabsTrigger>
              <TabsTrigger value="deploy" className="gap-1.5"><Globe className="h-3.5 w-3.5" /> Deploy</TabsTrigger>
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


          </Tabs>
        </div>

        {/* Right: Voice Playground (desktop only) */}
        <div className="hidden lg:block w-[380px] shrink-0">
          <div className="sticky top-6">
            {playgroundPanel}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerTitle className="sr-only">Voice Playground</DrawerTitle>
          <div className="overflow-y-auto p-4 pb-8">
            {playgroundPanel}
          </div>
        </DrawerContent>
      </Drawer>

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
