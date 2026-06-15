# Advanced Mermaid Features

Use this reference for configuration, theming, layout, styling, and export
choices that go beyond the diagram basics.

## Frontmatter Configuration

```mermaid
---
config:
  theme: base
  look: handDrawn
  layout: dagre
  themeVariables:
    primaryColor: "#ff6b6b"
    primaryTextColor: "#1f2937"
---
flowchart TD
  A[Input] --> B{Valid?}
  B -->|Yes| C[Continue]
  B -->|No| D[Fix]
```

## Themes

- `default`: standard blue Mermaid theme
- `forest`: green-leaning palette
- `dark`: dark-surface palette
- `neutral`: grayscale presentation
- `base`: starting point for custom theme variables

## Layout and Look

```mermaid
---
config:
  layout: elk
  look: classic
---
flowchart LR
  API --> Queue
  Queue --> Worker
  Worker --> Store
```

Use `elk` for denser diagrams and `dagre` for simpler flowcharts.

## Styling Patterns

### Class-Based Styling

```mermaid
flowchart TD
  A[Healthy]:::success --> B[Warning]:::warning --> C[Failed]:::error

  classDef success fill:#00b894,stroke:#008f6f,color:#fff
  classDef warning fill:#fdcb6e,stroke:#e6b800,color:#333
  classDef error fill:#ff6b6b,stroke:#d64545,color:#fff
```

### Link Styling

```mermaid
flowchart LR
  A --> B
  B --> C
  linkStyle 0 stroke:#4f46e5,stroke-width:3px
  linkStyle 1 stroke:#0f766e,stroke-width:2px
```

## Export Notes

- use native rendering where the platform supports Mermaid
- use `mermaid.live` for quick SVG or PNG export
- use `mmdc -i input.mmd -o output.png` for repeatable CLI export
