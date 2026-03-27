# Streaming

Use FastAPI streaming when the response should arrive incrementally instead of as
one buffered payload.

## Main Streaming Shapes

### JSON Lines or Incremental Items

Use an async iterator when the client can consume records one at a time.

Good fits:
- event feeds
- long-running result streams
- incremental export or processing responses

### Server-Sent Events

Use SSE when the client is browser-friendly and the stream is event-oriented.

SSE is a good fit for:
- progress updates
- notifications
- live status feeds

Use structured event names and IDs only when the client actually needs them.

### Byte Streaming

Use `StreamingResponse` or a typed subclass when sending:
- large files
- generated media
- incremental binary output

Prefer explicit response classes over ad hoc streaming return values when the
media type matters.

## Streaming Rules

- keep the generator simple
- handle disconnects and cleanup
- choose the right response class for the payload
- use streaming only when incremental delivery has real value

If the response is naturally small and immediate, normal JSON is simpler.
