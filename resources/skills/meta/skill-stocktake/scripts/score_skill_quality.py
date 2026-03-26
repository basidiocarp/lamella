#!/usr/bin/env python3
"""Apply a lightweight quality score to a Lamella skill."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


NAME_RE = re.compile(r"^[a-z0-9-]+$")


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}
    data: dict[str, str] = {}
    current_key: str | None = None
    folded = False
    for line in text[4:end].splitlines():
        if folded and current_key and (line.startswith("  ") or line.startswith("\t")):
            continuation = line.strip()
            if continuation:
                data[current_key] = f"{data[current_key]} {continuation}".strip()
            continue

        folded = False
        current_key = None
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if value in {">", ">-", "|", "|-"}:
            data[key] = ""
            current_key = key
            folded = True
            continue
        data[key] = value.strip('"').strip("'")
    return data


def score(skill_path: Path) -> dict[str, object]:
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        return {"skill": str(skill_path), "score": 0, "grade": "F", "notes": ["Missing SKILL.md"]}

    text = skill_md.read_text(encoding="utf-8")
    frontmatter = parse_frontmatter(text)
    body_lines = max(0, len(text.splitlines()) - len(frontmatter) - 2)

    score = 0
    notes: list[str] = []

    if NAME_RE.match(frontmatter.get("name", "")):
        score += 20
    else:
        notes.append("Invalid or missing frontmatter name.")

    description = frontmatter.get("description", "")
    if description:
        score += 20
        if "Use when" in description:
            score += 10
        else:
            notes.append("Description should include 'Use when ...'.")
    else:
        notes.append("Missing description.")

    if 40 <= body_lines <= 500:
        score += 20
    elif body_lines > 500:
        score += 10
        notes.append("SKILL.md is long; move detail into references/.")
    else:
        score += 10
        notes.append("SKILL.md may be too thin for reliable execution.")

    if (skill_path / "references").exists():
        score += 15
    else:
        notes.append("No references/ directory.")

    scripts_dir = skill_path / "scripts"
    if scripts_dir.exists() and any(scripts_dir.glob("*.py")):
        score += 15

    grade = "A" if score >= 85 else "B" if score >= 70 else "C" if score >= 55 else "D" if score >= 40 else "F"
    return {"skill": str(skill_path), "score": score, "grade": grade, "notes": notes}


def main() -> int:
    parser = argparse.ArgumentParser(description="Score a Lamella skill with a lightweight rubric.")
    parser.add_argument("skill_path", help="Path to the skill directory")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON")
    args = parser.parse_args()

    report = score(Path(args.skill_path))
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print("=== SKILL QUALITY SCORE ===")
        print(f"Skill: {report['skill']}")
        print(f"Score: {report['score']}")
        print(f"Grade: {report['grade']}")
        for note in report["notes"]:
            print(f"- {note}")
    return 0 if report["score"] >= 55 else 1


if __name__ == "__main__":
    raise SystemExit(main())
