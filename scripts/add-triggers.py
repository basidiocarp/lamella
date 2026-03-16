#!/usr/bin/env python3
"""
Find skills missing trigger conditions and suggest improvements.
Adds "Use when..." to descriptions that lack trigger context.
"""

import re
import yaml
from pathlib import Path


# Trigger phrases that indicate good descriptions
TRIGGER_PHRASES = [
    "use when", "use for", "use this", "trigger", "apply when",
    "for tasks", "when working", "when you need", "whenever"
]


def extract_frontmatter(content: str) -> tuple:
    """Extract YAML frontmatter and body."""
    if not content.startswith("---"):
        return {}, content

    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content

    try:
        fm = yaml.safe_load(parts[1])
        return fm or {}, "---".join(["", parts[1], parts[2]])
    except:
        return {}, content


def has_trigger(desc: str) -> bool:
    """Check if description has trigger condition."""
    desc_lower = desc.lower()
    return any(phrase in desc_lower for phrase in TRIGGER_PHRASES)


def suggest_trigger(skill_name: str, content: str) -> str:
    """Suggest a trigger phrase based on skill content."""
    # Extract key terms from skill name
    name_parts = skill_name.replace("-", " ").split()

    # Look for common patterns in content
    content_lower = content.lower()

    # Check for language/framework specific
    langs = {
        "python": "Python", "javascript": "JavaScript", "typescript": "TypeScript",
        "go": "Go", "rust": "Rust", "bash": "shell scripts", "sql": "SQL"
    }
    for key, val in langs.items():
        if key in skill_name or key in content_lower[:500]:
            return f"Use when working with {val}"

    # Check for domain patterns
    if "test" in skill_name:
        return "Use when writing or debugging tests"
    if "deploy" in skill_name or "infra" in skill_name:
        return "Use for deployment and infrastructure tasks"
    if "api" in skill_name:
        return "Use when designing or implementing APIs"
    if "database" in skill_name or "sql" in skill_name:
        return "Use for database operations"
    if "security" in skill_name or "auth" in skill_name:
        return "Use for security-related tasks"
    if "debug" in skill_name:
        return "Use when debugging issues"
    if "config" in skill_name or "setup" in skill_name:
        return "Use when configuring or setting up"

    # Generic fallback
    return f"Use when working with {' '.join(name_parts)}"


def fix_description(skill_path: Path, dry_run: bool = True) -> bool:
    """Add trigger to description if missing. Returns True if modified."""
    content = skill_path.read_text()
    fm, _ = extract_frontmatter(content)

    if not fm:
        return False

    desc = fm.get("description", "")
    if not desc or has_trigger(desc):
        return False

    skill_name = skill_path.parent.name
    trigger = suggest_trigger(skill_name, content)

    # Create new description with trigger
    # If description is short, append trigger
    if len(desc) < 150:
        new_desc = f"{desc.rstrip('.')}. {trigger}."
    else:
        # Insert trigger at beginning
        new_desc = f"{trigger}. {desc}"

    if dry_run:
        print(f"\n{skill_path.parent.parent.name}/{skill_name}:")
        print(f"  Before: {desc[:100]}...")
        print(f"  Suggested: {trigger}")
        return True

    # Update frontmatter
    if 'description:' in content:
        # Handle different YAML formats
        if 'description: |' in content or 'description: >' in content:
            # Multi-line format - more complex
            pass  # Skip for now
        else:
            # Single line format
            old_pattern = re.compile(r'description:\s*["\']?(.+?)["\']?\s*\n', re.DOTALL)
            match = old_pattern.search(content)
            if match:
                new_content = content.replace(
                    f'description: {match.group(1)}',
                    f'description: {new_desc}'
                )
                skill_path.write_text(new_content)
                return True

    return False


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Add triggers to skill descriptions")
    parser.add_argument("--dry-run", action="store_true", help="Show suggested changes")
    parser.add_argument("--plugin", help="Process specific plugin only")
    parser.add_argument("--apply", action="store_true", help="Apply changes")
    args = parser.parse_args()

    skills_dir = Path("skills")
    issues = []

    for cat_dir in sorted(skills_dir.iterdir()):
        if not cat_dir.is_dir():
            continue
        if args.plugin and cat_dir.name != args.plugin:
            continue

        for skill_dir in sorted(cat_dir.iterdir()):
            if not skill_dir.is_dir():
                continue

            skill_file = skill_dir / "SKILL.md"
            if not skill_file.exists():
                continue

            content = skill_file.read_text()
            fm, _ = extract_frontmatter(content)
            desc = fm.get("description", "")

            if desc and not has_trigger(desc):
                issues.append((cat_dir.name, skill_dir.name, desc))

    print(f"Skills missing triggers: {len(issues)}")
    print("=" * 60)

    for plugin, skill, desc in issues[:20]:
        trigger = suggest_trigger(skill, "")
        print(f"\n{plugin}/{skill}:")
        print(f"  Current: {desc[:80]}...")
        print(f"  → Add: \"{trigger}\"")

    if len(issues) > 20:
        print(f"\n... and {len(issues) - 20} more")

    print("\n" + "=" * 60)
    print("To see all suggestions, run with specific --plugin")
    print("Example: python3 scripts/add-triggers.py --plugin science")


if __name__ == "__main__":
    main()
