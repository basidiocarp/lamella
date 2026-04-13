#!/usr/bin/env bash
#
# Hook health check — validates hook paths without failing the content suite.
#
# This is a separate, optional health check that does not block content validation.
# It runs only the lamella hook path validator and reports stale paths without
# treating them as CI failures. Use this to inspect hook state without hard failures.
#
# Exit codes:
# 0 = all hooks valid or no hooks configured
# 1 = some hooks are stale (information only; does not block CI)

node scripts/validate-hooks.js
