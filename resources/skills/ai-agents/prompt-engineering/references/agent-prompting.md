# Agent Prompting Best Practices

Based on Anthropic's official best practices for agent prompting.

## Context Window

The "context window" is the model's "working memory" - all text it can reference when generating. This is different from training data.

- **Progressive token accumulation**: Each message accumulates within the context window
- **Linear growth pattern**: Context usage grows with each turn
- **200K token capacity**: Maximum for conversation history and output
- **Input-output flow**: Each turn has input (history + message) and output (response)

## Concise is Key

The context window is a public good shared with:

- System prompt
- Conversation history
- Other commands, skills, hooks, metadata
- Actual request

**Default assumption**: Claude is already very smart. Only add context Claude doesn't already have.

Challenge each piece:

- "Does Claude really need this explanation?"
- "Can I assume Claude knows this?"
- "Does this paragraph justify its token cost?"

**Good example: Concise** (~50 tokens):

```markdown
## Extract PDF text

Use pdfplumber for text extraction:

import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

**Bad example: Verbose** (~150 tokens):

```markdown
## Extract PDF text

PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, use a library...
```

## Set Appropriate Degrees of Freedom

Match specificity to task fragility and variability.

### High Freedom (text-based instructions)

Use when multiple approaches are valid, decisions depend on context.

```markdown
## Code review process

1. Analyze the code structure and organization
2. Check for potential bugs or edge cases
3. Suggest improvements for readability
4. Verify adherence to project conventions
```

### Medium Freedom (pseudocode with parameters)

Use when a preferred pattern exists but some variation is acceptable.

```markdown
## Generate report

Use this template and customize as needed:

def generate_report(data, format="markdown", include_charts=True):
    # Process data
    # Generate output in specified format
```

### Low Freedom (specific scripts, few parameters)

Use when operations are fragile, consistency is critical.

```markdown
## Database migration

Run exactly this script:

python scripts/migrate.py --verify --backup

Do not modify the command or add additional flags.
```

**Analogy**: Think of Claude as a robot exploring a path:

- **Narrow bridge with cliffs**: One safe way. Provide exact instructions (low freedom)
- **Open field**: Many paths to success. Give general direction (high freedom)
