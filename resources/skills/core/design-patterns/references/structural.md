---
title: "Structural Design Patterns"
description: "Reference for Adapter, Decorator, Facade, Proxy and other composition patterns"
tags: [reference, design-patterns, architecture]
---

# Structural Design Patterns

Patterns that deal with object composition and relationships between entities, providing ways to assemble objects and classes into larger structures.

## Adapter

### Definition
Converts the interface of a class into another interface clients expect, allowing incompatible interfaces to work together.

### When to Use
- [x] Want to use an existing class with an incompatible interface
- [x] Need to integrate third-party libraries with different interfaces
- [x] Want to create a reusable class that cooperates with unrelated classes
- [x] Legacy code must work with new systems

### TypeScript Signature
```typescript
// Target interface (what client expects)
interface Target {
  request(): string;
}

// ... (27 lines trimmed)
const adaptee = new Adaptee();
const adapter = new Adapter(adaptee);
clientCode(adapter);
```

### Real-World Example: Third-Party Library Integration
```typescript
// Third-party library (can't modify)
class XMLDataProvider {
  getXMLData(): string {
    return '<data><item>1</item></data>';
  }
// ... (19 lines trimmed)
const xmlProvider = new XMLDataProvider();
const adapter = new XMLToJSONAdapter(xmlProvider);
const data = adapter.getJSONData();
```

### Detection Markers
- Class implements target interface
- Holds reference to adaptee
- Delegates to adaptee with interface conversion
- Names like `*Adapter`, `*Wrapper`

### Code Smells It Fixes
- **Incompatible interfaces**: Makes legacy or third-party code compatible
- **Interface proliferation**: Single adapter vs modifying multiple client calls

### Common Mistakes
- **Two-way adapters**: Bidirectional conversion is complex; create two adapters
- **Adapter chains**: Multiple adapters in sequence indicate design issues
- **Overusing for new code**: Design compatible interfaces from the start

---

## Bridge

### Definition
Decouples an abstraction from its implementation so the two can vary independently.

### When to Use
- [x] Want to avoid permanent binding between abstraction and implementation
- [x] Both abstractions and implementations should be extensible by subclassing
- [x] Changes in implementation shouldn't affect clients
- [x] Want to share implementation among multiple objects (Flyweight-like)

### TypeScript Signature
```typescript
// Implementation interface
interface Implementation {
  operationImpl(): string;
}

// ... (34 lines trimmed)
const implB = new ConcreteImplementationB();
const abstraction2 = new ExtendedAbstraction(implB);
console.log(abstraction2.operation());
```

### Real-World Example: UI Components with Multiple Renderers
```typescript
// Implementation: Renderers
interface Renderer {
  renderCircle(radius: number): string;
  renderSquare(side: number): string;
}
// ... (43 lines trimmed)
// Usage: Can mix any shape with any renderer
const vectorCircle = new Circle(new VectorRenderer(), 5);
const rasterSquare = new Square(new RasterRenderer(), 10);
```

### Detection Markers
- Abstraction holds reference to implementation interface
- Constructor injects implementation
- Two parallel hierarchies (abstraction and implementation)

### Common Mistakes
- **Confusion with Adapter**: Bridge is design-time; Adapter is runtime fix
- **Over-engineering simple scenarios**: Use only when both hierarchies need to vary

---

## Composite

### Definition
Composes objects into tree structures to represent part-whole hierarchies, letting clients treat individual objects and compositions uniformly.

### When to Use
- [x] Want to represent part-whole hierarchies of objects
- [x] Want clients to ignore difference between compositions and individual objects
- [x] Tree structures are natural for the domain (file systems, UI components, org charts)

### TypeScript Signature
```typescript
// Component interface
interface Component {
  operation(): string;
  add?(component: Component): void;
  remove?(component: Component): void;
// ... (51 lines trimmed)

console.log(tree.operation());
// Output: root(branch1(leaf1, leaf2), branch2(leaf3), leaf4)
```

