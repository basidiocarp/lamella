---
title: "Behavioral Design Patterns"
description: "Reference for Observer, Strategy, Command, Chain of Responsibility and other behavior patterns"
tags: [reference, design-patterns, architecture]
---

# Behavioral Design Patterns

Patterns concerned with algorithms and the assignment of responsibilities between objects, focusing on communication patterns.

## Chain of Responsibility

### Definition
Passes requests along a chain of handlers, where each handler decides either to process the request or pass it to the next handler.

### When to Use
- [x] More than one object may handle a request, and handler isn't known a priori
- [x] Want to issue request without specifying receiver explicitly
- [x] Set of handlers can be specified dynamically
- [x] Processing order matters

### TypeScript Signature
```typescript
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): string | null;
}

// ... (37 lines trimmed)
handlerA.setNext(handlerB);

console.log(handlerA.handle('B')); // HandlerB processed B
```

### Stack-Native Alternatives

**Express Middleware**:
```typescript
app.use(authMiddleware);
app.use(loggingMiddleware);
app.use(errorMiddleware);
```

**NestJS Guards/Interceptors**:
```typescript
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
```

### Code Smells It Fixes
- **Tight coupling to request handler**: Client doesn't know which handler processes request
- **Complex conditional logic**: Each handler has simple logic

---

## Command

### Definition
Encapsulates a request as an object, letting you parameterize clients with different requests, queue or log requests, and support undoable operations.

### When to Use
- [x] Parameterize objects with operations
- [x] Queue, specify, and execute requests at different times
- [x] Support undo/redo operations
- [x] Log changes for system crash recovery

### TypeScript Signature
```typescript
// Command interface
interface Command {
  execute(): void;
  undo?(): void;
}
// ... (57 lines trimmed)
remote.execute(new TurnOnCommand(light));  // Light is on
remote.execute(new TurnOffCommand(light)); // Light is off
remote.undo();                             // Light is on
```

### Stack-Native: Redux Actions
```typescript
const incrementAction = { type: 'INCREMENT', payload: 1 };
dispatch(incrementAction); // Command pattern
```

---

## Iterator

### Definition
Provides a way to access elements of a collection sequentially without exposing its underlying representation.

### When to Use
- [x] Need to access collection's contents without exposing internal structure
- [x] Support multiple traversals of collections
- [x] Provide uniform interface for traversing different structures

### TypeScript Signature
```typescript
// Iterator interface
interface Iterator<T> {
  next(): { value: T; done: boolean };
  hasNext(): boolean;
}
// ... (29 lines trimmed)
    return new ArrayIterator(this.items);
  }
}
```

### JavaScript Native Support
```typescript
// Symbol.iterator
const collection = {
  items: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
// ... (22 lines trimmed)
for (const num of numberGenerator()) {
  console.log(num);
}
```

---

## Mediator

### Definition
Defines an object that encapsulates how a set of objects interact, promoting loose coupling by keeping objects from referring to each other explicitly.

### When to Use
- [x] Set of objects communicate in complex ways
- [x] Reusing object is difficult because it refers to many others
- [x] Behavior distributed between classes should be customizable without subclassing

### TypeScript Signature
```typescript
// Mediator interface
interface Mediator {
  notify(sender: object, event: string): void;
}

// ... (63 lines trimmed)
// Component 1 does A
// Mediator reacts to A and triggers:
// Component 2 does C
```

### Stack-Native: React Context
```typescript
const ChatContext = createContext<ChatMediator>(null!);

// Mediator as context
function ChatRoom({ children }: Props) {
// ... (8 lines trimmed)
  );
}
```

### Code Smells It Fixes
- **Complex web of interactions**: Centralized in mediator
- **God object with many responsibilities**: Mediator focuses on coordination only

---

## Memento

### Definition
Captures and externalizes an object's internal state without violating encapsulation, so the object can be restored to this state later.

### When to Use
- [x] Need to save/restore object snapshots (undo/redo)
- [x] Direct interface to state would expose implementation
- [x] Want to preserve encapsulation boundaries

