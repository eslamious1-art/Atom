import React from 'react';
import { usePlanStore } from '../../state/planStore';

export const ExpertMode: React.FC = () => {
  const featureFlags = usePlanStore((state) => state.featureFlags);
  const setFeatureFlag = usePlanStore((state) => state.setFeatureFlag);
  const eventLog = usePlanStore((state) => state.eventLog);
  const steps = usePlanStore((state) => state.steps);
  const goToModule = usePlanStore((state) => state.goToModule);

  return (
    <section aria-labelledby="expert-mode-heading">
      <header>
        <h1 id="expert-mode-heading">Expert Mode</h1>
        <p>Inspect every detail before publishing or moving back into the launcher.</p>
      </header>
      <div>
        <label htmlFor="expert-flag">
          <input
            id="expert-flag"
            type="checkbox"
            checked={featureFlags.expertMode ?? false}
            onChange={(event) => setFeatureFlag('expertMode', event.target.checked)}
          />{' '}
          Enable advanced controls
        </label>
      </div>
      <section>
        <h2>Progress overview</h2>
        <ul>
          {steps.map((step) => (
            <li key={step.id}>
              <strong>{step.title}:</strong> {step.status}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Event log</h2>
        {eventLog.length === 0 ? (
          <p>No events recorded yet.</p>
        ) : (
          <ol>
            {eventLog.map((event, index) => (
              <li key={index}>
                <code>{new Date(event.timestamp).toISOString()}</code> — {event.type}
              </li>
            ))}
          </ol>
        )}
      </section>
      <button type="button" onClick={() => goToModule('launcher')}>
        Return to Launcher
      </button>
    </section>
  );
};
