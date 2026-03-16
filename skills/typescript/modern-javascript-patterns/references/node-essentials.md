# Node.js Essentials

## File System (fs/promises)

```javascript
import { readFile, writeFile, appendFile, mkdir, rm, readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';

// Read file
// ... (44 lines trimmed)
if (existsSync('./path')) {
  // Path exists
}
```

## Path Module

```javascript
import { join, resolve, dirname, basename, extname, parse, format } from 'path';
import { fileURLToPath } from 'url';

// Get current file and directory in ESM
const __filename = fileURLToPath(import.meta.url);
// ... (27 lines trimmed)
  dir: '/home/user',
  base: 'file.txt'
}); // '/home/user/file.txt'
```

## Streams

```javascript
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Transform } from 'stream';

// Read large file efficiently
// ... (47 lines trimmed)
    processChunk(chunk);
  }
};
```

## EventEmitter

```javascript
import { EventEmitter } from 'events';

class DataProcessor extends EventEmitter {
  async process(data) {
    this.emit('start', { itemCount: data.length });
// ... (42 lines trimmed)
const handler = () => console.log('Event fired');
processor.on('event', handler);
processor.off('event', handler);
```

## Child Processes

```javascript
import { spawn, exec, execFile } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ... (21 lines trimmed)
  cwd: './scripts',
  env: { ...process.env, CUSTOM_VAR: 'value' }
});
```

## Worker Threads

```javascript
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

if (isMainThread) {
  // Main thread
  const worker = new Worker(new URL(import.meta.url), {
// ... (65 lines trimmed)
    availableWorker.worker.postMessage(task.data);
  }
}
```

## Process & Environment

```javascript
// Environment variables
const port = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV === 'development';

// Command-line arguments
// ... (34 lines trimmed)
console.log('Node version:', process.version);
console.log('Memory usage:', process.memoryUsage());
console.log('Uptime:', process.uptime());
```

## HTTP/HTTPS Server

```javascript
import { createServer } from 'http';
import { readFile } from 'fs/promises';

const server = createServer(async (req, res) => {
  // Parse URL and method
// ... (40 lines trimmed)

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

## Cluster for Multi-Core

```javascript
import cluster from 'cluster';
import { cpus } from 'os';
import { createServer } from 'http';

const numCPUs = cpus().length;
// ... (20 lines trimmed)
  server.listen(3000);
  console.log(`Worker ${process.pid} started`);
}
```

## Quick Reference

| Module | Use Case | Import |
|--------|----------|--------|
| `fs/promises` | Async file operations | `import { readFile } from 'fs/promises'` |
| `path` | Path manipulation | `import { join } from 'path'` |
| `stream` | Stream processing | `import { pipeline } from 'stream/promises'` |
| `events` | Event emitters | `import { EventEmitter } from 'events'` |
| `child_process` | Spawn processes | `import { spawn } from 'child_process'` |
| `worker_threads` | Multi-threading | `import { Worker } from 'worker_threads'` |
| `http` | HTTP server | `import { createServer } from 'http'` |
| `cluster` | Multi-core scaling | `import cluster from 'cluster'` |
