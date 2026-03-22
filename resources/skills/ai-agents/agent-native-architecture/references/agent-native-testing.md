<overview>
Testing agent-native apps requires different approaches than traditional unit testing. You're testing whether the agent achieves outcomes, not whether it calls specific functions. This guide provides concrete testing patterns for verifying your app is truly agent-native.
</overview>

<testing_philosophy>
## Testing Philosophy

### Test Outcomes, Not Procedures

**Traditional (procedure-focused):**
```typescript
// Testing that a specific function was called with specific args
expect(mockProcessFeedback).toHaveBeenCalledWith({
  message: "Great app!",
  category: "praise",
  priority: 2
});
```

**Agent-native (outcome-focused):**
```typescript
// Testing that the outcome was achieved
const result = await agent.process("Great app!");
const storedFeedback = await db.feedback.getLatest();

expect(storedFeedback.content).toContain("Great app");
expect(storedFeedback.importance).toBeGreaterThanOrEqual(1);
expect(storedFeedback.importance).toBeLessThanOrEqual(5);
// We don't care exactly how it categorized—just that it's reasonable
```

### Accept Variability

Agents may solve problems differently each time. Your tests should:
- Verify the end state, not the path
- Accept reasonable ranges, not exact values
- Check for presence of required elements, not exact format
</testing_philosophy>

<can_agent_do_it_test>
## The "Can Agent Do It?" Test

For each UI feature, write a test prompt and verify the agent can accomplish it.

### Template

```typescript
describe('Agent Capability Tests', () => {
  test('Agent can add a book to library', async () => {
    const result = await agent.chat("Add 'Moby Dick' by Herman Melville to my library");

    // Verify outcome
// ... (32 lines trimmed)
    expect(content.toLowerCase()).toMatch(/whale|symbolism|melville/);
  });
});
```

### The "Write to Location" Test

A key litmus test: can the agent create content in specific app locations?

```typescript
describe('Location Awareness Tests', () => {
  const locations = [
    { userPhrase: "my reading feed", expectedTool: "publish_to_feed" },
    { userPhrase: "my library", expectedTool: "add_book" },
    { userPhrase: "my research folder", expectedTool: "write_file" },
// ... (15 lines trimmed)
    });
  }
});
```
</can_agent_do_it_test>

<surprise_test>
## The "Surprise Test"

A well-designed agent-native app lets the agent figure out creative approaches. Test this by giving open-ended requests.

### The Test

```typescript
describe('Agent Creativity Tests', () => {
  test('Agent can handle open-ended requests', async () => {
    // Setup: user has some books
    await libraryService.addBook({ id: "1", title: "1984", author: "Orwell" });
    await libraryService.addBook({ id: "2", title: "Brave New World", author: "Huxley" });
// ... (31 lines trimmed)
    expect(result.toolCalls.length).toBeGreaterThan(0);
  });
});
```

### What Failure Looks Like

```typescript
// FAILURE: Agent can only say it can't do that
const result = await agent.chat("Help me prepare for a book club discussion");

// Bad outcome:
expect(result.response).not.toContain("I can't");
expect(result.response).not.toContain("I don't have a tool");
expect(result.response).not.toContain("Could you clarify");

// If the agent asks for clarification on something it should understand,
// you have a context injection or capability gap
```
</surprise_test>

<parity_testing>
## Automated Parity Testing

Ensure every UI action has an agent equivalent.

### Capability Map Testing

```typescript
// capability-map.ts
export const capabilityMap = {
  // UI Action: Agent Tool
  "View library": "read_library",
  "Add book": "add_book",
// ... (28 lines trimmed)
    });
  }
});
```

### Context Parity Testing

```typescript
describe('Context Parity', () => {
  test('Agent sees all data that UI shows', async () => {
    // Setup: create some data
    await libraryService.addBook({ id: "1", title: "Test Book" });
    await feedService.addItem({ id: "f1", content: "Test insight" });
// ... (17 lines trimmed)
    expect(systemPrompt).toMatch(/highlighted|researched/);
  });
});
```
</parity_testing>

