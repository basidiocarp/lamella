# Schema and Routing Migration

Move serializers and routing first so the new API surface becomes explicit.

## Common Mappings

- DRF serializers -> Pydantic request and response models
- ViewSets -> `APIRouter` handlers
- permissions and auth checks -> dependencies

## Rule

Do not try to preserve every DRF abstraction. Let the FastAPI surface become
more explicit and typed where that improves clarity.
