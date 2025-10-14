const DEPOT_SECTIONS = [
  'Needs',
  'Working at heights',
  'System characteristics',
  'Components that require assistance',
  'Restrictions',
  'Hazards',
  'Delivery',
  'Office',
  'Boiler and controls',
  'Flue',
  'Pipe'
];

const WIZARD_STEPS = [
  {
    id: 'safety-access',
    title: '1) Safety & Access',
    optionSections: ['working_at_heights', 'hazards', 'delivery'],
    allowPhotos: false
  },
  {
    id: 'existing-system',
    title: '2) Existing System',
    optionSections: ['system_characteristics'],
    allowPhotos: true
  },
  {
    id: 'house-locations',
    title: '3) House & Locations',
    optionSections: ['needs']
  },
  {
    id: 'cupboard',
    title: '4) Cupboard',
    optionSections: []
  },
  {
    id: 'controls',
    title: '5) Controls',
    optionSections: ['boiler_and_controls']
  },
  {
    id: 'radiators-system',
    title: '6) Radiators & System',
    optionSections: ['pipe']
  },
  {
    id: 'new-system-choice',
    title: '7) New System Choice',
    optionSections: []
  },
  {
    id: 'flue',
    title: '8) Flue',
    optionSections: ['flue']
  },
  {
    id: 'extras',
    title: '9) Extras',
    optionSections: ['extras', 'office']
  }
];

const state = {
  optionsBySection: {},
  optionByCode: new Map(),
  mapping: {},
  pricebook: { items: [] },
  selectedCodes: new Map(),
  manualNotes: [],
  photos: [],
  arrowStyle: 'arrow',
  outputDirty: new Map(),
  outputAreas: new Map(),
  unmappedSelectionCodes: new Set(),
  selectedComponents: [],
  dataStatus: {
    options: false,
    mapping: false,
    pricebook: false
  }
};

const templates = {};

async function init() {
  cacheTemplates();
  await loadData();
  buildWizard();
  buildOutputsPanel();
  attachEventHandlers();
  refreshOutputs();
  updateConfigModal();
  registerServiceWorker();
}

document.addEventListener('DOMContentLoaded', init);

function cacheTemplates() {
  templates.wizardCard = document.getElementById('wizardCardTemplate');
  templates.optionRow = document.getElementById('optionRowTemplate');
  templates.outputTab = document.getElementById('outputTabTemplate');
  templates.outputPanel = document.getElementById('outputPanelTemplate');
  templates.photo = document.getElementById('photoTemplate');
}

async function loadData() {
  await Promise.all([
    loadOptionsTxt().then(() => { state.dataStatus.options = true; }).catch(() => { state.dataStatus.options = false; }),
    loadMapping().then(() => { state.dataStatus.mapping = true; }).catch(() => { state.dataStatus.mapping = false; }),
    loadPricebook().then(() => { state.dataStatus.pricebook = true; }).catch(() => { state.dataStatus.pricebook = false; })
  ]);
}

async function loadOptionsTxt() {
  const response = await fetch('data/options.txt');
  if (!response.ok) {
    throw new Error('Failed to load options.txt');
  }
  const text = await response.text();
  const lines = text.split(/\r?\n/);
  const sections = {};
  let currentSection = null;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    if (line.startsWith('[') && line.endsWith(']')) {
      currentSection = line.slice(1, -1);
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
      continue;
    }
    if (!currentSection) {
      continue;
    }
    const parts = line.split('|').map(part => part.trim());
    if (parts.length < 3) {
      continue;
    }
    const [code, category, ...specificParts] = parts;
    const specific = specificParts.join(' | ').trim();
    const entry = { code, category, specific, sectionSlug: currentSection };
    sections[currentSection].push(entry);
    state.optionByCode.set(code, entry);
  }
  state.optionsBySection = sections;
}

