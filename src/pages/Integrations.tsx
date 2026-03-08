import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Puzzle, ExternalLink, Check } from "lucide-react";

const integrations = [
  { id: "hubspot", name: "HubSpot", description: "Sync contacts and deals with HubSpot CRM", category: "CRM", connected: true, icon: "🔶" },
  { id: "salesforce", name: "Salesforce", description: "Connect to Salesforce for lead management", category: "CRM", connected: false, icon: "☁️" },
  { id: "zapier", name: "Zapier", description: "Automate workflows with 5,000+ apps", category: "Automation", connected: true, icon: "⚡" },
  { id: "make", name: "Make", description: "Build complex automations visually", category: "Automation", connected: false, icon: "🔧" },
  { id: "slack", name: "Slack", description: "Get call notifications in Slack channels", category: "Communication", connected: true, icon: "💬" },
  { id: "webhooks", name: "Custom Webhooks", description: "Send events to any URL endpoint", category: "Developer", connected: true, icon: "🔗" },
];

export default function Integrations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-sm text-muted-foreground">Connect your tools and services</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((int) => (
          <div key={int.id} className={cn("rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md", int.connected && "ring-1 ring-success/30")}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{int.icon}</span>
                <div>
                  <p className="font-semibold">{int.name}</p>
                  <Badge variant="secondary" className="text-[10px] mt-0.5">{int.category}</Badge>
                </div>
              </div>
              {int.connected && <Check className="h-4 w-4 text-success" />}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{int.description}</p>
            <Button variant={int.connected ? "outline" : "default"} size="sm" className="mt-4 w-full">
              {int.connected ? "Configure" : "Connect"}
              {!int.connected && <ExternalLink className="ml-1 h-3 w-3" />}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
