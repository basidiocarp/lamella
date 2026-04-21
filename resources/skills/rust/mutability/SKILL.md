---
name: mutability
description: "Analyzes Rust mutability and interior mutability issues."
origin: lamella
---

# Mutability & Interior Mutability

## Core Question

Who is allowed to change this data, and when?

## Borrow Rules

1. Many shared borrows (`&T`) OR one exclusive borrow (`&mut T`), never both
2. References must not outlive the data they point to
3. Interior mutability lets you mutate through `&T` (compile-time rule relaxed, enforced at runtime)

## Error-to-Question Mapping

| Error | Question to Ask |
|-------|-----------------|
| E0596 (cannot borrow as mutable) | Does the binding need `mut`? Or is interior mutability needed? |
| E0499 (multiple mutable borrows) | Can the mutation be restructured to avoid overlap? |
| E0502 (borrow conflict) | Should reads and writes be separated? |

## Interior Mutability Decision

| Scenario | Use |
|----------|-----|
| Single-thread, runtime checked | `RefCell<T>` |
| Single-thread, Copy types | `Cell<T>` |
| Multi-thread, blocking | `Mutex<T>` |
| Multi-thread, read-heavy | `RwLock<T>` |
| Atomic primitives | `AtomicBool`, `AtomicUsize`, etc. |
| One-time initialization | `OnceLock<T>` |

## Trace UP (to Design)

When mutability errors persist: "Is the mutation boundary in the right place?"
- Repeated E0502 -> split struct into independently borrowed fields
- Repeated E0499 -> restructure to process items sequentially
- Frequent RefCell panics -> redesign data access patterns

## Trace DOWN (from Domain)

| Domain Need | Mutability Pattern |
|-------------|-------------------|
| Caching | `RefCell<HashMap>` or `RwLock<HashMap>` |
| Counters/metrics | `AtomicUsize` |
| Configuration reload | `ArcSwap<Config>` or `watch` channel |
| Event listeners | `RefCell<Vec<Box<dyn Fn()>>>` |

## Anti-Patterns

| Bad | Better |
|-----|--------|
| `RefCell` to silence borrow checker | Fix the borrowing structure |
| `unsafe` to circumvent mut rules | Use interior mutability types |
| Holding RefCell borrow across calls | Borrow, clone, release |
| Mutex for single-threaded code | Use RefCell instead |
