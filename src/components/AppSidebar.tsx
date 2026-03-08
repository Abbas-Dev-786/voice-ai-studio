import {
  LayoutDashboard, BarChart3, Bot, Megaphone, PhoneCall, Phone, BookOpen,
  Puzzle, Settings,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Agents",
    items: [
      { title: "All Agents", url: "/agents", icon: Bot },
    ],
  },
  {
    label: "Outreach",
    items: [
      { title: "Campaigns", url: "/campaigns", icon: Megaphone },
      { title: "Call Logs", url: "/calls", icon: PhoneCall },
    ],
  },
  {
    label: "Configuration",
    items: [
      { title: "Phone Numbers", url: "/phone-numbers", icon: Phone },
      { title: "Knowledge Base", url: "/knowledge", icon: BookOpen },
      { title: "Integrations", url: "/integrations", icon: Puzzle },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Phone className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold font-display tracking-tight">VoiceAI</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="rounded-md transition-colors hover:bg-accent"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs font-medium text-primary">Pro Plan</p>
            <p className="text-xs text-muted-foreground">1,250 / 5,000 calls</p>
            <div className="mt-2 h-1.5 rounded-full bg-muted">
              <div className="h-full w-1/4 rounded-full bg-primary transition-all" />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
