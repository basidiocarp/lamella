---
name: resource-mgmt
description: "Explains Rust smart pointers and resource management patterns."
origin: lamella
---

# Smart Pointers & Resource Management

## Core Question

What ownership semantics does this resource need?

## Decision Flowchart

| Need | Use |
|------|-----|
| Heap allocation, single owner | `Box<T>` |
| Shared ownership, single-thread | `Rc<T>` |
| Shared ownership, multi-thread | `Arc<T>` |
| Interior mutability, single-thread | `RefCell<T>` |
| Interior mutability, Copy types | `Cell<T>` |
| Break reference cycles | `Weak<T>` |
| Shared + mutable, multi-thread | `Arc<Mutex<T>>` or `Arc<RwLock<T>>` |

## Trace UP (to Design)

When smart pointer errors persist: "Is the sharing pattern appropriate for this architecture?"
- Too many `Rc` clones -> maybe redesign to reduce sharing
- `Arc<Mutex<T>>` contention -> maybe use channels instead
- Complex `Weak` graphs -> maybe simplify data structure

## Trace DOWN (from Domain)

| Domain Need | Smart Pointer Choice |
|-------------|---------------------|
| Shared config | `Arc<Config>` (immutable after init) |
| Connection pool | `Arc<Pool>` with internal sync |
| Cache | `Arc<RwLock<HashMap>>` |
| Tree structure | `Rc<RefCell<Node>>` or arena allocation |
| Plugin system | `Box<dyn Trait>` |

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Cannot borrow RefCell | Already borrowed | Check borrow logic, use try_borrow |
| Rc not Send | Rc is single-threaded | Use Arc for multi-threaded |
| Deadlock with Mutex | Lock ordering | Consistent lock order, or use RwLock |

## Anti-Patterns

| Bad | Better |
|-----|--------|
| `Rc<RefCell<T>>` everywhere | Question if sharing is needed |
| Nested Arc<Mutex<Arc<...>>> | Flatten or use channels |
| Manual Drop impl for cleanup | RAII guard pattern |
| Leaking Rc cycles | Use Weak for back-references |
