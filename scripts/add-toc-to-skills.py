#!/usr/bin/env python3
"""
Add table of contents to SKILL.md files that need them.

Per BEST-PRACTICES.md: files > 200 lines should have a TOC.
"""

import re
import yaml
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
SKILLS_DIR = BASE_DIR / "skills"

MIN_LINES_FOR_TOC = 200
MIN_HEADERS_FOR_TOC = 3


def parse_frontmatter(content: str) -> tuple[str, str, int]:
    """Parse frontmatter and return (frontmatter_block, body, end_line)."""
    if not content.startswith("---"):
        return "", content, 0

    lines = content.split("\n")
    end_idx = None
    for i, line in enumerate(lines[1:], 1):
        if line.startswith("---"):
            end_idx = i
            break

    if end_idx is None:
        return "", content, 0

    frontmatter_block = "\n".join(lines[:end_idx + 1])
    body = "\n".join(lines[end_idx + 1:])
    return frontmatter_block, body, end_idx


def has_toc(body: str) -> bool:
    """Check if body already has a table of contents."""
    patterns = [
        r'^## (Contents|Table of Contents|TOC)\b',
        r'^## In This (Document|Guide|Skill)',
        r'^- \[.+\]\(#[^)]+\)',  # TOC-style links
    ]
    for pattern in patterns:
        if re.search(pattern, body, re.IGNORECASE | re.MULTILINE):
            return True
    return False


def extract_headers(body: str) -> list[tuple[int, str, str]]:
    """Extract markdown headers: (level, text, slug)."""
    headers = []
    # Match ## and ### headers (skip # as that's usually the title)
    for match in re.finditer(r'^(#{2,3})\s+(.+)$', body, re.MULTILINE):
        level = len(match.group(1))
        text = match.group(2).strip()
        # Generate slug
        slug = text.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'\s+', '-', slug)
        headers.append((level, text, slug))
    return headers


def generate_toc(headers: list[tuple[int, str, str]]) -> str:
    """Generate a markdown TOC from headers."""
    if len(headers) < MIN_HEADERS_FOR_TOC:
        return ""

    lines = ["## Contents\n"]
    for level, text, slug in headers:
        indent = "  " * (level - 2)  # ## = 0 indent, ### = 2 spaces
        lines.append(f"{indent}- [{text}](#{slug})")

    return "\n".join(lines) + "\n"


def add_toc_to_skill(skill_path: Path, dry_run: bool = False) -> str | None:
    """Add TOC to a skill if needed. Returns change description or None."""
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        return None

    content = skill_md.read_text()
    line_count = len(content.split("\n"))

    # Skip short files
    if line_count < MIN_LINES_FOR_TOC:
        return None

    frontmatter_block, body, _ = parse_frontmatter(content)

    # Skip if already has TOC
    if has_toc(body):
        return None

    # Extract headers and generate TOC
    headers = extract_headers(body)
    toc = generate_toc(headers)

    if not toc:
        return None

    # Find insertion point (after first # header or at start of body)
    body_lines = body.split("\n")
    insert_idx = 0

    # Skip leading whitespace and find first # header
    for i, line in enumerate(body_lines):
        insert_idx = i
        if line.startswith("# "):
            insert_idx = i + 1
            # Skip any blank lines after the title
            while insert_idx < len(body_lines) and not body_lines[insert_idx].strip():
                insert_idx += 1
            break

    if dry_run:
        return f"Would add TOC with {len(headers)} entries"

    # Insert TOC
    new_body_lines = body_lines[:insert_idx] + ["", toc, ""] + body_lines[insert_idx:]
    new_body = "\n".join(new_body_lines)

    # Reconstruct file
    new_content = frontmatter_block + "\n" + new_body

    # Clean up excessive blank lines
    new_content = re.sub(r'\n{4,}', '\n\n\n', new_content)

    skill_md.write_text(new_content)
    return f"Added TOC with {len(headers)} entries"


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Add TOC to long skills")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes")
    parser.add_argument("--skill", type=str, help="Process single skill (category/name)")
    args = parser.parse_args()

    print("=" * 70)
    print("ADD TABLE OF CONTENTS" + (" (DRY RUN)" if args.dry_run else ""))
    print("=" * 70)

    updated = 0
    skipped = 0

    if args.skill:
        skill_path = SKILLS_DIR / args.skill
        if skill_path.exists():
            result = add_toc_to_skill(skill_path, dry_run=args.dry_run)
            if result:
                print(f"\n{args.skill}: {result}")
                updated = 1
        else:
            print(f"Skill not found: {args.skill}")
    else:
        for category in sorted(SKILLS_DIR.iterdir()):
            if not category.is_dir() or category.name.startswith("."):
                continue

            for skill in sorted(category.iterdir()):
                if not skill.is_dir():
                    continue

                rel_path = f"{category.name}/{skill.name}"
                result = add_toc_to_skill(skill, dry_run=args.dry_run)

                if result:
                    print(f"{rel_path}: {result}")
                    updated += 1
                else:
                    skipped += 1

    print(f"\n" + "-" * 40)
    print(f"{'Would update' if args.dry_run else 'Updated'}: {updated}")
    print(f"Skipped (short or has TOC): {skipped}")


if __name__ == "__main__":
    main()
