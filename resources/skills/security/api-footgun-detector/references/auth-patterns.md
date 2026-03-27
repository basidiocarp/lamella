# Authentication & Session Footguns

Use this reference when reviewing auth, session, token, or MFA code for designs
that are easy to misuse or bypass.

## Password Handling

High-risk patterns:
- direct equality comparison on secrets
- silent password truncation before hashing
- error messages that reveal whether the username exists

Prefer:
- constant-time comparison helpers
- explicit password length validation
- uniform invalid-credential responses

## Session Management

Watch for:
- session IDs accepted or preserved across login state changes
- predictable or low-entropy session tokens
- timeout semantics where `0` or negative values quietly disable expiry

Authentication state changes should rotate the session identifier.

## OTP and Token Flows

Common footguns:
- OTPs with no rate limit
- tokens reusable after success
- recovery codes that never invalidate
- expiry handling that fails open

Treat one-time credentials as single-use and rate-limited by default.

## Authorization

Review for:
- substring or string-list role checks
- missing object-level checks
- IDOR-friendly direct identifier lookup from request input
- deny-by-default gaps between similar endpoints

The policy should be centralized enough that developers do not need to remember
every protection manually.

## MFA

Red flags:
- MFA enforced only in the frontend
- “remember device” tokens derived from weak or replayable signals
- MFA disablement tied to mutable client-controlled state

## Review Rule

Auth code is a footgun whenever the insecure path is easier than the secure one.
Look for silent fallbacks, ambiguous config values, and identifiers or tokens
that are easier to guess, replay, or reuse than intended.
