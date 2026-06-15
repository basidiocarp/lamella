# Help and Error Guidance

Commands should teach the user how to recover, not only announce failure.

## Help Guidance

- show the simplest valid invocation first
- keep examples close to the relevant argument shape
- add contextual help for operations with easy-to-miss prerequisites

## Error Guidance

- state what failed
- state why if known
- state the next useful action

Avoid vague errors such as "invalid input" when the command can point to the
real field or missing prerequisite.
