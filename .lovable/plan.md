

## Architecture Alignment — Full UI Corrections

This is a large but well-scoped set of changes across 7 files. Every change enforces the campaign-centric architecture and removes UI elements that conflict with it.

---

### 1. Agent Detail Page (`src/pages/AgentDetail.tsx`)

**Remove Knowledge Base tab** — KB is campaign-level only.
- Delete the `knowledge` TabsTrigger and its TabsContent (lines 90, 167-184)
- Remove `BookOpen` from imports

**Add "Active Campaign" banner** — When agent is in a live campaign, show a warning banner below the header:
- Orange/amber banner: "This agent is currently active in Q1 Outreach. Some settings cannot be edited while the campaign is running."
- Mock: agent IDs "1" and "4" are active (matching agents list data)

**Lock editing when active** — When the banner is visible:
- Add `disabled` / `readOnly` to Config tab inputs (Agent Name, LLM Model, Temperature, Max Tokens, System Prompt)
- Add `pointer-events-none opacity-60` wrapper to Voice, Conversation, and Tools tabs
- Show a small lock icon + explanation text at the top of each locked tab

---

### 2. Agents List Page (`src/pages/AgentsList.tsx`)

**Replace `campaignsCount` column with `activeCampaign` column**:
- Change mock data: replace `campaignsCount` with `activeCampaign: string | null` (e.g., `"Q1 Outreach"`, `null`)
- Render as: Badge showing campaign name (e.g., "Active in Q1 Outreach") or muted "Available" text
- Column label: "Status" stays for the draft/live badge, new column label: "Assignment"

**Update page subtitle**: "Agent configurations & templates. Agents are workspace-level assets — assign them to campaigns." (remove "Create and manage agents within campaigns")

---

### 3. Campaign Creation Modal (`src/components/dialogs/CreateCampaignModal.tsx`)

**Remove inline agent creation** — Replace the "Customise agent" section (lines 83-150) with an agent selector dropdown:
- Label: "Assign Agent" (required)
- Dropdown showing existing agents with availability status
- Active agents shown grayed out with tooltip: "Currently active in [Campaign Name]. Pause that campaign to use this agent."
- Available agents selectable normally

**Add KB upload section** — New optional section inside the "Optional setup" collapsible:
- Small drag-and-drop zone for documents + URL input field
- Label: "Knowledge Base (optional)" with helper: "Upload documents or add URLs — the agent will use these during calls."

**Simplify phone number** — Change label from "Phone Number" to "Calling Number" with helper: "The number your contacts will see."

---

### 4. Campaign Detail — Agents Tab (lines 420-477 in `CampaignDetail.tsx`)

**Redesign for single agent** — Replace the multi-agent DataTable + cards with:
- Single agent card showing: name, model, voice, status
- "Change Agent" button (disabled with tooltip if campaign is live: "Pause campaign to change agent")
- Warning modal on change: "Changing the agent will require re-syncing the knowledge base. The campaign will be briefly paused."
- Remove "Assign Existing" and "Create Agent" buttons
- Remove `campaignAgents` multi-agent array, replace with single `campaignAgent` object
- Remove `agentColumns` and the agent DataTable
- Remove `CreateAgentDialog` import and usage

---

### 5. Campaign Detail — Knowledge Base Tab (lines 729-773)

**Add sync status indicator** at the top — Four states:
- **Synced**: Green dot + "Knowledge base is synced to ElevenLabs" + timestamp
- **Pending**: Yellow dot + "Changes detected — sync required" + "Sync Now" button
- **Syncing**: Spinner + "Syncing to ElevenLabs..."
- **Failed**: Red dot + error message + "Retry" button

**Add sync warning on document changes** — When adding/removing a doc while campaign is live, show inline warning: "Knowledge base is out of sync. New calls will use the updated knowledge base once synced."

---

### 6. Campaign Detail — Phone Numbers Tab (lines 678-723)

**Simplify to single number**:
- Replace the multi-number card grid with a single assigned number card
- Show number details + "Change Number" action
- Add secondary section: "Other workspace numbers" listing available numbers for reassignment
- Remove "Rotation Strategy" and "Fallback Number" from Caller ID Settings
- Remove "Assign Existing" and "Buy Number" buttons from header (keep buy number as secondary action)

---

### 7. Campaign Detail — Settings Tab (lines 928-1033)

**Add agent relationship note** in Danger Zone:
- Add text above delete button: "Deleting this campaign will free the assigned agent for use in other campaigns."

---

### 8. Phone Numbers Page (`src/pages/PhoneNumbers.tsx`)

**Rename "Assigned Agent" column to "Assigned Campaign"**:
- Update mock data: replace `agent` field with `campaign` (e.g., "Q1 Outreach", "—")
- Update column label

**Add availability indicator**: Show "Active" badge (green) or "Available" (muted) based on campaign assignment

---

### 9. Analytics Page (`src/pages/Analytics.tsx`)

**Add date range selector**: Dropdown at top-right with options: Last 7 days, Last 30 days, This month, Custom range

**Add campaign filter**: "All campaigns" dropdown defaulting to workspace-wide, with ability to filter by single campaign. Add helper text: "Showing metrics across all campaigns"

---

### 10. Sidebar (`src/components/AppSidebar.tsx`)

**Update Agents badge**: Change from "3" to "2/5" format (active/total)

---

### Files Summary

| File | Changes |
|---|---|
| `AgentDetail.tsx` | Remove KB tab, add active campaign banner, lock editing when active |
| `AgentsList.tsx` | Replace campaignsCount with activeCampaign column, update subtitle |
| `CreateCampaignModal.tsx` | Replace inline agent creation with agent selector, add KB section, fix phone label |
| `CampaignDetail.tsx` | Single agent card, KB sync status, single phone number, danger zone note |
| `PhoneNumbers.tsx` | Rename column to "Assigned Campaign", add availability |
| `Analytics.tsx` | Add date range selector, campaign filter |
| `AppSidebar.tsx` | Update badge format |

