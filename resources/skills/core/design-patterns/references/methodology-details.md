# Design Patterns Methodology Details

## Phase 1: Stack Detection

**Sources** (in priority order):
1. `package.json` → Check dependencies and devDependencies
2. Framework-specific files → `angular.json`, `next.config.*`, `nest-cli.json`, `vite.config.*`
3. `tsconfig.json` → Check compilerOptions, paths, lib
4. File extensions → `*.jsx`, `*.tsx`, `*.vue` presence

**Detection Rules** (from `signatures/stack-patterns.yaml`):
- React: `react` in deps + `*.jsx/*.tsx` files
- Angular: `@angular/core` + `angular.json`
- NestJS: `@nestjs/core` + `nest-cli.json`
- Vue: `vue` v3+ + `*.vue` files
- Express: `express` in deps + `app.use` patterns
- RxJS: `rxjs` in deps + Observable usage
- Redux/Zustand: `redux`/`zustand` in deps + store patterns
- Prisma/TypeORM: `prisma`/`typeorm` in deps + schema files

**Output**:
```json
{
  "stack_detected": {
    "primary": "react",
    "version": "18.2.0",
    "secondary": ["typescript", "zustand", "prisma"],
    "detection_sources": ["package.json", "tsconfig.json", "37 *.tsx files"],
    "confidence": 0.95
  }
}
```

---

## Phase 2: Pattern Detection

**Search Strategy**:

1. **Glob Phase**: Find candidate files by naming convention
   - `*Singleton*.ts`, `*Factory*.ts`, `*Strategy*.ts`, `*Observer*.ts`, etc.
   - `*Manager*.ts`, `*Builder*.ts`, `*Adapter*.ts`, `*Proxy*.ts`, etc.

2. **Grep Phase**: Search for pattern signatures (from `signatures/detection-rules.yaml`)
   - Primary signals: `private constructor`, `static getInstance()`, `subscribe()`, `createXxx()`, etc.
   - Secondary signals: Interface naming, delegation patterns, method signatures

3. **Read Phase**: Validate pattern structure
   - Parse class/interface definitions
   - Verify relationships (inheritance, composition, delegation)
   - Check for complete pattern implementation vs partial usage

**Confidence Scoring**:
- 0.9-1.0: All primary + secondary signals present, structure matches exactly
- 0.7-0.89: All primary signals + some secondary, minor deviations
- 0.5-0.69: Primary signals present, missing secondary validation
- 0.3-0.49: Naming convention matches, weak structural evidence
- 0.0-0.29: Insufficient evidence, likely false positive

**Classification**:
- `native`: Pattern implemented using stack-native features (React Context, Angular Services, NestJS Guards, etc.)
- `custom`: Manual TypeScript implementation
- `library`: Third-party library providing pattern (RxJS Subject, Redux Store, etc.)

---

## Phase 3: Code Smell Detection

**Target Smells** (from `signatures/code-smells.yaml`):
1. **Switch on Type** → Strategy/Factory pattern
2. **Long Parameter List (>4)** → Builder pattern
3. **Global State Access** → Singleton (or preferably DI)
4. **Duplicated Conditionals on State** → State pattern
5. **Scattered Notification Logic** → Observer pattern
6. **Complex Object Creation** → Factory/Abstract Factory
7. **Tight Coupling to Concrete Classes** → Adapter/Bridge
8. **Repetitive Interface Conversions** → Adapter pattern
9. **Deep Nesting for Feature Addition** → Decorator pattern
10. **Large Class with Many Responsibilities** → Facade pattern

**Detection Heuristics**:
- Grep for `switch (.*type)`, `switch (.*kind)`, `switch (.*mode)`
- Count function parameters: `function \w+\([^)]{60,}\)` (approximation for >4 params)
- Search for global access: `window\.`, `global\.`, `process\.env\.\w+` (not in config files)
- Find state conditionals: `if.*state.*===.*&&.*if.*state.*===`
- Find notification patterns: `forEach.*notify`, `map.*\.emit\(`

---

## Phase 4: Stack-Aware Suggestions

**Adaptation Logic** (from `signatures/stack-patterns.yaml`):

```
IF pattern_detected == "custom" AND stack_has_native_equivalent:
  SUGGEST: "Use stack-native pattern instead"
  PROVIDE: Side-by-side comparison (current vs recommended)

ELSE IF code_smell_detected AND pattern_missing:
  IF stack_provides_pattern:
    SUGGEST: Stack-native implementation with examples
  ELSE:
    SUGGEST: Custom TypeScript implementation with best practices

ELSE IF pattern_implemented_incorrectly:
  PROVIDE: Refactoring steps to fix anti-patterns
```

**Example Adaptations**:

| Pattern | Stack | Native Alternative | Recommendation |
|---------|-------|-------------------|----------------|
| Singleton | React | Context API + Provider | Use `createContext()` instead of `getInstance()` |
| Observer | Angular | RxJS Subject/BehaviorSubject | Use built-in Observables, not custom implementation |
| Decorator | NestJS | @Injectable() decorators + Interceptors | Use framework interceptors |
| Strategy | Vue 3 | Composition API composables | Use `ref()` + composables instead of classes |
| Chain of Responsibility | Express | Middleware (`app.use()`) | Use Express middleware chain |
| Command | Redux | Action creators + reducers | Use Redux actions, not custom command objects |

---

## Phase 5: Quality Evaluation

**Criteria** (from `checklists/pattern-evaluation.md`):
1. **Correctness (0-10)**: Does it match the canonical pattern structure?
2. **Testability (0-10)**: Can dependencies be mocked/stubbed easily?
3. **Single Responsibility (0-10)**: Does it do one thing only?
4. **Open/Closed Principle (0-10)**: Extensible without modification?
5. **Documentation (0-10)**: Clear intent, descriptive naming?

**Scoring Guidelines**:
- 9-10: Exemplary, reference-quality implementation
- 7-8: Good, minor improvements possible
- 5-6: Acceptable, notable issues to address
- 3-4: Problematic, significant refactoring needed
- 0-2: Incorrect or severely flawed

**Issue Detection**:
- Hard-coded dependencies (Singleton with new inside getInstance)
- God classes (too many responsibilities)
- Leaky abstractions (exposing internal structure)
- Missing error handling
- Poor naming (Strategy1, Strategy2 instead of descriptive names)
