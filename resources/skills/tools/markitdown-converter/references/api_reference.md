# MarkItDown API Reference

Use this file as the routing page for MarkItDown’s programmatic interfaces.

## Open These References By Task

1. [core-api.md](./core-api.md)
   Use for `MarkItDown`, `convert()`, `convert_stream()`, and the result object.
2. [custom-converters-and-plugins.md](./custom-converters-and-plugins.md)
   Use for custom converter classes and plugin registration.
3. [llm-image-descriptions.md](./llm-image-descriptions.md)
   Use for OpenRouter or other OpenAI-compatible image-description flows.
4. [azure-document-intelligence.md](./azure-document-intelligence.md)
   Use for Azure DI setup, auth, and endpoint-based conversion.

## Practical Rule

Keep the core conversion path simple first. Only add plugins, AI image
descriptions, or Azure Document Intelligence when the document type or quality
actually needs them.
