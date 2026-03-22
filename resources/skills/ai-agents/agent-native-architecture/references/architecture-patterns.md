<overview>
Architectural patterns for building agent-native systems. These patterns emerge from the five core principles: Parity, Granularity, Composability, Emergent Capability, and Improvement Over Time.

Features are outcomes achieved by agents operating in a loop, not functions you write. Tools are atomic primitives. The agent applies judgment; the prompt defines the outcome.

See also:
- [files-universal-interface.md](./files-universal-interface.md) for file organization and context.md patterns
- [agent-execution-patterns.md](./agent-execution-patterns.md) for completion signals and partial completion
- [product-implications.md](./product-implications.md) for progressive disclosure and approval patterns
</overview>

<pattern name="event-driven-agent">
## Event-Driven Agent Architecture

The agent runs as a long-lived process that responds to events. Events become prompts.

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent Loop                                │
├─────────────────────────────────────────────────────────────┤
│  Event Source → Agent (Claude) → Tool Calls → Response      │
// ... (8 lines trimmed)
    (write_file)   (read_source)   (store_item)
                   (restart)       (list_items)
```

**Key characteristics:**
- Events (messages, webhooks, timers) trigger agent turns
- Agent decides how to respond based on system prompt
- Tools are primitives for IO, not business logic
- State persists between events via data tools

**Example: Discord feedback bot**
```typescript
// Event source
client.on("messageCreate", (message) => {
  if (!message.author.bot) {
    runAgent({
      userMessage: `New message from ${message.author}: "${message.content}"`,
// ... (12 lines trimmed)

Use your judgment about importance and categorization.
`;
```
</pattern>

<pattern name="two-layer-git">
## Two-Layer Git Architecture

For self-modifying agents, separate code (shared) from data (instance-specific).

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub (shared repo)                     │
│  - src/           (agent code)                              │
│  - site/          (web interface)                           │
│  - package.json   (dependencies)                            │
// ... (15 lines trimmed)
│  - logs/          → runtime logs                            │
│  - .env           → secrets                                 │
└─────────────────────────────────────────────────────────────┘
```

**Why this works:**
- Code and site are version controlled (GitHub)
- Raw data stays local (instance-specific)
- Site is generated from data, so reproducible
- Automatic rollback via git history
</pattern>

<pattern name="multi-instance">
## Multi-Instance Branching

Each agent instance gets its own branch while sharing core code.

```
main                        # Shared features, bug fixes
├── instance/feedback-bot   # Every Reader feedback bot
├── instance/support-bot    # Customer support bot
└── instance/research-bot   # Research assistant
```

**Change flow:**
| Change Type | Work On | Then |
|-------------|---------|------|
| Core features | main | Merge to instance branches |
| Bug fixes | main | Merge to instance branches |
| Instance config | instance branch | Done |
| Instance data | instance branch | Done |

**Sync tools:**
```typescript
tool("self_deploy", "Pull latest from main, rebuild, restart", ...)
tool("sync_from_instance", "Merge from another instance", ...)
tool("propose_to_main", "Create PR to share improvements", ...)
```
</pattern>

<pattern name="site-as-output">
## Site as Agent Output

The agent generates and maintains a website as a natural output, not through specialized site tools.

```
Discord Message
      ↓
Agent processes it, extracts insights
      ↓
// ... (5 lines trimmed)
      ↓
Site updates automatically
```

**Key insight:** Don't build site generation tools. Give the agent file tools and teach it in the prompt how to create good sites.

```markdown
## Site Management

You maintain a public feedback site. When feedback comes in:
1. Use write_file to update site/public/content/feedback.json
// ... (7 lines trimmed)

You decide the structure. Make it good.
```
</pattern>

<pattern name="approval-gates">
## Approval Gates Pattern

Separate "propose" from "apply" for dangerous operations.

```typescript
// Pending changes stored separately
const pendingChanges = new Map<string, string>();

tool("write_file", async ({ path, content }) => {
  if (requiresApproval(path)) {
// ... (17 lines trimmed)
  pendingChanges.clear();
  return { text: "Applied all pending changes" };
});
```

**What requires approval:**
- src/*.ts (agent code)
- package.json (dependencies)
- system prompt changes

**What doesn't:**
- data/* (instance data)
- site/* (generated content)
- docs/* (documentation)
</pattern>

<pattern name="unified-agent-architecture">
## Unified Agent Architecture

One execution engine, many agent types. All agents use the same orchestrator but with different configurations.

```
┌─────────────────────────────────────────────────────────────┐
│                    AgentOrchestrator                         │
├─────────────────────────────────────────────────────────────┤
│  - Lifecycle management (start, pause, resume, stop)        │
│  - Checkpoint/restore (for background execution)            │
// ... (8 lines trimmed)
    - web_search         - read_library       - read_photos
    - write_file         - publish_to_feed    - write_file
    - read_file          - web_search         - analyze_image
```

**Implementation:**

```swift
// All agents use the same orchestrator
let session = try await AgentOrchestrator.shared.startAgent(
    config: ResearchAgent.create(book: book),  // Config varies
    tools: ResearchAgent.tools,                 // Tools vary
    context: ResearchAgent.context(for: book)   // Context varies
// ... (36 lines trimmed)
        """
    }
}
```

**Benefits:**
- Consistent lifecycle management across all agent types
- Automatic checkpoint/resume (critical for mobile)
- Shared tool protocol
- Easy to add new agent types
- Centralized error handling and logging
</pattern>

<pattern name="agent-to-ui-communication">
## Agent-to-UI Communication

When agents take actions, the UI should reflect them immediately. The user should see what the agent did.

**Pattern 1: Shared Data Store (Recommended)**

Agent writes through the same service the UI observes:

```swift
// Shared service
class BookLibraryService: ObservableObject {
    static let shared = BookLibraryService()
    @Published var books: [Book] = []
    @Published var feedItems: [FeedItem] = []
// ... (22 lines trimmed)
        }
    }
}
```

**Pattern 2: File System Observation**

For file-based data, watch the file system:

```swift
class ResearchWatcher: ObservableObject {
    @Published var files: [URL] = []
    private var watcher: DirectoryWatcher?

    func watch(bookId: String) {
// ... (12 lines trimmed)
    writeFile(documentsURL.appendingPathComponent(path), content)
    // DirectoryWatcher triggers UI update automatically
}
```

**Pattern 3: Event Bus (Cross-Component)**

For complex apps with multiple independent components:

```typescript
// Shared event bus
const agentEvents = new EventEmitter();

// Agent tool emits events
tool("publish_to_feed", async ({ content }) => {
// ... (14 lines trimmed)

    return <FeedList items={items} />;
}
```

**What to avoid:**

```swift
// BAD: UI doesn't observe agent changes
// Agent writes to database directly
tool("publish_to_feed", { content }) {
    database.insert("feed", content)  // UI doesn't see this
}

// UI loads once at startup, never refreshes
struct FeedView: View {
    let items = database.query("feed")  // Stale!
}
```
</pattern>

<pattern name="model-tier-selection">
## Model Tier Selection

Different agents need different intelligence levels. Use the cheapest model that achieves the outcome.

| Agent Type | Recommended Tier | Reasoning |
|------------|-----------------|-----------|
| Chat/Conversation | Balanced | Fast responses, good reasoning |
| Research | Balanced | Tool loops, not ultra-complex synthesis |
| Content Generation | Balanced | Creative but not synthesis-heavy |
| Complex Analysis | Powerful | Multi-document synthesis, nuanced judgment |
| Profile/Onboarding | Powerful | Photo analysis, complex pattern recognition |
| Simple Queries | Fast/Haiku | Quick lookups, simple transformations |

**Implementation:**

```swift
enum ModelTier {
    case fast      // claude-3-haiku: Quick, cheap, simple tasks
    case balanced  // claude-3-sonnet: Good balance for most tasks
    case powerful  // claude-3-opus: Complex reasoning, synthesis
}
// ... (24 lines trimmed)
    tools: [readLibrary],
    systemPrompt: "Answer quick questions about the user's library."
)
```

**Cost optimization strategies:**
- Start with balanced tier, only upgrade if quality insufficient
- Use fast tier for tool-heavy loops where each turn is simple
- Reserve powerful tier for synthesis tasks (comparing multiple sources)
- Consider token limits per turn to control costs
</pattern>

<design_questions>
## Questions to Ask When Designing

1. **What events trigger agent turns?** (messages, webhooks, timers, user requests)
2. **What primitives does the agent need?** (read, write, call API, restart)
3. **What decisions should the agent make?** (format, structure, priority, action)
4. **What decisions should be hardcoded?** (security boundaries, approval requirements)
5. **How does the agent verify its work?** (health checks, build verification)
6. **How does the agent recover from mistakes?** (git rollback, approval gates)
7. **How does the UI know when agent changes state?** (shared store, file watching, events)
8. **What model tier does each agent type need?** (fast, balanced, powerful)
9. **How do agents share infrastructure?** (unified orchestrator, shared tools)
</design_questions>
