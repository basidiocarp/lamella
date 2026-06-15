# Modal Images

Modal Images define the environment your code runs in.

## Common Pattern

```python
image = (
    modal.Image.debian_slim(python_version="3.13")
    .apt_install("git")
    .uv_pip_install("torch==2.8.0")
    .env({"PORT": "6443"})
)
```

## Common Operations

- install Python packages with `uv_pip_install`
- install system packages with `apt_install`
- add environment variables with `.env()`
- run setup commands with `.run_commands()`
- add local source with `.add_local_python_source()`

## Other Sources

- `Image.from_registry()`
- `Image.from_dockerfile()`
- `Image.micromamba()`
