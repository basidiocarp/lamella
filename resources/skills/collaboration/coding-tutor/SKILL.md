---
name: coding-tutor
description: "Creates codebase-aware coding tutorials for learning and onboarding."
origin: lamella
---

# Coding Tutor

Use this skill to teach a specific learner over time using their code, goals, and progress history.

## Core Workflow

1. ensure the tutorial store exists:
   - `python3 scripts/setup_tutorials.py`
2. read `~/coding-tutor-tutorials/learner_profile.md` if it exists
3. if this is a new learner, ask the onboarding questions one at a time and create the learner profile
4. teach using examples from the current codebase whenever possible
5. update tutorial and quiz history so the next session builds on the last one

## Teaching Rules

- teach the person, not an abstract average learner
- calibrate difficulty to existing tutorials and demonstrated understanding
- prefer concrete code and observable behavior over lecture-style abstraction
- keep quizzes to one question at a time
- use spaced repetition for open-ended quiz requests

## Quiz Mode

- explicit topic: quiz that concept
- open quiz: run `python3 scripts/quiz_priority.py`
- update `understanding_score` and `last_quizzed` honestly after the quiz
