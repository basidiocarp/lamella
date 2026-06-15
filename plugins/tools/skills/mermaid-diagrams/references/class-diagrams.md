# Class Diagrams

Use Mermaid class diagrams for object models, domain relationships, and simple
type hierarchies.

## Basic Shape

```mermaid
classDiagram
    class BankAccount {
        +String owner
        -String accountNumber
        +deposit(amount)
        +getBalance() Decimal
    }
```

## Relationships

- `--` association
- `*--` composition
- `o--` aggregation
- `<|--` inheritance
- `<|..` implementation

Use multiplicity when it clarifies the model:

```mermaid
classDiagram
    Customer "1" --> "0..*" Order : places
    Order "1" *-- "1..*" LineItem : contains
```

## Good Uses

- domain model sketches
- service and entity relationships
- inheritance or interface structure

## Practical Rule

Class diagrams should explain structure, not every method in the codebase. Keep
members limited to the attributes and operations that matter to the discussion.
