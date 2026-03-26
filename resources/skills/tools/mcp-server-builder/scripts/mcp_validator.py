#!/usr/bin/env python3
"""Validate MCP tool manifest files for common contract issues."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

TOOL_NAME_RE = re.compile(r"^[a-z0-9_]{3,64}$")


class CLIError(Exception):
    """Raised for expected CLI failures."""


@dataclass
class ValidationResult:
    errors: list[str]
    warnings: list[str]
    tool_count: int


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate MCP tool definitions.")
    parser.add_argument("--input", help="Path to manifest JSON. If omitted, reads stdin.")
    parser.add_argument("--strict", action="store_true", help="Exit non-zero when errors exist.")
    parser.add_argument("--format", choices=["text", "json"], default="text")
    return parser.parse_args()


def load_manifest(input_path: str | None) -> dict[str, Any]:
    if input_path:
        data = Path(input_path).read_text(encoding="utf-8")
    else:
        if sys.stdin.isatty():
            raise CLIError("No input provided. Use --input or pipe manifest JSON.")
        data = sys.stdin.read().strip()
        if not data:
            raise CLIError("Empty stdin.")
    payload = json.loads(data)
    if not isinstance(payload, dict):
        raise CLIError("Manifest root must be a JSON object.")
    return payload


def validate_schema(tool_name: str, schema: dict[str, Any]) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    if schema.get("type") != "object":
        errors.append(f"{tool_name}: inputSchema.type must be 'object'.")

    properties = schema.get("properties", {})
    if not isinstance(properties, dict):
        errors.append(f"{tool_name}: inputSchema.properties must be an object.")
        properties = {}

    required = schema.get("required", [])
    if not isinstance(required, list):
        errors.append(f"{tool_name}: inputSchema.required must be an array.")
        required = []

    keys = set(properties.keys())
    for field in required:
        if field not in keys:
            errors.append(f"{tool_name}: required field '{field}' is missing from properties.")

    if not properties:
        warnings.append(f"{tool_name}: no input properties declared.")

    for field_name, field_schema in properties.items():
        if not isinstance(field_schema, dict):
            errors.append(f"{tool_name}: property '{field_name}' must be an object.")
            continue
        if "type" not in field_schema:
            warnings.append(f"{tool_name}: property '{field_name}' has no explicit type.")

    return errors, warnings


def validate_manifest(payload: dict[str, Any]) -> ValidationResult:
    tools = payload.get("tools")
    if not isinstance(tools, list):
        raise CLIError("Manifest must include a tools array.")

    errors: list[str] = []
    warnings: list[str] = []
    seen_names: set[str] = set()

    for index, tool in enumerate(tools):
        if not isinstance(tool, dict):
            errors.append(f"tool[{index}] is not an object.")
            continue
        name = str(tool.get("name", "")).strip()
        description = str(tool.get("description", "")).strip()
        schema = tool.get("inputSchema")

        if not name:
            errors.append(f"tool[{index}] missing name.")
            continue
        if name in seen_names:
            errors.append(f"duplicate tool name: {name}")
        seen_names.add(name)

        if not TOOL_NAME_RE.match(name):
            warnings.append(f"{name}: prefer lowercase snake_case names.")
        if len(description) < 10:
            warnings.append(f"{name}: description is too short.")
        if not isinstance(schema, dict):
            errors.append(f"{name}: missing or invalid inputSchema object.")
            continue

        schema_errors, schema_warnings = validate_schema(name, schema)
        errors.extend(schema_errors)
        warnings.extend(schema_warnings)

    return ValidationResult(errors=errors, warnings=warnings, tool_count=len(tools))


def render_text(result: ValidationResult) -> str:
    lines = [
        "MCP manifest validation",
        f"- tools: {result.tool_count}",
        f"- errors: {len(result.errors)}",
        f"- warnings: {len(result.warnings)}",
    ]
    if result.errors:
        lines.append("Errors:")
        lines.extend(f"- {item}" for item in result.errors)
    if result.warnings:
        lines.append("Warnings:")
        lines.extend(f"- {item}" for item in result.warnings)
    return "\n".join(lines)


def main() -> int:
    args = parse_args()
    payload = load_manifest(args.input)
    result = validate_manifest(payload)

    if args.format == "json":
        print(json.dumps(asdict(result), indent=2))
    else:
        print(render_text(result))

    if args.strict and result.errors:
        return 1
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except CLIError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
