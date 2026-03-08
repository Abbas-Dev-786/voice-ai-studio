import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">General Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your workspace</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-semibold">Workspace</h3>
          <div className="space-y-2">
            <Label>Workspace Name</Label>
            <Input defaultValue="Acme Corp" />
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select defaultValue="est">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="est">Eastern (UTC-5)</SelectItem>
                <SelectItem value="cst">Central (UTC-6)</SelectItem>
                <SelectItem value="pst">Pacific (UTC-8)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-semibold">Defaults</h3>
          <div className="space-y-2">
            <Label>Default Voice</Label>
            <Select defaultValue="aria">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aria">Aria (English US)</SelectItem>
                <SelectItem value="marcus">Marcus (English US)</SelectItem>
                <SelectItem value="sophie">Sophie (English UK)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Default Language</Label>
            <Select defaultValue="en-us">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en-us">English (US)</SelectItem>
                <SelectItem value="en-gb">English (UK)</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted p-3">
            <div>
              <p className="text-sm font-medium">Call Recording</p>
              <p className="text-xs text-muted-foreground">Record all calls by default</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
