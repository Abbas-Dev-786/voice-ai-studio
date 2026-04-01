

## Missing Pages & Components — API vs UI Gap Analysis

After comparing all API endpoints against the current UI, here is what needs to be built.

---

### Summary of API Coverage

```text
API Tag             Endpoints  UI Exists?   Gap
─────────────────────────────────────────────────
Auth                5          Partial      Workspace creation missing
Workspaces          8          No           Entirely missing
Contacts            8          No           Entirely missing
Audit Logs          1          No           Entirely missing
Webhook Endpoints   6          Partial      Endpoints CRUD missing (only delivery logs exist)
Campaign Calls      1          Partial      Campaign-scoped call list missing
Analytics           7          Partial      Sentiment, outcomes, latency charts missing
Campaign Status     1          Partial      Status transition UI missing
Campaign Integrations 3       No           Campaign-level integration toggle missing
```

---

### Phase 1 — Critical Missing Pages

**1. Contacts Page (new: `src/pages/CampaignContacts.tsx`)**

This is the biggest gap. The API has full CRUD + CSV import/export + DNC marking for contacts, but there is zero UI for it. The current CampaignDetail has a "Contacts" tab that only shows a static count.

- **Route**: `/campaigns/:id/contacts` (or keep as tab in CampaignDetail)
- **Components needed**:
  - Contacts DataTable with columns: Name, Phone, Email, Company, Status (pending/calling/called/failed/opted_out/do_not_call), Last Outcome, Retry Count, Last Called
  - Search bar (API supports `search` param)
  - Status filter chips (API supports `status[]` filter)
  - Pagination (API returns `page`, `page_size`, `has_next`, `total`)
  - "Add Contact" dialog — fields: full_name (required), phone (required), email, company, notes, custom_fields
  - "Import CSV" button with file upload (max 50k rows, 10MB) — show import results (imported, skipped_invalid, skipped_duplicate, errors)
  - "Export CSV" button
  - Row actions: Edit, Delete, Mark as DNC
  - Contact detail view showing call history for that contact

**2. Workspace Settings Page (new: `src/pages/SettingsWorkspace.tsx`)**

The API has full workspace CRUD but the UI's SettingsGeneral page has no workspace management.

- **Route**: `/settings` (update existing SettingsGeneral)
- **Features**:
  - Workspace name and details (from `WorkspaceResponse`: name, elevenlabs_api_key_set, elevenlabs_credits_remaining, plan, timezone, created_at)
  - Update workspace settings
  - Delete workspace (danger zone)
  - View ElevenLabs connection status and remaining credits

**3. Audit Logs Page (new: `src/pages/AuditLogs.tsx`)**

The API provides searchable, paginated audit logs but there is no UI.

- **Route**: `/settings/audit-logs`
- **Features**:
  - DataTable with columns: Timestamp, Actor, Action, Resource Type, Resource ID
  - Filters: resource_type, actor_user_id, date range
  - Pagination
  - Expandable row to show `diff` JSON

**4. Webhook Endpoints Management (update: `src/pages/WebhookLogs.tsx`)**

The current WebhookLogs page only shows delivery logs. The API has full webhook endpoint CRUD + delivery logs per endpoint + retry.

- **Rename/expand** to `WebhookSettings.tsx`
- **Features**:
  - List webhook endpoints (url, events, status, secret)
  - Create endpoint dialog: url, events to subscribe, signing secret
  - Edit/Delete endpoints
  - Per-endpoint delivery log with status filter and pagination
  - Retry failed delivery button

---

### Phase 2 — Missing Components in Existing Pages

**5. Campaign Detail — Contacts Tab Redesign**

Replace the current static contacts section with the full contacts management described in #1 above. Embed it as a tab within CampaignDetail.

**6. Campaign Detail — Integrations Tab (new tab)**

The API supports campaign-level integration toggles (`/campaigns/:id/integrations`), but CampaignDetail has no Integrations tab.

- New tab showing workspace integrations with toggle switches per campaign
- Enable/disable integrations for a specific campaign
- Per-integration config JSON editor

**7. Campaign Status Transitions**

