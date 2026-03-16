# Makefile Best Practices

Comprehensive guide to writing professional, maintainable, and efficient Makefiles.

## Table of Contents

1. [Essential Special Targets](#essential-special-targets)
2. [File Organization](#file-organization)
3. [Target Declarations](#target-declarations)
4. [Variable Management](#variable-management)
5. [Recipe Best Practices](#recipe-best-practices)
6. [Dependency Management](#dependency-management)
7. [Performance Optimization](#performance-optimization)
8. [Portability](#portability)
9. [Documentation](#documentation)
10. [Security](#security)
11. [Advanced Patterns](#advanced-patterns)

## Modern Makefile Header (Recommended)

For modern, robust Makefiles, start with this recommended preamble from [Jacob Davis-Hansson](https://tech.davis-hansson.com/p/make/):

```makefile
# Modern Makefile Header
SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
```

Explanation:

| Setting | Purpose |
|---------|---------|
| `SHELL := bash` | Use bash instead of /bin/sh for modern shell features |
| `.ONESHELL:` | Run entire recipe in single shell (enables multi-line scripts) |
| `.SHELLFLAGS := -eu -o pipefail -c` | Stop on errors (-e), undefined vars (-u), pipe failures |
| `.DELETE_ON_ERROR:` | Delete target on recipe failure (prevents corrupt builds) |
| `--warn-undefined-variables` | Alert on undefined Make variable references |
| `--no-builtin-rules` | Disable built-in implicit rules for faster builds |

Note: This preamble is for GNU Make 4.0+. For maximum portability, use a simpler header.

## Essential Special Targets

GNU Make provides several special targets that should be used in professional Makefiles.

### .DELETE_ON_ERROR (Critical)

Always include `.DELETE_ON_ERROR:` at the top of your Makefile. This ensures partially built targets are deleted when a recipe fails, preventing corrupt builds.

```makefile
# CRITICAL: Delete target on recipe failure
.DELETE_ON_ERROR:

# Rest of Makefile follows...
```

Why it matters:
- Without this, a failed build leaves a partial/corrupt file
- Next `make` run sees the file exists and skips rebuilding
- Results in broken builds that are hard to debug

From the GNU Make Manual: *"This is almost always what you want make to do, but it is not historical practice; so for compatibility, you must explicitly request it."*

Exception: Use `.PRECIOUS` to protect specific targets that should be preserved even on error:

```makefile
.DELETE_ON_ERROR:
.PRECIOUS: expensive-to-rebuild.dat
```

### .PHONY (Always Required)

Declare non-file targets as phony to avoid conflicts and improve performance:

```makefile
.PHONY: all build clean test install
```

### .ONESHELL (For Multi-line Recipes)

Run entire recipe in a single shell invocation:

```makefile
.ONESHELL:

deploy:
	set -e
	echo "Deploying..."
	cd /app
	git pull
	./restart.sh
```

Without `.ONESHELL`, each line runs in a separate shell, so `cd` has no effect on subsequent lines.

### .SUFFIXES (For Performance)

Clear built-in suffix rules to speed up builds:

```makefile
# Disable all built-in suffix rules
.SUFFIXES:

# Only keep rules you need (optional)
.SUFFIXES: .c .o
```

GNU Make has ~90 built-in implicit rules. Clearing them speeds up rule resolution.

### Complete Special Targets Header

```makefile
# Modern Makefile Header
.DELETE_ON_ERROR:
.SUFFIXES:

.PHONY: all build clean test install deploy

# Your targets follow...
```

## File Organization

### Directory Structure

```makefile
# Organized Makefile structure
.PHONY: all clean test install

# Variables section
PROJECT := myapp
// ... (12 lines trimmed)
build: $(BUILD_DIR)/$(PROJECT)

# ... more targets
```

### Modular Organization

Use `include` for large projects:

```makefile
# Main Makefile
include config/variables.mk
include rules/build.mk
include rules/test.mk
include rules/deploy.mk

.PHONY: all
all: build test
```

### Namespace Targets

Use `/` as delimiter for namespaced targets:

```makefile
# Good: Namespaced targets
.PHONY: docker/build docker/push docker/clean
docker/build:
	docker build -t $(IMAGE) .
// ... (7 lines trimmed)
# Avoid: Flat namespace
.PHONY: docker-build docker-push docker-clean
```

## Target Declarations

### Always Declare .PHONY

Declare targets that don't create files as phony:

```makefile
# GOOD: Proper .PHONY declarations
.PHONY: all clean test install build deploy

all: build test

// ... (9 lines trimmed)

test:
	go test ./...
```

### Organize .PHONY Declarations

```makefile
# Group related phony targets
.PHONY: all build clean
.PHONY: test test-unit test-integration
.PHONY: install uninstall
.PHONY: docker/build docker/push docker/clean

# Or use a single declaration (mbake can organize this)
.PHONY: all build clean test test-unit test-integration install uninstall
```

### Default Target

First target is the default (or use .DEFAULT_GOAL):

```makefile
# Method 1: First target is default
.PHONY: all
all: build test

// ... (7 lines trimmed)
test:
	go test ./...
```

## Variable Management

### Variable Assignment Operators

Choose the right operator for your use case:

```makefile
# Simple assignment (=) - Recursive expansion (evaluated when used)
CFLAGS = -Wall $(OPTIMIZE)
OPTIMIZE = -O2
# CFLAGS will expand to: -Wall -O2 (recursive)

// ... (12 lines trimmed)
CFLAGS += -Wextra
CFLAGS += -O2
# CFLAGS = -Wall -Wextra -O2
```

### Use := for Most Variables

```makefile
# GOOD: Immediate expansion (predictable, faster)
BUILD_DIR := build
SRC_FILES := $(wildcard src/*.c)
TIMESTAMP := $(shell date +%s)

# AVOID: Recursive expansion (unpredictable, slower)
BUILD_DIR = build
SRC_FILES = $(wildcard src/*.c)  # Re-evaluated every time!
TIMESTAMP = $(shell date +%s)    # Shell called multiple times!
```

### Sane Defaults with ?=

```makefile
# Allow user/environment override
CC ?= gcc
CXX ?= g++
PREFIX ?= /usr/local
// ... (5 lines trimmed)
# make CC=clang         # Override CC
# PREFIX=/opt make      # Override via environment
```

### Variable Naming

```makefile
# GOOD: Clear, consistent naming
PROJECT_NAME := myapp
BUILD_DIR := build
SOURCE_FILES := $(wildcard src/*.c)
// ... (5 lines trimmed)
SRCS := $(wildcard src/*.c)
FLAGS := -Wall
```

## Recipe Best Practices

### Use Tabs, Not Spaces

```makefile
# GOOD: Tab character (required)
build:
	@echo "Building..."
	go build -o app

# BAD: Spaces (will fail)
build:
    @echo "Building..."
    go build -o app
```

Note: Makefiles require TAB characters for recipes. Configure your editor to use tabs for Makefiles.

### Error Handling

```makefile
# Method 1: Prefix with @ to suppress echo, - to ignore errors
clean:
	@echo "Cleaning build artifacts..."
	-rm -rf $(BUILD_DIR)
	@echo "Done!"
// ... (17 lines trimmed)
		echo "Deployment failed!"; \
		exit 1; \
	fi
```

### Multi-line Recipes

```makefile
# Use backslash for line continuation
build: $(SOURCES)
	@echo "Building $(PROJECT)..."; \
	mkdir -p $(BUILD_DIR); \
// ... (9 lines trimmed)
	done
	echo "All tests passed!"
```

### Silent vs Verbose Output

```makefile
# Use @ to suppress command echo
.PHONY: build
build:
	@echo "Building..."
	@$(CC) $(CFLAGS) -o app $(SOURCES)
// ... (13 lines trimmed)
# Usage:
# make build           # Silent
# make build VERBOSE=1 # Verbose
```

## Dependency Management

### Specify Dependencies Correctly

```makefile
# GOOD: Proper dependency chain
app: $(OBJECTS)
	$(CC) -o $@ $^

// ... (7 lines trimmed)
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@
```

### Auto-generate Dependencies (C/C++)

```makefile
# Automatic dependency generation
DEPDIR := .deps
DEPFLAGS = -MT $@ -MMD -MP -MF $(DEPDIR)/$*.d

// ... (6 lines trimmed)
# Include generated dependency files
-include $(patsubst %,$(DEPDIR)/%.d,$(basename $(SOURCES)))
```

### Order-Only Prerequisites

Use `|` for prerequisites that shouldn't trigger rebuilds:

```makefile
# Regular prerequisites trigger rebuild
$(BUILD_DIR)/app: $(SOURCES)
	$(CC) -o $@ $^

// ... (7 lines trimmed)
# Without |, updating BUILD_DIR timestamp would trigger app rebuild
# With |, app only rebuilds when SOURCES change
```

### VPATH for Source Organization

```makefile
# Search for prerequisites in multiple directories
VPATH = src:include:tests

# Or use vpath for specific patterns
// ... (7 lines trimmed)

# Make will find src/main.c and src/utils.c automatically
```

## Performance Optimization

### Use .PHONY for Performance

```makefile
# GOOD: Phony targets skip implicit rule search
.PHONY: clean test install

clean:
	rm -rf $(BUILD_DIR)

# BAD: Without .PHONY, Make checks for file existence
clean:
	rm -rf $(BUILD_DIR)
```

### Parallel Builds

```makefile
# Enable parallel builds (use -j flag)
# make -j8 build    # 8 parallel jobs

# For sequential targets, use .NOTPARALLEL
// ... (6 lines trimmed)
build-frontend: | build-backend
	npm run build
```

### Intermediate File Cleanup

```makefile
# Mark intermediate files for auto-deletion
.INTERMEDIATE: $(OBJECTS)

# Or mark files to keep through one build
// ... (7 lines trimmed)
	$(CC) -o $@ $^
# main.o and utils.o auto-deleted after successful build
```

### Avoid Redundant Shell Calls

```makefile
# BAD: Shell called every time variable is used
DATE = $(shell date +%Y%m%d)
VERSION = $(shell git describe --tags)

target1:
// ... (11 lines trimmed)

target2:
	echo $(DATE)  # Same cached value
```

## Portability

### POSIX Shell Compatibility

```makefile
# GOOD: POSIX-compatible commands
.PHONY: install
install:
	mkdir -p $(DESTDIR)$(PREFIX)/bin
// ... (5 lines trimmed)
	mkdir -p $(DESTDIR)$(PREFIX)/bin
	cp app $(DESTDIR)$(PREFIX)/bin/  # Missing -f for portability
```

### Cross-Platform Variables

```makefile
# Detect operating system
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
	PLATFORM := linux
	EXE_EXT :=
// ... (9 lines trimmed)

# Use platform-specific settings
APP := app$(EXE_EXT)
```

### Avoid Hard-Coded Paths

```makefile
# BAD: Hard-coded paths
install:
	cp app /usr/local/bin/
	cp docs/app.1 /usr/share/man/man1/
// ... (9 lines trimmed)
	install -d $(DESTDIR)$(MANDIR)/man1
	install -m 644 docs/app.1 $(DESTDIR)$(MANDIR)/man1/
```

## Documentation

### Comment Your Makefiles

```makefile
# Project: MyApp
# Description: Build system for MyApp project
# Author: Your Name
# Version: 1.0.0

// ... (23 lines trimmed)
test:
	@echo "Running tests..."
	@./scripts/run-tests.sh
```

### Help Target

```makefile
# Provide a help target
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make build    - Build the application"
// ... (19 lines trimmed)

clean: ## Remove build artifacts
	@rm -rf $(BUILD_DIR)
```

## Security

### Avoid Hardcoded Credentials

```makefile
# BAD: Hardcoded secrets
deploy:
	curl -H "Authorization: Bearer sk-1234567890" https://api.example.com/deploy

// ... (5 lines trimmed)
	fi
	curl -H "Authorization: Bearer $$API_TOKEN" https://api.example.com/deploy
```

### Validate Input Variables

```makefile
# Validate critical variables
.PHONY: deploy
deploy:
	@if [ -z "$(ENV)" ]; then \
// ... (7 lines trimmed)
	@echo "Deploying to $(ENV)..."
	./scripts/deploy.sh $(ENV)
```

### Safe Variable Expansion

```makefile
# BAD: Unsafe variable expansion
clean:
	rm -rf $(BUILD_DIR)/*  # Dangerous if BUILD_DIR is empty or /

# GOOD: Validate before dangerous operations
// ... (9 lines trimmed)
BUILD_DIR := build  # Never empty
clean:
	@test -d $(BUILD_DIR) && rm -rf $(BUILD_DIR)/* || true
```

## Advanced Patterns

### Pattern Rules

```makefile
# Pattern rule for object files
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

// ... (6 lines trimmed)
$(OBJECTS): %.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@
```

### Automatic Variables

```makefile
# $@ - Target name
# $< - First prerequisite
# $^ - All prerequisites
# $? - Prerequisites newer than target
# $* - Stem of pattern rule
// ... (8 lines trimmed)
#   $@ = build/main.o
#   $< = src/main.c
#   $* = main
```

### Functions

```makefile
# Built-in functions
SOURCES := $(wildcard src/*.c)
OBJECTS := $(patsubst src/%.c,build/%.o,$(SOURCES))
HEADERS := $(shell find include -name '*.h')

// ... (8 lines trimmed)
endef

$(foreach src,$(SOURCES),$(eval $(call compile_template,$(patsubst %.c,%.o,$(src)),$(src))))
```

### Conditional Compilation

```makefile
# Debug vs Release builds
DEBUG ?= 0

ifeq ($(DEBUG),1)
// ... (8 lines trimmed)
	@echo "Building $(BUILD_TYPE) version..."
	$(CC) $(CFLAGS) -o app $(SOURCES)
```

## Summary Checklist

- [ ] .DELETE_ON_ERROR: declared at top (critical)
- [ ] All non-file targets declared as .PHONY
- [ ] Tabs used for recipe indentation (not spaces)
- [ ] Variables use := for immediate expansion
- [ ] Sane defaults with ?= for user override
- [ ] Dependencies properly specified
- [ ] Error handling in critical recipes
- [ ] Default target documented and listed first
- [ ] No hardcoded credentials or paths
- [ ] Help target provided
- [ ] Parallel build safety considered
- [ ] Intermediate files managed (.INTERMEDIATE/.SECONDARY)
- [ ] Comments explain complex logic
- [ ] Portable commands used (POSIX compatible)
- [ ] Variables validated before dangerous operations
- [ ] .SUFFIXES: considered for disabling built-in rules

## Additional Resources

- [GNU Make Manual](https://www.gnu.org/software/make/manual/)
- [Makefile Style Guide](https://clarkgrubb.com/makefile-style-guide)
- [Advanced Makefile Tricks](https://www.gnu.org/software/make/manual/html_node/Quick-Reference.html)
- [Recursive Make Considered Harmful](https://aegis.sourceforge.net/auug97.pdf)