async function loadMapping() {
  const response = await fetch('data/mapping.json');
  if (!response.ok) {
    throw new Error('Failed to load mapping.json');
  }
  state.mapping = await response.json();
}

async function loadPricebook() {
  const response = await fetch('data/pricebook.json');
  if (!response.ok) {
    throw new Error('Failed to load pricebook.json');
  }
  const payload = await response.json();
  if (Array.isArray(payload)) {
    state.pricebook.items = payload;
  } else if (Array.isArray(payload.items)) {
    state.pricebook.items = payload.items;
  } else {
    state.pricebook.items = [];
  }
}

function buildWizard() {
  const wizardContainer = document.getElementById('wizardSteps');
  wizardContainer.innerHTML = '';
  for (const step of WIZARD_STEPS) {
    const card = templates.wizardCard.content.firstElementChild.cloneNode(true);
    const titleEl = card.querySelector('.wizard-card-title');
    titleEl.textContent = step.title;
    const bodyEl = card.querySelector('.wizard-card-body');

    if (step.optionSections && step.optionSections.length) {
      for (const sectionSlug of step.optionSections) {
        const options = state.optionsBySection[sectionSlug] || [];
        if (!options.length) {
          continue;
        }
        const sectionHeader = document.createElement('h3');
        sectionHeader.textContent = prettifySectionSlug(sectionSlug);
        sectionHeader.className = 'wizard-subheading';
        bodyEl.appendChild(sectionHeader);

        const listEl = document.createElement('div');
        listEl.className = 'option-list';
        for (const option of options) {
          const row = templates.optionRow.content.firstElementChild.cloneNode(true);
          const input = row.querySelector('input');
          const codeEl = row.querySelector('.option-code');
          const specificEl = row.querySelector('.option-specific');
          input.dataset.code = option.code;
          input.dataset.section = sectionSlug;
          input.addEventListener('change', handleOptionToggle);
          row.dataset.code = option.code;
          codeEl.textContent = option.code;
          specificEl.textContent = option.specific;
          listEl.appendChild(row);
        }
        bodyEl.appendChild(listEl);
      }
    }

    if (step.allowPhotos) {
      const photoBlock = buildPhotoCaptureBlock();
      bodyEl.appendChild(photoBlock);
    }

    const manualBlock = buildManualNoteBlock(step.id);
    bodyEl.appendChild(manualBlock);

    wizardContainer.appendChild(card);
  }
}

function buildPhotoCaptureBlock() {
  const wrapper = document.createElement('div');
  wrapper.className = 'photo-capture';
  const label = document.createElement('label');
  label.className = 'pill photo-input';
  label.textContent = 'Add photo (camera or library)';
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  input.multiple = true;
  input.addEventListener('change', handlePhotoInput);
  label.appendChild(input);
  wrapper.appendChild(label);
  const thumbs = document.createElement('div');
  thumbs.className = 'photo-thumbs';
  thumbs.id = 'photoThumbs';
  wrapper.appendChild(thumbs);
  return wrapper;
}

function buildManualNoteBlock(stepId) {
  const block = document.createElement('div');
  block.className = 'manual-note-form';
  const heading = document.createElement('h3');
  heading.textContent = 'Manual notes';
  block.appendChild(heading);
  const textarea = document.createElement('textarea');
  textarea.placeholder = 'Add a site-specific note';
  textarea.rows = 3;
  const select = document.createElement('select');
  for (const section of DEPOT_SECTIONS) {
    const option = document.createElement('option');
    option.value = section;
    option.textContent = section;
    select.appendChild(option);
  }
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'pill';
  addBtn.textContent = 'Add manual note';
  addBtn.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) {
      return;
    }
    addManualNote({
      text,
      depotSection: select.value,
      sourceStep: stepId
    });
    textarea.value = '';
  });
  block.appendChild(textarea);
  block.appendChild(select);
  block.appendChild(addBtn);

  const list = document.createElement('div');
  list.className = 'manual-notes-list';
  list.dataset.stepId = stepId;
  block.appendChild(list);
  return block;
}

