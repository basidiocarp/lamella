#!/usr/bin/env python3
"""Validate a Lamella skill directory with lightweight structural checks."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


NAME_RE = re.compile(r"^[a-z0-9-]+$")
LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")


def parse_frontmatter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---\n"):
        return {}, text

    end = text.find("\n---\n", 4)
    if end == -1:
        return {}, text

    raw = text[4:end].splitlines()
    data: dict[str, str] = {}
    current_key: str | None = None
    folded = False
    for line in raw:
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
    return data, text[end + 5 :]


def local_links(path: Path, text: str) -> list[str]:
    missing: list[str] = []
    for match in LINK_RE.finditer(text):
        target = match.group(1)
        if (
            target.startswith("#")
            or "://" in target
            or target.startswith("mailto:")
        ):
            continue
        target_path = (path.parent / target).resolve()
        if not target_path.exists():
            missing.append(target)
    return missing


def validate(skill_path: Path) -> dict[str, object]:
    checks: list[dict[str, object]] = []
    warnings: list[str] = []
    suggestions: list[str] = []

    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        return {
            "skill": str(skill_path),
            "ok": False,
            "checks": [{"name": "skill_md_exists", "passed": False}],
            "warnings": [],
            "suggestions": ["Add SKILL.md before running validation."],
        }

    text = skill_md.read_text(encoding="utf-8")
    frontmatter, body = parse_frontmatter(text)
    body_lines = len(body.splitlines())

    name = frontmatter.get("name", "")
    description = frontmatter.get("description", "")

    checks.append({"name": "skill_md_exists", "passed": True})
    checks.append({"name": "frontmatter_name", "passed": bool(name and NAME_RE.match(name))})
    checks.append({"name": "frontmatter_description", "passed": bool(description)})
    checks.append({"name": "description_use_when", "passed": "Use when" in description})

    if body_lines > 500:
        warnings.append(f"SKILL.md body is {body_lines} lines; move detail into references/ if possible.")

    missing_links = local_links(skill_md, text)
    checks.append({"name": "local_links_resolve", "passed": not missing_links})
    if missing_links:
        warnings.append(f"Missing local links: {', '.join(sorted(set(missing_links)))}")

    references_dir = skill_path / "references"
    if references_dir.exists():
        deep_refs = [p for p in references_dir.rglob("*") if p.is_file() and len(p.relative_to(references_dir).parts) > 1]
        if deep_refs:
            warnings.append("references/ contains nested files deeper than one level.")

    scripts_dir = skill_path / "scripts"
    if scripts_dir.exists() and not any(scripts_dir.iterdir()):
        warnings.append("scripts/ exists but is empty.")

    if not description:
        suggestions.append("Add a specific third-person description with clear trigger language.")
    elif "Use when" not in description:
        suggestions.append("Include 'Use when ...' in the description to improve discovery.")

    if not (skill_path / "references").exists() and body_lines > 250:
        suggestions.append("Add references/ and move detailed material out of SKILL.md.")

    ok = all(check["passed"] for check in checks)
    return {
        "skill": str(skill_path),
        "ok": ok,
        "checks": checks,
        "warnings": warnings,
        "suggestions": suggestions,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a Lamella skill directory.")
    parser.add_argument("skill_path", help="Path to the skill directory")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON")
    args = parser.parse_args()

    report = validate(Path(args.skill_path))
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        status = "PASS" if report["ok"] else "FAIL"
        print(f"=== SKILL VALIDATION: {status} ===")
        print(f"Skill: {report['skill']}")
        for check in report["checks"]:
            mark = "PASS" if check["passed"] else "FAIL"
            print(f"- {mark}: {check['name']}")
        for warning in report["warnings"]:
            print(f"- Warning: {warning}")
        for suggestion in report["suggestions"]:
            print(f"- Suggestion: {suggestion}")
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
