# Hallucination Detection Workflow

Hallucinations in agent output can poison downstream context and propagate errors through multi-step workflows. This workflow detects hallucinations before they compound.

## When to Use

- After any agent completes a task that produces factual claims
- Before committing agent-generated code or documentation
- When output will be used as input for subsequent agents
- During review of long-running agent sessions

## Multi-Agent Verification Pattern

### Step 1: Generate Output

Have the primary agent complete its task normally.

### Step 2: Extract Claims

Spawn a verification sub-agent with this prompt:

```markdown
<TASK>
Extract all factual claims from the following output. List each claim on a separate line.
</TASK>

<FOCUS_AREAS>
// ... (15 lines trimmed)
[FACT] JWT tokens expire after 24 hours by default
[METRIC] The function has O(n) complexity
</OUTPUT_FORMAT>
```

### Step 3: Verify Claims

For groups of extracted claims, spawn a verification agent:

```markdown
<TASK>
Verify this claim by checking the actual codebase and context.
</TASK>

<CLAIM>
// ... (12 lines trimmed)
EVIDENCE: [What you found]
CONFIDENCE: [HIGH | MEDIUM | LOW]
</RESPONSE_FORMAT>
```

### Step 4: Calculate Poisoning Risk

Aggregate verification results:

```
total_claims = number of claims extracted
verified_count = claims marked VERIFIED
false_count = claims marked FALSE
unverifiable_count = claims marked UNVERIFIABLE

poisoning_risk = (false_count * 2 + unverifiable_count) / total_claims
```

### Step 5: Decision Threshold

- **Risk < 0.1**: Output is reliable, proceed normally
- **Risk 0.1-0.3**: Review flagged claims manually before proceeding
- **Risk > 0.3**: Regenerate output with more explicit grounding instructions:

```markdown
<REGENERATION_PROMPT>
Previous output contained {false_count} false claims and {unverifiable_count} unverifiable claims.

Specific issues:
{list of FALSE and UNVERIFIABLE claims with evidence}

Please regenerate your response. For each factual claim:
1. Explicitly verify it using tools before stating it
2. If you cannot verify, state "I cannot verify..." instead of asserting
3. Cite the specific file/line/source for verifiable facts
</REGENERATION_PROMPT>
```
