import React from 'react';
import { usePlanStore } from '../../state/planStore';
import { Launcher } from '../modules/Launcher';
import { EasyModeWizard } from '../modules/EasyModeWizard';
import { UnifiedResult } from '../modules/UnifiedResult';
import { ExpertMode } from '../modules/ExpertMode';

const moduleComponents = {
  launcher: <Launcher />,
  easyModeWizard: <EasyModeWizard />,
  unifiedResult: <UnifiedResult />,
  expertMode: <ExpertMode />,
} as const;

export const ModuleRouter: React.FC = () => {
  const currentModule = usePlanStore((state) => state.currentModule);
  return <>{moduleComponents[currentModule]}</>;
};
