# C++ Coding Standards (C++ Core Guidelines)

## Contents

- [When to Use](#when-to-use)
- [Cross-Cutting Principles](#cross-cutting-principles)
- [Quick Reference Tables](#quick-reference-tables)
- [Quick Reference Checklist](#quick-reference-checklist)
- [References](#references)

## When to Use

- Writing new C++ code (classes, functions, templates)
- Reviewing or refactoring existing C++ code
- Making architectural decisions in C++ projects
- Enforcing consistent style across a C++ codebase

**When NOT to Use**: Non-C++ projects, legacy C codebases, embedded contexts with conflicting constraints.

## Cross-Cutting Principles

1. **RAII everywhere** (P.8, R.1, E.6, CP.20): Bind resource lifetime to object lifetime
2. **Immutability by default** (P.10, Con.1-5, ES.25): Start with `const`/`constexpr`
3. **Type safety** (P.4, I.4, ES.46-49, Enum.3): Use the type system to prevent errors
4. **Express intent** (P.3, F.1, NL.1-2, T.10): Names, types, concepts communicate purpose
5. **Minimize complexity** (F.2-3, ES.5, Per.4-5): Simple code is correct code
6. **Value semantics over pointers** (C.10, R.3-5, F.20, CP.31): Prefer returning by value

## Quick Reference Tables

### Philosophy & Interfaces (P.*, I.*)

| Rule | Summary |
|------|---------|
| P.1 | Express ideas directly in code |
| P.3 | Express intent |
| P.8 | Don't leak any resources |
| P.10 | Prefer immutable data |
| I.4 | Make interfaces precisely typed |
| I.11 | Never transfer ownership by raw pointer |

### Functions (F.*)

| Rule | Summary |
|------|---------|
| F.2 | Single logical operation per function |
| F.4 | Use `constexpr` for compile-time evaluation |
| F.6 | Use `noexcept` when function can't throw |
| F.16 | Cheap types by value, others by `const&` |
| F.20 | Prefer return values to output parameters |
| F.21 | Return struct for multiple values |

### Classes (C.*)

| Rule | Summary |
|------|---------|
| C.20 | Rule of Zero: let compiler generate special members |
| C.21 | Rule of Five: define all or none |
| C.35 | Base destructor: public virtual or protected non-virtual |
| C.46 | Single-argument constructors: `explicit` |
| C.128 | Virtual functions: exactly one of `virtual`, `override`, `final` |

### Resource Management (R.*)

| Rule | Summary |
|------|---------|
| R.1 | Use RAII for resource management |
| R.3 | Raw pointer = non-owning |
| R.11 | Avoid explicit `new`/`delete` |
| R.20 | Use `unique_ptr` or `shared_ptr` for ownership |
| R.21 | Prefer `unique_ptr` over `shared_ptr` |

### Error Handling (E.*)

| Rule | Summary |
|------|---------|
| E.2 | Throw exceptions to signal failure |
| E.6 | Use RAII to prevent leaks |
| E.14 | Use purpose-designed exception types |
| E.15 | Throw by value, catch by reference |

### Concurrency (CP.*)

| Rule | Summary |
|------|---------|
| CP.2 | Avoid data races |
| CP.8 | Don't use `volatile` for sync |
| CP.20 | Use RAII locks, never plain `lock()`/`unlock()` |
| CP.21 | Use `std::scoped_lock` for multiple mutexes |

### Templates (T.*)

| Rule | Summary |
|------|---------|
| T.10 | Specify concepts for all template arguments |
| T.11 | Use standard concepts when possible |
| T.43 | Prefer `using` over `typedef` |

## Quick Reference Checklist

Before marking C++ work complete:

- [ ] No raw `new`/`delete` — use smart pointers or RAII (R.11)
- [ ] Objects initialized at declaration (ES.20)
- [ ] Variables are `const`/`constexpr` by default (Con.1, ES.25)
- [ ] `enum class` instead of plain `enum` (Enum.3)
- [ ] `nullptr` instead of `0`/`NULL` (ES.47)
- [ ] Single-argument constructors are `explicit` (C.46)
- [ ] Rule of Zero or Rule of Five applied (C.20, C.21)
- [ ] Templates constrained with concepts (T.10)
- [ ] No `using namespace` in headers (SF.7)
- [ ] Locks use RAII (`scoped_lock`/`lock_guard`) (CP.20)
- [ ] Exceptions: custom types, throw by value, catch by reference (E.14, E.15)
- [ ] `'\n'` instead of `std::endl` (SL.io.50)

## References

- [Code Examples](code-examples.md) — Detailed code examples for each guideline
- [Anti-Patterns](anti-patterns.md) — Patterns to avoid by category
- [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)
