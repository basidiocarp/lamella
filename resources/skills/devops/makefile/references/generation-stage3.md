# Stage 3: Generate Makefile

## Header Options

**Traditional (POSIX-compatible):**
```makefile
.DELETE_ON_ERROR:
.SUFFIXES:
```

**Modern (GNU Make 4.0+, recommended):**
```makefile
SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
.SUFFIXES:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
```

## Standard Variables

```makefile
# User-overridable (use ?=)
CC ?= gcc
CFLAGS ?= -Wall -Wextra -O2
PREFIX ?= /usr/local
DESTDIR ?=
PROJECT ?= myapp
VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo 0.1.0)

# Internal defaults (use :=)
TARGET := $(PROJECT)
SRCDIR := src
BUILDDIR := build
BINDIR := $(DESTDIR)$(PREFIX)/bin
SOURCES := $(wildcard $(SRCDIR)/*.c)
OBJECTS := $(SOURCES:$(SRCDIR)/%.c=$(BUILDDIR)/%.o)
```

## Language-Specific Build Rules

### C/C++
```makefile
$(TARGET): $(OBJECTS)
	$(CC) $(LDFLAGS) $^ $(LDLIBS) -o $@

$(BUILDDIR)/%.o: $(SRCDIR)/%.c
	@mkdir -p $(@D)
	$(CC) $(CPPFLAGS) $(CFLAGS) -MMD -MP -c $< -o $@

-include $(OBJECTS:.o=.d)
```

### Go
```makefile
$(TARGET): $(shell find . -name '*.go') go.mod
	go build -o $@ ./cmd/$(PROJECT)
```

### Python
```makefile
.PHONY: build
build:
	python -m build

.PHONY: develop
develop:
	pip install -e .[dev]
```

### Java
```makefile
$(BUILDDIR)/%.class: $(SRCDIR)/%.java
	@mkdir -p $(@D)
	javac -d $(BUILDDIR) -sourcepath $(SRCDIR) $<
```

## Standard Targets

```makefile
.PHONY: all clean install uninstall test help

## Build all targets
all: $(TARGET)

## Remove build artifacts
clean:
	rm -rf $(BUILDDIR) $(TARGET)

## Install binaries
install: $(TARGET)
	install -d $(BINDIR)
	install -m 755 $(TARGET) $(BINDIR)/$(TARGET)

## Remove installed binaries
uninstall:
	rm -f $(BINDIR)/$(TARGET)

## Run project tests
test:
	@echo "Define the project-specific test command"
	@false

## Print help
help:
	@echo "$(PROJECT) v$(VERSION)"
	@echo "Targets: all, install, clean, test, help"
	@echo "Override: make CC=clang PREFIX=/opt"
```