function handleOptionToggle(event) {
  const input = event.currentTarget;
  const code = input.dataset.code;
  if (!code) {
    return;
  }
  if (input.checked) {
    selectCode(code);
  } else {
    deselectCode(code);
  }
  updateOptionRowState(code, input.checked);
  refreshOutputs();
  updateConfigBadge();
}

function updateOptionRowState(code, checked) {
  const rows = document.querySelectorAll(`.option-row[data-code="${code}"]`);
  rows.forEach(row => {
    const checkbox = row.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = checked;
    }
    row.classList.toggle('checked', checked);
  });
}

function selectCode(code) {
  const option = state.optionByCode.get(code);
  const timestamp = Date.now();
  if (option) {
    state.selectedCodes.set(code, {
      code,
      specific: option.specific,
      category: option.category,
      sectionSlug: option.sectionSlug,
      selectedAt: timestamp
    });
  } else {
    state.selectedCodes.set(code, {
      code,
      specific: code,
      category: 'Unknown',
      sectionSlug: 'manual',
      selectedAt: timestamp
    });
  }
  if (!state.mapping[code]) {
    state.unmappedSelectionCodes.add(code);
  }
}

function deselectCode(code) {
  state.selectedCodes.delete(code);
  state.unmappedSelectionCodes.delete(code);
}

function addManualNote({ text, depotSection, sourceStep }) {
  const trimmed = collapseSpaces(text);
  if (!trimmed) {
    return;
  }
  const note = {
    id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text: trimmed,
    depotSection,
    createdAt: Date.now(),
    sourceStep: sourceStep || 'outputs'
  };
  state.manualNotes.push(note);
  renderManualNotes();
  refreshOutputs();
}

function removeManualNote(noteId) {
  state.manualNotes = state.manualNotes.filter(note => note.id !== noteId);
  renderManualNotes();
  refreshOutputs();
}

function renderManualNotes() {
  const lists = document.querySelectorAll('.manual-notes-list');
  lists.forEach(list => { list.innerHTML = ''; });
  for (const note of state.manualNotes) {
    const list = document.querySelector(`.manual-notes-list[data-step-id="${note.sourceStep}"]`);
    if (!list) {
      continue;
    }
    const chip = document.createElement('div');
    chip.className = 'manual-note-chip';
    const text = document.createElement('span');
    text.textContent = `${note.depotSection}: ${note.text}`;
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'pill';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => removeManualNote(note.id));
    chip.appendChild(text);
    chip.appendChild(removeBtn);
    list.appendChild(chip);
  }
}

function buildOutputsPanel() {
  const tabsContainer = document.getElementById('outputsTabs');
  const contentContainer = document.getElementById('outputsContent');
  tabsContainer.innerHTML = '';
  contentContainer.innerHTML = '';
  DEPOT_SECTIONS.forEach((section, index) => {
    const tab = templates.outputTab.content.firstElementChild.cloneNode(true);
    tab.textContent = section;
    tab.dataset.section = section;
    tab.addEventListener('click', () => setActiveOutputSection(section));
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.hidden = true;
    tab.appendChild(badge);
    tabsContainer.appendChild(tab);

    const panel = templates.outputPanel.content.firstElementChild.cloneNode(true);
    panel.dataset.section = section;
    const textarea = panel.querySelector('.output-text');
    textarea.addEventListener('input', () => {
      state.outputDirty.set(section, true);
    });
    const preview = panel.querySelector('.output-preview');
    const copyBtn = panel.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => copySection(section));
    panel.querySelector('.clear-btn').addEventListener('click', () => {
      textarea.value = '';
      state.outputDirty.set(section, true);
      preview.textContent = '';
    });
    panel.querySelector('.note-btn').addEventListener('click', () => {
      const manualText = prompt(`Add manual note for ${section}`);
      if (manualText) {
        addManualNote({ text: manualText, depotSection: section, sourceStep: 'outputs' });
      }
    });
    panel.querySelector('.rebuild-btn').addEventListener('click', () => {
      state.outputDirty.set(section, false);
      refreshOutputs();
    });
    contentContainer.appendChild(panel);
    state.outputAreas.set(section, { tab, panel, textarea, preview, badge });
    state.outputDirty.set(section, false);
  });
  if (DEPOT_SECTIONS.length) {
    setActiveOutputSection(DEPOT_SECTIONS[0]);
  }
}

