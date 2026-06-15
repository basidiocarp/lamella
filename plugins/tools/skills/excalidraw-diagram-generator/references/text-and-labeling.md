# Text and Labeling

Text is a first-class Excalidraw element. Use it for titles, annotations, and
labels that should not be embedded inside shapes.

## Standalone Text

```json
{
  "type": "text",
  "x": 120,
  "y": 40,
  "text": "Checkout Flow",
  "fontSize": 24,
  "fontFamily": 5,
  "strokeColor": "#1e1e1e",
  "textAlign": "left",
  "verticalAlign": "top"
}
```

## Font Rule

All text must use `fontFamily: 5` so the output matches Excalidraw's default
look.

## Labeling Rule

- Put short labels inside shapes when they fit cleanly.
- Use separate text elements when labels need wrapping, alignment, or reuse.
- Keep connector labels sparse. Label the relationship only if the meaning is
  not obvious from the node names.

## Spacing Rule

Leave 8-16px of internal padding when placing text inside a shape. If the label
starts to wrap awkwardly, increase the node size instead of shrinking the font.

## Title Pattern

Use a title text element above the diagram and a subtitle or note below it when
you need context such as environment, date, or scope.
