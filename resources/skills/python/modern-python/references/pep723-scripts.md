# PEP 723: Inline Script Metadata

PEP 723 allows embedding dependency metadata directly in Python scripts, eliminating the need for separate `requirements.txt` or `pyproject.toml` files for simple scripts.

## When to Use PEP 723

**Use for:**
- Single-file scripts with external dependencies
- Quick automation scripts
- Utility scripts shared between projects
- Scripts that need to be self-contained

**Don't use for:**
- Multi-file projects (use `pyproject.toml`)
- Reusable packages/libraries
- Projects requiring complex configuration

## Basic Syntax

The metadata block uses TOML format embedded in a special comment:

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "requests",
#     "rich",
# ]
# ///

import requests
from rich import print

response = requests.get("https://api.example.com/data")
print(response.json())
```

## Running Scripts

```bash
# With uv (recommended)
uv run script.py

# Script handles its own dependencies automatically
./script.py  # If shebang is set
```

## Metadata Fields

### Required Python Version

```python
# /// script
# requires-python = ">=3.11"
# ///
```

### Dependencies

```python
# /// script
# dependencies = [
#     "requests",
#     "click",
#     "rich",
# ]
# ///
```

### Private Package Index

```python
# /// script
# dependencies = ["httpx"]
#
# [tool.uv]
# extra-index-url = ["https://pypi.company.com/simple/"]
# ///
```

## Complete Example

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "httpx",
// ... (35 lines trimmed)

if __name__ == "__main__":
    app()
```

## Creating Scripts with uv

```bash
# Create new script with metadata
uv init --script myscript.py

# Add dependency to existing script
uv add --script myscript.py requests

# Remove dependency from script
uv remove --script myscript.py requests
```

## Shebang Options

### Basic (requires uv in PATH)

```python
#!/usr/bin/env -S uv run --script
```

### With specific Python version

```python
#!/usr/bin/env -S uv run --python 3.12 --script
```

### Quiet mode (suppress uv output)

```python
#!/usr/bin/env -S uv run --quiet --script
```

## Examples by Use Case

### Data Processing Script

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["pandas", "openpyxl"]
# ///

import pandas as pd
import sys

df = pd.read_excel(sys.argv[1])
print(df.describe())
```

### Web Scraping Script

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["httpx", "beautifulsoup4", "lxml"]
# ///

import httpx
from bs4 import BeautifulSoup

response = httpx.get("https://example.com")
soup = BeautifulSoup(response.text, "lxml")
print(soup.title.string)
```

### CLI Tool Script

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["typer", "rich"]
# ///
// ... (9 lines trimmed)

if __name__ == "__main__":
    app()
```

### Async Script

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["httpx"]
# ///
// ... (10 lines trimmed)
            print(r.status_code)

asyncio.run(main())
```

## Best Practices

1. **Always specify `requires-python`** - Ensures compatibility
2. **Pin major versions for Python** - Use `>=3.11` not `==3.11`
3. **Omit version constraints for dependencies** - Use `uv add --script` to add dependencies; let uv select versions
4. **Keep scripts focused** - One script, one purpose
5. **Add docstring** - Document what the script does
6. **Use type hints** - Improves readability and catches errors

## Limitations

- No support for dependency groups
- No support for editable installs
- No support for local dependencies (use relative imports)
- No lockfile (versions may vary between runs)

For projects needing these features, use a full `pyproject.toml` setup instead.