function setActiveOutputSection(section) {
  for (const [name, area] of state.outputAreas.entries()) {
    const isActive = name === section;
    area.tab.classList.toggle('active', isActive);
    area.panel.classList.toggle('active', isActive);
  }
}

function buildDepotOutputs() {
  const outputs = {};
  DEPOT_SECTIONS.forEach(section => {
    outputs[section] = [];
  });
  const arrow = state.arrowStyle === 'dash' ? '- ' : '↘️ ';
  const selections = Array.from(state.selectedCodes.values())
    .sort((a, b) => a.selectedAt - b.selectedAt);
  for (const selection of selections) {
    const depotSection = state.mapping[selection.code];
    if (!depotSection || !outputs[depotSection]) {
      continue;
    }
    const line = `${arrow}${selection.specific.replace(/\s+/g, ' ').trim()};`;
    if (!outputs[depotSection].includes(line)) {
      outputs[depotSection].push(line);
    }
  }
  const manualNotes = state.manualNotes
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt);
  for (const note of manualNotes) {
    if (!outputs[note.depotSection]) {
      outputs[note.depotSection] = [];
    }
    const line = `${arrow}${note.text.replace(/\s+/g, ' ').trim()};`;
    outputs[note.depotSection].push(line);
  }
  if (state.selectedComponents.length) {
    const officeLines = outputs['Office'] || [];
    for (const component of state.selectedComponents) {
      const text = `${arrow}Component: ${component.name} [${component.code}] price ${component.price};`;
      officeLines.push(text);
    }
    outputs['Office'] = officeLines;
  }
  return outputs;
}

function refreshOutputs() {
  const outputs = buildDepotOutputs();
  state.currentOutputs = outputs;
  for (const [section, area] of state.outputAreas.entries()) {
    const lines = outputs[section] || [];
    const generatedText = lines.join('\n');
    area.preview.textContent = generatedText;
    const isDirty = state.outputDirty.get(section);
    if (!isDirty) {
      area.textarea.value = generatedText;
    }
    const empty = lines.length === 0;
    area.tab.classList.toggle('empty', empty);
    if (area.badge) {
      area.badge.textContent = '●';
      area.badge.hidden = !empty;
    }
  }
}

async function copySection(section) {
  const area = state.outputAreas.get(section);
  if (!area) return;
  try {
    await navigator.clipboard.writeText(area.textarea.value);
    area.tab.classList.add('copied');
    setTimeout(() => area.tab.classList.remove('copied'), 1200);
  } catch (error) {
    console.error('Clipboard copy failed', error);
  }
}

function attachEventHandlers() {
  document.getElementById('resetButton').addEventListener('click', resetApp);
  document.getElementById('configButton').addEventListener('click', openConfig);
  document.getElementById('closeConfig').addEventListener('click', closeConfig);
  document.getElementById('exportZipButton').addEventListener('click', exportZip);
  document.getElementById('exportPdfButton').addEventListener('click', exportPdf);
  document.getElementById('arrowToggle').addEventListener('change', event => {
    state.arrowStyle = event.target.checked ? 'dash' : 'arrow';
    refreshOutputs();
  });
  document.getElementById('componentSearch').addEventListener('input', event => {
    renderComponentResults(event.target.value);
  });
  document.getElementById('gptSummaryButton').addEventListener('click', () => {
    const summary = buildGptCustomerSummary({
      selections: Array.from(state.selectedCodes.values()),
      manualNotes: state.manualNotes.slice(),
      components: state.selectedComponents.slice()
    });
    document.getElementById('customerSummaryBox').value = summary;
  });
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeConfig();
    }
  });
  updateConfigBadge();
  renderComponentResults('');
  renderSelectedComponents();
}

