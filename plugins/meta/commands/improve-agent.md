# Agent Improvement Workflow

Systematically improve an existing agent through performance analysis, prompt engineering, and iterative testing.

## Arguments

`$ARGUMENTS` — the agent to improve (name or file path)

## Phase 1: Baseline

1. Gather performance data using context-manager:
   - Task completion rate, response accuracy, tool usage efficiency
   - User correction patterns (where users consistently fix outputs)
   - Failure modes: instruction misunderstanding, format errors, context loss, tool misuse

2. Classify failures by root cause:
   - Instruction confusion vs output format errors vs context degradation
   - Tool misuse vs constraint violations vs edge case gaps

3. Establish quantitative baseline: success rate, corrections per task, tool call efficiency

## Phase 2: Prompt Improvements

1. Strengthen the role definition: clear single-sentence mission, explicit constraints, success criteria
2. Add chain-of-thought reasoning steps where the agent currently jumps to conclusions
3. Curate few-shot examples from successful interactions, including edge cases that previously failed
4. Add self-verification checkpoints: "Before responding, verify that..."
5. Tune output format: structured templates for common tasks, progressive disclosure for complex responses

## Phase 3: Testing

1. Build a test suite covering:
   - Golden path scenarios (common successful cases)
   - Previously failed tasks (regression tests)
   - Edge cases and adversarial inputs

2. Compare original vs improved agent side-by-side on the test suite
3. Measure: completion rate, correctness, efficiency, token consumption
4. Require at least 100 tasks per variant for statistical significance

## Phase 4: Deployment

1. Version the agent: `agent-name-v[MAJOR].[MINOR].[PATCH]`
2. Roll out gradually: 5% -> 20% -> 50% -> 100%
3. Set rollback triggers: success rate drops >10%, critical errors increase >5%, cost increases >20%
4. Monitor for 7 days post-deployment

## Success Criteria

- Task success rate improves by 15%+
- User corrections decrease by 25%+
- No increase in safety violations
- Response time within 10% of baseline
