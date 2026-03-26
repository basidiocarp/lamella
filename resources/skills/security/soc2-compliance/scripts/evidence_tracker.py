#!/usr/bin/env python3
"""Summarize evidence collection status for a SOC 2 control matrix."""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter


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
    parser.add_argument("--matrix", required=True)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    controls = load_controls(args.matrix)
    counts = Counter(str(control.get("status", "not_started")).lower() for control in controls)
    total = len(controls)
    collected = counts.get("collected", 0)
    applicable = total - counts.get("not_applicable", 0)
    readiness = round((collected / applicable) * 100, 1) if applicable else 0.0

    result = {
        "total_controls": total,
        "status_breakdown": dict(counts),
        "readiness_score": readiness,
        "readiness_rating": (
            "audit_ready"
            if readiness >= 90
            else "minor_gaps"
            if readiness >= 75
            else "significant_gaps"
            if readiness >= 50
            else "not_ready"
        ),
    }

    if args.json:
        json.dump(result, sys.stdout, indent=2)
        sys.stdout.write("\n")
        return 0

    print("SOC 2 Evidence Status")
    print(f"Total controls: {total}")
    print(f"Readiness score: {readiness}%")
    for key in sorted(counts):
        print(f"{key}: {counts[key]}")
    return 0


if __name__ == "__main__":
  raise SystemExit(main())
