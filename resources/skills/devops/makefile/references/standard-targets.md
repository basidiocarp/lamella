# Standard Makefile Targets

This reference covers the targets users expect to find in a conventional
Makefile.

## Default Build Target

Put `all` near the top and make it the default entrypoint.

```makefile
## Build the primary artifact
.PHONY: all
all: $(TARGET)
```

`all` should build the main output. It should not install files, clean the
workspace, or run destructive steps.

## Installation Targets

```makefile
## Install built files
.PHONY: install
install: all
	$(INSTALL) -d $(DESTDIR)$(BINDIR)
	$(INSTALL_PROGRAM) $(TARGET) $(DESTDIR)$(BINDIR)/
	$(INSTALL) -d $(DESTDIR)$(MAN1DIR)
	$(INSTALL_DATA) docs/$(PROJECT).1 $(DESTDIR)$(MAN1DIR)/

## Remove installed files
.PHONY: uninstall
uninstall:
	$(RM) $(DESTDIR)$(BINDIR)/$(TARGET)
	$(RM) $(DESTDIR)$(MAN1DIR)/$(PROJECT).1
```

Rules:

- `install` should depend on `all`.
- Respect `PREFIX` and `DESTDIR`.
- Keep `uninstall` limited to files that `install` created.

## Cleanup Targets

```makefile
## Remove built artifacts
.PHONY: clean
clean:
	$(RM) $(OBJECTS) $(TARGET)
	$(RM) -r $(BUILDDIR)

## Remove generated configuration too
.PHONY: distclean
distclean: clean
	$(RM) config.h config.log config.status
	$(RM) Makefile
```

Use `clean` for build outputs and `distclean` only when the project has
configure- or generation-time files that must also be removed.

## Test Targets

```makefile
## Run project tests
.PHONY: test
test: $(TARGET)
	./run_tests.sh

## GNU-style alias
.PHONY: check
check: test
```

Keep `test` and `check` aligned so users do not have to guess which one is the
real verification entrypoint.

## Distribution Targets

```makefile
## Create a release tarball
.PHONY: dist
dist:
	mkdir -p dist
	tar -czf dist/$(PROJECT)-$(VERSION).tar.gz .

## Build and verify the release archive
.PHONY: distcheck
distcheck: dist
	@echo "Verify tarball contents and test a clean build here"
```

Only add `dist` and `distcheck` if the project actually ships archives.

## Rules

- Keep target names conventional unless the project has a strong reason not to.
- Make destructive targets explicit.
- Prefer a small stable set of top-level targets over many near-duplicates.
