---
name: zero-cost
description: "Explains Rust generics, traits, and zero-cost abstraction trade-offs."
origin: lamella
---

# Generics, Traits & Zero-Cost Abstractions

## Core Question

Should this abstraction be resolved at compile time or runtime?

## Static vs Dynamic Dispatch

| Aspect | Static (`impl Trait`) | Dynamic (`dyn Trait`) |
|--------|-----------------------|-----------------------|
| Performance | Zero-cost, inlined | Vtable indirection |
| Binary size | Larger (monomorphized) | Smaller (single impl) |
| Use case | Known types at compile time | Heterogeneous collections |
| Syntax | `fn foo(x: impl Trait)` | `fn foo(x: &dyn Trait)` |

## Error-to-Question Mapping

| Error | Question to Ask |
|-------|-----------------|
| E0277 (trait not satisfied) | Does the type need this capability? Add bound or impl? |
| E0308 (type mismatch) | Are the generic parameters correct? |
| E0599 (no method found) | Is the trait in scope? Import needed? |
| E0038 (not object-safe) | Can this trait use dynamic dispatch? |

## Object Safety Rules

A trait is object-safe (usable as `dyn Trait`) when:
- No methods return `Self`
- No methods use generic type parameters
- No associated constants
- All methods have a receiver (`&self`, `&mut self`, `self`)

## Trace UP (to Design)

When trait errors persist: "Is this abstraction boundary correct?"
- Too many trait bounds -> over-abstracted, simplify
- Can't make trait object-safe -> use enum dispatch instead
- Monomorphization explosion -> switch to dynamic dispatch

## Quick Reference

```rust
// Static dispatch (monomorphized, zero-cost)
fn process(item: impl Display) { println!("{item}"); }

// Generic with bounds
fn process<T: Display + Debug>(item: T) { /* ... */ }

// Dynamic dispatch (vtable, flexible)
fn process(item: &dyn Display) { println!("{item}"); }

// Trait objects in collections
let items: Vec<Box<dyn Display>> = vec![Box::new(1), Box::new("hi")];

// Associated types vs generics
trait Iterator { type Item; fn next(&mut self) -> Option<Self::Item>; }
trait Add<Rhs = Self> { type Output; fn add(self, rhs: Rhs) -> Self::Output; }
```

## Anti-Patterns

| Bad | Better |
|-----|--------|
| `dyn Trait` when types are known | Use `impl Trait` or generics |
| Trait with 10+ bounds | Split into focused traits |
| Generic everything | Only abstract when needed |
| Ignoring object safety | Use enum dispatch for non-object-safe |
