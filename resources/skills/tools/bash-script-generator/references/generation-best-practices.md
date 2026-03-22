# Script Generation Best Practices

Guidelines for generating high-quality, maintainable bash scripts.

## Core Principles

1. **Security First** - Validate inputs, quote variables, avoid injection
2. **Fail Fast** - Use strict mode, check errors immediately
3. **Self-Documenting** - Clear names, usage text, comments for complex logic
4. **Testable** - Modular functions, predictable behavior
5. **Maintainable** - Consistent style, organized structure

## Script Structure Template

```bash
#!/usr/bin/env bash
#
# Script Name: descriptive-name.sh
# Description: What it does in one line
# Usage: script.sh [OPTIONS] ARGUMENTS
// ... (22 lines trimmed)

# Execute
main "$@"
```

## Naming Conventions

```bash
# Constants - UPPERCASE with readonly
readonly MAX_RETRIES=3
readonly CONFIG_FILE="/etc/app.conf"

# Environment variables - UPPERCASE
// ... (11 lines trimmed)
# Local variables - lowercase
local count=0
local file_path=""
```

## Security Best Practices

```bash
# 1. Always quote variables
rm "${file}"                    # Good
rm $file                        # Bad

# 2. Validate all inputs
// ... (12 lines trimmed)

# 6. Set safe IFS
IFS=$'\n\t'
```

## Error Handling Patterns

```bash
# Pattern 1: Die function
die() {
    echo "ERROR: $*" >&2
    exit 1
}
// ... (12 lines trimmed)
    [[ -n "${temp_dir:-}" ]] && rm -rf "${temp_dir}"
}
trap cleanup EXIT
```

## Function Design

```bash
# Good function design
#######################################
# Process a log file and extract errors
# Globals:
#   LOG_LEVEL
// ... (25 lines trimmed)

    return 0
}
```

## Code Organization

```bash
# Recommended order:
1. Shebang and header comments
2. Strict mode settings
3. Constants
4. Global variables
5. Helper functions (general → specific)
6. Main logic functions
7. Main function
8. Signal handlers
9. Main execution
```

## Generated Code Quality Checklist

- [ ] Proper shebang: `#!/usr/bin/env bash`
- [ ] Strict mode enabled: `set -euo pipefail`
- [ ] All variables quoted: `"${var}"`
- [ ] Constants marked readonly
- [ ] Functions documented
- [ ] Error handling implemented
- [ ] Usage/help function included
- [ ] Input validation present
- [ ] Cleanup on exit (trap)
- [ ] No ShellCheck warnings
- [ ] Comments for complex logic
- [ ] Consistent formatting

## References

- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [ShellCheck](https://www.shellcheck.net/)