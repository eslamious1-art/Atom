export type ModuleRoute =
  | 'launcher'
  | 'easyModeWizard'
  | 'unifiedResult'
  | 'expertMode';

export type PlanStepStatus = 'pending' | 'in-progress' | 'complete';

export interface PlanStep {
  id: string;
  title: string;
  status: PlanStepStatus;
  summary?: string;
  data?: Record<string, unknown>;
}

export interface PlanEvent<TPayload = unknown> {
  type:
    | 'plan/initialized'
    | 'plan/step-selected'
    | 'plan/step-updated'
    | 'plan/module-changed'
    | 'plan/feature-flag-updated'
    | 'plan/ai-generated'
    | 'plan/autosaved'
    | 'plan/exported';
  timestamp: number;
  payload?: TPayload;
}

export interface PlanState {
  planId: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  steps: PlanStep[];
  currentModule: ModuleRoute;
  selectedStepId?: string;
  featureFlags: Record<string, boolean>;
  generatedAssets: string[];
  isDirty: boolean;
  eventLog: PlanEvent[];
}

export type PartialPlanState = Partial<PlanState> & {
  steps?: PlanStep[];
};
