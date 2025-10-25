# Atom Planning Suite

This prototype implements the shared plan state store, module shells, and mock services required
for the Launcher → Easy Mode Wizard → Unified Result → Expert Mode flow.

## Getting started

Install dependencies and run TypeScript checks.

```bash
npm install
npm run check
```

The UI is composed of React components under `src/components`. Mount `AppShell` into your
application to enable the module router powered by the shared Zustand store in
`src/state/planStore.ts`.

## Key packages

* Zustand store implementing `PlanState`, navigation, feature flags, and event logging.
* React shells that sequence modules and surface mock service interactions.
* Mock AI, autosave, and export services (see `src/services`).
* State events and public actions documented in `docs/state-events.md`.
