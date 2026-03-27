# Entity Relationship Diagrams

Use Mermaid ERDs to show tables, attributes, and cardinality clearly.

## Basic Syntax

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
```

## Entities and Attributes

Define attributes as `type name constraints`:

```mermaid
erDiagram
    CUSTOMER {
        uuid id PK
        string email UK
        string name
        datetime created_at
    }
```

Common markers:

- `PK` primary key
- `FK` foreign key
- `UK` unique key
- `NN` not null

## Relationship Symbols

- `||` exactly one
- `|o` zero or one
- `}|` one or many
- `}o` zero or many

Use labels for the domain verb:

```mermaid
erDiagram
    AUTHOR ||--o{ BOOK : writes
    BOOK }o--|| PUBLISHER : published_by
```

## Compact Example

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : referenced_by

    CUSTOMER {
        uuid id PK
        string email UK
    }

    ORDER {
        uuid id PK
        uuid customer_id FK
        datetime created_at
    }

    PRODUCT {
        uuid id PK
        string name
        decimal price
    }

    LINE_ITEM {
        uuid order_id FK
        uuid product_id FK
        int quantity
    }
```

## Practical Rules

- Use singular entity names.
- Show junction tables explicitly for many-to-many relationships.
- Model the cardinality you actually enforce, not the one you hope to enforce.
- Keep the diagram focused on schema structure, not every possible business
  rule.
