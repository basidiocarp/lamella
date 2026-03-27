# LLM-as-Judge Implementation Patterns

Use this page to choose the evaluation workflow shape. The detailed patterns are now split so the caller can load only the rubric-building, comparison, or regression workflow it needs.

## Reference Map

| Need | Load |
|------|------|
| Criteria design, test cases, and direct scoring flow | [structured-evaluation.md](structured-evaluation.md) |
| Quick-screen, hierarchical review, and panel judging | [hierarchical-and-panel-evaluation.md](hierarchical-and-panel-evaluation.md) |
| Position bias control and regression tracking | [regression-and-bias-workflows.md](regression-and-bias-workflows.md) |

## Core Decision Rule

- Use structured direct scoring when the rubric is explicit and mostly objective.
- Use hierarchical or panel evaluation when the task is high-stakes or ambiguous.
- Use the regression and bias workflow when you are comparing prompt variants over time.
