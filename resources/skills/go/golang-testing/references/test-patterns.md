# Go Test Patterns

Table-driven tests, subtests, helpers, and golden files.

## Table-Driven Tests

```go
func TestParseConfig(t *testing.T) {
	tests := []struct {
		name    string
		input   string
		want    *Config
		wantErr bool
	}{
		{name: "valid", input: "port=8080", want: &Config{Port: 8080}},
		{name: "missing value", input: "port=", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ParseConfig(tt.input)
			if (err != nil) != tt.wantErr {
				t.Fatalf("error = %v, wantErr %v", err, tt.wantErr)
			}
			if !tt.wantErr && *got != *tt.want {
				t.Fatalf("got %#v, want %#v", *got, *tt.want)
			}
		})
	}
}
```

## Subtests and Parallel Cases

```go
func TestParallelValidation(t *testing.T) {
	tests := []struct {
		name  string
		input string
	}{
		{name: "alpha", input: "abc"},
		{name: "numeric", input: "123"},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			if err := Validate(tt.input); err != nil {
				t.Fatalf("Validate(%q) = %v", tt.input, err)
			}
		})
	}
}
```

## Test Helpers

```go
func setupTestDB(t *testing.T) *sql.DB {
	t.Helper()

	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatalf("sql.Open: %v", err)
	}

	return db
}

func assertEqual[T comparable](t *testing.T, got, want T) {
	t.Helper()
	if got != want {
		t.Fatalf("got %v; want %v", got, want)
	}
}
```

## Golden Files

```go
var update = flag.Bool("update", false, "update golden files")

func TestRender(t *testing.T) {
	got := RenderInvoice(sampleInvoice())
	golden := filepath.Join("testdata", "invoice.golden")

	if *update {
		if err := os.WriteFile(golden, []byte(got), 0o644); err != nil {
			t.Fatalf("WriteFile: %v", err)
		}
	}

	want, err := os.ReadFile(golden)
	if err != nil {
		t.Fatalf("ReadFile: %v", err)
	}

	if diff := cmp.Diff(string(want), got); diff != "" {
		t.Fatalf("golden mismatch (-want +got):\n%s", diff)
	}
}
```
