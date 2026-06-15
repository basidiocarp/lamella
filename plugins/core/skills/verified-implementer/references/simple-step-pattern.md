# Simple Step Pattern

Use this when the task file marks a step as non-critical and no judge pass is
required.

## Flow

1. dispatch one implementation agent with the step number and task path
2. collect its report: touched files, completion status, issues
3. do not open the produced artifact yourself
4. mark the step and subtasks complete in the task file

## Use When

- setup work
- low-risk scaffolding
- mechanical updates where the task file explicitly allows no verification
