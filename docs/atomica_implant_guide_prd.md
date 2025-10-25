# Atomica Implant Guide “Easy Mode” + Unified Result + Expert Mode PRD

## 1. Document Metadata

- **Product**: Atomica Desktop (Launcher + Implant Planner Module)
- **Feature**: AI-Assisted “Easy Mode” Wizard → Unified Result (contextual editing) → Expert Mode (legacy steps)
- **Owner**: Product Design Lead
- **Stakeholders**: Engineering (Desktop, 3D/Imaging), Clinical QA, Product, Support, Sales
- **Target Users**: Dentists, Implantologists, Lab Technicians
- **Release**: v1.0 (GA), desktop-only (Windows)
- **Design Source**: Screenshots and descriptions provided by user; canvas prototype “Atomica Easy Mode – Interactive Prototype (react)”

---

## 2. Problem & Goals

### 2.1 Problem

The legacy flow requires dentists to configure multiple steps (Scan → Model → Planning → Sleeving) before seeing outcomes. This increases time-to-value and cognitive load.

### 2.2 Goals

- Reduce configuration steps up front by using AI to auto-generate:
  - Model-to-DICOM registration (auto-match)
  - Nerve detection
  - Generic implant(s) and guide sleeve(s)
- Provide a single **Unified Result** window allowing post-generation edits for all generated artifacts.
- Preserve **Expert Mode** for granular control (legacy steps).
- Ensure the UI mirrors current Atomica patterns and iconography.

### 2.3 Success Metrics

- **Primary**: Time-to-first-plan ≤ 2 minutes for single-implant cases (median).
- **Secondary**:
  - Wizard completion ≥ 90% on first attempt
  - Edit-after-generate path used ≥ 70% (vs pre-config steps)
  - Export to 360 success ≥ 95%
  - Error rate on import (DICOM/STL) ≤ 3%

---

## 3. Scope & Non-Goals

### 3.1 In Scope

- Easy Mode Wizard (Patient + Files + Odontogram selection → Generate)
- AI generation (server-side/in-process) placeholders for: auto-match, nerve detection, generic implant, generic sleeve
- Unified Result screen:
  - Object rail (Implant, Sleeve, Nerves, Model, Arch)
  - Contextual toolbar bound to current selection
  - Viewers (3D + Axial/Sagittal/Coronal with overlays)
  - Inspector panel for selected object
  - Global view controls (Bone/X-Ray/MIP; 2D lines toggle; visibility toggles; transparency)
  - Export to 360 modal (report packaging handshake)
- Expert Mode (legacy) accessible on demand
- Error/empty/loading states, autosave

### 3.2 Out of Scope (v1)

- Actual 3D rendering (use existing engine; visuals may be simplified)
- True DICOM/STL processing pipelines in this PRD (implementation detail owned by imaging team)
- Authentication/SSO flows to external 360 site
- Multi-user collaboration, real-time co-editing

---

## 4. Users & Roles

- **Primary**: Dentist/Implantologist
- **Secondary**: Dental assistant (importing files, initiating wizard)
- **Tertiary**: Lab technician (receives exported guide data)

---

## 5. Glossary

- **DICOM**: Radiographic data (CBCT)
- **STL Model**: Scanned oral model (upper/lower)
- **Odontogram**: Tooth map selector (two arches)
- **Implant**: Virtual implant object (vendor, diameter, length, angle)
- **Sleeve**: Guided drill sleeve (kit, guide type, offset, total drill length)
- **Nerves**: Mandibular canals/paths detected or manually added
- **Arch**: Maxillary or Mandibular curve
- **NPR**: 2D views (Axial/Sagittal/Coronal) with overlays

---

## 6. Information Architecture

```
Launcher
└─ Implant Guide (Easy Mode)
   ├─ Wizard (Upload Files + Patient + Odontogram)
   └─ Unified Result
      ├─ Top Bar (global view controls + Expert + Export)
      ├─ Contextual Toolbar (changes with selection)
      ├─ Left Rail (Objects)
      ├─ Left Inspector (properties of selected object)
      └─ Viewers (3D + Axial/Sagittal/Coronal)
         └─ Overlays (curve, implant, nerves, 2D lines)
   └─ Expert Mode (legacy)
      ├─ Left Step Rail (Scan/Model/Planning/Sleeving)
      └─ Step Body with viewers + step-specific tool panels
```

