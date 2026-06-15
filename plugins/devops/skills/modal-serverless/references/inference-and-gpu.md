# Inference and GPU Workloads

## Basic Model Serving

```python
import modal

image = modal.Image.debian_slim(python_version="3.12").uv_pip_install("torch")
app = modal.App("ml-inference", image=image)

@app.cls(gpu="L40S")
class ModelService:
    @modal.enter()
    def setup(self):
        self.model = load_model()

    @modal.method()
    def predict(self, text: str):
        return self.model(text)
```

## GPU Selection

- `T4` or `L4` for lighter inference
- `L40S` for strong inference balance
- `A100` or `H100` for large training or heavy batch inference

## Review Checklist

- model loads once per container
- GPU type matches memory needs
- timeouts match cold-start and runtime reality
