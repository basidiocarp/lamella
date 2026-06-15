# Frontmatter and Body Parsing

## Frontmatter

- extract content between the first two `---` markers
- keep parsing logic explicit and predictable
- use a YAML-aware parser when lists or nested values matter

## Body

- treat everything after the closing marker as markdown body content
- use the body for prompts, notes, or longer free-form configuration
- JSON-escape body content before embedding it in machine-readable output
