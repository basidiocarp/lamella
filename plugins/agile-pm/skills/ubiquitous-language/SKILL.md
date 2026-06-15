---
name: ubiquitous-language
description: "Builds a shared domain glossary with canonical terms, ambiguities, and usage rules."
origin: lamella
---

# Ubiquitous Language

Turn loose domain wording into a shared vocabulary.

## When to Use

- The same concept is named differently across docs or discussions
- One term is overloaded and means multiple things
- A product area needs a durable glossary before implementation
- A team is defining a domain model, workflow, or bounded context

## Workflow

1. **Scan the source material**: Use the conversation, docs, and code terms already in context.
2. **Extract candidate terms**: Capture domain nouns, verbs, states, and lifecycle names.
3. **Find conflicts**: Flag synonyms, overloaded terms, vague labels, and missing concepts.
4. **Choose canonical terms**: Prefer the most precise and durable wording.
5. **Define usage rules**: Explain where each term applies and where it should not.
6. **Produce the glossary**: Summarize the final vocabulary inline and save it if the user wants a durable artifact.

## Output Format

For each term, include:

- **Canonical term**
- **Definition**
- **Avoid using for**
- **Related terms**

Then include:

- **Ambiguities to retire**
- **Open questions**
- **Suggested file name** if saving the glossary

## Save Target

If the user wants a persistent artifact, prefer `docs/domain-language/<topic>.md` when the repo already uses a `docs/` directory. Otherwise save `UBIQUITOUS_LANGUAGE.md` at the project root.
