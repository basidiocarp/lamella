# Go CLI Development

## Cobra (Recommended)

```go
// cmd/root.go
package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "mycli",
	Short: "Example Go CLI",
}

var greetCmd = &cobra.Command{
	Use:   "greet [name]",
	Short: "Print a greeting",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		verbose, _ := cmd.Flags().GetBool("verbose")
		if verbose {
			fmt.Fprintf(os.Stderr, "greeting %s\n", args[0])
		}
		fmt.Printf("hello %s\n", args[0])
		return nil
	},
}

func Execute() error {
	rootCmd.PersistentFlags().Bool("verbose", false, "enable verbose logging")
	rootCmd.AddCommand(greetCmd)
	return rootCmd.Execute()
}
```

## Viper (Configuration)

```go
package config

import "github.com/spf13/viper"

type Config struct {
	AppName string
	Timeout int
}

func Load() (*Config, error) {
	viper.SetConfigName("config")
	viper.AddConfigPath(".")
	viper.SetDefault("app_name", "mycli")
	viper.SetDefault("timeout", 30)

	_ = viper.ReadInConfig()

	return &Config{
		AppName: viper.GetString("app_name"),
		Timeout: viper.GetInt("timeout"),
	}, nil
}
```

## Bubble Tea (Interactive TUI)

```go
package main

import (
	"fmt"
	"os"

	tea "github.com/charmbracelet/bubbletea"
)

type model struct {
	selected int
	options  []string
}

func (m model) Init() tea.Cmd { return nil }

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "j", "down":
			if m.selected < len(m.options)-1 {
				m.selected++
			}
		case "k", "up":
			if m.selected > 0 {
				m.selected--
			}
		case "q", "ctrl+c":
			return m, tea.Quit
		}
	}
	return m, nil
}

func (m model) View() string {
	return fmt.Sprintf("selected: %s\n", m.options[m.selected])
}

func main() {
	p := tea.NewProgram(model{options: []string{"build", "test", "release"}})
	if _, err := p.Run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
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
)

func main() {
	for i := 0; i <= 100; i += 20 {
		fmt.Printf("\rprogress: %d%%", i)
		time.Sleep(40 * time.Millisecond)
	}
	fmt.Println()
}
```

## Spinner

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	frames := []string{"-", "\\", "|", "/"}
	for i := 0; i < 8; i++ {
		fmt.Printf("\r%s working...", frames[i%len(frames)])
		time.Sleep(60 * time.Millisecond)
	}
	fmt.Print("\r✓ done\n")
}
```

## Colored Output

```go
package main

import "github.com/fatih/color"

func main() {
	color.New(color.FgGreen).Println("success")
	color.New(color.FgYellow).Println("warning")
	color.New(color.FgRed).Println("error")
}
```

## Error Handling

```go
package main

import (
	"errors"
	"fmt"
	"os"
)

func run() error {
	return errors.New("config file missing")
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "mycli: %v\n", err)
		os.Exit(1)
	}
}
```

## Testing

```go
package cmd

import (
	"bytes"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestGreetCommand(t *testing.T) {
	buf := new(bytes.Buffer)
	rootCmd.SetOut(buf)
	rootCmd.SetArgs([]string{"greet", "alice"})

	err := rootCmd.Execute()

	require.NoError(t, err)
	require.Contains(t, buf.String(), "hello")
}
```

## Build and Distribution

```makefile
VERSION := $(shell git describe --tags --always --dirty)
LDFLAGS := -ldflags "-X main.version=$(VERSION)"

.PHONY: build cross-build test

build:
	go build $(LDFLAGS) -o bin/mycli ./cmd/mycli

cross-build:
	GOOS=linux GOARCH=amd64 go build $(LDFLAGS) -o bin/mycli-linux-amd64 ./cmd/mycli
	GOOS=darwin GOARCH=arm64 go build $(LDFLAGS) -o bin/mycli-darwin-arm64 ./cmd/mycli
	GOOS=windows GOARCH=amd64 go build $(LDFLAGS) -o bin/mycli-windows-amd64.exe ./cmd/mycli

test:
	go test ./...
```
