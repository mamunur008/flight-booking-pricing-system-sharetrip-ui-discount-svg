# Frontend Architecture

The frontend is refactored into a professional component-based Vue 3 structure.

## Key design

- `views/FlightSearch.vue` is now a page orchestrator only.
- Reusable layout is handled by `components/layout/AppHeader.vue`.
- Flight display components are inside `components/flight`.
- Filters are inside `components/filters`.
- Flight search state and API call orchestration are isolated in `composables/useFlightSearch.js`.
- Auth state is isolated in `stores/authStore.js`.
- Money/date formatting is isolated in `utils/formatters.js`.

## Flow

FlightSearch.vue
→ useFlightSearch composable
→ api service
→ backend JWT API
→ pricing engine
→ sanitized flight result
→ componentized UI
