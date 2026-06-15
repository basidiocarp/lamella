#!/usr/bin/env python3
"""Generate a markdown changelog from conventional commit input."""

from __future__ import annotations

import argparse
import re
import sys
from collections import defaultdict
from datetime import datetime

HEADER_RE = re.compile(r"^([a-z]+)(?:\(([^)]+)\))?(!)?:\s+(.+)$", re.IGNORECASE)
CATEGORY_ORDER = ["Breaking Changes", "Added", "Changed", "Removed", "Fixed", "Security"]


def parse_commit(line: str) -> dict | None:
    match = HEADER_RE.match(line.strip())
    if not match:
        return None
    commit_type, scope, breaking, description = match.groups()
    mapping = {
        "feat": "Added",
        "fix": "Fixed",
        "perf": "Fixed",
        "security": "Security",
        "refactor": "Changed",
        "docs": "Changed",
        "remove": "Removed",
        "deprecate": "Changed",
    }
    category = "Breaking Changes" if breaking else mapping.get(commit_type.lower())
    if not category:
        return None
    return {
        "category": category,
        "scope": scope or "",
        "description": description.strip(),
    }


def render(version: str, commits: list[dict]) -> str:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for commit in commits:
        grouped[commit["category"]].append(commit)

    lines = [f"## [{version}] - {datetime.now().strftime('%Y-%m-%d')}", ""]
    for category in CATEGORY_ORDER:
        if category not in grouped:
            continue
        lines.append(f"### {category}")
        for commit in grouped[category]:
            prefix = f"{commit['scope']}: " if commit["scope"] else ""
            lines.append(f"- {prefix}{commit['description']}")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate changelog text from conventional commits.")
    parser.add_argument("--version", default="Unreleased", help="Version label for this section")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    lines = [line for line in sys.stdin.read().splitlines() if line.strip()]
    commits = [parsed for line in lines if (parsed := parse_commit(line))]
    if not commits:
        print("No release-relevant conventional commits found.", file=sys.stderr)
        return 1
    print(render(args.version, commits))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
