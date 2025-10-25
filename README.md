# Atomica Implant Guide Prototype

This repository contains the product documentation and prototype scaffolding for the Atomica Implant Guide "Easy Mode" experience.

## Documentation

- [Atomica Implant Guide PRD](docs/atomica_implant_guide_prd.md)

## Development

The front-end prototype is implemented with React, Vite, and Zustand.

```bash
npm install
npm run dev
```

The initial implementation focuses on the shared `PlanState` store, feature flag context, and routing shell for Launcher → Easy Mode Wizard → Unified Result → Expert Mode. Subsequent tasks will build the detailed wizard forms, AI generation workflow, contextual toolbars, inspectors, autosave, and export features described in the PRD.
