# `.PHONY` and Help Targets

This reference covers the action-oriented targets that define the public command
surface of a Makefile.

## `.PHONY`

Declare any target that represents an action rather than a generated file.

```makefile
.PHONY: all clean install uninstall test check help
.PHONY: build dist distclean format lint docs
```

Without `.PHONY`, a file named `clean` or `test` can accidentally suppress the
target.

You can declare them together or separately, but one grouped declaration is
usually easier to maintain.

## Self-Documenting Help Target

```makefile
## Show available targets and usage
.PHONY: help
help:
	@echo "$(PROJECT) $(VERSION)"
	@echo ""
	@awk 'BEGIN {FS = ":.*## "}; /^[a-zA-Z0-9_.-]+:.*## / {printf "  %-16s %s\n", $$1, $$2}' $(MAKEFILE_LIST)
```

This works best when public targets carry `##` comments:

```makefile
## Build the application
.PHONY: build
build: $(TARGET)

## Run the test suite
.PHONY: test
test:
	./run_tests.sh
```

## Default Target Visibility

If the Makefile exposes many helper targets, make sure the main build or help
target is still easy to find near the top.

```makefile
.DEFAULT_GOAL := help
```

Use `.DEFAULT_GOAL := help` only when the Makefile is primarily a task runner.
For build-oriented Makefiles, keep `all` as the default.

## Rules

- Use `.PHONY` for actions, not file outputs.
- Keep `help` concise and focused on public targets.
- Prefer one public spelling per action. Do not add aliases casually.
