# Makefile Rules and Modularization

This reference covers the rule-level organization choices that make large
Makefiles maintainable.

## Pattern Rules

```makefile
$(OBJDIR)/%.o: $(SRCDIR)/%.c
	@mkdir -p $(@D)
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@
```

Prefer pattern rules over long sequences of repeated explicit rules when the
transformation is consistent.

## Includes

Split large Makefiles only when the resulting structure stays easy to follow.

```makefile
include config.mk
include rules.mk
include targets.mk
```

Typical split:

- `config.mk` for variables
- `rules.mk` for shared build logic
- `targets.mk` for public targets

## Conditional Includes

```makefile
-include local.mk
```

Use optional includes for local overrides or generated dependency files. Avoid
turning required project structure into silent optional files.

## Multi-Directory Organization

For larger trees, prefer one non-recursive Makefile with clear source/build
directories over recursive `make` across many subdirectories.

```makefile
SRCDIR := src
OBJDIR := build/obj

SOURCES := $(wildcard $(SRCDIR)/**/*.c)
OBJECTS := $(SOURCES:$(SRCDIR)/%.c=$(OBJDIR)/%.o)
```

Recursive make is sometimes acceptable, but it usually hides dependencies and
makes rebuild behavior harder to reason about.

## Recipe Formatting

```makefile
test:
	@echo "Running tests"
	./run_tests.sh
```

Rules:

- Recipes use tabs, not spaces.
- Use `@` only when hiding the command improves readability.
- Use shell conditionals sparingly; prefer declarative dependencies first.
