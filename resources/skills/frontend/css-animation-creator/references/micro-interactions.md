# Micro-interactions

Detailed examples of button effects, hover states, icon animations, form interactions, and feedback states.

## Button Effects

```tsx
// Press effect
<button className="transition-transform duration-100 active:scale-95">
  Click me
</button>

// ... (27 lines trimmed)
    </button>
  );
}
```

```css
@keyframes ripple {
  from {
    width: 0;
    height: 0;
    opacity: 0.5;
  }
  to {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}
```

## Hover Effects

```tsx
// Lift effect
<div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
  Card content
</div>

// ... (20 lines trimmed)
  </span>
  <span className="absolute inset-0 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
</a>
```

## Icon Animations

```tsx
// Rotate on hover
<button className="group">
  <SettingsIcon className="transition-transform duration-500 group-hover:rotate-180" />
</button>

// Bounce on hover
<button className="group">
  <ArrowIcon className="transition-transform group-hover:translate-x-1 group-hover:animate-bounce" />
</button>

// Scale + rotate
<button className="group">
  <PlusIcon className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-90" />
</button>
```

## Form Interactions

```tsx
// Input focus effect
<div className="relative">
  <input
    className="peer w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 transition-colors"
    placeholder=" "
// ... (28 lines trimmed)
    enabled && "translate-x-5"
  )} />
</button>
```

## Success/Error States

```tsx
// Success checkmark
<div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
  <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24">
    <path
      className="animate-[draw_0.5s_ease-out_forwards]"
// ... (11 lines trimmed)

// Error shake
<input className="animate-[shake_0.5s_ease-in-out] border-red-500" />
```

```css
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```
