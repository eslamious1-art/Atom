import { PlanState, createInitialPlanState } from '../state/planState';

let lastSavedPlanState: PlanState | null = null;

export interface AutosaveResult {
  savedAt: Date;
}

export const autosavePlanState = async (state: PlanState): Promise<AutosaveResult> => {
  lastSavedPlanState = { ...state, implants: [...state.implants], sleeves: [...state.sleeves], nerves: [...state.nerves] };
  return { savedAt: new Date() };
};

export const loadLatestPlanState = async (): Promise<PlanState> => {
  if (!lastSavedPlanState) {
    return createInitialPlanState();
  }
  return {
    ...lastSavedPlanState,
    implants: [...lastSavedPlanState.implants],
    sleeves: [...lastSavedPlanState.sleeves],
    nerves: [...lastSavedPlanState.nerves],
  };
};
