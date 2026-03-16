# Lost-in-Middle Detection Workflow

Critical information buried in the middle of long prompts receives less attention. This workflow detects which parts of your prompt are at risk of being ignored by running multiple agents and verifying their outputs against the original instructions.

## When to Use

- When designing new commands or skills with long prompts
- When agents inconsistently follow instructions across runs
- Before deploying prompts to production
- During prompt optimization

## Multi-Run Verification Pattern

### Step 1: Identify Critical Instructions

Extract all critical instructions from your prompt that the agent MUST follow:

```markdown
Critical instructions to verify:
1. "Never modify files in /production"
2. "Always run tests before committing"
3. "Use TypeScript strict mode"
4. "Maximum function length: 50 lines"
5. "Include JSDoc for public APIs"
6. "Format output as JSON"
7. "Log all file modifications"
```

### Step 2: Run Multiple Agents with Same Prompt

Spawn 3-5 agents with the SAME prompt (the command/skill/agent being tested). Each agent runs independently with identical inputs:

```markdown
<AGENT_RUN_CONFIG>
Number of runs: 5
Prompt: {your_full_prompt_being_tested}
Task: {representative_task_that_exercises_all_instructions}

For each run, save:
- run_id: unique identifier
- agent_output: complete response from agent
- timestamp: when run completed
</AGENT_RUN_CONFIG>
```

### Step 3: Verify Each Output Against Original Prompt

For each agent's output, spawn a NEW verification agent that checks compliance with every critical instruction:

```markdown
<VERIFICATION_AGENT_PROMPT>
<TASK>
You are a compliance verification agent. Analyze whether the agent output followed each instruction from the original prompt.
</TASK>

// ... (37 lines trimmed)
- Not applicable: {count}
</OUTPUT_FORMAT>
</VERIFICATION_AGENT_PROMPT>
```

### Step 4: Aggregate Results and Identify At-Risk Parts

Collect verification results from all runs and identify instructions that were inconsistently followed:

```markdown
<AGGREGATION_LOGIC>
For each instruction:
  followed_count = number of runs where STATUS == FOLLOWED
  violated_count = number of runs where STATUS == VIOLATED
  applicable_runs = total_runs - (runs where STATUS == NOT_APPLICABLE)
// ... (31 lines trimmed)
- Instruction 6: "Format as JSON" (20% compliance)
- Instruction 7: "Log modifications" (60% compliance)
</AGGREGATION_OUTPUT_FORMAT>
```

### Step 5: Output Recommendations

Based on the at-risk parts identified, provide specific remediation guidance:

```markdown
<RECOMMENDATIONS_OUTPUT>
LOST-IN-MIDDLE ANALYSIS COMPLETE

At-Risk Instructions Detected: {count}
These instructions are inconsistently followed, indicating they likely
// ... (31 lines trimmed)
   - Converting remaining middle items to a numbered checklist
   - Adding explicit "verify these items" reminder at end
</RECOMMENDATIONS_OUTPUT>
```

## Complete Workflow Example

```markdown
# Example: Testing a Code Review Command

## Original Prompt Being Tested:
"Review the code for: security issues, performance problems,
code style, test coverage, documentation completeness,
// ... (27 lines trimmed)
Review also: performance, code style, error handling, logging.

**BEFORE COMPLETING:** Verify you addressed items 1-3 above."
```
