# Running Custom Playwright Code

Use `run-code` when the CLI has no direct command for the browser action you
need.

## Syntax

```bash
playwright-cli run-code "async page => {
  return await page.title();
}"
```

Treat the callback as a small task script. Keep it short and return plain JSON,
strings, or numbers when you want output back in the terminal.

## Browser Context Recipes

### Geolocation

```bash
playwright-cli run-code "async page => {
  await page.context().grantPermissions(['geolocation']);
  await page.context().setGeolocation({
    latitude: 37.7749,
    longitude: -122.4194
  });
  return 'geolocation-set';
}"
```

### Permissions

```bash
playwright-cli run-code "async page => {
  await page.context().grantPermissions(
    ['clipboard-read', 'clipboard-write', 'notifications'],
    { origin: 'https://example.com' }
  );
  return 'permissions-granted';
}"
```

### Media Emulation

```bash
playwright-cli run-code "async page => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  return {
    colorScheme: 'dark',
    reducedMotion: 'reduce'
  };
}"
```

## Page Control Recipes

### Wait for a Stable Page

```bash
playwright-cli run-code "async page => {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('.result', { timeout: 10000 });
  return 'ready';
}"
```

### Work With Frames

```bash
playwright-cli run-code "async page => {
  const frame = page.locator('iframe#my-iframe').contentFrame();
  await frame.locator('button').click();
  return await frame.locator('h1').textContent();
}"
```

### Handle a Download

```bash
playwright-cli run-code "async page => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('a.download-link')
  ]);
  await download.saveAs('./downloaded-file.pdf');
  return download.suggestedFilename();
}"
```

## Evaluation Recipes

### Read Page State

```bash
playwright-cli run-code "async page => {
  return {
    title: await page.title(),
    url: page.url(),
    viewport: page.viewportSize(),
    userAgent: await page.evaluate(() => navigator.userAgent)
  };
}"
```

### Run Browser JavaScript

```bash
playwright-cli run-code "async page => {
  const multiplier = 5;
  return await page.evaluate(m => {
    return document.querySelectorAll('li').length * m;
  }, multiplier);
}"
```

## Error Handling

```bash
playwright-cli run-code "async page => {
  try {
    await page.click('.maybe-missing', { timeout: 1000 });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}"
```

## Practical Rules

- Prefer normal CLI commands first. Use `run-code` only for gaps.
- Keep scripts focused on one browser task.
- Return structured output when the result will be reused.
- Clean up permissions or modified state if later steps depend on defaults.
