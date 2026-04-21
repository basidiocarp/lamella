---
name: ownership
description: "Analyzes Rust ownership, borrowing, and lifetime issues."
origin: lamella
---

# Ownership, Borrowing & Lifetimes

## Core Question

Who owns this data, and how long does it live?

## Error-to-Question Mapping

| Error | Question to Ask |
|-------|-----------------|
| E0382 (value moved) | Should this data be shared or copied? |
| E0597 (lifetime too short) | Is the scope boundary in the right place? |
| E0506 (cannot assign) | Who should own the mutation right? |
| E0507 (cannot move out) | Should this be cloned or restructured? |
| E0515 (return local ref) | Should this data be owned by the caller? |

## Thinking Prompt

Before implementing, ask:
1. Who needs this data? One owner or many readers?
2. How long does the data need to live?
3. Does anyone need to modify it?

## Trace UP (to Design)

When ownership errors persist, ask: "What design choice led to this ownership structure?"

Common escalations:
- Repeated E0382 -> data needs shared ownership (Arc/Rc), not moves
- Repeated E0597 -> scope boundaries are wrong, restructure data flow
- Repeated E0507 -> data model needs redesign (owned vs borrowed)

## Trace DOWN (from Domain)

When domain requires specific data patterns:
- Immutable audit data -> Arc<T> for zero-cost sharing
- Mutable shared state -> Arc<Mutex<T>> or channels
- Request-scoped data -> lifetime tied to request handler

## Quick Reference

| Scenario | Pattern |
|----------|---------|
| Single owner, stack | `let x = value;` |
| Single owner, heap | `Box<T>` |
| Shared, single-thread | `Rc<T>` |
| Shared, multi-thread | `Arc<T>` |
| Temporary access | `&T` (shared borrow) |
| Temporary mutation | `&mut T` (exclusive borrow) |
| Transfer ownership | `fn take(x: T)` |
| Return owned data | `fn make() -> T` |

## Error Code Reference

| Code | Meaning | Common Fix |
|------|---------|------------|
| E0382 | Use after move | Clone, borrow, or use Rc/Arc |
| E0597 | Borrowed value dropped too soon | Extend lifetime or restructure |
| E0506 | Cannot assign to borrowed content | Release borrow first |
| E0507 | Cannot move out of borrowed | Clone or restructure |
| E0515 | Cannot return reference to local | Return owned value instead |
| E0716 | Temporary dropped while borrowed | Bind to variable first |
| E0106 | Missing lifetime annotation | Add 'a parameter |

## Anti-Patterns

| Bad | Better |
|-----|--------|
| `.clone()` everywhere | Analyze ownership, share references |
| `'static` on everything | Use proper lifetime parameters |
| Fighting borrow checker | Redesign data flow |
| Returning references to locals | Return owned data or use callbacks |

## Related Skills

- **resource-mgmt**: Smart pointer selection
- **mutability**: Interior mutability patterns
- **concurrency**: Thread-safe sharing
