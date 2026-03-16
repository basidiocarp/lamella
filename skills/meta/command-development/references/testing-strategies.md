# Command Testing Strategies

Comprehensive strategies for testing slash commands before deployment and distribution.

## Overview

Testing commands ensures they work correctly, handle edge cases, and provide good user experience. A systematic testing approach catches issues early and builds confidence in command reliability.

## Testing Levels

### Level 1: Syntax and Structure Validation

**What to test:**
- YAML frontmatter syntax
- Markdown format
- File location and naming

**How to test:**

```bash
# Validate YAML frontmatter
head -n 20 .claude/commands/my-command.md | grep -A 10 "^---"

# Check for closing frontmatter marker
// ... (5 lines trimmed)
# Check file is in correct location
test -f .claude/commands/my-command.md && echo "Found" || echo "Missing"
```

**Automated validation script:**

```bash
#!/bin/bash
# validate-command.sh

COMMAND_FILE="$1"

// ... (26 lines trimmed)
fi

echo "✓ Command file structure valid"
```

### Level 2: Frontmatter Field Validation

**What to test:**
- Field types correct
- Values in valid ranges
- Required fields present (if any)

**Validation script:**

```bash
#!/bin/bash
# validate-frontmatter.sh

COMMAND_FILE="$1"

// ... (33 lines trimmed)
fi

echo "✓ Frontmatter fields valid"
```

### Level 3: Manual Command Invocation

**What to test:**
- Command appears in `/help`
- Command executes without errors
- Output is as expected

**Test procedure:**

```bash
# 1. Start Claude Code
claude --debug

# 2. Check command appears in help
> /help
// ... (10 lines trimmed)
# 5. Check debug logs
tail -f ~/.claude/debug-logs/latest
# Look for errors or warnings
```

### Level 4: Argument Testing

**What to test:**
- Positional arguments work ($1, $2, etc.)
- $ARGUMENTS captures all arguments
- Missing arguments handled gracefully
- Invalid arguments detected

**Test matrix:**

| Test Case | Command | Expected Result |
|-----------|---------|-----------------|
| No args | `/cmd` | Graceful handling or useful message |
| One arg | `/cmd arg1` | $1 substituted correctly |
| Two args | `/cmd arg1 arg2` | $1 and $2 substituted |
| Extra args | `/cmd a b c d` | All captured or extras ignored appropriately |
| Special chars | `/cmd "arg with spaces"` | Quotes handled correctly |
| Empty arg | `/cmd ""` | Empty string handled |

**Test script:**

```bash
#!/bin/bash
# test-command-arguments.sh

COMMAND="$1"

// ... (22 lines trimmed)
echo "  Command: /$COMMAND \"value with spaces\""
echo "  Expected: Entire phrase captured"
echo "  Manual test required"
```

### Level 5: File Reference Testing

**What to test:**
- @ syntax loads file contents
- Non-existent files handled
- Large files handled appropriately
- Multiple file references work

**Test procedure:**

```bash
# Create test files
echo "Test content" > /tmp/test-file.txt
echo "Second file" > /tmp/test-file-2.txt

# Test single file reference
// ... (15 lines trimmed)

# Cleanup
rm /tmp/test-file*.txt /tmp/large-file.bin
```

### Level 6: Bash Execution Testing

**What to test:**
- !` commands execute correctly
- Command output included in prompt
- Command failures handled
- Security: only allowed commands run

**Test procedure:**

```bash
# Create test command with bash execution
cat > .claude/commands/test-bash.md << 'EOF'
---
description: Test bash execution
allowed-tools: Bash(echo:*), Bash(date:*)
// ... (24 lines trimmed)

> /test-forbidden
# Verify: Permission denied or appropriate error
```

### Level 7: Integration Testing

**What to test:**
- Commands work with other plugin components
- Commands interact correctly with each other
- State management works across invocations
- Workflow commands execute in sequence

**Test scenarios:**

**Scenario 1: Command + Hook Integration**

```bash
# Setup: Command that triggers a hook
# Test: Invoke command, verify hook executes

# Command: .claude/commands/risky-operation.md
# Hook: PreToolUse that validates the operation

> /risky-operation
# Verify: Hook executes and validates before command completes
```

**Scenario 2: Command Sequence**

```bash
# Setup: Multi-command workflow
> /workflow-init
# Verify: State file created

> /workflow-step2
# Verify: State file read, step 2 executes

> /workflow-complete
# Verify: State file cleaned up
```

**Scenario 3: Command + MCP Integration**

```bash
# Setup: Command uses MCP tools
# Test: Verify MCP server accessible

> /mcp-command
# Verify:
# 1. MCP server starts (if stdio)
# 2. Tool calls succeed
# 3. Results included in output
```

## Automated Testing Approaches

### Command Test Suite

Create a test suite script:

```bash
#!/bin/bash
# test-commands.sh - Command test suite

