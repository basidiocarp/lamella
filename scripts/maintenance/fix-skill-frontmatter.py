#!/usr/bin/env python3
"""
Fix SKILL.md frontmatter to match the supported schema.

Supported frontmatter fields (per skills-ref validator):
- name (required)
- description (required)
- allowed-tools (optional, experimental)
- compatibility (optional)
- license (optional)
- metadata (nested object for additional properties)
"""

import yaml
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
SKILLS_DIR = BASE_DIR / "skills"

# Supported frontmatter fields per skills-ref validator
SUPPORTED_FIELDS = {
    "name", "description", "allowed-tools", "compatibility", "license", "metadata",
}

# Fields to move into metadata.*
METADATA_CANDIDATES = {
    "argument-hint", "user-invokable", "disable-model-invocation",
    "phase", "version", "updated", "category", "frameworks",
    "tags", "author", "created", "triggers", "outputs",
    "inputs", "dependencies", "related", "aliases",
    "context", "model", "skills", "hooks", "agent", "tools", "type",
}

# Fields to remove entirely (none currently)
REMOVE_FIELDS = set()


class SafeDumper(yaml.SafeDumper):
    """Custom dumper that handles multiline strings properly."""
    pass


def str_representer(dumper, data):
    """Use literal block style for multiline strings, quote strings with special chars."""
    if '\n' in data:
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='|')
    # Quote strings with colons, brackets, or that are very long
    if ':' in data or '[' in data or ']' in data or len(data) > 80:
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='"')
    return dumper.represent_scalar('tag:yaml.org,2002:str', data)


SafeDumper.add_representer(str, str_representer)


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Parse YAML frontmatter from markdown. Returns (frontmatter, body)."""
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

    frontmatter_text = "\n".join(lines[1:end_idx])
    try:
        frontmatter = yaml.safe_load(frontmatter_text) or {}
    except yaml.YAMLError as e:
        print(f"  YAML error: {e}")
        return {}, content

    body = "\n".join(lines[end_idx + 1:])
    return frontmatter, body


def fix_skill(skill_path: Path, dry_run: bool = False) -> list[str]:
    """Fix a skill's frontmatter. Returns list of changes."""
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        return []

    content = skill_md.read_text()
    frontmatter, body = parse_frontmatter(content)

    if not frontmatter:
        return []

    changes = []
    new_fm = {}

    # Get or create metadata dict
    metadata = frontmatter.get("metadata", {})
    if not isinstance(metadata, dict):
        metadata = {"original": metadata}

    for key, value in frontmatter.items():
        if key in SUPPORTED_FIELDS:
            new_fm[key] = value
        elif key in REMOVE_FIELDS:
            changes.append(f"Removed: {key}")
        elif key in METADATA_CANDIDATES:
            metadata[key] = value
            changes.append(f"Moved to metadata: {key}")
        else:
            # Unknown field - preserve in metadata
            metadata[key] = value
            changes.append(f"Moved to metadata: {key}")

    # Add metadata if we accumulated any
    if metadata and metadata != frontmatter.get("metadata", {}):
        new_fm["metadata"] = metadata
    elif "metadata" in frontmatter:
        new_fm["metadata"] = frontmatter["metadata"]

    if not changes:
        return []

    if dry_run:
        return changes

    # Build new frontmatter in preferred order
    ordered = {}
    order = ["name", "description", "allowed-tools", "compatibility", "license", "metadata"]
    for key in order:
        if key in new_fm:
            ordered[key] = new_fm[key]

    # Dump with proper formatting
    new_content = "---\n"
    new_content += yaml.dump(ordered, Dumper=SafeDumper,
                             default_flow_style=False,
                             allow_unicode=True,
                             sort_keys=False,
                             width=120)
    new_content += "---"
    new_content += body

    skill_md.write_text(new_content)
    return changes


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Fix skill frontmatter")
    parser.add_argument("--dry-run", action="store_true", help="Show changes without applying")
    parser.add_argument("--skill", type=str, help="Fix only this skill (category/name)")
    args = parser.parse_args()

    print("=" * 70)
    print("SKILL FRONTMATTER FIX" + (" (DRY RUN)" if args.dry_run else ""))
    print("=" * 70)

    total_changes = 0
    skills_fixed = 0

    if args.skill:
        # Fix single skill
        skill_path = SKILLS_DIR / args.skill
        if skill_path.exists():
            changes = fix_skill(skill_path, dry_run=args.dry_run)
            if changes:
                print(f"\n{args.skill}:")
                for c in changes:
                    print(f"  - {c}")
                skills_fixed = 1
                total_changes = len(changes)
        else:
            print(f"Skill not found: {args.skill}")
    else:
        # Fix all skills
        for category in sorted(SKILLS_DIR.iterdir()):
            if not category.is_dir() or category.name.startswith("."):
                continue

            for skill in sorted(category.iterdir()):
                if not skill.is_dir() or skill.name.startswith("."):
                    continue

                rel_path = f"{category.name}/{skill.name}"
                changes = fix_skill(skill, dry_run=args.dry_run)

                if changes:
                    print(f"\n{rel_path}:")
                    for c in changes:
                        print(f"  - {c}")
                    skills_fixed += 1
                    total_changes += len(changes)

    print(f"\n" + "-" * 40)
    print(f"Skills {'would be ' if args.dry_run else ''}fixed: {skills_fixed}")
    print(f"Total changes: {total_changes}")
    print("=" * 70)


if __name__ == "__main__":
    main()
