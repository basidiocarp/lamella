# File Ownership Decision Framework

How to assign file ownership for parallel development.

## Process

1. Map all files that need creation or modification
2. Cluster by directory proximity, functional relationship, or layer
3. Assign clusters to owners -- no file in multiple clusters, each cluster internally cohesive
4. Define interface points -- shared types, API contracts, event contracts

## Ownership by Project Type

### React/Next.js Frontend

```
implementer-1: src/components/{feature}/
implementer-2: src/hooks/{feature}/
implementer-3: src/api/{feature}/
shared:        src/types/{feature}.ts (lead-owned)
```

### Express/Fastify Backend

```
implementer-1: src/routes/ + src/controllers/
implementer-2: src/services/ + src/validators/
implementer-3: src/models/ + src/repositories/
shared:        src/types/{feature}.ts (lead-owned)
```

### Python Django

```
implementer-1: views.py, urls.py, forms.py
implementer-2: models.py, serializers.py, managers.py
implementer-3: tests/
shared:        types.py (lead-owned)
```

## Conflict Resolution

1. Preferred: split the file so each part has one owner
2. If unsplittable: designate one owner, others send change requests
3. Last resort: sequential access (A finishes, then B takes over)
4. Never: let both modify the same file simultaneously
