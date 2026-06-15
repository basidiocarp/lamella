# Three.js Post-Processing

Build post-processing one pass at a time.

## Effect Composer Base

```js
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.2,
  0.4,
  0.85,
);
composer.addPass(bloomPass);

function animate() {
  requestAnimationFrame(animate);
  composer.render();
}
```

## Common Passes

- Bloom: glow around emissive or bright highlights
- FXAA or SMAA: anti-aliasing when native AA is not enough
- SSAO: grounding and ambient contact shadows
- Depth of field: selective focus, best used sparingly
- Film or vignette: atmosphere, best used gently

## Resize Handling

```js
function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);
}
```

## Use With Restraint

- Add one effect, profile, then add the next
- Avoid full-screen effects that obscure content or reduce contrast
- Prefer subtle bloom thresholds and mild vignette settings
- Remove an effect if it exists only to look expensive
