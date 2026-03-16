# Python CLI Development

## Typer (Recommended - Modern)

FastAPI-style CLI framework with automatic help generation.

```python
#!/usr/bin/env python3
import typer
from typing import Optional
from enum import Enum

// ... (44 lines trimmed)

if __name__ == "__main__":
    app()
```

## Click (Widely Used)

Powerful, composable CLI framework.

```python
import click

@click.group()
@click.version_option()
def cli():
// ... (40 lines trimmed)

if __name__ == '__main__':
    cli()
```

## Rich Terminal Output

Beautiful terminal formatting and progress indicators.

```python
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.panel import Panel
from rich.syntax import Syntax
// ... (45 lines trimmed)
) as progress:
    task = progress.add_task("Installing dependencies...")
    install_dependencies()
```

## Interactive Prompts (questionary)

```python
import questionary

# Text input
name = questionary.text(
    "Project name:",
// ... (30 lines trimmed)

# Password
password = questionary.password("Enter password:").ask()
```

## Argparse (Standard Library)

Built-in argument parsing (verbose but no dependencies).

```python
import argparse
import sys

def main():
    parser = argparse.ArgumentParser(
// ... (29 lines trimmed)

if __name__ == '__main__':
    main()
```

## Error Handling

```python
import typer
import sys
from pathlib import Path

app = typer.Typer()
// ... (26 lines trimmed)

if __name__ == "__main__":
    main()
```

## Configuration Management

```python
from pathlib import Path
from typing import Any
import json
import os

// ... (28 lines trimmed)
            "verbose": False,
            "timeout": 30,
        }
```

## Setup.py / pyproject.toml

```toml
# pyproject.toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

// ... (16 lines trimmed)
    "pytest>=7.0.0",
    "pytest-cov>=4.0.0",
]
```

## Testing CLIs

```python
from typer.testing import CliRunner
from mycli.cli import app

runner = CliRunner()

// ... (15 lines trimmed)
def test_invalid_command():
    result = runner.invoke(app, ["invalid"])
    assert result.exit_code != 0
```

## Progress Bars (tqdm)

```python
from tqdm import tqdm
import time

# Simple progress bar
for i in tqdm(range(100), desc="Processing"):
// ... (10 lines trimmed)
for epoch in trange(10, desc="Epochs"):
    for batch in trange(100, desc="Batches", leave=False):
        train_batch(batch)
```
