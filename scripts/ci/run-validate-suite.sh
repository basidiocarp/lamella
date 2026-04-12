#!/usr/bin/env bash
set -euo pipefail

node scripts/ci/validate-commands.js
node scripts/ci/validate-hooks.js
node scripts/ci/validate-rules.js
node scripts/ci/validate-skills.js
node scripts/ci/validate-skill-packages.js
node scripts/ci/test-skill-packages.js
node scripts/ci/validate-subagents.js
node scripts/ci/test-subagents.js
node scripts/ci/validate-manifests.js
node scripts/ci/validate-marketplace-catalog.js
node scripts/ci/validate-xrefs.js
node scripts/ci/validate-presets.js
bash scripts/ci/validate-foundation-alignment.sh
