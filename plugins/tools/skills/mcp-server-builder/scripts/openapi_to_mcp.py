#!/usr/bin/env python3
"""Generate MCP scaffold files from an OpenAPI specification."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

HTTP_METHODS = {"get", "post", "put", "patch", "delete"}


class CLIError(Exception):
    """Raised for expected CLI failures."""


@dataclass
class GenerationSummary:
    server_name: str
    language: str
    operations_total: int
    tools_generated: int
    output_dir: str
    manifest_path: str
    scaffold_path: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate MCP server scaffolds from OpenAPI.")
    parser.add_argument("--input", help="OpenAPI file path. If omitted, reads stdin.")
    parser.add_argument("--server-name", required=True, help="MCP server name")
    parser.add_argument("--language", choices=["python", "typescript"], default="python")
    parser.add_argument("--output-dir", default=".")
    parser.add_argument("--format", choices=["text", "json"], default="text")
    return parser.parse_args()


def load_raw_input(input_path: str | None) -> str:
    if input_path:
        return Path(input_path).read_text(encoding="utf-8")
    if sys.stdin.isatty():
        raise CLIError("No input provided. Use --input or pipe an OpenAPI spec.")
    raw = sys.stdin.read().strip()
    if not raw:
        raise CLIError("Stdin was empty.")
    return raw


def parse_openapi(raw: str) -> dict[str, Any]:
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise CLIError("This Lamella script expects JSON OpenAPI input.") from exc


def sanitize_tool_name(name: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9_]+", "_", name).strip("_")
    cleaned = re.sub(r"_+", "_", cleaned)
    return cleaned.lower() or "unnamed_tool"


def schema_from_parameter(param: dict[str, Any]) -> dict[str, Any]:
    schema = param.get("schema", {})
    if not isinstance(schema, dict):
        schema = {}
    result = {"type": schema.get("type", "string"), "description": param.get("description", "")}
    if "enum" in schema:
        result["enum"] = schema["enum"]
    return result


def extract_tools(spec: dict[str, Any]) -> list[dict[str, Any]]:
    paths = spec.get("paths", {})
    if not isinstance(paths, dict):
        raise CLIError("OpenAPI spec missing a valid paths object.")

    tools: list[dict[str, Any]] = []
    for path, methods in paths.items():
        if not isinstance(methods, dict):
            continue
        for method, operation in methods.items():
            method_name = str(method).lower()
            if method_name not in HTTP_METHODS or not isinstance(operation, dict):
                continue

            name = sanitize_tool_name(str(operation.get("operationId") or f"{method_name}_{path}"))
            description = str(operation.get("summary") or operation.get("description") or f"{method_name.upper()} {path}")
            properties: dict[str, Any] = {}
            required: list[str] = []

            for param in operation.get("parameters", []):
                if not isinstance(param, dict):
                    continue
                param_name = str(param.get("name", "")).strip()
                if not param_name:
                    continue
                properties[param_name] = schema_from_parameter(param)
                if bool(param.get("required")):
                    required.append(param_name)

            request_body = operation.get("requestBody", {})
            if isinstance(request_body, dict):
                content = request_body.get("content", {})
                if isinstance(content, dict):
                    app_json = content.get("application/json", {})
                    if isinstance(app_json, dict):
                        schema = app_json.get("schema", {})
                        if isinstance(schema, dict) and schema.get("type") == "object":
                            body_props = schema.get("properties", {})
                            if isinstance(body_props, dict):
                                for key, value in body_props.items():
                                    if isinstance(value, dict):
                                        properties[key] = value
                            body_required = schema.get("required", [])
                            if isinstance(body_required, list):
                                required.extend(str(item) for item in body_required)

            tools.append(
                {
                    "name": name,
                    "description": description,
                    "inputSchema": {
                        "type": "object",
                        "properties": properties,
                        "required": sorted(set(required)),
                    },
                    "x-openapi": {"path": path, "method": method_name},
                }
            )
    return tools


def python_scaffold(server_name: str, tools: list[dict[str, Any]]) -> str:
    handlers = []
    for tool in tools:
        function_name = sanitize_tool_name(tool["name"])
        handlers.append(
            f"@mcp.tool()\ndef {function_name}(input: dict) -> dict:\n"
            f"    \"\"\"{tool['description']}\"\"\"\n"
            f"    return {{\"tool\": \"{tool['name']}\", \"status\": \"todo\", \"input\": input}}\n"
        )
    return "\n".join(
        [
            "#!/usr/bin/env python3",
            '"""Generated MCP server scaffold."""',
            "",
            "from fastmcp import FastMCP",
            "",
            f"mcp = FastMCP(name={server_name!r})",
            "",
            *handlers,
            "",
            "if __name__ == '__main__':",
            "    mcp.run()",
            "",
        ]
    )


def typescript_scaffold(server_name: str, tools: list[dict[str, Any]]) -> str:
    registrations = []
    for tool in tools:
        registrations.append(
            "server.tool(\n"
            f"  '{tool['name']}',\n"
            f"  '{tool['description']}',\n"
            "  async (input) => ({\n"
            f"    content: [{{ type: 'text', text: JSON.stringify({{ tool: '{tool['name']}', status: 'todo', input }}) }}],\n"
            "  })\n"
            ");"
        )
    return "\n".join(
        [
            "// Generated MCP server scaffold",
            "import { FastMCP } from 'fastmcp';",
            "",
            f"const server = new FastMCP({{ name: '{server_name}' }});",
            "",
            *registrations,
            "",
            "server.run();",
            "",
        ]
    )


def write_outputs(server_name: str, language: str, output_dir: Path, tools: list[dict[str, Any]]) -> GenerationSummary:
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = output_dir / "tool_manifest.json"
    manifest_path.write_text(json.dumps({"server": server_name, "tools": tools}, indent=2), encoding="utf-8")

    if language == "python":
        scaffold_path = output_dir / "server.py"
        scaffold_path.write_text(python_scaffold(server_name, tools), encoding="utf-8")
    else:
        scaffold_path = output_dir / "server.ts"
        scaffold_path.write_text(typescript_scaffold(server_name, tools), encoding="utf-8")

    return GenerationSummary(
        server_name=server_name,
        language=language,
        operations_total=len(tools),
        tools_generated=len(tools),
        output_dir=str(output_dir.resolve()),
        manifest_path=str(manifest_path.resolve()),
        scaffold_path=str(scaffold_path.resolve()),
    )


def main() -> int:
    args = parse_args()
    raw = load_raw_input(args.input)
    spec = parse_openapi(raw)
    tools = extract_tools(spec)
    if not tools:
        raise CLIError("No operations discovered in the OpenAPI spec.")

    summary = write_outputs(args.server_name, args.language, Path(args.output_dir), tools)
    if args.format == "json":
        print(json.dumps(asdict(summary), indent=2))
    else:
        print("MCP scaffold generated")
        print(f"- server: {summary.server_name}")
        print(f"- language: {summary.language}")
        print(f"- tools: {summary.tools_generated}")
        print(f"- manifest: {summary.manifest_path}")
        print(f"- scaffold: {summary.scaffold_path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except CLIError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
