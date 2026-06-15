# API and File Security

Treat API hardening as one surface: request rate, auth, browser policy, and
upload handling all need to align.

## API Surface

- configure DRF throttling for anonymous and authenticated traffic
- pick authentication classes deliberately instead of inheriting insecure
  defaults
- keep permissions explicit on protected views

## Browser and Content Policy

- use CSP and related headers to narrow what clients may execute or embed
- keep upload-serving paths separate from main app execution paths

## File Uploads

- validate extension, size, and content assumptions
- store uploads outside executable/static paths
- prefer object storage or isolated media serving in production
