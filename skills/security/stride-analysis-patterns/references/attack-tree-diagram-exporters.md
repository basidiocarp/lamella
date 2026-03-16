# Diagram Exporters

Export attack trees to Mermaid and PlantUML diagram formats.

## Mermaid Exporter

```python
class MermaidExporter:
    """Export attack trees to Mermaid diagram format."""

    def __init__(self, tree: AttackTree):
        self.tree = tree
// ... (44 lines trimmed)
        }
        color = colors.get(node.attributes.difficulty, "fill:#gray")
        return color
```

## PlantUML Exporter

```python
class PlantUMLExporter:
    """Export attack trees to PlantUML format."""

    def __init__(self, tree: AttackTree):
        self.tree = tree
// ... (24 lines trimmed)

        for child in node.children:
            self._export_node(child, lines, depth + 1)
```
