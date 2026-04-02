

## Redesign Agent Detail Page — Clean Single-Column Layout

The current page has several UX problems:
- Over-tabbed: 5 tabs (Config, Voice, Conversation, Tools, Deploy) fragments related settings
- Two-column layout with a 380px Voice Playground sidebar creates cramped content area
- Tabs with icons and locked-state banners repeated in every tab add visual noise
- No clear information hierarchy — everything feels equally important

### Approach

Collapse into a **single-column, card-based layout** with clear sections. Remove tabs entirely. Keep the Voice Playground accessible via a "Test Agent" button that opens the existing mobile drawer (on all screen sizes, not just mobile).

### Layout Structure

```text
┌─────────────────────────────────────────────┐
│ ← Back    Sales Bot  [Live]    [Test] [🗑️]  │  ← sticky header
├─────────────────────────────────────────────┤
│ ⚠ Active campaign banner (if applicable)    │
├─────────────────────────────────────────────┤
│ Card: Configuration                         │
│   Agent Name  |  LLM Model                 │
│   Temperature |  Max Tokens                │
│   System Prompt                             │
├─────────────────────────────────────────────┤
│ Card: Voice Settings                        │
│   (VoiceSettings component inline)          │
├─────────────────────────────────────────────┤
│ Card: Conversation Flow                     │
│   (ConversationFlowSettings inline)         │
├─────────────────────────────────────────────┤
│ Card: Tools                                 │
│   (ToolsConfig inline)                      │
├─────────────────────────────────────────────┤
│ Card: Deploy                                │
│   (WebWidgetConfig inline)                  │
├─────────────────────────────────────────────┤
│                        [Save Changes]       │
└─────────────────────────────────────────────┘
```

### Changes to `src/pages/AgentDetail.tsx`

1. **Remove Tabs entirely** — replace with vertically stacked Card sections. Each section gets a `Card` with `CardHeader` (title + description) and `CardContent`.

2. **Remove the two-column layout** — no more `flex gap-6` with a 380px sidebar. Content flows in a single `max-w-4xl mx-auto` column.

3. **Move Voice Playground to a Drawer on all devices** — remove the desktop-only sidebar. The "Test Agent" button in the header opens the Drawer (already built). Remove the `isMobile` conditional so it's always a drawer.

4. **Single Save button at the bottom** — instead of per-tab save buttons, one "Save Changes" button at the page bottom.

5. **Locked state** — when active in a campaign, wrap each card's content in the opacity/pointer-events treatment. Show the campaign banner once at the top (already exists). Remove per-tab `LockedTabNotice` repetition — the top banner is sufficient.

6. **Collapsible advanced sections** — Voice, Conversation, and Tools cards use `Collapsible` so the page isn't overwhelmingly long. Config and Deploy stay open by default.

7. **Clean header** — Bot icon, agent name, status badge, subtitle. "Test Agent" button always visible. Delete button stays.

### Technical Details

- Remove imports: `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`
- Add imports: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `Separator`, `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`, `Bot`, `ChevronDown`
- Remove the `isMobile` check for the Test Agent button — always show it
- Remove the `hidden lg:block` playground sidebar div
- Keep the `Drawer` for playground — it works on all sizes
- Wrap each section in `Card` with proper spacing
- Add `max-w-4xl mx-auto` container for comfortable reading width

