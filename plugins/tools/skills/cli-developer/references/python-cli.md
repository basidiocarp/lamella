# Python CLI Development

## Typer (Recommended)

```python
#!/usr/bin/env python3
from enum import Enum
from pathlib import Path

import typer

app = typer.Typer(help="Example Python CLI")


class Format(str, Enum):
    json = "json"
    text = "text"


@app.command()
def greet(
    name: str,
    config: Path | None = typer.Option(None, "--config"),
    output: Format = typer.Option(Format.text, "--output"),
) -> None:
    if config and not config.exists():
        raise typer.BadParameter(f"config not found: {config}")

    if output is Format.json:
        typer.echo({"message": f"hello {name}"})
    else:
        typer.echo(f"hello {name}")


if __name__ == "__main__":
    app()
```

## Click

```python
import click


@click.group()
@click.version_option()
def cli() -> None:
    """Example Click CLI."""


@cli.command()
@click.argument("name")
@click.option("--verbose", is_flag=True)
def greet(name: str, verbose: bool) -> None:
    if verbose:
        click.echo(f"greeting user={name}", err=True)
    click.echo(f"hello {name}")


if __name__ == "__main__":
    cli()
```

## Rich Terminal Output

```python
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table

console = Console()

table = Table(title="Tasks")
table.add_column("Name")
table.add_column("Status")
table.add_row("build", "ready")
table.add_row("test", "pending")
console.print(table)

with Progress(SpinnerColumn(), TextColumn("{task.description}")) as progress:
    task = progress.add_task("Installing dependencies...", total=None)
    console.log("running install")
    progress.remove_task(task)
```

## Interactive Prompts

```python
import questionary

name = questionary.text("Project name:").ask()
framework = questionary.select(
    "Framework:",
    choices=["typer", "click", "argparse"],
).ask()
confirmed = questionary.confirm("Create files now?").ask()
```

## Argparse

```python
import argparse

parser = argparse.ArgumentParser(description="Example argparse CLI")
parser.add_argument("name")
parser.add_argument("--verbose", action="store_true")
args = parser.parse_args()

if args.verbose:
    print(f"greeting user={args.name}")
print(f"hello {args.name}")
```

## Error Handling

```python
from pathlib import Path

import typer

app = typer.Typer()


@app.command()
def read_config(path: Path) -> None:
    try:
        typer.echo(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        typer.echo(f"config not found: {path}", err=True)
        raise typer.Exit(code=1)
```

## Configuration Management

```python
from pathlib import Path
import json
import os


def load_config() -> dict[str, object]:
    config_path = Path(os.environ.get("MYCLI_CONFIG", "config.json"))
    if config_path.exists():
        return json.loads(config_path.read_text(encoding="utf-8"))
    return {"verbose": False, "timeout": 30}
```

## `pyproject.toml`

```toml
[project]
name = "mycli"
version = "0.1.0"
dependencies = ["typer>=0.12", "rich>=13.0"]

[project.scripts]
mycli = "mycli.cli:app"

[tool.pytest.ini_options]
addopts = "-q"
```

## Testing CLIs

```python
from typer.testing import CliRunner
from mycli.cli import app

runner = CliRunner()


def test_greet() -> None:
    result = runner.invoke(app, ["greet", "alice"])
    assert result.exit_code == 0
    assert "hello alice" in result.stdout
```

## Progress Bars

```python
from tqdm import tqdm
import time

for _ in tqdm(range(5), desc="Processing"):
    time.sleep(0.05)
```
