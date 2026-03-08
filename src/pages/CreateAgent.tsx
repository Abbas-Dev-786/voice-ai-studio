import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight, Play, Calendar, Search, Users, PhoneForwarded, Phone } from "lucide-react";

const steps = ["Persona", "Prompt", "Tools", "Phone Number", "Review"];

const voices = [
  { id: "aria", name: "Aria", lang: "English (US)", gender: "Female" },
  { id: "marcus", name: "Marcus", lang: "English (US)", gender: "Male" },
  { id: "sophie", name: "Sophie", lang: "English (UK)", gender: "Female" },
  { id: "raj", name: "Raj", lang: "English (IN)", gender: "Male" },
  { id: "lucia", name: "Lucia", lang: "Spanish", gender: "Female" },
  { id: "hans", name: "Hans", lang: "German", gender: "Male" },
];

const tools = [
  { id: "calendar", name: "Calendar Booking", description: "Schedule appointments during calls", icon: Calendar },
  { id: "crm", name: "CRM Lookup", description: "Access customer data in real-time", icon: Search },
  { id: "faq", name: "FAQ Search", description: "Search knowledge base for answers", icon: Users },
  { id: "transfer", name: "Transfer to Human", description: "Escalate call to a live agent", icon: PhoneForwarded },
];

const phoneNumbers = [
  { id: "1", number: "+1 (555) 100-2000", label: "Main Line" },
  { id: "2", number: "+1 (555) 200-3000", label: "Sales Line" },
  { id: "3", number: "+1 (555) 300-4000", label: "Support Line" },
];

export default function CreateAgent() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [agentName, setAgentName] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("aria");
  const [language, setLanguage] = useState("en-us");
  const [personality, setPersonality] = useState([50]);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [enabledTools, setEnabledTools] = useState<string[]>([]);
  const [selectedNumber, setSelectedNumber] = useState("");

  const toggleTool = (id: string) => {
    setEnabledTools((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  const insertVariable = (v: string) => {
    setSystemPrompt((prev) => prev + ` {${v}}`);
  };

  const canNext = () => {
    if (currentStep === 0) return agentName.trim().length > 0;
    if (currentStep === 1) return systemPrompt.trim().length > 0;
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/agents")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Agent</h1>
          <p className="text-sm text-muted-foreground">Set up a new voice AI agent</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1">
            <button
              onClick={() => i < currentStep && setCurrentStep(i)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                i === currentStep && "bg-primary text-primary-foreground",
                i < currentStep && "bg-primary/10 text-primary cursor-pointer",
                i > currentStep && "bg-muted text-muted-foreground"
              )}
            >
              {i < currentStep ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{step}</span>
            </button>
            {i < steps.length - 1 && <div className={cn("h-px flex-1 mx-1", i < currentStep ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input id="name" placeholder="e.g. Sales Assistant" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Voice</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {voices.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                      selectedVoice === v.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/40"
                    )}
                  >
                    <div className="rounded-full bg-muted p-2">
                      <Play className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.lang}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="space-y-2">
                <Label>Personality: {personality[0] < 30 ? "Formal" : personality[0] > 70 ? "Casual" : "Balanced"}</Label>
                <Slider value={personality} onValueChange={setPersonality} max={100} step={1} className="mt-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Formal</span><span>Casual</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label>System Prompt</Label>
              <Select onValueChange={insertVariable}>
                <SelectTrigger className="w-auto h-8 text-xs">
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
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">{systemPrompt.length} characters</p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Enable tools your agent can use during calls</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 transition-all",
                    enabledTools.includes(tool.id) && "border-primary bg-primary/5"
                  )}
                >
                  <div className="rounded-lg bg-muted p-2">
                    <tool.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                  <Switch checked={enabledTools.includes(tool.id)} onCheckedChange={() => toggleTool(tool.id)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Assign a phone number to this agent</p>
            <div className="space-y-3">
              {phoneNumbers.map((pn) => (
                <button
                  key={pn.id}
                  onClick={() => setSelectedNumber(pn.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all",
                    selectedNumber === pn.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/40"
                  )}
                >
                  <div className="rounded-lg bg-muted p-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-medium">{pn.number}</p>
                    <p className="text-xs text-muted-foreground">{pn.label}</p>
                  </div>
                  {selectedNumber === pn.id && <Check className="ml-auto h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
            <Button variant="outline" className="w-full">Buy a New Number</Button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Review your agent</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{agentName || "—"}</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs text-muted-foreground">Voice</p>
                <p className="font-medium">{voices.find((v) => v.id === selectedVoice)?.name || "—"}</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs text-muted-foreground">Tools</p>
                <p className="font-medium">{enabledTools.length > 0 ? enabledTools.map((t) => tools.find((x) => x.id === t)?.name).join(", ") : "None"}</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-xs text-muted-foreground">Phone Number</p>
                <p className="font-mono font-medium">{phoneNumbers.find((p) => p.id === selectedNumber)?.number || "None"}</p>
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">System Prompt</p>
              <p className="mt-1 text-sm whitespace-pre-wrap">{systemPrompt || "—"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate("/agents")} >
          <ChevronLeft className="mr-1 h-4 w-4" /> {currentStep === 0 ? "Cancel" : "Back"}
        </Button>
        <div className="flex gap-2">
          {currentStep === 4 && (
            <Button variant="outline" onClick={() => navigate(`/agents/1/playground`)}>Test in Playground</Button>
          )}
          <Button
            onClick={() => currentStep < 4 ? setCurrentStep(currentStep + 1) : navigate("/agents")}
            disabled={!canNext()}
          >
            {currentStep === 4 ? "Publish Agent" : "Next"} {currentStep < 4 && <ChevronRight className="ml-1 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