---

## 7. User Flows

### 7.1 Easy Mode → Unified Result

1. **Launcher**: Click **Implant Guide** → opens Wizard.
2. **Wizard Step**:
   - Enter **Patient**: Name (text), Gender (Male/Female/Other), DOB (date).
   - Upload **Files**: DICOM series (folder/file), STL (upper model).
   - Select **Teeth** via Odontogram (one or more).
   - CTA: **Generate**.
3. **Generation**:
   - Auto-match Model ↔ DICOM.
   - Detect nerves (if mandibular).
   - Generate generic implant(s) for selected teeth.
   - Generate generic sleeve(s) as vendor-recommended (e.g., 360 Extended / Depth Control).
4. **Unified Result**:
   - Objects rail populated: Implant(s), Sleeve(s), Nerves, Model, Arch.
   - Select object → Contextual toolbar + Inspector shows relevant tools/fields.
   - Edit as needed.
5. **Export**:
   - Open **Export to 360** modal.
   - Confirm & proceed → package + open 360 submission.

### 7.2 Switch to Expert Mode

- From Unified Result top bar → **Expert Mode**.
- Steps: Scan → Model → Planning → Sleeving (legacy icons/controls).
- Return to Easy by **Back** (retains state).

---

## 8. Screen-by-Screen Specifications

### 8.1 Wizard (Easy Mode)

**Layout**: Two columns

- **Left**: Patient (Name/Gender/DOB), Files (DICOM/STL)
- **Right**: Odontogram (upper/lower rows of teeth)

**Fields**

- Patient Name: free text (required)
- Gender: radio group [Male, Female, Other] (required)
- DOB: date (required)
- DICOM: path or folder (required)
- STL Model: path (required)
- Odontogram: multi-select teeth (≥1 required)

**CTAs**

- Cancel (returns to Launcher)
- Generate (enabled when all required inputs valid)

**Validation**

- Required fields must be non-empty.
- File path existence checks (if accessible).
- Odontogram selection length ≥ 1.

**Error States**

- Missing file: inline error below field.
- Corrupt series: inline error + link to help.

**Success**

- On Generate → show spinner; navigate to Unified Result once assets ready.

---

### 8.2 Unified Result

**Global Layout (grid)**

- **Top Bar** (global controls):
  - **View Mode**: [Bone | X-Ray | MIP]
  - **2D Lines**: toggle (default ON)
  - **Visibility**: Model, Implant, Nerves (toggles; all ON by default)
  - **Transparency**: slider 0–100 (default 0)
  - **Expert Mode** button
  - **Export →** button
- **Contextual Toolbar (row)**: **Changes with current selection** (see §9 Icons/Tools)
- **Left Column**: Objects rail (list)
- **Middle Column**: Inspector (properties of selection)
- **Right Column**: Viewers
  - **3D Canvas**: skull + STL + implant (visuals/overlays)
  - **NPR**: Axial / Sagittal / Coronal; overlays reflect toggles (curve, nerves, implant, crosshair; brightness/contrast inherited from View Mode)

**Objects Rail Items**

- **Implants**: e.g., `Implant #1 (4×9)`
- **Sleeves**: e.g., `Sleeve • 3Sixty-Zim 2.4`
- **Nerves**: e.g., `Nerves (2 visible)`
- **Model**: e.g., `Model • upper_model.stl`
- **Arch**: e.g., `Arch • Maxillary`/`Mandibular` (optional display)

**Inspector Panels**

- **Implant**
  - Vendor: select (Generic, Blue Sky Bio, Anatomage, Tru CEREC, Mapper)
  - Diameter (mm): numeric [3,4,5,6]
  - Length (mm): numeric [8..12]
  - Assign Tooth: select (from wizard-selected teeth)
  - Angle (°): numeric [-30..30]
  - Safety Chart: line chart “distance to nerve” (informational)
- **Sleeve**
  - Kit: select (360 Standard, 360 Extended, Vendor A/B)
  - Guide Type: select (Depth Control, Pilot)
  - Offset (mm): numeric [0..10]
  - Total Drill (mm): numeric [0..30]
  - Status badge: “Applied ✓” (after Apply Sleeve action)
