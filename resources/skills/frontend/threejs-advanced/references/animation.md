# Three.js Animation

## Core Model

Three.js animation work usually revolves around three pieces:

- `AnimationClip` stores keyframes
- `AnimationMixer` plays clips against a root object
- `AnimationAction` controls playback, weight, looping, and fades

## Procedural Motion

```js
import * as THREE from "three";

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  mesh.rotation.y += delta;
  mesh.position.y = Math.sin(elapsed) * 0.5;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
```

## GLTF Animation Playback

```js
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const clock = new THREE.Clock();
let mixer;

loader.load("model.glb", (gltf) => {
  scene.add(gltf.scene);
  mixer = new THREE.AnimationMixer(gltf.scene);

  const [firstClip] = gltf.animations;
  if (firstClip) {
    mixer.clipAction(firstClip).play();
  }
});

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(clock.getDelta());
  renderer.render(scene, camera);
}
```

## Crossfades

```js
const walk = mixer.clipAction(walkClip);
const idle = mixer.clipAction(idleClip);

idle.play();
walk.reset().play();
idle.crossFadeTo(walk, 0.5, true);
```

## Good Defaults

- update the mixer once per frame with `clock.getDelta()`
- clamp finishing animations when the last pose should remain visible
- use named GLTF clips when the model exports multiple actions
- avoid adding multiple animation systems until one mixer-based flow works cleanly
