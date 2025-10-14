const ACCESS_OPTIONS = [
  {
    id: 'scaffold-tower',
    label: 'Scaffold tower',
    description: 'Freestanding platform for multi-storey work.',
    icon: `<svg viewBox="0 0 80 80" role="img" aria-hidden="true"><rect x="14" y="16" width="52" height="4" rx="2"/><rect x="14" y="36" width="52" height="4" rx="2"/><rect x="14" y="56" width="52" height="4" rx="2"/><rect x="18" y="16" width="4" height="48" rx="2"/><rect x="58" y="16" width="4" height="48" rx="2"/><rect x="28" y="24" width="4" height="32" rx="2"/><rect x="48" y="24" width="4" height="32" rx="2"/></svg>`
  },
  {
    id: 'ladders',
    label: 'Ladders',
    description: 'Standard ladders to access the work area.',
    icon: `<svg viewBox="0 0 80 80" role="img" aria-hidden="true"><rect x="24" y="14" width="6" height="52" rx="3"/><rect x="50" y="14" width="6" height="52" rx="3"/><rect x="26" y="18" width="28" height="4" rx="2"/><rect x="26" y="28" width="28" height="4" rx="2"/><rect x="26" y="38" width="28" height="4" rx="2"/><rect x="26" y="48" width="28" height="4" rx="2"/><rect x="26" y="58" width="28" height="4" rx="2"/></svg>`
  },
  {
    id: 'cherry-picker',
    label: 'Cherry picker',
    description: 'Mobile elevating work platform required.',
    icon: `<svg viewBox="0 0 80 80" role="img" aria-hidden="true"><rect x="14" y="54" width="52" height="12" rx="6"/><rect x="22" y="38" width="10" height="16" rx="4"/><rect x="48" y="22" width="12" height="18" rx="4"/><path d="M32 44 L48 28" stroke-width="6" stroke-linecap="round" stroke="currentColor" fill="none"/></svg>`
  },
  {
    id: 'roof-guard',
    label: 'Roof guard',
    description: 'Edge protection for roof level work.',
    icon: `<svg viewBox="0 0 80 80" role="img" aria-hidden="true"><rect x="14" y="48" width="52" height="6" rx="3"/><rect x="20" y="28" width="6" height="20" rx="3"/><rect x="54" y="28" width="6" height="20" rx="3"/><rect x="20" y="28" width="40" height="6" rx="3"/><rect x="20" y="36" width="40" height="6" rx="3"/></svg>`
  }
];

const BOILER_OPTIONS = [
  { id: 'regular', label: 'Regular', description: 'Open vented boiler with tanks in the loft.' },
  { id: 'system', label: 'System', description: 'Sealed system with cylinder but no loft tanks.' },
  { id: 'combi', label: 'Combi', description: 'Combination boiler with instant hot water.' },
  { id: 'storage-combi', label: 'Storage combi', description: 'Combination boiler with built-in storage.' },
  { id: 'warm-air', label: 'Warm air', description: 'Ducted warm air unit providing heating.' },
  { id: 'none', label: 'None', description: 'No boiler currently installed.' }
];

const NEW_BOILER_OPTIONS = [
  { id: 'new-regular', label: 'Regular', description: 'Traditional open vented boiler.' },
  { id: 'new-system', label: 'System', description: 'Pressurised system with separate cylinder.' },
  { id: 'new-combi', label: 'Combi', description: 'Combination boiler for instant hot water.' }
];

const FLUE_TYPES = [
  { id: 'balanced', label: 'Balanced', description: 'Twin wall with natural draft.' },
  { id: 'fanned', label: 'Fanned', description: 'Room sealed with fan assisted exhaust.' },
  { id: 'side', label: 'Side flue', description: 'Leaves the property via the side elevation.' },
  { id: 'rear', label: 'Rear flue', description: 'Leaves the property directly behind the boiler.' }
];

const FLUE_EXIT_POINTS = [
  { id: 'wall', label: 'Wall', description: 'Horizontal flue terminal through a wall.' },
  { id: 'roof-flat', label: 'Flat roof', description: 'Exits vertically through a flat roof.' },
  { id: 'roof-pitched', label: 'Pitched roof', description: 'Exits vertically through a pitched roof.' }
];

const NEW_FLUE_DIRECTIONS = [
  { id: 'new-flue-left', label: 'Left run', description: 'Flue routed towards the left elevation.', icon: createFlueDirectionIcon('left') },
  { id: 'new-flue-right', label: 'Right run', description: 'Flue routed towards the right elevation.', icon: createFlueDirectionIcon('right') },
  { id: 'new-flue-up', label: 'Upward run', description: 'Flue rises vertically from the boiler.', icon: createFlueDirectionIcon('up') },
  { id: 'new-flue-down', label: 'Downward run', description: 'Flue drops to reach the terminal.', icon: createFlueDirectionIcon('down') }
];

