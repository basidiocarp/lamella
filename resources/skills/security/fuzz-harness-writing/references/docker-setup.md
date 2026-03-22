# Atheris Docker Environment Setup

## Recommended Docker Environment

For a fully operational Linux environment with all dependencies configured:

```dockerfile
# https://hub.docker.com/_/python
ARG PYTHON_VERSION=3.11

FROM python:$PYTHON_VERSION-slim-bookworm

// ... (47 lines trimmed)
ENV ASAN_OPTIONS "allocator_may_return_null=1,detect_leaks=0"

CMD ["/bin/bash"]
```

Build and run:
```bash
docker build -t atheris .
docker run -it atheris
```

## Fuzzing Python C Extensions

### Environment Configuration

If using the provided Dockerfile, these are already configured. For local setup:

```bash
export CC="clang"
export CFLAGS="-fsanitize=address,fuzzer-no-link"
export CXX="clang++"
export CXXFLAGS="-fsanitize=address,fuzzer-no-link"
export LDSHARED="clang -shared"
```

### Example: Fuzzing cbor2

Install the extension from source:
```bash
CBOR2_BUILD_C_EXTENSION=1 python -m pip install --no-binary cbor2 cbor2==5.6.4
```

The `--no-binary` flag ensures the C extension is compiled locally with instrumentation.

Create `cbor2-fuzz.py`:
```python
import sys
import atheris

# _cbor2 ensures the C library is imported
from _cbor2 import loads
// ... (11 lines trimmed)

if __name__ == "__main__":
    main()
```

Run:
```bash
python cbor2-fuzz.py
```

> **Important:** When running locally (not in Docker), set `LD_PRELOAD` manually.
