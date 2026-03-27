# Platform and Managed Languages

This group covers Swift, Java, Kotlin, and C#.

## Swift

### Force Unwrapping

```swift
let value = optionalValue!
```

Force unwraps turn recoverable absence into crashes. They are especially dangerous in auth or parsing code where unexpected input is normal.

### Bridged Type Semantics

`NSString` and `String` do not share the same indexing or range behavior. Bugs appear when code mixes UTF-16 assumptions with grapheme-cluster assumptions.

## Java

### Equality Confusion

```java
String a = new String("hello");
String b = new String("hello");
if (a == b) { }
```

`==` checks reference identity, not value equality. The same issue appears with boxed integers because caching makes some comparisons look correct.

### Type Erasure

Generic safety disappears at runtime, which means type validation is weaker than many developers assume.

### Deserialization

```java
ObjectInputStream ois = new ObjectInputStream(untrustedInput);
Object obj = ois.readObject();
```

Untrusted Java deserialization is a classic gadget-chain footgun. Safe defaults should avoid generic object deserialization entirely.

### Swallowed Exceptions

Security-sensitive code with empty or broad catch blocks often converts failure into silent bypass.

## Kotlin

### Platform Types

Java interop returns platform types like `String!`, which means Kotlin cannot enforce null safety.

### Not-Null Assertions

```kotlin
val value = nullableValue!!
```

This is a runtime footgun, not a type-safe shortcut.

### `lateinit` Access

Uninitialized `lateinit` properties fail at runtime and often surface only under rare startup or lifecycle paths.

## C#

### Nullable Reference Types Are Opt-In

Even when enabled, nullable violations are warnings by default unless the project treats them as errors.

### Invalid Default Struct State

```csharp
struct Connection {
    public string Host;
    public int Port;
}
```

`default(Connection)` may be nonsensical but still type-valid.

### `IDisposable` Leaks

Use `using` or `await using` consistently. Otherwise exceptions leave sockets, files, or DB handles open.