- **Nerves**
  - For each detected path:
    - Diameter (mm): numeric [1..4]
    - Visible: toggle
- **Model**
  - Opacity: slider [0..100]
  - Buttons: Optimize Fitting, Rematch (invoke matching routines)

**Viewers**

- **3D**:
  - Renders skull volume (style derived from Bone/X-Ray/MIP), STL overlay (opacity bound to Model visibility/opacity), implant geometry (cylinder/cone), crosshair.
- **NPR (Axial/Sagittal/Coronal)**:
  - Bone background (mode-dependent), crosshair, curve overlay, implant marker & trajectory, nerve dots/paths.
  - 2D Lines toggle hides/shows crosshair and guide lines.

**Autosave**

- Status text (footer): “Autosaved · just now”
- Save on field blur and every 2 seconds of inactivity.

**Errors**

- If overlays fail to compute: “Overlay unavailable — retry” with retry button.
- If data missing (e.g., no STL): “Model not loaded” with a link to re-import.

---

### 8.3 Expert Mode (Legacy)

**Left Step Rail**:

- 1. Scan
- 2. Model
- 3. Planning
- 4. Sleeving

**Per Step (summary behavior)**

- **Scan**: View controls (Bone/X-Ray/MIP; 2D lines; transparency). NPR panes visible. Step toolbar shows scan-specific icons (brightness/contrast, clipping planes if available).
- **Model**: 3D + STL. Controls for opacity, optimize fitting, rematch.
- **Planning**: NPR panes + implant toolset; measure, angle, parallel, nerves add; annotations.
- **Sleeving**: NPR panes + sleeve kit selection, guide type, offset, total drill length; apply sleeve action.

**Back** returns to Unified Result, preserving state.

---

## 9. Icons, Actions, and Contextual Behavior

> Icons must **change** based on the current selection in Objects. Icons not relevant to the selection MUST be hidden (not disabled) in the Contextual Toolbar row.

### 9.1 Global (Top Bar — always visible)

- **View Mode**: Bone / X-Ray / MIP → switches rendering style globally.
- **2D Lines (toggle)**: show/hide crosshair lines in NPR.
- **Visibility Toggles**:
  - **Model**: show/hide STL
  - **Implant**: show/hide implant objects
  - **Nerves**: show/hide nerve overlays
- **Transparency (slider)**: affects 3D volume opacity (0 = opaque).
- **Expert Mode** (button): enters legacy steps; retains current objects/model state.
- **Export →** (button): opens Export to 360 modal.

### 9.2 Contextual Toolbar (Selection-sensitive; below Top Bar)

#### When **Implant** is selected

- **Add Implant** (🛠️): Creates a new implant at crosshair position with default vendor/size; opens Implant inspector; also adds corresponding Sleeve (default kit/type).
- **Make Parallel** (〰️): Aligns currently selected implant axis parallel to reference implant (if >1 implants).
  - If only one implant exists → show tooltip “Need ≥ 2 implants”.
- **Measure Angle** (∠): Enables angle measurement tool between implant axis and reference plane/implant; result shown as annotation.
- **Measurement** (📏): Distance measurement tool in NPR (perpendicular to nerve if initiated near nerve path).
- **Annotation** (💬): Add text annotation pinned to implant apex or coronal position.
- **Bone Density** (◯): Toggles density map overlay (heatmap) in NPR around implant trajectory.

#### When **Sleeve** is selected

- **Select Kit** (🧰): Opens sleeve kit selector (lists KITS with vendor recommendations).
- **Apply Sleeve** (⬚): Applies selected kit/guide/offset/drill to linked implant, updates status “Applied ✓”.
- **Depth Control** (📐): Toggles depth control on/off; adjusts drill stop automatically based on implant length.

#### When **Nerves** is selected

- **Detect Nerves** (🧠): Runs nerve detection (if none or stale); draws path; marks visibility on.
- **Add Point** (➕): Manual adding/editing of nerve control points in NPR.
- **Smooth Path** (〰): Applies spline smoothing across nerve points.

#### When **Model** is selected

