import { create } from 'zustand';
import type {
  ModuleRoute,
  PartialPlanState,
  PlanEvent,
  PlanState,
  PlanStep,
} from '../types/plan';
import { aiGenerationService } from '../services/mockAiService';
import { persistenceService } from '../services/mockPersistenceService';
import { exportService } from '../services/mockExportService';

type StepUpdate = Partial<Omit<PlanStep, 'id'>>;

const MAX_EVENT_LOG = 100;

const createInitialPlanState = (): PlanState => {
  const isoNow = new Date().toISOString();
  return {
    planId: 'local-plan',
    title: 'New Strategic Plan',
    description: undefined,
    createdAt: isoNow,
    updatedAt: isoNow,
    steps: [
      {
        id: 'launch-objectives',
        title: 'Define launch objectives',
        status: 'pending',
        summary: undefined,
        data: {},
      },
      {
        id: 'audience-analysis',
        title: 'Analyze target audience',
        status: 'pending',
        summary: undefined,
        data: {},
      },
      {
        id: 'channel-strategy',
        title: 'Draft channel strategy',
        status: 'pending',
        summary: undefined,
        data: {},
      },
    ],
    currentModule: 'launcher',
    selectedStepId: undefined,
    featureFlags: {
      expertMode: false,
      aiAssist: true,
    },
    generatedAssets: [],
    isDirty: false,
    eventLog: [],
  };
};

export interface PlanStore extends PlanState {
  initializePlan: (plan?: PartialPlanState) => void;
  goToModule: (route: ModuleRoute) => void;
  selectStep: (stepId?: string) => void;
  updateStep: (stepId: string, updates: StepUpdate) => void;
  setFeatureFlag: (flag: string, enabled: boolean) => void;
  toggleFeatureFlag: (flag: string) => void;
  triggerAiGeneration: (prompt: string, stepId?: string) => Promise<string>;
  addGeneratedAsset: (asset: string) => void;
  autosave: () => Promise<void>;
  exportPlan: (format?: 'json' | 'markdown') => Promise<string>;
  markSaved: () => void;
  resetPlan: () => void;
}

const appendEvent = (eventLog: PlanEvent[], event: PlanEvent): PlanEvent[] => {
  const nextLog = [...eventLog, event];
  if (nextLog.length > MAX_EVENT_LOG) {
    return nextLog.slice(nextLog.length - MAX_EVENT_LOG);
  }
  return nextLog;
};

export const usePlanStore = create<PlanStore>((set, get) => ({
  ...createInitialPlanState(),

  initializePlan: (plan) => {
    const base = createInitialPlanState();
    const merged: PlanState = {
      ...base,
      ...plan,
      steps: plan?.steps ?? base.steps,
      featureFlags: { ...base.featureFlags, ...(plan?.featureFlags ?? {}) },
      generatedAssets: plan?.generatedAssets ?? base.generatedAssets,
      eventLog: base.eventLog,
    };

    const event: PlanEvent = {
      type: 'plan/initialized',
      timestamp: Date.now(),
      payload: { planId: merged.planId },
    };

    set(() => ({
      ...merged,
      eventLog: appendEvent(merged.eventLog, event),
    }));
  },

  goToModule: (route) => {
    set((state) => ({
      currentModule: route,
      updatedAt: new Date().toISOString(),
      eventLog: appendEvent(state.eventLog, {
        type: 'plan/module-changed',
        timestamp: Date.now(),
        payload: { route },
      }),
    }));
  },

  selectStep: (stepId) => {
    set((state) => ({
      selectedStepId: stepId,
      eventLog: appendEvent(state.eventLog, {
        type: 'plan/step-selected',
        timestamp: Date.now(),
        payload: { stepId },
      }),
    }));
  },

  updateStep: (stepId, updates) => {
    set((state) => {
      const nextSteps = state.steps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              ...updates,
              data: { ...step.data, ...(updates.data ?? {}) },
            }
          : step,
      );

      return {
        steps: nextSteps,
        updatedAt: new Date().toISOString(),
        isDirty: true,
        eventLog: appendEvent(state.eventLog, {
          type: 'plan/step-updated',
          timestamp: Date.now(),
          payload: { stepId, updates },
        }),
      };
    });
  },

  setFeatureFlag: (flag, enabled) => {
    set((state) => ({
      featureFlags: { ...state.featureFlags, [flag]: enabled },
      eventLog: appendEvent(state.eventLog, {
        type: 'plan/feature-flag-updated',
        timestamp: Date.now(),
        payload: { flag, enabled },
      }),
    }));
  },

  toggleFeatureFlag: (flag) => {
    const { featureFlags, setFeatureFlag } = get();
    setFeatureFlag(flag, !featureFlags[flag]);
  },

  triggerAiGeneration: async (prompt, stepId) => {
    const plan = get();
    const result = await aiGenerationService.generatePlanAsset({
      prompt,
      context: {
        planId: plan.planId,
        stepId,
        title: plan.title,
        steps: plan.steps,
      },
    });

    set((state) => ({
      generatedAssets: [...state.generatedAssets, result.content],
      updatedAt: new Date().toISOString(),
      isDirty: true,
      eventLog: appendEvent(state.eventLog, {
        type: 'plan/ai-generated',
        timestamp: Date.now(),
        payload: { stepId, metadata: result.metadata },
      }),
    }));

    if (stepId) {
      get().updateStep(stepId, { summary: result.content, status: 'in-progress' });
    }

    return result.content;
  },

  addGeneratedAsset: (asset) => {
    set((state) => ({
      generatedAssets: [...state.generatedAssets, asset],
      eventLog: appendEvent(state.eventLog, {
        type: 'plan/ai-generated',
        timestamp: Date.now(),
        payload: { asset },
      }),
    }));
  },

  autosave: async () => {
    const plan = get();
    await persistenceService.savePlan(plan);
    set((state) => ({
      isDirty: false,
      eventLog: appendEvent(state.eventLog, {
        type: 'plan/autosaved',
        timestamp: Date.now(),
        payload: { planId: plan.planId },
      }),
    }));
  },

  exportPlan: async (format = 'json') => {
    const plan = get();
    const result = await exportService.exportPlan(plan, format);
    set((state) => ({
      eventLog: appendEvent(state.eventLog, {
        type: 'plan/exported',
        timestamp: Date.now(),
        payload: result,
      }),
    }));
    return result.artifact;
  },

  markSaved: () => {
    set(() => ({
      isDirty: false,
      updatedAt: new Date().toISOString(),
    }));
  },

  resetPlan: () => {
    const base = createInitialPlanState();
    set(() => base);
  },
}));
