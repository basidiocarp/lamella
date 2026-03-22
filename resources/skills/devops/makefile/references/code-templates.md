````markdown
# Code Templates

## Header (choose one style)

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

# GNU installation directories
BINDIR ?= $(PREFIX)/bin
LIBDIR ?= $(PREFIX)/lib
INCLUDEDIR ?= $(PREFIX)/include

# Project-specific (use :=)
PROJECT := myproject
VERSION := 1.0.0
SRCDIR := src
BUILDDIR := build
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

## Install to PREFIX
install: all
	install -d $(DESTDIR)$(BINDIR)
	install -m 755 $(TARGET) $(DESTDIR)$(BINDIR)/

## Remove built files
clean:
	$(RM) -r $(BUILDDIR) $(TARGET)

## Run tests
test:
	# Add test commands

## Show help
help:
	@echo "$(PROJECT) v$(VERSION)"
	@echo "Targets: all, install, clean, test, help"
	@echo "Override: make CC=clang PREFIX=/opt"
```

## Directory Creation Patterns

**Simple (inline mkdir):**
```makefile
$(BUILDDIR)/%.o: $(SRCDIR)/%.c
	@mkdir -p $(@D)
	$(CC) $(CFLAGS) -c $< -o $@
```

**Optimized (order-only prerequisites):**
```makefile
$(BUILDDIR):
	@mkdir -p $@

$(BUILDDIR)/%.o: $(SRCDIR)/%.c | $(BUILDDIR)
	$(CC) $(CFLAGS) -c $< -o $@
```

Use order-only prerequisites (`|`) for large projects with many targets.

## Production Error Handling

### docker-push with error handling
```makefile
docker-push: docker-build
	@echo "Pushing $(IMAGE)..."
	docker push $(IMAGE) || { echo "Failed to push $(IMAGE)"; exit 1; }
	docker push $(IMAGE_LATEST) || { echo "Failed to push $(IMAGE_LATEST)"; exit 1; }
```

### Parallel Safety for Docker
```makefile
.NOTPARALLEL: docker-build docker-push docker-run
```

### Install with error handling
```makefile
install: $(TARGET)
	install -d $(DESTDIR)$(PREFIX)/bin || exit 1
	install -m 755 $(TARGET) $(DESTDIR)$(PREFIX)/bin/ || exit 1
```

````
