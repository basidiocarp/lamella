---
name: memoir-concept-extraction
description: "Run this to extract domain knowledge into a memoir — captures named concepts and relationships from documents or hyphae search results."
origin: lamella
---

# Memoir Concept Extraction

Extract structured knowledge from a source document or ingested hyphae content and populate a named memoir with concepts and their relationships.

## When to Use

- Populating a memoir from a design document, architecture decision record, or code graph export
- Closing the gap between ingested hyphae documents and the memoir knowledge graph
- Building an initial memoir for a new system or component from existing documentation
- After `hyphae_ingest_file`: running this skill turns flat ingested content into structured graph nodes

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `memoir` | Yes | Name of the target memoir (will be created if it does not already exist) |
| `source` | Yes | File path to read directly, OR a search query to retrieve from hyphae docs |

## Workflow

1. **Load source content**
   - If `source` looks like a file path (starts with `/` or `./`): read the file contents directly
   - If `source` is a topic or query string: call `hyphae_search_docs` with the query and gather the retrieved chunks

2. **Identify concepts** — Extract 5–15 named entities from the content.
   A concept is a named component, service, system, design decision, pattern, or domain entity that has a clear definition and relationships to other concepts.
   Skip generic terms (e.g. "helper", "utility", "wrapper") unless they represent a domain-significant abstraction that the source names and defines explicitly.

3. **Write definitions** — For each concept, write a 2–4 sentence definition focused on:
   - Purpose: what this concept does or represents
   - Behavior: how it operates or what it produces
   - Key properties: distinguishing characteristics or constraints

4. **Identify relationships** — Extract 3–10 typed relationships between concept pairs.
   Only extract relationships the source states explicitly. Do not infer.

5. **Populate the memoir**
   - If the memoir does not exist, create it first with `hyphae_memoir_create`
   - For each concept: call `hyphae_memoir_add_concept`
   - For each relationship: call `hyphae_memoir_link`
   - Report totals at the end

## Tool Calls

Create the memoir (if needed):
```
hyphae_memoir_create(name: <memoir_name>, description: <one-line description of the source>)
```

Add a concept:
```
hyphae_memoir_add_concept(memoir: <memoir_name>, name: <concept_name>, definition: <definition>)
```

Link two concepts:
```
hyphae_memoir_link(memoir: <memoir_name>, from: <source_concept>, to: <target_concept>, relation: <relation_type>)
```

Search hyphae docs for source content:
```
hyphae_search_docs(query: <search_query>)
```

## Relationship Vocabulary

Use only these relation types. If none fits, omit the relationship.

| Relation | Meaning |
|----------|---------|
| `depends_on` | Source requires target to function |
| `owns` | Source is responsible for or contains target |
| `implements` | Source provides a concrete realization of target |
| `extends` | Source builds on or specializes target |
| `coordinates_with` | Source and target communicate or collaborate at runtime |
| `produces` | Source generates or emits target |
| `consumes` | Source reads or processes target |

## Output

After extraction, report:
- Number of concepts added
- Number of links added
- Names of concepts extracted

## Boundaries

**Will:**
- Extract only what the source makes explicit
- Use the 7 relation types listed above
- Create the memoir if it does not already exist
- Limit concepts to 15 maximum; focus on the most important named entities

**Will Not:**
- Infer relationships not stated in the source
- Modify existing concept definitions (use `hyphae_memoir_refine` for updates to existing concepts)
- Automatically trigger on ingest (operator-invoked only)
- Run on multiple sources in a single invocation (invoke once per source)
