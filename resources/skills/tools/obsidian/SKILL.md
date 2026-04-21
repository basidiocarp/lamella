---
name: obsidian
description: "Manages Obsidian vaults and Obsidian Flavored Markdown."
origin: lamella
---

# Obsidian


## Contents

- [Find the active vault(s)](#find-the-active-vaults)
- [obsidian-cli quick start](#obsidian-cli-quick-start)
- [Obsidian Flavored Markdown](#obsidian-flavored-markdown)

Obsidian vault = a normal folder on disk.

Vault structure (typical)

- Notes: `*.md` (plain text Markdown; edit with any editor)
- Config: `.obsidian/` (workspace + plugin settings; usually don’t touch from scripts)
- Canvases: `*.canvas` (JSON)
- Attachments: whatever folder you chose in Obsidian settings (images/PDFs/etc.)

## Find the active vault(s)

Obsidian desktop tracks vaults in `obsidian.json`. Common locations:

- macOS: `~/Library/Application Support/obsidian/obsidian.json`
- Linux: `~/.config/obsidian/obsidian.json`
- Windows: `%AppData%/obsidian/obsidian.json`

`obsidian-cli` resolves vaults from that file; vault name is typically the **folder name** (path suffix).

Fast “what vault is active / where are the notes?”

- If you’ve already set a default: `obsidian-cli print-default --path-only`
- Otherwise, read the platform's `obsidian.json` and use the vault entry with `"open": true`.

Notes

- Multiple vaults common (iCloud vs `~/Documents`, work/personal, etc.). Don’t guess; read config.
- Avoid writing hardcoded vault paths into scripts; prefer reading the config or using `print-default`.

## obsidian-cli quick start

Pick a default vault (once):

- `obsidian-cli set-default "<vault-folder-name>"`
- `obsidian-cli print-default` / `obsidian-cli print-default --path-only`

Search

- `obsidian-cli search "query"` (note names)
- `obsidian-cli search-content "query"` (inside notes; shows snippets + lines)

Create

- `obsidian-cli create "Folder/New note" --content "..." --open`
- Requires Obsidian URI handler (`obsidian://…`) working (Obsidian installed).
- Avoid creating notes under “hidden” dot-folders (e.g. `.something/...`) via URI; Obsidian may refuse.

Move/rename (safe refactor)

- `obsidian-cli move "old/path/note" "new/path/note"`
- Updates `[[wikilinks]]` and common Markdown links across the vault (this is the main win vs `mv`).

Delete

- `obsidian-cli delete "path/note"`

Prefer direct edits when appropriate: open the `.md` file and change it; Obsidian will pick it up.

---

## Obsidian Flavored Markdown

Obsidian extends CommonMark + GFM. Only Obsidian-specific extensions here — standard Markdown is assumed knowledge.

### Internal Links (Wikilinks)

```markdown
[[Note Name]]
[[Note Name|Display Text]]
[[Note Name#Heading]]
[[Note Name#^block-id]]
[[#Heading in same note]]
```

Define a block ID by appending `^block-id` at the end of a paragraph:

```markdown
This paragraph can be linked to. ^my-block-id
```

### Embeds

```markdown
![[Note Name]]                  Embed entire note
![[Note Name#Heading]]          Embed section
![[Note Name#^block-id]]        Embed block
![[image.png]]                  Image
![[image.png|300]]              Image with width
![[document.pdf]]               PDF
![[document.pdf#page=3]]        PDF at page
![[audio.mp3]]                  Audio
```

### Callouts

```markdown
> [!note]
> Basic callout.

> [!warning] Custom Title
> Callout with custom title.

> [!faq]- Collapsed by default
> Hidden until expanded.

> [!faq]+ Expanded by default
> Visible but collapsible.
```

Types: `note`, `abstract` (`summary`/`tldr`), `info`, `todo`, `tip` (`hint`/`important`), `success` (`check`/`done`), `question` (`help`/`faq`), `warning` (`caution`/`attention`), `failure` (`fail`/`missing`), `danger` (`error`), `bug`, `example`, `quote` (`cite`).

### Properties (Frontmatter)

```yaml
---
title: My Note Title
date: 2024-01-15
tags: [project, important]
aliases: [My Note, Alternative Name]
cssclasses: [custom-class]
status: in-progress
---
```

Property types: text, number, checkbox (boolean), date (`YYYY-MM-DD`), datetime (`YYYY-MM-DDTHH:mm:ss`), list, links (`"[[Other Note]]"`). Default properties: `tags`, `aliases`, `cssclasses`.

### Tags

```markdown
#tag  #nested/tag  #tag-with-dashes
```

Tags can contain letters, numbers (not first char), underscores, hyphens, forward slashes.

### Other Syntax

```markdown
%%hidden comment%%               Inline comment
==highlighted text==             Highlighting
$e^{i\pi} + 1 = 0$              Inline math (LaTeX)
Footnote ref[^1]                 Footnote
[^1]: Footnote content.
Inline footnote.^[Content here.]
```

Escape pipes in tables: `[[Link\|Display]]`

Use mermaid code blocks for diagrams.

---

## Vault Management

### Recommended Vault Structure

```
vault/
├── projects/              # Project-specific documentation
├── technologies/          # Technology knowledge
├── ideas/                 # Feature ideas and experiments
├── todo/                  # Tasks and checklists
├── references/            # Bookmarks, snippets, cheatsheets
├── journal/               # Auto-captured events
│   ├── commits/           # Git commit documentation
│   ├── tasks/             # Completed task summaries
│   └── creations/         # Component creation logs
└── _archive/              # Archived notes
```

### Auto-Capture Patterns

**Git commits** → `journal/commits/YYYY-MM-DD-<slug>.md` with commit message, date, project, branch, files changed.

**Task completions** → `journal/tasks/YYYY-MM-DD-<slug>.md` with summary, decisions made.

### Organization Best Practices

- Archive rather than delete
- Maintain bidirectional `[[wikilinks]]`
- Use consistent naming within categories
- Always include frontmatter (`tags`, `created`, `updated`, `related`)

## References

- `references/frontmatter-spec.md` — detailed frontmatter specification
