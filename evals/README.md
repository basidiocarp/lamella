# Three-Arm Evaluation Harness

This directory contains the framework for measuring the real effectiveness of skills using three-arm controlled evaluation methodology.

## The Three Arms

### Arm 1: Baseline
No prompt instruction at all. The model receives only the task description, without any guidance on how to approach it.

### Arm 2: Terse Control
A generic brevity and clarity instruction that applies universally. Example:
```
Answer concisely and completely.
```

This arm provides a control for the **effect of asking for good behavior**. Without this control, any improvement in Arm 3 could be attributed to the act of prompting, not to the skill content itself.

### Arm 3: Skill
The terse control instruction combined with the full `SKILL.md` content. This provides the maximum context and guidance.

## Why the Delta Matters

The **meaningful delta is Arm 3 minus Arm 2**, not Arm 3 minus Arm 1.

- **Arm 3 vs Arm 1**: tells you that *giving any instruction helps*, but does not isolate the skill's contribution.
- **Arm 3 vs Arm 2**: tells you whether the *specific skill content* adds value beyond generic prompting.

Without Arm 2, you cannot distinguish between:
- "The skill helped" (true improvement)
- "Prompting in general helps" (confound)

## Running an Evaluation

Real evaluation requires a live model. The harness raises `NotImplementedError` if `--simulate` is not passed and no live API integration is wired in.

```bash
# Simulation mode: tests harness machinery without calling a real model API.
# Snapshots are written to evals/snapshots/synthetic/ and should not be
# treated as evidence of skill quality.
python3 lamella/evals/run_eval.py \
  --skill resources/skills/path/to/SKILL.md \
  --task "Your task description here" \
  --simulate

# Real evaluation (requires live model API integration):
python3 lamella/evals/run_eval.py \
  --skill resources/skills/path/to/SKILL.md \
  --task "Your task description here"
```

The script will:
1. Load the skill from the filesystem
2. Run the three arms with corresponding prompts
3. Collect metrics (prompt length, response characteristics, delta vs control)
4. Write results to `evals/snapshots/<skill-name>-<timestamp>.json` (or `evals/snapshots/synthetic/` in simulation mode)
5. Print a summary to stdout

## Output Format

Each evaluation produces a JSON file in `evals/snapshots/` with the structure defined in `schema.json`:

```json
{
  "skill_path": "resources/skills/...",
  "task": "Task description",
  "timestamp": "2026-04-20T12:34:56Z",
  "arms": [
    {
      "name": "baseline",
      "prompt": "...",
      "metrics": {
        "prompt_length": 50,
        "response_length": 200,
        "delta_vs_control": null
      }
    },
    {
      "name": "terse_control",
      "prompt": "...",
      "metrics": {
        "prompt_length": 80,
        "response_length": 210,
        "delta_vs_control": 0
      }
    },
    {
      "name": "skill",
      "prompt": "...",
      "metrics": {
        "prompt_length": 450,
        "response_length": 350,
        "delta_vs_control": 140
      }
    }
  ],
  "conclusion": {
    "primary_delta": 140,
    "methodology_note": "This delta (skill vs terse_control) measures the skill's added value beyond generic prompting."
  }
}
```

## Interpreting Results

The delta is `terse_control_response_length - skill_response_length`. For token-efficiency skills, a shorter response is better, so **positive delta = improvement**.

- **delta > 0**: The skill produced a shorter, more efficient response than generic prompting. Positive effect.
- **delta >> 0**: Strong positive effect. The skill is likely high-value.
- **delta = 0 or negative**: The skill does not improve (or regresses) over generic prompting. Consider revising or retiring the skill.

## Current Status

This is the framework skeleton. Metrics are currently placeholders (prompt length as a proxy). Future work will:
- Integrate with real model APIs (Claude)
- Define cost-aware metrics (latency, token usage)
- Build a snapshot comparison workflow
- Add statistical significance testing over multiple runs
