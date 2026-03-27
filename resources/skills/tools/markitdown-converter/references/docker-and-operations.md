# Docker and Operations

Use this reference when MarkItDown runs inside repeatable build or conversion
environments.

## Docker Usage

```bash
docker build -t markitdown:latest .
docker run --rm -i markitdown:latest < document.pdf > output.md
```

## Operational Rules

- mount or stream input files explicitly
- keep provider credentials outside the image
- prefer deterministic image tags in CI
