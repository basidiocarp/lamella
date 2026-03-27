# Provider Integrations

Use this reference when MarkItDown needs external intelligence.

## OpenRouter Image Descriptions

```python
from markitdown import MarkItDown
from openai import OpenAI

client = OpenAI(
    api_key="your-openrouter-key",
    base_url="https://openrouter.ai/api/v1",
)

md = MarkItDown(
    llm_client=client,
    llm_model="anthropic/claude-opus-4.5",
    llm_prompt="Describe this image in detail",
)
```

## Azure Document Intelligence

```python
md = MarkItDown(
    docintel_endpoint="https://YOUR-RESOURCE.cognitiveservices.azure.com/"
)
```

Use provider-backed conversion only when default extraction loses important
structure or the file contains image-heavy content.
