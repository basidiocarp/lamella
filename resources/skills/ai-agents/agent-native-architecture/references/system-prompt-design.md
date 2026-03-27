<overview>
System prompts are the primary behavior layer in prompt-native agents. They
should define goals, judgment criteria, boundaries, and tool use clearly enough
that code does not need to hard-code every policy.
</overview>

<principle name="features-in-prompts">
## Features Live in Prompt Sections

Treat each feature as a prompt section with:
- when it applies
- what outcome it should produce
- how to judge quality

The prompt should describe behavior, not mirror imperative code line by line.
</principle>

<structure>
## Prompt Structure

A practical system prompt usually includes:
- identity
- core behavior
- feature sections
- judgment criteria
- tool guidance
- explicit boundaries
</structure>

<principle name="guide-not-micromanage">
## Guide, Do Not Micromanage

Give the agent decision criteria and intent. Avoid brittle formatting rules or
overly prescriptive micro-steps unless the task is truly sensitive.
</principle>

<principle name="judgment-criteria">
## Prefer Criteria Over Rigid Rules

Good prompt-native behavior comes from clear criteria such as:
- impact
- urgency
- evidence quality
- reversibility

That gives the agent room to apply judgment without improvising blindly.
</principle>

<principle name="context-windows">
## Design for the Active Context

System prompts should acknowledge:
- limited live context
- the need for retrieval or memory when continuity matters
- the importance of not repeating known information unnecessarily
</principle>

<iteration>
## Iterate Through Observation

Prompt-native development is:
1. observe real behavior
2. identify the gap
3. add or refine guidance
4. redeploy the prompt

Good system prompt design is operational and iterative, not one-shot.
</iteration>
