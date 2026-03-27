# LLM Image Descriptions

Use this reference when converted files include diagrams or images that need
captioning.

## OpenAI-Compatible Client

```python
from markitdown import MarkItDown
from openai import OpenAI

client = OpenAI(
    api_key="your-openrouter-key",
    base_url="https://openrouter.ai/api/v1"
)

md = MarkItDown(
    llm_client=client,
    llm_model="anthropic/claude-opus-4.5",
    llm_prompt="Describe this image in detail"
)
```

## When To Use

- slide decks with charts or screenshots
- image-heavy documents where OCR alone is not enough
- scientific diagrams that need semantic description

## Cost Rule

Only enable this path when the document really benefits from image reasoning,
because it adds latency and API cost.