<integration_testing>
## Integration Testing

Test the full flow from user request to outcome.

### End-to-End Flow Tests

```typescript
describe('End-to-End Flows', () => {
  test('Research flow: request → web search → file creation', async () => {
    // Setup
    const bookId = "book_123";
    await libraryService.addBook({ id: bookId, title: "Moby Dick" });
// ... (39 lines trimmed)
    expect(newItem.content.toLowerCase()).toMatch(/big brother|surveillance|watching/);
  });
});
```

### Failure Recovery Tests

```typescript
describe('Failure Recovery', () => {
  test('Agent handles missing book gracefully', async () => {
    const result = await agent.chat("Tell me about 'Nonexistent Book'");

    // Agent should not crash
// ... (21 lines trimmed)
    );
  });
});
```
</integration_testing>

<snapshot_testing>
## Snapshot Testing for System Prompts

Track changes to system prompts and context injection over time.

```typescript
describe('System Prompt Stability', () => {
  test('System prompt structure matches snapshot', async () => {
    const systemPrompt = await buildSystemPrompt();

    // Extract structure (removing dynamic data)
// ... (19 lines trimmed)
    }
  });
});
```
</snapshot_testing>

<manual_testing>
## Manual Testing Checklist

Some things are best tested manually during development:

### Natural Language Variation Test

Try multiple phrasings for the same request:

```
"Add this to my feed"
"Write something in my reading feed"
"Publish an insight about this"
"Put this in the feed"
"I want this in my feed"
```

All should work if context injection is correct.

### Edge Case Prompts

```
"What can you do?"
→ Agent should describe capabilities

"Help me with my books"
// ... (5 lines trimmed)
"Delete everything"
→ Agent should confirm before destructive actions
```

### Confusion Test

Ask about things that should exist but might not be properly connected:

```
"What's in my research folder?"
→ Should list files, not ask "what research folder?"

"Show me my recent reading"
→ Should show activity, not ask "what do you mean?"

"Continue where I left off"
→ Should reference recent activity if available
```
</manual_testing>

<ci_integration>
## CI/CD Integration

Add agent-native tests to your CI pipeline:

```yaml
# .github/workflows/test.yml
name: Agent-Native Tests

on: [push, pull_request]

// ... (22 lines trimmed)
          # Ensure capability map is up to date
          npm run generate:capability-map
          git diff --exit-code capability-map.ts
```

### Cost-Aware Testing

Agent tests cost API tokens. Strategies to manage:

```typescript
// Use smaller models for basic tests
const testConfig = {
  model: process.env.CI ? "claude-3-haiku" : "claude-3-opus",
  maxTokens: 500,  // Limit output length
};
// ... (8 lines trimmed)
if (process.env.GITHUB_REF === 'refs/heads/main') {
  describe('Full Integration Tests', () => { ... });
}
```
</ci_integration>

<test_utilities>
## Test Utilities

### Agent Test Harness

```typescript
class AgentTestHarness {
  private agent: Agent;
  private mockServices: MockServices;

  async setup() {
// ... (39 lines trimmed)
    return state.library.some(b => b.title.includes("Moby"));
  });
});
```
</test_utilities>

<checklist>
## Testing Checklist

Automated Tests:
- [ ] "Can Agent Do It?" tests for each UI action
- [ ] Location awareness tests ("write to my feed")
- [ ] Parity tests (tool exists, documented in prompt)
- [ ] Context parity tests (agent sees what UI shows)
- [ ] End-to-end flow tests
- [ ] Failure recovery tests

Manual Tests:
- [ ] Natural language variation (multiple phrasings work)
- [ ] Edge case prompts (open-ended requests)
- [ ] Confusion test (agent knows app vocabulary)
- [ ] Surprise test (agent can be creative)

CI Integration:
- [ ] Parity tests run on every PR
- [ ] Capability tests run with API key
- [ ] System prompt completeness check
- [ ] Capability map drift detection
</checklist>
