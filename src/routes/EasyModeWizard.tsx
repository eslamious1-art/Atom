import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePlanFromSelection } from '../services/mockAi';
import { trackEvent } from '../services/telemetry';
import { Gender, ToothId, usePlanState } from '../state/planState';

const UPPER_LEFT: ToothId[] = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_RIGHT: ToothId[] = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_LEFT: ToothId[] = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_RIGHT: ToothId[] = [31, 32, 33, 34, 35, 36, 37, 38];

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

type FieldKey = 'name' | 'dob' | 'dicomPath' | 'stlPath' | 'teeth';

const isValidDate = (value: string): boolean => {
  if (!value) {
    return false;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
};

const EasyModeWizard: React.FC = () => {
  const navigate = useNavigate();

  const patient = usePlanState((state) => state.patient);
  const files = usePlanState((state) => state.files);
  const selectedTeeth = usePlanState((state) => state.teeth);

  const setPatient = usePlanState((state) => state.setPatient);
  const setFiles = usePlanState((state) => state.setFiles);
  const setTeeth = usePlanState((state) => state.setTeeth);
  const resetPlan = usePlanState((state) => state.resetPlan);
  const applyGenerationResult = usePlanState((state) => state.applyGenerationResult);

  const [localPatient, setLocalPatient] = useState(patient);
  const [localFiles, setLocalFiles] = useState(files);
  const [localTeeth, setLocalTeeth] = useState<ToothId[]>(selectedTeeth);
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    dob: false,
    dicomPath: false,
    stlPath: false,
    teeth: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    setLocalPatient(patient);
  }, [patient]);

  useEffect(() => {
    setLocalFiles(files);
  }, [files]);

  useEffect(() => {
    setLocalTeeth(selectedTeeth);
  }, [selectedTeeth]);

  const errors = useMemo(() => {
    const trimmedName = localPatient.name.trim();
    const trimmedDicom = localFiles.dicomPath.trim();
    const trimmedStl = localFiles.stlPath.trim();

    return {
      name: trimmedName ? null : 'Patient name is required.',
      dob: isValidDate(localPatient.dob) ? null : 'Date of birth is required.',
      dicomPath: trimmedDicom ? null : 'DICOM path is required.',
      stlPath: trimmedStl ? null : 'STL model path is required.',
      teeth: localTeeth.length ? null : 'Select at least one tooth.',
    } as const;
  }, [localFiles.dicomPath, localFiles.stlPath, localPatient.dob, localPatient.name, localTeeth.length]);

  const isValid = useMemo(() => Object.values(errors).every((value) => value === null), [errors]);

  const showError = (field: FieldKey): boolean => !!errors[field] && (touched[field] || isSubmitting);

  const handlePatientChange = (field: 'name' | 'dob' | 'gender', value: string) => {
    const nextPatient = { ...localPatient, [field]: value } as typeof localPatient;
    setLocalPatient(nextPatient);
    setPatient(nextPatient);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handlePatientChange('gender', event.target.value as Gender);
  };

  const handleFileChange = (field: 'dicomPath' | 'stlPath', value: string) => {
    const nextFiles = { ...localFiles, [field]: value };
    setLocalFiles(nextFiles);
    setFiles(nextFiles);
  };

  const handleToothToggle = (tooth: ToothId) => {
    setTouched((prev) => ({ ...prev, teeth: true }));
    setLocalTeeth((prev) => {
      const exists = prev.includes(tooth);
      const updated = exists ? prev.filter((value) => value !== tooth) : [...prev, tooth];
      setTeeth(updated);
      return updated;
    });
  };

  const markAllTouched = () =>
    setTouched({
      name: true,
      dob: true,
      dicomPath: true,
      stlPath: true,
      teeth: true,
    });

  const handleBlur = (field: FieldKey) =>
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

  const handleCancel = () => {
    resetPlan();
    navigate('/');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    markAllTouched();

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    trackEvent('wizard_generate_click', {
      teeth: localTeeth,
      dicomProvided: Boolean(localFiles.dicomPath.trim()),
      stlProvided: Boolean(localFiles.stlPath.trim()),
    });

    setPatient(localPatient);
    setFiles(localFiles);
    setTeeth(localTeeth);

    setGenerationError(null);

    try {
      const result = await generatePlanFromSelection({
        patient: localPatient,
        files: localFiles,
        teeth: localTeeth,
      });

      applyGenerationResult(result);

      trackEvent('ai_generation_complete', {
        implantCount: result.implants.length,
        sleeveCount: result.sleeves.length,
        nerveCount: result.nerves.length,
        arch: result.arch.type,
      });

      navigate('/plan');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to generate plan', error);
      setGenerationError('Automatic generation failed. Please try again.');
      trackEvent('error_shown', {
        code: 'ai_generation_failed',
        location: 'wizard',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderToothButton = (tooth: ToothId) => {
    const isSelected = localTeeth.includes(tooth);
    return (
      <button
        key={tooth}
        type="button"
        className={`odontogram-tooth${isSelected ? ' selected' : ''}`}
        onClick={() => handleToothToggle(tooth)}
        aria-pressed={isSelected}
      >
        {tooth}
      </button>
    );
  };

  return (
    <main className="easy-mode-wizard">
      <header className="wizard-header">
        <h1>Easy Mode Wizard</h1>
        <p>Provide patient details, imaging files, and target teeth to generate an AI-assisted plan.</p>
      </header>
      <form className="wizard-form" onSubmit={handleSubmit} noValidate>
        <section className="wizard-section">
          <h2>Patient</h2>
          <label className="field">
            <span>Patient Name</span>
            <input
              type="text"
              value={localPatient.name}
              onChange={(event) => handlePatientChange('name', event.target.value)}
              onBlur={() => handleBlur('name')}
              aria-invalid={showError('name')}
              required
            />
            {showError('name') && <p className="field-error">{errors.name}</p>}
          </label>
          <fieldset className="field">
            <legend>Gender</legend>
            <div className="field-radios">
              {GENDER_OPTIONS.map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={localPatient.gender === option.value}
                    onChange={handleGenderChange}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="field">
            <span>Date of Birth</span>
            <input
              type="date"
              value={localPatient.dob}
              onChange={(event) => handlePatientChange('dob', event.target.value)}
              onBlur={() => handleBlur('dob')}
              aria-invalid={showError('dob')}
              required
            />
            {showError('dob') && <p className="field-error">{errors.dob}</p>}
          </label>
        </section>
        <section className="wizard-section">
          <h2>Files</h2>
          <label className="field">
            <span>DICOM Series Path</span>
            <input
              type="text"
              value={localFiles.dicomPath}
              onChange={(event) => handleFileChange('dicomPath', event.target.value)}
              onBlur={() => handleBlur('dicomPath')}
              aria-invalid={showError('dicomPath')}
              placeholder="C:\\Cases\\Patient\\DICOM"
              required
            />
            {showError('dicomPath') && <p className="field-error">{errors.dicomPath}</p>}
          </label>
          <label className="field">
            <span>STL Model Path</span>
            <input
              type="text"
              value={localFiles.stlPath}
              onChange={(event) => handleFileChange('stlPath', event.target.value)}
              onBlur={() => handleBlur('stlPath')}
              aria-invalid={showError('stlPath')}
              placeholder="C:\\Cases\\Patient\\upper_model.stl"
              required
            />
            {showError('stlPath') && <p className="field-error">{errors.stlPath}</p>}
          </label>
        </section>
        <section className="wizard-section odontogram-section">
          <h2>Odontogram</h2>
          <p>Select one or more teeth to plan implants.</p>
          <div className="odontogram">
            <div className="odontogram-row" aria-label="Upper arch">
              {UPPER_LEFT.map(renderToothButton)}
              <span className="odontogram-spacer" aria-hidden>•</span>
              {UPPER_RIGHT.map(renderToothButton)}
            </div>
            <div className="odontogram-row" aria-label="Lower arch">
              {LOWER_LEFT.map(renderToothButton)}
              <span className="odontogram-spacer" aria-hidden>•</span>
              {LOWER_RIGHT.map(renderToothButton)}
            </div>
          </div>
          {showError('teeth') && <p className="field-error">{errors.teeth}</p>}
        </section>
        <footer className="wizard-footer">
          <button type="button" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? 'Generating…' : 'Generate'}
          </button>
        </footer>
        {generationError && (
          <div className="wizard-error" role="alert" aria-live="assertive">
            {generationError}
          </div>
        )}
      </form>
    </main>
  );
};

export default EasyModeWizard;
