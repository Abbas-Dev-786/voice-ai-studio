

## Architecture Shift + Dashboard Redesign

### 1. Move Call Metrics to Campaigns (Architecture)

You're right — campaigns are the operational unit where calls happen. Agents are just configurations/templates. The shift:

**Agents become config-only resources:**
- Remove `calls`, `successRate`, `lastActive` from agents list
- Agent detail keeps: Config, Voice, Tools, Knowledge, Deploy tabs
- Agent detail removes: History tab, Analytics tab (these belong to campaigns)
- Agent list shows: name, model, voice, status, # campaigns using it

**Campaigns own all call data:**
- Already mostly correct in `CampaignDetail.tsx` — keep as-is
- Global "Conversations" page (`CallLogs.tsx`) stays as a cross-campaign aggregate view
- Global "Analytics" page stays as a cross-campaign aggregate view

### 2. Dashboard Redesign — Clear User Flow

The current dashboard is a wall of stats with no direction. Here's the redesign:

```text
+----------------------------------------------------------+
|  Welcome back, Alex                          [Quick Actions]
|  You have 2 active campaigns running                      |
+----------------------------------------------------------+
|                                                           |
|  [GETTING STARTED / QUICK ACTIONS BAR]                    |
|  ① Create Agent  →  ② Create Campaign  →  ③ Go Live      |
|  (completed)        (completed)            (active)       |
+----------------------------------------------------------+
|                                                           |
|  [ACTIVE CAMPAIGNS]  ← This is the hero section          |
|  +------------------+  +------------------+               |
|  | Q1 Outreach      |  | Product Launch   |  [View All →] |
|  | ██████░░ 70%     |  | ██░░░░░░ 31%    |               |
|  | 842/1200 called  |  | 156/500 called   |               |
|  | 68% success      |  | 72% success      |               |
|  | $142 spent       |  | $38 spent        |               |
|  +------------------+  +------------------+               |
+----------------------------------------------------------+
|                                                           |
|  [KPI ROW] — aggregated across all campaigns              |
|  Total Calls | Success Rate | Minutes Used | Total Cost   |
+----------------------------------------------------------+
|                                                           |
|  [RECENT CONVERSATIONS]        [QUICK STATS]              |
|  (table, last 8 calls)         - Top performing agent     |
|                                - Busiest campaign          |
|                                - Usage this month          |
+----------------------------------------------------------+
```

**Key UX improvements:**
- **Onboarding stepper**: For new users with no campaigns, show a 3-step guide (Create Agent → Create Campaign → Launch). Disappears once they have an active campaign.
- **Campaign cards as hero**: The most important thing is "what's running right now" — active campaigns are front and center with progress, success rate, and cost.
- **Actionable empty states**: If no campaigns exist, the entire dashboard becomes a single CTA to create one.
- **Quick actions dropdown**: "Create Agent", "Create Campaign", "Buy Number" always accessible.

### Files to Change

| File | Action |
|---|---|
| `src/pages/Dashboard.tsx` | Full redesign — onboarding stepper, active campaign cards, aggregated KPIs, recent conversations, quick stats |
| `src/pages/AgentsList.tsx` | Remove call metrics columns (`calls`, `successRate`, `lastActive`). Add `model`, `voice`, `campaignsCount` |
| `src/pages/AgentDetail.tsx` | Remove History and Analytics tabs (call data lives in campaigns) |
| `src/components/StatCard.tsx` | No change needed |

### Dashboard States

1. **Empty state** (no agents, no campaigns): Full-page onboarding with 3-step wizard CTA
2. **Partial setup** (agents exist, no campaigns): Stepper showing step 2, prompt to create campaign
3. **Active** (campaigns running): Full dashboard with campaign cards, KPIs, recent calls