function openConfig() {
  updateConfigModal();
  const modal = document.getElementById('configModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeConfig() {
  const modal = document.getElementById('configModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function updateConfigModal() {
  const statusList = document.getElementById('dataStatusList');
  statusList.innerHTML = '';
  const entries = [
    { label: 'Options file', ok: state.dataStatus.options },
    { label: 'Mapping file', ok: state.dataStatus.mapping },
    { label: 'Pricebook file', ok: state.dataStatus.pricebook }
  ];
  for (const entry of entries) {
    const li = document.createElement('li');
    li.textContent = `${entry.label}: ${entry.ok ? 'loaded' : 'missing'}`;
    li.className = entry.ok ? 'ok' : 'error';
    statusList.appendChild(li);
  }
  const unmappedList = document.getElementById('unmappedCodesList');
  unmappedList.innerHTML = '';
  const unmappedOptions = getUnmappedOptionCodes();
  const message = document.getElementById('unmappedCodesMessage');
  if (!unmappedOptions.length) {
    message.textContent = 'All option codes have a mapping.';
  } else {
    message.textContent = 'The following option codes have no mapping:';
  }
  for (const code of unmappedOptions) {
    const li = document.createElement('li');
    li.textContent = code;
    li.className = state.unmappedSelectionCodes.has(code) ? 'error' : '';
    unmappedList.appendChild(li);
  }
  const toggle = document.getElementById('arrowToggle');
  toggle.checked = state.arrowStyle === 'dash';
  renderComponentResults(document.getElementById('componentSearch').value || '');
  renderSelectedComponents();
}

function getUnmappedOptionCodes() {
  const codes = [];
  for (const code of state.optionByCode.keys()) {
    if (!state.mapping[code]) {
      codes.push(code);
    }
  }
  return codes.sort();
}

function updateConfigBadge() {
  const configBtn = document.getElementById('configButton');
  let badge = configBtn.querySelector('.badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'badge';
    configBtn.appendChild(badge);
  }
  const count = state.unmappedSelectionCodes.size;
  badge.textContent = count ? String(count) : '';
  badge.hidden = count === 0;
}

function collapseSpaces(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function prettifySectionSlug(slug) {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

async function handlePhotoInput(event) {
  const files = Array.from(event.target.files || []);
  for (const file of files) {
    const processed = await compressImage(file);
    if (!processed) {
      continue;
    }
    const photo = {
      id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      originalName: file.name || 'photo.jpg',
      blob: processed.blob,
      dataUrl: processed.dataUrl,
      width: processed.width,
      height: processed.height,
      createdAt: Date.now()
    };
    state.photos.push(photo);
  }
  renderPhotos();
  event.target.value = '';
}

function renderPhotos() {
  const container = document.getElementById('photoThumbs');
  if (!container) return;
  container.innerHTML = '';
  for (const photo of state.photos) {
    const thumb = templates.photo.content.firstElementChild.cloneNode(true);
    const img = thumb.querySelector('img');
    img.src = photo.dataUrl;
    img.alt = `Survey photo ${new Date(photo.createdAt).toLocaleString()}`;
    const removeBtn = thumb.querySelector('.remove-photo');
    removeBtn.addEventListener('click', () => {
      state.photos = state.photos.filter(item => item.id !== photo.id);
      renderPhotos();
    });
    container.appendChild(thumb);
  }
}

async function compressImage(file) {
  const blob = file;
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.src = url;
  await image.decode();
  const maxDim = 1600;
  let { width, height } = image;
  if (width > height) {
    if (width > maxDim) {
      height = Math.round(height * (maxDim / width));
      width = maxDim;
    }
  } else {
    if (height > maxDim) {
      width = Math.round(width * (maxDim / height));
      height = maxDim;
    }
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  ctx.drawImage(image, 0, 0, width, height);
  const blobOut = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.7));
  URL.revokeObjectURL(url);
  if (!blobOut) {
    return null;
  }
  const dataUrl = await new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blobOut);
  });
  return { blob: blobOut, dataUrl, width, height };
}

