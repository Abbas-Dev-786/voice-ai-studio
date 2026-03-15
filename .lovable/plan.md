

## ElevenLabs API Wrapper — UI Alignment Plan

### Context

The app (VoiceFlow) is a voice AI agent platform. The user wants it to be a proper wrapper around the **ElevenLabs Conversational AI Agents API**. Based on the ElevenLabs docs, their platform has three pillars: **Build (Configure)**, **Deploy (Integrate)**, and **Monitor (Operate)**.

### What Needs to Change

The current UI has most of the right sections but needs to be aligned to ElevenLabs' actual API capabilities and terminology. I need to fetch more API endpoint details before finalizing implementation, but here's the high-level plan based on what I've gathered:

---

### 1. Agent Creation / Configuration (align to ElevenLabs Build)

Update `CreateAgent.tsx` and `AgentDetail.tsx` to reflect ElevenLabs agent config:

- **System Prompt** — already exists, keep as-is
- **LLM Selection** — add model picker (GPT-4o, Claude, Gemini, custom LLM endpoint)
- **Voice & Language** — update voice picker to reference ElevenLabs voice IDs (5k+ voices, 31 languages). Add voice settings: stability, similarity_boost, style, speed
- **Conversation Flow** — add settings for turn-taking, interruptions, timeouts, max duration
- **Knowledge Base** — already exists as a tab; add document upload for RAG
- **Tools** — update tools step to support: Client Tools, Server Tools (webhook URLs), MCP Tools, and System Tools (end call, transfer, etc.)
- **Workflows** — add a workflow/conversation-flow builder concept (can be simplified to multi-step prompt sequences)
- **First Message** — add configurable greeting message
- **Data Collection** — add structured data extraction config (fields the agent should collect)

### 2. Agent Deployment (align to ElevenLabs Deploy/Integrate)

Update or create pages for deployment options:

- **Phone Numbers** — already exists; align to ElevenLabs telephony (Twilio SIP, imported numbers)
- **Web Widget** — add embeddable widget config with customizable appearance (avatar, colors, position)
- **API/SDK Integration** — show code snippets for React SDK (`useConversation` hook), WebRTC, WebSocket
- **Share Links** — generate shareable conversation links

### 3. Monitoring & Analytics (align to ElevenLabs Operate)

Update `Analytics.tsx`, `CallLogs.tsx`, `CallDetail.tsx`:

- **Conversation History** — list all conversations with transcripts, duration, cost
- **Evaluations** — add criteria-based eval (success metrics, prompt adherence)
- **Analytics Dashboard** — call volume, avg duration, success rate, cost tracking, latency metrics
- **Transcript View** — show turn-by-turn transcript with agent/user labels and timestamps

### 4. Settings & API Keys

Update `SettingsAPI.tsx`:

- **ElevenLabs API Key** management (the wrapper needs to store/proxy the user's ElevenLabs key)
- **Webhook configuration** for server-side tool callbacks
- **Usage & billing** aligned to ElevenLabs credit system

---

### Files to Modify/Create

| File | Action |
|---|---|
| `src/pages/CreateAgent.tsx` | Overhaul steps to match ElevenLabs agent config (LLM, voice settings, conversation flow, tools, first message) |
| `src/pages/AgentDetail.tsx` | Add tabs for Config, Voice, Tools, Knowledge, Deployment, Analytics |
| `src/pages/AgentPlayground.tsx` | Wire to ElevenLabs `useConversation` hook for live testing |
| `src/pages/CallDetail.tsx` | Add full transcript view with turn-by-turn display |
| `src/pages/Analytics.tsx` | Add ElevenLabs-aligned metrics (cost, latency, success rate) |
| `src/components/dialogs/CreateAgentDialog.tsx` | Update to match new agent config fields |
| `src/pages/PhoneNumbers.tsx` | Align to ElevenLabs telephony (Twilio/SIP import) |
| New: `src/components/WebWidgetConfig.tsx` | Widget embed configuration UI |
| New: `src/components/VoiceSettings.tsx` | Reusable voice config (stability, similarity, style, speed sliders) |
| New: `src/components/ConversationFlowSettings.tsx` | Turn-taking, interruption, timeout config |
| New: `src/components/ToolsConfig.tsx` | Client/Server/System tools configuration |

---

### Important Note

Before implementing, I should fetch more ElevenLabs API reference pages to get exact endpoint schemas for agents CRUD, conversations, phone numbers, and knowledge base. The API reference URLs I tried returned 404s — I'll need to find the correct paths. This will ensure every form field and data table maps precisely to the API.

### Recommended Approach

Given the scope, I recommend implementing this in phases:
1. **Phase 1**: Agent creation overhaul (LLM, voice settings, conversation flow, tools, first message)
2. **Phase 2**: Deployment options (widget, phone, API snippets)
3. **Phase 3**: Monitoring alignment (transcripts, evals, analytics)
4. **Phase 4**: Playground with live ElevenLabs SDK integration