TEST_DIR=".claude/commands"
FAILED_TESTS=0
// ... (30 lines trimmed)
echo "Failed: $FAILED_TESTS"

exit $FAILED_TESTS
```

### Pre-Commit Hook

Validate commands before committing:

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Validating commands..."

// ... (14 lines trimmed)
done

echo "✓ All commands valid"
```

### Continuous Testing

Test commands in CI/CD:

```yaml
# .github/workflows/test-commands.yml
name: Test Commands

on: [push, pull_request]

// ... (22 lines trimmed)
            echo "ERROR: TODOs found in commands"
            exit 1
          fi
```

## Edge Case Testing

### Test Edge Cases

**Empty arguments:**
```bash
> /cmd ""
> /cmd '' ''
```

**Special characters:**
```bash
> /cmd "arg with spaces"
> /cmd arg-with-dashes
> /cmd arg_with_underscores
> /cmd arg/with/slashes
> /cmd 'arg with "quotes"'
```

**Long arguments:**
```bash
> /cmd $(python -c "print('a' * 10000)")
```

**Unusual file paths:**
```bash
> /cmd ./file
> /cmd ../file
> /cmd ~/file
> /cmd "/path with spaces/file"
```

**Bash command edge cases:**
```markdown
# Commands that might fail
!`exit 1`
!`false`
!`command-that-does-not-exist`

# Commands with special output
!`echo ""`
!`cat /dev/null`
!`yes | head -n 1000000`
```

## Performance Testing

### Response Time Testing

```bash
#!/bin/bash
# test-command-performance.sh

COMMAND="$1"

// ... (15 lines trimmed)
echo "  - Average response time"
echo "  - Variance"
echo "  - Acceptable threshold: < 3 seconds for fast commands"
```

### Resource Usage Testing

```bash
# Monitor Claude Code during command execution
# In terminal 1:
claude --debug

// ... (5 lines trimmed)
# - CPU usage
# - Process count
```

## User Experience Testing

### Usability Checklist

- [ ] Command name is intuitive
- [ ] Description is clear in `/help`
- [ ] Arguments are well-documented
- [ ] Error messages are helpful
- [ ] Output is formatted readably
- [ ] Long-running commands show progress
- [ ] Results are actionable
- [ ] Edge cases have good UX

### User Acceptance Testing

Recruit testers:

```markdown
# Testing Guide for Beta Testers

## Command: /my-new-command

### Test Scenarios
// ... (19 lines trimmed)
2. Did the output meet your expectations?
3. What would you change?
4. Would you use this command regularly?
```

## Testing Checklist

Before releasing a command:

### Structure
- [ ] File in correct location
- [ ] Correct .md extension
- [ ] Valid YAML frontmatter (if present)
- [ ] Markdown syntax correct

### Functionality
- [ ] Command appears in `/help`
- [ ] Description is clear
- [ ] Command executes without errors
- [ ] Arguments work as expected
- [ ] File references work
- [ ] Bash execution works (if used)

### Edge Cases
- [ ] Missing arguments handled
- [ ] Invalid arguments detected
- [ ] Non-existent files handled
- [ ] Special characters work
- [ ] Long inputs handled

### Integration
- [ ] Works with other commands
- [ ] Works with hooks (if applicable)
- [ ] Works with MCP (if applicable)
- [ ] State management works

### Quality
- [ ] Performance acceptable
- [ ] No security issues
- [ ] Error messages helpful
- [ ] Output formatted well
- [ ] Documentation complete

### Distribution
- [ ] Tested by others
- [ ] Feedback incorporated
- [ ] README updated
- [ ] Examples provided

## Debugging Failed Tests

### Common Issues and Solutions

**Issue: Command not appearing in /help**

```bash
# Check file location
ls -la .claude/commands/my-command.md

# Check permissions
// ... (5 lines trimmed)
# Restart Claude Code
claude --debug
```

**Issue: Arguments not substituting**

```bash
# Verify syntax
grep '\$1' .claude/commands/my-command.md
grep '\$ARGUMENTS' .claude/commands/my-command.md

# Test with simple command first
echo "Test: \$1 and \$2" > .claude/commands/test-args.md
```

**Issue: Bash commands not executing**

```bash
# Check allowed-tools
grep "allowed-tools" .claude/commands/my-command.md

# Verify command syntax
grep '!\`' .claude/commands/my-command.md

# Test command manually
date
echo "test"
```

**Issue: File references not working**

```bash
# Check @ syntax
grep '@' .claude/commands/my-command.md

# Verify file exists
ls -la /path/to/referenced/file

# Check permissions
chmod 644 /path/to/referenced/file
```

## Best Practices

1. **Test early, test often**: Validate as you develop
2. **Automate validation**: Use scripts for repeatable checks
3. **Test edge cases**: Don't just test the happy path
4. **Get feedback**: Have others test before wide release
5. **Document tests**: Keep test scenarios for regression testing
6. **Monitor in production**: Watch for issues after release
7. **Iterate**: Improve based on real usage data
