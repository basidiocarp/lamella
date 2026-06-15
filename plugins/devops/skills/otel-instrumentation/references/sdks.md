# SDK Bootstrap

Minimal setup per language. Each section shows the auto-instrumentation package and the environment variables required to get traces, metrics, and logs flowing. Push all configuration to environment variables — avoid hardcoding endpoints or service names.

## Common Environment Variables

Set these for every language:

```bash
export OTEL_SERVICE_NAME="my-service"
export OTEL_EXPORTER_OTLP_ENDPOINT="http://collector:4317"   # gRPC (default)
# or
export OTEL_EXPORTER_OTLP_ENDPOINT="http://collector:4318"   # HTTP/protobuf
export OTEL_EXPORTER_OTLP_PROTOCOL="grpc"                    # or "http/protobuf"
export OTEL_RESOURCE_ATTRIBUTES="deployment.environment.name=production,service.version=1.0.0"
```

---

## Node.js

```bash
npm install @opentelemetry/sdk-node \
            @opentelemetry/auto-instrumentations-node \
            @opentelemetry/exporter-trace-otlp-grpc
```

```javascript
// tracing.js — load before application code
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();
```

```bash
node --require ./tracing.js app.js
```

---

## Go

```bash
go get go.opentelemetry.io/otel \
       go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc \
       go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp
```

```go
// main.go
func initTracer(ctx context.Context) (func(), error) {
    exporter, err := otlptracegrpc.New(ctx) // reads OTEL_EXPORTER_OTLP_ENDPOINT
    if err != nil {
        return nil, err
    }
    tp := trace.NewTracerProvider(
        trace.WithBatcher(exporter),
        trace.WithResource(resource.Default()), // reads OTEL_SERVICE_NAME
    )
    otel.SetTracerProvider(tp)
    return func() { tp.Shutdown(ctx) }, nil
}

// Wrap HTTP handlers
handler := otelhttp.NewHandler(mux, "server")
```

---

## Python

```bash
pip install opentelemetry-distro opentelemetry-exporter-otlp
opentelemetry-bootstrap -a install   # installs instrumentation for detected packages
```

```bash
# Run with auto-instrumentation
opentelemetry-instrument python app.py
```

For manual spans alongside auto-instrumentation:

```python
from opentelemetry import trace
tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("process order") as span:
    span.set_attribute("order.id", order_id)
    process(order_id)
```

---

## Java

```bash
# Download the OTel Java agent
curl -L -o otel-javaagent.jar \
  https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar
```

```bash
java -javaagent:otel-javaagent.jar \
     -Dotel.service.name=my-service \
     -Dotel.exporter.otlp.endpoint=http://collector:4317 \
     -jar app.jar
```

The agent instruments Spring, Micronaut, Quarkus, JDBC, gRPC, and most common libraries automatically. No code changes required for basic coverage.

---

## Rust

```toml
# Cargo.toml
[dependencies]
opentelemetry = { version = "0.27", features = ["trace"] }
opentelemetry-otlp = { version = "0.27", features = ["tonic"] }
opentelemetry_sdk = { version = "0.27", features = ["rt-tokio"] }
```

```rust
use opentelemetry::global;
use opentelemetry_otlp::WithExportConfig;
use opentelemetry_sdk::runtime;

fn init_tracer() -> anyhow::Result<()> {
    let exporter = opentelemetry_otlp::new_exporter()
        .tonic()
        .with_env(); // reads OTEL_EXPORTER_OTLP_ENDPOINT
    opentelemetry_otlp::new_pipeline()
        .tracing()
        .with_exporter(exporter)
        .with_trace_config(opentelemetry_sdk::trace::Config::default())
        .install_batch(runtime::Tokio)?;
    Ok(())
}

// Shut down on exit
global::shutdown_tracer_provider();
```

Rust has no full auto-instrumentation agent. Instrument HTTP boundaries manually with `tracing` + `tracing-opentelemetry` or use middleware crates for your HTTP framework (e.g., `axum-tracing-opentelemetry`).
