#!/usr/bin/env python3
"""Build a small SOC 2 control matrix from selected Trust Service Criteria categories."""

from __future__ import annotations

import argparse
import csv
import json
import sys


TSC = {
    "security": [
        ("CC6.1", "Logical access security", "Preventive", "Continuous", "IAM configuration, SSO, MFA settings"),
        ("CC6.4", "Periodic access review", "Detective", "Quarterly", "Access review report and sign-off"),
        ("CC7.1", "Vulnerability management", "Detective", "Weekly", "Scanner results and remediation tracking"),
        ("CC7.4", "Incident response", "Corrective", "As needed", "Incident ticket and response timeline"),
        ("CC8.1", "Change management", "Preventive", "Continuous", "Change ticket, review, and deployment log"),
    ],
    "availability": [
        ("A1.1", "Capacity and performance management", "Detective", "Continuous", "Capacity dashboard and alerting"),
        ("A1.2", "Backup and recovery", "Preventive", "Daily", "Backup logs and restore test records"),
    ],
    "confidentiality": [
        ("C1.2", "Confidential data protection", "Preventive", "Continuous", "Encryption configuration and access restrictions"),
    ],
    "processing-integrity": [
        ("PI1.1", "Processing accuracy", "Detective", "Continuous", "Validation rules and reconciliation checks"),
    ],
    "privacy": [
        ("P5.1", "Access rights", "Corrective", "As needed", "DSAR request log and response evidence"),
    ],
}


def build_rows(categories: list[str]) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for category in categories:
        for idx, (tsc, description, control_type, frequency, evidence) in enumerate(TSC.get(category, []), start=1):
            rows.append(
                {
                    "control_id": f"{category[:3].upper()}-{idx:03d}",
                    "category": category,
                    "tsc_criteria": tsc,
                    "description": description,
                    "control_type": control_type,
                    "frequency": frequency,
                    "evidence_required": evidence,
                    "owner": "TBD",
                    "status": "not_started",
                }
            )
    return rows


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--categories", required=True, help="Comma-separated categories such as security,availability")
    parser.add_argument("--format", choices=("json", "csv"), default="json")
    args = parser.parse_args()

    categories = [item.strip() for item in args.categories.split(",") if item.strip()]
    rows = build_rows(categories)

    if args.format == "json":
        json.dump({"controls": rows}, sys.stdout, indent=2)
        sys.stdout.write("\n")
        return 0

    writer = csv.DictWriter(sys.stdout, fieldnames=list(rows[0].keys()) if rows else [])
    writer.writeheader()
    writer.writerows(rows)
    return 0


if __name__ == "__main__":
  raise SystemExit(main())
