# Module Systems

Use this reference for the parts of ESM and CommonJS interop that still trip people up in real projects.

## ESM Basics

```javascript
export const PI = 3.14159
export function add(a, b) {
  return a + b
}

import { add } from "./math.js"
```

Key rules:

- ESM wants explicit file extensions in Node
- top-level `await` is available in ESM
- tree shaking works best with side-effect-free exports

## Dynamic Imports

```javascript
const module = await import("./module.js")
module.default()
```

Use dynamic import for:

- feature-gated code
- heavy optional code paths
- environment-specific loading

## Package Exports

```json
{
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

Keep export maps explicit so consumers do not rely on private files.

## CommonJS Compatibility

```javascript
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const cjsModule = require("./legacy.cjs")
```

In ESM, use `import.meta.url` instead of `__dirname`.

## Circular Dependency Advice

- avoid deep bidirectional module graphs
- move shared contracts into a third module
- initialize state after import time when cycles are unavoidable

## Tree Shaking Advice

- export pure functions directly
- avoid module-level side effects unless necessary
- mark side-effect files explicitly in `package.json`

```json
{
  "sideEffects": ["*.css", "polyfills.js"]
}
```