const LOCATION_SPOTS = [
  { id: 'kitchen', label: 'Kitchen', top: 62, left: 32 },
  { id: 'garage', label: 'Garage', top: 70, left: 16 },
  { id: 'utility-room', label: 'Utility', top: 68, left: 47 },
  { id: 'loft', label: 'Loft', top: 30, left: 50 },
  { id: 'airing-cupboard', label: 'Airing cupboard', top: 58, left: 65 },
  { id: 'dining-room', label: 'Dining room', top: 72, left: 78 },
  { id: 'bedroom', label: 'Bedroom', top: 42, left: 72 },
  { id: 'lounge', label: 'Lounge', top: 62, left: 90 }
];

const FLUE_COMPONENT_LIBRARY = [
  {
    id: 'extension',
    label: '1 m extension',
    icon: `<svg viewBox="0 0 80 32" role="img" aria-hidden="true"><rect x="12" y="14" width="56" height="4" rx="2" fill="currentColor"/></svg>`
  },
  {
    id: 'bend45',
    label: '45° bend',
    icon: `<svg viewBox="0 0 80 80" role="img" aria-hidden="true"><path d="M22 58 L58 22" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>`
  },
  {
    id: 'bend90',
    label: '90° bend',
    icon: `<svg viewBox="0 0 80 80" role="img" aria-hidden="true"><path d="M24 56 L24 28 L52 28" stroke="currentColor" stroke-width="6" stroke-linecap="round" fill="none"/></svg>`
  }
];

const FLUE_COMPONENT_MAP = new Map(FLUE_COMPONENT_LIBRARY.map(component => [component.id, component]));
const FLUE_START_ICON = `<svg viewBox="0 0 80 80" role="img" aria-hidden="true"><rect x="26" y="26" width="28" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="4"/><path d="M40 26 V12" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>`;

const state = {
  access: new Set(),
  boilerType: '',
  flueType: '',
  flueExit: '',
  location: '',
  newBoilerLocation: '',
  newBoilerType: '',
  newFlueDirection: '',
  flueRoute: []
};

const labelLookup = new Map([
  ...ACCESS_OPTIONS.map(option => [option.id, option.label]),
  ...BOILER_OPTIONS.map(option => [option.id, option.label]),
  ...NEW_BOILER_OPTIONS.map(option => [option.id, option.label]),
  ...FLUE_TYPES.map(option => [option.id, option.label]),
  ...FLUE_EXIT_POINTS.map(option => [option.id, option.label]),
  ...NEW_FLUE_DIRECTIONS.map(option => [option.id, option.label]),
  ...LOCATION_SPOTS.map(option => [option.id, option.label])
]);

document.addEventListener('DOMContentLoaded', () => {
  renderAccessOptions();
  renderBoilerOptions();
  renderFlueOptions();
  renderHotspotGroup('houseHotspots', 'location');
  renderHotspotGroup('newHouseHotspots', 'newBoilerLocation');
  renderNewBoilerOptions();
  renderNewFlueDirections();
  initFlueBuilder();
  updateSummary();
  document.getElementById('resetSelections').addEventListener('click', resetSurvey);
});

function renderAccessOptions() {
  const container = document.getElementById('accessGrid');
  container.innerHTML = '';
  ACCESS_OPTIONS.forEach(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-card';
    button.dataset.optionId = option.id;
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `
      <div class="option-icon">${option.icon}</div>
      <strong>${option.label}</strong>
      <span>${option.description}</span>
    `;
    button.addEventListener('click', () => toggleAccessOption(option.id));
    container.appendChild(button);
  });
}