- **Optimize Fitting** (⚙️): Fine registration between STL and DICOM (ICP refinement).
- **Rematch** (↺): Re-run auto-match from scratch.
- **Lock** (🔒): Locks model transform so planning can’t move STL.

> Tooltip text should match the label above, and disabled states should include reason (e.g., “Need ≥ 2 implants”).

---

## 10. Data Model (UI-level)

```ts
type Patient = { name: string; gender: 'Male'|'Female'|'Other'; dob: string }
type Files = { dicomPath: string; stlPath: string }
type ToothId = number // FDI notation (e.g., 25, 26)

type Implant = {
  id: number
  tooth: ToothId
  vendor: string
  diameter: number // mm
  length: number // mm
  angle: number // degrees
  position?: { x:number; y:number; z:number } // 3D if needed
}

type Sleeve = {
  id: number
  implantId: number
  label: string // “3Sixty-Zim 2.4”
  kit: string   // “360 Extended”
  guide: 'Depth Control'|'Pilot'
  offset: number // mm
  totalDrill: number // mm
  applied?: boolean
}

type Nerve = {
  id: number
  name: string
  visible: boolean
  diameter: number
  points?: Array<{x:number;y:number;z:number}> // optional for manual edits
}

type Model = {
  id: string // filename
  opacity: number // 0..100
  locked?: boolean
}

type Arch = { type: 'Maxillary'|'Mandibular' }

type Selection =
  | { type: 'implant'; id: number }
  | { type: 'sleeve'; id: number }
  | { type: 'nerves'; id: 0 }
  | { type: 'model'; id: 0 }
  | { type: 'arch'; id: 0 }
  | null

type PlanState = {
  patient: Patient
  files: Files
  teeth: ToothId[]
  model: Model
  implants: Implant[]
  sleeves: Sleeve[]
  nerves: Nerve[]
  arch: Arch
  selection: Selection
  viewMode: 'Bone'|'X-Ray'|'MIP'
  show2DLines: boolean
  showModel: boolean
  showImplants: boolean
  showNerves: boolean
  transparency: number // 0..100
}
```

---

## 11. Default Values

- Wizard prefill: Name blank, Gender = Male, DOB = empty, DICOM/STL empty
- After Generate (per selected teeth):
  - **Implant**: Vendor = Generic; Diameter = 4; Length = 9; Angle = 0; Tooth = first selected
  - **Sleeve**: Kit = 360 Extended; Guide = Depth Control; Offset = 3.0; TotalDrill = 18.0
  - **Nerves**: If mandibular teeth present → two nerves visible with Diameter = 2.0
  - **Model**: Opacity = 100; Locked = false
  - **Arch**: Maxillary if all teeth ≤ 28; Mandibular otherwise
  - **View**: Bone; 2D Lines = ON; Visibility: all ON; Transparency = 0

---

## 12. States & Edge Cases

- **No STL provided**: Unified Result shows “Model not loaded” with button “Import Model”
- **Nerve detection fails**: Show banner “No nerves detected; try Manual → Add Point”
- **Multiple implants**: Contextual **Make Parallel** enabled; choose reference by last selected or by clicking implant in NPR
- **Arch ambiguity**: If mixed upper/lower teeth selected → set arch by first selected; allow editing in inspector
- **Autosave errors**: show non-blocking toast “Autosave failed; retrying…”

---

## 13. Keyboard & Accessibility

- **Focus order**: Objects rail → Inspector → Toolbar → Viewers
- **Shortcuts**:
  - `V` cycle view [Bone/X-Ray/MIP]
  - `L` toggle 2D Lines
  - `M` toggle Model visibility
  - `I` toggle Implant visibility
  - `N` toggle Nerves visibility
  - `E` open Export modal
  - `Ctrl+Z/Y` undo/redo (if stack implemented; optional v1)
- **WCAG 2.2 AA**: 4.5:1 min contrast, 44px hit targets, visible focus styles
- **Tooltips** on hover for all icons

---

## 14. Telemetry & Analytics

- Events (name → when):
  - `wizard_generate_click` → Generate CTA
  - `ai_generation_complete` → AI pipeline finishes
  - `object_selected` (type,id) → Selection changes
  - `inspector_change` (object,type,field,old,new)
  - `context_tool_used` (selectionType,action)
  - `view_changed` (mode)
  - `toggle_changed` (which,value)
  - `export_initiated`
  - `expert_mode_opened`
  - `error_shown` (code)
