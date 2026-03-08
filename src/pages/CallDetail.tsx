import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ChevronLeft, Download, Flag, Play, Pause, SkipForward } from "lucide-react";
import { useState } from "react";

const metadata = {
  contact: "+1 (555) 123-4567",
  agent: "Sales Bot",
  direction: "Outbound",
  date: "Mar 7, 2026, 2:34 PM",
  duration: "3:42",
  status: "live" as const,
};

const costBreakdown = [
  { label: "Telephony", value: "$0.04" },
  { label: "AI Processing", value: "$0.08" },
  { label: "Total", value: "$0.12", bold: true },
];

const transcript = [
  { speaker: "agent", text: "Hello! This is Alex from Acme Corp. Am I speaking with John?", time: "0:00" },
  { speaker: "customer", text: "Yes, this is John. What's this about?", time: "0:04" },
  { speaker: "agent", text: "Great! I'm reaching out because you expressed interest in our enterprise solution. I wanted to see if you had a few minutes to discuss how we can help streamline your operations.", time: "0:07" },
  { speaker: "customer", text: "Sure, I've got about 5 minutes. What can you tell me?", time: "0:18" },
  { speaker: "agent", text: "Our platform handles automated customer calls, qualification, and scheduling. Most of our clients see a 40% reduction in manual outreach time. Would you like me to schedule a demo with our solutions team?", time: "0:22" },
  { speaker: "customer", text: "That sounds promising. Can we do Thursday afternoon?", time: "0:35" },
  { speaker: "agent", text: "Thursday at 2 PM works perfectly. I've booked that for you. You'll receive a confirmation email shortly. Is there anything else I can help with?", time: "0:38" },
  { speaker: "customer", text: "No, that's all. Thanks!", time: "0:48" },
  { speaker: "agent", text: "Thank you, John! Have a great day.", time: "0:50" },
];

export default function CallDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/calls")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Call Detail</h1>
          <p className="text-sm text-muted-foreground">Call #{id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-sm">Call Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span className="font-mono">{metadata.contact}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Agent</span><span>{metadata.agent}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Direction</span><span>{metadata.direction}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{metadata.date}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-mono">{metadata.duration}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Status</span><StatusBadge status={metadata.status} /></div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-sm">Cost Breakdown</h3>
            {costBreakdown.map((item) => (
              <div key={item.label} className={cn("flex justify-between text-sm", item.bold && "font-semibold border-t pt-2")}>
                <span className={item.bold ? "" : "text-muted-foreground"}>{item.label}</span>
                <span className="font-mono">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-sm">Sentiment</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground"><span>Negative</span><span>Positive</span></div>
              <div className="relative h-2 rounded-full bg-muted">
                <div className="absolute left-[72%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-success bg-card" />
                <div className="h-full rounded-full bg-gradient-to-r from-destructive via-warning to-success" style={{ opacity: 0.3 }} />
              </div>
              <p className="text-xs text-center text-success font-medium">Positive (72%)</p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-sm">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary">demo-booked</Badge>
              <Badge variant="secondary">enterprise</Badge>
              <Badge variant="secondary">qualified</Badge>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm"><Download className="mr-2 h-3.5 w-3.5" /> Download Recording</Button>
            <Button variant="outline" size="sm"><Download className="mr-2 h-3.5 w-3.5" /> Export Transcript</Button>
            <Button variant="outline" size="sm"><Flag className="mr-2 h-3.5 w-3.5" /> Flag for Review</Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Audio Player */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <Button size="icon" variant="outline" className="h-10 w-10 rounded-full" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="flex-1">
                <div className="h-8 rounded bg-muted flex items-end gap-px px-1">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="flex-1 rounded-t bg-primary/30" style={{ height: `${Math.random() * 100}%` }} />
                  ))}
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">0:00 / 3:42</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Speed:</span>
              {[1, 1.5, 2].map((s) => (
                <Button key={s} variant={playbackSpeed === s ? "default" : "ghost"} size="sm" className="h-6 px-2 text-xs" onClick={() => setPlaybackSpeed(s)}>
                  {s}x
                </Button>
              ))}
            </div>
          </div>

          {/* Transcript */}
          <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-sm">Transcript</h3>
            <div className="space-y-3">
              {transcript.map((line, i) => (
                <div key={i} className={cn("flex", line.speaker === "agent" ? "justify-start" : "justify-end")}>
                  <div className={cn(
                    "max-w-[85%] rounded-xl px-4 py-2.5",
                    line.speaker === "agent" ? "bg-primary/10" : "bg-muted"
                  )}>
                    <p className="text-sm">{line.text}</p>
                    <button className="text-[10px] text-primary hover:underline mt-1">{line.time}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
