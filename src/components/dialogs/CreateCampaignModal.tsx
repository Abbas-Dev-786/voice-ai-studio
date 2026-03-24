import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Bot, ChevronDown, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const llmModels = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
];

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignModal({ open, onOpenChange }: CreateCampaignModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [showCustomise, setShowCustomise] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleLaunch = () => {
    if (!name.trim() || !goalDescription.trim()) return;

    // No contacts = save as draft
    toast({
      title: "Campaign created as Draft",
      description: "Add contacts to launch.",
    });
    onOpenChange(false);
    navigate("/campaigns");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
          <DialogDescription>Set up a new outbound calling campaign</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label>Campaign Name <span className="text-destructive">*</span></Label>
            <Input
              placeholder="e.g. Q2 Product Launch"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 80))}
            />
            <p className="text-xs text-muted-foreground text-right">{name.length}/80</p>
          </div>

          {/* Campaign Goal */}
          <div className="space-y-2">
            <Label>Campaign Goal <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="e.g. Reach out to trial users who haven't booked a demo yet and schedule a 15-min product walkthrough"
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value.slice(0, 200))}
              className="min-h-[80px] text-sm"
            />
            <div className="flex justify-between">
              <p className="text-xs text-muted-foreground">Briefly describe what this campaign should achieve — this guides the agent's behavior.</p>
              <p className="text-xs text-muted-foreground shrink-0 ml-2">{goalDescription.length}/200</p>
            </div>
          </div>

          {/* Customise agent toggle */}
          {goalDescription.trim() && (
            <div className="rounded-lg border bg-primary/5 p-3">
              <div className="flex items-start gap-2.5">
                <Bot className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="text-sm">
                  <span>We'll set up an agent based on your goal. </span>
                  <button
                    onClick={() => setShowCustomise(!showCustomise)}
                    className="text-primary font-medium hover:underline"
                  >
                    {showCustomise ? "Hide" : "Customise →"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Inline Agent Customisation */}
          {showCustomise && (
            <div className="space-y-4 rounded-lg border p-4 bg-card">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs">Agent Name</Label>
                  <Input defaultValue="Voice Agent" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">LLM Model</Label>
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
              <div className="space-y-2">
                <Label className="text-xs">System Prompt</Label>
                <Textarea
                  defaultValue="You are a voice agent. Follow the campaign goal and assist callers professionally."
                  className="min-h-[80px] text-sm"
                />
              </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ChevronDown className={cn("h-3 w-3 transition-transform", showAdvanced && "rotate-180")} />
                {showAdvanced ? "Hide advanced" : "Show advanced"}
              </button>

              {showAdvanced && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Temperature</Label>
                    <Slider defaultValue={[0.7]} max={2} step={0.1} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Max Tokens</Label>
                    <Input type="number" defaultValue="1024" className="h-8 text-sm" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Optional Setup */}
          <Collapsible open={showOptional} onOpenChange={setShowOptional}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showOptional && "rotate-180")} />
                Optional setup
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 space-y-4">
              {/* CSV Upload */}
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                <Upload className="h-6 w-6 text-muted-foreground mb-1.5" />
                <p className="text-sm font-medium">Upload contacts CSV</p>
                <p className="text-xs text-muted-foreground">Drag & drop or click to browse</p>
                <Button variant="outline" size="sm" className="mt-2">Browse Files</Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs">Phone Number</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Auto-assign" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-assign</SelectItem>
                      <SelectItem value="1">+1 (555) 100-2000</SelectItem>
                      <SelectItem value="2">+1 (555) 200-3000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Start Date</Label>
                  <Input type="date" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Calling Hours</Label>
                  <Select defaultValue="business">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business hours (9-5)</SelectItem>
                      <SelectItem value="extended">Extended (8-8)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Max Retries</Label>
                  <Select defaultValue="2">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No retries</SelectItem>
                      <SelectItem value="1">1 retry</SelectItem>
                      <SelectItem value="2">2 retries</SelectItem>
                      <SelectItem value="3">3 retries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleLaunch} disabled={!name.trim() || !goal}>
              Launch Campaign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
