# Node.js CLI Development

## Commander.js (Recommended)

Modern, elegant CLI framework with TypeScript support.

```javascript
#!/usr/bin/env node
import { Command } from 'commander';
import { version } from './package.json';

const program = new Command();
// ... (40 lines trimmed)
  .action((key, value) => setConfig(key, value));

program.parse();
```

## Yargs (Alternative)

Powerful argument parsing with middleware support.

```javascript
#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
// ... (25 lines trimmed)
  .demandCommand()
  .help()
  .parse();
```

## Interactive Prompts (Inquirer)

Beautiful interactive prompts for user input.

```javascript
import inquirer from 'inquirer';

// Text input
const { name } = await inquirer.prompt([
  {
// ... (50 lines trimmed)
    mask: '*',
  },
]);
```

## Terminal Output (Chalk)

Colorful terminal output with proper TTY detection.

```javascript
import chalk from 'chalk';

// Basic colors
console.log(chalk.blue('Info: ') + 'Starting deployment...');
console.log(chalk.green('Success: ') + 'Deployment complete');
// ... (19 lines trimmed)
};

// Auto-detects TTY and CI environments
```

## Progress Indicators (Ora)

Elegant terminal spinners and progress indicators.

```javascript
import ora from 'ora';

// Simple spinner
const spinner = ora('Loading...').start();
await doWork();
// ... (30 lines trimmed)
  deployWeb().then(() => spinners.web.succeed()),
  runMigrations().then(() => spinners.db.succeed()),
]);
```

## Progress Bars (cli-progress)

```javascript
import cliProgress from 'cli-progress';

// Single progress bar
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar.start(100, 0);
// ... (20 lines trimmed)
]);

multibar.stop();
```

## File System Helpers

```javascript
import fs from 'fs-extra';
import { globby } from 'globby';
import path from 'path';

// Copy with template
// ... (10 lines trimmed)

// Find files
const files = await globby(['src/**/*.ts', '!src/**/*.test.ts']);
```

## Error Handling

```javascript
import { Command } from 'commander';

program
  .command('deploy')
  .action(async () => {
// ... (22 lines trimmed)
  console.log('\nOperation cancelled');
  process.exit(130);
});
```

## Package.json Setup

```json
{
  "name": "mycli",
  "version": "1.0.0",
  "type": "module",
  "bin": {
// ... (14 lines trimmed)
    "ora": "^7.0.0"
  }
}
```

## Testing CLIs

```javascript
import { execaCommand } from 'execa';
import { describe, it, expect } from 'vitest';

describe('mycli', () => {
  it('shows version', async () => {
// ... (12 lines trimmed)
    ).rejects.toThrow();
  });
});
```
