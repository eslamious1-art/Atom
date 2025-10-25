import { create } from 'zustand';

export type Gender = 'Male' | 'Female' | 'Other';

export interface Patient {
  name: string;
  gender: Gender;
  dob: string;
}

export interface Files {
  dicomPath: string;
  stlPath: string;
}

export type ToothId = number;

export interface ImplantPosition {
  x: number;
  y: number;
  z: number;
}

export interface Implant {
  id: number;
  tooth: ToothId;
  vendor: string;
  diameter: number;
  length: number;
  angle: number;
  position?: ImplantPosition;
}

export interface Sleeve {
  id: number;
  implantId: number;
  label: string;
  kit: string;
  guide: 'Depth Control' | 'Pilot';
  offset: number;
  totalDrill: number;
  applied?: boolean;
}

export interface NervePoint {
  x: number;
  y: number;
  z: number;
}

export interface Nerve {
  id: number;
  name: string;
  visible: boolean;
  diameter: number;
  points?: NervePoint[];
}

export interface Model {
  id: string;
  opacity: number;
  locked?: boolean;
}

export interface Arch {
  type: 'Maxillary' | 'Mandibular';
}

export type Selection =
  | { type: 'implant'; id: number }
  | { type: 'sleeve'; id: number }
  | { type: 'nerves'; id: 0 }
  | { type: 'model'; id: 0 }
  | { type: 'arch'; id: 0 }
  | null;

export type ViewMode = 'Bone' | 'X-Ray' | 'MIP';

export interface PlanState {
  patient: Patient;
  files: Files;
  teeth: ToothId[];
  model: Model;
  implants: Implant[];
  sleeves: Sleeve[];
  nerves: Nerve[];
  arch: Arch;
  selection: Selection;
  viewMode: ViewMode;
  show2DLines: boolean;
  showModel: boolean;
  showImplants: boolean;
  showNerves: boolean;
  transparency: number;
}

export interface PlanGenerationResult {
  implants: Implant[];
  sleeves: Sleeve[];
  nerves: Nerve[];
  model: Model;
  arch: Arch;
}

export interface PlanActions {
  resetPlan: () => void;
  setPatient: (patient: Partial<Patient>) => void;
  setFiles: (files: Partial<Files>) => void;
  setTeeth: (teeth: ToothId[]) => void;
  setModel: (model: Partial<Model>) => void;
  setArch: (arch: Arch) => void;
  setImplants: (implants: Implant[]) => void;
  addImplant: (implant: Implant) => void;
  updateImplant: (implantId: number, updates: Partial<Implant>) => void;
  removeImplant: (implantId: number) => void;
  setSleeves: (sleeves: Sleeve[]) => void;
  addSleeve: (sleeve: Sleeve) => void;
  updateSleeve: (sleeveId: number, updates: Partial<Sleeve>) => void;
  removeSleeve: (sleeveId: number) => void;
  setNerves: (nerves: Nerve[]) => void;
  updateNerve: (nerveId: number, updates: Partial<Nerve>) => void;
  setSelection: (selection: Selection) => void;
  applyGenerationResult: (result: PlanGenerationResult) => void;
  setViewMode: (viewMode: ViewMode) => void;
  setShow2DLines: (visible: boolean) => void;
  setShowModel: (visible: boolean) => void;
  setShowImplants: (visible: boolean) => void;
  setShowNerves: (visible: boolean) => void;
  setTransparency: (transparency: number) => void;
}

export type PlanStore = PlanState & PlanActions;

export const MAX_TRANSPARENCY = 100;
export const MIN_TRANSPARENCY = 0;

export const createInitialPlanState = (): PlanState => ({
  patient: { name: '', gender: 'Male', dob: '' },
  files: { dicomPath: '', stlPath: '' },
  teeth: [],
  model: { id: '', opacity: 100, locked: false },
  implants: [],
  sleeves: [],
  nerves: [],
  arch: { type: 'Maxillary' },
  selection: null,
  viewMode: 'Bone',
  show2DLines: true,
  showModel: true,
  showImplants: true,
  showNerves: true,
  transparency: 0,
});

