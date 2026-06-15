# Lost-in-Middle Detection

Use this workflow when long prompts appear to bury important instructions.

## Workflow

1. list the critical instructions
2. run multiple agents against the same prompt
3. verify each output against the instruction list
4. aggregate compliance by instruction
5. move or restate the weakest instructions

## Rule

If an instruction is frequently missed, treat that as a prompt-layout problem
before assuming the model is unreliable.
