import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ChevronLeft, ChevronRight, Check, Play, Bot,
  Calendar, Search, Users, PhoneForwarded,
} from "lucide-react";

const dialogSteps = ["Persona", "Prompt", "Tools", "Review"] as const;

const voices = [
  { id: "aria", name: "Aria", lang: "English (US)", gender: "Female" },
  { id: "marcus", name: "Marcus", lang: "English (US)", gender: "Male" },
  { id: "sophie", name: "Sophie", lang: "English (UK)", gender: "Female" },
  { id: "raj", name: "Raj", lang: "English (IN)", gender: "Male" },
  { id: "lucia", name: "Lucia", lang: "Spanish", gender: "Female" },
  { id: "hans", name: "Hans", lang: "German", gender: "Male" },
];

const agentTools = [
  { id: "calendar", name: "Calendar Booking", description: "Schedule appointments during calls", icon: Calendar },
  { id: "crm", name: "CRM Lookup", description: "Access customer data in real-time", icon: Search },
  { id: "faq", name: "FAQ Search", description: "Search knowledge base for answers", icon: Users },
  { id: "transfer", name: "Transfer to Human", description: "Escalate call to a live agent", icon: PhoneForwarded },
];

const models = [
  { id: "gpt-4o", name: "GPT-4o", description: "Best quality" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast & affordable" },
  { id: "gpt-3.5", name: "GPT-3.5", description: "Budget option" },
];

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (agent: { name: string; model: string; voice: string }) => void;
}

export function CreateAgentDialog({ open, onOpenChange, onCreated }: CreateAgentDialogProps) {
  const [step, setStep] = useState(0);
  const [agentName, setAgentName] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("aria");
  const [model, setModel] = useState("gpt-4o");
  const [language, setLanguage] = useState("en-us");
  const [personality, setPersonality] = useState([50]);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [role, setRole] = useState("");
  const [enabledTools, setEnabledTools] = useState<string[]>([]);

  const reset = () => {
    setStep(0);
    setAgentName("");
    setSelectedVoice("aria");
    setModel("gpt-4o");
    setLanguage("en-us");
    setPersonality([50]);
    setSystemPrompt("");
    setRole("");
    setEnabledTools([]);
  };

  const handleClose = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const canNext = () => {
    if (step === 0) return agentName.trim().length > 0;
    if (step === 1) return systemPrompt.trim().length > 0;
    return true;
  };

  const handleCreate = () => {
    onCreated?.({
      name: agentName,
      model: models.find(m => m.id === model)?.name || model,
      voice: voices.find(v => v.id === selectedVoice)?.name || selectedVoice,
    });
    handleClose(false);
  };

  const toggleTool = (id: string) => {
    setEnabledTools(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const insertVariable = (v: string) => {
    setSystemPrompt(prev => prev + ` {${v}}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Create Agent
          </DialogTitle>
          <DialogDescription>Set up a new voice AI agent for this campaign.</DialogDescription>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center gap-1">
          {dialogSteps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  i === step && "bg-primary text-primary-foreground",
                  i < step && "bg-primary/10 text-primary cursor-pointer",
                  i > step && "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < dialogSteps.length - 1 && (
                <div className={cn("h-px flex-1 mx-1", i < step ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>

        <Separator />

        {/* Step 0: Persona */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input id="agent-name" placeholder="e.g. Sales Assistant" value={agentName} onChange={e => setAgentName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-role">Role / Purpose</Label>
                <Input id="agent-role" placeholder="e.g. Primary outbound caller" value={role} onChange={e => setRole(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {models.map(m => (
                      <SelectItem key={m.id} value={m.id}>
                        <span className="font-medium">{m.name}</span>
                        <span className="text-muted-foreground ml-1.5 text-xs">— {m.description}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-us">English (US)</SelectItem>
                    <SelectItem value="en-gb">English (UK)</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Voice</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {voices.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all",
                      selectedVoice === v.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/40"
                    )}
                  >
                    <div className="rounded-full bg-muted p-1.5">
                      <Play className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{v.name}</p>
                      <p className="text-[11px] text-muted-foreground">{v.lang} · {v.gender}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Personality: {personality[0] < 30 ? "Formal" : personality[0] > 70 ? "Casual" : "Balanced"}</Label>
              <Slider value={personality} onValueChange={setPersonality} max={100} step={1} className="mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Formal</span><span>Casual</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Prompt */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label>System Prompt</Label>
              <Select onValueChange={insertVariable}>
                <SelectTrigger className="w-auto h-7 text-xs">
                  <SelectValue placeholder="Insert Variable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer_name">customer_name</SelectItem>
                  <SelectItem value="company">company</SelectItem>
                  <SelectItem value="product">product</SelectItem>
                  <SelectItem value="date">date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="You are a helpful sales assistant for {company}. Your goal is to..."
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              className="min-h-[180px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">{systemPrompt.length} characters</p>
          </div>
        )}

        {/* Step 2: Tools */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Enable tools your agent can use during calls</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {agentTools.map(tool => (
                <div
                  key={tool.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3.5 transition-all",
                    enabledTools.includes(tool.id) && "border-primary bg-primary/5"
                  )}
                >
                  <div className="rounded-lg bg-muted p-2">
                    <tool.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                  <Switch checked={enabledTools.includes(tool.id)} onCheckedChange={() => toggleTool(tool.id)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid gap-3 grid-cols-2">
              {[
                { label: "Name", value: agentName || "—" },
                { label: "Role", value: role || "—" },
                { label: "Model", value: models.find(m => m.id === model)?.name || "—" },
                { label: "Voice", value: voices.find(v => v.id === selectedVoice)?.name || "—" },
                { label: "Language", value: language.toUpperCase() },
                { label: "Tools", value: enabledTools.length > 0 ? `${enabledTools.length} enabled` : "None" },
              ].map(item => (
                <div key={item.label} className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            {systemPrompt && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">System Prompt</p>
                <p className="mt-1 text-sm whitespace-pre-wrap line-clamp-4">{systemPrompt}</p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Back
            </Button>
          ) : (
            <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
              Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              <Bot className="mr-1.5 h-3.5 w-3.5" /> Create Agent
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
