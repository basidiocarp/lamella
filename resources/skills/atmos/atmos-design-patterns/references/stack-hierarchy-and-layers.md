# Stack Hierarchy and Layers

## Organizational Hierarchy

Use `_defaults.yaml` files to build inheritance chains across org, tenant, and stage levels.

```text
stacks/orgs/acme/
  _defaults.yaml
  plat/
    _defaults.yaml
    dev/
      _defaults.yaml
      network.yaml
```

## Layered Configuration

Layer by concern when different teams own different infrastructure slices:

- network
- data
- compute

Then let environment stacks import only the needed layers.

## `_defaults.yaml` Convention

- convention, not Atmos magic
- explicitly imported
- best kept to a small number of levels
