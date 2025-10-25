import type { PlanState, PlanStep } from '../types/plan';

export interface AiGenerationRequest {
  prompt: string;
  context?: {
    planId?: string;
    stepId?: string;
    title?: string;
    steps?: PlanStep[];
  };
}

export interface AiGenerationResponse {
  content: string;
  metadata: {
    model: string;
    tokens: number;
    durationMs: number;
  };
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const synthesizeFromPrompt = (
  prompt: string,
  context: AiGenerationRequest['context'],
): string => {
  const header = context?.title
    ? `# ${context.title}\n`
    : '# Generated Plan Asset\n';
  const stepLine = context?.stepId ? `- Step: ${context.stepId}\n` : '';
  const promptLine = `- Prompt: ${prompt}\n`;
  const stepsExcerpt = (context?.steps ?? [])
    .slice(0, 3)
    .map((step) => `  - ${step.title} (${step.status})`)
    .join('\n');

  const body = stepsExcerpt ? `\n## Related Steps\n${stepsExcerpt}\n` : '';
  const recommendation =
    '\n## Recommendation\nLeverage cross-team collaboration and iterative validation to accelerate delivery.\n';

  return `${header}${stepLine}${promptLine}${body}${recommendation}`;
};

export const aiGenerationService = {
  async generatePlanAsset(request: AiGenerationRequest): Promise<AiGenerationResponse> {
    const start = Date.now();
    await wait(350);
    const content = synthesizeFromPrompt(request.prompt, request.context);
    const durationMs = Date.now() - start;

    return {
      content,
      metadata: {
        model: 'mock-gpt-strategist',
        tokens: Math.max(32, Math.round(content.length / 4)),
        durationMs,
      },
    };
  },

  async summarizePlan(plan: PlanState): Promise<AiGenerationResponse> {
    const start = Date.now();
    await wait(250);
    const content = [
      `# Summary for ${plan.title}`,
      `Plan ID: ${plan.planId}`,
      `Modules: launcher → easyModeWizard → unifiedResult → expertMode`,
      '',
      '## Step Status',
      ...plan.steps.map((step, index) => `${index + 1}. ${step.title} — ${step.status}`),
      '',
      '## Next Actions',
      '- Review AI generated recommendations',
      '- Capture stakeholder feedback before Expert Mode handoff',
    ].join('\n');
    const durationMs = Date.now() - start;

    return {
      content,
      metadata: {
        model: 'mock-gpt-strategist',
        tokens: Math.max(48, Math.round(content.length / 4)),
        durationMs,
      },
    };
  },
};
