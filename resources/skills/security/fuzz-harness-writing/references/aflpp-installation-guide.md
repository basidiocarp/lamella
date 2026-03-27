# AFL++ Installation Guide

## Installation Methods

| Method | When to Use | Supported Compilers |
|--------|-------------|---------------------|
| Ubuntu/Debian repos | Recent Ubuntu, basic features only | Ubuntu 23.10: Clang 14 & GCC 13<br>Debian 12: Clang 14 & GCC 12 |
| Docker (from Docker Hub) | Specific AFL++ version, Apple Silicon support | As of 4.35c: Clang 19 & GCC 11 |
| Docker (from source) | Test unreleased features, apply patches | Configurable in Dockerfile |
| From source | Avoid Docker, need specific patches | Adjustable via `LLVM_CONFIG` env var |

---

## Ubuntu/Debian Installation

Prior to installing afl++, check the clang version dependency with `apt-cache show afl++`, and install the matching `lld` version.

```bash
apt install afl++ lld-17
```

---

## Docker Installation

### From Docker Hub

```bash
docker pull aflplusplus/aflplusplus:stable
```

### From Source

```bash
git clone --depth 1 --branch stable https://github.com/AFLplusplus/AFLplusplus
cd AFLplusplus
docker build -t aflplusplus .
```

---

## From Source Installation

Refer to the [Dockerfile](https://github.com/AFLplusplus/AFLplusplus/blob/stable/Dockerfile) for Ubuntu version requirements and dependencies. Set `LLVM_CONFIG` to specify Clang version (e.g., `llvm-config-18`).

---

## Wrapper Script Setup

Create a wrapper script to run AFL++ on host or Docker:

```bash
cat <<'EOF' > ./afl++
#!/bin/sh
AFL_VERSION="${AFL_VERSION:-"stable"}"
case "$1" in
   host)
      shift
      exec "$@"
      ;;
   docker)
      shift
      exec docker run --rm -it \
        -v "$PWD:/work" -w /work \
        "aflplusplus/aflplusplus:${AFL_VERSION}" "$@"
      ;;
   *)
      echo "usage: ./afl++ <host|docker> <command> [args...]"
      exit 1
      ;;
esac
EOF
chmod +x ./afl++
```

**Security Warning:** The `afl-system-config` and `afl-persistent-config` scripts require root privileges and disable OS security features. Do not fuzz on production systems. Use a dedicated VM instead.

---

## System Configuration

Run after each reboot for up to 15% more executions per second:

```bash
./afl++ <host/docker> afl-system-config
```

For maximum performance, disable kernel security mitigations:

```bash
./afl++ host afl-persistent-config
update-grub
reboot
./afl++ <host/docker> afl-system-config
```

Verify with `cat /proc/cmdline` - output should include `mitigations=off`.
