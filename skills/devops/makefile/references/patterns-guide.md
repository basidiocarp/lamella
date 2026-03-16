# Makefile Patterns Guide

This guide covers pattern rules, static pattern rules, implicit rules, dependency generation, and common Makefile patterns for various project types.

## Pattern Rules

Pattern rules use `%` to match filenames and create generic build rules.

### Basic Pattern Rules

```makefile
# Compile .c files to .o files
%.o: %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@

// ... (5 lines trimmed)
%.i: %.c
	$(CC) $(CPPFLAGS) -E $< -o $@
```

### Pattern Rules with Directories

```makefile
# Source in src/, objects in build/obj/
build/obj/%.o: src/%.c
	@mkdir -p $(@D)
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@
// ... (7 lines trimmed)
	@mkdir -p $(@D)
	$(CC) -c $< -o $@
```

### Pattern Rule Variables

```makefile
# Use stem ($*) in pattern rules
%.pdf: %.tex
	pdflatex $*
	# Runs: pdflatex report (for report.tex -> report.pdf)
// ... (5 lines trimmed)
%.pdf: %.md
	pandoc $< -o $@
```

## Static Pattern Rules

More efficient and explicit than pattern rules for known file lists.

### Syntax

```makefile
$(targets): target-pattern: prereq-pattern
	recipe
```

### Basic Example

```makefile
OBJECTS := main.o utils.o helper.o

# Static pattern rule
$(OBJECTS): %.o: %.c
// ... (7 lines trimmed)
# helper.o: helper.c
#     $(CC) $(CFLAGS) -c helper.c -o helper.o
```

### With Directories

```makefile
SOURCES := $(wildcard src/*.c)
OBJECTS := $(SOURCES:src/%.c=build/obj/%.o)

$(OBJECTS): build/obj/%.o: src/%.c
	@mkdir -p $(@D)
	$(CC) $(CFLAGS) -c $< -o $@
```

### Multiple Dependencies

```makefile
# All objects depend on config.h
$(OBJECTS): %.o: %.c config.h
	$(CC) $(CFLAGS) -c $< -o $@

# Specific objects depend on additional headers
$(NETWORK_OBJS): %.o: %.c network.h common.h
	$(CC) $(CFLAGS) -c $< -o $@
```

## Implicit Rules

GNU Make has built-in implicit rules. You can use or override them.

### Common Built-in Rules

```makefile
# These rules are built into make:
# %.o: %.c
#     $(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@

# %.o: %.cpp
#     $(CXX) $(CPPFLAGS) $(CXXFLAGS) -c $< -o $@

# %: %.o
#     $(CC) $(LDFLAGS) $^ $(LDLIBS) -o $@
```

### Disabling Implicit Rules

```makefile
# Disable all built-in rules (recommended for explicit Makefiles)
.SUFFIXES:

# Re-enable specific patterns
.SUFFIXES: .c .o .h

# Or disable specific rules
%.o: %.c
# Empty recipe disables the built-in rule
```

### Custom Implicit Rules

```makefile
# Add your own implicit rules
%.o: %.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -MMD -MP -c $< -o $@

# Language-specific rules
%.o: %.cpp
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -MMD -MP -c $< -o $@

%.o: %.s
	$(AS) $(ASFLAGS) -c $< -o $@
```

## Dependency Generation

### Manual Dependencies (Avoid)

```makefile
# Tedious and error-prone
main.o: main.c common.h utils.h
utils.o: utils.c utils.h common.h
helper.o: helper.c helper.h common.h
```

### Automatic Dependency Generation

**Method 1: Embedded in compilation:**

```makefile
SOURCES := $(wildcard src/*.c)
OBJECTS := $(SOURCES:src/%.c=build/obj/%.o)
DEPENDS := $(OBJECTS:.o=.d)

// ... (5 lines trimmed)
# Include generated dependency files
-include $(DEPENDS)
```

**Flags explained:**
- `-MMD`: Generate dependency file (.d)
- `-MP`: Add phony targets for headers (prevents errors if header deleted)
- `-MF file`: Specify dependency file name (optional)

**Method 2: Separate dependency generation:**

```makefile
# Generate dependencies separately
%.d: %.c
	@$(CC) $(CPPFLAGS) -MM $< | sed 's,\($*\)\.o[ :]*,\1.o $@ : ,g' > $@

-include $(DEPENDS)
```

**Generated .d file example:**

```makefile
# main.d (generated from main.c)
build/obj/main.o build/obj/main.d: src/main.c include/common.h \
  include/utils.h
include/common.h:
include/utils.h:
```

## Common Project Patterns

