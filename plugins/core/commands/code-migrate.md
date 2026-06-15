# Code Migration Assistant

## Context

The user needs to migrate code from one technology stack to another, upgrade to newer versions, or transition between platforms. Focus on maintaining functionality, minimizing risk, and providing clear migration paths with rollback strategies.

## Requirements

$ARGUMENTS

## Instructions

### 1. Migration Assessment

Analyze the current codebase and migration requirements:

**Migration Analyzer**

```python
import os
import json
import ast
import re
from pathlib import Path
from collections import defaultdict

# ... (101 lines trimmed for brevity)

        return sorted(risks, key=lambda x: {'high': 0, 'medium': 1, 'low': 2}[x['severity']])
```

### 2. Migration Planning

Create detailed migration plans:

**Migration Planner**

```python
class MigrationPlanner:
    def create_migration_plan(self, analysis):
        """
        Create comprehensive migration plan
        """
        plan = {
            'phases': self._define_phases(analysis),
# ... (115 lines trimmed for brevity)

        return output
```

### 3. Framework Migrations

Handle specific framework migrations:

**React to Vue Migration**

```javascript
class ReactToVueMigrator {
  migrateComponent(reactComponent) {
    // Parse React component
    const ast = parseReactComponent(reactComponent);

    // Extract component structure
    const componentInfo = {
# ... (82 lines trimmed for brevity)
  }
}
```

### 4. Language Migrations

Handle language version upgrades:

**Python 2 to 3 Migration**

```python
class Python2to3Migrator:
    def __init__(self):
        self.transformations = {
            'print_statement': self.transform_print,
            'unicode_literals': self.transform_unicode,
            'division': self.transform_division,
            'imports': self.transform_imports,
# ... (93 lines trimmed for brevity)

        return node
```

### 5. API Migration

Migrate between API paradigms:

**REST to GraphQL Migration**

```javascript
class RESTToGraphQLMigrator {
  constructor(restEndpoints) {
    this.endpoints = restEndpoints;
    this.schema = {
      types: {},
      queries: {},
      mutations: {},
# ... (104 lines trimmed for brevity)
  }
}
```

### 6. Database Migration

Migrate between database systems:

**SQL to NoSQL Migration**

```python
class SQLToNoSQLMigrator:
    def __init__(self, source_db, target_db):
        self.source = source_db
        self.target = target_db
        self.schema_mapping = {}

    def analyze_schema(self):
# ... (123 lines trimmed for brevity)
"""
        return script
```

### 7. Testing Strategy

Ensure migration correctness:

**Migration Testing Framework**

```python
class MigrationTester:
    def __init__(self, original_app, migrated_app):
        self.original = original_app
        self.migrated = migrated_app
        self.test_results = []

    def run_comparison_tests(self):
# ... (56 lines trimmed for brevity)

        return results
```

### 8. Rollback Planning

Implement safe rollback strategies:

```python
class RollbackManager:
    def create_rollback_plan(self, migration_type):
        """Create comprehensive rollback plan"""
        plan = {
            'triggers': self.define_rollback_triggers(),
            'procedures': self.define_rollback_procedures(migration_type),
            'verification': self.define_verification_steps(),
# ... (48 lines trimmed for brevity)
            "6. Keep green environment for debugging"
        ]
```

### 9. Migration Automation

Create automated migration tools:

```python
def create_migration_cli():
    """Generate CLI tool for migration"""
    return '''
#!/usr/bin/env python3
import click
import json
from pathlib import Path
# ... (63 lines trimmed for brevity)
    cli()
'''
```

### 10. Progress Monitoring

Track migration progress:

```python
class MigrationMonitor:
    def __init__(self, migration_id):
        self.migration_id = migration_id
        self.metrics = defaultdict(list)
        self.checkpoints = []

    def create_dashboard(self):
# ... (74 lines trimmed for brevity)
</html>
"""
```

## Output Format

1. **Migration Analysis**: Comprehensive analysis of source codebase
2. **Risk Assessment**: Identified risks with mitigation strategies
3. **Migration Plan**: Phased approach with timeline and milestones
4. **Code Examples**: Automated migration scripts and transformations
5. **Testing Strategy**: Comparison tests and validation approach
6. **Rollback Plan**: Detailed procedures for safe rollback
7. **Progress Tracking**: Real-time migration monitoring
8. **Documentation**: Migration guide and runbooks

Focus on minimizing disruption, maintaining functionality, and providing clear paths for successful code migration with comprehensive testing and rollback strategies.