function resetApp() {
  if (!confirm('Reset all selections and notes?')) {
    return;
  }
  for (const code of Array.from(state.selectedCodes.keys())) {
    updateOptionRowState(code, false);
  }
  state.selectedCodes.clear();
  state.manualNotes = [];
  state.photos = [];
  state.selectedComponents = [];
  state.unmappedSelectionCodes.clear();
  state.outputDirty = new Map();
  renderManualNotes();
  renderPhotos();
  renderSelectedComponents();
  refreshOutputs();
  updateConfigBadge();
}

async function exportZip() {
  const zip = new JSZip();
  const outputs = buildDepotOutputs();
  for (const section of DEPOT_SECTIONS) {
    const lines = outputs[section] || [];
    const text = lines.join('\n');
    zip.file(`export/depots/${section}.txt`, text);
  }
  const selectionPayload = {
    generatedAt: new Date().toISOString(),
    jobReference: document.getElementById('jobReferenceInput').value || '',
    arrowStyle: state.arrowStyle,
    selections: Array.from(state.selectedCodes.values()).map(item => ({
      code: item.code,
      selectedAt: item.selectedAt
    })),
    manualNotes: state.manualNotes.map(note => ({
      text: note.text,
      depotSection: note.depotSection,
      createdAt: note.createdAt,
      sourceStep: note.sourceStep
    })),
    components: state.selectedComponents
  };
  zip.file('export/selections.json', JSON.stringify(selectionPayload, null, 2));
  zip.file('export/components.json', JSON.stringify({ items: state.selectedComponents }, null, 2));
  let index = 1;
  for (const photo of state.photos) {
    const name = photo.originalName || `photo-${index}.jpg`;
    zip.file(`export/photos/${index}-${name}`, photo.blob);
    index += 1;
  }
  try {
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, `depot-notes-${Date.now()}.zip`, 'application/zip');
  } catch (error) {
    console.error('ZIP export failed', error);
  }
}

async function exportPdf() {
  const outputs = buildDepotOutputs();
  const pdf = new jspdf.jsPDF();
  const marginLeft = 15;
  let y = 20;
  pdf.setFontSize(16);
  pdf.text('Depot Summary', marginLeft, y);
  y += 8;
  pdf.setFontSize(11);
  const reference = document.getElementById('jobReferenceInput').value || 'Not provided';
  pdf.text(`Generated: ${new Date().toLocaleString()}`, marginLeft, y);
  y += 6;
  pdf.text(`Job reference: ${reference}`, marginLeft, y);
  y += 10;
  for (const section of DEPOT_SECTIONS) {
    if (y > 260) {
      break;
    }
    pdf.setFontSize(13);
    pdf.text(section, marginLeft, y);
    y += 6;
    pdf.setFontSize(10);
    const lines = outputs[section] && outputs[section].length ? outputs[section] : ['(No notes recorded)'];
    outer: for (const line of lines) {
      const wrapped = wrapLine(line, 90);
      for (const subLine of wrapped) {
        if (y > 260) {
          break outer;
        }
        pdf.text(subLine, marginLeft + 3, y);
        y += 5;
      }
    }
    y += 4;
  }
  if (state.photos.length && y < 260) {
    pdf.setFontSize(13);
    pdf.text('Photos', marginLeft, y);
    y += 6;
    let x = marginLeft;
    const maxWidth = 60;
    const maxHeight = 45;
    for (const photo of state.photos) {
      const aspect = photo.width / photo.height;
      let drawWidth = maxWidth;
      let drawHeight = drawWidth / aspect;
      if (drawHeight > maxHeight) {
        drawHeight = maxHeight;
        drawWidth = drawHeight * aspect;
      }
      if (x + drawWidth > 180) {
        x = marginLeft;
        y += maxHeight + 6;
      }
      if (y + drawHeight > 280) {
        break;
      }
      pdf.addImage(photo.dataUrl, 'JPEG', x, y, drawWidth, drawHeight, {
        pixelWidth: photo.width,
        pixelHeight: photo.height
      });
      x += drawWidth + 8;
    }
  }
  const blob = pdf.output('blob');
  downloadBlob(blob, `depot-summary-${Date.now()}.pdf`, 'application/pdf');
}

