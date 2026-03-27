# Project Structure and Module Management

## Standard Project Layout

```text
myproject/
├── cmd/
│   ├── server/
│   │   └── main.go
│   └── cli/
│       └── main.go
├── internal/
│   ├── auth/
│   └── config/
├── pkg/
│   └── api/
├── go.mod
├── go.sum
└── README.md
```

Use `cmd/` for entrypoints, `internal/` for app-private packages, and `pkg/`
only when you truly intend reuse by other modules.

## go.mod Basics

```go
module github.com/user/myproject

go 1.24

require (
    github.com/go-chi/chi/v5 v5.2.1
    github.com/stretchr/testify v1.10.0
)

retract v1.0.1 // Contains critical bug
```

## Module Commands

```bash
go mod init github.com/user/project
go mod tidy
go get github.com/go-chi/chi/v5@latest
go test ./...
go list -m all
```

## Internal Packages

```text
myproject/
├── internal/
│   ├── auth/
│   └── storage/
└── api/
    └── internal/
        └── helpers.go
```

Code outside a parent tree cannot import that tree’s `internal/` packages.

## Multi-Module Repository

```text
monorepo/
├── go.work
├── services/
│   ├── api/
│   │   └── go.mod
│   └── worker/
│       └── go.mod
└── shared/
    └── models/
        └── go.mod
```

```bash
go work init ./services/api ./services/worker
go work use ./shared/models
go work sync
```

## Build Tags

```go
//go:build integration

package myapp
```

Use build tags for integration-only tests, OS-specific files, or optional
feature sets.

## Version Information

```go
package version

var (
    Version   = "dev"
    GitCommit = "unknown"
    BuildTime = "unknown"
)
```

```bash
go build -ldflags "-X github.com/user/project/version.Version=1.0.0 \
  -X github.com/user/project/version.GitCommit=$(git rev-parse HEAD) \
  -X github.com/user/project/version.BuildTime=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
```
