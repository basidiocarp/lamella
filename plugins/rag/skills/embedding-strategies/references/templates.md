# Embedding Strategy Templates

## Template 1: Voyage AI Embeddings

```python
from voyageai import Client

client = Client()

vectors = client.embed(
    texts=["Quarterly revenue summary", "Customer support playbook"],
    model="voyage-3-large",
).embeddings
```

## Template 2: OpenAI Embeddings

```python
from openai import OpenAI

client = OpenAI()

response = client.embeddings.create(
    model="text-embedding-3-large",
    input=["API reference", "Deployment runbook"],
)

vectors = [item.embedding for item in response.data]
```

## Template 3: Local Embeddings

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("BAAI/bge-small-en-v1.5")
vectors = model.encode(
    ["Internal policy", "Troubleshooting checklist"],
    normalize_embeddings=True,
)
```

## Template 4: Chunking Strategy

```python
def chunk_text(text: str, chunk_size: int = 800, overlap: int = 120) -> list[str]:
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = max(end - overlap, start + 1)
    return chunks
```

Use semantic or heading-aware chunking when document structure matters more than
raw character count.

## Template 5: Domain-Specific Embedding Pipeline

```python
def build_records(documents: list[dict]) -> list[dict]:
    records = []
    for document in documents:
        for index, chunk in enumerate(chunk_text(document["content"])):
            records.append(
                {
                    "id": f'{document["id"]}:{index}',
                    "text": chunk,
                    "metadata": {
                        "title": document["title"],
                        "source": document["source"],
                        "chunk_index": index,
                    },
                }
            )
    return records
```

## Template 6: Embedding Quality Evaluation

```python
def evaluate_retrieval(results: list[list[str]], expected: list[set[str]]) -> float:
    hits = 0
    total = 0
    for actual, expected_ids in zip(results, expected):
        total += len(expected_ids)
        hits += sum(1 for item in actual if item in expected_ids)
    return hits / total if total else 0.0
```

Evaluate with:
- known-answer retrieval tasks
- domain-specific queries
- chunk-size comparisons
- model comparisons using the same corpus and metadata
