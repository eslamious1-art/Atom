import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanState } from '../state/planState';

const ExpertMode: React.FC = () => {
  const navigate = useNavigate();
  const viewMode = usePlanState((state) => state.viewMode);

  return (
    <main className="expert-mode">
      <header>
        <h1>Expert Mode (Legacy)</h1>
        <p>Legacy step workflow placeholder with shared plan state.</p>
      </header>
      <section>
        <p>Current view mode: {viewMode}</p>
      </section>
      <footer>
        <button type="button" onClick={() => navigate('/plan')}>
          Return to Unified Result
        </button>
      </footer>
    </main>
  );
};

export default ExpertMode;
