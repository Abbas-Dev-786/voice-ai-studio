import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Trash2, Mail } from "lucide-react";

const members = [
  { name: "John Doe", email: "john@acme.com", role: "Admin", initials: "JD" },
  { name: "Sarah Chen", email: "sarah@acme.com", role: "Editor", initials: "SC" },
  { name: "Mike Wilson", email: "mike@acme.com", role: "Viewer", initials: "MW" },
];

export default function SettingsTeam() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team & Members</h1>
          <p className="text-sm text-muted-foreground">Manage team access</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Invite Member</Button>
      </div>

      <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm space-y-4">
        <h3 className="font-semibold">Invite by Email</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-2">
            <Input placeholder="email@company.com" type="email" />
          </div>
          <Select defaultValue="editor">
            <SelectTrigger className="w-full sm:w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Button><Mail className="mr-2 h-4 w-4" /> Send</Button>
        </div>
      </div>

      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.email} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{m.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-muted-foreground truncate">{m.email}</p>
            </div>
            <Badge variant="secondary">{m.role}</Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
