#!/usr/bin/env node
/**
 * PostToolUse Hook: TypeScript check after editing .ts/.tsx files
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs after Edit tool use on TypeScript files. Walks up from the file's
 * directory to find the nearest tsconfig.json, then runs tsc --noEmit
 * and reports only errors related to the edited file.
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Return a copy of process.env with secret-bearing variables removed.
 *
 * Post-edit hooks run in the Claude Code agent environment, which may include
 * API keys and tokens. tsc does not need them, and this prevents leakage into
 * the spawned compiler process.
 */
function scrubEnv() {
  const SECRET_SUFFIXES = ["_API_KEY", "_SECRET_KEY", "_SECRET", "_TOKEN", "_PASSWORD", "_CREDENTIAL"];
  const SECRET_EXACT = new Set(["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY", "GITHUB_TOKEN", "GITLAB_TOKEN", "BEARER_TOKEN"]);
  const env = Object.assign({}, process.env);
  for (const key of Object.keys(env)) {
    const upper = key.toUpperCase();
    if (SECRET_EXACT.has(upper) || SECRET_SUFFIXES.some((suf) => upper.endsWith(suf))) {
      delete env[key];
    }
  }
  return env;
}

const MAX_STDIN = 1024 * 1024; // 1MB limit
let data = "";
process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  if (data.length < MAX_STDIN) {
    const remaining = MAX_STDIN - data.length;
    data += chunk.substring(0, remaining);
  }
});

process.stdin.on("end", () => {
  try {
    const input = JSON.parse(data);
    const filePath = input.tool_input?.file_path;

    if (filePath && /\.(ts|tsx)$/.test(filePath)) {
      const resolvedPath = path.resolve(filePath);
      if (!fs.existsSync(resolvedPath)) {
        process.stdout.write(data);
        process.exit(0);
      }
      // Find nearest tsconfig.json by walking up (max 20 levels to prevent infinite loop)
      let dir = path.dirname(resolvedPath);
      const root = path.parse(dir).root;
      let depth = 0;

      while (dir !== root && depth < 20) {
        if (fs.existsSync(path.join(dir, "tsconfig.json"))) {
          break;
        }
        dir = path.dirname(dir);
        depth++;
      }

      if (fs.existsSync(path.join(dir, "tsconfig.json"))) {
        try {
          // Use npx.cmd on Windows to avoid shell: true which enables command injection
          const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";
          execFileSync(npxBin, ["tsc", "--noEmit", "--pretty", "false"], {
            cwd: dir,
            env: scrubEnv(),
            encoding: "utf8",
            stdio: ["pipe", "pipe", "pipe"],
            timeout: 30000,
          });
        } catch (err) {
          // tsc exits non-zero when there are errors — filter to edited file
          const output = (err.stdout || "") + (err.stderr || "");
          // Compute paths that uniquely identify the edited file.
          // tsc output uses paths relative to its cwd (the tsconfig dir),
          // so check for the relative path, absolute path, and original path.
          // Avoid bare basename matching — it causes false positives when
          // multiple files share the same name (e.g., src/utils.ts vs tests/utils.ts).
          const relPath = path.relative(dir, resolvedPath);
          const candidates = new Set([filePath, resolvedPath, relPath]);
          const relevantLines = output
            .split("\n")
            .filter((line) => {
              for (const candidate of candidates) {
                if (line.includes(candidate)) return true;
              }
              return false;
            })
            .slice(0, 10);

          if (relevantLines.length > 0) {
            console.error(
              "[Hook] TypeScript errors in " + path.basename(filePath) + ":",
            );
            relevantLines.forEach((line) => console.error(line));
          }
        }
      }
    }
  } catch {
    // Invalid input — pass through
  }

  process.stdout.write(data);
  process.exit(0);
});
