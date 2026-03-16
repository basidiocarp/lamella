# Zustand Store Acceptance Criteria (TypeScript)

**Library**: Zustand
**Purpose**: Skill testing acceptance criteria for validating generated code correctness

---

## 1. Correct Import Patterns

### 1.1 Core Imports

#### ✅ CORRECT: Zustand Imports
```typescript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
```

#### ✅ CORRECT: Persist Middleware
```typescript
import { persist, createJSONStorage } from 'zustand/middleware';
```

### 1.2 Anti-Patterns (ERRORS)

#### ❌ INCORRECT: Old import style
```typescript
// WRONG - old import syntax
import create from 'zustand';

// CORRECT - named import
import { create } from 'zustand';
```

---

## 2. Store Creation Patterns

### 2.1 ✅ CORRECT: Basic Store with subscribeWithSelector
```typescript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface MyStore {
// ... (8 lines trimmed)
  }))
);
```

### 2.2 ✅ CORRECT: With get() Access
```typescript
export const useMyStore = create<MyStore>()(
  subscribeWithSelector((set, get) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    double: () => {
      const current = get().count;
      set({ count: current * 2 });
    },
  }))
);
```

### 2.3 Anti-Patterns (ERRORS)

#### ❌ INCORRECT: Missing subscribeWithSelector
```typescript
// WRONG - should use subscribeWithSelector for fine-grained subscriptions
export const useMyStore = create<MyStore>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

#### ❌ INCORRECT: Wrong generic syntax
```typescript
// WRONG - missing double parentheses with middleware
export const useMyStore = create<MyStore>(
  subscribeWithSelector((set) => ({}))
);
```

---

## 3. State and Actions Separation

### 3.1 ✅ CORRECT: Separate Interfaces
```typescript
// State interface
export interface ProjectState {
  projects: Project[];
  selectedId: string | null;
  isLoading: boolean;
// ... (8 lines trimmed)

// Combined store type
export type ProjectStore = ProjectState & ProjectActions;
```

### 3.2 ✅ CORRECT: Store with Separated Types
```typescript
export const useProjectStore = create<ProjectStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    projects: [],
    selectedId: null,
// ... (19 lines trimmed)
    },
  }))
);
```

---

## 4. Selector Patterns

### 4.1 ✅ CORRECT: Individual Selectors
```typescript
// Good - only re-renders when `count` changes
const count = useMyStore((state) => state.count);

// Good - selecting an action
const increment = useMyStore((state) => state.increment);
```

### 4.2 ✅ CORRECT: Multiple Selectors in Component
```typescript
function MyComponent() {
  const count = useMyStore((state) => state.count);
  const increment = useMyStore((state) => state.increment);
  
  return <button onClick={increment}>{count}</button>;
}
```

### 4.3 Anti-Patterns (ERRORS)

#### ❌ INCORRECT: Destructuring entire store
```typescript
// WRONG - re-renders on any state change
const { count, isLoading } = useMyStore();
```

#### ❌ INCORRECT: Creating new objects in selectors
```typescript
// WRONG - creates new object reference every render
const data = useMyStore((state) => ({
  count: state.count,
  isLoading: state.isLoading,
}));
```

### 4.4 ✅ CORRECT: Shallow comparison for multiple values
```typescript
import { useShallow } from 'zustand/react/shallow';

const { count, isLoading } = useMyStore(
  useShallow((state) => ({
    count: state.count,
    isLoading: state.isLoading,
  }))
);
```

---

## 5. Subscribe Outside React

### 5.1 ✅ CORRECT: Subscribe with Selector
```typescript
// Subscribe to specific state changes outside React
const unsubscribe = useMyStore.subscribe(
  (state) => state.selectedId,
  (selectedId, previousSelectedId) => {
    console.log('Selected ID changed from', previousSelectedId, 'to', selectedId);
  }
);

// Cleanup
unsubscribe();
```

### 5.2 ✅ CORRECT: Subscribe with Options
```typescript
useMyStore.subscribe(
  (state) => state.count,
  (count) => console.log('Count:', count),
  {
    fireImmediately: true,  // Fire callback immediately with current value
    equalityFn: Object.is,   // Custom equality function
  }
);
```

---

## 6. Persist Middleware

### 6.1 ✅ CORRECT: Persist to localStorage
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';

export const useSettingsStore = create<SettingsStore>()(
// ... (10 lines trimmed)
    )
  )
);
```

### 6.2 ✅ CORRECT: Partial Persistence
```typescript
persist(
  (set) => ({
    theme: 'dark',
    tempData: null,  // Won't be persisted
// ... (5 lines trimmed)
  }
)
```

---

## 7. Immer Middleware

### 7.1 ✅ CORRECT: Using Immer for Immutable Updates
```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';

export const useTodoStore = create<TodoStore>()(
// ... (12 lines trimmed)
    }))
  )
);
```

---

## 8. Async Actions

### 8.1 ✅ CORRECT: Async Action Pattern
```typescript
export const useDataStore = create<DataStore>()(
  subscribeWithSelector((set, get) => ({
    data: null,
    isLoading: false,
    error: null,
// ... (9 lines trimmed)
    },
  }))
);
```

---

## 9. Store Slices Pattern

### 9.1 ✅ CORRECT: Combine Multiple Slices
```typescript
interface UISlice {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// ... (20 lines trimmed)
    ...createDataSlice(set),
  }))
);
```

---

## 10. Testing Patterns

### 10.1 ✅ CORRECT: Reset Store for Tests
```typescript
// In your store file
const initialState = {
  count: 0,
  items: [],
};
// ... (10 lines trimmed)
beforeEach(() => {
  useMyStore.getState().reset();
});
```

---

## 11. Anti-Patterns Summary

### 11.1 ❌ Common Mistakes
```typescript
// WRONG - default import
import create from 'zustand';

// WRONG - missing subscribeWithSelector
create<Store>()((set) => ({}));
// ... (9 lines trimmed)
  state.items.push(item);  // Won't work without immer
  return state;
});
```
