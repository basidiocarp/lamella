# Payload Endpoint Helpers

These helpers reduce boilerplate and keep custom endpoints aligned with Payload conventions.

## `addDataAndFileToRequest`

Use this when the endpoint may receive JSON, multipart form data, or file uploads.

```ts
import { addDataAndFileToRequest } from 'payload'

export const uploadEndpoint = {
  path: '/upload',
  method: 'post',
  handler: async (req) => {
    await addDataAndFileToRequest(req)
    return Response.json({ data: req.data, file: Boolean(req.file) })
  },
}
```

## `addLocalesToRequestFromData`

Use this when locale selection comes from request data and should be validated against config.

```ts
import { addLocalesToRequestFromData } from 'payload'

export const localizedEndpoint = {
  path: '/translate',
  method: 'post',
  handler: async (req) => {
    await addLocalesToRequestFromData(req)
    return Response.json({ locale: req.locale })
  },
}
```

## `headersWithCors`

Use this when the response should carry the project’s configured CORS policy.

```ts
import { headersWithCors } from 'payload'

export const publicEndpoint = {
  path: '/public-data',
  method: 'get',
  handler: async (req) => {
    return new Response(JSON.stringify({ ok: true }), {
      headers: headersWithCors({ headers: new Headers(), req }),
    })
  },
}
```

## Helper Selection Rule

```text
Need parsed body or upload? -> addDataAndFileToRequest
Need locale extraction?     -> addLocalesToRequestFromData
Need config-based CORS?     -> headersWithCors
```
