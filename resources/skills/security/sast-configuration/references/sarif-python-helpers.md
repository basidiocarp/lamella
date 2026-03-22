# SARIF Python Helpers

## Using pysarif

```python
from pysarif import load_from_file, save_to_file

sarif = load_from_file("results.sarif")

for run in sarif.runs:
// ... (10 lines trimmed)
                    print(f"    Line: {loc.region.start_line}")

save_to_file(sarif, "modified.sarif")
```

## Using sarif-tools

```python
from sarif import loader

sarif_data = loader.load_sarif_file("results.sarif")
sarif_set = loader.load_sarif_files(["tool1.sarif", "tool2.sarif"])

report = sarif_data.get_report()
errors = report.get_issue_type_histogram_for_severity("error")
high_severity = [r for r in sarif_data.get_results() if r.get("level") == "error"]
```

## Aggregating Multiple Files

```python
import json

def aggregate_sarif_files(sarif_paths: list[str]) -> dict:
    aggregated = {
        "version": "2.1.0",
        "$schema": "https://json.schemastore.org/sarif-2.1.0.json",
        "runs": []
    }
    for path in sarif_paths:
        with open(path) as f:
            sarif = json.load(f)
            aggregated["runs"].extend(sarif.get("runs", []))
    return aggregated
```

## Deduplication

```python
def deduplicate_results(sarif: dict) -> dict:
    seen_fingerprints = set()
    for run in sarif["runs"]:
        unique_results = []
        for result in run.get("results", []):
// ... (15 lines trimmed)
                unique_results.append(result)
        run["results"] = unique_results
    return sarif
```

## Extracting Findings

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class Finding:
// ... (30 lines trimmed)
def prioritize_findings(findings: list[Finding]) -> list[Finding]:
    severity_order = {"error": 0, "warning": 1, "note": 2, "none": 3}
    return sorted(findings, key=lambda f: severity_order.get(f.level, 99))
```

## Path Normalization

```python
from urllib.parse import unquote
from pathlib import Path

def normalize_path(uri: str, base_path: str = "") -> str:
    if uri.startswith("file://"):
        uri = uri[7:]
    uri = unquote(uri)
    if not Path(uri).is_absolute() and base_path:
        uri = str(Path(base_path) / uri)
    return str(Path(uri))
```

## Stable Fingerprinting

```python
import hashlib

def compute_stable_fingerprint(result: dict, file_content: str = None) -> str:
    components = [
        result.get("ruleId", ""),
        result.get("message", {}).get("text", "")[:100],
    ]
    if file_content and result.get("locations"):
        region = result["locations"][0].get("physicalLocation", {}).get("region", {})
        if region.get("startLine"):
            lines = file_content.split("\n")
            line_idx = region["startLine"] - 1
            if 0 <= line_idx < len(lines):
                components.append(lines[line_idx].strip())
    return hashlib.sha256("".join(components).encode()).hexdigest()[:16]
```

## Safe Location Access

```python
def safe_get_location(result: dict) -> tuple[str, int]:
    try:
        loc = result.get("locations", [{}])[0]
        phys = loc.get("physicalLocation", {})
        file_path = phys.get("artifactLocation", {}).get("uri", "unknown")
        line = phys.get("region", {}).get("startLine", 0)
        return file_path, line
    except (IndexError, KeyError, TypeError):
        return "unknown", 0
```

## Streaming Large Files

```python
import ijson  # pip install ijson

def stream_results(sarif_path: str):
    with open(sarif_path, "rb") as f:
        for result in ijson.items(f, "runs.item.results.item"):
            yield result
```

## Schema Validation

```python
from jsonschema import validate, ValidationError

def validate_sarif(sarif_path: str, schema_path: str) -> bool:
    with open(sarif_path) as f:
        sarif = json.load(f)
    with open(schema_path) as f:
        schema = json.load(f)
    try:
        validate(sarif, schema)
        return True
    except ValidationError as e:
        print(f"Validation error: {e.message}")
        return False
```
