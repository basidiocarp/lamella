# Excalidraw Schema Essentials

Use this reference when generating raw `.excalidraw` JSON.

## Top-Level Shape

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": 20
  },
  "files": {}
}
```

## Element Core Fields

Every element needs:

- `id`
- `type`
- `x`, `y`, `width`, `height`
- stroke and fill settings
- lock and link fields when relevant

## Element Families

- node shapes: `rectangle`, `ellipse`, `diamond`
- connectors: `arrow`, `line`
- labels: `text`

Use the dedicated element references for type-specific guidance.

## Practical Rule

Keep generated JSON minimal and valid. Add only the fields your diagram actually
needs instead of copying giant object payloads blindly.
