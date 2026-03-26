---
name: meta-cognition-parallel
description: "Applies an experimental three-layer Rust analysis workflow. Use when a Rust question needs parallel reasoning across language mechanics, design trade-offs, and domain constraints."
argument-hint: <rust_question>
---
# Meta-Cognition Parallel Analysis (Experimental)


## Contents

- [Concept](#concept)
- [Usage](#usage)
- [Execution Mode Detection](#execution-mode-detection)
- [Agent Mode (Plugin Install) - Parallel Execution](#agent-mode-plugin-install---parallel-execution)
  - [Step 1: Parse User Query](#step-1-parse-user-query)
  - [Step 2: Launch Three Parallel Agents](#step-2-launch-three-parallel-agents)
  - [Step 3: Collect Results](#step-3-collect-results)
  - [Step 4: Cross-Layer Synthesis](#step-4-cross-layer-synthesis)
- [Inline Mode (Skills-only Install) - Sequential Execution](#inline-mode-skills-only-install---sequential-execution)
  - [Step 1: Parse User Query](#step-1-parse-user-query)
  - [Step 2: Execute Layer 1 - Language Mechanics](#step-2-execute-layer-1---language-mechanics)
- [Layer 1: Language Mechanics](#layer-1-language-mechanics)
  - [Step 3: Execute Layer 2 - Design Choices](#step-3-execute-layer-2---design-choices)
- [Layer 2: Design Choices](#layer-2-design-choices)
  - [Step 4: Execute Layer 3 - Domain Constraints](#step-4-execute-layer-3---domain-constraints)
- [Layer 3: Domain Constraints](#layer-3-domain-constraints)
  - [Step 5: Cross-Layer Synthesis](#step-5-cross-layer-synthesis)
- [Cross-Layer Synthesis](#cross-layer-synthesis)
  - [Layer Results Summary](#layer-results-summary)
  - [Cross-Layer Reasoning](#cross-layer-reasoning)
  - [Synthesized Recommendation](#synthesized-recommendation)
  - [Confidence Assessment](#confidence-assessment)
- [Output Template](#output-template)
- [Layer 1: Language Mechanics](#layer-1-language-mechanics)
- [Layer 2: Design Choices](#layer-2-design-choices)
- [Layer 3: Domain Constraints](#layer-3-domain-constraints)
- [Cross-Layer Synthesis](#cross-layer-synthesis)
  - [Reasoning Chain](#reasoning-chain)
  - [Final Recommendation](#final-recommendation)
- [Test Scenarios](#test-scenarios)
  - [Test 1: Trading System E0382](#test-1-trading-system-e0382)
  - [Test 2: Web API Concurrency](#test-2-web-api-concurrency)
  - [Test 3: CLI Tool Config](#test-3-cli-tool-config)
- [Error Handling](#error-handling)
- [Limitations](#limitations)
- [Feedback](#feedback)


> **Status:** Experimental
>
> This skill tests parallel three-layer cognitive analysis.

## Concept

Instead of sequential analysis, this skill launches three parallel analyzers - one for each cognitive layer - then synthesizes their results.

```
User Question
     │
     ▼
┌─────────────────────────────────────────────────────┐
│            meta-cognition-parallel                   │
// ... (15 lines trimmed)
     │
     ▼
Domain-Correct Architectural Solution
```

## Usage

```
/meta-parallel <your Rust question>
```

**Example:**
```
/meta-parallel 我的交易系统报 E0382 错误，应该用 clone 吗？
```

## Execution Mode

Run the three-layer analysis directly unless this environment already provides a suitable multi-agent workflow. Do not assume bundled analyzer files exist.

If parallel sub-agents are available, you may delegate each layer independently. Otherwise, execute the same workflow sequentially in a single answer.

---

## Direct Workflow

### Step 1: Parse User Query

Extract from `$ARGUMENTS`:
- The original question
- Any code snippets
- Domain hints such as web, CLI, embedded, fintech, or distributed systems

### Step 2: Execute Layer 1 - Language Mechanics

Analyze the Rust language mechanics involved:

```markdown
## Layer 1: Language Mechanics

**Error/Pattern Identified:**
- Error code: E0XXX (if applicable)
// ... (9 lines trimmed)
**Confidence:** HIGH | MEDIUM | LOW
**Reasoning:** [Why this confidence level]
```

**Focus areas:**
- Ownership rules (move, copy, borrow)
- Lifetime annotations
- Borrowing rules (shared vs mutable)
- Error codes and their meanings

### Step 3: Execute Layer 2 - Design Choices

Analyze the design patterns and trade-offs:

```markdown
## Layer 2: Design Choices

**Design Pattern Context:**
- Current approach: [What pattern is being used]
- Problem: [Why it conflicts with Rust's rules]
// ... (9 lines trimmed)

**Confidence:** HIGH | MEDIUM | LOW
**Reasoning:** [Why this confidence level]
```

**Focus areas:**
- Smart pointer choices (Box, Rc, Arc)
- Interior mutability patterns (Cell, RefCell, Mutex)
- Ownership transfer vs sharing
- Cloning vs references

### Step 4: Execute Layer 3 - Domain Constraints

Analyze domain-specific requirements:

```markdown
## Layer 3: Domain Constraints

**Domain Identified:** [trading/fintech | web | CLI | embedded | etc.]

**Domain-Specific Requirements:**
// ... (13 lines trimmed)

**Confidence:** HIGH | MEDIUM | LOW
**Reasoning:** [Why this confidence level]
```

**Focus areas:**
- Industry requirements (FinTech regulations, web scalability, etc.)
- Performance constraints
- Safety and correctness requirements
- Common patterns in the domain

### Step 5: Cross-Layer Synthesis

Combine all three layers:

```markdown
## Cross-Layer Synthesis

### Layer Results Summary

| Layer | Key Finding | Confidence |
// ... (23 lines trimmed)

- **Overall:** HIGH | MEDIUM | LOW
- **Limiting Factor:** [Which layer had lowest confidence]
```

---

## Output Template

Both modes produce the same output format:

```markdown
# Three-Layer Meta-Cognition Analysis

> Query: [User's question]

---
// ... (16 lines trimmed)
## Cross-Layer Synthesis

### Reasoning Chain
```
L3 Domain: [Constraint]
    ↓ implies
L2 Design: [Pattern]
    ↓ implemented via
L1 Mechanism: [Feature]
```

### Final Recommendation

**Do:** [Recommended approach]

**Don't:** [What to avoid]

**Code Pattern:**
```rust
// Recommended implementation
```

---

*Analysis performed by meta-cognition-parallel v0.2.0 (experimental)*
```

---

## Test Scenarios

### Test 1: Trading System E0382
```
/meta-parallel 交易系统报 E0382，trade record 被 move 了
```

Expected: L3 identifies FinTech constraints → L2 suggests shared immutable → L1 recommends Arc<T>

### Test 2: Web API Concurrency
```
/meta-parallel Web API 中多个 handler 需要共享数据库连接池
```

Expected: L3 identifies Web constraints → L2 suggests connection pooling → L1 recommends Arc<Pool>

### Test 3: CLI Tool Config
```
/meta-parallel CLI 工具如何处理配置文件和命令行参数的优先级
```

Expected: L3 identifies CLI constraints → L2 suggests config precedence pattern → L1 recommends builder pattern

---

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Agent files not found | Skills-only install | Use inline mode (sequential) |
| Agent timeout | Complex analysis | Wait longer or use inline mode |
| Incomplete layer result | Agent issue | Fill in with inline analysis |

## Limitations

- **Agent Mode:** Parallel execution, faster but requires plugin install
- **Inline Mode:** Sequential execution, slower but works everywhere
- Cross-layer synthesis quality depends on result structure
- May have higher latency than simple single-layer analysis

## Feedback

This is experimental. Please report issues and suggestions to improve the three-layer analysis approach.
