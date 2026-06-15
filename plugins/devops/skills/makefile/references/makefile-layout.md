# Makefile Layout

This reference covers the top-level order of a maintainable Makefile.

## Recommended Section Order

```makefile
# 1. Header and metadata
# 2. Special targets (.POSIX, .DELETE_ON_ERROR, .SUFFIXES)
# 3. User-overridable variables
# 4. Project-specific variables
# 5. .PHONY declarations
# 6. Default target
# 7. Build and pattern rules
# 8. Dependency includes
# 9. Test and install targets
# 10. Help target
```

Not every Makefile needs every section, but the order should still be obvious.

## Special Targets

```makefile
.POSIX:
.DELETE_ON_ERROR:
.SUFFIXES:
```

Use them deliberately:

- `.POSIX` when portability matters
- `.DELETE_ON_ERROR` to avoid leaving partial outputs behind
- `.SUFFIXES:` to clear legacy implicit suffix rules when you want tighter
  control

## Minimal Skeleton

```makefile
PROJECT := myapp
TARGET  := $(PROJECT)

CC      ?= cc
CFLAGS  ?= -Wall -Wextra -O2

.PHONY: all clean test help

all: $(TARGET)

$(TARGET): $(OBJECTS)
	$(CC) $^ -o $@

clean:
	$(RM) $(OBJECTS) $(TARGET)
```

## Rules

- Keep the overall section order stable across projects.
- Make the default target visible near the top.
- Group safety and policy targets before complex build logic if they apply to
  the whole file.
