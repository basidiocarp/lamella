#!/bin/bash
# Validate all workflow YAML files are syntactically correct

python3 << 'PYEOF'
import yaml, subprocess, sys
files = subprocess.run(['find', 'resources/workflows', '-name', '*.yaml'], capture_output=True, text=True).stdout.strip().split('\n')
files = [f for f in files if f]
if not files:
    print('workflows: none')
    sys.exit(0)
errors = []
for f in files:
    try:
        yaml.safe_load(open(f))
    except Exception as e:
        errors.append(f'{f}: {e}')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'workflows: {len(files)} YAML file(s) valid')
PYEOF
