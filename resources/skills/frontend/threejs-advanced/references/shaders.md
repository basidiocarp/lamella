# Three.js Shaders

Use shader work when built-in materials cannot produce the effect cleanly.

## ShaderMaterial Basics

```js
import * as THREE from "three";

const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0xff0000) },
  },
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;

    void main() {
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});
```

## Uniform Updates

```js
material.uniforms.time.value = clock.getElapsedTime();
material.uniforms.color.value.setHSL(hue, 1, 0.5);
```

## Vertex Displacement

```js
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    amplitude: { value: 0.5 },
  },
  vertexShader: `
    uniform float time;
    uniform float amplitude;

    void main() {
      vec3 pos = position;
      pos.z += sin(pos.x * 5.0 + time) * amplitude;
      pos.z += sin(pos.y * 5.0 + time) * amplitude;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);
    }
  `,
});
```

## Good Defaults

- Start with `ShaderMaterial`, not `RawShaderMaterial`
- Add one uniform at a time
- Keep shader goals narrow: color, displacement, mask, glow, or distortion
- Validate readability and performance after every shader effect
