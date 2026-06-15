---
name: type-driven-design
description: "Run this when designing types to prevent bugs at compile time — leverages type systems to make invalid states unrepresentable."
origin: lamella
---

# Type-Driven Design

## Core Question

Can the type system prevent this bug at compile time?

## When to Use

- Preventing value confusion (mixing up IDs, units, etc.)
- Enforcing state transitions (connected → authenticated → querying)
- Ensuring required fields at build time
- Making invalid states unrepresentable

## Key Patterns

### Newtype Pattern

Wrap primitive types to add meaning and prevent misuse.

**TypeScript:**
```typescript
// Branded types prevent mixing up IDs
type UserId = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

function createUserId(id: string): UserId { return id as UserId; }
function createOrderId(id: string): OrderId { return id as OrderId; }

function getUser(id: UserId) { /* ... */ }
// getUser(someOrderId) — compile error!
```

**Rust:**
```rust
struct UserId(u64);
struct OrderId(u64);
// Now UserId and OrderId can't be accidentally swapped
```

**Go:**
```go
type UserId string
type OrderId string
// Different types despite same underlying representation
```

### Type State Pattern

Encode state transitions in the type system so invalid operations are compile errors.

**TypeScript:**
```typescript
interface Disconnected { readonly _state: 'disconnected'; }
interface Connected { readonly _state: 'connected'; stream: Socket; }
interface Authenticated { readonly _state: 'authenticated'; stream: Socket; token: string; }

type Connection<S> = S;

function connect(conn: Connection<Disconnected>): Connection<Connected> { /* ... */ }
function authenticate(conn: Connection<Connected>, creds: Credentials): Connection<Authenticated> { /* ... */ }
function query(conn: Connection<Authenticated>, sql: string): Result { /* ... */ }
// Can't query without authenticating — enforced at compile time
```

**Rust:**
```rust
struct Connection<S> { inner: TcpStream, _state: PhantomData<S> }
struct Disconnected;
struct Connected;
struct Authenticated;

impl Connection<Disconnected> {
    fn connect(self) -> Connection<Connected> { /* ... */ }
}
impl Connection<Authenticated> {
    fn query(&self, sql: &str) -> Result<Rows> { /* ... */ }
}
```

### Builder Pattern with Type Safety

Enforce required fields at compile time.

**TypeScript:**
```typescript
class UserBuilder<HasName extends boolean = false, HasEmail extends boolean = false> {
  private name?: string;
  private email?: string;

  setName(name: string): UserBuilder<true, HasEmail> {
    this.name = name;
    return this as unknown as UserBuilder<true, HasEmail>;
  }

  setEmail(email: string): UserBuilder<HasName, true> {
    this.email = email;
    return this as unknown as UserBuilder<HasName, true>;
  }

  // Only available when both name and email are set
  build(this: UserBuilder<true, true>): User {
    return { name: this.name!, email: this.email! };
  }
}
```

## Decision Guide

| Goal | Pattern |
|------|---------|
| Prevent value confusion | Newtype / Branded types |
| Enforce state transitions | Type State |
| Ensure required fields | Builder with type params |
| Restrict operations | Sealed types / private constructors |

## Anti-Patterns

| Bad | Better |
|-----|--------|
| `isValid` boolean fields | Type state with valid/invalid types |
| String for all identifiers | Newtypes: UserId, Email, etc. |
| Runtime state machine | Compile-time type state |
| Complex validation in constructor | Builder with compile-time guarantees |
| `any` / `interface{}` / `Object` | Specific types or generics |

## Trace Up

When type errors persist, ask: "Should the type model be richer?"

- Runtime checks for state → use type state pattern
- Primitive obsession → use newtypes
- Invalid object construction possible → use builder pattern
- Nullability confusion → use Option/Maybe types
