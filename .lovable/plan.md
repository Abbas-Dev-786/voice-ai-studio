# Voice AI Calling SaaS — Implementation Plan

## Phase 1: Foundation

- **Design System**: Set up light theme colors but user can switch to dark theme as well, main theme would be light (#0F1117, #1A1D27, etc.), fonts (DM Sans, Inter, JetBrains Mono), and reusable components (StatusBadge, StatCard, DataTable, EmptyState)
- **Layout Shell**: Sidebar (240px, collapsible to 64px icon-only) with grouped nav + top bar (56px) with breadcrumb and user avatar
- **Auth Pages**: Login, Sign Up, Forgot Password — email/password forms with dark styling (no actual backend yet)

## Phase 2: Core Experience

- **Dashboard Home**: 4 KPI stat cards, recent calls table, active agents list, usage progress bar
- **Agents List**: Data table with status badges, search/filter, empty state with CTA
- **Create Agent Wizard**: 5-step flow (Persona → Prompt → Tools → Phone Number → Review) with step validation and progress bar
- **Agent Detail/Edit**: Edit settings + call history for that agent
- **Agent Playground**: Split-screen with phone simulator UI (left) and live transcript feed (right) — mock/demo data

## Phase 3: Operations

- **Call Logs**: Searchable/filterable table of all calls with status, duration, cost
- **Call Detail**: Two-column layout — metadata/cost/sentiment (left), audio player with synced transcript bubbles (right)
- **Campaigns List**: Table with progress bars, status badges, start/pause controls
- **Create Campaign**: Upload contacts, assign agent, schedule, retry rules
- **Campaign Detail**: Live stats, call-by-call log, pause/resume/stop, export
- **Phone Numbers**: List owned numbers, agent assignment, buy new number UI

## Phase 4: Growth & Config

- **Knowledge Base**: File upload list with sync status
- **Integrations**: CRM connect cards (HubSpot, Salesforce, Zapier, Make, webhooks)
- **Webhook Logs**: Filterable event log with request/response inspector
- **Settings pages**: General, Team & Members, Billing & Usage, API Keys, Notifications

## Phase 5: Polish

- **Onboarding Wizard** (/onboarding): First-time setup flow — create agent, buy number, test call
- **Landing Page + Pricing**: Hero section, features, testimonials, 3-tier pricing with monthly/annual toggle
- **Empty states** on all list pages, loading skeletons, error states, confirmation modals for destructive actions

## Notes

- All pages use mock/static data initially — no backend connected yet
- 26 total pages, all reachable via sidebar navigation
- Responsive down to 1024px, sidebar collapses to icon-only
- Status color system enforced throughout (green=live, amber=paused, red=error, gray=draft)