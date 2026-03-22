# Common Patterns for Scientific Computing

## Machine Learning Model Inference

### Basic Model Serving

```python
import modal

app = modal.App("ml-inference")

image = (
// ... (23 lines trimmed)
    model = Model()
    result = model.predict.remote("Hello world")
    print(result)
```

### Model Serving with Volume

```python
volume = modal.Volume.from_name("models", create_if_missing=True)
MODEL_PATH = "/models"

@app.cls(
    image=image,
// ... (12 lines trimmed)
        import torch
        with torch.no_grad():
            return self.model(torch.tensor(data)).tolist()
```

## Batch Processing

### Parallel Data Processing

```python
@app.function(
    image=modal.Image.debian_slim().uv_pip_install("pandas", "numpy"),
    cpu=2.0,
    memory=8192
)
// ... (16 lines trimmed)
    # Process 100 batches in parallel
    results = list(process_batch.map(range(100)))
    print(f"Processed {len(results)} batches")
```

### Batch Processing with Progress

```python
@app.function()
def process_item(item_id: int):
    # Expensive processing
    result = compute_something(item_id)
    return result
// ... (10 lines trimmed)
            print(f"Completed {i + 1}/{len(items)}")

    print("All items processed!")
```

## Data Analysis Pipeline

### ETL Pipeline

```python
volume = modal.Volume.from_name("data-pipeline")
DATA_PATH = "/data"

@app.function(
    image=modal.Image.debian_slim().uv_pip_install("pandas", "polars"),
// ... (28 lines trimmed)
def daily_pipeline():
    result = extract_transform_load.remote()
    print(f"Processed data shape: {result}")
```

## GPU-Accelerated Computing

### Distributed Training

```python
@app.function(
    gpu="A100:2",
    image=modal.Image.debian_slim().uv_pip_install("torch", "accelerate"),
    timeout=7200,
)
// ... (17 lines trimmed)
            print(f"Epoch {epoch}, Loss: {loss}")

    return "Training complete"
```

### GPU Batch Inference

```python
@app.function(
    gpu="L40S",
    image=modal.Image.debian_slim().uv_pip_install("torch", "transformers")
)
def batch_inference(texts: list[str]):
// ... (18 lines trimmed)
        all_results.extend(results)

    print(f"Processed {len(all_results)} texts")
```

## Scientific Computing

### Molecular Dynamics Simulation

```python
@app.function(
    image=modal.Image.debian_slim().apt_install("openmpi-bin").uv_pip_install("mpi4py", "numpy"),
    cpu=16.0,
    memory=65536,
    timeout=7200,
// ... (16 lines trimmed)
            print(f"Step {step}, Energy: {energy}")

    return positions, velocities
```

### Distributed Monte Carlo

```python
@app.function(cpu=2.0)
def monte_carlo_trial(trial_id: int, n_samples: int):
    import random

    count = sum(1 for _ in range(n_samples)
// ... (17 lines trimmed)

    pi_estimate = 4 * total_count / total_samples
    print(f"Estimated π = {pi_estimate}")
```

## Data Processing with Volumes

### Image Processing Pipeline

```python
volume = modal.Volume.from_name("images")
IMAGE_PATH = "/images"

@app.function(
    image=modal.Image.debian_slim().uv_pip_install("Pillow", "numpy"),
// ... (28 lines trimmed)

    volume.commit()
    return f"Processed {len(results)} images"
```

## Web API for Scientific Computing

```python
image = modal.Image.debian_slim().uv_pip_install("fastapi[standard]", "numpy", "scipy")

@app.function(image=image)
@modal.fastapi_endpoint(method="POST")
def compute_statistics(data: dict):
// ... (9 lines trimmed)
        "skewness": float(stats.skew(values)),
        "kurtosis": float(stats.kurtosis(values))
    }
```

## Scheduled Data Collection

```python
@app.function(
    schedule=modal.Cron("*/30 * * * *"),  # Every 30 minutes
    secrets=[modal.Secret.from_name("api-keys")],
    volumes={"/data": modal.Volume.from_name("sensor-data")}
)
// ... (18 lines trimmed)
    volume.commit()

    return f"Collected {len(data)} sensor readings"
```

## Best Practices

### Use Classes for Stateful Workloads

```python
@app.cls(gpu="A100")
class ModelService:
    @modal.enter()
    def setup(self):
        # Load once, reuse across requests
        self.model = load_heavy_model()

    @modal.method()
    def predict(self, x):
        return self.model(x)
```

### Batch Similar Workloads

```python
@app.function()
def process_many(items: list):
    # More efficient than processing one at a time
    return [process(item) for item in items]
```

### Use Volumes for Large Datasets

```python
# Store large datasets in volumes, not in image
volume = modal.Volume.from_name("dataset")

@app.function(volumes={"/data": volume})
def train():
    data = load_from_volume("/data/training.parquet")
    model = train_model(data)
```

### Profile Before Scaling to GPUs

```python
# Test on CPU first
@app.function(cpu=4.0)
def test_pipeline():
    ...

# Then scale to GPU if needed
@app.function(gpu="A100")
def gpu_pipeline():
    ...
```
