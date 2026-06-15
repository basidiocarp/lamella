# C4 Relationships and Boundaries

Use this reference for connections and scoped grouping.

## Relationships

```text
Rel(from, to, label)
Rel(from, to, label, ?techn)
BiRel(from, to, label)
Rel_U(from, to, label)
Rel_D(from, to, label)
Rel_L(from, to, label)
Rel_R(from, to, label)
RelIndex(index, from, to, label)
```

In `C4Dynamic`, sequence is determined by statement order, not the `RelIndex`
number.

## Boundaries

```text
Enterprise_Boundary(alias, label) { ... }
System_Boundary(alias, label) { ... }
Container_Boundary(alias, label) { ... }
Boundary(alias, label, ?type) { ... }
```

Use boundaries to show ownership or scope, not decorative nesting.
