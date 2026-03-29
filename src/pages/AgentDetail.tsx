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
import { ChevronLeft, Settings, Trash2, Mic, Wrench, Globe, Phone, Lock, AlertTriangle } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { VoiceSettings, defaultVoiceConfig } from "@/components/VoiceSettings";
import { ConversationFlowSettings, defaultConversationFlowConfig } from "@/components/ConversationFlowSettings";
import { ToolsConfig, defaultToolConfig } from "@/components/ToolsConfig";
import { WebWidgetConfig } from "@/components/WebWidgetConfig";
import { VoicePlayground } from "@/components/VoicePlayground";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const llmModels = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
];

// Mock: agents "1" and "4" are active in campaigns
const activeAgentCampaigns: Record<string, string> = {
  "1": "Q1 Outreach",
  "4": "Re-engagement",
};

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

  const activeCampaign = activeAgentCampaigns[id || ""];
  const isActive = !!activeCampaign;

  const playgroundPanel = (
    <VoicePlayground
      voiceConfig={voiceConfig}
      onVoiceConfigChange={setVoiceConfig}
      agentName="Sales Bot"
    />
  );

  const LockedTabNotice = () => (
    <div className="flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 mb-4">
      <Lock className="h-3.5 w-3.5 text-warning shrink-0" />
      <p className="text-xs text-warning">Editing is locked while this agent is active in a campaign.</p>
    </div>
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
            <p className="text-sm text-muted-foreground font-mono text-xs">agent_{id}</p>
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

      {/* Active Campaign Banner */}
      {isActive && (
        <div className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-warning">
              This agent is currently active in {activeCampaign}.
            </p>
            <p className="text-xs text-warning/80 mt-0.5">
              Some settings cannot be edited while the campaign is running.
            </p>
          </div>
        </div>
      )}

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
              <TabsTrigger value="deploy" className="gap-1.5"><Globe className="h-3.5 w-3.5" /> Deploy</TabsTrigger>
            </TabsList>

            {/* Config Tab */}
            <TabsContent value="config" className="space-y-6 mt-4">
              {isActive && <LockedTabNotice />}
              <div className={cn(isActive && "pointer-events-none opacity-60")}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Agent Name</Label>
                    <Input defaultValue="Sales Bot" disabled={isActive} />
                  </div>
                  <div className="space-y-2">
                    <Label>LLM Model</Label>
                    <Select defaultValue="gpt-4o" disabled={isActive}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {llmModels.map((m) => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 mt-6">
                  <div className="space-y-2">
                    <Label>Temperature</Label>
                    <Input type="number" step="0.1" min="0" max="2" defaultValue="0.7" disabled={isActive} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Tokens</Label>
                    <Input type="number" defaultValue="1024" disabled={isActive} />
                  </div>
                </div>
                <div className="space-y-2 mt-6">
                  <Label>System Prompt</Label>
                  <Textarea
                    defaultValue="You are a professional sales assistant for Acme Corp. Your goal is to qualify leads and schedule demo calls."
                    className="min-h-[150px] font-mono text-sm"
                    readOnly={isActive}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  disabled={isActive}
                  onClick={() => toast({ title: "Changes saved", description: "Agent configuration has been updated." })}
                >
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* Voice Tab */}
            <TabsContent value="voice" className="mt-4">
              {isActive && <LockedTabNotice />}
              <div className={cn(isActive && "pointer-events-none opacity-60")}>
                <VoiceSettings config={voiceConfig} onChange={setVoiceConfig} />
              </div>
              <div className="flex justify-end mt-6">
                <Button disabled={isActive} onClick={() => toast({ title: "Voice updated", description: "Voice settings have been saved." })}>
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* Conversation Tab */}
            <TabsContent value="conversation" className="mt-4">
              {isActive && <LockedTabNotice />}
              <div className={cn(isActive && "pointer-events-none opacity-60")}>
                <ConversationFlowSettings config={flowConfig} onChange={setFlowConfig} />
              </div>
              <div className="flex justify-end mt-6">
                <Button disabled={isActive} onClick={() => toast({ title: "Settings saved", description: "Conversation flow updated." })}>
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="mt-4">
              {isActive && <LockedTabNotice />}
              <div className={cn(isActive && "pointer-events-none opacity-60")}>
                <ToolsConfig config={toolConfig} onChange={setToolConfig} />
              </div>
              <div className="flex justify-end mt-6">
                <Button disabled={isActive} onClick={() => toast({ title: "Tools saved", description: "Tool configuration updated." })}>
                  Save Changes
                </Button>
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
