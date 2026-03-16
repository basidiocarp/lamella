#!/usr/bin/env python3
"""
Apply Haiku-friendly rewrites to skill files.

Converts verbose patterns to direct imperative style:
- "You should X" → "X"
- "You need to X" → "X"
- "You must X" → "X"
- "This is X" → "X" (when followed by explanation)
- "This means X" → "X"
- "This allows X" → "X"
- "What this does is X" → "X"
- "It's important to X" → "X"
- "Make sure to X" → "X"
- "Be sure to X" → "X"
"""

import re
import sys
from pathlib import Path

# Patterns to rewrite (case-insensitive)
REWRITES = [
    # "You should/need/must X" → "X" (capitalize X)
    (r'\bYou should\s+', ''),
    (r'\bYou need to\s+', ''),
    (r'\bYou must\s+', ''),
    (r'\bYou will need to\s+', ''),
    (r'\bYou can\s+', ''),  # Often filler
    (r'\bYou\'ll want to\s+', ''),
    (r'\bYou\'ll need to\s+', ''),

    # "This is/means/allows" patterns
    (r'\bThis is\s+(?:a\s+)?(?:way|method|approach)\s+(?:to|for)\s+', ''),
    (r'\bThis means (?:that\s+)?', ''),
    (r'\bThis allows (?:you to\s+)?', ''),
    (r'\bThis enables (?:you to\s+)?', ''),
    (r'\bThis lets (?:you\s+)?', ''),
    (r'\bWhat this does is\s+', ''),
    (r'\bWhat this means is\s+', ''),

    # Filler phrases
    (r'\bIt\'s important to\s+', ''),
    (r'\bIt is important to\s+', ''),
    (r'\bMake sure (?:to\s+)?', ''),
    (r'\bBe sure to\s+', ''),
    (r'\bRemember to\s+', ''),
    (r'\bDon\'t forget to\s+', ''),
    (r'\bNote that\s+', ''),
    (r'\bIt should be noted that\s+', ''),
    (r'\bKeep in mind that\s+', ''),
    (r'\bBasically,?\s+', ''),
    (r'\bEssentially,?\s+', ''),
    (r'\bIn order to\s+', 'To '),

    # Wordiness
    (r'\bIn the event that\s+', 'If '),
    (r'\bAt this point in time\s+', 'Now '),
    (r'\bDue to the fact that\s+', 'Because '),
    (r'\bFor the purpose of\s+', 'To '),
    (r'\bIn the case of\s+', 'For '),
    (r'\bWith regard to\s+', 'About '),
    (r'\bWith respect to\s+', 'About '),
    (r'\bAs a result of\s+', 'From '),
    (r'\bIn spite of the fact that\s+', 'Although '),
]

def capitalize_after_removal(text: str, match_start: int, match_end: int, replacement: str) -> str:
    """Capitalize the first letter after pattern removal if at sentence start."""
    before = text[:match_start]
    after = text[match_end:]

    # Check if this is at the start of a sentence (after . ! ? or at line start)
    if not before or before.rstrip().endswith(('.', '!', '?', '\n', '-')):
        # Capitalize first letter of what follows
        if after and after[0].islower():
            after = after[0].upper() + after[1:]

    return before + replacement + after


def apply_rewrites(content: str, dry_run: bool = False) -> tuple[str, list[tuple[str, str, int]]]:
    """Apply all rewrites to content. Returns (new_content, changes)."""
    changes = []

    for pattern, replacement in REWRITES:
        regex = re.compile(pattern, re.IGNORECASE)

        # Find all matches first
        matches = list(regex.finditer(content))

        # Process in reverse order to maintain positions
        for match in reversed(matches):
            original = match.group(0)

            # Get context (surrounding text)
            start = max(0, match.start() - 20)
            end = min(len(content), match.end() + 40)
            context_before = content[start:match.start()]
            context_after = content[match.end():end]

            # Determine replacement (preserve case of first letter if needed)
            new_replacement = replacement
            if replacement == '' and match.end() < len(content):
                # Capitalize next word if we removed sentence-start phrase
                next_char_pos = match.end()
                while next_char_pos < len(content) and content[next_char_pos] in ' \t':
                    next_char_pos += 1
                if next_char_pos < len(content):
                    before = content[:match.start()].rstrip()
                    if not before or before.endswith(('.', '!', '?', '\n', '-', ':')):
                        # This is sentence start - capitalize
                        if content[next_char_pos].islower():
                            content = content[:next_char_pos] + content[next_char_pos].upper() + content[next_char_pos + 1:]

            # Track change
            changes.append((
                f"...{context_before}{original}{context_after}...",
                f"...{context_before}{new_replacement}{context_after}...",
                match.start()
            ))

            # Apply replacement
            content = content[:match.start()] + new_replacement + content[match.end():]

    return content, changes


def process_file(filepath: Path, dry_run: bool = False) -> int:
    """Process a single file. Returns number of changes."""
    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        print(f"  Error reading {filepath}: {e}")
        return 0

    new_content, changes = apply_rewrites(content, dry_run)

    if changes:
        if not dry_run:
            filepath.write_text(new_content, encoding='utf-8')
        return len(changes)

    return 0


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Apply Haiku-friendly rewrites to skills')
    parser.add_argument('--dry-run', action='store_true', help='Show changes without applying')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show each change')
    parser.add_argument('path', nargs='?', default='skills', help='Path to process (default: skills/)')
    args = parser.parse_args()

    base_path = Path(args.path)
    if not base_path.exists():
        print(f"Error: {base_path} does not exist")
        sys.exit(1)

    # Find all SKILL.md files
    if base_path.is_file():
        skill_files = [base_path]
    else:
        skill_files = list(base_path.rglob('SKILL.md'))

    print(f"{'[DRY RUN] ' if args.dry_run else ''}Processing {len(skill_files)} skill files...")
    print()

    total_changes = 0
    files_changed = 0

    for filepath in sorted(skill_files):
        rel_path = filepath.relative_to(base_path) if base_path.is_dir() else filepath.name

        if args.verbose or args.dry_run:
            content = filepath.read_text(encoding='utf-8')
            new_content, changes = apply_rewrites(content)

            if changes:
                files_changed += 1
                total_changes += len(changes)
                print(f"{rel_path}: {len(changes)} changes")

                if args.verbose:
                    for old, new, pos in changes[:5]:  # Show first 5
                        print(f"  - {old[:60]}...")
                        print(f"  + {new[:60]}...")
                    if len(changes) > 5:
                        print(f"  ... and {len(changes) - 5} more")
                    print()

                if not args.dry_run:
                    filepath.write_text(new_content, encoding='utf-8')
        else:
            changes = process_file(filepath, args.dry_run)
            if changes:
                files_changed += 1
                total_changes += changes
                print(f"{rel_path}: {changes} changes")

    print()
    print(f"{'[DRY RUN] ' if args.dry_run else ''}Total: {total_changes} changes in {files_changed} files")


if __name__ == '__main__':
    main()
