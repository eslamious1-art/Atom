import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeatureFlags } from '../features/FeatureFlagContext';
import { resetPlanState } from '../state/planState';

const Launcher: React.FC = () => {
  const navigate = useNavigate();
  const { implant_guide_easy_mode: easyModeEnabled } = useFeatureFlags();

  const handleStart = () => {
    resetPlanState();
    navigate(easyModeEnabled ? '/easy-mode' : '/expert');
  };

  return (
    <main className="launcher">
      <header>
        <h1>Atomica Launcher</h1>
        <p>Select a planning workflow to begin.</p>
      </header>
      <section>
        <button type="button" onClick={handleStart}>
          {easyModeEnabled ? 'Start Easy Mode Wizard' : 'Open Expert Mode'}
        </button>
      </section>
    </main>
  );
};

export default Launcher;
