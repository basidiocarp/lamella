# Design Patterns Constraints & Guidelines

## Read-Only Analysis

- **No modifications**: This skill only analyzes and suggests, never modifies code
- **No file creation**: Does not generate refactored code files
- **User decision**: All suggestions require explicit user approval before implementation

---

## Language Focus

- **Primary**: TypeScript (`.ts`, `.tsx`)
- **Secondary**: JavaScript (`.js`, `.jsx`)
- **Exclusions**: Other languages (Python, Java, C#) not supported

---

## Pattern Coverage

### Creational Patterns (5)
1. **Singleton** - Ensure a class has only one instance
2. **Factory Method** - Define an interface for creating objects
3. **Abstract Factory** - Create families of related objects
4. **Builder** - Construct complex objects step by step
5. **Prototype** - Create objects by copying existing ones

### Structural Patterns (7)
1. **Adapter** - Convert interface of a class to another
2. **Bridge** - Separate abstraction from implementation
3. **Composite** - Compose objects into tree structures
4. **Decorator** - Add responsibilities dynamically
5. **Facade** - Provide simplified interface to a subsystem
6. **Flyweight** - Share common state between objects
7. **Proxy** - Provide surrogate for another object

### Behavioral Patterns (11)
1. **Chain of Responsibility** - Pass requests along a chain
2. **Command** - Encapsulate requests as objects
3. **Iterator** - Access elements sequentially
4. **Mediator** - Define simplified communication
5. **Memento** - Capture and restore object state
6. **Observer** - Define one-to-many dependency
7. **State** - Alter behavior when state changes
8. **Strategy** - Define family of interchangeable algorithms
9. **Template Method** - Define skeleton of algorithm
10. **Visitor** - Add operations without modifying classes
11. **Interpreter** - Define grammar representation

---

## Performance Considerations

- **Large codebases (>500 files)**: Use `--scope` to limit scan to specific directories
- **Parallel search**: Grep searches run independently for each pattern
- **Caching**: Stack detection results cached per session to avoid redundant package.json reads

---

## Usage Examples

### Basic Detection
```bash
# Detect all patterns in src/
/design-patterns detect src/

# Detect only creational patterns
/design-patterns detect src/ --category=creational

# Focus on specific pattern
/design-patterns detect src/ --pattern=singleton
```

### Targeted Suggestions
```bash
# Get suggestions for payment module
/design-patterns suggest src/payment/

# Focus on specific smell
/design-patterns suggest src/ --smell=switch-on-type

# High priority only
/design-patterns suggest src/ --priority=high
```

### Quality Evaluation
```bash
# Evaluate specific file
/design-patterns evaluate src/services/api-client.ts

# Evaluate all singletons
/design-patterns evaluate src/ --pattern=singleton

# Full quality report
/design-patterns evaluate src/ --detailed
```

---

## Integration with Other Skills

This skill can be inherited by:
- `refactoring-specialist.md` → Provides pattern knowledge for refactoring
- `code-reviewer.md` → Adds pattern detection to review process
- `architecture-advisor.md` → Informs architectural decisions with pattern usage

---

## Reference Files

- `reference/patterns-index.yaml` → Machine-readable index of 23 patterns with metadata
- `reference/creational.md` → Creational patterns documentation
- `reference/structural.md` → Structural patterns documentation
- `reference/behavioral.md` → Behavioral patterns documentation
- `signatures/detection-rules.yaml` → Regex patterns and heuristics for detection
- `signatures/code-smells.yaml` → Mapping from code smells to applicable patterns
- `signatures/stack-patterns.yaml` → Stack detection rules and native pattern equivalents
- `checklists/pattern-evaluation.md` → Quality evaluation criteria and scoring guidelines
