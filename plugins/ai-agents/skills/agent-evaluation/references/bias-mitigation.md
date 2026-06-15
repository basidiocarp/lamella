# Bias Mitigation Techniques

Use this reference when an LLM judge is making preference or quality calls and
you need to reduce predictable scoring bias.

## Position Bias

Pairwise judges often prefer one position over the other. The standard fix is a
swap pass.

```python
async def compare_with_swap(compare, response_a, response_b, prompt, criteria):
    first = await compare(response_a, response_b, prompt, criteria)
    second = await compare(response_b, response_a, prompt, criteria)

    if first["winner"] == "A" and second["winner"] == "B":
        return {"winner": "A", "consistent": True}
    if first["winner"] == "B" and second["winner"] == "A":
        return {"winner": "B", "consistent": True}
    return {"winner": "TIE", "consistent": False}
```

Use more than two orderings only when the decision is high-stakes or the judge
is visibly unstable.

## Length and Verbosity Bias

Judges often over-reward longer answers.

Mitigations:
- instruct the judge not to reward length by default
- add conciseness as its own criterion
- penalize repetition and padding explicitly
- compare information density, not raw word count

Keep the rubric explicit:

```text
- Do not prefer a response because it is longer.
- Penalize repetition and unnecessary detail.
- Reward concise completeness over exhaustive padding.
```

## Self-Enhancement Bias

A model may prefer responses written by itself or a similar model family.

Mitigations:
- use a different model family as the judge when possible
- remove obvious model-identifying phrases
- avoid exposing generator metadata unless the task requires it

The simplest safe rule is: do not let the generation model also be the only
judge for preference-heavy comparisons.

## Authority and Tone Bias

Confident wording can score too well even when it is poorly supported.

Mitigations:
- require evidence before scoring
- separate confidence from correctness
- reward verifiability, not assertive tone

Useful rubric language:

```text
Confident unsupported claims should not score above hedged, evidence-backed
claims.
```

## Evaluation Workflow

Use this order:

1. remove identity cues when possible
2. swap positions for pairwise comparisons
3. require justification before the verdict
4. add conciseness and evidence criteria when bias risk is high
5. escalate inconsistent or low-confidence cases to a second judge or human

## Checklist

| Bias | Mitigation |
|---|---|
| position bias | swap order and compare consistency |
| length bias | explicit anti-length instructions and conciseness criterion |
| verbosity bias | penalize repetition and irrelevant detail |
| self-enhancement bias | cross-model judging and anonymization |
| authority bias | require evidence before scoring |

Bias mitigation is mostly prompt and workflow design, not post-hoc score cleanup.
