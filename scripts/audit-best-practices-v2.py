#!/usr/bin/env python3
"""
Audit skills against BEST-PRACTICES.md rules.

Checks:
1. SKILL.md body < 500 lines
2. Description quality (third person, specific triggers, <1024 chars)
3. Naming conventions (lowercase, hyphens, gerund preferred)
4. Structure (references one level deep, TOC for >100 lines)
5. Verbose patterns ("you should", "this is/means/allows")
6. Time-sensitive info (dates, version-specific content)
7. Path style (Unix forward slashes)
8. Package dependencies declared
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Issue:
    severity: str  # "error", "warning", "suggestion"
    rule: str
    message: str
    line: Optional[int] = None


@dataclass
class SkillAudit:
    skill_path: str
    plugin: str
    skill_name: str
    line_count: int = 0
    issues: list = field(default_factory=list)

    def add(self, severity: str, rule: str, message: str, line: int = None):
        self.issues.append(Issue(severity, rule, message, line))


# Patterns to detect
VERBOSE_PATTERNS = [
    (r"\byou should\b", "verbose: 'you should'"),
    (r"\byou need to\b", "verbose: 'you need to'"),
    (r"\byou must\b", "verbose: 'you must'"),
    (r"\byou can\b", "verbose: 'you can'"),
    (r"\bthis is\b", "verbose: 'this is'"),
    (r"\bthis means\b", "verbose: 'this means'"),
    (r"\bthis allows\b", "verbose: 'this allows'"),
    (r"\bin order to\b", "verbose: 'in order to'"),
    (r"\bI can help\b", "first-person: 'I can help'"),
    (r"\bI will\b", "first-person: 'I will'"),
]

FIRST_PERSON_DESC = [
    r"\bI can\b",
    r"\bI help\b",
    r"\bI will\b",
    r"\bI am\b",
]

SECOND_PERSON_DESC = [
    r"\byou can use\b",
    r"\bhelp you\b",
    r"\byour\b",
]

TIME_SENSITIVE_PATTERNS = [
    (r"\b(before|after|until|since)\s+\w+\s+20\d{2}\b", "time-sensitive date reference"),
    (r"\bversion\s+\d+\.\d+\b.*deprecated", "version-specific deprecation"),
    (r"\b20\d{2}-\d{2}\b", "date reference (YYYY-MM)"),
]

# Match actual Windows file paths like C:\Users\file or .\scripts\run.py
# Exclude: hex escapes (\xFF), escape sequences (\n), PHP namespaces (Namespace\Class)
# Only match paths that start with drive letter or dots
WINDOWS_PATH = re.compile(r"(?:[A-Z]:|\.\.?)\\[a-zA-Z][a-zA-Z0-9_-]*\\[a-zA-Z][a-zA-Z0-9_.-]*")


def count_body_lines(content: str) -> int:
    """Count lines after frontmatter."""
    lines = content.split("\n")
    in_frontmatter = False
    body_start = 0

    for i, line in enumerate(lines):
        if i == 0 and line.strip() == "---":
            in_frontmatter = True
            continue
        if in_frontmatter and line.strip() == "---":
            body_start = i + 1
            break

    return len(lines) - body_start


def extract_description(content: str) -> str:
    """Extract description from frontmatter."""
    match = re.search(r"description:\s*['\"]?(.+?)['\"]?\s*(?:\n[a-z]|\n---)", content, re.DOTALL)
    if match:
        desc = match.group(1).strip()
        # Handle multi-line descriptions
        desc = re.sub(r"\s+", " ", desc)
        return desc

    # Try multiline format
    match = re.search(r"description:\s*[|>]-?\s*\n((?:\s+.+\n?)+)", content)
    if match:
        desc = match.group(1).strip()
        desc = re.sub(r"\s+", " ", desc)
        return desc

    return ""


def extract_name(content: str) -> str:
    """Extract name from frontmatter."""
    match = re.search(r"name:\s*(.+)", content)
    return match.group(1).strip() if match else ""


def has_toc(content: str) -> bool:
    """Check if file has table of contents."""
    toc_patterns = [
        r"##\s*contents\b",
        r"##\s*table of contents\b",
        r"\*\s*\[.+\]\(#",  # Markdown link to anchor
    ]
    return any(re.search(p, content, re.IGNORECASE) for p in toc_patterns)


def check_nested_refs(skill_dir: Path) -> list:
    """Check for deeply nested references (refs that link to other refs)."""
    issues = []
    refs_dir = skill_dir / "references"
    if not refs_dir.exists():
        return issues

    for ref_file in refs_dir.glob("*.md"):
        content = ref_file.read_text()
        # Check if this reference file links to other reference files
        if re.search(r"\]\(references/", content) or re.search(r"\]\(\./", content):
            issues.append(f"Nested reference in {ref_file.name}")

    return issues


def audit_skill(skill_dir: Path, plugin: str) -> SkillAudit:
    """Audit a single skill directory."""
    skill_file = skill_dir / "SKILL.md"
    if not skill_file.exists():
        return None

    content = skill_file.read_text()
    audit = SkillAudit(
        skill_path=str(skill_dir),
        plugin=plugin,
        skill_name=skill_dir.name,
        line_count=count_body_lines(content)
    )

    # 1. Check line count
    if audit.line_count > 500:
        audit.add("error", "length", f"Body has {audit.line_count} lines (max 500)")
    elif audit.line_count > 400:
        audit.add("warning", "length", f"Body approaching limit: {audit.line_count} lines")

    # 2. Check description
    desc = extract_description(content)
    if not desc:
        audit.add("error", "description", "Missing description")
    else:
        if len(desc) > 1024:
            audit.add("error", "description", f"Description too long: {len(desc)} chars (max 1024)")
        if len(desc) < 50:
            audit.add("warning", "description", f"Description too short: {len(desc)} chars")

        # Check for first person
        for pattern in FIRST_PERSON_DESC:
            if re.search(pattern, desc, re.IGNORECASE):
                audit.add("error", "description", "Uses first person (should be third person)")
                break

        # Check for second person
        for pattern in SECOND_PERSON_DESC:
            if re.search(pattern, desc, re.IGNORECASE):
                audit.add("warning", "description", "Uses second person (prefer third person)")
                break

        # Check for trigger phrases
        trigger_words = ["use when", "trigger", "use for", "apply when", "for tasks"]
        if not any(w in desc.lower() for w in trigger_words):
            audit.add("suggestion", "description", "Consider adding trigger conditions (e.g., 'Use when...')")

    # 3. Check naming
    name = extract_name(content)
    if not name:
        audit.add("error", "naming", "Missing name in frontmatter")
    else:
        if not re.match(r"^[a-z0-9-]+$", name):
            audit.add("error", "naming", f"Invalid name '{name}' - use lowercase, numbers, hyphens only")
        if len(name) > 64:
            audit.add("error", "naming", f"Name too long: {len(name)} chars (max 64)")
        # Check for gerund form (suggestion only)
        if not (name.endswith("-ing") or "-ing-" in name):
            # This is just a suggestion, not an error
            pass

    # 4. Check structure - TOC for long files
    if audit.line_count > 100 and not has_toc(content):
        audit.add("suggestion", "structure", "Long file without table of contents")

    # Check for nested references
    nested = check_nested_refs(skill_dir)
    for issue in nested:
        audit.add("warning", "structure", issue)

    # 5. Check for verbose patterns in content
    lines = content.split("\n")
    verbose_counts = defaultdict(int)
    for i, line in enumerate(lines, 1):
        for pattern, label in VERBOSE_PATTERNS:
            if re.search(pattern, line, re.IGNORECASE):
                verbose_counts[label] += 1

    for label, count in verbose_counts.items():
        if count >= 3:
            audit.add("warning", "verbose", f"{label} found {count}x")

    # 6. Check for time-sensitive content
    for i, line in enumerate(lines, 1):
        for pattern, label in TIME_SENSITIVE_PATTERNS:
            if re.search(pattern, line, re.IGNORECASE):
                audit.add("warning", "time-sensitive", f"{label} on line {i}")

    # 7. Check for Windows paths
    for i, line in enumerate(lines, 1):
        if WINDOWS_PATH.search(line):
            audit.add("error", "paths", f"Windows-style path on line {i}")

    # 8. Check for package dependencies (only for real third-party imports)
    STDLIB_MODULES = {
        'abc', 'argparse', 'ast', 'asyncio', 'base64', 'collections', 'concurrent',
        'contextlib', 'copy', 'csv', 'dataclasses', 'datetime', 'decimal', 'difflib',
        'email', 'enum', 'functools', 'glob', 'hashlib', 'heapq', 'html', 'http',
        'importlib', 'inspect', 'io', 'itertools', 'json', 'logging', 'math',
        'multiprocessing', 'operator', 'os', 'pathlib', 'pickle', 'platform',
        'pprint', 'queue', 're', 'secrets', 'shutil', 'signal', 'socket', 'sqlite3',
        'ssl', 'string', 'struct', 'subprocess', 'sys', 'tempfile', 'textwrap',
        'threading', 'time', 'timeit', 'traceback', 'types', 'typing', 'unittest',
        'urllib', 'uuid', 'warnings', 'weakref', 'xml', 'zipfile', 'zlib'
    }

    if "pip install" in content or "npm install" in content or "## Installation" in content:
        pass  # Good - dependencies declared
    elif "dependencies" not in content.lower() and "requirements" not in content.lower():
        # Look for real Python imports (not prose)
        import_matches = re.findall(r'(?:^|\n)\s*(?:from\s+(\w+)|import\s+(\w+))', content)
        third_party_imports = set()
        for from_mod, import_mod in import_matches:
            mod = from_mod or import_mod
            if mod and mod.lower() not in STDLIB_MODULES and mod not in ('data', 'future', 'them', 'existing', 'file', 'context', 'system'):
                third_party_imports.add(mod)

        if third_party_imports:
            audit.add("suggestion", "deps", f"May need install instructions for: {', '.join(sorted(third_party_imports)[:3])}")

    return audit


def audit_plugin(skills_dir: Path, plugin: str) -> list:
    """Audit all skills in a plugin."""
    plugin_dir = skills_dir / plugin
    if not plugin_dir.exists():
        return []

    audits = []
    for skill_dir in sorted(plugin_dir.iterdir()):
        if skill_dir.is_dir():
            audit = audit_skill(skill_dir, plugin)
            if audit:
                audits.append(audit)

    return audits


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Audit skills against BEST-PRACTICES.md")
    parser.add_argument("--plugin", help="Audit specific plugin only")
    parser.add_argument("--skill", help="Audit specific skill only (requires --plugin)")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--errors-only", action="store_true", help="Show only errors")
    args = parser.parse_args()

    skills_dir = Path("skills")
    if not skills_dir.exists():
        print("Error: skills/ directory not found")
        return 1

    # Collect all audits
    all_audits = []

    if args.plugin:
        if args.skill:
            skill_dir = skills_dir / args.plugin / args.skill
            audit = audit_skill(skill_dir, args.plugin)
            if audit:
                all_audits.append(audit)
        else:
            all_audits.extend(audit_plugin(skills_dir, args.plugin))
    else:
        for plugin_dir in sorted(skills_dir.iterdir()):
            if plugin_dir.is_dir():
                all_audits.extend(audit_plugin(skills_dir, plugin_dir.name))

    # Filter if needed
    if args.errors_only:
        for audit in all_audits:
            audit.issues = [i for i in audit.issues if i.severity == "error"]
        all_audits = [a for a in all_audits if a.issues]

    # Output
    if args.json:
        output = []
        for audit in all_audits:
            output.append({
                "plugin": audit.plugin,
                "skill": audit.skill_name,
                "lines": audit.line_count,
                "issues": [
                    {"severity": i.severity, "rule": i.rule, "message": i.message}
                    for i in audit.issues
                ]
            })
        print(json.dumps(output, indent=2))
    else:
        # Group by plugin
        by_plugin = defaultdict(list)
        for audit in all_audits:
            by_plugin[audit.plugin].append(audit)

        total_errors = 0
        total_warnings = 0
        total_suggestions = 0

        print("=" * 70)
        print("BEST PRACTICES AUDIT")
        print("=" * 70)

        for plugin in sorted(by_plugin.keys()):
            plugin_audits = by_plugin[plugin]
            plugin_issues = [i for a in plugin_audits for i in a.issues]

            if not plugin_issues:
                continue

            errors = sum(1 for i in plugin_issues if i.severity == "error")
            warnings = sum(1 for i in plugin_issues if i.severity == "warning")
            suggestions = sum(1 for i in plugin_issues if i.severity == "suggestion")

            total_errors += errors
            total_warnings += warnings
            total_suggestions += suggestions

            print(f"\n## {plugin.upper()} ({errors} errors, {warnings} warnings, {suggestions} suggestions)")
            print("-" * 70)

            for audit in plugin_audits:
                if not audit.issues:
                    continue

                print(f"\n{audit.skill_name} ({audit.line_count} lines):")
                for issue in audit.issues:
                    icon = {"error": "✗", "warning": "⚠", "suggestion": "○"}[issue.severity]
                    print(f"  {icon} [{issue.rule}] {issue.message}")

        print("\n" + "=" * 70)
        print(f"SUMMARY: {total_errors} errors, {total_warnings} warnings, {total_suggestions} suggestions")
        print(f"Skills audited: {len(all_audits)}")
        print("=" * 70)

        # Top issues
        issue_counts = defaultdict(int)
        for audit in all_audits:
            for issue in audit.issues:
                issue_counts[f"{issue.rule}: {issue.message.split(':')[0]}"] += 1

        if issue_counts:
            print("\nTOP ISSUES:")
            for issue, count in sorted(issue_counts.items(), key=lambda x: -x[1])[:10]:
                print(f"  {count:3}x  {issue}")

    return 1 if total_errors > 0 else 0


if __name__ == "__main__":
    exit(main())
