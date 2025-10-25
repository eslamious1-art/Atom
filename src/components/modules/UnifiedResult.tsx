import React, { useState } from 'react';
import { usePlanStore } from '../../state/planStore';
import { aiGenerationService } from '../../services/mockAiService';

export const UnifiedResult: React.FC = () => {
  const { planId, title, steps, generatedAssets } = usePlanStore((state) => ({
    planId: state.planId,
    title: state.title,
    steps: state.steps,
    generatedAssets: state.generatedAssets,
  }));
  const exportPlan = usePlanStore((state) => state.exportPlan);
  const autosave = usePlanStore((state) => state.autosave);
  const goToModule = usePlanStore((state) => state.goToModule);
  const [summary, setSummary] = useState<string>('');
  const [artifactPreview, setArtifactPreview] = useState<string>('');
  const [format, setFormat] = useState<'json' | 'markdown'>('json');

  const handleSummarize = async () => {
    const snapshot = {
      planId,
      title,
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps,
      currentModule: 'unifiedResult' as const,
      selectedStepId: undefined,
      featureFlags: {},
      generatedAssets,
      isDirty: false,
      eventLog: [],
    };
    const response = await aiGenerationService.summarizePlan(snapshot);
    setSummary(response.content);
  };

  const handleExport = async () => {
    const artifact = await exportPlan(format);
    setArtifactPreview(artifact);
    await autosave();
  };

  return (
    <section aria-labelledby="unified-result-heading">
      <header>
        <h1 id="unified-result-heading">Unified Result</h1>
        <p>Combine wizard progress, AI output, and manual edits into a single package.</p>
      </header>
      <div>
        <h2>Generated assets</h2>
        {generatedAssets.length === 0 ? (
          <p>No assets yet. Generate content in the wizard to populate this list.</p>
        ) : (
          <ul>
            {generatedAssets.map((asset, index) => (
              <li key={index}>
                <details>
                  <summary>Asset {index + 1}</summary>
                  <pre>{asset}</pre>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={handleSummarize}>
          Summarize plan with AI
        </button>
        {summary && (
          <article>
            <h2>AI Summary</h2>
            <pre>{summary}</pre>
          </article>
        )}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label htmlFor="export-format">Export format</label>{' '}
        <select
          id="export-format"
          value={format}
          onChange={(event) => setFormat(event.target.value as 'json' | 'markdown')}
        >
          <option value="json">JSON</option>
          <option value="markdown">Markdown</option>
        </select>
        <button type="button" onClick={handleExport} style={{ marginLeft: '0.5rem' }}>
          Export plan
        </button>
        {artifactPreview && (
          <article>
            <h2>Export preview ({format})</h2>
            <pre>{artifactPreview}</pre>
          </article>
        )}
      </div>
      <button type="button" onClick={() => goToModule('expertMode')} style={{ marginTop: '1rem' }}>
        Continue to Expert Mode
      </button>
    </section>
  );
};
