# Node.js CLI Development

## Commander.js

```javascript
#!/usr/bin/env node
import { Command } from 'commander'

const program = new Command()

program
  .name('mycli')
  .description('Project automation CLI')
  .version('1.0.0')

program
  .command('config:set')
  .argument('<key>')
  .argument('<value>')
  .action((key, value) => {
    console.log(`Set ${key}=${value}`)
  })

program.parse()
```

## Yargs

```javascript
#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

yargs(hideBin(process.argv))
  .command(
    'deploy <env>',
    'Deploy the application',
    (command) => command.positional('env', { type: 'string', demandOption: true }),
    async (argv) => {
      console.log(`Deploying to ${argv.env}`)
    }
  )
  .demandCommand()
  .help()
  .parse()
```

## Interactive Prompts

```javascript
import inquirer from 'inquirer'

const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'projectName',
    message: 'Project name:',
  },
  {
    type: 'confirm',
    name: 'useTypeScript',
    message: 'Use TypeScript?',
    default: true,
  },
])
```

## Terminal Output

```javascript
import chalk from 'chalk'

console.log(chalk.blue('Info:') + ' Starting deployment...')
console.log(chalk.green('Success:') + ' Deployment complete')
console.error(chalk.red('Error:') + ' Missing credentials')
```

## Progress Indicators

```javascript
import ora from 'ora'

const spinner = ora('Running migrations...').start()

try {
  await runMigrations()
  spinner.succeed('Migrations complete')
} catch (error) {
  spinner.fail('Migration failed')
  throw error
}
```

## Package Setup

```json
{
  "name": "mycli",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "mycli": "./bin/cli.js"
  },
  "dependencies": {
    "chalk": "^5.4.1",
    "commander": "^12.1.0",
    "inquirer": "^12.0.0",
    "ora": "^8.1.0"
  }
}
```

## Testing

```javascript
import { execaCommand } from 'execa'
import { describe, expect, it } from 'vitest'

describe('mycli', () => {
  it('shows version', async () => {
    const { stdout } = await execaCommand('node ./bin/cli.js --version')
    expect(stdout).toContain('1.0.0')
  })
})
```
