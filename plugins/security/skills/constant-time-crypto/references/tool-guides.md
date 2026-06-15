# Constant-Time Analysis Tool Guides

Use these tools together instead of expecting a single tool to prove
constant-time behavior.

## Tool Roles

| Tool | Best use | Main tradeoff |
|---|---|---|
| `dudect` | fast statistical leak detection | tells you that a leak probably exists, not where |
| `Timecop` / Valgrind-based tracing | line-level dependency tracing | slower and limited to executed paths |
| formal tools like `ct-verif` | highest-assurance proofs on narrow targets | setup cost and modeling overhead |

## `dudect`

Start here when you need a practical signal on whether two input classes differ
measurably in runtime.

Typical use:
- fixed-vs-random input comparisons
- CI regression checks for critical primitives
- quick follow-up after a constant-time refactor

Keep the harness:
- minimal
- noise-resistant
- focused on one primitive per test

Interpretation:
- a strong result means the code probably leaks timing information
- a clean result is not proof of safety

## `Timecop`

Use a tracing tool after you have a suspicious path and need better root-cause
locality.

Best for:
- secret-dependent branches
- secret-dependent memory access
- narrowing a leak to a function or source line

Expect limits:
- only executed paths are analyzed
- microarchitectural effects may remain invisible
- runtime is much slower than normal execution

## Formal Tools

Use formal tooling only for narrow, critical code where proof effort is justified:

- signature verification
- MAC comparison
- key schedule internals
- long-lived crypto primitives reused across products

Examples in this family:
- `ct-verif`
- SideTrail
- DSL or proof-oriented ecosystems built for constant-time constraints

## Suggested Workflow

1. Review the source for obvious secret-dependent branches, division, and table
   lookups.
2. Run `dudect` for a practical timing signal.
3. If `dudect` flags a problem, use tracing to localize the cause.
4. Use formal tooling only on the smallest critical surfaces that justify it.

## CI Guidance

Good CI use cases:
- short `dudect` gates on a few critical primitives
- artifact capture for failed timing runs
- explicit allowlists for known noisy environments

Bad CI use cases:
- treating one clean run as proof of constant-time behavior
- trying to run heavyweight formal tooling on every pull request

## Selection Matrix

| Scenario | Start with | Follow with |
|---|---|---|
| quick regression check | `dudect` | tracing if suspicious |
| need a root cause | tracing | source and assembly review |
| high-assurance proof target | source narrowing | formal verification |
| noisy production-like binary | `dudect` with tighter harness | targeted tracing |

Use the tools as complementary evidence, not as interchangeable checkboxes.
