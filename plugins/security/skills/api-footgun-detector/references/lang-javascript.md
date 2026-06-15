# JavaScript and TypeScript Sharp Edges

Use this reference for JavaScript or TypeScript behaviors that routinely turn
into security bugs.

## High-Risk Language Traps

- loose equality and coercion
- prototype pollution via object merging or bracket access
- ReDoS from catastrophic regexes
- dynamic code execution through `eval`, `Function`, or string timers
- async flows that drop errors or race on missing `await`
- unsafe TypeScript escapes such as `any`, unchecked assertions, or fake type
  guards

## Review Checklist

- replace `==` with `===`
- reject `__proto__`, `constructor`, and `prototype` keys in merge paths
- review complex regexes for nested quantifiers or overlap
- ban dynamic code execution on untrusted input
- prefer `Object.hasOwn` over prototype-chain checks
- treat `as Type` and non-null assertions as code-review hotspots

## Quick Examples

```javascript
// bad
obj[userInput] = value;

// better
if (["__proto__", "constructor", "prototype"].includes(userInput)) {
  throw new Error("Dangerous key");
}
```

```javascript
// bad
setTimeout(userInput, 1000);

// better
setTimeout(() => runTask(), 1000);
```

Keep this file security-anchored. Generic JS style issues belong elsewhere.
