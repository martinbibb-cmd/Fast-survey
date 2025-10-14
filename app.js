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

const state = {
  access: new Set(),
  boilerType: '',
  flueType: '',
  flueExit: '',
  location: ''
};

const labelLookup = new Map([
  ...ACCESS_OPTIONS.map(option => [option.id, option.label]),
  ...BOILER_OPTIONS.map(option => [option.id, option.label]),
  ...FLUE_TYPES.map(option => [option.id, option.label]),
  ...FLUE_EXIT_POINTS.map(option => [option.id, option.label]),
  ...LOCATION_SPOTS.map(option => [option.id, option.label])
]);

document.addEventListener('DOMContentLoaded', () => {
  renderAccessOptions();
  renderBoilerOptions();
  renderFlueOptions();
  renderLocationHotspots();
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
    const wrapper = document.createElement('div');
    wrapper.className = 'choice-tile';
    const inputId = `boiler-${option.id}`;
    wrapper.innerHTML = `
      <input type="radio" name="boiler" id="${inputId}" value="${option.id}">
      <label for="${inputId}">
        <strong>${option.label}</strong>
        <span>${option.description}</span>
      </label>
    `;
    const input = wrapper.querySelector('input');
    input.addEventListener('change', () => {
      state.boilerType = option.id;
      syncChoiceTiles(container, option.id);
      updateSummary();
    });
    container.appendChild(wrapper);
  });
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

  FLUE_EXIT_POINTS.forEach(option => {
    const tile = createRadioTile('flue-exit', option, selectedId => {
      state.flueExit = selectedId;
      syncChoiceTiles(exitGroup, selectedId);
      updateSummary();
    });
    exitGroup.appendChild(tile);
  });
}

function renderLocationHotspots() {
  const container = document.getElementById('houseHotspots');
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
      if (state.location === spot.id) {
        state.location = '';
      } else {
        state.location = spot.id;
      }
      syncHotspots(container);
      updateSummary();
    });
    container.appendChild(button);
  });
  syncHotspots(container);
}

function createRadioTile(groupName, option, onSelect) {
  const tile = document.createElement('div');
  tile.className = 'choice-tile';
  const inputId = `${groupName}-${option.id}`;
  tile.innerHTML = `
    <input type="radio" name="${groupName}" id="${inputId}" value="${option.id}">
    <label for="${inputId}">
      <strong>${option.label}</strong>
      <span>${option.description}</span>
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

function syncHotspots(container) {
  container.querySelectorAll('.hotspot').forEach(button => {
    const selected = button.dataset.locationId === state.location;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-selected', selected ? 'true' : 'false');
  });
}

function updateSummary() {
  const summaryList = document.getElementById('summaryList');
  const accessList = Array.from(state.access).map(id => labelLookup.get(id));
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
      label: 'Boiler location',
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
  document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.checked = false;
  });
  syncAccessCards();
  syncHotspots(document.getElementById('houseHotspots'));
  document.querySelectorAll('.choice-group').forEach(group => syncChoiceTiles(group, ''));
  updateSummary();
}
