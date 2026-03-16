# Design Patterns Constraints & Usage

## Constraints & Guidelines

### Read-Only Analysis
- **No modifications**: This skill only analyzes and suggests, never modifies code
- **No file creation**: Does not generate refactored code files
- **User decision**: All suggestions require explicit user approval before implementation

### Language Focus
- **Primary**: TypeScript (`.ts`, `.tsx`)
- **Secondary**: JavaScript (`.js`, `.jsx`)
- **Exclusions**: Other languages (Python, Java, C#) not supported

### Pattern Coverage
- **Creational (5)**: Singleton, Factory Method, Abstract Factory, Builder, Prototype
- **Structural (7)**: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
- **Behavioral (11)**: Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor, Interpreter

### Performance Considerations
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
