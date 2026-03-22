# Domain Expertise Structure

Guide for creating domain expertise skills that work efficiently with create-plans.

## Purpose

Domain expertise provides context-specific knowledge (Swift/macOS patterns, Next.js conventions, Unity workflows) that makes plans more accurate and actionable.

**Critical:** Domain skills must be context-efficient. Loading 20k+ tokens of references defeats the purpose.

## File Structure

```
~/.claude/skills/expertise/[domain-name]/
├── SKILL.md              # Core principles + references_index (5-7k tokens)
├── references/           # Selective loading based on phase type
│   ├── always-useful.md  # Conventions, patterns used in all phases
│   ├── database.md       # Database-specific guidance
│   ├── ui-layout.md      # UI-specific guidance
│   ├── api-routes.md     # API-specific guidance
│   └── ...
└── workflows/            # Optional: domain-specific workflows
    └── ...
```

## SKILL.md Template

```markdown
---
name: [domain-name]
description: [What this expertise covers]
---

// ... (43 lines trimmed)
[If domain has specific workflows, list them here]
[These are NOT auto-loaded - only used when specifically invoked]
</workflows>
```

## Reference File Guidelines

Each reference file should be:

**1. Focused** - Single concern (database patterns, UI layout, API design)

**2. Actionable** - Contains patterns Claude can directly apply
```markdown
# Database Patterns

## Table Naming
- Singular nouns (User, not Users)
- snake_case for SQL, PascalCase for models

## Common Patterns
- Soft deletes: deleted_at timestamp
- Audit columns: created_at, updated_at
- Foreign keys: [table]_id format
```

**3. Sized appropriately** - 500-2000 lines (~1-5k tokens)
   - Too small: Not worth separate file
   - Too large: Split into more focused files

**4. Self-contained** - Can be understood without reading other references

## Context Efficiency Examples

**Bad (old approach):**
```
Load all references: 10,728 lines = ~27k tokens
Result: 50% context before planning starts
```

**Good (new approach):**
```
Load SKILL.md: ~5k tokens
Planning UI phase → load ui-layout.md + conventions.md: ~7k tokens
Total: ~12k tokens (saves 15k for workspace)
```

## Phase Type Classification

Help create-plans determine which references to load:

**Common phase types:**
- **Foundation/Setup** - Project structure, dependencies, configuration
- **Database/Data** - Schema, models, migrations, queries
- **API/Backend** - Routes, controllers, business logic, auth
- **UI/Frontend** - Components, layouts, styling, interactions
- **Integration** - External APIs, system services, third-party SDKs
- **Features** - Domain-specific functionality
- **Polish** - Performance, accessibility, error handling

**References should map to these types** so create-plans can load the right context.

## Migration Guide

If you have an existing domain skill with many references:

1. **Audit references** - What's actually useful vs. reference dumps?

2. **Consolidate principles** - Move core patterns into SKILL.md principles section

3. **Create references_index** - Map phase types to relevant references

4. **Test loading** - Verify you can plan a phase with <15k token overhead

5. **Iterate** - Adjust groupings based on actual planning needs

## Example: macos-apps

**Before (inefficient):**
- 20 reference files
- Load all: 10,728 lines (~27k tokens)

**After (efficient):**

SKILL.md contains:
- Swift/SwiftUI core principles
- macOS app architecture patterns
- Common patterns (MV VM, data flow)
- references_index mapping:
  - UI phases → swiftui-layout.md, appleHIG.md (~4k)
  - Data phases → core-data.md, swift-concurrency.md (~5k)
  - System phases → appkit-integration.md, menu-bar.md (~3k)
  - Always → swift-conventions.md (~2k)

**Result:** 5-12k tokens instead of 27k (saves 15-22k for planning)
