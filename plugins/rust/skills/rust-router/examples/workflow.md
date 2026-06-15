# Workflow Examples

Examples for routing Rust questions to the bundled skills.

## Example 1: Error Code with Domain Context

```
User: "Why am I getting E0382 in my trading system?"

Analysis:
1. Entry: Layer 1 (E0382 = ownership/move error)
2. Load: `ownership`
3. If the trading constraints matter, add a domain skill from another plugin
4. Answer with the ownership fix first, then the domain trade-off
```

## Example 2: Design Question

```
User: "How should I handle user authentication?"

1. Entry: Layer 2 (design question)
2. Load: `rust-advanced`
3. Add: `concurrency` if async handlers or shared state are involved
4. Add a security skill if the question is really about auth architecture
5. Answer with the Rust-specific design constraints first
```

## Example 3: Comparative Query

```
User: "Compare tokio and async-std"

1. Detect: "compare" → Enable negotiation
2. Load both runtime knowledge sources
3. Assess confidence for each
4. Synthesize with disclosed gaps
5. Answer: Structured comparison table
```

## Example 4: Multi-Layer Trace

```
User: "My web API reports Rc cannot be sent between threads"

1. Entry: Layer 1 (Send/Sync error)
2. Load: `concurrency`
3. Detect: web-server context
4. Dual-skill loading:
   - `concurrency`: explain Send and Sync bounds
   - relevant domain skill if the framework or architecture matters
5. Answer: use `Arc` instead of `Rc`, or keep the value thread-local
```

## Example 5: Intent Analysis Request

```
User: "Analyze this question: How do I share state in actix-web?"

Analysis Steps:
1. Extract Keywords: share, state, actix-web
2. Identify Entry Layer: concurrency plus web framework context
3. Map to Skills: `concurrency` plus a relevant framework or backend skill if needed
4. Report:
   - Layer 1: Concurrency (state sharing mechanisms)
   - Domain context: HTTP handler patterns and request lifetimes
   - Suggested trace: focused Rust skill first, domain skill second
5. Invoke: `concurrency` first, then the domain skill if it changes the answer
```
