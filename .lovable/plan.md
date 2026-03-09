

## Campaign Detail Page Review

After reading the full `CampaignDetail.tsx` (894 lines) and reviewing console logs and session replay, here are the findings:

### Issues Found

1. **Console Warning: `InfoRow` ref error** — `InfoRow` is a plain function component but gets passed a ref somewhere (likely from a parent wrapper). Needs `React.forwardRef` or just ensure no ref is passed to it.

2. **"Add Integration" button passes empty object** — Line 622 sets `connectTarget` to `{ name: "", icon: "", description: "" }`, which means the `ConnectIntegrationDialog` opens with blank data instead of showing a picker/list of available integrations to add.

3. **Delete dialog for documents** — The delete check on line 886 (`deleteTarget !== "campaign"`) works, but `deleteTarget` holds the document *name* string, which is fragile. Minor but functional.

4. **No toast feedback** — Actions like Buy Number, Upload Doc, Connect Integration, and Delete all just close the dialog silently with no success confirmation.

### Plan

1. **Fix `InfoRow` ref warning** — Wrap with `React.forwardRef` or convert to a simple `const` without ref forwarding issues (the issue is likely that it's used inside `CardContent` which may forward refs to children).

2. **Fix "Add Integration" empty state** — When clicking "Add Integration", show the dialog with a sensible default integration (e.g., the first inactive one like Zapier) or add a selection step.

3. **Add toast notifications** — Import `useToast` and show success toasts after each dialog action completes (Buy Number, Upload, Connect, Delete).

4. **All 9 tabs render correctly** — Dashboard, Agents, Contacts, Call Logs, Phone Numbers, Knowledge Base, Integrations, Analytics, Settings all have proper content and layout. No structural issues beyond the above.

### Files to Modify
- `src/pages/CampaignDetail.tsx` — Fix InfoRow, integration dialog trigger, add toasts

