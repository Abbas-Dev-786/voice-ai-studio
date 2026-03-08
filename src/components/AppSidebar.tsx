import {
  LayoutDashboard, BarChart3, Bot, Megaphone, PhoneCall, Phone, BookOpen,
  Puzzle, Settings, ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
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
            {!collapsed && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium border-l-2 border-sidebar-primary"
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
          <div className="rounded-lg bg-primary/5 p-3">
            <p className="text-xs font-medium text-primary">Pro Plan</p>
            <p className="text-xs text-muted-foreground">1,250 / 5,000 calls</p>
            <div className="mt-2 h-1.5 rounded-full bg-muted">
              <div className="h-full w-1/4 rounded-full bg-primary" />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
