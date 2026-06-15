# Flowcharts

Use flowcharts for processes, decision trees, state-like user journeys, and
 algorithm sketches.

## Basic Syntax

```mermaid
flowchart TD
  A --> B
```

Directions:

- `TD` or `TB`: top to bottom
- `BT`: bottom to top
- `LR`: left to right
- `RL`: right to left

## Common Node Shapes

```mermaid
flowchart LR
  A[Process]
  B([Rounded])
  C(Start)
  D[[Subroutine]]
  E[(Database)]
  F{Decision?}
  G[/Input/]
```

## Connections

```mermaid
flowchart LR
  A --> B
  B -->|Yes| C
  B -->|No| D
  C -.-> E
  D ==> E
```

- `-->`: normal arrow
- `---`: open link
- `-.->`: dotted link
- `==>`: thick link

## Subgraphs

```mermaid
flowchart TB
  A[Start]

  subgraph Processing
    B[Validate]
    C[Transform]
  end

  A --> B --> C
```

Use `direction` inside a subgraph when that section needs a different layout.

## Styling

### Class-Based

```mermaid
flowchart LR
  A[Healthy]:::good --> B[Warning]:::warn --> C[Failed]:::bad

  classDef good fill:#90ee90,stroke:#333
  classDef warn fill:#ffd966,stroke:#333
  classDef bad fill:#ff9999,stroke:#333,color:#111
```

### Link Styling

```mermaid
flowchart LR
  A --> B
  linkStyle 0 stroke:#4f46e5,stroke-width:3px
```

## Example Pattern

```mermaid
flowchart TD
  Start([User visits page]) --> Auth{Authenticated?}
  Auth -->|No| Login[Show login]
  Auth -->|Yes| Dashboard[Show dashboard]
  Login --> Validate{Valid credentials?}
  Validate -->|Yes| Dashboard
  Validate -->|No| Error[Show error]
  Error --> Login
```

## Practical Rule

If the flowchart starts looking like a full state machine or a dense systems
architecture, switch to a state diagram or C4 diagram instead of stretching
flowcharts past their natural fit.
