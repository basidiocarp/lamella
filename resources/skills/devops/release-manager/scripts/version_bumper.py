#!/usr/bin/env python3
"""Recommend the next semantic version from conventional commit input."""

from __future__ import annotations

import argparse
import re
import sys

HEADER_RE = re.compile(r"^([a-z]+)(?:\([^)]+\))?(!)?:\s+(.+)$", re.IGNORECASE)


def parse_version(version: str) -> tuple[int, int, int]:
    cleaned = version.lstrip("v")
    parts = cleaned.split(".")
    if len(parts) != 3:
        raise ValueError(f"Invalid version: {version}")
    return int(parts[0]), int(parts[1]), int(parts[2])


def determine_bump(lines: list[str]) -> str:
    level = "none"
    for line in lines:
        match = HEADER_RE.match(line.strip())
        if not match:
            continue
        commit_type, breaking, _description = match.group(1).lower(), match.group(2), match.group(3)
        if breaking:
            return "major"
        if commit_type == "feat":
            level = "minor" if level != "major" else level
        elif commit_type in {"fix", "perf", "security"} and level == "none":
            level = "patch"
    return level


def bump_version(version: tuple[int, int, int], bump: str) -> tuple[int, int, int]:
    major, minor, patch = version
    if bump == "major":
        return major + 1, 0, 0
    if bump == "minor":
        return major, minor + 1, 0
    if bump == "patch":
        return major, minor, patch + 1
    return version


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Recommend semantic version bumps from conventional commits.")
    parser.add_argument("--current-version", required=True, help="Current version, such as 1.3.2")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        current = parse_version(args.current_version)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    lines = [line for line in sys.stdin.read().splitlines() if line.strip()]
    bump = determine_bump(lines)
    next_version = bump_version(current, bump)

    print(f"current_version: {args.current_version.lstrip('v')}")
    print(f"recommended_bump: {bump}")
    print(f"next_version: {'.'.join(str(part) for part in next_version)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
