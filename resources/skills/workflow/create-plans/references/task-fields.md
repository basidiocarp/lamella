<task_fields>

## Required Fields

### `files`
Exact file paths that will be created or modified.

### `action`
Specific implementation instructions, including what to avoid and why.

### `verify`
Concrete command or inspection step that proves the task is done.

### `done_when`
A plain-language statement of the completed state.

</task_fields>

<guardrail>
If you cannot name the files confidently, stop and verify the codebase shape before writing the task.
</guardrail>
