# Thought-Based Reasoning Techniques - Full Reference

## 1. Chain-of-Thought (CoT) Prompting

**Paper**: "Chain of Thought Prompting Elicits Reasoning in Large Language Models" (Wei et al., 2022)
**Citations**: 14,255+

### When to Use
- Multi-step arithmetic or math word problems
- Commonsense reasoning requiring logical deduction
- Symbolic reasoning tasks
- When you have good exemplars showing reasoning

### Prompt Template

```
Q: Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?
A: Roger started with 5 balls. 2 cans of 3 tennis balls each is 6 tennis balls. 5 + 6 = 11. The answer is 11.

Q: The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have?
A: The cafeteria had 23 apples originally. They used 20 to make lunch. So they had 23 - 20 = 3. They bought 6 more apples, so they have 3 + 6 = 9. The answer is 9.

Q: [YOUR QUESTION HERE]
A:
```

### Strengths
- Significant accuracy improvements on reasoning tasks
- Interpretable intermediate steps
- Works well with large models (>100B parameters)

### Limitations
- Requires crafting good exemplars
- Less effective on smaller models
- Can still make calculation errors

---

## 2. Zero-shot Chain-of-Thought

**Paper**: "Large Language Models are Zero-Shot Reasoners" (Kojima et al., 2022)
**Citations**: 5,985+

### When to Use
- No exemplars available
- Quick reasoning needed
- General-purpose reasoning across task types
- Prototyping before creating few-shot examples

### Prompt Template

```
Q: A juggler can juggle 16 balls. Half of the balls are golf balls, and half of the golf balls are blue. How many blue golf balls are there?

Let's think step by step.
```

**Alternative trigger phrases**:
- "Let's work this out step by step to be sure we have the right answer."
- "Let's break this down."
- "Let's approach this systematically."
- "First, let me understand the problem..."

### Two-Stage Approach (More Robust)

**Stage 1 - Reasoning Extraction**:
```
Q: [QUESTION]
A: Let's think step by step.
```

**Stage 2 - Answer Extraction**:
```
[REASONING FROM STAGE 1]
Therefore, the answer is
```

---

## 3. Self-Consistency

**Paper**: "Self-Consistency Improves Chain of Thought Reasoning in Language Models" (Wang et al., 2022)
**Citations**: 5,379+

### When to Use
- High-stakes decisions requiring confidence
- Problems with multiple valid reasoning paths
- When reduce variance in outputs
- Verification of reasoning correctness

### Implementation Example

```python
def self_consistency(prompt, n_samples=5, temperature=0.7):
    answers = []
    for _ in range(n_samples):
        response = llm.generate(prompt, temperature=temperature)
        answer = extract_answer(response)
        answers.append(answer)

    # Majority vote
    return Counter(answers).most_common(1)[0][0]
```

---

## 4. Tree of Thoughts (ToT)

**Paper**: "Tree of Thoughts: Deliberate Problem Solving with Large Language Models" (Yao et al., 2023)
**Citations**: 3,026+

### When to Use
- Complex problems requiring exploration/backtracking
- Tasks where initial decisions are pivotal
- Creative problem-solving (writing, puzzles)
- When CoT alone achieves <50% accuracy

### Prompt Templates

**Thought Generation**:
```
Given the current state:
[STATE]

Generate 3-5 possible next steps to solve this problem.
```

**State Evaluation**:
```
Evaluate if the following partial solution is:
- "sure" (definitely leads to solution)
- "maybe" (could potentially work)
- "impossible" (cannot lead to solution)

Partial solution:
[THOUGHTS SO FAR]
```

**BFS/DFS Search**:
```python
def tree_of_thoughts(problem, max_depth=3, beam_width=3):
    queue = [(problem, [])]  # (state, thought_path)

    while queue:
        state, path = queue.pop(0)
// ... (14 lines trimmed)
                queue.append((new_state, path + [thought]))

    return None
```

### Example: Game of 24

```
Problem: Use 4, 9, 10, 13 to get 24 (use +, -, *, / and each number once)

Thought 1: 13 - 9 = 4 (Now have: 4, 4, 10)
Evaluation: "maybe" - have two 4s and 10, could work

Thought 2: 10 - 4 = 6 (Now have: 4, 6, 13)
Evaluation: "maybe" - 4 * 6 = 24, need to use 13

Thought 3: 4 + 9 = 13 (Now have: 10, 13, 13)
Evaluation: "impossible" - no way to get 24 from these
```

---

## 5. Least-to-Most Prompting

**Paper**: "Least-to-Most Prompting Enables Complex Reasoning in Large Language Models" (Zhou et al., 2022)
**Citations**: 1,466+

### When to Use
- Problems harder than your exemplars
- Compositional generalization tasks
- Multi-step problems with clear subproblems
- Symbol manipulation and SCAN-like tasks

### Prompt Template

