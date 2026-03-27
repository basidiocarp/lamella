---
title: Strategic Suspense Boundaries
impact: HIGH
impactDescription: faster initial paint
tags: async, suspense, streaming, layout-shift
---

## Strategic Suspense Boundaries

Instead of awaiting data in async components before returning JSX, use Suspense boundaries to show the wrapper UI faster while data loads.

**Incorrect (wrapper blocked by data fetching):**

```tsx
async function Page() {
  const data = await fetchData(); // Blocks entire page

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  );
}
```

**Correct (wrapper shows immediately, data streams in):**

```tsx
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<div>Loading...</div>}>
        <DataDisplay />
      </Suspense>
      <div>Footer</div>
    </div>
  );
}

async function DataDisplay() {
  const data = await fetchData();
  return <div>{data.content}</div>;
}
```

**Alternative (share promise across components):**

```tsx
function Page() {
  const dataPromise = fetchData();

  return (
    <div>
      <Sidebar />
      <Suspense fallback={<div>Loading summary...</div>}>
        <Summary dataPromise={dataPromise} />
      </Suspense>
    </div>
  );
}

function Summary({ dataPromise }: { dataPromise: Promise<{ summary: string }> }) {
  const data = use(dataPromise);
  return <div>{data.summary}</div>;
}
```

Use this pattern when the wrapper layout can render independently of the slow data.
