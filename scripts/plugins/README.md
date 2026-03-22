# Claude Plugin Management Scripts

Legacy Claude build/install scripts used by the generalized builders in
[`builders/`](../../builders/).

## Scripts

| Script | Description |
|--------|-------------|
| `build-plugin.sh` | Build a Claude plugin from its manifest JSON |
| `install-plugin.sh` | Install built plugins to `~/.claude` |

## Usage

```bash
# Build all plugins
for manifest in manifests/claude/*.json; do
  [[ "$(basename "$manifest")" != "schema.json" ]] && bash scripts/plugins/build-plugin.sh "$manifest"
done

# List available plugins
./scripts/plugins/install-plugin.sh --list

# Install specific plugins
./scripts/plugins/install-plugin.sh core python typescript

# Install all plugins
./scripts/plugins/install-plugin.sh --all
```

## See Also

- [Claude manifests](../../manifests/claude/)
- [Generalized builders](../../builders/)
- [Claude build output](../../dist/claude/)