function wrapLine(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      if (current) {
        lines.push(current.trim());
      }
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) {
    lines.push(current.trim());
  }
  return lines.length ? lines : [''];
}

function downloadBlob(blob, filename, mime) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

function renderComponentResults(query) {
  const container = document.getElementById('componentResults');
  if (!container) return;
  container.innerHTML = '';
  const normalized = (query || '').trim().toLowerCase();
  const items = state.pricebook.items || [];
  const filtered = normalized
    ? items.filter(item => {
        const hay = `${item.code} ${item.name} ${item.category || ''}`.toLowerCase();
        return hay.includes(normalized);
      })
    : items.slice(0, 20);
  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.textContent = normalized ? 'No components match that search.' : 'Pricebook is empty.';
    empty.className = 'hint';
    container.appendChild(empty);
    return;
  }
  for (const item of filtered) {
    const row = document.createElement('div');
    row.className = 'component-row';
    const details = document.createElement('div');
    details.innerHTML = `<strong>${item.name}</strong><br><small>${item.code} • ${item.category || 'Uncategorised'} • ${item.price || 'TBC'}</small>`;
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'pill';
    const exists = state.selectedComponents.some(component => component.code === item.code);
    addBtn.textContent = exists ? 'Added' : 'Add';
    addBtn.disabled = exists;
    addBtn.addEventListener('click', () => {
      addComponent(item);
    });
    row.appendChild(details);
    row.appendChild(addBtn);
    container.appendChild(row);
  }
}

function addComponent(item) {
  if (state.selectedComponents.some(component => component.code === item.code)) {
    return;
  }
  state.selectedComponents.push({
    code: item.code,
    name: item.name,
    price: item.price,
    category: item.category,
    addedAt: Date.now()
  });
  renderSelectedComponents();
  refreshOutputs();
}

function renderSelectedComponents() {
  const list = document.getElementById('selectedComponentsList');
  if (!list) return;
  list.innerHTML = '';
  if (!state.selectedComponents.length) {
    const empty = document.createElement('li');
    empty.textContent = 'No components selected.';
    empty.className = 'hint';
    list.appendChild(empty);
    return;
  }
  for (const component of state.selectedComponents) {
    const li = document.createElement('li');
    const info = document.createElement('span');
    info.textContent = `${component.name} [${component.code}] price ${component.price}`;
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'pill';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      state.selectedComponents = state.selectedComponents.filter(item => item.code !== component.code);
      renderSelectedComponents();
      refreshOutputs();
    });
    li.appendChild(info);
    li.appendChild(removeBtn);
    list.appendChild(li);
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.register('sw.js').catch(error => {
      console.warn('Service worker registration failed', error);
    });
  }
}

// Placeholder for GPT summary integration
export function buildGptCustomerSummary() {
  return 'Summary coming soon. This placeholder will be replaced by GPT output.';
}

if (typeof window !== 'undefined') {
  window.buildGptCustomerSummary = buildGptCustomerSummary;
}

