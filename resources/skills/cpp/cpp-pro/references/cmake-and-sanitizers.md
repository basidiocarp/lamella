# CMake and Sanitizers

Use this reference when setting up a modern build, install rules, and sanitizer-oriented local targets.

## Modern CMake Skeleton

```cmake
cmake_minimum_required(VERSION 3.24)
project(MyProject VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_library(myproject src/lib.cpp)
target_include_directories(myproject
    PUBLIC
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
        $<INSTALL_INTERFACE:include>
)

install(TARGETS myproject)
install(DIRECTORY include/ DESTINATION include)
```

## Sanitizer Build Types

```cmake
set(CMAKE_CXX_FLAGS_ASAN
    "-g -O1 -fsanitize=address,undefined -fno-omit-frame-pointer"
    CACHE STRING "Flags for ASan build"
)

set(CMAKE_CXX_FLAGS_TSAN
    "-g -O1 -fsanitize=thread -fno-omit-frame-pointer"
    CACHE STRING "Flags for TSan build"
)
```

## Local Commands

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake -S . -B build-asan -DCMAKE_BUILD_TYPE=ASAN
cmake --build build-asan
ctest --test-dir build-asan --output-on-failure
```
