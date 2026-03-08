import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronLeft, Phone, PhoneOff, Mic } from "lucide-react";

const mockTranscript = [
  { speaker: "agent", text: "Hello! Thank you for calling Acme Corp. How can I help you today?", time: "0:00" },
  { speaker: "customer", text: "Hi, I'm interested in learning about your enterprise plan.", time: "0:03" },
  { speaker: "agent", text: "I'd be happy to help! Our enterprise plan includes unlimited calls, dedicated support, and custom SLA. Would you like me to schedule a demo?", time: "0:08" },
  { speaker: "customer", text: "Yes, that sounds great. Can we do Thursday at 2pm?", time: "0:15" },
  { speaker: "agent", text: "Let me check availability... Thursday at 2pm works perfectly. I've scheduled a demo with our solutions team. You'll receive a confirmation email shortly.", time: "0:18" },
];

export default function AgentPlayground() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isCallActive, setIsCallActive] = useState(false);
  const [useBrowserMic, setUseBrowserMic] = useState(false);
  const [testNumber, setTestNumber] = useState("");
  const [timer, setTimer] = useState(0);

  const startCall = () => {
    setIsCallActive(true);
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    setTimeout(() => { clearInterval(interval); }, 60000);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/agents/${id}`)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agent Playground</h1>
          <p className="text-sm text-muted-foreground">Test your agent with a live call</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Phone Simulator */}
        <div className="lg:col-span-2">
          <div className="mx-auto max-w-xs rounded-2xl border bg-card p-6 shadow-sm">
            <div className="text-center space-y-1 mb-6">
              <p className="text-sm font-medium">Sales Bot</p>
              <p className={cn("text-xs", isCallActive ? "text-success" : "text-muted-foreground")}>
                {isCallActive ? "Call in progress" : "Ready to test"}
              </p>
            </div>

            {isCallActive && (
              <div className="text-center mb-6">
                <p className="text-3xl font-mono font-bold">{formatTime(timer)}</p>
              </div>
            )}

            <div className="space-y-4">
              {!isCallActive && (
                <>
                  <div className="space-y-2">
                    <Input
                      placeholder="+1 (555) 000-0000"
                      value={testNumber}
                      onChange={(e) => setTestNumber(e.target.value)}
                      className="text-center font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm">Use browser mic</Label>
                    </div>
                    <Switch checked={useBrowserMic} onCheckedChange={setUseBrowserMic} />
                  </div>
                </>
              )}

              {isCallActive ? (
                <Button variant="destructive" className="w-full" onClick={() => { setIsCallActive(false); setTimer(0); }}>
                  <PhoneOff className="mr-2 h-4 w-4" /> End Call
                </Button>
              ) : (
                <Button className="w-full bg-success hover:bg-success/90 text-success-foreground" onClick={startCall}>
                  <Phone className="mr-2 h-4 w-4" /> Start Test Call
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Live Feed */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Live Transcript</h2>
            {isCallActive && <span className="h-2 w-2 rounded-full bg-destructive animate-pulse-dot" />}
          </div>

          {isCallActive ? (
            <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
              {mockTranscript.map((line, i) => (
                <div key={i} className={cn("flex", line.speaker === "agent" ? "justify-start" : "justify-end")}>
                  <div className={cn(
                    "max-w-[80%] rounded-xl px-4 py-2.5",
                    line.speaker === "agent" ? "bg-primary/10 text-foreground" : "bg-muted"
                  )}>
                    <p className="text-sm">{line.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{line.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed p-12 text-center">
              <p className="text-sm text-muted-foreground">Start a call to see the live transcript</p>
            </div>
          )}

          {isCallActive && (
            <details className="rounded-xl border bg-card p-4 shadow-sm">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground">Agent Thoughts</summary>
              <div className="mt-3 space-y-2 font-mono text-xs text-muted-foreground">
                <p>[tool_call] calendar.check_availability({"date": "Thursday", "time": "14:00"})</p>
                <p>[result] Available: true</p>
                <p>[tool_call] calendar.book({"date": "Thursday", "time": "14:00", "title": "Enterprise Demo"})</p>
                <p>[result] Booking confirmed, ID: #4521</p>
              </div>
            </details>
          )}

          {isCallActive && (
            <div className="flex gap-4 rounded-xl border bg-card p-3 shadow-sm text-xs text-muted-foreground">
              <span>Latency: <span className="font-mono font-medium text-foreground">120ms</span></span>
              <span>Tokens: <span className="font-mono font-medium text-foreground">342</span></span>
              <span>Est. Cost: <span className="font-mono font-medium text-foreground">$0.02</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