- Metrics derived:
  - Funnel completion, dwell times, feature usage rates

---

## 15. Performance & Reliability

- **Load**: Unified Result initial render < 1500ms on reference machine
- **Memory**: Keep ≤ 1.2× current legacy footprint for same case size
- **Autosave**: Debounced (2s idle or on blur); retries 3× exponential backoff
- **Crash safety**: Save to temp and recover last autosaved session

---

## 16. Security & Compliance

- DICOM/STL processed locally or via approved on-prem pipeline
- PHI: Stored encrypted at rest; avoid logging PHI in telemetry
- Export: Only send necessary files to 360; confirm user consent

---

## 17. QA & Acceptance Criteria

### 17.1 Functional

1. Wizard requires all mandatory fields; Generate disabled until valid.
2. Generation creates:
   - ≥ 1 implant for selected teeth
   - Matching sleeve(s) linked to implant(s)
   - Nerves when mandibular
   - Model matched to DICOM (status: “Matched” in model inspector after optimize/rematch)
3. Unified Result:
   - Selecting **Implant** changes contextual toolbar to implant tools; inspector shows implant fields; NPR overlays implant markers.
   - Selecting **Sleeve** changes toolbar to sleeve tools; inspector shows kit/guide/offset/drill; Apply updates status.
   - Selecting **Nerves** shows nerve tools; toggling visibility hides/shows NPR nerve overlay.
   - Selecting **Model** shows model tools; opacity slider updates 3D STL opacity.
4. Global controls affect viewers:
   - View Mode changes 3D/NPR theme
   - 2D Lines toggles crosshairs
   - Visibility toggles hide/show overlays appropriately
   - Transparency affects 3D volume opacity
5. Export modal summarizes implants count and kit name; Confirm triggers packaging handshake.

### 17.2 Non-Functional

- No unresponsive UI on large DICOM (spinner/loader present)
- No console errors in production build

---

## 18. Test Plan (Manual + Automated Hooks)

### 18.1 Manual Test Cases

- **TC-01** Wizard validation: leave STL empty → Generate disabled; add file → enabled.
- **TC-02** Odontogram select multiple teeth → Unified Result shows implant on first tooth; user can reassign in inspector.
- **TC-03** Contextual toolbar: select Implant → icon set = {Add Implant, Parallel, Angle, Measure, Annotation, Density}; select Sleeve → icon set changes accordingly.
- **TC-04** Visibility toggles: turn off Nerves → NPR nerve markers hidden.
- **TC-05** Model opacity: set 0% → STL invisible in 3D.
- **TC-06** Apply Sleeve: click Apply → Sleeve shows “Applied ✓”.
- **TC-07** View mode: switch Bone → X-Ray → MIP → background/themes change in 3D/NPR.
- **TC-08** Export: opens modal; counts implants; shows kit; Confirm proceeds.
- **TC-09** Expert Mode: open; navigate steps; return; state persists.
- **TC-10** Error injection: simulate failed nerve detection → banner shows; manual add point remains available.

### 18.2 Automated (to add in codebase)

- Unit tests for reducers/state updates:
  - `updateImplant` modifies correct implant
  - `updateSleeve` flags applied
  - Visibility toggles update overlay flags
- Integration/UI (Playwright/Cypress):
  - Flow Wizard→Generate→Unified Result
  - Contextual toolbar switching on selection
  - Export modal content

---

## 19. Rollout & Migration

- Feature flag `implant_guide_easy_mode`
- Beta with 5–10 clinics for two weeks
- Collect telemetry, iterate icon order and labels if confusion detected
- GA after acceptance criteria met

---

## 20. Open Questions for Developer Clarification

1. Should **Make Parallel** choose reference implant by last-selected or prompt user?
2. Do we support **multi-implant generate** by default (one per selected tooth) or only the first tooth (current default)?
3. For **Depth Control**, do we compute drill stop as `implant.length + offset` or use vendor-specific mapping?
4. **Arch detection** rules for mixed upper/lower selections — confirm desired behavior.
5. **Export packaging** exact file list & JSON schema for 360 handoff.

---

