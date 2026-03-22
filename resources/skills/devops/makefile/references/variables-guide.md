# Makefile Variables Guide

This guide covers variable definition, assignment operators, automatic variables, standard GNU variables, and best practices for variable management in Makefiles.

## Variable Assignment Operators

Make supports four assignment operators, each with different behavior:

### 1. Recursive Assignment (=)

```makefile
# Evaluated every time the variable is used
FILES = $(wildcard *.c)
OBJECTS = $(FILES:.c=.o)

# Each use of $(OBJECTS) re-expands $(FILES) and re-runs wildcard
target: $(OBJECTS)
	$(CC) $(OBJECTS) -o target
```

**Characteristics:**
- Right-hand side evaluated every time variable is used
- Can reference variables defined later
- Can cause infinite recursion
- Less efficient for frequently-used variables

**When to use:**
- Variables that reference other variables that might change
- Simple string values
- When you need delayed evaluation

### 2. Simple Assignment (:=)

```makefile
# Evaluated once when defined
FILES := $(wildcard *.c)
OBJECTS := $(FILES:.c=.o)

# $(OBJECTS) contains the fixed list from definition time
target: $(OBJECTS)
	$(CC) $(OBJECTS) -o target
```

**Characteristics:**
- Right-hand side evaluated immediately
- More efficient for computed values
- Cannot reference variables defined later
- Prevents infinite recursion

**When to use:**
- Variables with computed values (wildcards, substitutions)
- Frequently-referenced variables
- Most project-specific variables (SOURCES, OBJECTS, TARGET)

### 3. Conditional Assignment (?=)

```makefile
# Only assigns if variable is not already defined
CC ?= gcc
CFLAGS ?= -Wall -O2
PREFIX ?= /usr/local

# Users can override:
# make CC=clang
# export CC=clang; make
```

**Characteristics:**
- Assigns only if variable undefined or empty
- Respects environment variables
- Respects command-line overrides
- Essential for user-configurable variables

**When to use:**
- User-overridable variables (CC, CFLAGS, PREFIX)
- Default values that users might want to change
- All tool and configuration variables

### 4. Append Assignment (+=)

```makefile
# Append to existing value
CFLAGS ?= -Wall -O2
CFLAGS += -I./include
CFLAGS += -DDEBUG

# Result: CFLAGS = -Wall -O2 -I./include -DDEBUG
```

**Characteristics:**
- Adds to existing variable value
- Preserves type of original assignment (= vs :=)
- Automatically adds space between values

**When to use:**
- Adding project-specific flags to user flags
- Building lists incrementally
- Extending default values

## Comparison of Assignment Operators

```makefile
# Recursive (=): Re-evaluated each use
VAR1 = $(shell date)
# VAR1 changes every time it's used!

# Simple (:=): Evaluated once
// ... (8 lines trimmed)
VAR4 := first
VAR4 += second
# VAR4 = "first second"
```

## Standard GNU Variables

GNU Coding Standards define standard variable names that should be used:

### Compiler and Tools

```makefile
# C Compiler
CC ?= gcc

# C++ Compiler
CXX ?= g++
// ... (27 lines trimmed)

# pkg-config
PKG_CONFIG ?= pkg-config
```

### Compiler Flags

```makefile
# C Preprocessor flags (for includes, defines)
CPPFLAGS ?=

# C Compiler flags
CFLAGS ?= -Wall -Wextra -O2
// ... (12 lines trimmed)

# Lex/Flex flags
LFLAGS ?=
```

**Best practices for flags:**

```makefile
# Preserve user-defined flags
CFLAGS ?= -Wall -Wextra -O2
# Add project-specific flags
CFLAGS += -I./include -I./src
CFLAGS += -DPROJECT_VERSION=\"$(VERSION)\"

# Use pkg-config for libraries
CFLAGS += $(shell $(PKG_CONFIG) --cflags openssl)
LDLIBS += $(shell $(PKG_CONFIG) --libs openssl)
```

### Installation Directories

```makefile
# Installation prefix
PREFIX ?= /usr/local

# Executable prefix (usually same as PREFIX)
EXEC_PREFIX ?= $(PREFIX)
// ... (33 lines trimmed)

# DESTDIR for staged installations (package building)
DESTDIR ?=
```

**Usage in install target:**

```makefile
install: $(TARGET)
	$(INSTALL) -d $(DESTDIR)$(BINDIR)
	$(INSTALL_PROGRAM) $(TARGET) $(DESTDIR)$(BINDIR)/
	$(INSTALL) -d $(DESTDIR)$(LIBDIR)
	$(INSTALL_DATA) lib$(PROJECT).a $(DESTDIR)$(LIBDIR)/
	$(INSTALL) -d $(DESTDIR)$(MAN1DIR)
	$(INSTALL_DATA) docs/$(PROJECT).1 $(DESTDIR)$(MAN1DIR)/
```

## Automatic Variables

Automatic variables are set by make for each rule:

### Basic Automatic Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `$@` | Target file name | `hello` in rule for `hello` |
| `$<` | First prerequisite | `hello.c` in `hello.o: hello.c` |
| `$^` | All prerequisites (no duplicates) | `hello.o utils.o` |
| `$+` | All prerequisites (with duplicates) | Rarely needed |
| `$?` | Prerequisites newer than target | For conditional rebuild |
| `$*` | Stem of pattern match | `hello` in `%.o: %.c` |

### Directory and File Components

