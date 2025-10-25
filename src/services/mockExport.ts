import { PlanState } from '../state/planState';

export interface ExportSummary {
  implants: number;
  sleeves: number;
  nerves: number;
}

export interface ExportResult {
  caseId: string;
  status: 'queued' | 'failed';
  summary: ExportSummary;
}

export const exportPlanTo360 = async (state: PlanState): Promise<ExportResult> => {
  const summary: ExportSummary = {
    implants: state.implants.length,
    sleeves: state.sleeves.length,
    nerves: state.nerves.length,
  };

  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    caseId: `CASE-${Date.now()}`,
    status: 'queued',
    summary,
  };
};
