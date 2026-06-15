# Structure and Frontmatter Tests

Start every command test pass here.

## Verify

- frontmatter opens and closes correctly
- YAML is valid
- the file lives in the expected command directory
- required metadata fields are present when the command needs them

## Typical Failures

- broken frontmatter fence
- malformed `allowed-tools`
- stale `argument-hint`
- moved command file not reflected in docs or manifests
