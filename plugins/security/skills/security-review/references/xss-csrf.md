# XSS and CSRF Prevention

Treat XSS and CSRF as adjacent browser threats with different defenses.

## XSS

Primary controls:

- contextual output encoding
- avoiding unsafe HTML sinks
- sanitization only when HTML input is intentionally supported
- Content Security Policy to reduce blast radius

High-signal rule: if the framework already escapes output by default, preserve
 that safety and treat escape hatches like `dangerouslySetInnerHTML` as review
 hotspots.

## CSRF

Primary controls:

- synchronizer tokens or double-submit tokens
- `SameSite` cookies
- server-side origin or intent checks where appropriate

High-signal rule: do not assume session cookies are safe by themselves if the
app still accepts cross-site state-changing requests.

## Quick Reference

| Attack | Primary Defense |
| --- | --- |
| reflected or stored XSS | output encoding plus CSP |
| DOM XSS | avoid unsafe DOM sinks |
| CSRF | tokens plus `SameSite` cookies |

## Headers and Browser Signals

- CSP limits script execution and resource loading
- `X-Frame-Options` or `frame-ancestors` reduce clickjacking risk
- `X-Content-Type-Options` reduces MIME confusion

Keep the review boundary sharp: XSS is about script execution; CSRF is about
cross-site request authority.
