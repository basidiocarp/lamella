# Custom Converters and Plugins

Use this reference when the built-in converters are not enough.

## Custom Converter Shape

```python
from markitdown import DocumentConverter

class CustomConverter(DocumentConverter):
    def convert(self, stream, file_extension):
        ...
```

## Plugin Registration

Enable plugin loading when installed packages expose supported converters.

```python
from markitdown import MarkItDown

md = MarkItDown(enable_plugins=True)
result = md.convert("document.pdf")
```

## Rules

- prefer a custom converter when the file type is unique to your environment
- keep plugin packages small and format-specific
- test against binary streams, not only file paths
