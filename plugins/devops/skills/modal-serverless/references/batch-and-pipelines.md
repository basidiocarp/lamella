# Batch and Pipeline Workloads

## Parallel Batch Processing

```python
@app.function(cpu=2.0, memory=8192)
def process_batch(batch_id: int):
    return compute_batch(batch_id)

@app.local_entrypoint()
def main():
    results = list(process_batch.map(range(100)))
    print(len(results))
```

## ETL Pattern

```python
volume = modal.Volume.from_name("data-pipeline")

@app.function(volumes={"/data": volume})
def extract_transform_load():
    data = load_input("/data/input.parquet")
    result = transform(data)
    save_output("/data/output.parquet", result)
    volume.commit()
    return result.shape
```

## Review Checklist

- batch size is coarse enough to amortize startup cost
- volumes are committed after writes
- retries are safe for partial reruns
