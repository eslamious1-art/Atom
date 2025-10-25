import type { PlanState } from '../types/plan';

type StoredPlan = PlanState & { persistedAt: number };

const inMemoryStore = new Map<string, StoredPlan>();

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const persistenceService = {
  async savePlan(plan: PlanState): Promise<void> {
    await wait(150);
    inMemoryStore.set(plan.planId, { ...plan, persistedAt: Date.now() });
  },

  async loadPlan(planId: string): Promise<PlanState | null> {
    await wait(100);
    const stored = inMemoryStore.get(planId);
    if (!stored) {
      return null;
    }
    const { persistedAt, ...plan } = stored;
    return {
      ...plan,
      updatedAt: new Date(persistedAt).toISOString(),
    };
  },

  async clear(planId: string): Promise<void> {
    await wait(50);
    inMemoryStore.delete(planId);
  },
};