## 21. Visual/Content Specs (Copy & Labels)

- Wizard:
  - “Easy Mode Wizard”
  - Section headers: “Patient”, “Files”, “Odontogram”
  - CTAs: “Generate”, “Cancel”
- Unified Result:
  - Top title: “Implant Planner”
  - “Tools” label for contextual row
  - Inspector section titles: “Implant #n”, “Guide Sleeve”, “Nerves”, “STL Model”, “Safety (Nerve distance)”
- Export modal:
  - Title: “Export to 360”
  - Body: “Package DICOM, STL, and planning to submit to lab on 360.”
  - Buttons: “Cancel”, “Proceed →”

---

## 22. Technical Notes & Integration Points

- Keep selection in a single source of truth (PlanState.selection)
- Contextual toolbar renders based on `selection.type`
- Global controls update `PlanState.viewMode`, `show2DLines`, `visibility`, `transparency`
- Overlays subscribe to PlanState; NPR/3D components re-render on state change
- Autosave after inspector edits; debounce (2s); persist to local project file or DB per platform conventions
- Export modal triggers packager with current PlanState snapshot and file paths

---

## 23. Acceptance Sign-Off Checklist

- [ ] Wizard validates required inputs and generates defaults
- [ ] Unified Result shows correct layout: Objects rail → Inspector → Viewers
- [ ] Contextual toolbar changes icons based on selection
- [ ] Each icon/action described above performs expected state change or tool-mode activation
- [ ] Global controls affect rendering as specified
- [ ] Export modal compiles accurate summary and triggers packaging
- [ ] Expert Mode accessible; round-trip preserves state
- [ ] Telemetry events fire with correct payloads
- [ ] No blocking performance or accessibility issues (basic keyboard, focus, tooltip)

---

## 24. Post-GA Enhancements (Backlog)

- Multi-implant planning heuristics (auto spacing, parallel groups)
- Vendor library integration for implant catalog & sleeves
- Advanced clipping/brightness/contrast tools in NPR
- Measurement history and report export
- Unit/Integration test harness & visual regression

---

## 25. Appendix — Icon Mapping Table

| Selection | Icon | Label            | Action                                 | Enable Conditions | Result                                            |
| --------- | ---- | ---------------- | -------------------------------------- | ----------------- | ------------------------------------------------- |
| Implant   | 🛠️  | Add Implant      | Create new implant at cursor/crosshair | Always            | Adds implant, selects it, creates default sleeve  |
| Implant   | 〰️   | Make Parallel    | Align axis with reference implant      | ≥2 implants       | Updates angles to match reference                 |
| Implant   | ∠    | Measure Angle    | Angle tool between axes/planes         | Always            | Shows angle overlay; annotation added             |
| Implant   | 📏   | Measurement      | Distance tool in NPR                   | Always            | Displays mm distance; stores transient annotation |
| Implant   | 💬   | Annotation       | Add text note                          | Always            | Adds editable annotation                          |
| Implant   | ◯    | Bone Density     | Toggle density overlay                 | Bone/X-Ray/MIP    | Heatmap overlay in NPR                            |
| Sleeve    | 🧰   | Select Kit       | Open kit selector                      | Always            | Updates sleeve.kit                                |
| Sleeve    | ⬚    | Apply Sleeve     | Apply current sleeve params            | Sleeve selected   | `applied=true`, status badge                      |
| Sleeve    | 📐   | Depth Control    | Toggle depth control                   | Always            | Calc drill stop; update totalDrill                |
| Nerves    | 🧠   | Detect Nerves    | Run detection                          | If none/stale     | Adds/updates nerve paths                          |
| Nerves    | ➕    | Add Point        | Manual nerve point                     | Always            | Adds control point at cursor                      |
| Nerves    | 〰    | Smooth Path      | Spline smooth                          | ≥3 points         | Smooths path                                      |
| Model     | ⚙️   | Optimize Fitting | ICP refine                             | Model loaded      | Improves match transform                          |
| Model     | ↺    | Rematch          | Re-run auto-match                      | Model + DICOM     | Recomputes alignment                              |
| Model     | 🔒   | Lock             | Lock transform                         | Always            | Prevents accidental move                          |

---

## 26. Deliverables

