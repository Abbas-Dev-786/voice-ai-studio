

## Replace Goal Pills with Free-Text Goal Description

**File: `src/components/dialogs/CreateCampaignModal.tsx`**

### Changes

1. **Remove** the `goals` array, `goalAgentMap` object, and unused icon imports (`Megaphone`, `Users`, `CalendarSearch`, `MessageSquare`, `Target`).

2. **Replace** the `goal` state (`string | null`) with a `goalDescription` state (`string`).

3. **Replace the goal pills section** (lines 86-106) with a `Textarea` field:
   - Label: "Campaign Goal" (required)
   - Placeholder: `"e.g. Reach out to trial users who haven't booked a demo yet and schedule a 15-min product walkthrough"`
   - Max 200 characters with a visible counter
   - Helper text below: "Briefly describe what this campaign should achieve — this guides the agent's behavior."

4. **Remove the auto-agent confirmation block** (lines 108-124) since there are no goal pills to trigger it. Keep the inline agent customisation section but make the "Customise agent" toggle always visible once a goal is typed.

5. **Update the Launch button** disabled condition from `!name.trim() || !goal` to `!name.trim() || !goalDescription.trim()`.

6. **Update `handleLaunch`** validation to use `goalDescription` instead of `goal`.

### Result
Two simple required fields: Campaign Name (input) + Campaign Goal (textarea). Everything else stays the same — optional setup, agent customisation, and launch logic are unchanged.

