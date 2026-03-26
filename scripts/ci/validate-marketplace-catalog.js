#!/usr/bin/env node
/**
 * Validate the tracked repo-root marketplace catalog.
 *
 * The source catalog at .claude-plugin/marketplace.json should stay in sync
 * with the current plugin manifests and the base release version in VERSION.
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '../..');
const VERSION_FILE = path.join(BASE_DIR, 'VERSION');
const CATALOG_FILE = path.join(BASE_DIR, '.claude-plugin', 'marketplace.json');
const MANIFESTS_DIR = path.join(BASE_DIR, 'manifests', 'claude');

const EXPECTED_NAME = 'lamella';
const EXPECTED_OWNER = 'William Newton';
const EXPECTED_DESCRIPTION = 'Skill-Issue — curated skills, agents, and commands for Claude Code';
const EXPECTED_SOURCE_URL = 'https://github.com/basidiocarp/lamella.git';
const EXPECTED_SOURCE_REF = 'gh-pages';
const semverRegex = /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

let errors = 0;

function fail(message) {
  console.error(`ERROR: ${message}`);
  errors++;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readVersion() {
  const version = fs.readFileSync(VERSION_FILE, 'utf8').trim();
  if (!semverRegex.test(version)) {
    fail(`VERSION is not valid semver: ${version}`);
  }
  return version;
}

function expectedPlugins(version) {
  return fs.readdirSync(MANIFESTS_DIR)
    .filter((file) => file.endsWith('.json') && file !== 'index.json' && file !== 'schema.json')
    .sort()
    .map((file) => {
      const manifest = readJson(path.join(MANIFESTS_DIR, file));
      return {
        name: manifest.name,
        description: manifest.description,
        version,
        source: {
          source: 'git-subdir',
          url: EXPECTED_SOURCE_URL,
          path: `plugins/${manifest.name}`,
          ref: EXPECTED_SOURCE_REF,
        },
      };
    });
}

const version = readVersion();
const catalog = readJson(CATALOG_FILE);
const plugins = expectedPlugins(version);

if (catalog.name !== EXPECTED_NAME) {
  fail(`marketplace name must be '${EXPECTED_NAME}', found '${catalog.name}'`);
}

if (catalog.owner?.name !== EXPECTED_OWNER) {
  fail(`marketplace owner must be '${EXPECTED_OWNER}', found '${catalog.owner?.name ?? ''}'`);
}

if (catalog.metadata?.description !== EXPECTED_DESCRIPTION) {
  fail('marketplace metadata.description is out of sync');
}

if (catalog.metadata?.version !== version) {
  fail(`marketplace metadata.version must be '${version}', found '${catalog.metadata?.version ?? ''}'`);
}

if (!Array.isArray(catalog.plugins)) {
  fail('marketplace plugins must be an array');
} else {
  if (catalog.plugins.length !== plugins.length) {
    fail(`marketplace plugin count mismatch: expected ${plugins.length}, found ${catalog.plugins.length}`);
  }

  const actualByName = new Map(catalog.plugins.map((plugin) => [plugin.name, plugin]));
  const actualNames = catalog.plugins.map((plugin) => plugin.name);
  const sortedNames = [...actualNames].sort();

  if (JSON.stringify(actualNames) !== JSON.stringify(sortedNames)) {
    fail('marketplace plugins must be sorted by name');
  }

  for (const expected of plugins) {
    const actual = actualByName.get(expected.name);
    if (!actual) {
      fail(`marketplace is missing plugin '${expected.name}'`);
      continue;
    }

    if (actual.description !== expected.description) {
      fail(`plugin '${expected.name}' description is out of sync`);
    }

    if (actual.version !== expected.version) {
      fail(`plugin '${expected.name}' version must be '${expected.version}', found '${actual.version ?? ''}'`);
    }

    if (actual.source?.source !== expected.source.source) {
      fail(`plugin '${expected.name}' source.source must be '${expected.source.source}'`);
    }

    if (actual.source?.url !== expected.source.url) {
      fail(`plugin '${expected.name}' source.url is out of sync`);
    }

    if (actual.source?.path !== expected.source.path) {
      fail(`plugin '${expected.name}' source.path must be '${expected.source.path}'`);
    }

    if (actual.source?.ref !== expected.source.ref) {
      fail(`plugin '${expected.name}' source.ref must be '${expected.source.ref}'`);
    }
  }
}

console.log(`Validated marketplace catalog (${plugins.length} plugins, version ${version})`);

if (errors > 0) {
  process.exit(1);
}
