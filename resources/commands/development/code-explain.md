# Code Explanation and Analysis

## Context

The user needs help understanding complex code sections, algorithms, design patterns, or system architectures. Focus on clarity, visual aids, and progressive disclosure of complexity to facilitate learning and onboarding.

## Requirements

$ARGUMENTS

## Instructions

### 1. Code Comprehension Analysis

Analyze the code to determine complexity and structure:

**Code Complexity Assessment**

```python
import ast
import re
from typing import Dict, List, Tuple

class CodeAnalyzer:
    def analyze_complexity(self, code: str) -> Dict:
        """
# ... (74 lines trimmed for brevity)

        return list(set(concepts))
```

### 2. Visual Explanation Generation

Create visual representations of code flow:

**Flow Diagram Generation**

````python
class VisualExplainer:
    def generate_flow_diagram(self, code_structure):
        """
        Generate Mermaid diagram showing code flow
        """
        diagram = "```mermaid\nflowchart TD\n"

# ... (60 lines trimmed for brevity)
        diagram += "```"
        return diagram
````

### 3. Step-by-Step Explanation

Break down complex code into digestible steps:

**Progressive Explanation**

````python
def generate_step_by_step_explanation(self, code, analysis):
    """
    Create progressive explanation from simple to complex
    """
    explanation = {
        'overview': self._generate_overview(code, analysis),
        'steps': [],
# ... (52 lines trimmed for brevity)

**How it works**:
```python
# This decorator:
@timer
def slow_function():
    time.sleep(1)

# Is equivalent to:
def slow_function():
    time.sleep(1)
slow_function = timer(slow_function)
````

**In this code**: The decorator is used to {specific_use_in_code}
''',
'generators': '''

## Understanding Generators

Generators produce values one at a time, saving memory by not creating all values at once.

**Simple Analogy**: Like a ticket dispenser that gives one ticket at a time, rather than printing all tickets upfront.

**How it works**:

```python
# Generator function
def count_up_to(n):
    i = 0
    while i < n:
        yield i  # Produces one value and pauses
        i += 1

# Using the generator
for num in count_up_to(5):
    print(num)  # Prints 0, 1, 2, 3, 4
```

**In this code**: The generator is used to {specific_use_in_code}
'''
}

    return explanations.get(concept, f"Explanation for {concept}")

````

# Test cases - try these:
safe_divide(10, 2)    # Success case
safe_divide(10, 0)    # Division by zero
safe_divide(10, "2")  # Type error
````

### Example 2: Custom Exceptions

```python
class ValidationError(Exception):
    """Custom exception for validation errors"""
    pass

def validate_age(age):
    try:
        age = int(age)
        if age < 0:
            raise ValidationError("Age cannot be negative")
        if age > 150:
            raise ValidationError("Age seems unrealistic")
        return age
    except ValueError:
        raise ValidationError("Age must be a number")

# Try these examples:
try:
    validate_age(25)     # Valid
    validate_age(-5)     # Negative age
    validate_age("abc")  # Not a number
except ValidationError as e:
    print(f"Validation failed: {e}")
```

### Exercise: Implement Your Own

Try implementing a function that:

1. Takes a list of numbers
2. Returns their average
3. Handles empty lists
4. Handles non-numeric values
5. Uses appropriate exception handling
   ''',
   'async_programming': '''

## Try It Yourself: Async Programming

### Example 1: Basic Async/Await

```python
import asyncio
import time

async def slow_operation(name, duration):
    print(f"{name} started...")
    await asyncio.sleep(duration)
    print(f"{name} completed after {duration}s")
    return f"{name} result"

async def main():
    # Sequential execution (slow)
    start = time.time()
    await slow_operation("Task 1", 2)
    await slow_operation("Task 2", 2)
    print(f"Sequential time: {time.time() - start:.2f}s")

    # Concurrent execution (fast)
    start = time.time()
    results = await asyncio.gather(
        slow_operation("Task 3", 2),
        slow_operation("Task 4", 2)
    )
    print(f"Concurrent time: {time.time() - start:.2f}s")
    print(f"Results: {results}")

# Run it:
asyncio.run(main())
```

### Example 2: Real-world Async Pattern

```python
async def fetch_data(url):
    """Simulate API call"""
    await asyncio.sleep(1)  # Simulate network delay
    return f"Data from {url}"

async def process_urls(urls):
    tasks = [fetch_data(url) for url in urls]
    results = await asyncio.gather(*tasks)
    return results

# Try with different URLs:
urls = ["api.example.com/1", "api.example.com/2", "api.example.com/3"]
results = asyncio.run(process_urls(urls))
print(results)
```

'''
}

    return examples.get(concept, "No example available")

````

# Newsletter subscription system
class Newsletter:
    def __init__(self):
        self._subscribers = []
        self._latest_article = None

    def subscribe(self, subscriber):
        self._subscribers.append(subscriber)

    def unsubscribe(self, subscriber):
        self._subscribers.remove(subscriber)

    def publish_article(self, article):
        self._latest_article = article
        self._notify_subscribers()

    def _notify_subscribers(self):
        for subscriber in self._subscribers:
            subscriber.update(self._latest_article)

class EmailSubscriber:
    def __init__(self, email):
        self.email = email

    def update(self, article):
        print(f"Sending email to {self.email}: New article - {article}")
```

'''
}

        return patterns.get(pattern_name, "Pattern explanation not available")

````

# Bad
try:
    risky_operation()
except:
    print("Something went wrong")

# Good
try:
    risky_operation()
except (ValueError, TypeError) as e:
    print(f"Expected error: {e}")
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    raise
````

'''
},
{
'pattern': r'def._\(\s_\):.\*global',
'issue': 'Global variable usage',
'explanation': 'Global state makes behavior harder to reason about and test.',
'safer_pattern': 'Pass state explicitly or wrap it in an object with clear ownership.'
**Example refactor**:

```python
# Bad
count = 0
def increment():
    global count
    count += 1

# Good
class Counter:
    def __init__(self):
        self.count = 0

    def increment(self):
        self.count += 1
        return self.count
```

'''
}
]

    for pitfall in pitfall_patterns:
        if re.search(pitfall['pattern'], code):
            issues.append(pitfall)

    return issues

````

## Output Format

1. **Complexity Analysis**: Overview of code complexity and concepts used
2. **Visual Diagrams**: Flow charts, class diagrams, and execution visualizations
3. **Step-by-Step Breakdown**: Progressive explanation from simple to complex
4. **Interactive Examples**: Runnable code samples to experiment with
5. **Common Pitfalls**: Issues to avoid with explanations
6. **Best Practices**: Improved approaches and patterns
7. **Learning Resources**: Curated resources for deeper understanding
8. **Practice Exercises**: Hands-on challenges to reinforce learning

Focus on making complex code accessible through clear explanations, visual aids, and practical examples that build understanding progressively.
