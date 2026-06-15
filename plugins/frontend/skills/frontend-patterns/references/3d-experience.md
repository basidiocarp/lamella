# 3D Experience

3D should earn its keep.

## Use 3D When

- the product needs interactive product inspection or configuration
- the interface benefits from spatial understanding
- a designer-owned scene already exists and the team needs to integrate it safely

## Do Not Use 3D When

- a still image or video would explain the idea just as well
- the effect is decorative only and harms mobile performance
- the page needs strong Core Web Vitals more than it needs spectacle

## Stack Selection

| Tool | Best For | Tradeoff |
|------|----------|----------|
| Spline | Fast embeds and designer-owned scenes | Less code-level control |
| React Three Fiber | React apps with custom 3D behavior | More engineering effort |
| Three.js | Maximum control outside React | Highest complexity |

## GLB Pipeline Checklist

1. Export web-ready assets as GLB or GLTF.
2. Keep polygon count reasonable for web delivery.
3. Reduce materials and bake textures where possible.
4. Compress with `gltf-transform` before shipping.
5. Set a real mobile fallback before embedding the live scene.

Compression example:

```bash
npm install -g @gltf-transform/cli
gltf-transform optimize input.glb output.glb --compress draco --texture-compress webp
```
