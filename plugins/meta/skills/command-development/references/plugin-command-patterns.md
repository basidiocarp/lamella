# Plugin Command Patterns

Plugin commands usually fall into one of these shapes:

- configuration-driven commands
- template-driven generators
- multi-step workflows that call plugin scripts or load plugin resources

## Good Fit

Use a plugin command when the behavior depends on assets shipped with the
plugin, such as:

- local templates
- helper scripts
- manifest-backed resource paths
- plugin-specific settings

## Integration Rule

If a command depends on another plugin component, document that dependency in
the command or the companion skill so future maintainers know what must stay in
sync.