### TypeScript Signature
```typescript
// Memento
class Memento {
  constructor(private state: string, private date: Date) {}

  getState(): string {
// ... (54 lines trimmed)

editor.restore(history.pop()!);
console.log(editor.getContent()); // Hello World
```

### Code Smells It Fixes
- **Exposing internal state for undo**: Memento encapsulates state
- **Complex undo logic**: History manages snapshots

---

## Observer

### Definition
Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified automatically.

### When to Use
- [x] Change to one object requires changing others (unknown number)
- [x] Object should notify others without knowing who they are
- [x] Event-driven architectures
- [x] Reactive programming

### TypeScript Signature
```typescript
// Observer interface
interface Observer {
  update(subject: Subject): void;
}

// ... (63 lines trimmed)
// Output:
// ObserverA: State is now 5
// ObserverB: State is now 5
```

### Stack-Native Alternatives

**React**:
```typescript
const [value, setValue] = useState(0);
useEffect(() => {
  // Auto-notified on value change
}, [value]);
```

**RxJS**:
```typescript
const subject = new BehaviorSubject(0);
subject.subscribe(value => console.log(value));
subject.next(5); // Notifies subscribers
```

**Angular**:
```typescript
private data$ = new BehaviorSubject<Data>(initial);
getData() { return this.data$.asObservable(); }
```

### Code Smells It Fixes
- **Scattered notification logic**: Centralized in subject
- **Tight coupling**: Observers don't know about each other

### Common Mistakes
- **Memory leaks**: Forgetting to unsubscribe/detach
- **Notification storms**: Too many updates triggering cascades
- **Order dependency**: Observers should be independent

---

## State

### Definition
Allows an object to alter its behavior when its internal state changes, appearing to change its class.

### When to Use
- [x] Object behavior depends on its state
- [x] Operations have large conditional statements that depend on state
- [x] State transitions are well-defined

### TypeScript Signature
```typescript
// State interface
interface State {
  handle(context: Context): void;
}

// ... (34 lines trimmed)
const context = new Context(new ConcreteStateA());
context.request(); // StateA handles request, transitions to StateB
context.request(); // StateB handles request, transitions to StateA
```

### Real-World: Document States
```typescript
interface DocumentState {
  publish(doc: Document): void;
  review(doc: Document): void;
}

// ... (41 lines trimmed)
    this.state.review(this);
  }
}
```

### Stack-Native: React useReducer
```typescript
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'DRAFT': return { status: 'draft' };
    case 'REVIEW': return { status: 'review' };
    case 'PUBLISHED': return { status: 'published' };
  }
};

const [state, dispatch] = useReducer(reducer, { status: 'draft' });
```

### Code Smells It Fixes
- **Complex conditionals on state**: Each state is a separate class
- **Scattered state-dependent behavior**: Localized in state classes

---

## Strategy

### Definition
Defines a family of algorithms, encapsulates each one, and makes them interchangeable, letting the algorithm vary independently from clients.

### When to Use
- [x] Many related classes differ only in behavior
- [x] Need different variants of an algorithm
- [x] Algorithm uses data clients shouldn't know about
- [x] Class has multiple conditional statements for selecting behavior

### TypeScript Signature
```typescript
// Strategy interface
interface Strategy {
  execute(a: number, b: number): number;
}

// ... (29 lines trimmed)

calculator.setStrategy(new MultiplyStrategy());
console.log(calculator.calculate(5, 3)); // 15
```

### Stack-Native: React Hooks
```typescript
// Strategies as hooks
const useCreditPayment = () => ({ process: async (amount) => { /* ... */ } });
const usePaypalPayment = () => ({ process: async (amount) => { /* ... */ } });

const usePaymentStrategy = (type: PaymentType) => {
// ... (9 lines trimmed)
  const strategy = usePaymentStrategy(type);
  const handlePay = () => strategy.process(amount);
};
```

