# Entity Relationship Diagrams (ERD)

ERDs model database schemas, showing tables (entities), their columns (attributes), and relationships between tables. Essential for database design and documentation.

## Basic Syntax

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
```

## Defining Entities

```mermaid
erDiagram
    CUSTOMER
    ORDER
    PRODUCT
```

## Entity Attributes

Define columns with type and constraints:

```mermaid
erDiagram
    CUSTOMER {
        int id PK
        string email UK
        string name
        string phone
        datetime created_at
    }
```

**Attribute format:** `type name constraints`

**Common constraints:**
- `PK` - Primary Key
- `FK` - Foreign Key
- `UK` - Unique Key
- `NN` - Not Null

## Relationships

### Relationship Symbols

**Cardinality indicators:**
- `||` - Exactly one
- `|o` - Zero or one
- `}{` - One or many
- `}o` - Zero or many

**Relationship line:**
- `--` - Non-identifying relationship
- `..` - Identifying relationship (rare in practice)

### Common Relationships

```mermaid
erDiagram
    %% One-to-One
    USER ||--|| PROFILE : has
    
    %% One-to-Many
    CUSTOMER ||--o{ ORDER : places
    
    %% Many-to-Many (with junction table)
    STUDENT }o--o{ COURSE : enrolls
    STUDENT ||--o{ ENROLLMENT : has
    COURSE ||--o{ ENROLLMENT : includes
    
    %% Optional Relationships
    EMPLOYEE |o--o{ DEPARTMENT : manages
```

### Relationship with Labels

```mermaid
erDiagram
    AUTHOR ||--o{ BOOK : writes
    BOOK }o--|| PUBLISHER : "published by"
    READER }o--o{ BOOK : reads
```

## Data Types

Use standard database types:
- `int`, `bigint`, `smallint`
- `varchar`, `text`, `char`
- `decimal`, `float`, `double`
- `boolean`, `bool`
- `date`, `datetime`, `timestamp`
- `json`, `jsonb`
- `uuid`
- `blob`, `bytea`

## Comprehensive Example: E-Commerce Database

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER ||--o{ REVIEW : writes
    CUSTOMER ||--o{ ADDRESS : has
    ORDER ||--|{ LINE_ITEM : contains
// ... (97 lines trimmed)
        timestamp estimated_delivery
        timestamp actual_delivery
    }
```

## Blog Platform Schema

```mermaid
erDiagram
    USER ||--o{ POST : creates
    USER ||--o{ COMMENT : writes
    POST ||--o{ COMMENT : receives
    POST }o--o{ TAG : tagged_with
// ... (68 lines trimmed)
        bigint likeable_id "NOT NULL"
        timestamp created_at "DEFAULT NOW()"
    }
```

## Social Media Schema

```mermaid
erDiagram
    USER ||--o{ POST : creates
    USER ||--o{ FOLLOW : follows
    USER ||--o{ FOLLOW : "followed by"
    POST ||--o{ LIKE : receives
// ... (93 lines trimmed)
        boolean is_private "DEFAULT FALSE"
        timestamp created_at "DEFAULT NOW()"
    }
```

## Best Practices

1. **Name entities in UPPERCASE** - Convention for clarity
2. **Use singular names** - `USER` not `USERS`, `ORDER` not `ORDERS`
3. **Define all constraints** - Document PKs, FKs, UKs, NOT NULL
4. **Show cardinality accurately** - Be precise about one-to-many vs many-to-many
5. **Include timestamps** - created_at, updated_at for auditing
6. **Document computed columns** - Mark calculated/derived values
7. **Add meaningful comments** - Use quotes for constraints and descriptions
8. **Consider junction tables** - Explicitly model many-to-many relationships
9. **Use appropriate types** - Match database-specific types
10. **Show indexes** - Document UK (unique keys) beyond PKs

## Common Patterns

### Self-Referencing (Hierarchical)
```mermaid
erDiagram
    CATEGORY ||--o{ CATEGORY : "parent of"
    
    CATEGORY {
        uuid id PK
        varchar name "NOT NULL"
        uuid parent_id FK "NULLABLE"
    }
```

### Junction Table (Many-to-Many)
```mermaid
erDiagram
    STUDENT }o--o{ COURSE : enrolls
    STUDENT ||--o{ ENROLLMENT : has
    COURSE ||--o{ ENROLLMENT : includes
    
// ... (13 lines trimmed)
        uuid id PK
        varchar title "NOT NULL"
    }
```

### Polymorphic Relationship
```mermaid
erDiagram
    COMMENT {
        uuid id PK
        uuid user_id FK
        varchar commentable_type "NOT NULL"
// ... (10 lines trimmed)
        uuid id PK
        varchar title
    }
```

### Soft Deletes
```mermaid
erDiagram
    USER {
        uuid id PK
        varchar email UK
        varchar name
        timestamp deleted_at "NULLABLE"
    }
```

### Audit Trail
```mermaid
erDiagram
    DOCUMENT ||--o{ DOCUMENT_VERSION : has
    
    DOCUMENT {
        uuid id PK
// ... (9 lines trimmed)
        uuid modified_by FK
        timestamp created_at "DEFAULT NOW()"
    }
```

## Tips for Database Design

1. **Normalize appropriately** - Balance normalization with query performance
2. **Use surrogate keys** - UUID or auto-increment integers as PKs
3. **Index foreign keys** - Essential for join performance
4. **Plan for soft deletes** - Add deleted_at columns instead of hard deletes
5. **Version critical data** - Maintain history for important entities
6. **Set appropriate defaults** - created_at, status, boolean flags
7. **Consider denormalization** - Counts and cached values for performance
8. **Use enum/check constraints** - Enforce valid values at database level
