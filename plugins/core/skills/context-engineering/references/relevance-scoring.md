# Context Relevance Scoring

Use relevance scoring to find prompt sections that consume tokens without
helping task completion.

## Workflow

1. split the prompt into coherent parts
2. score each part against the target task
3. aggregate the scores
4. identify distractors below the chosen threshold
5. remove, compress, or relocate low-value parts

## Rule

Optimize for task usefulness, not sentimental completeness.
