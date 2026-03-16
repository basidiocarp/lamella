# Attack Tree Data Model

Python data model for attack trees with nodes, attributes, and analysis capabilities.

```python
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Optional, Union
import json

// ... (184 lines trimmed)
            "version": self.version,
            "root": self.root.to_dict()
        }, indent=2)
```