const clampTransparency = (value: number): number => {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.min(MAX_TRANSPARENCY, Math.max(MIN_TRANSPARENCY, value));
};

export const usePlanState = create<PlanStore>((set, get) => ({
  ...createInitialPlanState(),
  resetPlan: () => set({ ...createInitialPlanState() }),
  setPatient: (patient) =>
    set((state) => ({
      patient: { ...state.patient, ...patient },
    })),
  setFiles: (files) =>
    set((state) => ({
      files: { ...state.files, ...files },
    })),
  setTeeth: (teeth) => set({ teeth: [...teeth] }),
  setModel: (model) =>
    set((state) => ({
      model: { ...state.model, ...model },
    })),
  setArch: (arch) => set({ arch }),
  setImplants: (implants) => set({ implants: [...implants] }),
  addImplant: (implant) => set((state) => ({ implants: [...state.implants, implant] })),
  updateImplant: (implantId, updates) =>
    set((state) => ({
      implants: state.implants.map((implant) =>
        implant.id === implantId ? { ...implant, ...updates } : implant,
      ),
    })),
  removeImplant: (implantId) =>
    set((state) => ({ implants: state.implants.filter((implant) => implant.id !== implantId) })),
  setSleeves: (sleeves) => set({ sleeves: [...sleeves] }),
  addSleeve: (sleeve) => set((state) => ({ sleeves: [...state.sleeves, sleeve] })),
  updateSleeve: (sleeveId, updates) =>
    set((state) => ({
      sleeves: state.sleeves.map((sleeve) =>
        sleeve.id === sleeveId ? { ...sleeve, ...updates } : sleeve,
      ),
    })),
  removeSleeve: (sleeveId) =>
    set((state) => ({ sleeves: state.sleeves.filter((sleeve) => sleeve.id !== sleeveId) })),
  setNerves: (nerves) => set({ nerves: [...nerves] }),
  updateNerve: (nerveId, updates) =>
    set((state) => ({
      nerves: state.nerves.map((nerve) =>
        nerve.id === nerveId ? { ...nerve, ...updates } : nerve,
      ),
    })),
  setSelection: (selection) => set({ selection }),
  applyGenerationResult: (result) =>
    set({
      implants: [...result.implants],
      sleeves: [...result.sleeves],
      nerves: [...result.nerves],
      arch: result.arch,
      model: { ...result.model },
      selection: result.implants.length ? { type: 'implant', id: result.implants[0].id } : null,
    }),
  setViewMode: (viewMode) => set({ viewMode }),
  setShow2DLines: (visible) => set({ show2DLines: visible }),
  setShowModel: (visible) => set({ showModel: visible }),
  setShowImplants: (visible) => set({ showImplants: visible }),
  setShowNerves: (visible) => set({ showNerves: visible }),
  setTransparency: (transparency) => set({ transparency: clampTransparency(transparency) }),
}));

export const selectPlanState = <T,>(selector: (state: PlanStore) => T): T => selector(usePlanState.getState());

export const resetPlanState = (): void => {
  usePlanState.getState().resetPlan();
};

export const getCurrentPlanState = (): PlanState => {
  const { resetPlan, ...rest } = usePlanState.getState();
  const {
    setPatient,
    setFiles,
    setTeeth,
    setModel,
    setArch,
    addImplant,
    updateImplant,
    removeImplant,
    addSleeve,
    updateSleeve,
    removeSleeve,
    setNerves,
    updateNerve,
    setSelection,
    applyGenerationResult,
    setViewMode,
    setShow2DLines,
    setShowModel,
    setShowImplants,
    setShowNerves,
    setTransparency,
    ...planState
  } = rest;
  return planState;
};
