# Java Sharp Edges

Use this reference when scanning Java for APIs and language behaviors that look
safe at the call site but hide runtime failure, security exposure, or
concurrency surprises.

## Equality and Boxing

Reference equality and boxed-value caching cause subtle bugs.

```java
String a = new String("hello");
String b = new String("hello");
boolean same = (a == b);

Integer p = 128;
Integer q = 128;
boolean boxedSame = (p == q);
```

Prefer `.equals()` or `Objects.equals()` for value checks.

## Deserialization and Reflection

These APIs deserve direct review whenever untrusted input is involved.

```java
ObjectInputStream ois = new ObjectInputStream(untrustedInput);
Object obj = ois.readObject();

Field field = target.getClass().getDeclaredField("secret");
field.setAccessible(true);
field.set(target, value);
```

Flag:
- `ObjectInputStream.readObject()`
- broad reflective access with `setAccessible(true)`
- framework hooks that deserialize or instantiate classes from data

## Nullability and Optional Misuse

Java still makes it easy to move null failure to runtime.

```java
Integer value = null;
int primitive = value;

String name = user.getProfile().getSettings().getName();
Optional.of(null);
optional.get();
```

Prefer `Optional.ofNullable`, narrow chaining, and explicit null boundaries
around external data or framework return values.

## Exception and Resource Handling

Two common footguns:

```java
try {
    sensitiveOperation();
} catch (Exception e) {
    return defaultValue;
}

FileInputStream fis = new FileInputStream(file);
process(fis);
fis.close();
```

- wide catches hide programmer bugs and security failures
- manual resource management leaks or masks earlier exceptions

Prefer targeted catches and try-with-resources.

## Strings, Regex, and Precision

Small syntax choices change behavior sharply.

```java
"a.b.c".split(".");
new BigDecimal(0.1);
```

Flag:
- `split(".")` and similar unescaped regex delimiters
- `String +=` in loops
- `new BigDecimal(double)`
- floating point in money or policy logic

## Thread Safety

Shared mutable objects still show up in otherwise ordinary code.

```java
static SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
Map<String, String> cache = new HashMap<>();
```

Treat these as review triggers:
- `SimpleDateFormat` or other mutable formatters shared across threads
- `HashMap` or collections mutated from concurrent code without protection
- static mutable caches without clear synchronization

## XML and Parser Defaults

Parser defaults can expose XXE or entity-expansion problems.

```java
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
```

Review the surrounding configuration. Safe XML parsing usually needs explicit
external-entity disabling and conservative parser settings.

## Detection Checklist

| Pattern | Risk |
|---|---|
| `==` with objects | Reference comparison bug |
| boxed numeric comparison with `==` | Cache-boundary confusion |
| `ObjectInputStream.readObject()` | Deserialization RCE |
| empty catch or `catch (Exception e)` | Hidden failure |
| `String +=` in loops | Performance and memory churn |
| `split(".")` | Regex interpretation bug |
| shared `SimpleDateFormat` | Thread-unsafety |
| resources outside try-with-resources | Leak or masked exception |
| `new BigDecimal(double)` | Precision loss |
| default XML parser factory use | XXE and parser risk |

Keep the analysis centered on misuse-resistant API choices, not general Java
reference material.
