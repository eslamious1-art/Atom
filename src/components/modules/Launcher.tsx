import React from 'react';
import { usePlanStore } from '../../state/planStore';

export const Launcher: React.FC = () => {
  const planTitle = usePlanStore((state) => state.title);
  const planDescription = usePlanStore((state) => state.description);
  const goToModule = usePlanStore((state) => state.goToModule);
  const setFeatureFlag = usePlanStore((state) => state.setFeatureFlag);
  const featureFlags = usePlanStore((state) => state.featureFlags);

  return (
    <section aria-labelledby="launcher-heading">
      <header>
        <h1 id="launcher-heading">Launcher</h1>
        <p>Kick off a new planning session and enable collaboration features.</p>
      </header>
      <article>
        <h2>{planTitle}</h2>
        <p>{planDescription ?? 'Add a description to provide additional context.'}</p>
      </article>
      <div>
        <label htmlFor="feature-flag-ai">
          <input
            id="feature-flag-ai"
            type="checkbox"
            checked={featureFlags.aiAssist ?? false}
            onChange={(event) => setFeatureFlag('aiAssist', event.target.checked)}
          />{' '}
          Enable AI assisted copy
        </label>
      </div>
      <button type="button" onClick={() => goToModule('easyModeWizard')}>
        Enter Easy Mode Wizard
      </button>
    </section>
  );
};
