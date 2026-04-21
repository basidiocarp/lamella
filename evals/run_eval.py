#!/usr/bin/env python3
"""
Three-arm evaluation harness for lamella skills.

This script runs a controlled evaluation comparing:
- Arm 1 (baseline): no instruction
- Arm 2 (terse control): generic brevity/clarity instruction only
- Arm 3 (skill): terse control + full SKILL.md content

The meaningful delta is Arm 3 vs Arm 2 (skill vs control).
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def read_skill(skill_path: str) -> str:
    """Read a SKILL.md file."""
    path = Path(skill_path)
    if not path.exists():
        raise FileNotFoundError(f"Skill file not found: {skill_path}")
    return path.read_text()


def extract_skill_name(skill_path: str) -> str:
    """Extract skill name from path (e.g., 'event-store-design' from path)."""
    return Path(skill_path).parent.name


def build_baseline_prompt(task: str) -> str:
    """Arm 1: Baseline with no instruction."""
    return task


def build_control_prompt(task: str) -> str:
    """Arm 2: Terse control arm with generic brevity instruction."""
    return f"Answer concisely and completely.\n\n{task}"


def build_skill_prompt(task: str, skill_content: str) -> str:
    """Arm 3: Terse control + full skill content."""
    return f"Answer concisely and completely.\n\n{skill_content}\n\n---\n\nTask: {task}"


def simulate_response(prompt: str) -> str:
    """
    Simulate a model response.

    In a real system, this would call the Claude API and return the actual response.
    For now, we return a placeholder that echoes part of the prompt.
    """
    # Placeholder: return a short summary of the prompt
    return f"[Simulated response to prompt about: {prompt[:100]}...]"


def calculate_metrics(arm_name: str, prompt: str, response: str, control_response_length: int) -> dict:
    """Calculate metrics for an arm."""
    prompt_length = len(prompt)
    response_length = len(response)

    # delta_vs_control is null for baseline and control arms, otherwise difference
    if arm_name in ("baseline", "terse_control"):
        delta_vs_control = None
    else:
        delta_vs_control = response_length - control_response_length

    return {
        "prompt_length": prompt_length,
        "response_length": response_length,
        "delta_vs_control": delta_vs_control,
    }


def run_eval(skill_path: str, task: str) -> dict:
    """Run a three-arm evaluation."""
    # Read the skill
    skill_content = read_skill(skill_path)
    skill_name = extract_skill_name(skill_path)

    # Build the three arms
    baseline_prompt = build_baseline_prompt(task)
    control_prompt = build_control_prompt(task)
    skill_prompt = build_skill_prompt(task, skill_content)

    # Simulate responses
    baseline_response = simulate_response(baseline_prompt)
    control_response = simulate_response(control_prompt)
    skill_response = simulate_response(skill_prompt)

    # Calculate metrics (control response length is used for delta calculation)
    control_response_length = len(control_response)

    arms = [
        {
            "name": "baseline",
            "prompt": baseline_prompt,
            "metrics": calculate_metrics("baseline", baseline_prompt, baseline_response, control_response_length),
        },
        {
            "name": "terse_control",
            "prompt": control_prompt,
            "metrics": calculate_metrics("terse_control", control_prompt, control_response, control_response_length),
        },
        {
            "name": "skill",
            "prompt": skill_prompt,
            "metrics": calculate_metrics("skill", skill_prompt, skill_response, control_response_length),
        },
    ]

    # Calculate the primary delta (Arm 3 vs Arm 2)
    skill_metrics = arms[2]["metrics"]
    primary_delta = skill_metrics["delta_vs_control"]

    result = {
        "skill_path": skill_path,
        "task": task,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "arms": arms,
        "conclusion": {
            "primary_delta": primary_delta,
            "methodology_note": "This delta (skill vs terse_control) measures the skill's added value beyond generic prompting.",
        },
    }

    return result


def write_snapshot(result: dict, skill_name: str) -> Path:
    """Write evaluation result to snapshots directory."""
    snapshots_dir = Path(__file__).parent / "snapshots"
    snapshots_dir.mkdir(parents=True, exist_ok=True)

    # Use timestamp for uniqueness
    timestamp = datetime.fromisoformat(result["timestamp"]).strftime("%Y%m%d_%H%M%S")
    output_file = snapshots_dir / f"{skill_name}-{timestamp}.json"

    output_file.write_text(json.dumps(result, indent=2))
    return output_file


def print_summary(result: dict, output_file: Path) -> None:
    """Print a human-readable summary."""
    print("\n" + "=" * 70)
    print("THREE-ARM EVALUATION SUMMARY")
    print("=" * 70)
    print(f"Skill: {result['skill_path']}")
    print(f"Task: {result['task'][:60]}...")
    print(f"Timestamp: {result['timestamp']}")
    print()

    for arm in result["arms"]:
        print(f"{arm['name'].upper()}")
        print(f"  Prompt length: {arm['metrics']['prompt_length']}")
        print(f"  Response length: {arm['metrics']['response_length']}")
        if arm['metrics']['delta_vs_control'] is not None:
            print(f"  Delta vs control: {arm['metrics']['delta_vs_control']}")
        print()

    primary_delta = result["conclusion"]["primary_delta"]
    print(f"PRIMARY DELTA (skill vs terse_control): {primary_delta}")
    print(f"Note: {result['conclusion']['methodology_note']}")
    print()
    print(f"Results saved to: {output_file}")
    print("=" * 70 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="Run a three-arm evaluation of a lamella skill."
    )
    parser.add_argument(
        "--skill",
        required=True,
        help="Path to the SKILL.md file to evaluate",
    )
    parser.add_argument(
        "--task",
        required=True,
        help="Task description for the evaluation",
    )

    args = parser.parse_args()

    try:
        result = run_eval(args.skill, args.task)
        skill_name = extract_skill_name(args.skill)
        output_file = write_snapshot(result, skill_name)
        print_summary(result, output_file)

        # Also print JSON to stdout for programmatic use
        print(json.dumps(result, indent=2))

    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