| Variable | Description |
|----------|-------------|
| `$(@D)` | Directory part of `$@` |
| `$(@F)` | File part of `$@` |
| `$(<D)` | Directory part of `$<` |
| `$(<F)` | File part of `$<` |
| `$(*D)` | Directory part of `$*` |
| `$(*F)` | File part of `$*` |
| `$(^D)` | Directory parts of `$^` |
| `$(^F)` | File parts of `$^` |

### Examples

```makefile
# Basic usage
hello: hello.o utils.o
	$(CC) $(LDFLAGS) $^ -o $@
	# Expands to: gcc -o hello hello.o utils.o
// ... (9 lines trimmed)
	$(CC) $(CFLAGS) -c $< -o $@
	# $(@D) = "build"
```

### Advanced Automatic Variables Usage

```makefile
# Dependency generation with automatic variables
$(OBJDIR)/%.o: $(SRCDIR)/%.c
	@mkdir -p $(@D)
	$(CC) $(CPPFLAGS) $(CFLAGS) \
		-MMD -MP \
		-MF $(@:.o=.d) \
		-c $< -o $@
	# $@ = build/obj/main.o
	# $< = src/main.c
	# $(@:.o=.d) = build/obj/main.d
```

## Variable Substitution and Functions

### Pattern Substitution

```makefile
# $(var:pattern=replacement)
SOURCES := src/main.c src/utils.c src/helper.c
OBJECTS := $(SOURCES:.c=.o)
# OBJECTS = src/main.o src/utils.o src/helper.o

OBJECTS := $(SOURCES:src/%.c=build/%.o)
# OBJECTS = build/main.o build/utils.o build/helper.o
```

### Text Functions

```makefile
# $(wildcard pattern)
SOURCES := $(wildcard src/*.c)

# $(patsubst pattern,replacement,text)
OBJECTS := $(patsubst %.c,%.o,$(SOURCES))
// ... (24 lines trimmed)

# $(addsuffix suffix,names...)
OBJ_FILES := $(addsuffix .o,$(NAMES))
```

### Shell Function

```makefile
# $(shell command)
GIT_VERSION := $(shell git describe --tags --always 2>/dev/null)
DATE := $(shell date +%Y-%m-%d)
CPU_COUNT := $(shell nproc 2>/dev/null || echo 1)

# Use := to evaluate once
VERSION := $(shell cat VERSION.txt)
```

### Conditional Functions

```makefile
# $(if condition,then-part,else-part)
DEBUG := 1
CFLAGS := $(if $(DEBUG),-g -O0,-O2)

# $(or conditions...)
CC := $(or $(CC),gcc)

# $(and conditions...)
BUILD_TESTS := $(and $(ENABLE_TESTS),$(HAVE_CHECK))
```

## Environment Variables

### Interaction with Environment

```makefile
# Make variables override environment by default
CC = gcc  # Overrides CC from environment

# Use ?= to respect environment
// ... (6 lines trimmed)
# Unexport variables
unexport INTERNAL_VAR
```

### Checking Environment Variables

```makefile
# Check if variable is defined
ifndef CC
CC := gcc
endif

# Check if variable is empty
ifeq ($(strip $(CC)),)
$(error CC is not defined)
endif
```

## Target-Specific Variables

```makefile
# Variables can be set for specific targets
debug: CFLAGS += -g -O0 -DDEBUG
debug: $(TARGET)

release: CFLAGS += -O3 -DNDEBUG
release: $(TARGET)

# Pattern-specific variables
tests/%: CFLAGS += -DTESTING
tests/%: LDLIBS += -lcheck
```

## Best Practices

### 1. Variable Naming

```makefile
# Use UPPERCASE for user-overridable variables
CC ?= gcc
PREFIX ?= /usr/local

// ... (5 lines trimmed)
SOURCES := $(wildcard src/*.c)  # Good
S := $(wildcard src/*.c)         # Bad
```

### 2. Variable Organization

```makefile
# Group related variables
# ============================================
# User Configuration
# ============================================
// ... (8 lines trimmed)
VERSION := 1.0.0
SOURCES := $(wildcard src/*.c)
```

### 3. Preserve User Flags

```makefile
# WRONG: Overwrites user flags
CFLAGS = -Wall -O2

# RIGHT: Provides default, respects user override
CFLAGS ?= -Wall -O2

# Add project-specific flags
CFLAGS += -I./include
```

### 4. Use pkg-config

```makefile
# WRONG: Hardcoded paths
CFLAGS += -I/usr/include/openssl
LDLIBS += -L/usr/lib -lssl -lcrypto

# RIGHT: Use pkg-config
PKG_CONFIG ?= pkg-config
CFLAGS += $(shell $(PKG_CONFIG) --cflags openssl)
LDLIBS += $(shell $(PKG_CONFIG) --libs openssl)
```

### 5. Use := for Computed Values

```makefile
# WRONG: Re-computes every use (slow)
SOURCES = $(wildcard src/*.c)
OBJECTS = $(SOURCES:.c=.o)

# RIGHT: Computes once (fast)
SOURCES := $(wildcard src/*.c)
OBJECTS := $(SOURCES:.c=.o)
```

## Complete Example

```makefile
# ============================================
# User-Overridable Variables
# ============================================
CC ?= gcc
CFLAGS ?= -Wall -Wextra -O2
// ... (52 lines trimmed)

release: CFLAGS += -O3 -DNDEBUG -s
release: $(TARGET)
```

## References

- [GNU Make Manual - Variables](https://www.gnu.org/software/make/manual/html_node/Using-Variables.html)
- [GNU Make Manual - Automatic Variables](https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html)
- [GNU Coding Standards - Makefile Conventions](https://www.gnu.org/prep/standards/html_node/Makefile-Conventions.html)