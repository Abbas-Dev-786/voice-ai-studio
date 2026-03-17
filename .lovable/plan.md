

## Voice Playground Simulator — Inline in Agent Detail

### What we're building

Embed a full calling simulator directly into `/agents/:id` and remove the separate playground page. The Agent Detail page becomes a **two-column layout**: config tabs on the left, persistent voice playground on the right.

### Layout

```text
+---------------------------------------+------------------------+
|  Header (Agent name, status, delete)                           |
+---------------------------------------+------------------------+
|  Tabs: Config | Voice | Conv | Tools  |  VOICE PLAYGROUND      |
|        Knowledge | Deploy | History   |                        |
|        Analytics                      |  [Phone Simulator]     |
|                                       |  - Agent name/status   |
|  [Active tab content]                |  - Call timer + waveform|
|                                       |  - Start/End Call btn  |
|                                       |                        |
|                                       |  [Inline Voice Tuner]  |
|                                       |  - Voice dropdown      |
|                                       |  - Stability slider    |
|                                       |  - Similarity slider   |
|                                       |  - Style slider        |
|                                       |  - Speed slider        |
|                                       |                        |
|                                       |  [Live Transcript]     |
|                                       |  - Chat bubbles        |
|                                       |  - Agent thoughts      |
|                                       |                        |
|                                       |  [Sample Phrases]      |
|                                       |  [Metrics bar]         |
+---------------------------------------+------------------------+
```

On mobile (`< lg`), the playground collapses into a floating "Test Agent" button that opens a bottom Drawer.

### New component: `src/components/VoicePlayground.tsx`

Contains everything for the simulator:
- **Phone card**: Agent name, status (idle/connecting/in-call), animated call timer, CSS waveform bars (5 bars with staggered animation when `isSpeaking`), Start/End Call button, browser mic toggle
- **Inline voice tuner**: Compact voice selector + 4 mini sliders (Stability, Similarity, Style, Speed). Changes sync bidirectionally with the parent `voiceConfig` state
- **Live transcript**: Chat-bubble layout from existing `mockTranscript` data, auto-scroll
- **Sample phrases**: Tappable chips ("Hello, how can I help?", "Let me check that", "Your appointment is confirmed") that add to transcript when clicked
- **Metrics bar**: Latency, tokens, estimated cost (visible during active call)

Props: `voiceConfig`, `onVoiceConfigChange` for bidirectional sync with the Voice tab.

### Changes to `src/pages/AgentDetail.tsx`

- Remove the "Test" button that navigates to `/agents/:id/playground`
- Wrap content in a `flex lg:flex-row` two-column layout
- Left column (`lg:w-[60%]`): Existing tabs content (unchanged)
- Right column (`lg:w-[40%]`): `<VoicePlayground>` with sticky positioning
- Pass `voiceConfig` + `setVoiceConfig` to the playground
- On mobile: Hide the right column, show a floating action button that opens a `<Drawer>` containing `<VoicePlayground>`

### Changes to routing (`src/App.tsx`)

- Remove the `/agents/:id/playground` route
- Delete or repurpose `src/pages/AgentPlayground.tsx`

### Files

| File | Action |
|---|---|
| `src/components/VoicePlayground.tsx` | **Create** — Phone simulator, inline voice tuner, transcript, waveform, sample phrases, metrics |
| `src/pages/AgentDetail.tsx` | **Edit** — Two-column layout, embed VoicePlayground, remove Test button, add mobile drawer |
| `src/App.tsx` | **Edit** — Remove `/agents/:id/playground` route |
| `src/pages/AgentPlayground.tsx` | **Delete** (no longer needed) |
| `src/components/VoiceSettings.tsx` | **Edit** — Export `elevenLabsVoices` array for reuse in playground |

