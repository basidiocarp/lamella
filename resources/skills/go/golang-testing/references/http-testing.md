# HTTP Handler Testing

Testing HTTP handlers and API endpoints in Go.

## Basic Handler Testing

```go
func TestHealthHandler(t *testing.T) {
    // Create request
    req := httptest.NewRequest(http.MethodGet, "/health", nil)
    w := httptest.NewRecorder()

// ... (13 lines trimmed)
        t.Errorf("got body %q; want %q", body, "OK")
    }
}
```

## Table-Driven API Testing

```go
func TestAPIHandler(t *testing.T) {
    tests := []struct {
        name       string
        method     string
        path       string
// ... (48 lines trimmed)
        })
    }
}
```

## Testing with Middleware

```go
func TestAuthMiddleware(t *testing.T) {
    handler := AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        w.Write([]byte("authorized"))
    }))
// ... (24 lines trimmed)
        })
    }
}
```

## CI/CD Integration

```yaml
# GitHub Actions example
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
// ... (8 lines trimmed)
      run: |
        go tool cover -func=coverage.out | grep total | awk '{print $3}' | \
        awk -F'%' '{if ($1 < 80) exit 1}'
```
