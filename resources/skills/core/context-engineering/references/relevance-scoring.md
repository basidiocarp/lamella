# Context Relevance Scoring Workflow

Not all parts of a prompt contribute equally to task completion. This workflow identifies distractor parts within a prompt that consume attention budget without adding value.

## When to Use

- When optimizing prompt length and content
- When deciding what to include in CLAUDE.md
- When a prompt feels bloated but you are unsure what to cut
- When debugging agents that ignore provided context
- Before deploying new commands, skills, or agent prompts

## Distractor Identification Pattern

### Step 1: Split Prompt into Parts

Divide the prompt (command/skill/agent) into logical sections. Each part should be a coherent unit:

```markdown
<PROMPT_PARTS>
PART_1:
  ID: background
  CONTENT: |
    You are a Python expert helping a development team.
// ... (20 lines trimmed)
    Provide actionable feedback with specific line references.
    Explain the reasoning behind suggestions.
</PROMPT_PARTS>
```

Splitting guidelines:
- Each XML section or Markdown header becomes a part
- Separate conceptually distinct instructions into their own parts
- Keep related instructions together (do not split mid-thought)
- Aim for 3-15 parts depending on prompt length

### Step 2: Spawn Scoring Agents

Spawn multiple scoring agents in parallel:

```markdown
<TASK>
Score how relevant this prompt parts is for accomplishing the specified task.
</TASK>

<TASK_DESCRIPTION>
// ... (35 lines trimmed)
JUSTIFICATION: [2-3 sentences explaining the score]
USAGE_LIKELIHOOD: [How often would the agent reference this part during task execution? ALWAYS | OFTEN | SOMETIMES | RARELY | NEVER]
</OUTPUT_FORMAT>
```

### Step 3: Aggregate Relevance Scores

Collect scores from all scoring agents:

```
PART_SCORES = [
  {id: "background", score: 8, usage: "ALWAYS"},
  {id: "code_style_rules", score: 9, usage: "ALWAYS"},
  {id: "historical_context", score: 3, usage: "RARELY"},
  {id: "output_format", score: 7, usage: "OFTEN"}
]
```

Calculate aggregate metrics:

```
total_parts = count(PART_SCORES)
high_relevance_parts = count(parts where score >= 5)
distractor_parts = count(parts where score < 5)

context_efficiency = high_relevance_parts / total_parts
average_relevance = sum(scores) / total_parts
```

### Step 4: Identify Distractor Parts

Apply the distractor threshold (score < 5):

```markdown
DISTRACTOR_ANALYSIS:

Identified Distractors:
1. PART: historical_context
   SCORE: 3/10
// ... (10 lines trimmed)
Token Impact:
- Distractor tokens: ~45 (historical_context)
- Potential savings: 45 tokens (11% of prompt)
```

### Step 5: Generate Optimization Recommendations

Based on distractor analysis, provide actionable recommendations:

```markdown
OPTIMIZATION_RECOMMENDATIONS:

1. REMOVE: historical_context
   Reason: Score 3/10, usage RARELY. Migration history does not inform code review decisions.

// ... (12 lines trimmed)
- output_format: 28 tokens
- Total: 88 tokens (down from 133 tokens)
- Efficiency improvement: 34% reduction
```

## Distractor Threshold Guidelines

The default threshold of 5 balances comprehensiveness against efficiency:

| Threshold | Use Case |
|-----------|----------|
| < 3 | Aggressive pruning for token-constrained contexts |
| < 5 | Standard optimization (recommended default) |
| < 7 | Conservative pruning for critical prompts |

Adjust threshold based on:
- **Context budget pressure**: Lower threshold when approaching limits
- **Task criticality**: Higher threshold for production prompts
- **Prompt stability**: Lower threshold for experimental prompts

## Scoring Agent Deployment

For efficiency, parallelize scoring agents:

```markdown
# Parallel execution pattern
spawn_parallel([
  scoring_agent(part_1, task_description),
  scoring_agent(part_2, task_description),
  scoring_agent(part_3, task_description),
  ...
])

# Collect and aggregate
scores = await_all(scoring_agents)
analysis = aggregate_scores(scores)
```

For large prompts (>10 parts), batch scoring agents in groups of 5-7 to manage orchestration overhead.
