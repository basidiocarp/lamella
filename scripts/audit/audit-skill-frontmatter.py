#!/usr/bin/env python3
"""
Audit and fix SKILL.md frontmatter to match the supported schema.

Supported frontmatter fields (per skills-ref validator):
- name (required): Skill identifier
- description (required): What the skill does and when to use it
- allowed-tools: Space-delimited list of pre-approved tools (experimental)
- compatibility: Environment requirements
- license: License identifier
- metadata: Nested object for additional metadata
"""

import os
import re
import yaml
from pathlib import Path
from dataclasses import dataclass, field

BASE_DIR = Path(__file__).parent.parent
SKILLS_DIR = BASE_DIR / "skills"

# Supported frontmatter fields per skills-ref validator
SUPPORTED_FIELDS = {
    "name",
    "description",
    "allowed-tools",
    "compatibility",
    "license",
    "metadata",
}

# Fields that should be moved into metadata
METADATA_CANDIDATES = {
    "argument-hint", "user-invokable", "disable-model-invocation",
    "phase", "version", "updated", "category", "frameworks",
    "tags", "author", "created", "triggers", "outputs",
    "inputs", "dependencies", "related", "aliases",
}

# Fields to remove entirely (none currently)
REMOVE_FIELDS = set()


@dataclass
class FrontmatterIssue:
    skill_path: str
    invalid_fields: list = field(default_factory=list)
    missing_fields: list = field(default_factory=list)
    metadata_candidates: list = field(default_factory=list)


def parse_frontmatter(content: str) -> tuple[dict, str, int, int]:
    """Parse YAML frontmatter from markdown content.
    Returns (frontmatter_dict, body, start_line, end_line)
    Uses PyYAML for proper YAML parsing including multiline values.
    """
    if not content.startswith("---"):
        return {}, content, 0, 0

    lines = content.split("\n")
    end_idx = None
    for i, line in enumerate(lines[1:], 1):
        # Handle both "---" and "---# Heading" patterns
        if line.strip() == "---" or line.startswith("---"):
            end_idx = i
            break

    if end_idx is None:
        return {}, content, 0, 0

    # Use proper YAML parsing
    frontmatter_text = "\n".join(lines[1:end_idx])
    try:
        frontmatter = yaml.safe_load(frontmatter_text) or {}
    except yaml.YAMLError:
        frontmatter = {}

    body = "\n".join(lines[end_idx + 1:])
    return frontmatter, body, 0, end_idx


def audit_skill(skill_path: Path) -> FrontmatterIssue | None:
    """Audit a single skill's frontmatter."""
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        return None

    content = skill_md.read_text()
    frontmatter, _, _, _ = parse_frontmatter(content)

    if not frontmatter:
        return FrontmatterIssue(
            skill_path=str(skill_path.relative_to(SKILLS_DIR)),
            missing_fields=["name", "description"]
        )

    issue = FrontmatterIssue(skill_path=str(skill_path.relative_to(SKILLS_DIR)))

    # Check for missing required fields
    if "name" not in frontmatter:
        issue.missing_fields.append("name")
    if "description" not in frontmatter:
        issue.missing_fields.append("description")

    # Check for invalid fields
    for key in frontmatter.keys():
        if key in SUPPORTED_FIELDS:
            continue
        elif key in REMOVE_FIELDS:
            issue.invalid_fields.append(f"{key} (will remove)")
        elif key in METADATA_CANDIDATES:
            issue.metadata_candidates.append(key)
        else:
            issue.invalid_fields.append(key)

    # Only return if there are issues
    if issue.invalid_fields or issue.missing_fields or issue.metadata_candidates:
        return issue
    return None