**Stage 1: Decomposition**
```
Q: Four years ago, Kody was only half as old as Mohamed. If Mohamed is currently twice as old as 30 years old, how old is Kody?

To solve "Four years ago, Kody was only half as old as Mohamed. If Mohamed is currently twice as old as 30 years old, how old is Kody?", we need to first solve:
- "If Mohamed is currently twice as old as 30 years old, how old is Mohamed?"
Then we need to solve:
- "Four years ago, Kody was only half as old as Mohamed. How old is Kody?"
```

**Stage 2: Sequential Solving**
```
Q: If Mohamed is currently twice as old as 30 years old, how old is Mohamed?
A: Mohamed is twice as old as 30, so Mohamed is 30 * 2 = 60 years old.

Q: Four years ago, Kody was only half as old as Mohamed. Mohamed is 60 years old. How old is Kody?
A: Four years ago, Mohamed was 60 - 4 = 56 years old. Kody was half as old, so Kody was 56 / 2 = 28 years old four years ago. Therefore, Kody is currently 28 + 4 = 32 years old.

The answer is 32.
```

---

## 6. ReAct (Reasoning + Acting)

**Paper**: "ReAct: Synergizing Reasoning and Acting in Language Models" (Yao et al., 2022)
**Citations**: 5,012+

### When to Use
- Tasks requiring external information (search, APIs)
- Interactive decision-making environments
- Multi-hop question answering
- When pure reasoning leads to hallucination

### Prompt Template

```
Question: What is the elevation range for the area that the eastern sector of the Colorado orogeny extends into?

Thought 1: I need to search Colorado orogeny, find the area that the eastern sector extends into, then find the elevation range of that area.
Action 1: Search[Colorado orogeny]
Observation 1: The Colorado orogeny was an episode of mountain building (an orogeny) in Colorado and surrounding areas.
// ... (12 lines trimmed)

Thought 5: The elevation range is 1,800 to 7,000 ft.
Action 5: Finish[1,800 to 7,000 ft]
```

### Action Types
- `Search[query]` - Search for information
- `Lookup[keyword]` - Look up keyword in current context
- `Finish[answer]` - Return final answer

---

## 7. PAL (Program-Aided Language Models)

**Paper**: "PAL: Program-aided Language Models" (Gao et al., 2022)
**Citations**: 608+

### When to Use
- Mathematical/arithmetic reasoning
- Problems requiring precise computation
- Symbolic manipulation
- When CoT makes calculation errors

### Prompt Template

```
Q: Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?

# solution in Python:
def solution():
    """Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?"""
// ... (15 lines trimmed)
    loaves_returned = 6
    loaves_left = loaves_baked - loaves_sold_morning - loaves_sold_afternoon + loaves_returned
    return loaves_left
```

---

## 8. Auto-CoT

**Paper**: "Automatic Chain of Thought Prompting in Large Language Models" (Zhang et al., 2022)
**Citations**: 838+

### When to Use
- No manually crafted exemplars available
- Want to automate few-shot CoT setup
- Scaling CoT to many tasks
- When zero-shot CoT isn't sufficient

### Implementation

**Step 1: Generate diverse demonstrations**
```python
# Cluster questions
clusters = cluster_questions(all_questions, k=8)

# For each cluster, pick representative and generate CoT
demonstrations = []
for cluster in clusters:
    question = select_representative(cluster)
    reasoning = zero_shot_cot(question)  # "Let's think step by step"
    demonstrations.append((question, reasoning))
```

**Step 2: Use as few-shot exemplars**
```
Q: [Demo question 1]
A: Let's think step by step. [Generated reasoning 1]

Q: [Demo question 2]
A: Let's think step by step. [Generated reasoning 2]

...

Q: [New question]
A: Let's think step by step.
```

---

## 9. Reflexion

**Paper**: "Reflexion: Language Agents with Verbal Reinforcement Learning" (Shinn et al., 2023)
**Citations**: 2,179+

### When to Use
- Iterative improvement over multiple attempts
- Learning from errors without fine-tuning
- Complex coding or decision-making tasks
- When single-pass reasoning is insufficient

### Prompt Template

**Initial Attempt**:
```
Task: [TASK DESCRIPTION]

Thought: [REASONING]
Action: [ACTION]
...
Result: [FAILURE/PARTIAL SUCCESS]
```

**Reflection**:
```
The previous attempt failed because:
1. [SPECIFIC ERROR ANALYSIS]
2. [WHAT SHOULD HAVE BEEN DONE]
3. [KEY INSIGHT FOR NEXT ATTEMPT]

Reflection: In the next attempt, I should...
```

**Subsequent Attempt (with memory)**:
```
Task: [TASK DESCRIPTION]

Previous reflections:
- [REFLECTION 1]
- [REFLECTION 2]

Using these insights, I will now attempt the task again.

Thought: [IMPROVED REASONING]
Action: [BETTER ACTION]
```

### Example: Code Generation

```
Task: Write a function to find the longest palindromic substring.

Attempt 1: [CODE WITH BUG]
Test Result: Failed on "babad" - expected "bab" or "aba", got "b"
// ... (6 lines trimmed)
Attempt 2: [IMPROVED CODE USING REFLECTION]
Test Result: Passed all tests
```
