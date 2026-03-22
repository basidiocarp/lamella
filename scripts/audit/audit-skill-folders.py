#!/usr/bin/env python3
"""
Audit skill folder structures and SKILL.md formats.
Reports inconsistencies and generates recommendations.
"""

import json
import os
import re
from dataclasses import dataclass, field
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
SKILLS_DIR = BASE_DIR / "skills"

# Standard subfolder names
STANDARD_SUBFOLDERS = {"references", "examples", "assets", "scripts"}

# Folder renames to standardize
FOLDER_RENAMES = {
    "reference": "references",
    "refs": "references",
    "docs": "references",
    "templates": "assets",
    "resources": "assets",
    "test": "examples",
    "tests": "examples",
    "template": "assets",
}

# Files that should be in assets/
ASSET_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".pptx", ".docx", ".xlsx"}

# Files that should be in scripts/
SCRIPT_EXTENSIONS = {".sh", ".py", ".ts", ".js"}

# Required SKILL.md frontmatter fields
REQUIRED_FRONTMATTER = {"name", "description"}

# Common section headers (normalized lowercase)
EXPECTED_SECTIONS = {
    "purpose", "overview", "when to use", "inputs", "process",
    "outputs", "examples", "constraints", "success criteria"
}


@dataclass
class SkillAuditResult:
    """Audit result for a single skill."""
    path: str
    issues: list = field(default_factory=list)
    suggestions: list = field(default_factory=list)

    # Folder structure
    has_skill_md: bool = False
    subfolders: list = field(default_factory=list)
    loose_files: list = field(default_factory=list)
    rename_suggestions: dict = field(default_factory=dict)

    # SKILL.md format
    has_frontmatter: bool = False
    frontmatter_fields: list = field(default_factory=list)
    missing_frontmatter: list = field(default_factory=list)
    sections: list = field(default_factory=list)


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Parse YAML frontmatter from markdown content."""
    if not content.startswith("---"):
        return {}, content

    lines = content.split("\n")
    end_idx = None
    for i, line in enumerate(lines[1:], 1):
        if line.strip() == "---":
            end_idx = i
            break

    if end_idx is None:
        return {}, content

    frontmatter = {}
    for line in lines[1:end_idx]:
        if ":" in line:
            key = line.split(":")[0].strip()
            frontmatter[key] = True  # Just track presence

    return frontmatter, "\n".join(lines[end_idx + 1:])


def extract_sections(content: str) -> list[str]:
    """Extract section headers from markdown content."""
    sections = []
    for line in content.split("\n"):
        if line.startswith("## "):
            header = line[3:].strip().lower()
            sections.append(header)
    return sections


def audit_skill(skill_path: Path) -> SkillAuditResult:
    """Audit a single skill folder."""
    result = SkillAuditResult(path=str(skill_path.relative_to(SKILLS_DIR)))

    # Check for SKILL.md
    skill_md = skill_path / "SKILL.md"
    if skill_md.exists():
        result.has_skill_md = True

        # Parse SKILL.md
        content = skill_md.read_text()
        frontmatter, body = parse_frontmatter(content)

        if frontmatter:
            result.has_frontmatter = True
            result.frontmatter_fields = list(frontmatter.keys())
            result.missing_frontmatter = [
                f for f in REQUIRED_FRONTMATTER
                if f not in frontmatter
            ]
        else:
            result.issues.append("Missing YAML frontmatter")
            result.missing_frontmatter = list(REQUIRED_FRONTMATTER)

        # Extract sections
        result.sections = extract_sections(body)
    else:
        result.issues.append("Missing SKILL.md")

    # Audit folder structure
    for item in skill_path.iterdir():
        if item.name.startswith("."):
            continue

        if item.is_dir():
            result.subfolders.append(item.name)

            # Check for non-standard folder names
            if item.name in FOLDER_RENAMES:
                result.rename_suggestions[item.name] = FOLDER_RENAMES[item.name]
                result.suggestions.append(
                    f"Rename '{item.name}/' to '{FOLDER_RENAMES[item.name]}/'"
                )
            elif item.name not in STANDARD_SUBFOLDERS:
                # Non-standard folder
                result.issues.append(f"Non-standard subfolder: {item.name}/")

        elif item.is_file() and item.name != "SKILL.md":
            result.loose_files.append(item.name)

            # Suggest moving to appropriate subfolder
            ext = item.suffix.lower()
            if ext in ASSET_EXTENSIONS:
                result.suggestions.append(f"Move '{item.name}' to assets/")
            elif ext in SCRIPT_EXTENSIONS:
                result.suggestions.append(f"Move '{item.name}' to scripts/")
            elif ext == ".md":
                result.suggestions.append(f"Move '{item.name}' to references/")

    return result


def audit_all_skills() -> dict:
    """Audit all skills and return summary."""
    results = []

    # Find all skill folders (2 levels deep: category/skill)
    for category in SKILLS_DIR.iterdir():
        if not category.is_dir() or category.name.startswith("."):
            continue

        for skill in category.iterdir():
            if not skill.is_dir() or skill.name.startswith("."):
                continue

            if (skill / "SKILL.md").exists():
                result = audit_skill(skill)
                results.append(result)

    return results


def print_report(results: list[SkillAuditResult]):
    """Print audit report."""
    print("=" * 70)
    print("SKILL FOLDER AUDIT REPORT")
    print("=" * 70)

    # Summary stats
    total = len(results)
    with_issues = sum(1 for r in results if r.issues)
    with_suggestions = sum(1 for r in results if r.suggestions)
    missing_frontmatter = sum(1 for r in results if not r.has_frontmatter)

    print(f"\nTotal skills: {total}")
    print(f"Skills with issues: {with_issues}")
    print(f"Skills with suggestions: {with_suggestions}")
    print(f"Missing frontmatter: {missing_frontmatter}")

    # Folder name stats
    folder_counts = {}
    for r in results:
        for folder in r.subfolders:
            folder_counts[folder] = folder_counts.get(folder, 0) + 1

    print("\n" + "-" * 40)
    print("SUBFOLDER FREQUENCY")
    print("-" * 40)
    for name, count in sorted(folder_counts.items(), key=lambda x: -x[1]):
        status = "✓" if name in STANDARD_SUBFOLDERS else "→" if name in FOLDER_RENAMES else "?"
        rename = f" → {FOLDER_RENAMES[name]}" if name in FOLDER_RENAMES else ""
        print(f"  {status} {name}: {count}{rename}")

    # Loose file stats
    loose_ext_counts = {}
    for r in results:
        for f in r.loose_files:
            ext = Path(f).suffix.lower() or "(no ext)"
            loose_ext_counts[ext] = loose_ext_counts.get(ext, 0) + 1

    if loose_ext_counts:
        print("\n" + "-" * 40)
        print("LOOSE FILES BY EXTENSION")
        print("-" * 40)
        for ext, count in sorted(loose_ext_counts.items(), key=lambda x: -x[1]):
            print(f"  {ext}: {count}")

    # Skills needing attention
    print("\n" + "-" * 40)
    print("SKILLS NEEDING ATTENTION")
    print("-" * 40)

    attention_needed = [r for r in results if r.issues or r.suggestions]
    if not attention_needed:
        print("  None! All skills are well-organized.")
    else:
        # Group by issue type
        missing_fm = [r for r in results if not r.has_frontmatter]
        has_renames = [r for r in results if r.rename_suggestions]
        has_loose = [r for r in results if r.loose_files]

        if missing_fm[:5]:
            print(f"\n  Missing frontmatter ({len(missing_fm)} total):")
            for r in missing_fm[:5]:
                print(f"    - {r.path}")
            if len(missing_fm) > 5:
                print(f"    ... and {len(missing_fm) - 5} more")

        if has_renames[:5]:
            print(f"\n  Folders to rename ({len(has_renames)} total):")
            for r in has_renames[:5]:
                renames = ", ".join(f"{k}→{v}" for k, v in r.rename_suggestions.items())
                print(f"    - {r.path}: {renames}")
            if len(has_renames) > 5:
                print(f"    ... and {len(has_renames) - 5} more")

        if has_loose[:5]:
            print(f"\n  Loose files to organize ({len(has_loose)} total):")
            for r in has_loose[:5]:
                print(f"    - {r.path}: {', '.join(r.loose_files[:3])}")
            if len(has_loose) > 5:
                print(f"    ... and {len(has_loose) - 5} more")

    print("\n" + "=" * 70)


def main():
    results = audit_all_skills()
    print_report(results)


if __name__ == "__main__":
    main()
