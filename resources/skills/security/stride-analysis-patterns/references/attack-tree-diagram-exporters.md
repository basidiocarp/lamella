# Diagram Exporters

Export attack trees to Mermaid and PlantUML diagram formats.

## Mermaid Exporter

```python
class MermaidExporter:
    """Export attack trees to Mermaid diagram format."""

    def __init__(self, tree: AttackTree):
        self.tree = tree

    def export(self) -> str:
        lines = ["graph TD"]
        self._export_node(self.tree.root, lines)
        return "\n".join(lines)

    def _export_node(self, node: AttackTreeNode, lines: list[str]) -> None:
        node_id = node.node_id
        lines.append(f'    {node_id}["{node.label}"]')
        lines.append(f"    style {node_id} {self._style(node)}")
        for child in node.children:
            lines.append(f"    {node_id} --> {child.node_id}")
            self._export_node(child, lines)

    def _style(self, node: AttackTreeNode) -> str:
        colors = {
            "low": "fill:#d1fae5,stroke:#065f46",
            "medium": "fill:#fef3c7,stroke:#92400e",
            "high": "fill:#fee2e2,stroke:#991b1b",
        }
        return colors.get(node.attributes.difficulty, "fill:#e5e7eb,stroke:#374151")
```

## PlantUML Exporter

```python
class PlantUMLExporter:
    """Export attack trees to PlantUML mind-map style output."""

    def __init__(self, tree: AttackTree):
        self.tree = tree

    def export(self) -> str:
        lines = ["@startmindmap", "* Attack Tree"]
        self._export_node(self.tree.root, lines, depth=2)
        lines.append("@endmindmap")
        return "\n".join(lines)

    def _export_node(self, node: AttackTreeNode, lines: list[str], depth: int) -> None:
        prefix = "*" * depth
        lines.append(f"{prefix} {node.label} [{node.attributes.difficulty}]")
        for child in node.children:
            self._export_node(child, lines, depth + 1)
```
