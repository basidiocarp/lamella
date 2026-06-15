#!/usr/bin/env python3
"""Assess release readiness from a small JSON release plan."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def load_plan(path: str) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def assess(plan: dict) -> dict:
    features = plan.get("features", [])
    quality_gates = plan.get("quality_gates", [])

    blockers: list[str] = []
    warnings: list[str] = []

    ready_features = 0
    for feature in features:
        title = feature.get("title", feature.get("id", "unnamed feature"))
        status = feature.get("status", "pending")
        if status == "ready":
            ready_features += 1
        elif status == "blocked":
            blockers.append(f"{title} is blocked")
        else:
            warnings.append(f"{title} is {status}")

        for field, label in [("pm_approved", "PM"), ("qa_approved", "QA")]:
            if feature.get(field) is False:
                blockers.append(f"{title} is missing {label} approval")

        if feature.get("requires_migration") and not feature.get("migration_notes"):
            warnings.append(f"{title} requires migration notes")

    passed_gates = 0
    for gate in quality_gates:
        name = gate.get("name", "Unnamed gate")
        status = gate.get("status", "pending")
        required = gate.get("required", True)
        if status == "ready":
            passed_gates += 1
        elif required:
            blockers.append(f"Required gate failed or pending: {name}")
        else:
            warnings.append(f"Optional gate not ready: {name}")

    overall = "ready"
    if blockers:
        overall = "blocked"
    elif warnings:
        overall = "at_risk"

    return {
        "overall_status": overall,
        "features_total": len(features),
        "features_ready": ready_features,
        "quality_gates_total": len(quality_gates),
        "quality_gates_ready": passed_gates,
        "blockers": blockers,
        "warnings": warnings,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Assess release readiness from a JSON plan.")
    parser.add_argument("--input", required=True, help="Path to release plan JSON")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    report = assess(load_plan(args.input))
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
