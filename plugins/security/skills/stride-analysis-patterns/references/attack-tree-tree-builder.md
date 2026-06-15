# Attack Tree Builder

Fluent builder pattern for constructing attack trees with example usage.

```python
from dataclasses import dataclass, field


@dataclass
class AttackNode:
    name: str
    description: str
    children: list["AttackNode"] = field(default_factory=list)


class AttackTreeBuilder:
    def __init__(self, name: str, description: str):
        self.root = AttackNode(name, description)

    def add_child(self, parent: AttackNode, name: str, description: str) -> AttackNode:
        child = AttackNode(name, description)
        parent.children.append(child)
        return child

    def build(self) -> AttackNode:
        return self.root


builder = AttackTreeBuilder("Compromise admin account", "Gain privileged access")
phish = builder.add_child(builder.root, "Phishing", "Steal valid credentials")
builder.add_child(phish, "Bypass MFA", "Exploit weak recovery path")
tree = builder.build()
```
