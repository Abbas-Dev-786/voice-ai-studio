import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Plus } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ImportSIPDialog } from "@/components/dialogs/ImportSIPDialog";

const numbers = [
  { id: "1", number: "+1 (555) 100-2000", label: "Primary Outbound", provider: "Twilio", agent: "Sales Bot", status: "live" as const, type: "Local", calls: 642 },
  { id: "2", number: "+1 (555) 200-3000", label: "Backup Line", provider: "Twilio", agent: "Sales Bot", status: "live" as const, type: "Local", calls: 200 },
  { id: "3", number: "+1 (555) 300-4000", label: "Support Line", provider: "Twilio", agent: "Support AI", status: "live" as const, type: "Toll-free", calls: 156 },
  { id: "4", number: "+1 (800) 400-5000", label: "SIP Trunk", provider: "SIP", agent: "—", status: "paused" as const, type: "SIP", calls: 0 },
];

const columns: Column<typeof numbers[0]>[] = [
  { key: "number", label: "Number", render: (r) => <span className="font-mono text-sm font-medium">{r.number}</span> },
  { key: "label", label: "Label" },
  { key: "provider", label: "Provider", hideOnMobile: true, render: (r) => (
    <Badge variant="secondary" className="text-xs font-normal">{r.provider}</Badge>
  )},
  { key: "agent", label: "Assigned Agent", hideOnMobile: true },
  { key: "type", label: "Type", hideOnMobile: true, render: (r) => <Badge variant="secondary">{r.type}</Badge> },
  { key: "calls", label: "Calls", hideOnMobile: true, sortable: true },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

export default function PhoneNumbers() {
  const navigate = useNavigate();
  const [sipDialogOpen, setSipDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Phone Numbers</h1>
          <p className="text-sm text-muted-foreground">Manage phone numbers for ElevenLabs telephony. Import from Twilio or connect via SIP.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSipDialogOpen(true)}>
            Import SIP Trunk
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Buy Number (Twilio)
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Numbers</TabsTrigger>
          <TabsTrigger value="twilio">Twilio</TabsTrigger>
          <TabsTrigger value="sip">SIP Trunks</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {numbers.length > 0 ? (
            <DataTable columns={columns} data={numbers} searchKey="number" searchPlaceholder="Search numbers..." />
          ) : (
            <EmptyState icon={Phone} title="No phone numbers" description="Import from Twilio or connect a SIP trunk to get started." actionLabel="Buy Number" onAction={() => {}} />
          )}
        </TabsContent>

        <TabsContent value="twilio" className="mt-4">
          <DataTable columns={columns} data={numbers.filter((n) => n.provider === "Twilio")} searchKey="number" searchPlaceholder="Search Twilio numbers..." />
        </TabsContent>

        <TabsContent value="sip" className="mt-4">
          <DataTable columns={columns} data={numbers.filter((n) => n.provider === "SIP")} searchKey="number" searchPlaceholder="Search SIP trunks..." />
        </TabsContent>
      </Tabs>

      <ImportSIPDialog open={sipDialogOpen} onOpenChange={setSipDialogOpen} />
    </div>
  );
}
