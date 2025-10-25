import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Launcher from './routes/Launcher';
import EasyModeWizard from './routes/EasyModeWizard';
import UnifiedResult from './routes/UnifiedResult';
import ExpertMode from './routes/ExpertMode';
import { useFeatureFlag } from './features/FeatureFlagContext';

const App: React.FC = () => {
  const easyModeEnabled = useFeatureFlag('implant_guide_easy_mode');

  return (
    <Routes>
      <Route path="/" element={<Launcher />} />
      {easyModeEnabled ? (
        <Route path="/easy-mode" element={<EasyModeWizard />} />
      ) : (
        <Route path="/easy-mode" element={<Navigate to="/expert" replace />} />
      )}
      <Route path="/plan" element={<UnifiedResult />} />
      <Route path="/expert" element={<ExpertMode />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
