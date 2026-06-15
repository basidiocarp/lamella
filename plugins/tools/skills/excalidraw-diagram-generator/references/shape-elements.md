# Shape Elements

Use these defaults for node-style elements in Excalidraw.

## Rectangle

Best for process steps, services, entities, and containers.

```json
{
  "type": "rectangle",
  "x": 120,
  "y": 80,
  "width": 200,
  "height": 88,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "#a5d8ff",
  "roundness": { "type": 3 }
}
```

Typical sizes:

| Content | Width | Height |
|---------|-------|--------|
| Single word | 120-150 | 60-80 |
| Short phrase | 180-220 | 80-96 |
| Full step label | 240-300 | 88-120 |

## Ellipse

Best for start and end states, emphasis bubbles, and compact nodes.

```json
{
  "type": "ellipse",
  "x": 120,
  "y": 80,
  "width": 110,
  "height": 110,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "#b2f2bb"
}
```

Prefer equal width and height when the node is meant to read as circular.

## Diamond

Best for decisions and branching questions.

```json
{
  "type": "diamond",
  "x": 120,
  "y": 80,
  "width": 170,
  "height": 170,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "#ffd43b"
}
```

Diamonds need more space than rectangles for the same amount of text. Keep the
label short, ideally one question with up to four words.

## Color Rule

Use color semantically, not decoratively:

- `#a5d8ff` for systems and neutral components
- `#b2f2bb` for safe or positive states
- `#ffd43b` for decisions or emphasis
- `#ffc9c9` for warnings or failure states

If color is not carrying meaning, default to white or light gray.
