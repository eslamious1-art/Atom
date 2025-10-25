import type { PlanState } from '../types/plan';

export interface ExportResult {
  artifact: string;
  format: 'json' | 'markdown';
  bytes: number;
  createdAt: string;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const serializePlan = (plan: PlanState, format: 'json' | 'markdown'): string => {
  if (format === 'markdown') {
    const stepLines = plan.steps
      .map((step, index) => `${index + 1}. **${step.title}** — ${step.status}`)
      .join('\n');

    return [
      `# ${plan.title}`,
      plan.description ?? 'No description provided.',
      '',
      '## Steps',
      stepLines,
      '',
      '---',
      `Exported on ${new Date().toISOString()}`,
    ].join('\n');
  }

  return JSON.stringify(plan, null, 2);
};

export const exportService = {
  async exportPlan(plan: PlanState, format: 'json' | 'markdown' = 'json'): Promise<ExportResult> {
    await wait(200);
    const artifact = serializePlan(plan, format);
    return {
      artifact,
      format,
      bytes: new TextEncoder().encode(artifact).length,
      createdAt: new Date().toISOString(),
    };
  },
};
