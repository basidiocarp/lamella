# Node.js Essentials

## File System

```javascript
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

await mkdir('./output', { recursive: true })
await writeFile('./output/result.json', JSON.stringify({ ok: true }, null, 2))

const text = await readFile('./output/result.json', 'utf8')
const files = await readdir('./output')
const metadata = await stat('./output/result.json')

if (existsSync('./output/old.json')) {
  await rm('./output/old.json')
}
```

## Path Module

```javascript
import { basename, dirname, extname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const fullPath = join(__dirname, 'fixtures', 'config.json')
const absolute = resolve('./src/index.js')
const base = basename(fullPath)
const ext = extname(fullPath)
```

## Streams

```javascript
import { createReadStream, createWriteStream } from 'fs'
import { Transform } from 'stream'
import { pipeline } from 'stream/promises'

const uppercase = new Transform({
  transform(chunk, _encoding, callback) {
    callback(null, chunk.toString().toUpperCase())
  },
})

await pipeline(
  createReadStream('./input.txt'),
  uppercase,
  createWriteStream('./output.txt')
)
```

## EventEmitter

```javascript
import { EventEmitter } from 'events'

class DataProcessor extends EventEmitter {
  async process(items) {
    this.emit('start', { itemCount: items.length })
    for (const item of items) {
      this.emit('item', item)
    }
    this.emit('done')
  }
}
```

## Child Processes

```javascript
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

const { stdout } = await execFileAsync('node', ['--version'], {
  cwd: process.cwd(),
  env: process.env,
})
```

## Worker Threads

```javascript
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url), { workerData: [1, 2, 3] })
  worker.on('message', (value) => console.log(value))
} else {
  const result = workerData.map((n) => n * 2)
  parentPort?.postMessage(result)
}
```

## Process and Environment

```javascript
const port = process.env.PORT ?? '3000'
const args = process.argv.slice(2)

console.log({ port, args, node: process.version, pid: process.pid })
```

## HTTP Server

```javascript
import { createServer } from 'http'

const server = createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify({ method: req.method, url: req.url }))
})

server.listen(3000)
```
