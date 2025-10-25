import React, { useEffect } from 'react';
import { ModuleRouter } from './router/ModuleRouter';
import { usePlanStore } from '../state/planStore';

export const AppShell: React.FC = () => {
  const initializePlan = usePlanStore((state) => state.initializePlan);

  useEffect(() => {
    initializePlan({
      description: 'Unified AI-powered planning experience.',
    });
  }, [initializePlan]);

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif', color: '#1f2933' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1>Atom Planning Suite</h1>
        <p>Launcher → Easy Mode Wizard → Unified Result → Expert Mode</p>
      </header>
      <main>
        <ModuleRouter />
      </main>
    </div>
  );
};
