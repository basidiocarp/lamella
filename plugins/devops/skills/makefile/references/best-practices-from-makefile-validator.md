# Makefile Best Practices

Use this as the validator-oriented checklist for modern, maintainable Makefiles.

## Recommended Header

```makefile
SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
.SUFFIXES:
```

What this buys you:
- safer recipe execution
- consistent shell behavior
- failed targets are deleted
- fewer surprising built-in rules

## Required Structural Rules

```text
Declare .PHONY for non-file targets
Keep variables near the top
Use clear default goals
Prefer namespaced targets for grouped commands
```

Example:

```makefile
.PHONY: all build test clean docker/build docker/push

all: build test
```

## Variable Rules

Prefer immediate expansion for most variables:

```makefile
BUILD_DIR := build
SRC_FILES := $(wildcard src/*.c)
CFLAGS += -Wall -Wextra
```

Use:
- `:=` for predictable evaluation
- `?=` for overridable defaults
- `+=` for incremental flags

## Recipe Rules

Good:

```makefile
build:
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -o $(BUILD_DIR)/app src/main.c
```

Review for:
- real tabs in recipes
- one clear responsibility per target
- no silent shell failures

## Dependency and Target Rules

Prefer explicit dependencies and generated dep files over implicit magic:

```makefile
DEPENDS := $(OBJECTS:.o=.d)
-include $(DEPENDS)
```

Use `.DELETE_ON_ERROR` so partial artifacts do not poison the next run.

## Portability and Safety

Require review when a Makefile depends on:
- GNU Make-only features
- Bash-only shell syntax
- environment-sensitive tools or paths

Use comments when a target is intentionally non-portable.

## Validator Checklist

```text
Has .PHONY been declared where needed?
Does the file use modern header safeguards?
Are recipes tab-indented correctly?
Are variables clear and consistently assigned?
Will failure leave corrupt targets behind?
Is shell usage explicit and justified?
```
