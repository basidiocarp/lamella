.PHONY: validate lint-skills sync-check build build-adapters build-adapters-dry build-marketplace build-codex build-claude-subagents build-codex-agents sync-codex-manifests install install-all uninstall install-codex audit clean help

SHELL := /bin/bash
PLUGIN_DIR := manifests/claude
BUILD_SCRIPT := builders/build-claude-plugin.sh
BUILD_MARKETPLACE := builders/build-claude-marketplace.sh
BUILD_CODEX := builders/build-codex-skills.sh
SYNC_CODEX_MANIFESTS := builders/sync-codex-manifests.sh
INSTALL_CODEX := builders/install-codex-skills.sh
INSTALL_SCRIPT := scripts/plugins/install-plugin.sh
LAMELLA := ./lamella

# Default target
help: ## Show this help
	@echo "Lamella — Available targets:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""

validate: lint-skills sync-check ## Run all CI validators
	@echo "Running validators..."
	@bash scripts/ci/run-validate-suite.sh
	@echo "Running plugin validators..."
	@PLUGIN_FAIL=0; \
	for v in scripts/validate-*.sh; do \
	    [ -f "$$v" ] || continue; \
	    bash "$$v" || PLUGIN_FAIL=$$((PLUGIN_FAIL + 1)); \
	done; \
	[ "$$PLUGIN_FAIL" -eq 0 ] || (echo "$$PLUGIN_FAIL plugin validator(s) failed" && exit 1)
	@echo "All validators passed."

sync-check: ## Verify skill sync scripts and adapter paths are intact
	@bash scripts/sync-skills.sh --check

lint-skills: ## Lint all skill files for required sections
	@bash scripts/lint-skills.sh

build: ## Build all Claude plugins to dist/claude/plugins/
	@for manifest in $(PLUGIN_DIR)/*.json; do \
		name=$$(basename "$$manifest" .json); \
		{ [ "$$name" = "schema" ] || [ "$$name" = "index" ]; } && continue; \
		bash $(BUILD_SCRIPT) "$$manifest" > /dev/null 2>&1 || echo "FAILED: $$name"; \
	done
	@echo "Build complete. Output in dist/claude/plugins/"

build-adapters: ## Run cross-agent install adapters for all platforms
	@echo "Running cross-agent install adapters..."
	@bash -c 'source scripts/adapters/registry.sh && run_all_adapters resources/skills false'
	@echo "Adapters complete."

build-adapters-dry: ## Dry run: show what adapters would do
	@bash -c 'source scripts/adapters/registry.sh && run_all_adapters resources/skills true'

build-marketplace: build-adapters ## Build all plugins + marketplace.json
	@bash $(LAMELLA) build-marketplace

sync-codex-manifests: ## Generate Codex manifests from Claude manifests
	@bash $(SYNC_CODEX_MANIFESTS)

build-codex: ## Build Codex skill exports to dist/codex/
	@bash $(LAMELLA) build-codex

build-claude-subagents: ## Emit shared subagents as Claude markdown artifacts
	@bash builders/build-claude-subagents.sh

build-codex-agents: ## Emit shared subagents as Codex TOML agent artifacts
	@bash builders/build-codex-agents.sh

install-codex: build-codex ## Build and install Codex skills to ~/.codex/skills
	@bash $(LAMELLA) install-codex --all --force

install: build ## Build and install all plugins
	@bash $(LAMELLA) install --all --force

install-all: install ## Alias for install

uninstall: ## Uninstall all plugins
	@bash $(INSTALL_SCRIPT) --uninstall --all --force

audit: ## Run audit scan
	@bash scripts/audit/audit-scan.sh 2>/dev/null || echo "No audit script found"

clean: ## Remove dist/ build output
	@rm -rf dist/
	@echo "Cleaned dist/"

count: ## Show asset counts
	@echo "Skills:   $$(find $${LAMELLA_CONTENT_ROOT:-resources}/skills -mindepth 2 -maxdepth 2 -type d 2>/dev/null | wc -l | tr -d ' ')"
	@echo "Subagents:$$(find $${LAMELLA_CONTENT_ROOT:-resources}/subagents -name 'SUBAGENT.md' 2>/dev/null | wc -l | tr -d ' ')"
	@echo "Commands: $$(find $${LAMELLA_CONTENT_ROOT:-resources}/commands -name '*.md' 2>/dev/null | wc -l | tr -d ' ')"
	@echo "Rules:    $$(find $${LAMELLA_CONTENT_ROOT:-resources}/rules -name '*.md' 2>/dev/null | wc -l | tr -d ' ')"
	@echo "Plugins:  $$(ls $(PLUGIN_DIR)/*.json 2>/dev/null | grep -v schema.json | grep -v index.json | wc -l | tr -d ' ')"
