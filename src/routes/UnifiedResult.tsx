import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  usePlanState,
  ViewMode,
  Implant,
  Sleeve,
  Selection,
  MIN_TRANSPARENCY,
  MAX_TRANSPARENCY,
} from '../state/planState';

const viewModes: ViewMode[] = ['Bone', 'X-Ray', 'MIP'];

const UnifiedResult: React.FC = () => {
  const navigate = useNavigate();
  const selection = usePlanState((state) => state.selection);
  const setSelection = usePlanState((state) => state.setSelection);
  const implants = usePlanState((state) => state.implants);
  const sleeves = usePlanState((state) => state.sleeves);
  const nerves = usePlanState((state) => state.nerves);
  const model = usePlanState((state) => state.model);
  const arch = usePlanState((state) => state.arch);
  const viewMode = usePlanState((state) => state.viewMode);
  const show2DLines = usePlanState((state) => state.show2DLines);
  const showModel = usePlanState((state) => state.showModel);
  const showImplants = usePlanState((state) => state.showImplants);
  const showNerves = usePlanState((state) => state.showNerves);
  const transparency = usePlanState((state) => state.transparency);
  const setViewMode = usePlanState((state) => state.setViewMode);
  const setShow2DLines = usePlanState((state) => state.setShow2DLines);
  const setShowModel = usePlanState((state) => state.setShowModel);
  const setShowImplants = usePlanState((state) => state.setShowImplants);
  const setShowNerves = usePlanState((state) => state.setShowNerves);
  const setTransparency = usePlanState((state) => state.setTransparency);

  const handleSelect = (nextSelection: Selection) => () => setSelection(nextSelection);

  const goToExpertMode = () => navigate('/expert');

  return (
    <main className="unified-result">
      <header>
        <h1>Unified Result Workspace</h1>
        <p>Skeleton layout ready for contextual tooling implementation.</p>
      </header>
      <section className="top-bar">
        <div className="view-mode">
          <span>View Mode:</span>
          {viewModes.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              aria-pressed={viewMode === mode}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="toggles">
          <label>
            <input
              type="checkbox"
              checked={show2DLines}
              onChange={(event) => setShow2DLines(event.target.checked)}
            />
            2D Lines
          </label>
          <label>
            <input
              type="checkbox"
              checked={showModel}
              onChange={(event) => setShowModel(event.target.checked)}
            />
            Model
          </label>
          <label>
            <input
              type="checkbox"
              checked={showImplants}
              onChange={(event) => setShowImplants(event.target.checked)}
            />
            Implants
          </label>
          <label>
            <input
              type="checkbox"
              checked={showNerves}
              onChange={(event) => setShowNerves(event.target.checked)}
            />
            Nerves
          </label>
        </div>
        <div className="transparency">
          <label htmlFor="transparency-range">Transparency</label>
          <input
            id="transparency-range"
            type="range"
            min={MIN_TRANSPARENCY}
            max={MAX_TRANSPARENCY}
            value={transparency}
            onChange={(event) => setTransparency(Number(event.target.value))}
          />
          <span>{transparency}</span>
        </div>
        <div className="actions">
          <button type="button" onClick={goToExpertMode}>
            Expert Mode
          </button>
        </div>
      </section>
      <div className="workspace-grid">
        <aside className="objects-rail">
          <h2>Objects</h2>
          <section>
            <h3>Implants</h3>
            {implants.length ? (
              <ul>
                {implants.map((implant: Implant) => (
                  <li key={implant.id}>
                    <button
                      type="button"
                      onClick={handleSelect({ type: 'implant', id: implant.id })}
                      aria-pressed={selection?.type === 'implant' && selection.id === implant.id}
                    >
                      Implant #{implant.id} ({implant.diameter}×{implant.length})
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No implants yet.</p>
            )}
          </section>
          <section>
            <h3>Sleeves</h3>
            {sleeves.length ? (
              <ul>
                {sleeves.map((sleeve: Sleeve) => (
                  <li key={sleeve.id}>
                    <button
                      type="button"
                      onClick={handleSelect({ type: 'sleeve', id: sleeve.id })}
                      aria-pressed={selection?.type === 'sleeve' && selection.id === sleeve.id}
                    >
                      Sleeve · {sleeve.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No sleeves yet.</p>
            )}
          </section>
          <section>
            <h3>Nerves</h3>
            <button
              type="button"
              onClick={handleSelect({ type: 'nerves', id: 0 })}
              aria-pressed={selection?.type === 'nerves'}
            >
              Nerves ({nerves.length || 'none'})
            </button>
          </section>
          <section>
            <h3>Model</h3>
            <button
              type="button"
              onClick={handleSelect({ type: 'model', id: 0 })}
              aria-pressed={selection?.type === 'model'}
            >
              {model.id ? `Model · ${model.id}` : 'Model not loaded'}
            </button>
          </section>
          <section>
            <h3>Arch</h3>
            <button
              type="button"
              onClick={handleSelect({ type: 'arch', id: 0 })}
              aria-pressed={selection?.type === 'arch'}
            >
              Arch · {arch.type}
            </button>
          </section>
        </aside>
        <section className="inspector">
          <h2>Inspector</h2>
          <p>Contextual inspector panels will be implemented in Task 6.</p>
          <pre>{JSON.stringify(selection, null, 2)}</pre>
        </section>
        <section className="viewers">
          <h2>Viewers</h2>
          <p>Placeholder 3D + NPR canvas surfaces.</p>
        </section>
      </div>
    </main>
  );
};

export default UnifiedResult;
