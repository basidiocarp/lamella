# Go CLI Development

## Cobra (Recommended)

Powerful CLI framework used by kubectl, hugo, docker.

```go
// cmd/root.go
package cmd

import (
    "fmt"
// ... (130 lines trimmed)
func main() {
    cmd.Execute()
}
```

## Viper (Configuration)

Configuration management with multiple sources.

```go
package config

import (
    "fmt"
    "github.com/spf13/viper"
// ... (43 lines trimmed)

    return &cfg, nil
}
```

## Bubble Tea (Interactive TUI)

Modern terminal UI framework for interactive CLIs.

```go
package main

import (
    "fmt"
    "os"
// ... (85 lines trimmed)
        os.Exit(1)
    }
}
```

## Progress Indicators

```go
package main

import (
    "fmt"
    "time"
// ... (29 lines trimmed)
        time.Sleep(40 * time.Millisecond)
    }
}
```

## Spinner

```go
package main

import (
    "fmt"
    "time"
// ... (15 lines trimmed)
    s.Stop()
    fmt.Println("✓ Done!")
}
```

## Colored Output

```go
package main

import (
    "github.com/fatih/color"
)
// ... (20 lines trimmed)
        color.NoColor = true
    }
}
```

## Error Handling

```go
package main

import (
    "errors"
    "fmt"
// ... (53 lines trimmed)

    cmd.Execute()
}
```

## Testing

```go
package cmd

import (
    "bytes"
    "testing"
// ... (27 lines trimmed)
    assert.NoError(t, err)
    assert.Contains(t, b.String(), "react")
}
```

## Build & Distribution

```makefile
# Makefile
VERSION := $(shell git describe --tags --always --dirty)
LDFLAGS := -ldflags "-X main.version=$(VERSION)"

.PHONY: build
// ... (14 lines trimmed)
	GOOS=darwin GOARCH=amd64 go build $(LDFLAGS) -o bin/mycli-darwin-amd64
	GOOS=darwin GOARCH=arm64 go build $(LDFLAGS) -o bin/mycli-darwin-arm64
	GOOS=windows GOARCH=amd64 go build $(LDFLAGS) -o bin/mycli-windows-amd64.exe
```
