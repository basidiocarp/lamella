# HTTP Handler Testing

Testing HTTP handlers and API endpoints in Go.

## Basic Handler Testing

```go
func TestHealthHandler(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	recorder := httptest.NewRecorder()

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("OK"))
	})

	handler.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusOK {
		t.Fatalf("got status %d; want %d", recorder.Code, http.StatusOK)
	}

	if body := recorder.Body.String(); body != "OK" {
		t.Fatalf("got body %q; want %q", body, "OK")
	}
}
```

## Table-Driven API Testing

```go
func TestUsersHandler(t *testing.T) {
	tests := []struct {
		name       string
		method     string
		path       string
		wantStatus int
	}{
		{name: "list users", method: http.MethodGet, path: "/users", wantStatus: http.StatusOK},
		{name: "method not allowed", method: http.MethodDelete, path: "/users", wantStatus: http.StatusMethodNotAllowed},
	}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"users":[]}`))
	})

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, tt.path, nil)
			recorder := httptest.NewRecorder()

			handler.ServeHTTP(recorder, req)

			if recorder.Code != tt.wantStatus {
				t.Fatalf("got status %d; want %d", recorder.Code, tt.wantStatus)
			}
		})
	}
}
```

## Testing with Middleware

```go
func TestAuthMiddleware(t *testing.T) {
	handler := AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("authorized"))
	}))

	tests := []struct {
		name       string
		token      string
		wantStatus int
	}{
		{name: "missing token", token: "", wantStatus: http.StatusUnauthorized},
		{name: "valid token", token: "Bearer test-token", wantStatus: http.StatusOK},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/profile", nil)
			if tt.token != "" {
				req.Header.Set("Authorization", tt.token)
			}

			recorder := httptest.NewRecorder()
			handler.ServeHTTP(recorder, req)

			if recorder.Code != tt.wantStatus {
				t.Fatalf("got status %d; want %d", recorder.Code, tt.wantStatus)
			}
		})
	}
}
```

## CI/CD Integration

```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-go@v5
      with:
        go-version: '1.24'
    - name: Run tests with coverage
      run: go test ./... -coverprofile=coverage.out
    - name: Enforce minimum coverage
      run: |
        go tool cover -func=coverage.out | grep total | awk '{print $3}' | \
        awk -F'%' '{if ($1 < 80) exit 1}'
```
