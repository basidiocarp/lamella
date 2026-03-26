#!/usr/bin/env python3
"""Compile and smoke-test bundled Python scripts in a Lamella skill."""

from __future__ import annotations

import argparse
import json
import py_compile
import subprocess
import sys
from pathlib import Path


def collect_python_scripts(skill_path: Path) -> list[Path]:
    scripts_dir = skill_path / "scripts"
    if not scripts_dir.exists():
        return []
    return sorted(scripts_dir.glob("*.py"))


def test_script(script: Path, timeout: int) -> dict[str, object]:
    result: dict[str, object] = {
        "script": str(script),
        "compile": False,
        "help": False,
        "warnings": [],
    }

    try:
        py_compile.compile(str(script), doraise=True)
        result["compile"] = True
    except py_compile.PyCompileError as exc:
        result["warnings"].append(str(exc))
        return result

    try:
        completed = subprocess.run(
            [sys.executable, str(script), "--help"],
            capture_output=True,
            text=True,
            timeout=timeout,
            check=False,
        )
        result["help"] = completed.returncode == 0
        if completed.returncode != 0:
            result["warnings"].append(f"'--help' exited with {completed.returncode}")
    except subprocess.TimeoutExpired:
        result["warnings"].append("'--help' timed out")

    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Test bundled Python scripts for a Lamella skill.")
    parser.add_argument("skill_path", help="Path to the skill directory")
    parser.add_argument("--timeout", type=int, default=10, help="Per-script help timeout in seconds")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON")
    args = parser.parse_args()

    skill_path = Path(args.skill_path)
    reports = [test_script(script, args.timeout) for script in collect_python_scripts(skill_path)]
    ok = all(item["compile"] for item in reports)

    payload = {"skill": str(skill_path), "ok": ok, "scripts": reports}
    if args.json:
        print(json.dumps(payload, indent=2))
    else:
        print(f"=== PYTHON SCRIPT TESTS: {'PASS' if ok else 'FAIL'} ===")
        print(f"Skill: {skill_path}")
        if not reports:
            print("- No Python scripts found.")
        for item in reports:
            print(f"- {item['script']}")
            print(f"  compile: {'PASS' if item['compile'] else 'FAIL'}")
            print(f"  help: {'PASS' if item['help'] else 'WARN'}")
            for warning in item["warnings"]:
                print(f"  warning: {warning}")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
