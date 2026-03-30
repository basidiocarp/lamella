#!/usr/bin/env node
/**
 * PostToolUse hook: heuristic output validation for placeholder data and leaks.
 */

const { readStdinJson, output, logHookError } = require('../lib/utils');

const ELIGIBLE_TOOLS = new Set(['Edit', 'Write', 'Bash']);
const SUSPICIOUS_PATHS = [
  '/path/to/',
  '/your/project/',
  '/example/',
  '/foo/bar/',
  '/my/app/',
  '/user/project/',
  'C:\\Users\\User\\',
  'C:\\path\\to\\'
];
const PLACEHOLDER_PATTERNS = [
  'TODO:',
  'FIXME:',
  'XXX:',
  'HACK:',
  'your-api-key',
  'your_api_key',
  'YOUR_API_KEY',
  'sk-...',
  'pk_test_',
  'pk_live_',
  'api_key_here',
  'replace_with',
  'insert_your',
  'placeholder',
  'example.com',
  'foo@bar.com',
  'test@test.com'
];
const SECRET_PATTERNS = [
  /AKIA[0-9A-Z]{16}/,
  /[a-f0-9]{32,}/i,
  /-----BEGIN.*PRIVATE KEY-----/,
  /-----BEGIN RSA/,
  /-----BEGIN EC/,
  /eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\./,
  /password["']?\s*[=:]\s*["'][^"']{8,}/i
];
const UNCERTAINTY_PATTERNS = [
  "i'm not sure",
  'i think it might',
  'probably',
  'possibly',
  'might be',
  'could be',
  'i believe',
  'i assume',
  'i guess',
  'if i recall',
  'from memory',
  "i don't have access",
  'i cannot verify'
];
const INCOMPLETE_PATTERNS = [
  /not implemented/i,
  /NotImplementedError/,
  /throw new Error.*implement/i,
  /\/\/ TODO/,
  /# TODO/,
  /pass  # /,
  /raise NotImplemented/i,
  /\bundefined\b/
];
const REFERENCE_PATTERNS = [
  'According to the documentation',
  'As stated in',
  'The official guide says',
  'Based on the API reference'
];

function stringifyOutput(toolOutput) {
  if (toolOutput == null) return '';
  if (typeof toolOutput === 'string') return toolOutput;
  return JSON.stringify(toolOutput);
}

async function main() {
  const input = await readStdinJson();
  const toolName = input.tool_name || '';

  if (!ELIGIBLE_TOOLS.has(toolName)) {
    return;
  }

  const toolOutput = stringifyOutput(input.tool_output);
  const warnings = [];

  for (const pattern of SUSPICIOUS_PATHS) {
    if (toolOutput.includes(pattern)) {
      warnings.push(`Suspicious placeholder path detected: '${pattern}'`);
    }
  }

  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (toolOutput.includes(pattern)) {
      warnings.push(`Placeholder content detected: '${pattern}'`);
    }
  }

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(toolOutput)) {
      warnings.push(`Potential sensitive data in output (pattern: ${pattern.source.slice(0, 20)}...)`);
    }
  }

  const lower = toolOutput.toLowerCase();
  const uncertaintyCount = UNCERTAINTY_PATTERNS.filter(pattern => lower.includes(pattern)).length;
  if (uncertaintyCount >= 3) {
    warnings.push(`High uncertainty detected (${uncertaintyCount} indicators) - verify output accuracy`);
  }

  for (const pattern of INCOMPLETE_PATTERNS) {
    if (pattern.test(toolOutput)) {
      warnings.push(`Incomplete implementation detected: '${pattern.source}'`);
    }
  }

  for (const pattern of REFERENCE_PATTERNS) {
    if (toolOutput.includes(pattern)) {
      warnings.push(`Unverified reference claim: '${pattern}' - verify source`);
    }
  }

  if (warnings.length === 0) {
    return;
  }

  output({
    systemMessage: [
      'Output validation warnings:',
      ...warnings.map(warning => `  - ${warning}`),
      '',
      'Review output carefully before accepting.'
    ].join('\n')
  });
}

main().catch(error => {
  logHookError('output-validator', error);
  process.exit(0);
});
