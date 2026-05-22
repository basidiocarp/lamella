/**
 * content-root.js - Resolve the content root directory for lamella resources.
 *
 * Provides CONTENT_ROOT, defaulting to a sibling lamella-skills/ repo.
 * Override via the LAMELLA_CONTENT_ROOT environment variable.
 *
 * Usage:
 *   const { CONTENT_ROOT } = require('../lib/content-root');
 *   const SKILLS_DIR = path.join(CONTENT_ROOT, 'skills');
 */

const path = require('path');
const fs = require('fs');

const BASE_DIR = path.join(__dirname, '../..');

let CONTENT_ROOT;
if (process.env.LAMELLA_CONTENT_ROOT) {
  const envRoot = process.env.LAMELLA_CONTENT_ROOT;
  CONTENT_ROOT = path.isAbsolute(envRoot)
    ? envRoot
    : path.join(BASE_DIR, envRoot);
} else {
  const siblingRoot = path.join(BASE_DIR, '..', 'lamella-skills');
  CONTENT_ROOT = fs.existsSync(path.join(siblingRoot, 'skills'))
    ? siblingRoot
    : path.join(BASE_DIR, 'resources');
}

module.exports = { CONTENT_ROOT, BASE_DIR };