### Pattern 1: Simple Single-Directory C Project

```makefile
CC ?= gcc
CFLAGS ?= -Wall -Wextra -O2

TARGET := myapp
SOURCES := $(wildcard *.c)
// ... (14 lines trimmed)

clean:
	$(RM) $(TARGET) $(OBJECTS) $(DEPENDS)
```

### Pattern 2: Multi-Directory C Project

```makefile
PROJECT := myapp
CC ?= gcc
CFLAGS ?= -Wall -Wextra -O2 -Iinclude

SRCDIR := src
// ... (22 lines trimmed)

clean:
	$(RM) -r $(BUILDDIR)
```

### Pattern 3: C++ Project with Libraries

```makefile
PROJECT := myapp
CXX ?= g++
CXXFLAGS ?= -Wall -Wextra -std=c++17 -O2

SRCDIR := src
// ... (47 lines trimmed)

clean:
	$(RM) -r $(BUILDDIR)
```

### Pattern 4: Mixed C/C++ Project

```makefile
PROJECT := mixed
CC ?= gcc
CXX ?= g++
CFLAGS ?= -Wall -O2
CXXFLAGS ?= -Wall -O2 -std=c++17
// ... (38 lines trimmed)

clean:
	$(RM) -r $(BUILDDIR)
```

### Pattern 5: Go Project

```makefile
PROJECT := myapp
GO ?= go
GOFLAGS ?=
PREFIX ?= /usr/local

// ... (35 lines trimmed)

mod-tidy:
	$(GO) mod tidy
```

### Pattern 6: Python Project

```makefile
PROJECT := mypackage
PYTHON ?= python3
PIP ?= $(PYTHON) -m pip

.PHONY: all build install develop test lint format clean
// ... (25 lines trimmed)
	$(RM) -r .pytest_cache/ .coverage htmlcov/
	find . -type d -name '__pycache__' -exec rm -r {} +
	find . -type f -name '*.pyc' -delete
```

### Pattern 7: Multi-Binary Project

```makefile
PROJECT := tools
CC ?= gcc
CFLAGS ?= -Wall -Wextra -O2

SRCDIR := src
// ... (37 lines trimmed)

clean:
	$(RM) -r $(BUILDDIR)
```

### Pattern 8: Docker Integration

```makefile
PROJECT := myapp
VERSION := 1.0.0
REGISTRY := docker.io
IMAGE := $(REGISTRY)/$(PROJECT):$(VERSION)
IMAGE_LATEST := $(REGISTRY)/$(PROJECT):latest
// ... (17 lines trimmed)

docker-clean:
	docker rmi $(IMAGE) $(IMAGE_LATEST) 2>/dev/null || true
```

## Advanced Patterns

### Pattern: Recursive Directory Processing

```makefile
# Find all .c files recursively
SOURCES := $(shell find src -name '*.c')

# Mirror directory structure in build/
OBJECTS := $(SOURCES:src/%.c=build/obj/%.o)
// ... (9 lines trimmed)

build/obj/%.o: src/%.c
	$(CC) $(CFLAGS) -c $< -o $@
```

### Pattern: Multiple Build Configurations

```makefile
BUILD_TYPES := debug release profile

.PHONY: all $(BUILD_TYPES) clean

all: release
// ... (15 lines trimmed)
$(TARGET): $(OBJECTS)
	@mkdir -p $(@D)
	$(CC) $(LDFLAGS) $^ $(LDLIBS) -o $@
```

### Pattern: Parallel Sub-Builds

```makefile
SUBDIRS := lib1 lib2 lib3

.PHONY: all $(SUBDIRS)

// ... (7 lines trimmed)
lib2: lib1
lib3: lib1 lib2
```

## Best Practices

1. **Use static pattern rules** for known file lists (more efficient)
2. **Generate dependencies automatically** (-MMD -MP)
3. **Create directories with order-only prerequisites**
4. **Disable built-in rules** (.SUFFIXES:) for explicit Makefiles
5. **Use pattern rules** for generic transformations
6. **Mirror source structure** in build directory
7. **Separate C and C++ compilation** in mixed projects
8. **Use -fPIC** when building shared libraries
9. **Include generated dependencies** with -include
10. **Test patterns** with make -n (dry run)

## References

- [GNU Make Manual - Pattern Rules](https://www.gnu.org/software/make/manual/html_node/Pattern-Rules.html)
- [GNU Make Manual - Static Pattern Rules](https://www.gnu.org/software/make/manual/html_node/Static-Pattern.html)
- [GNU Make Manual - Automatic Prerequisites](https://www.gnu.org/software/make/manual/html_node/Automatic-Prerequisites.html)