### Real-World Example: File System
```typescript
interface FileSystemComponent {
  getName(): string;
  getSize(): number;
  print(indent: string): void;
}
// ... (49 lines trimmed)
root.add(home);
root.add(work);
root.print('');
```

### Detection Markers
- Tree structure with uniform interface
- Collection of children components
- `add()`, `remove()`, `getChild()` methods
- Recursive operation calls

### Code Smells It Fixes
- **Type checking for composition vs leaf**: Uniform interface eliminates `instanceof` checks
- **Different handling for parts vs wholes**: Clients treat both uniformly

### Common Mistakes
- **Violating uniformity**: Leaf and Composite should have same interface
- **Incorrect child management**: Not handling removal properly
- **Deep recursion**: Can cause stack overflow on very deep trees

---

## Decorator

### Definition
Attaches additional responsibilities to an object dynamically, providing a flexible alternative to subclassing for extending functionality.

### When to Use
- [x] Need to add responsibilities to objects dynamically and transparently
- [x] Responsibilities can be withdrawn
- [x] Extension by subclassing is impractical (many possible combinations)
- [x] Want to add features incrementally

### TypeScript Signature
```typescript
// Component interface
interface Component {
  operation(): string;
}

// ... (32 lines trimmed)
const decorated2 = new DecoratorB(decorated1);
console.log(decorated2.operation());
// Output: DecoratorB(DecoratorA(ConcreteComponent))
```

### Stack-Native Alternatives

**React - Higher-Order Components**:
```typescript
// HOC decorator
function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
// ... (8 lines trimmed)
const AuthenticatedProfile = withAuth(Profile);
const AuthenticatedAdminProfile = withLogging(withAuth(Profile));
```

