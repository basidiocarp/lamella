# Swift Sharp Edges

Use this reference when scanning Swift code for APIs or language features that
hide crashes, silent failures, or memory-management surprises behind concise
syntax.

## Crash-Prone Unwrapping and Casting

Watch for direct unwrap and cast operators in paths influenced by optional data,
UI outlets, or deserialization.

```swift
let value = optionalValue!
let cell = tableView.dequeueReusableCell(withIdentifier: "UserCell") as! UserCell
let data = try! JSONDecoder().decode(User.self, from: raw)
```

Safer replacements:

```swift
guard let value = optionalValue else { return }
guard let cell = tableView.dequeueReusableCell(withIdentifier: "UserCell") as? UserCell else {
    return
}

do {
    let data = try JSONDecoder().decode(User.self, from: raw)
} catch {
    logger.error("decode failed: \(error)")
}
```

Flag these patterns:
- `!` on optionals
- `as!`
- `try!`
- `try?` when the nil case is ignored

## String Bridging and Indexing

Swift `String` uses grapheme clusters. `NSString` uses UTF-16 indices. Bugs
show up when code mixes them.

```swift
let nsString: NSString = "café"
let swiftString = nsString as String

nsString.length          // UTF-16 units
swiftString.count        // user-visible characters
```

Treat mixed `String` and `NSString` range math as a footgun, especially in
parsers, validators, and substring-heavy code.

## Reference Cycles

Closures and mutually referencing objects can leak silently.

```swift
class ViewModel {
    var onRefresh: (() -> Void)?

    func start() {
        onRefresh = {
            self.reload()
        }
    }
}
```

Prefer:

```swift
onRefresh = { [weak self] in
    self?.reload()
}
```

Also audit object graphs with `weak` or `unowned` expectations, especially
delegates, UI callback chains, and parent-child object relationships.

## Concurrency and Shared State

Collections are not automatically thread-safe.

```swift
var items = [Int]()
DispatchQueue.global().async { items.append(1) }
DispatchQueue.global().async { items.append(2) }
```

Prefer actors, a serial queue, or explicit locking for shared mutable state.
Also flag code that mixes legacy GCD patterns with actor-isolated values without
clear boundaries.

## Overflow and Arithmetic Semantics

Swift traps on overflow by default, but wrapping operators reintroduce silent
wraparound.

```swift
let x: Int8 = 127
let y = x &+ 1
```

The `&+`, `&-`, and `&*` operators are worth auditing anywhere counters, sizes,
or security-relevant arithmetic matter.

## Codable and Objective-C Interop

Two common silent-failure zones:

- `Codable` models that rely on implicit decoding behavior
- Objective-C bridges that weaken Swift’s type guarantees

```swift
struct User: Codable {
    var id: Int
    var name: String?
}

let result = obj.perform(NSSelectorFromString(userInput))
```

Prefer explicit `CodingKeys`, typed adapters around legacy APIs, and avoid
`perform(_:)` on untrusted selectors.

## Detection Checklist

| Pattern | Risk |
|---|---|
| `!` unwrap | Crash on nil |
| `as!` | Crash on mismatch |
| `try!` | Crash on error |
| ignored `try?` | Silent failure |
| `String!` or IUO properties | Deferred crash |
| closure captures `self` strongly | Memory leak |
| shared mutable collections across tasks | Race condition |
| `NSString` range math on `String` data | Index mismatch |
| `&+`, `&-`, `&*` | Silent wraparound |
| `perform(_:)` or loose Objective-C bridging | Dynamic behavior bypass |

Use this as a detection lens, not a full Swift handbook.
