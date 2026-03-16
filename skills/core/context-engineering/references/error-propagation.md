# Error Propagation Analysis Workflow

In multi-agent chains, errors from early agents propagate and amplify through subsequent agents. This workflow traces errors to their source.

## When to Use

- When final output contains errors despite correct intermediate steps
- When debugging complex multi-agent workflows
- When establishing error boundaries in agent chains
- During post-mortem analysis of failed agent tasks

## Error Trace Pattern

### Step 1: Capture Agent Chain Outputs

Record the output of each agent in your chain:

```markdown
Agent Chain Record:
- Agent 1 (Analyzer): {output_1}
- Agent 2 (Planner): {output_2}
- Agent 3 (Implementer): {output_3}
- Agent 4 (Reviewer): {output_4}
```

### Step 2: Identify Error Symptoms

Spawn an error identification agent:

```markdown
<TASK>
Analyze the final output and identify all errors, inconsistencies, or quality issues.
</TASK>

<FINAL_OUTPUT>
// ... (9 lines trimmed)
ERROR_ID: E2
...
</OUTPUT_FORMAT>
```

### Step 3: Trace Each Error Backward

For each identified error, spawn a trace agent:

```markdown
<TASK>
Trace this error backward through the agent chain to find its origin.
</TASK>

<ERROR>
// ... (22 lines trimmed)
ROOT_CAUSE: {explanation}
CONTEXT_THAT_CAUSED_IT: {relevant context snippet if applicable}
</OUTPUT_FORMAT>
```

### Step 4: Calculate Propagation Metrics

```
For each agent in chain:
  errors_introduced = count of errors this agent created
  errors_propagated = count of errors this agent passed through
  errors_caught = count of errors this agent fixed or flagged

propagation_rate = errors_at_end / errors_introduced_total
amplification_factor = errors_at_end / errors_at_start
```

### Step 5: Establish Error Boundaries

Based on analysis, add verification checkpoints:

```markdown
<ERROR_BOUNDARY_TEMPLATE>
After Agent {N} completes:

1. Spawn verification agent to check for common error patterns:
   - {error_pattern_1 that Agent N tends to introduce}
   - {error_pattern_2 that Agent N tends to introduce}

2. If errors detected:
   - Log error for analysis
   - Either: Fix inline and continue
   - Or: Regenerate Agent N output with explicit guidance

3. Only proceed to Agent {N+1} if verification passes
</ERROR_BOUNDARY_TEMPLATE>
```
