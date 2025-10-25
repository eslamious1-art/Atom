import React, { useMemo, useState } from 'react';
import { usePlanStore } from '../../state/planStore';
import type { PlanStep } from '../../types/plan';

export const EasyModeWizard: React.FC = () => {
  const steps = usePlanStore((state) => state.steps);
  const selectedStepId = usePlanStore((state) => state.selectedStepId);
  const selectStep = usePlanStore((state) => state.selectStep);
  const updateStep = usePlanStore((state) => state.updateStep);
  const triggerAiGeneration = usePlanStore((state) => state.triggerAiGeneration);
  const goToModule = usePlanStore((state) => state.goToModule);
  const [prompt, setPrompt] = useState('');

  const selectedStep: PlanStep | undefined = useMemo(
    () => steps.find((step) => step.id === selectedStepId),
    [steps, selectedStepId],
  );

  const handleGenerate = async () => {
    if (!selectedStep) {
      return;
    }
    const fallbackPrompt = `Generate guidance for step "${selectedStep.title}".`;
    await triggerAiGeneration(prompt.trim() || fallbackPrompt, selectedStep.id);
    setPrompt('');
  };

  const handleMarkComplete = () => {
    if (!selectedStep) {
      return;
    }
    updateStep(selectedStep.id, { status: 'complete' });
  };

  return (
    <section aria-labelledby="easy-mode-heading">
      <header>
        <h1 id="easy-mode-heading">Easy Mode Wizard</h1>
        <p>Guide teammates through curated steps before handing off to the unified result.</p>
      </header>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <nav aria-label="Wizard steps" style={{ minWidth: '16rem' }}>
          <ol>
            {steps.map((step) => (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => selectStep(step.id)}
                  style={{
                    fontWeight: step.id === selectedStepId ? 'bold' : 'normal',
                    textTransform: 'capitalize',
                  }}
                >
                  {step.title} — {step.status}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <article style={{ flex: 1 }}>
          {selectedStep ? (
            <>
              <h2>{selectedStep.title}</h2>
              <p>Status: {selectedStep.status}</p>
              <textarea
                rows={6}
                style={{ width: '100%' }}
                value={selectedStep.summary ?? ''}
                onChange={(event) =>
                  updateStep(selectedStep.id, { summary: event.target.value, status: 'in-progress' })
                }
                placeholder="Capture notes or use AI assisted copy."
              />
              <div style={{ marginTop: '1rem' }}>
                <label htmlFor="ai-prompt">Custom AI prompt</label>
                <textarea
                  id="ai-prompt"
                  rows={3}
                  style={{ width: '100%' }}
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Ask the assistant for more detail or a new angle."
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button type="button" onClick={handleGenerate}>
                  Generate with AI
                </button>
                <button type="button" onClick={handleMarkComplete}>
                  Mark step complete
                </button>
                <button type="button" onClick={() => goToModule('unifiedResult')}>
                  View Unified Result
                </button>
              </div>
            </>
          ) : (
            <p>Select a step to get started.</p>
          )}
        </article>
      </div>
    </section>
  );
};
