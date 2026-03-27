# Plugin Architecture and Packaging

## Core Shape

Plugins are curried config transformers:

```ts
import type { Config, Plugin } from "payload"

interface MyPluginConfig {
  enabled?: boolean
}

export const myPlugin =
  (options: MyPluginConfig = {}): Plugin =>
  (config: Config): Config => {
    if (options.enabled === false) return config
    return { ...config }
  }
```

## Package Layout

Keep the package predictable:

```text
plugin-<name>/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts
    ├── plugin.ts
    ├── types.ts
    └── exports/
        ├── types.ts
        └── rsc.ts
```

If the plugin has a full local test harness, add a `dev/` app rather than bloating `src/`.

## Package.json Expectations

- `type: "module"`
- Payload as a peer dependency
- compiled output in `dist`
- explicit export maps for main, types, and any client or RSC entry points

Keep the package contract obvious so consumers do not need to guess import paths.
