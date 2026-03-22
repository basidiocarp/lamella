# Design Patterns Output Formats

## Detection Mode (JSON)

```json
{
  "metadata": {
    "scan_date": "2026-01-21T10:30:00Z",
    "scope": "src/",
    "files_scanned": 147,
// ... (57 lines trimmed)
    "Review Factory pattern (notification-factory.ts) - could be simplified with strategy pattern"
  ]
}
```

---

## Suggestion Mode (Markdown)

```markdown
# Design Pattern Suggestions

**Scope**: `src/payment/`
**Stack**: React 18 + TypeScript + Stripe
**Date**: 2026-01-21

---

## High Priority

### 1. Strategy Pattern → `src/payment/processor.ts:45-89`

**Code Smell**: Switch statement on payment type (4 cases, 78 lines)

**Current Implementation** (lines 52-87):
```typescript
switch (paymentType) {
  case 'credit':
    // 20 lines of credit card logic
    break;
  case 'paypal':
    // 15 lines of PayPal logic
    break;
  case 'crypto':
    // 18 lines of crypto logic
    break;
  case 'bank':
    // 12 lines of bank transfer logic
    break;
}
```

**Recommended (React-adapted Strategy)**:
```typescript
// Define strategy interface
interface PaymentStrategy {
  process: (amount: number) => Promise<PaymentResult>;
}

// Custom hooks as strategies
const useCreditPayment = (): PaymentStrategy => ({
  process: async (amount) => { /* credit logic */ }
});

const usePaypalPayment = (): PaymentStrategy => ({
  process: async (amount) => { /* PayPal logic */ }
});

// Strategy selection hook
const usePaymentStrategy = (type: PaymentType): PaymentStrategy => {
  const strategies = {
    credit: useCreditPayment(),
    paypal: usePaypalPayment(),
    crypto: useCryptoPayment(),
    bank: useBankPayment(),
  };
  return strategies[type];
};

// Usage in component
const PaymentForm = ({ type }: Props) => {
  const strategy = usePaymentStrategy(type);
  const handlePay = () => strategy.process(amount);
  // ...
};
```

**Impact**:
- **Complexity**: Reduces cyclomatic complexity from 12 to 2
- **Extensibility**: New payment methods = new hook, no modification to existing code
- **Testability**: Each strategy hook can be tested in isolation
// ... (10 lines trimmed)
**Current**: Manual loops calling update functions
**Recommended**: Use Zustand store (already in dependencies)

```typescript
// Instead of custom observer:
import create from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  // Zustand automatically notifies subscribers
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
}));

// Components auto-subscribe:
const CartDisplay = () => {
  const items = useCartStore((state) => state.items);
  // Re-renders automatically on cart changes
};
```

**Impact**:
- **LOC**: Reduces from 156 to ~25 lines
- **Stack-native**: Uses existing Zustand dependency
- **Testability**: Zustand stores are easily tested
// ... (8 lines trimmed)
- **Medium priority**: 2 (Builder, Facade)
- **Estimated total effort**: ~6 hours
- **Primary benefits**: Reduced complexity, improved testability, stack-native idioms
```

---

## Evaluation Mode (JSON)

```json
{
  "file": "src/services/config-singleton.ts",
  "pattern": "singleton",
  "lines": "5-34",
  "scores": {
// ... (52 lines trimmed)
    }
  ]
}
```
