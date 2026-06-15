# APIs and Schedules

## FastAPI Endpoint

```python
image = modal.Image.debian_slim().uv_pip_install("fastapi[standard]", "numpy")

@app.function(image=image)
@modal.fastapi_endpoint(method="POST")
def compute_statistics(data: dict):
    values = data["values"]
    return {"count": len(values), "mean": sum(values) / len(values)}
```

## Scheduled Collection

```python
@app.function(
    schedule=modal.Cron("*/30 * * * *"),
    secrets=[modal.Secret.from_name("api-keys")],
    volumes={"/data": modal.Volume.from_name("sensor-data")},
)
def collect_sensor_data():
    data = fetch_sensor_data()
    store_data(data)
```

## Review Checklist

- scheduled jobs are idempotent
- secrets are injected through Modal secrets, not literals
- API endpoints avoid loading heavy state on every request
