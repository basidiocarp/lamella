#!/usr/bin/env python3
"""Identify missing SOC 2 criteria coverage from a current control matrix."""

from __future__ import annotations

import argparse
import json
import sys


REQUIRED = {
    "security": {"CC6.1": "Logical access security", "CC7.1": "Vulnerability management", "CC7.4": "Incident response", "CC8.1": "Change management"},
    "availability": {"A1.1": "Capacity and performance management", "A1.2": "Backup and recovery"},
    "confidentiality": {"C1.2": "Confidential data protection"},
    "processing-integrity": {"PI1.1": "Processing accuracy"},
    "privacy": {"P5.1": "Access rights"},
}


def load_controls(path: str) -> list[dict[str, object]]:
    with open(path, "r", encoding="utf-8") as handle:
        payload = json.load(handle)
    if isinstance(payload, dict) and "controls" in payload:
        return payload["controls"]
    if isinstance(payload, list):
        return payload
    raise ValueError("Expected a JSON array or an object with a 'controls' array")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--controls", required=True)
    parser.add_argument("--categories", default="security")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    selected = [item.strip() for item in args.categories.split(",") if item.strip()]
    controls = load_controls(args.controls)
    covered = {str(control.get("tsc_criteria", "")) for control in controls}

    gaps: list[dict[str, str]] = []
    for category in selected:
        for tsc, description in REQUIRED.get(category, {}).items():
            if tsc not in covered:
                gaps.append({"category": category, "tsc_criteria": tsc, "description": description})

    if args.json:
        json.dump({"gaps": gaps}, sys.stdout, indent=2)
        sys.stdout.write("\n")
        return 0

    if not gaps:
        print("No required criteria gaps found.")
        return 0

    print("Missing SOC 2 criteria coverage:")
    for gap in gaps:
        print(f"{gap['category']}: {gap['tsc_criteria']} {gap['description']}")
    return 0


if __name__ == "__main__":
  raise SystemExit(main())