- Final UI spec (this PRD)
- Updated component inventory and icon assets (engineering to map to OS-native or custom font glyphs)
- Prototype reference (canvas “Atomica Easy Mode – Interactive Prototype (react)”)
- Telemetry event schema and dashboards (Product Analytics)

---

## 27. Dependencies

- Imaging SDK for NPR and 3D overlays
- Vendor kit library (static JSON for v1)
- Export packager and 360 integration endpoint
- State persistence (autosave) service

---

## 28. Risks & Mitigations

- **Mismatch with DS** → Frequent design QA check-ins; pixel review before code freeze
- **Performance on large DICOM** → Streaming tiles/lazy overlays; throttle redraws
- **User confusion on contextual tools** → Clear “Tools” label; tooltips; onboarding hints
- **Vendor mapping inaccuracies** → Locked set for v1; validated defaults; no destructive actions

---

## 29. Atomica Platform Overview (Context)

Atomica allows a dentist or dental lab technician to move from a patient’s 3D scan (DICOM) and oral model (STL) → all the way to a 3D-printed surgical guide used in implant surgery.

It’s composed of multiple integrated modules:

- Implant Planner → where the dentist plans implant positioning.
- Guide Design → used to design the physical 3D guide for drilling.
- Segmentation → used to isolate anatomical parts from the scan (like jawbone, teeth, nerves).
- Prosthetics AI (Beta) → for AI-generated crown/prosthetic designs.

Everything starts inside the Atomica Launcher, which manages patients and cases.

### 29.1 The Launcher (Home Screen)

When the user opens the desktop app, they see:

- A sidebar with all previously created patients.
- A main area with:
  - “Add New Patient” button
  - “Import Patient” option (to load existing data)
  - Patient data panel (once you select a patient)
  - “New Plan” button (to start planning a new procedure)
  - “Export Plans” (to send existing ones to lab)

This is the “home” of Atomica — from here, you enter specialized modules.

### 29.2 Creating a Patient & Loading Scans

When you click New Patient → Implant Guided Surgery, a pop-up appears asking you to:

- Upload a DICOM file (the 3D scan from the radiography lab).
- Enter patient data: Name, Gender, Birth Date.

After saving, Atomica opens a “Crop & Rotate” window where the dentist adjusts the scan to focus on the jaw region (cutting out unnecessary areas like vertebrae).

### 29.3 The Implant Planner Module

Once inside this module, you see:

- 3D skull view in the center-left area.
- 2D slice views on the right (Axial, Sagittal, Coronal).
- Left-side vertical toolbar with 5 main steps: Scan, Model, Planning, Sleeving, Export.

**Scan**

- Adjust brightness, contrast, and view modes (Bone / X-Ray / MIP).
- Import or hide DICOM layers, visualize anatomical structures.

**Model**

- Import STL (intraoral model).
- Auto-match to DICOM; fine-tune alignment (rematch, optimize fitting).

**Planning**

- Add implants, virtual teeth, fixation pins, or measurements.
- AI detects nerves automatically and highlights them.
- Select tooth number, choose implant vendor/size/angle/position.
- Views update in 3D and 2D slices for accuracy.

**Sleeving**

- Select surgical kit, guide type, sleeve type.
- System generates sleeve attached to implant in 3D.

**Export**

- Send data to 360 Lab portal; review case and order printed guide.

### 29.4 Easy Mode vs Expert Mode

- Easy Mode: Upload DICOM + STL, select teeth, click Generate. AI aligns model, detects nerves, creates implants and sleeves. Unified Window shows generated elements with manual tweak options. Toggle to Expert Mode for detailed workflow.
- Expert Mode: Original step-by-step process for granular control.

### 29.5 Contextual Toolbars

- Selection-dependent tools for implant, sleeve, nerve, and model objects, matching the contextual toolbar specification.

### 29.6 Visualization

- 3D view, 2D slices (Axial/Sagittal/Coronal) with overlays and adjustable transparency/clipping.

### 29.7 Output

- Export to 360 Lab Portal for review, report generation, and guide ordering.

### 29.8 Summary

Atomica is a digital treatment planning system for implant surgeries that integrates AI automation, 3D visualization, medical imaging, and CAD-CAM workflows to make implant dentistry faster, safer, and more accessible.