**NestJS - Interceptors**:
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
// ... (8 lines trimmed)
@Controller('users')
export class UsersController {}
```

### Detection Markers
- Implements same interface as wrapped object
- Holds reference to wrapped object
- Delegates to wrapped, adding behavior
- Can be stacked

### Code Smells It Fixes
- **Class explosion**: Avoid creating subclass for every feature combination
- **Rigid feature addition**: Add/remove features dynamically

### Common Mistakes
- **Order dependency**: DecoratorA(DecoratorB(x)) ≠ DecoratorB(DecoratorA(x))
- **Decorator explosion**: Too many small decorators can be hard to manage
- **Breaking interface**: Decorator must maintain interface contract

---

## Facade

### Definition
Provides a unified interface to a set of interfaces in a subsystem, making the subsystem easier to use.

### When to Use
- [x] Want to provide a simple interface to a complex subsystem
- [x] Many dependencies exist between clients and implementation classes
- [x] Want to layer subsystems
- [x] Need to decouple subsystem from clients

### TypeScript Signature
```typescript
// Complex subsystem classes
class SubsystemA {
  operationA(): string {
    return 'SubsystemA';
  }
// ... (38 lines trimmed)
// Instead of:
// const a = new SubsystemA(); const b = new SubsystemB(); const c = new SubsystemC();
// a.operationA(); b.operationB(); c.operationC();
```

### Real-World Example: Payment Processing
```typescript
// Complex subsystems
class PaymentValidator {
  validate(amount: number, card: string): boolean {
    // Complex validation logic
    return amount > 0 && card.length === 16;
// ... (41 lines trimmed)
// Client code (simple!)
const payment = new PaymentFacade();
payment.processPayment(100, '1234567890123456', 'user@example.com');
```

### Detection Markers
- Class with multiple subsystem dependencies
- Simple public methods coordinating subsystems
- Named `*Facade`, `*API`, `*Service`

### Code Smells It Fixes
- **Complex subsystem usage**: Clients don't need to know subsystem details
- **Tight coupling**: Clients depend on facade, not many classes

### Common Mistakes
- **God Facade**: Facade does too much; should coordinate, not contain logic
- **Leaky abstraction**: Exposing subsystem details defeats the purpose

---

## Flyweight

### Definition
Uses sharing to support large numbers of fine-grained objects efficiently by storing shared state externally.

### When to Use
- [x] Application uses large number of objects
- [x] Storage cost is high due to object quantity
- [x] Most object state can be made extrinsic (externalized)
- [x] Many groups of objects may be replaced by relatively few shared objects

### TypeScript Signature
```typescript
// Flyweight
class Flyweight {
  constructor(private sharedState: string) {}

  operation(uniqueState: string): void {
// ... (47 lines trimmed)

const flyweight2 = factory.getFlyweight(['Chevrolet', 'Camaro2018', 'pink']);
flyweight2.operation('license-456'); // Reuses same flyweight
```

### Real-World Example: Text Editor Characters
```typescript
// Flyweight: Character formatting (shared)
class CharacterFormat {
  constructor(
    public font: string,
    public size: number,
// ... (37 lines trimmed)
  const format = i % 2 === 0 ? arial12Black : arial12Red;
  characters.push(new Character('A', format));
}
```

### Detection Markers
- Factory managing pool of shared objects
- Intrinsic (shared) vs extrinsic (unique) state separation
- Map/cache of flyweights

### Common Mistakes
- **Premature optimization**: Only use if memory is actually a problem
- **Incorrect state separation**: Mixing intrinsic and extrinsic state

---

## Proxy

### Definition
Provides a surrogate or placeholder for another object to control access to it.

### When to Use
- [x] Lazy initialization (virtual proxy): Create expensive object only when needed
- [x] Access control (protection proxy): Control access to original object
- [x] Local representative of remote object (remote proxy)
- [x] Logging, caching, or monitoring access

### TypeScript Signature
```typescript
// Subject interface
interface Subject {
  request(): void;
}

// ... (41 lines trimmed)
// Proxy: Checking access
// Proxy: Logging access time
// RealSubject: Handling request
```

### Modern JavaScript Proxy
```typescript
const target = {
  message: 'Hello',
  getValue() {
    return this.message;
  }
// ... (14 lines trimmed)
const proxy = new Proxy(target, handler);
console.log(proxy.message); // Logs: Accessing property: message
proxy.message = 'World';     // Logs: Setting property: message = World
```

### Detection Markers
- Implements same interface as real subject
- Holds reference to real subject
- Controls access (checks, logging, caching)
- Lazy initialization of real subject

### Common Mistakes
- **Proxy chains**: Multiple proxies wrapping each other
- **Performance overhead**: Every access goes through proxy
- **Confusion with Decorator**: Proxy controls access; Decorator adds behavior

---

## Summary Table

| Pattern | Complexity | Use Frequency | Main Benefit |
|---------|------------|---------------|--------------|
| Adapter | Low | High | Interface compatibility |
| Bridge | High | Low | Decouple abstraction from implementation |
| Composite | Medium | High | Uniform tree structure handling |
| Decorator | Medium | High | Dynamic responsibility addition |
| Facade | Low | Very High | Simplified subsystem interface |
| Flyweight | High | Low | Memory optimization |
| Proxy | Medium | Medium | Controlled access |

## Best Practices

1. **Adapter vs Bridge**: Adapter fixes incompatibility; Bridge designs flexibility
2. **Decorator vs Proxy**: Decorator adds features; Proxy controls access
3. **Facade simplicity**: Should coordinate, not contain business logic
4. **Composite uniformity**: Leaf and Composite must share interface
5. **Use native Proxy**: JavaScript `Proxy` object for dynamic property access

## References

- *Design Patterns: Elements of Reusable Object-Oriented Software* (Gang of Four)
- [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [Refactoring Guru: Structural Patterns](https://refactoring.guru/design-patterns/structural-patterns)
