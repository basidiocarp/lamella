# Makefile Patterns Guide

Use these patterns when a Makefile needs reusable build logic rather than one-off explicit targets.

## Pattern Rules

```makefile
%.o: %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@
```

Use pattern rules when:
- many files follow the same transform
- source and output naming are predictable

With directories:

```makefile
build/obj/%.o: src/%.c
	@mkdir -p $(@D)
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@
```

## Static Pattern Rules

Use static pattern rules when the target list is known and you want more control.

```makefile
OBJECTS := main.o utils.o helper.o

$(OBJECTS): %.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@
```

This is often clearer than broad implicit rules for a fixed set of outputs.

## Dependency Generation

Prefer automatic dependency files over manual header lists.

```makefile
DEPENDS := $(OBJECTS:.o=.d)

%.o: %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -MMD -MP -c $< -o $@

-include $(DEPENDS)
```

This keeps header changes tracked without hand-maintained dependency blocks.

## Common Project Shapes

### Simple Single-Directory Project

```makefile
TARGET := myapp
SOURCES := $(wildcard *.c)
OBJECTS := $(SOURCES:.c=.o)

$(TARGET): $(OBJECTS)
	$(CC) $(LDFLAGS) $^ -o $@
```

### Multi-Directory Project

```makefile
SRCDIR := src
BUILDDIR := build
SOURCES := $(wildcard $(SRCDIR)/*.c)
OBJECTS := $(SOURCES:$(SRCDIR)/%.c=$(BUILDDIR)/%.o)
```

Use this when artifacts should stay out of the source tree.

## Practical Rule

```text
Use pattern rules for repeated transforms
Use static patterns for known file sets
Generate dependencies automatically
Keep project shape explicit once directory layout gets non-trivial
```
