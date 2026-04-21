---
name: writing-voice
description: "Defines voice and tone rules for written prose."
origin: lamella
---

# Writing Voice

Write for the ear. If it sounds like a press release or corporate memo, rewrite it. If it sounds like you explaining to a colleague, ship it.

## AI Dead Giveaways

Patterns to avoid. Claude defaults to most of these:

- Bold formatting everywhere in body text
- Bullet-listing everything instead of flowing paragraphs
- Marketing words: "game-changing", "revolutionary", "unleash", "empower"
- Structured filler: "Key Features:", "Benefits:", "Why This Matters:"
- Vague superlatives: "incredibly powerful", "seamlessly integrates"
- Dramatic hyperbole: "feels like an eternity", "pain point" — use facts
- AI adjectives: "perfectly", "effortlessly", "beautifully"
- Space-hyphen-space: "The code works - the tests pass"
- Fragment abuse: "Every. Single. Time."
- Staccato buildup: Setup. Fragment. Fragment. Punchline. Combine into one sentence with em dashes or semicolons.
- Forced specificity: random numbers that add no meaning

## Punctuation

Never use " - " (space-hyphen-space) or " — " (space-em-dash-space).

| Use | When |
|-----|------|
| Period | Default. Two sentences beat one long one. |
| Colon | Introducing explanation: "Here's the thing: it doesn't work" |
| Semicolon | Related clauses: "The code works; the tests pass" |
| Em dash | Sparingly, for interruption: "It's fast—really fast" |

## Prose Rules

**Lead with the point.** Every paragraph opens with its conclusion. Setup comes after.

Bad: "After investigating several approaches to conflict resolution, including CRDTs, operational transforms, and manual merge strategies, we found that Yjs with LWW timestamps gave us the best combination of correctness and simplicity."

Good: "Yjs with LWW timestamps gave us the best conflict resolution. We tried CRDTs without timestamps, operational transforms, and manual merge strategies; none matched it for correctness with this little code."

**Vary sentence length.** Uniform length sounds robotic. Short sentences punch. Longer ones carry nuance.

**Use concrete language.** Not "significant performance improvements for data retrieval operations." Say "Row lookups dropped from O(n) to O(1)."

**Connect ideas without headers.** Use bridge sentences. Headers break flow; save them for major shifts.

## Common Rewrites

| Wrote | Rewrite |
|-------|---------|
| "X" | "X" |
| "To achieve Y, we need to Z" | "Z gives us Y" |
| "The reason this works is because..." | "This works because..." |
| "What is that..." | State it directly |
| "It should be noted that..." | Drop it |
| "X" | "X" |
| "As mentioned earlier/above" | Re-state the thing |
| "us to..." | "We can now..." |
| "We need to that..." | "X must..." |
| "leverage" / "utilize" | "use" |
| "facilitate" | "let" or "enable" |
| "implement a solution" | Say what you built |

## Technical Explanations

Show the mechanism, not the marketing.

Bad: "By leveraging Yjs's built-in conflict resolution mechanism, we can effectively handle concurrent edits in a way that seamlessly maintains consistency across all connected clients."

Good: "Yjs resolves conflicts automatically. Two users edit the same field, both edits survive in the CRDT, and the LWW timestamp picks the winner. No manual merge logic."

Bad: "The factory function pattern provides a clean separation of concerns by encapsulating the client creation logic."

Good: "`createSync()` takes a Y.Doc and returns three methods: `connect()`, `disconnect()`, and `status()`. The consumer never touches WebSocket setup or reconnection logic."

## Technical Prose Techniques

Patterns from the masters of technical communication (Hunt/Thomas, Spolsky). Use when writing technical essays, blog posts, tutorials, or documentation with personality.

### Concrete Before Abstract
Always start with an example, then extract the principle. Show the problem, show the code, then name the pattern.

### Physical Analogies
Map abstract concepts to physical experiences: software abstractions → physical tools, system design → everyday systems (postal service, restaurants).

### Conversational Register
Write like you're explaining at a whiteboard. Use contractions, direct address ("you"), questions ("But what if...?"), asides, and admissions ("To be honest, it depends").

### The "Aha!" Structure
1. Present a familiar problem
2. Show the common (flawed) approach
3. Reveal why it fails
4. Present the insight
5. Show the better way

### Short Paragraphs, Varied Length
No paragraph over 4 sentences. Alternate between longer explanations and punchy one-liners. Use single-sentence paragraphs for emphasis.

Like this.

### Code as Evidence
Code examples should be runnable, minimal, progress from broken to fixed, and include comments only for non-obvious things.

### The Principle Box
After a concrete exploration, box the principle:

> **Tip: Always Design for Concurrency**
> Allow for concurrency, and you will design cleaner interfaces with fewer assumptions.

### Friendly Warnings
When discussing pitfalls: acknowledge you've made the mistake too, explain why it's tempting, show the consequences, provide the escape hatch.

### The Callback
End by connecting back to the opening example or question. Close the loop.

## Product/Open Source Writing

- Start with what the tool does, not why it's amazing
- Specific numbers over vague claims
- Acknowledge limitations and trade-offs
- Present facts; let users draw conclusions

## Voice Matching

Match the user's energy. If they're terse, be terse. If they give 5 sentences, don't write 5 paragraphs.

## References

- [references/techniques.md](references/techniques.md) - Full technique guide with examples
- [references/examples.md](references/examples.md) - Before/after transformations
- [references/anti-patterns.md](references/anti-patterns.md) - Seven deadly sins of technical writing
### Additional Resources

- [Sources](references/sources.md)