function renderBoilerOptions() {
  const container = document.getElementById('boilerChoices');
  container.innerHTML = '';
  BOILER_OPTIONS.forEach(option => {
    const tile = createRadioTile('boiler', option, selectedId => {
      state.boilerType = selectedId;
      syncChoiceTiles(container, selectedId);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncChoiceTiles(container, state.boilerType);
}

function renderFlueOptions() {
  const typeGroup = document.querySelector('#flueTypeGroup .choice-group');
  const exitGroup = document.querySelector('#flueExitGroup .choice-group');
  typeGroup.innerHTML = '';
  exitGroup.innerHTML = '';

  FLUE_TYPES.forEach(option => {
    const tile = createRadioTile('flue-type', option, selectedId => {
      state.flueType = selectedId;
      syncChoiceTiles(typeGroup, selectedId);
      updateSummary();
    });
    typeGroup.appendChild(tile);
  });
  syncChoiceTiles(typeGroup, state.flueType);

  FLUE_EXIT_POINTS.forEach(option => {
    const tile = createRadioTile('flue-exit', option, selectedId => {
      state.flueExit = selectedId;
      syncChoiceTiles(exitGroup, selectedId);
      updateSummary();
    });
    exitGroup.appendChild(tile);
  });
  syncChoiceTiles(exitGroup, state.flueExit);
}

function renderNewBoilerOptions() {
  const container = document.getElementById('newBoilerChoices');
  if (!container) return;
  container.innerHTML = '';
  NEW_BOILER_OPTIONS.forEach(option => {
    const tile = createRadioTile('new-boiler', option, selectedId => {
      state.newBoilerType = selectedId;
      syncChoiceTiles(container, selectedId);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncChoiceTiles(container, state.newBoilerType);
}

function renderNewFlueDirections() {
  const container = document.getElementById('newFlueDirectionChoices');
  if (!container) return;
  container.innerHTML = '';
  NEW_FLUE_DIRECTIONS.forEach(option => {
    const tile = createRadioTile('new-flue-direction', option, selectedId => {
      state.newFlueDirection = selectedId;
      syncChoiceTiles(container, selectedId);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncChoiceTiles(container, state.newFlueDirection);
}

function renderHotspotGroup(containerId, stateKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  LOCATION_SPOTS.forEach(spot => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'hotspot';
    button.textContent = spot.label;
    button.style.top = `${spot.top}%`;
    button.style.left = `${spot.left}%`;
    button.dataset.locationId = spot.id;
    button.addEventListener('click', () => {
      if (state[stateKey] === spot.id) {
        state[stateKey] = '';
      } else {
        state[stateKey] = spot.id;
      }
      syncHotspots(container, state[stateKey]);
      updateSummary();
    });
    container.appendChild(button);
  });
  syncHotspots(container, state[stateKey]);
}

function createRadioTile(groupName, option, onSelect) {
  const tile = document.createElement('div');
  tile.className = 'choice-tile';
  const inputId = `${groupName}-${option.id}`;
  tile.innerHTML = `
    <input type="radio" name="${groupName}" id="${inputId}" value="${option.id}">
    <label for="${inputId}">
      ${option.icon ? `<span class="tile-icon">${option.icon}</span>` : ''}
      <span class="tile-copy">
        <strong>${option.label}</strong>
        ${option.description ? `<span>${option.description}</span>` : ''}
      </span>
    </label>
  `;
  const input = tile.querySelector('input');
  input.addEventListener('change', () => {
    onSelect(option.id);
  });
  return tile;
}

function toggleAccessOption(optionId) {
  if (state.access.has(optionId)) {
    state.access.delete(optionId);
  } else {
    state.access.add(optionId);
  }
  syncAccessCards();
  updateSummary();
}

function syncAccessCards() {
  const buttons = document.querySelectorAll('#accessGrid .option-card');
  buttons.forEach(button => {
    const optionId = button.dataset.optionId;
    const selected = state.access.has(optionId);
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
}

function syncChoiceTiles(container, selectedId) {
  const tiles = container.querySelectorAll('.choice-tile');
  tiles.forEach(tile => {
    const input = tile.querySelector('input');
    const isSelected = input.value === selectedId;
    tile.classList.toggle('selected', isSelected);
    input.checked = isSelected;
  });
}

function syncHotspots(container, selectedId) {
  if (!container) return;
  container.querySelectorAll('.hotspot').forEach(button => {
    const selected = button.dataset.locationId === selectedId;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-selected', selected ? 'true' : 'false');
  });
}

function updateSummary() {
  const summaryList = document.getElementById('summaryList');
  const accessList = Array.from(state.access).map(id => labelLookup.get(id));
  const routeList = state.flueRoute.map(id => FLUE_COMPONENT_MAP.get(id)?.label || id);
  summaryList.innerHTML = '';

  const summaryItems = [
    {
      label: 'Access equipment',
      value: accessList.length ? accessList.join(', ') : 'Not recorded'
    },
    {
      label: 'Existing boiler',
      value: state.boilerType ? labelLookup.get(state.boilerType) : 'Not recorded'
    },
    {
      label: 'Flue type',
      value: state.flueType ? labelLookup.get(state.flueType) : 'Not recorded'
    },
    {
      label: 'Flue exit point',
      value: state.flueExit ? labelLookup.get(state.flueExit) : 'Not recorded'
    },
    {
      label: 'New boiler location',
      value: state.newBoilerLocation ? labelLookup.get(state.newBoilerLocation) : 'Not recorded'
    },
    {
      label: 'New boiler type',
      value: state.newBoilerType ? labelLookup.get(state.newBoilerType) : 'Not recorded'
    },
    {
      label: 'New flue direction',
      value: state.newFlueDirection ? labelLookup.get(state.newFlueDirection) : 'Not recorded'
    },
    {
      label: 'Flue route fittings',
      value: routeList.length ? routeList.join(' → ') : 'None added'
    },
    {
      label: 'Existing boiler location',
      value: state.location ? labelLookup.get(state.location) : 'Not recorded'
    }
  ];

  summaryItems.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.label}</strong><span>${item.value}</span>`;
    summaryList.appendChild(li);
  });
}

function resetSurvey() {
  state.access.clear();
  state.boilerType = '';
  state.flueType = '';
  state.flueExit = '';
  state.location = '';
  state.newBoilerLocation = '';
  state.newBoilerType = '';
  state.newFlueDirection = '';
  state.flueRoute = [];
  document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.checked = false;
  });
  syncAccessCards();
  syncHotspots(document.getElementById('houseHotspots'), state.location);
  syncHotspots(document.getElementById('newHouseHotspots'), state.newBoilerLocation);
  document.querySelectorAll('.choice-group').forEach(group => syncChoiceTiles(group, ''));
  updateFlueBuilder();
  updateSummary();
}

function initFlueBuilder() {
  const controls = document.querySelectorAll('.builder-controls .chip-button');
  controls.forEach(button => {
    const componentId = button.dataset.component;
    const component = FLUE_COMPONENT_MAP.get(componentId);
    const icon = button.querySelector('.chip-icon');
    if (icon && component?.icon) {
      icon.innerHTML = component.icon;
    }
    button.addEventListener('click', () => {
      state.flueRoute.push(componentId);
      updateFlueBuilder();
      updateSummary();
    });
  });

  const undoButton = document.getElementById('undoFlueComponent');
  const clearButton = document.getElementById('clearFlueComponents');

  if (undoButton) {
    undoButton.addEventListener('click', () => {
      if (!state.flueRoute.length) return;
      state.flueRoute.pop();
      updateFlueBuilder();
      updateSummary();
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      if (!state.flueRoute.length) return;
      state.flueRoute = [];
      updateFlueBuilder();
      updateSummary();
    });
  }

  updateFlueBuilder();
}

function updateFlueBuilder() {
  const preview = document.getElementById('fluePathPreview');
  const list = document.getElementById('flueComponentList');
  if (!preview || !list) return;

  preview.innerHTML = '';
  const startSegment = document.createElement('div');
  startSegment.className = 'preview-segment start';
  startSegment.innerHTML = FLUE_START_ICON;
  preview.appendChild(startSegment);

  state.flueRoute.forEach(componentId => {
    const component = FLUE_COMPONENT_MAP.get(componentId);
    const segment = document.createElement('div');
    segment.className = `preview-segment ${componentId}`;
    segment.innerHTML = component?.icon || '';
    preview.appendChild(segment);
  });

  preview.classList.toggle('empty', state.flueRoute.length === 0);

  list.innerHTML = '';
  if (!state.flueRoute.length) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'empty';
    emptyItem.textContent = 'No fittings added yet.';
    list.appendChild(emptyItem);
  } else {
    state.flueRoute.forEach((componentId, index) => {
      const component = FLUE_COMPONENT_MAP.get(componentId);
      const item = document.createElement('li');
      item.innerHTML = `
        <span class="order-badge">${index + 1}</span>
        <span>${component?.label || componentId}</span>
      `;
      list.appendChild(item);
    });
  }

  const undoButton = document.getElementById('undoFlueComponent');
  const clearButton = document.getElementById('clearFlueComponents');
  if (undoButton) {
    undoButton.disabled = state.flueRoute.length === 0;
  }
  if (clearButton) {
    clearButton.disabled = state.flueRoute.length === 0;
  }
}

function createFlueDirectionIcon(direction) {
  const box = '<rect x="28" y="28" width="24" height="24" rx="6" fill="none" stroke="currentColor" stroke-width="4"/>';
  let path = '';
  switch (direction) {
    case 'left':
      path = '<path d="M28 40 H12" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="12" cy="40" r="4" fill="currentColor"/>';
      break;
    case 'right':
      path = '<path d="M52 40 H68" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="68" cy="40" r="4" fill="currentColor"/>';
      break;
    case 'up':
      path = '<path d="M40 28 V12" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="40" cy="12" r="4" fill="currentColor"/>';
      break;
    case 'down':
      path = '<path d="M40 52 V68" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="40" cy="68" r="4" fill="currentColor"/>';
      break;
    default:
      break;
  }
  return `<svg viewBox="0 0 80 80" role="img" aria-hidden="true">${box}${path}</svg>`;
}
