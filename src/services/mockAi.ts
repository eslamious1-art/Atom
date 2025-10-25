import {
  Arch,
  Implant,
  Model,
  Nerve,
  PlanState,
  Sleeve,
  ToothId,
  createInitialPlanState,
} from '../state/planState';

export interface PlanGenerationPayload {
  teeth: ToothId[];
}

export interface PlanGenerationResult {
  implants: Implant[];
  sleeves: Sleeve[];
  nerves: Nerve[];
  model: Model;
  arch: Arch;
}

const IMPLANT_DEFAULTS = {
  vendor: 'Generic',
  diameter: 4,
  length: 9,
  angle: 0,
};

const SLEEVE_DEFAULTS = {
  kit: '360 Extended',
  guide: 'Depth Control' as const,
  offset: 3,
  totalDrill: 18,
};

const NERVE_DEFAULTS: Pick<Nerve, 'visible' | 'diameter'> = {
  visible: true,
  diameter: 2,
};

const mandibularTeeth = new Set<number>([31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48]);

const determineArch = (teeth: ToothId[]): Arch => {
  if (!teeth.length) {
    return { type: 'Maxillary' };
  }
  return teeth.some((tooth) => mandibularTeeth.has(tooth)) ? { type: 'Mandibular' } : { type: 'Maxillary' };
};

const buildImplants = (teeth: ToothId[]): Implant[] =>
  teeth.map((tooth, index) => ({
    id: index + 1,
    tooth,
    vendor: IMPLANT_DEFAULTS.vendor,
    diameter: IMPLANT_DEFAULTS.diameter,
    length: IMPLANT_DEFAULTS.length,
    angle: IMPLANT_DEFAULTS.angle,
  }));

const buildSleeves = (implants: Implant[]): Sleeve[] =>
  implants.map((implant) => ({
    id: implant.id,
    implantId: implant.id,
    label: `${SLEEVE_DEFAULTS.kit} ${implant.diameter.toFixed(1)}`,
    kit: SLEEVE_DEFAULTS.kit,
    guide: SLEEVE_DEFAULTS.guide,
    offset: SLEEVE_DEFAULTS.offset,
    totalDrill: SLEEVE_DEFAULTS.totalDrill,
    applied: false,
  }));

const buildNerves = (teeth: ToothId[]): Nerve[] => {
  const arch = determineArch(teeth);
  if (arch.type !== 'Mandibular') {
    return [];
  }
  return [
    { id: 1, name: 'Left mandibular', ...NERVE_DEFAULTS },
    { id: 2, name: 'Right mandibular', ...NERVE_DEFAULTS },
  ];
};

export const generatePlanFromSelection = async (
  payload: PlanGenerationPayload,
): Promise<PlanGenerationResult> => {
  const baseState = createInitialPlanState();
  const implants = buildImplants(payload.teeth);
  const sleeves = buildSleeves(implants);
  const nerves = buildNerves(payload.teeth);
  const arch = determineArch(payload.teeth);
  const model: Model = { ...baseState.model };

  // Simulate async behavior for downstream progress indicators.
  await new Promise((resolve) => setTimeout(resolve, 300));

  return { implants, sleeves, nerves, arch, model };
};

export const mergeGenerationResult = (state: PlanState, result: PlanGenerationResult): PlanState => ({
  ...state,
  implants: result.implants,
  sleeves: result.sleeves,
  nerves: result.nerves,
  arch: result.arch,
  model: result.model,
  selection: result.implants.length ? { type: 'implant', id: result.implants[0].id } : null,
});
