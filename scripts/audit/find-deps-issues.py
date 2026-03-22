#!/usr/bin/env python3
"""Find skills with imports but no installation instructions."""

import re
from pathlib import Path

skills_dir = Path(__file__).parent.parent / 'skills'
needs_install = []

for plugin_dir in sorted(skills_dir.iterdir()):
    if not plugin_dir.is_dir():
        continue
    for skill_dir in sorted(plugin_dir.iterdir()):
        if not skill_dir.is_dir():
            continue
        skill_file = skill_dir / 'SKILL.md'
        if not skill_file.exists():
            continue
        content = skill_file.read_text()
        # Check if has imports but no install instructions
        has_imports = bool(re.search(r'import\s+\w+|require\(["\']', content))
        has_install = 'pip install' in content or 'npm install' in content
        has_deps = 'dependencies' in content.lower() or 'requirements' in content.lower()
        if has_imports and not has_install and not has_deps:
            # Get first import lines
            imports = re.findall(r'(?:import\s+[\w.]+|from\s+[\w.]+\s+import\s+[\w.]+)', content)
            needs_install.append((f'{plugin_dir.name}/{skill_dir.name}', imports[:5]))

print(f'Found {len(needs_install)} skills needing install instructions:\n')
for path, imports in needs_install:
    print(f'{path}:')
    for imp in imports:
        print(f'  - {imp}')
    print()
