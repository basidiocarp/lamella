# err-lowercase-msg

> Keep error messages lowercase and punctuation-light unless style requires otherwise

Error messages should compose cleanly inside larger chains.

## Prefer

- lowercase messages without trailing punctuation by default
- concise wording focused on what failed
- proper nouns or domain terms capitalized only when needed

## Avoid

- sentence-style capitalization everywhere
- trailing periods that make chained errors read awkwardly
- verbose prose where a short operation-focused message is enough

## See Also

- [err-context-chain](./err-context-chain.md) - Add useful context around errors
- [err-source-chain](./err-source-chain.md) - Preserve readable chains
