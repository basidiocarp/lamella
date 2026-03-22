# Installation

## Prerequisites

- LLVM/Clang compiler (includes libFuzzer)
- LLVM tools for coverage analysis (optional)

## Linux (Ubuntu/Debian)

```bash
apt install clang llvm
```

For the latest LLVM version:
```bash
# Add LLVM repository from apt.llvm.org
# Then install specific version, e.g.:
apt install clang-18 llvm-18
```

## macOS

```bash
# Using Homebrew
brew install llvm

# Or using Nix
nix-env -i clang
```

## Windows

Install Clang through Visual Studio. Refer to [Microsoft's documentation](https://learn.microsoft.com/en-us/cpp/build/clang-support-msbuild?view=msvc-170) for setup instructions.

**Recommendation:** If possible, fuzz on a local x86_64 VM or rent one on DigitalOcean, AWS, or Hetzner. Linux provides the best support for libFuzzer.

## Verification

```bash
clang++ --version
# Should show LLVM version information
```