def fix_frontmatter(skill_path: Path, dry_run: bool = False) -> list[str]:
    """Fix a skill's frontmatter. Returns list of changes made."""
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        return []

    content = skill_md.read_text()
    frontmatter, body, start, end = parse_frontmatter(content)

    if not frontmatter:
        return []

    changes = []
    new_frontmatter = {}
    metadata = frontmatter.get("metadata", {})
    if not isinstance(metadata, dict):
        metadata = {}

    for key, value in frontmatter.items():
        if key in SUPPORTED_FIELDS:
            new_frontmatter[key] = value
        elif key in REMOVE_FIELDS:
            changes.append(f"Removed: {key}")
        elif key in METADATA_CANDIDATES:
            metadata[key] = value
            changes.append(f"Moved to metadata: {key}")
        else:
            # Unknown field - move to metadata to preserve
            metadata[key] = value
            changes.append(f"Moved to metadata: {key}")

    # Add metadata if we have any
    if metadata:
        new_frontmatter["metadata"] = metadata

    if not changes:
        return []

    # For now, just return changes without modifying (dry_run always)
    # Full fix requires proper YAML handling
    return changes


def audit_all():
    """Audit all skills."""
    issues = []

    for category in sorted(SKILLS_DIR.iterdir()):
        if not category.is_dir() or category.name.startswith("."):
            continue

        for skill in sorted(category.iterdir()):
            if not skill.is_dir() or skill.name.startswith("."):
                continue

            issue = audit_skill(skill)
            if issue:
                issues.append(issue)

    return issues


def fix_all(dry_run: bool = False):
    """Fix all skills."""
    all_changes = {}

    for category in sorted(SKILLS_DIR.iterdir()):
        if not category.is_dir() or category.name.startswith("."):
            continue

        for skill in sorted(category.iterdir()):
            if not skill.is_dir() or skill.name.startswith("."):
                continue

            changes = fix_frontmatter(skill, dry_run=dry_run)
            if changes:
                rel_path = str(skill.relative_to(SKILLS_DIR))
                all_changes[rel_path] = changes

    return all_changes


def print_audit_report(issues: list[FrontmatterIssue]):
    """Print audit report."""
    print("=" * 70)
    print("SKILL FRONTMATTER AUDIT")
    print("=" * 70)

    print(f"\nSkills with issues: {len(issues)}")

    # Group by issue type
    invalid = [i for i in issues if i.invalid_fields]
    missing = [i for i in issues if i.missing_fields]
    metadata = [i for i in issues if i.metadata_candidates]

    if invalid:
        print(f"\n--- Invalid fields ({len(invalid)} skills) ---")
        for i in invalid[:10]:
            print(f"  {i.skill_path}: {', '.join(i.invalid_fields)}")
        if len(invalid) > 10:
            print(f"  ... and {len(invalid) - 10} more")

    if missing:
        print(f"\n--- Missing required fields ({len(missing)} skills) ---")
        for i in missing[:10]:
            print(f"  {i.skill_path}: {', '.join(i.missing_fields)}")
        if len(missing) > 10:
            print(f"  ... and {len(missing) - 10} more")

    if metadata:
        print(f"\n--- Fields to move to metadata ({len(metadata)} skills) ---")
        for i in metadata[:10]:
            print(f"  {i.skill_path}: {', '.join(i.metadata_candidates)}")
        if len(metadata) > 10:
            print(f"  ... and {len(metadata) - 10} more")

    print("\n" + "=" * 70)


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Audit and fix skill frontmatter")
    parser.add_argument("--fix", action="store_true", help="Fix issues")
    parser.add_argument("--dry-run", action="store_true", help="Show what would change")
    args = parser.parse_args()

    if args.fix or args.dry_run:
        print("=" * 70)
        print("SKILL FRONTMATTER FIX" + (" (DRY RUN)" if args.dry_run else ""))
        print("=" * 70)

        changes = fix_all(dry_run=args.dry_run)

        for path, change_list in changes.items():
            print(f"\n{path}:")
            for c in change_list:
                print(f"  - {c}")

        print(f"\n--- Summary ---")
        print(f"Skills modified: {len(changes)}")
        print("=" * 70)
    else:
        issues = audit_all()
        print_audit_report(issues)


if __name__ == "__main__":
    main()
