# LAU Smart Parking Frontend

Modern React + Tailwind frontend for the Smart Parking System project.

## Main structure

- `src/components/` reusable UI, parking map elements, badges, cards, navbar, sidebar
- `src/pages/` route-level pages such as login and dashboard
- `src/layouts/` shared page shells
- `src/services/` mock API layer prepared for future Spring Boot REST integration
- `src/config/` centralized API base URL and endpoint definitions
- `src/data/` mock DTO-style parking data
- `src/hooks/` shared state and data-loading hooks
- `src/utils/` parking summaries and styling helpers

## Spring Boot integration notes

- Base URL is prepared through `VITE_API_BASE_URL`
- Endpoints are centralized in `src/config/api.js`
- Services isolate request logic from UI components
- Mock functions can later be replaced with `apiRequest(...)` calls
- DTO shape for parking spots stays consistent across the app:

```json
{
  "id": 101,
  "label": "A-01",
  "level": "L1",
  "status": "available",
  "assignedTo": null,
  "type": "Student"
}
```

## Commands

- `npm install`
- `npm run dev`
- `npm run build`

## Legacy files

The existing `pages/` and `static/` folders were left in place as old static prototypes. The active project now runs from the React app defined in `src/`.
