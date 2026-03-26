<overview>
Use this reference when the request is a refactor, restructuring pass, or code
health initiative rather than new feature delivery.
</overview>

<core_rule>
Refactor plans should be written as tiny, behavior-preserving steps.

Each step must leave the program working. If you cannot explain how a step
keeps the system running, the step is too large.
</core_rule>

<interview_topics>
Before writing the plan, pin down:

- The actual pain the refactor is meant to remove
- Options considered and why they are not preferred
- What behavior must stay stable
- What can change safely
- What tests already cover this area
- What new tests are needed before moving structure around
</interview_topics>

<plan_shape>
Refactor plans should include:

- Problem statement in developer terms
- The chosen direction
- Tiny commits in execution order
- Testing decisions
- Explicit out-of-scope items

Avoid file-by-file change lists unless the file paths are already verified and
unlikely to churn.
</plan_shape>

<tiny_commit_rule>
Prefer sequences like:

1. Add or improve the characterization test
2. Extract the stable interface
3. Move one caller or path at a time
4. Remove dead code only after behavior is proven stable

Do not batch "all tests first" and "all code second." Keep RED/GREEN loops
close to each change.
</tiny_commit_rule>

<durability_rule>
Write the plan in terms that survive later edits:

- Contracts and behavior
- Module boundaries
- Data flow
- Observed outcomes

Do not overfit the plan to today's filenames or function names.
</durability_rule>
