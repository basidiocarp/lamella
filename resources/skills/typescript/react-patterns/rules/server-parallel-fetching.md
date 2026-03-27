---
title: Parallel Data Fetching with Component Composition
impact: CRITICAL
impactDescription: eliminates server-side waterfalls
tags: server, rsc, parallel-fetching, composition
---

## Parallel Data Fetching with Component Composition

React Server Components execute sequentially within a tree. Restructure with composition so independent fetches start together.

**Incorrect (Sidebar waits for Page's fetch to complete):**

```tsx
export default async function Page() {
  const header = await fetchHeader();
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  );
}

async function Sidebar() {
  const items = await fetchSidebarItems();
  return <nav>{items.map(renderItem)}</nav>;
}
```

**Correct (both fetch simultaneously):**

```tsx
async function Header() {
  const data = await fetchHeader();
  return <div>{data}</div>;
}

async function Sidebar() {
  const items = await fetchSidebarItems();
  return <nav>{items.map(renderItem)}</nav>;
}

export default function Page() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  );
}
```

**Alternative with a layout boundary:**

```tsx
async function Header() {
  const data = await fetchHeader();
  return <div>{data}</div>;
}

function Layout({ sidebar }: { sidebar: React.ReactNode }) {
  return (
    <div>
      <Header />
      {sidebar}
    </div>
  );
}

export default function Page() {
  return <Layout sidebar={<Sidebar />} />;
}
```
