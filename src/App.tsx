import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import { DashboardLayout } from "@/components/DashboardLayout";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import AgentsList from "@/pages/AgentsList";
import NotFound from "@/pages/NotFound";
import { PlaceholderPage } from "@/pages/placeholder";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Dashboard */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/agents" element={<AgentsList />} />
              <Route path="/agents/new" element={<PlaceholderPage title="Create Agent" description="Build a new voice AI agent" />} />
              <Route path="/agents/:id" element={<PlaceholderPage title="Agent Detail" description="View and edit agent configuration" />} />
              <Route path="/agents/:id/playground" element={<PlaceholderPage title="Agent Playground" description="Test your agent with live calls" />} />
              <Route path="/campaigns" element={<PlaceholderPage title="Campaigns" description="Manage outbound calling campaigns" />} />
              <Route path="/campaigns/new" element={<PlaceholderPage title="Create Campaign" description="Set up a new outbound campaign" />} />
              <Route path="/campaigns/:id" element={<PlaceholderPage title="Campaign Detail" description="Monitor campaign progress" />} />
              <Route path="/calls" element={<PlaceholderPage title="Call Logs" description="Browse all call records" />} />
              <Route path="/calls/:id" element={<PlaceholderPage title="Call Detail" description="Review call recording and transcript" />} />
              <Route path="/phone-numbers" element={<PlaceholderPage title="Phone Numbers" description="Manage your phone numbers" />} />
              <Route path="/knowledge" element={<PlaceholderPage title="Knowledge Base" description="Upload documents for agent reference" />} />
              <Route path="/integrations" element={<PlaceholderPage title="Integrations" description="Connect your tools and services" />} />
              <Route path="/integrations/webhooks" element={<PlaceholderPage title="Webhook Logs" description="Monitor webhook events" />} />
              <Route path="/settings" element={<PlaceholderPage title="General Settings" description="Configure your workspace" />} />
              <Route path="/settings/team" element={<PlaceholderPage title="Team & Members" description="Manage team access" />} />
              <Route path="/settings/billing" element={<PlaceholderPage title="Billing & Usage" description="Manage your subscription" />} />
              <Route path="/settings/api" element={<PlaceholderPage title="API Keys" description="Manage API access" />} />
              <Route path="/settings/notifications" element={<PlaceholderPage title="Notifications" description="Configure alert preferences" />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
