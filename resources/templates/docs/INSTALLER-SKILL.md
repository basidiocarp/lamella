---
name: {{installer-skill-name}}
description: "Run this when {{trigger-condition}} — detects platform and runs platform-specific installation steps."
origin: lamella
type: pipeline
user-invocable: true
tags: [install, setup]
---

# {{INSTALLER_SKILL_NAME}}

## When to Activate

Run this skill when you need to install or configure {{software/tool/library}} across multiple platforms. This skill automatically detects the platform and executes the appropriate installation path.

**Explicit invoke:** `/{{installer-skill-name}}`

**Contextual triggers:**
- {{User wants to set up this software on their machine}}
- {{Installation is a prerequisite for another task}}

---

## Platform Support

### macOS

**Prerequisites:**
- {{Any macOS-specific requirements}}

**Installation steps:**
1. {{Step 1 — e.g., check if Homebrew is installed}}
2. {{Step 2 — e.g., run brew install}}
3. {{Step 3 — e.g., configure with defaults}}

**Verification command:**
```bash
{{command-to-verify}} && echo "Installation successful"
```

**Example output:**
```
{{Expected successful output}}
```

---

### Linux

**Prerequisites:**
- {{Any Linux-specific requirements — Ubuntu, Fedora, etc.}}

**Installation steps:**
1. {{Step 1 — e.g., detect package manager}}
2. {{Step 2 — e.g., run apt install or yum install}}
3. {{Step 3 — e.g., configure with defaults}}

**Verification command:**
```bash
{{command-to-verify}} && echo "Installation successful"
```

**Example output:**
```
{{Expected successful output}}
```

---

### Windows

**Prerequisites:**
- {{Any Windows-specific requirements — WSL2, package manager, etc.}}

**Installation steps:**
1. {{Step 1 — e.g., download installer or use choco install}}
2. {{Step 2 — e.g., run installer with flags}}
3. {{Step 3 — e.g., configure with defaults}}

**Verification command:**
```bash
{{command-to-verify}} && echo "Installation successful"
```

**Example output:**
```
{{Expected successful output}}
```

---

## Dispatcher

The canonical pattern for selecting the correct platform section. This pattern handles macOS, Linux, and Windows variants reliably:

```bash
case "$(uname -s)" in
  Darwin)
    # macOS steps
    echo "Installing on macOS..."
    {{macos-commands}}
    ;;
  Linux)
    # Linux steps
    echo "Installing on Linux..."
    {{linux-commands}}
    ;;
  MINGW*|MSYS*|CYGWIN*)
    # Windows (Git Bash, MSYS2, or Cygwin) steps
    echo "Installing on Windows..."
    {{windows-commands}}
    ;;
  *)
    echo "Unsupported platform: $(uname -s)"
    exit 1
    ;;
esac
```

**Why this pattern:**
- `uname -s` is portable across all platforms and shells
- Windows detection covers Git Bash (MINGW), MSYS2, and Cygwin variants
- Exit code 1 on unsupported platform signals clear failure

---

## Verification

After installation completes, verify across all platforms:

1. **Run the verification command** from the appropriate platform section above.
2. **Check the version** (if applicable):
   ```bash
   {{command}} --version
   ```
3. **Confirm PATH is available:**
   ```bash
   which {{command}} || type {{command}}
   ```

All three checks should pass without error.

---

## Gotchas

### 1. Platform Detection at Build Time vs. Runtime

**Problem:** Using `$OSTYPE` checks inside a single skill body instead of breaking installation into platform-specific sections creates monolithic branching logic that is hard to test and maintain.

**Smell:** A skill body with `if [[ "$OSTYPE" == "linux-gnu" ]]; then ... elif [[ "$OSTYPE" == "darwin"* ]]; then ... fi` throughout.

**Better approach:** Use the Dispatcher pattern above, which selects the entire platform section upfront. Each platform subsection is simpler and clearer.

### 2. PATH Changes Require a New Shell Session

**Problem:** Installing software (e.g., via Homebrew) may add directories to PATH. Running `which {{command}}` immediately afterward in the same shell may fail.

**Mitigation:** When PATH changes are expected, instruct the user to open a new terminal after installation, or use `source ~/.bashrc` / `source ~/.zshrc` in bash/zsh. Document this explicitly in the platform section.

### 3. Permission and Privilege Differences Across Platforms

**Problem:** Linux often requires `sudo` for system-wide installs; macOS Homebrew handles permissions via the Homebrew group; Windows (with proper admin setup) does not need `sudo`.

**Mitigation:** Do not assume one permission pattern works everywhere. Define permissions explicitly in each platform section. For example:

- **macOS (Homebrew):** No `sudo` needed for user packages
- **Linux (apt/yum):** May require `sudo` or a package manager that handles it
- **Windows:** Installers or `choco` typically handle permissions if run as admin

### 4. Verify Installation Works Before Declaring Success

**Problem:** A package may install but not be available in PATH, or install to an unexpected location.

**Mitigation:** Always run the verification command **in the same shell session** where you ran the install, or explicitly open a new shell to test. Do not assume installation succeeded without running `which` or `--version`.

### 5. Cross-Platform Command Name Differences

**Problem:** The same software may have different command names on different platforms (e.g., `python` vs. `python3`, `g++` vs. `clang++`).

**Mitigation:** Document the canonical command name for each platform. If the command name differs, create an alias or note in the platform section which name to use for verification.

---

## How to Use This Template

1. Replace all `{{placeholders}}` with concrete values for your installer skill.
2. Test each platform section locally (or document how to test if you don't have access).
3. Ensure all verification commands are idempotent — running them multiple times should be safe.
4. Document any post-installation steps (e.g., "open a new terminal" or "restart your shell").
5. Remove this section and all comments before finalizing the skill.
