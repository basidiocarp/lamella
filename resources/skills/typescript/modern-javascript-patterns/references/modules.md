# Module Systems

## ES Modules (ESM)

```javascript
// Named exports
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
// ... (15 lines trimmed)
export { add, multiply } from './math.js';
export * from './utils.js';
export * as helpers from './helpers.js';
```

## Import Patterns

```javascript
// Named imports
import { add, multiply } from './math.js';
import { add as addition } from './math.js';

// Default import
// ... (11 lines trimmed)

// Type-only imports (for documentation)
/** @typedef {import('./types.js').User} User */
```

## Dynamic Imports

```javascript
// Basic dynamic import
const module = await import('./module.js');
module.default();

// Conditional loading
// ... (29 lines trimmed)
  moduleCache.set(path, module);
  return module;
};
```

## Package.json Configuration

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
// ... (15 lines trimmed)
    "#constants": "./src/constants.js"
  }
}
```

## Conditional Exports

```javascript
// package.json with conditional exports
{
  "exports": {
    ".": {
      "node": "./dist/node.js",
// ... (10 lines trimmed)
// Usage in code
import api from 'my-package'; // Resolves based on environment
import feature from 'my-package/feature'; // Conditional based on NODE_ENV
```

## Import Maps (Browser)

```html
<!-- In HTML -->
<script type="importmap">
{
  "imports": {
    "lodash": "/node_modules/lodash-es/lodash.js",
// ... (8 lines trimmed)
import React from 'react';
import { helper } from 'utils/helper.js';
</script>
```

## CommonJS Compatibility

```javascript
// ESM consuming CommonJS
import cjsModule from './commonjs-module.cjs';
import { named } from './commonjs-module.cjs'; // May not work

// Use createRequire for CommonJS in ESM
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cjsModule = require('./commonjs-module.cjs');

// Access CommonJS metadata in ESM
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

## Module Resolution

```javascript
// Explicit file extensions required in ESM
import utils from './utils.js'; // Correct
import utils from './utils';    // Error in ESM

// Directory imports require index.js
// ... (8 lines trimmed)
  // This module was run directly
  main();
}
```

## Circular Dependencies

```javascript
// moduleA.js
import { b } from './moduleB.js';
export const a = 'A';
export function useB() {
  return b;
// ... (27 lines trimmed)
const b = createB({});
a.dependencies = { b };
b.dependencies = { a };
```

## Tree Shaking Optimization

```javascript
// Write side-effect-free code for tree shaking
// utils.js - Good: pure functions
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;
// ... (11 lines trimmed)
  // OR specify files with side effects
  "sideEffects": ["*.css", "polyfills.js"]
}
```

## Module Patterns

```javascript
// Singleton pattern
// database.js
class Database {
  #connection = null;

// ... (33 lines trimmed)
    return user;
  }
};
```

## Node.js ESM Specifics

```javascript
// package.json
{
  "type": "module" // All .js files are ESM
}

// ... (12 lines trimmed)
// Top-level await in Node.js ESM
const config = await fetch('/api/config').then(r => r.json());
export default config;
```

## Quick Reference

| Feature | ESM | CommonJS |
|---------|-----|----------|
| Syntax | `import`/`export` | `require()`/`module.exports` |
| Loading | Asynchronous | Synchronous |
| Tree shaking | Yes | No |
| Top-level await | Yes | No |
| Dynamic imports | `await import()` | `require()` |
| File extension | Required | Optional |
| `__dirname` | Use `import.meta.url` | Built-in |
| Browser support | Native | Needs bundler |
| Default mode | `"type": "module"` | No type field |
