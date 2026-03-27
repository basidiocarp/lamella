# Authentication

Use this reference for the standard Django REST authentication shapes: JWT,
permission classes, registration, and “current user” endpoints.

## JWT with SimpleJWT

Use SimpleJWT when the API needs stateless auth for browser or mobile clients.

Typical setup includes:
- `rest_framework_simplejwt` in installed apps
- token obtain and refresh endpoints
- DRF authentication configured to accept JWTs

Add custom claims only when clients truly need them.

## Custom Claims

If extra claims are required:
- keep them small
- avoid sensitive data that should be fetched separately
- prefer stable identifiers over presentation data

JWT claims should help authorization or routing, not duplicate the whole user
profile.

## Permission Classes

Use permission classes to separate access policy from view logic.

Typical layers:
- `AllowAny` for public endpoints
- `IsAuthenticated` for logged-in access
- object-level permissions such as owner checks
- action-specific permission switching in viewsets when needed

If a viewset’s `get_permissions()` becomes complex, the policy probably needs to
be split or simplified.

## Registration and Current User

Common endpoints:
- registration create view
- token obtain / refresh
- current-user retrieve or update view

Registration serializers should:
- validate password confirmation
- enforce password policy
- create the user atomically

The current-user endpoint should return `request.user` directly instead of
treating it like an arbitrary lookup.

## Quick Mapping

| Need | Common pattern |
|---|---|
| API login | JWT token obtain endpoint |
| refresh auth | refresh token endpoint |
| per-object write protection | custom object permission |
| public reads, auth writes | `IsAuthenticatedOrReadOnly` |
| self profile | current-user endpoint |

Keep auth policy explicit and predictable. Hidden permission logic is harder to
audit than duplicated but readable access rules.
