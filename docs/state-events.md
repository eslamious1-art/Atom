# Plan state events and public actions

The shared `planStore` centralises navigation, selection, and feature flag behaviour for the
Launcher → Easy Mode Wizard → Unified Result → Expert Mode experience. The following tables map
public store actions to the domain events they emit so downstream features can subscribe or
extend behaviour predictably.

## Store actions

| Action | Purpose | Emits |
| --- | --- | --- |
| `initializePlan(plan?: PartialPlanState)` | Hydrates state from persisted or default data. | `plan/initialized` |
| `goToModule(route: ModuleRoute)` | Updates the active module used by the shell router. | `plan/module-changed` |
| `selectStep(stepId?: string)` | Tracks which wizard step is currently in focus. | `plan/step-selected` |
| `updateStep(stepId: string, updates: StepUpdate)` | Persists wizard edits and marks the plan dirty. | `plan/step-updated` |
| `setFeatureFlag(flag: string, enabled: boolean)` | Enables or disables feature flags (e.g., `aiAssist`, `expertMode`). | `plan/feature-flag-updated` |
| `toggleFeatureFlag(flag: string)` | Convenience helper that flips a flag and reuses `setFeatureFlag`. | `plan/feature-flag-updated` |
| `triggerAiGeneration(prompt: string, stepId?: string)` | Requests AI copy from the mock generator and attaches the output to the plan. | `plan/ai-generated` |
| `addGeneratedAsset(asset: string)` | Manually registers AI or human-authored assets for downstream export. | `plan/ai-generated` |
| `autosave()` | Writes the current state to the mock persistence service. | `plan/autosaved` |
| `exportPlan(format?: 'json' \| 'markdown')` | Serialises the plan through the mock export service. | `plan/exported` |
| `markSaved()` | Clears dirty flags after successful saves. | (none) |
| `resetPlan()` | Restores the store to its factory defaults. | (none) |

## Event payloads

| Event | Payload shape | Notes |
| --- | --- | --- |
| `plan/initialized` | `{ planId: string }` | Fired once when the store boots or rehydrates. |
| `plan/module-changed` | `{ route: ModuleRoute }` | Used by analytics to track the launcher → wizard → result → expert flow. |
| `plan/step-selected` | `{ stepId?: string }` | `stepId` is optional when clearing selection. |
| `plan/step-updated` | `{ stepId: string, updates: StepUpdate }` | Includes the delta applied to the step. |
| `plan/feature-flag-updated` | `{ flag: string, enabled: boolean }` | Enables experiment toggles like `expertMode`. |
| `plan/ai-generated` | `{ stepId?: string, metadata?: AiGenerationResponse['metadata'] }` | `stepId` is present when generation targeted a specific wizard step. |
| `plan/autosaved` | `{ planId: string }` | Emitted after the mock persistence layer confirms the write. |
| `plan/exported` | `ExportResult` | Contains bytes, format, and ISO timestamp for the export artifact. |

## Usage summary

* Components consume the store via the `usePlanStore` hook exported from `src/state/planStore.ts`.
* Mock services live in `src/services` and can be swapped with production integrations while
  preserving the action signatures above.
* The shell (`src/components/AppShell.tsx`) wires the routing sequence and ensures that
  downstream packages only need to attach to the documented actions/events to extend behaviour.
