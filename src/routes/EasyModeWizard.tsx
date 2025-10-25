import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanState } from '../state/planState';

const EasyModeWizard: React.FC = () => {
  const navigate = useNavigate();
  const patient = usePlanState((state) => state.patient);
  const files = usePlanState((state) => state.files);
  const teeth = usePlanState((state) => state.teeth);

  const handleBack = () => navigate('/');
  const handleContinue = () => navigate('/plan');

  return (
    <main className="easy-mode-wizard">
      <header>
        <h1>Easy Mode Wizard</h1>
        <p>Wizard UI will be implemented in Task 2. Current state snapshot:</p>
      </header>
      <section>
        <h2>Patient</h2>
        <dl>
          <dt>Name</dt>
          <dd>{patient.name || '—'}</dd>
          <dt>Gender</dt>
          <dd>{patient.gender}</dd>
          <dt>Date of Birth</dt>
          <dd>{patient.dob || '—'}</dd>
        </dl>
      </section>
      <section>
        <h2>Files</h2>
        <dl>
          <dt>DICOM</dt>
          <dd>{files.dicomPath || '—'}</dd>
          <dt>STL</dt>
          <dd>{files.stlPath || '—'}</dd>
        </dl>
      </section>
      <section>
        <h2>Selected Teeth</h2>
        <p>{teeth.length ? teeth.join(', ') : 'None selected yet'}</p>
      </section>
      <footer>
        <button type="button" onClick={handleBack}>
          Cancel
        </button>
        <button type="button" onClick={handleContinue}>
          Continue to Unified Result
        </button>
      </footer>
    </main>
  );
};

export default EasyModeWizard;
