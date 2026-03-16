# Plugin Management Scripts

Scripts for building and installing lamella plugins.

## Scripts

| Script | Description |
|--------|-------------|
| `build-plugin.sh` | Build a plugin from its manifest JSON |
| `install-plugin.sh` | Install built plugins to `~/.claude` |

## Usage

```bash
# Build all plugins
for manifest in plugin-manifests/*.json; do
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

- [Plugin manifests](../../plugin-manifests/)
- [Built plugins](../../dist/plugins/)
