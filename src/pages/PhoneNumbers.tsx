import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Phone, Plus } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { BuyPhoneNumberDialog } from "@/components/dialogs/BuyPhoneNumberDialog";
import { ImportSIPDialog } from "@/components/dialogs/ImportSIPDialog";

const numbers = [
  { id: "1", number: "+1 (555) 100-2000", label: "Main Line", agent: "Sales Bot", status: "live" as const, type: "Local" },
  { id: "2", number: "+1 (555) 200-3000", label: "Sales Line", agent: "Outreach Pro", status: "live" as const, type: "Local" },
  { id: "3", number: "+1 (555) 300-4000", label: "Support Line", agent: "Support AI", status: "live" as const, type: "Toll-free" },
  { id: "4", number: "+1 (800) 400-5000", label: "Unassigned", agent: "—", status: "draft" as const, type: "Toll-free" },
];

const columns: Column<typeof numbers[0]>[] = [
  { key: "number", label: "Number", render: (r) => <span className="font-mono text-sm font-medium">{r.number}</span> },
  { key: "label", label: "Label" },
  { key: "agent", label: "Assigned Agent", hideOnMobile: true },
  { key: "type", label: "Type", hideOnMobile: true, render: (r) => <Badge variant="secondary">{r.type}</Badge> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

export default function PhoneNumbers() {
  const [buyOpen, setBuyOpen] = useState(false);
  const [sipOpen, setSipOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Phone Numbers</h1>
          <p className="text-sm text-muted-foreground">Manage your phone numbers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSipOpen(true)}>Import via SIP</Button>
          <Button onClick={() => setBuyOpen(true)}><Plus className="mr-2 h-4 w-4" /> Buy Number</Button>
        </div>
      </div>

      {numbers.length > 0 ? (
        <DataTable columns={columns} data={numbers} searchKey="number" searchPlaceholder="Search numbers..." />
      ) : (
        <EmptyState icon={Phone} title="No phone numbers" description="Buy or import a phone number to get started." actionLabel="Buy Number" onAction={() => setBuyOpen(true)} />
      )}

      <BuyPhoneNumberDialog open={buyOpen} onOpenChange={setBuyOpen} />
      <ImportSIPDialog open={sipOpen} onOpenChange={setSipOpen} />
    </div>
  );
}
