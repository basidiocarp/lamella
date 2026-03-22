# Workflow Examples

> rust-router 的工作流程示例

## Example 1: Error Code with Domain Context

```
User: "Why am I getting E0382 in my trading system?"

Analysis:
1. Entry: Layer 1 (E0382 = ownership/move error)
2. Load: m01-ownership skill
// ... (15 lines trimmed)

See: m01-ownership (Trace Up section),
     domain-fintech (Audit Requirements)"
```

## Example 2: Design Question

```
User: "How should I handle user authentication?"

1. Entry: Layer 2 (design question)
2. Trace UP to Layer 3: domain-web constraints
3. Load: domain-web skill (security, stateless HTTP)
4. Trace DOWN: m06-error-handling, m07-concurrency
5. Answer: JWT with proper error types, async handlers
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
2. Load: m07-concurrency
3. Detect: "web API" → domain-web
4. Dual-skill loading:
   - m07: Explain Send/Sync bounds
   - domain-web: Web state management patterns
5. Answer: Use Arc instead of Rc, or move to thread-local
```

## Example 5: Intent Analysis Request

```
User: "Analyze this question: How do I share state in actix-web?"

Analysis Steps:
1. Extract Keywords: share, state, actix-web
2. Identify Entry Layer: Layer 1 (sharing = concurrency) + Layer 3 (actix-web = web)
3. Map to Skills: m07-concurrency, domain-web
4. Report:
   - Layer 1: Concurrency (state sharing mechanisms)
   - Layer 3: Web domain (HTTP handler patterns)
   - Suggested trace: L1 → L3
5. Invoke: m07-concurrency first, then domain-web
```
