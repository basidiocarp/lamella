# Best Practices

## Variables
- `?=` for user-overridable (CC, CFLAGS, PREFIX)
- `:=` for project-specific (SOURCES, OBJECTS)
- Use pkg-config: `CFLAGS += $(shell pkg-config --cflags lib)`

## Targets
- Always declare `.PHONY` for non-file targets
- Default target should be `all`
- Use `.DELETE_ON_ERROR` for safety
- Document with `##` comments for help target

## Directory Creation
Two approaches for creating build directories:

**Simple (inline mkdir):**
```makefile
$(BUILDDIR)/%.o: $(SRCDIR)/%.c
	@mkdir -p $(@D)
	$(CC) $(CFLAGS) -c $< -o $@
```

**Optimized (order-only prerequisites):** Prevents unnecessary rebuilds when directory timestamps change.
```makefile
$(BUILDDIR):
	@mkdir -p $@

$(BUILDDIR)/%.o: $(SRCDIR)/%.c | $(BUILDDIR)
	$(CC) $(CFLAGS) -c $< -o $@
```
Use order-only prerequisites (`|`) for large projects with many targets.

## Recipes
- Use tabs, never spaces
- Quote variables in shell: `$(RM) "$(TARGET)"`
- Use `@` prefix for quiet commands
- Test with `make -n` first

## Documentation Lookup

**When REQUIRED (MUST perform lookup):**
- User requests integration with unfamiliar tools, frameworks, or build systems
- Complex build patterns (Bazel, Meson, custom toolchains)
- Docker/container integration
- CI/CD platform-specific integration
- Cross-compilation for unusual targets
- Package manager integration (Conan, vcpkg)
- Multi-binary or multi-library projects
- Version embedding via ldflags

**Internal Doc Path Map:**

| Doc | Full Path |
|-----|-----------|
| Structure guide | `devops-skills-plugin/skills/makefile-generator/docs/makefile-structure.md` |
| Variables guide | `devops-skills-plugin/skills/makefile-generator/docs/variables-guide.md` |
| Targets guide | `devops-skills-plugin/skills/makefile-generator/docs/targets-guide.md` |
| Patterns guide | `devops-skills-plugin/skills/makefile-generator/docs/patterns-guide.md` |
| Optimization guide | `devops-skills-plugin/skills/makefile-generator/docs/optimization-guide.md` |
| Security guide | `devops-skills-plugin/skills/makefile-generator/docs/security-guide.md` |
