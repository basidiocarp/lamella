# FastAPI Endpoints

Use `@modal.fastapi_endpoint()` for lightweight HTTP handlers.

```python
image = modal.Image.debian_slim().pip_install("fastapi[standard]")

@app.function(image=image)
@modal.fastapi_endpoint(method="POST")
def square(item: dict):
    return {"square": item["x"] ** 2}
```

## Rules

- use typed parameters or Pydantic models for request validation
- use `modal serve` for local iteration and `modal deploy` for stable URLs
- keep handlers stateless unless you intentionally rely on Modal runtime state
