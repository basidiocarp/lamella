# Data Flow Diagram Analysis

Analyze DFDs for STRIDE threats and trust boundary crossings.

```python
from dataclasses import dataclass
from typing import List, Set, Tuple, Dict
from enum import Enum

class ElementType(Enum):
// ... (109 lines trimmed)
                })

        return threats
```

## STRIDE per Interaction

Apply STRIDE to each interaction between components.

```python
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class Interaction:
// ... (76 lines trimmed)
            all_threats.extend(threats)

        return all_threats
```
