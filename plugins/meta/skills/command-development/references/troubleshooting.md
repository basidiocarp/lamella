# Troubleshooting

Common issues and solutions for Claude Code slash commands.

## Command Not Appearing

**Symptoms:** Command doesn't show in `/help` or can't be invoked

**Solutions:**
- Check file is in correct directory (`.claude/commands/` or `~/.claude/commands/`)
- Verify `.md` extension present
- Ensure valid Markdown format
- Restart Claude Code
- Check for syntax errors in frontmatter

## Arguments Not Working

**Symptoms:** Arguments not substituted, wrong values

**Solutions:**
- Verify `$1`, `$2` syntax correct (no spaces after `$`)
- Check `argument-hint` matches usage pattern
- Ensure no extra spaces around argument placeholders
- Test with simple arguments first

**Common mistakes:**
```markdown
# Wrong
$ 1                    # Space after $
${1}                   # Wrong syntax
$arg                   # Named args not supported

# Correct
$1
$ARGUMENTS
```

## Bash Execution Failing

**Symptoms:** Commands not running, errors in output

**Solutions:**
- Check `allowed-tools` includes Bash permissions
- Verify command syntax in backticks
- Test command in terminal first
- Check for required permissions
- Ensure proper escaping if needed

**Common issues:**
```markdown
# Wrong - missing allowed-tools
Files: !`git diff --name-only`

# Correct
---
allowed-tools: Bash(git:*)
---
Files: !`git diff --name-only`
```

## File References Not Working

**Symptoms:** File content not included, errors

**Solutions:**
- Verify `@` syntax correct
- Check file path is valid and exists
- Ensure Read tool allowed
- Use absolute or project-relative paths

**Common mistakes:**
```markdown
# Wrong
@./src/file.ts         # Leading ./
@ src/file.ts          # Space after @
$@1                    # Wrong order

# Correct
@src/file.ts
@$1
```

## Frontmatter Parse Errors

**Symptoms:** Command not loading, strange behavior

**Solutions:**
- Ensure YAML frontmatter starts with `---` on first line
- Verify closing `---` present
- Check YAML syntax (proper indentation, quotes for special chars)
- Validate with YAML linter

**Common issues:**
```yaml
# Wrong - no closing ---
---
description: My command

# Wrong - improper indentation
---
description: My command
  allowed-tools: Read    # Invalid indent

# Correct
---
description: My command
allowed-tools: Read
---
```

## Performance Issues

**Symptoms:** Command slow to execute

**Solutions:**
- Minimize bash commands (each adds latency)
- Use targeted file references (not entire directories)
- Consider model selection (`haiku` for simple tasks)
- Avoid redundant operations

## Debugging Checklist

1. [ ] File in correct location?
2. [ ] Valid `.md` extension?
3. [ ] Valid YAML frontmatter?
4. [ ] Required tools in `allowed-tools`?
5. [ ] Correct argument syntax?
6. [ ] File paths valid?
7. [ ] Bash commands work in terminal?
8. [ ] Restarted Claude Code?
