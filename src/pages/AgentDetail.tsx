import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { DataTable, Column } from "@/components/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Play, Settings, History, Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";

const agentCallHistory = [
  { contact: "+1 (555) 111-2222", duration: "2:34", status: "live" as const, time: "10 min ago" },
  { contact: "+1 (555) 333-4444", duration: "5:12", status: "live" as const, time: "1 hr ago" },
  { contact: "+1 (555) 555-6666", duration: "0:22", status: "error" as const, time: "2 hrs ago" },
  { contact: "+1 (555) 777-8888", duration: "3:45", status: "live" as const, time: "3 hrs ago" },
];

const callColumns: Column<typeof agentCallHistory[0]>[] = [
  { key: "contact", label: "Contact", render: (r) => <span className="font-mono text-sm">{r.contact}</span> },
  { key: "duration", label: "Duration", hideOnMobile: true, render: (r) => <span className="font-mono text-sm">{r.duration}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "time", label: "Time", hideOnMobile: true },
];

export default function AgentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="space-y-6">
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
          <Button variant="outline" onClick={() => navigate(`/agents/${id}/playground`)}>
            <Play className="mr-2 h-4 w-4" /> Test
          </Button>
          <Button variant="destructive" size="icon" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings" className="gap-1.5"><Settings className="h-3.5 w-3.5" /> Settings</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5"><History className="h-3.5 w-3.5" /> Call History</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6 mt-4">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Agent Name</Label>
              <Input defaultValue="Sales Bot" />
            </div>
            <div className="space-y-2">
              <Label>Voice</Label>
              <Input defaultValue="Aria (English US)" disabled />
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
            <Button onClick={() => toast({ title: "Changes saved", description: "Agent settings have been updated." })}>
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <DataTable columns={callColumns} data={agentCallHistory} searchKey="contact" searchPlaceholder="Search calls..." />
        </TabsContent>
      </Tabs>

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