The API has a dedicated status transition endpoint (`POST /campaigns/:id/status`). The current CampaignDetail has Launch/Pause buttons but doesn't properly model the full state machine: `draft → scheduled → live → paused → completed → archived`.

- Add "Schedule" action (sets `scheduled` status with start_date)
- Add "Complete" and "Archive" actions
- Show allowed transitions based on current status
- Confirmation dialogs for destructive transitions

**8. Campaign Settings — Missing Fields**

The `CampaignCreate`/`CampaignUpdate` schemas have fields not yet in the UI:
- `timezone`, `schedule_days`, `schedule_start_time`, `schedule_end_time`
- `max_concurrency`
- `retry_on_outcomes` (no_answer, busy, voicemail, failed, timeout)
- `dnc_check_enabled`, `record_calls`, `tcpa_mode`
- `voicemail_detection`, `leave_voicemail`
- `caller_id_display_name`
- `start_date`, `end_date`

Add these to the CampaignDetail Settings tab as proper form fields.

**9. Analytics — Missing Charts**

The API provides 6 analytics endpoints. Current Analytics page has volume and cost charts but is missing:
- **Latency chart** (p50/p95 daily) — from `/analytics/latency`
- **Outcome distribution** (pie/bar chart) — from `/analytics/outcomes`: booked_demo, interested, not_interested, callback_requested, voicemail, no_answer, failed
- **Sentiment distribution** (pie chart) — from `/analytics/sentiment`: positive, neutral, negative, unknown
- **Campaign-specific analytics** — from `/campaigns/:id/analytics` (full analytics for single campaign, add to CampaignDetail)

**10. Phone Numbers — Import from ElevenLabs**

The API has `GET /phone-numbers/elevenlabs-available` and `POST /phone-numbers/import-elevenlabs` but the UI only has "Buy Number" and "Import SIP". Add:
- "Import from ElevenLabs" dialog showing available numbers from the EL account
- Each number shows: number, label, assigned_agent_id, is_imported status
- One-click import button

---

### Phase 3 — Auth & Infrastructure

**11. Workspace Switcher**

The API supports multiple workspaces per user (`GET /workspaces` returns array). The UI has no workspace concept. Add:
- Workspace switcher in sidebar header
- Create workspace dialog
- Store active workspace_id in context/state

**12. Invitation Accept Flow**

The API has `POST /workspaces/invitations/accept/:token`. Add:
- Route: `/invite/:token`
- Simple page that accepts the invitation and redirects to dashboard

**13. Auth Token Management**

The current Login/SignUp pages are mock. Wire them to the API:
- Login → `POST /auth/login` → store access_token + refresh_token
- Register → `POST /auth/register`
- Refresh → `POST /auth/refresh`
- Auth context/provider with token storage and automatic refresh
- Protected route wrapper checking auth state

---

### Files Summary

| File | Action |
|---|---|
| `src/pages/CampaignDetail.tsx` | Add Contacts tab (full CRUD), Integrations tab, campaign settings fields, status transitions, campaign analytics |
| `src/pages/AuditLogs.tsx` | **Create** — searchable audit log viewer |
| `src/pages/WebhookLogs.tsx` | **Expand** — add endpoint CRUD, per-endpoint deliveries, retry |
| `src/pages/Analytics.tsx` | Add latency, outcome, sentiment charts |
| `src/pages/PhoneNumbers.tsx` | Add "Import from ElevenLabs" dialog |
| `src/pages/SettingsGeneral.tsx` | Add workspace settings (name, EL status, credits) |
| `src/components/dialogs/AddContactDialog.tsx` | **Create** — single contact form |
| `src/components/dialogs/ImportContactsDialog.tsx` | **Create** — CSV upload with results |
| `src/components/dialogs/ImportElevenLabsNumberDialog.tsx` | **Create** — EL number picker |
| `src/components/dialogs/CreateWebhookEndpointDialog.tsx` | **Create** — webhook endpoint form |
| `src/App.tsx` | Add routes: `/settings/audit-logs`, `/invite/:token` |
| `src/components/AppSidebar.tsx` | Add Audit Logs nav item under Settings |