### Code Smells It Fixes
- **Switch on type**: `switch (type) { case 'A': ... case 'B': ... }`
  → Replace with strategy selection
- **Hardcoded algorithms**: Strategies are interchangeable

### Common Mistakes
- **Strategy explosion**: Too many small strategies
- **Client awareness**: Client shouldn't know strategy details

---

## Template Method

### Definition
Defines the skeleton of an algorithm in a method, deferring some steps to subclasses, letting subclasses redefine certain steps without changing structure.

### When to Use
- [x] Implement invariant parts of algorithm once, leave varying parts to subclasses
- [x] Common behavior among subclasses should be factored and localized
- [x] Control subclass extensions (hook operations)

### TypeScript Signature
```typescript
abstract class AbstractClass {
  // Template method
  templateMethod(): void {
    this.baseOperation1();
    this.requiredOperation1();
// ... (48 lines trimmed)
// Usage
const classA = new ConcreteClassA();
classA.templateMethod();
```

### Code Smells It Fixes
- **Duplicated algorithm structure**: Template defines common steps
- **Inconsistent step order**: Template enforces order

---

## Visitor

### Definition
Represents an operation to be performed on elements of an object structure, letting you define new operations without changing classes of elements.

### When to Use
- [x] Object structure contains many classes with differing interfaces
- [x] Many distinct operations need to be performed on objects
- [x] Object structure rarely changes but operations on it often do

### TypeScript Signature
```typescript
// Element interface
interface Element {
  accept(visitor: Visitor): void;
}

// ... (45 lines trimmed)
for (const element of elements) {
  element.accept(visitor);
}
```

### Code Smells It Fixes
- **Adding new operations requires modifying elements**: Visitor externalizes operations
- **Operations scattered across classes**: Visitor groups related operations

### Common Mistakes
- **Adding new element types**: Requires modifying all visitors (rigid)
- **Breaking encapsulation**: Visitor may need access to internals

---

## Interpreter

### Definition
Defines a representation for a grammar along with an interpreter that uses the representation to interpret sentences in the language.

### When to Use
- [x] Grammar is simple (for complex grammars, use parser generators)
- [x] Efficiency is not critical
- [x] Building a simple domain-specific language (DSL)

### TypeScript Signature
```typescript
// Context
class Context {
  constructor(public input: string) {}
}

// ... (39 lines trimmed)
);

console.log(expression.interpret(context)); // 16
```

### Code Smells It Fixes
- **Complex parsing logic**: Grammar rules are explicit classes
- **Hardcoded language interpretation**: Extensible grammar

---

## Summary Table

| Pattern | Complexity | Use Frequency | Main Benefit |
|---------|------------|---------------|--------------|
| Chain of Responsibility | Medium | Medium | Decouple sender from receiver |
| Command | Medium | Medium | Parameterize, queue, undo operations |
| Iterator | Low | High | Sequential access without exposure |
| Mediator | Medium | Medium | Reduce coupling between objects |
| Memento | Medium | Low | Save/restore state |
| Observer | Low | Very High | One-to-many notifications |
| State | Medium | Medium | State-dependent behavior |
| Strategy | Low | High | Interchangeable algorithms |
| Template Method | Medium | Medium | Algorithm skeleton with variants |
| Visitor | High | Low | Operations on object structure |
| Interpreter | High | Very Low | Simple DSL interpretation |

## Best Practices

1. **Observer**: Always unsubscribe to prevent memory leaks
2. **Strategy vs State**: Strategy changes behavior externally; State changes internally
3. **Use framework patterns**: React hooks, RxJS, Redux provide these patterns
4. **Command for undo**: Store history of command objects
5. **Chain of Responsibility**: Keep handlers simple, ensure request is handled

## References

- *Design Patterns: Elements of Reusable Object-Oriented Software* (Gang of Four)
- [Refactoring Guru: Behavioral Patterns](https://refactoring.guru/design-patterns/behavioral-patterns)
- [RxJS Documentation](https://rxjs.dev/)
