# Target Dependencies and Pattern Rules

This reference covers the rule mechanics that control rebuild behavior.

## Basic Dependencies

```makefile
program: main.o utils.o
	$(CC) $^ -o $@

main.o: main.c common.h
	$(CC) -c $< -o $@
```

Use ordinary prerequisites when the target should rebuild if the prerequisite
changes.

## Order-Only Prerequisites

Use `|` when the prerequisite must exist but should not force rebuilds because
its timestamp changes.

```makefile
$(BUILDDIR):
	mkdir -p $@

$(BUILDDIR)/%.o: $(SRCDIR)/%.c | $(BUILDDIR)
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@
```

This is the right pattern for directories and other setup steps.

## Pattern Rules

```makefile
%.o: %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@

$(OBJDIR)/%.o: $(SRCDIR)/%.c
	@mkdir -p $(@D)
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@
```

Pattern rules reduce repetition when many files share the same transform.

## Static and Target-Specific Variants

```makefile
objects := main.o utils.o helper.o

$(objects): CFLAGS += -I./include

main.o utils.o helper.o: common.h
```

Use target-specific variables when one target family needs extra flags without
changing the whole Makefile.

## Automatic Dependency Generation

```makefile
$(OBJDIR)/%.o: $(SRCDIR)/%.c
	@mkdir -p $(@D)
	$(CC) $(CPPFLAGS) $(CFLAGS) -MMD -MP -c $< -o $@

-include $(DEPENDS)
```

`-MMD -MP` is the common approach for C and C++ dependency generation.

## Rules

- Fix dependency shape before adding shell-level rebuild workarounds.
- Use order-only prerequisites for directories and setup artifacts.
- Prefer one clear pattern rule over many copy-pasted explicit rules.
