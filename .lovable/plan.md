

## VoiceAI UX Redesign Migration — Implementation Plan

Based on the 23-page migration document, organized by the document's phasing.

---

### Phase 1 — Critical Bug Fixes

**1.1 Fix `:id` route parameter rendering**
- `CampaignDetail.tsx`: Breadcrumb and Agent ID subtitle show raw `:id` — bind to actual campaign name/agent ID from mock data using `useParams()`
- `AgentDetail.tsx`: Same fix for agent subtitle

**1.2 Fix contradictory success rate metric**
- `Dashboard.tsx`: Rename "Success Rate" stat card to "Top Agent Success" with sublabel "Sales Bot Pro — all-time"

**Files:** `CampaignDetail.tsx`, `AgentDetail.tsx`, `Dashboard.tsx`

---

### Phase 2 — Campaign Creation Redesign (Core Change)

Replace the full-page `CreateCampaign.tsx` wizard with a **single-screen modal dialog**.

**2.1 New `CreateCampaignModal` component**
- Two required fields only:
  - **Campaign name** — text input, max 80 chars, auto-fills from CSV filename if uploaded
  - **Goal** — pill button group (not dropdown): Book Demos, Qualify Leads, Re-engage, Run Survey, Custom
- **Auto-agent confirmation line**: After goal selection, show: `"We've set up a Sales Assistant for you — qualifies leads and books demo calls. [Customise →]"`
- **Customise** expands inline agent config (name, LLM model, voice, system prompt + "Show advanced" for temperature/tokens/voice tuning)
- **Optional fields** in collapsible "Optional setup" section: CSV upload, existing agent picker, phone number, start date, calling hours (default: Business hours), max retries (default: 2), retry interval (default: 4h)
- **Launch button**: If contacts missing → saves as Draft with confirmation: "Campaign created as Draft. Add contacts to launch. [Add contacts now] [I'll do this later]"
- Modal openable from: Dashboard banner, Campaigns list button, keyboard shortcut `C`

**2.2 Campaign status model**
- Add `ready` and `completed` statuses to `StatusBadge.tsx`
- Status flow: Draft → Ready (auto when all resources present) → Live (manual launch) → Paused → Completed

**2.3 Missing resources nudge bar**
- New component on `CampaignDetail.tsx` for Draft campaigns: orange banner listing what's missing with direct action links

**2.4 Route changes**
- Remove `/campaigns/new` page route — creation is now a modal
- Delete or repurpose `CreateCampaign.tsx`

**Files:** New `CreateCampaignModal.tsx`, `CampaignsList.tsx`, `CampaignDetail.tsx`, `StatusBadge.tsx`, `App.tsx`, `Dashboard.tsx`

---

### Phase 3 — Dashboard Improvements

**3.1 Replace Quick Actions dropdown with welcome banner**
- Mission-oriented banner: "You have 2 active campaigns" with two direct buttons: "View Campaigns" and "Create Campaign" (opens modal)
- Remove the generic dropdown menu

**3.2 Quick actions grid**
- 2x2 grid below banner: New Campaign, New Agent, View Analytics, Add Phone Number

**3.3 Campaign row improvements**
- Add "last activity" timestamp to campaign cards
- Make entire campaign card clickable (already done)

**3.4 Fix stat card label**
- Already covered in Phase 1

**Files:** `Dashboard.tsx`

---

### Phase 4 — Campaigns List Improvements

**4.1 Duplicate campaign action**
- Add `...` menu on each campaign row with "Duplicate" option
- Creates Draft copy with all settings except contacts, named "Copy of {name}"

**4.2 CSV auto-name**
- In CreateCampaignModal, when CSV uploaded first, auto-fill campaign name from filename

**Files:** `CampaignsList.tsx`, `CreateCampaignModal.tsx`

---

### Phase 5 — Navigation & Design System

**5.1 Sidebar changes**
- Rename "Resources" section label to "Setup"
- Add resource count badges next to each item (e.g., "Agents 3", "Phone Numbers 2")

**5.2 Design tokens** (CSS variables update)
- Brand orange: `#E8511A` as primary
- Background: `#F7F6F3` warm off-white
- Surface: `#FFFFFF` cards, `#F2F1EE` secondary
- Border: `#E4E2DC`
- Text: `#1A1916` primary, `#6B6960` secondary, `#9E9C94` tertiary
- Status colors: green `#1A8C5B`, amber `#B06A10`, red `#C0392B`, blue `#1B5FA8`
- Font: DM Sans (300/400/500/600), DM Mono for IDs
- Border radius: 4px buttons, 10px cards, 14px large cards, 18px modals

**5.3 Agent detail page**
- Add visual divider between config form and voice playground
- Add "Save before testing" prompt

**Files:** `AppSidebar.tsx`, `index.css` (CSS variables), `AgentDetail.tsx`

---

### Summary of All Files

| File | Action |
|---|---|
| `src/pages/Dashboard.tsx` | Replace Quick Actions with welcome banner, fix stat label, add quick actions grid |
| `src/components/dialogs/CreateCampaignModal.tsx` | **Create** — single-screen modal with 2 required fields, goal pills, auto-agent, optional setup |
| `src/pages/CreateCampaign.tsx` | **Delete** — replaced by modal |
| `src/pages/CampaignsList.tsx` | Open modal instead of navigating, add duplicate action with `...` menu |
| `src/pages/CampaignDetail.tsx` | Fix `:id` bug, add Draft nudge bar |
| `src/pages/AgentDetail.tsx` | Fix `:id` bug, add save-before-test divider |
| `src/components/StatusBadge.tsx` | Add `ready` and `completed` status variants |
| `src/components/AppSidebar.tsx` | Rename "Resources" → "Setup", add count badges |
| `src/App.tsx` | Remove `/campaigns/new` route |
| `src/index.css` | Update CSS variables to match design tokens (brand orange, warm backgrounds, DM Sans font) |

