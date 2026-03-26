# Spline Integration Patterns

Pick the narrowest integration that matches the stack.

## React / Vite

Install:

```bash
npm install @splinetool/react-spline
```

Basic embed:

```tsx
import Spline from "@splinetool/react-spline";

export function Scene() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Spline scene="https://prod.spline.design/REPLACE_ME/scene.splinecode" />
    </div>
  );
}
```

Lazy-loaded wrapper with fallback:

```tsx
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

function shouldLoadSpline(mobileBreakpoint: number): boolean {
  if (typeof window === "undefined") return false;
  const isMobile = window.innerWidth < mobileBreakpoint;
  const isLowEnd = navigator.hardwareConcurrency <= 2;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  return !isMobile && !isLowEnd && !!gl;
}

export function SplineBackground({
  sceneUrl,
  fallbackColor = "#0a0a0a",
}: {
  sceneUrl: string;
  fallbackColor?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [canLoad, setCanLoad] = useState(false);
  const [failed, setFailed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setCanLoad(shouldLoadSpline(768));
  }, []);

  useEffect(() => {
    if (!canLoad) return;
    timeoutRef.current = setTimeout(() => setFailed(true), 8000);
    return () => clearTimeout(timeoutRef.current);
  }, [canLoad]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: fallbackColor,
          opacity: loaded && !failed ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      />
      {canLoad && !failed ? (
        <Suspense fallback={null}>
          <Spline
            scene={sceneUrl}
            onLoad={() => {
              clearTimeout(timeoutRef.current);
              setLoaded(true);
            }}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
```

## Next.js

Use the Next-friendly import first:

```tsx
import Spline from "@splinetool/react-spline/next";

export default function Page() {
  return <Spline scene="https://prod.spline.design/REPLACE_ME/scene.splinecode" />;
}
```

If hydration fails, switch to a client-only dynamic import:

```tsx
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline/next"), {
  ssr: false,
  loading: () => <div style={{ background: "#0a0a0a", width: "100%", height: "100vh" }} />,
});
```

## Vanilla HTML

```html
<link
  rel="preload"
  href="https://prod.spline.design/REPLACE_ME/scene.splinecode"
  as="fetch"
  crossorigin
/>
<script type="module" src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"></script>

<div class="spline-fallback" id="spline-fallback"></div>
<div class="spline-bg" id="spline-bg">
  <spline-viewer
    id="spline-viewer"
    url="https://prod.spline.design/REPLACE_ME/scene.splinecode"
    events-target="global"
  ></spline-viewer>
</div>
```

Use a real capability check before leaving the scene enabled:

```js
function shouldLoadSpline() {
  const isMobile = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency <= 2;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  return !isMobile && !isLowEnd && !!gl;
}
```

## Runtime Interaction

Use runtime interaction only when the user actually needs object control or event-driven animation.

```tsx
import { useCallback, useRef } from "react";
import Spline from "@splinetool/react-spline";
import type { Application } from "@splinetool/runtime";

export function InteractiveScene() {
  const splineApp = useRef<Application>();

  const onLoad = useCallback((app: Application) => {
    splineApp.current = app;
  }, []);

  const rotateObject = useCallback(() => {
    const obj = splineApp.current?.findObjectByName("Cube");
    if (!obj) return;
    obj.rotation.y += Math.PI / 2;
  }, []);

  return (
    <>
      <Spline
        scene="https://prod.spline.design/REPLACE_ME/scene.splinecode"
        onLoad={onLoad}
        onMouseDown={(event) => console.log(event.target?.name)}
      />
      <button onClick={rotateObject}>Rotate 90°</button>
    </>
  );
}
```

Notes:

- Object rotation uses radians, not degrees.
- Variable access only works if the variables exist in the Spline editor.
- Keep content overlays above the scene with a higher `z-index`.
