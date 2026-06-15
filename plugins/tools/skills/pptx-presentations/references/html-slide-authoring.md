# HTML Slide Authoring

Use this reference when creating the HTML source that `html2pptx` converts into
PowerPoint slides.

## Slide Dimensions

- `16:9`: `720pt x 405pt`
- `4:3`: `720pt x 540pt`
- `16:10`: `720pt x 450pt`

Set the body to the exact slide size and use `display: flex` to avoid margin
collapse causing overflow errors.

## Supported Elements

- Text: `<p>`, `<h1>` to `<h6>`, `<ul>`, `<ol>`
- Inline formatting: `<b>`, `<strong>`, `<i>`, `<em>`, `<u>`, `<span>`
- Layout and shapes: `<div>`
- Media: `<img>`
- Line breaks: `<br>`

## Text Rules

- Put all visible text inside supported text elements.
- Do not rely on text directly inside `<div>` or `<span>`.
- Use proper lists instead of manual bullets such as `•`, `-`, or `*`.
- Stay on web-safe fonts such as `Arial`, `Helvetica`, `Georgia`, or
  `Times New Roman`.

## Styling Rules

- Use margins for spacing. Padding counts toward the box size and can break
  slide fit.
- Use normal CSS colors with the `#` prefix in HTML.
- Use `text-align` when you need centered or right-aligned text.
- Use `<span>` only for inline emphasis like color, bold, italic, or underline.

## Shape Rules

Backgrounds, borders, rounded corners, and shadows should live on `<div>`
elements, not on text nodes.

```html
<div
  style="
    background: #f5f7fb;
    border-left: 8pt solid #e76f51;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
  "
>
  <p>Callout content</p>
</div>
```

## Example Slide Skeleton

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      html,
      body {
        margin: 0;
        width: 720pt;
        height: 405pt;
      }
      body {
        display: flex;
        flex-direction: column;
        background: #ffffff;
        color: #0f172a;
        font-family: Arial, Helvetica, sans-serif;
      }
      .hero {
        margin: 28pt 32pt 18pt;
      }
      .content {
        display: flex;
        gap: 18pt;
        margin: 0 32pt 28pt;
      }
      .left,
      .right {
        flex: 1;
      }
    </style>
  </head>
  <body>
    <div class="hero">
      <h1>Quarterly Results</h1>
      <p>Revenue is up 18% and churn improved for the third straight month.</p>
    </div>
    <div class="content">
      <div class="left">
        <ul>
          <li>Enterprise pipeline expanded</li>
          <li>Gross margin improved</li>
        </ul>
      </div>
      <div class="right placeholder" id="revenue-chart"></div>
    </div>
  </body>
</html>
```
