/**
 * content-root.js - Resolve the content root directory for lamella resources.
 *
 * Provides CONTENT_ROOT, defaulting to "resources/" within the lamella repo.
 * Override via the LAMELLA_CONTENT_ROOT environment variable to read content
 * from an external directory (e.g., a sibling lamella-skills/ repo).
 *
 * Usage:
 *   const { CONTENT_ROOT } = require('../lib/content-root');
 *   const SKILLS_DIR = path.join(CONTENT_ROOT, 'skills');
 */

const path = require('path');

const BASE_DIR = path.join(__dirname, '../..');

let CONTENT_ROOT;
if (process.env.LAMELLA_CONTENT_ROOT) {
  const envRoot = process.env.LAMELLA_CONTENT_ROOT;
  CONTENT_ROOT = path.isAbsolute(envRoot)
    ? envRoot
    : path.join(BASE_DIR, envRoot);
} else {
  CONTENT_ROOT = path.join(BASE_DIR, 'resources');
}

module.exports = { CONTENT_ROOT, BASE_DIR };
