# Dynamic Languages

This group covers PHP, JavaScript or TypeScript, Python, and Ruby.

## PHP

### Loose Comparison

```php
"0e123" == "0e456";  // true
"0" == false;        // true
```

Use strict comparison for any auth, token, or signature path.

### Variable Variables and `extract`

```php
$$name = $_GET['value'];
extract($_POST);
```

These helpers let untrusted input create or overwrite local variables.

### `unserialize`

Untrusted deserialization is a direct object-instantiation footgun with gadget-chain risk.

## JavaScript / TypeScript

### Coercive Equality

```javascript
"0" == false
[] == false
```

Use `===` and avoid APIs that depend on broad coercion for security decisions.

### Prototype Pollution

Merging untrusted objects into normal objects can poison `__proto__` or constructor paths for the whole process.

### Regex DoS

Nested quantifiers and overlapping alternatives can freeze the event loop under attacker-controlled input.

### `parseInt` Without a Radix

Always pass the radix explicitly when parsing user input.

## Python

### Mutable Default Arguments

```python
def append_to(item, target=[]):
    target.append(item)
    return target
```

State leaks across calls, which becomes dangerous when the default stores permissions, policy state, or request data.

### Dynamic Execution

`eval`, `exec`, and dynamic `compile` are obvious footguns. Review templating and plugin systems for disguised versions of the same pattern.

### Late-Bound Closures

Loop variables in closures are captured by reference, which creates subtle policy or handler bugs unless the current value is bound explicitly.

### Identity vs Equality

`is` checks object identity, not value equality. That distinction matters when code appears to work because of interning.

## Ruby

### Dynamic Dispatch

`eval`, `send`, `public_send`, and `constantize` make attacker-controlled dispatch too easy.

### `YAML.load`

Use `safe_load` for untrusted data. Unsafe YAML loading is the Ruby equivalent of unsafe generic deserialization.

### Mass Assignment

Framework helpers that assign every parameter at once make privilege fields too easy to smuggle in.
