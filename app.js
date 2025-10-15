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
  {
    id: 'new-flue-direct-rear',
    label: 'Direct rear',
    description: 'Flue exits directly through the rear wall.',
    icon: createFlueDirectionIcon('direct-rear')
  },
  {
    id: 'new-flue-turret-lift',
    label: 'Turret lift',
    description: 'Flue rises vertically via a roof turret.',
    icon: createFlueDirectionIcon('turret-lift')
  },
  {
    id: 'new-flue-turret-rear',
    label: 'Turret rear',
    description: 'Flue routes rearwards from a turret outlet.',
    icon: createFlueDirectionIcon('turret-rear')
  },
  {
    id: 'new-flue-turret-right',
    label: 'Turret right',
    description: 'Flue routes to the right from a turret outlet.',
    icon: createFlueDirectionIcon('turret-right')
  },
  {
    id: 'new-flue-turret-forward',
    label: 'Turret forward',
    description: 'Flue routes forward from a turret outlet.',
    icon: createFlueDirectionIcon('turret-forward')
  },
  {
    id: 'new-flue-vertical',
    label: 'Vertical',
    description: 'Flue rises vertically above the boiler.',
    icon: createFlueDirectionIcon('vertical')
  }
];

const CONDENSATE_OPTIONS = [
  {
    id: 'CD01',
    code: 'CD01',
    label: 'Connection',
    description: 'Internal waste – P-trap present'
  },
  {
    id: 'CD02',
    code: 'CD02',
    label: 'Connection',
    description: 'Internal waste – new trap required'
  },
  {
    id: 'CD03',
    code: 'CD03',
    label: 'External run',
    description: 'Insulate (42 mm MI)'
  },
  {
    id: 'CD04',
    code: 'CD04',
    label: 'External run',
    description: 'Replace with 42 mm (MI compliant)'
  },
  {
    id: 'CD05',
    code: 'CD05',
    label: 'Pump',
    description: 'Condensate pump required'
  },
  {
    id: 'CD06',
    code: 'CD06',
    label: 'Soakaway',
    description: '42 mm pipe'
  },
  {
    id: 'CD07',
    code: 'CD07',
    label: 'Soakaway',
    description: 'Gravel trap'
  },
  {
    id: 'CD08',
    code: 'CD08',
    label: 'Gradient',
    description: 'Fall correction required'
  },
  {
    id: 'CD09',
    code: 'CD09',
    label: 'Upgrade',
    description: '32 mm → 42 mm (MI compliant)'
  },
  {
    id: 'CD10',
    code: 'CD10',
    label: 'Discharge',
    description: 'External soil stack – termination check'
  },
  {
    id: 'CD11',
    code: 'CD11',
    label: 'Neutraliser',
    description: 'Fitted (where required)'
  }
];

const MAKING_GOOD_OPTIONS = [
  {
    id: 'FN01',
    code: 'FN01',
    label: 'New flue',
    description: 'Use same hole – minor change'
  },
  {
    id: 'FN02',
    code: 'FN02',
    label: 'New flue',
    description: 'New hole – same wall'
  },
  {
    id: 'FN03',
    code: 'FN03',
    label: 'New flue',
    description: 'New hole – alternative wall'
  },
  {
    id: 'FN04',
    code: 'FN04',
    label: 'Orientation',
    description: 'Horizontal'
  },
  {
    id: 'FN05',
    code: 'FN05',
    label: 'Orientation',
    description: 'Vertical'
  },
  {
    id: 'FN06',
    code: 'FN06',
    label: 'Sealing',
    description: 'Seal brickwork to flue'
  },
  {
    id: 'FN07',
    code: 'FN07',
    label: 'Sealing',
    description: 'Vertical flashing kit'
  },
  {
    id: 'FN08',
    code: 'FN08',
    label: 'Sealing',
    description: 'Flat roof flashing by specialist builder'
  }
];

const BUILDING_WORK_OPTIONS = [
  {
    id: 'BW01',
    code: 'BW01',
    label: 'Fanned flue – same hole',
    description: 'Re-use existing opening with minimal making good.'
  },
  {
    id: 'BW02',
    code: 'BW02',
    label: 'Fanned flue – remodelling required',
    description: 'Alter surrounding finishes to suit the new fanned flue.'
  },
  {
    id: 'BW03',
    code: 'BW03',
    label: 'Fanned flue – new position',
    description: 'Form a new opening to relocate the flue termination.'
  },
  {
    id: 'BW04',
    code: 'BW04',
    label: 'Balanced changed to fanned – engineer to provide bricks',
    description: 'Engineer to supply bricks for infilling the old balanced flue.'
  },
  {
    id: 'BW05',
    code: 'BW05',
    label: 'Balanced to fanned – customer provide bricks',
    description: 'Customer to supply bricks while converting from balanced to fanned.'
  },
  {
    id: 'BW06',
    code: 'BW06',
    label: 'Specialist builder (3)',
    description: 'Specialist builder attendance – three visits or days.'
  },
  {
    id: 'BW07',
    code: 'BW07',
    label: 'Specialist builder (5)',
    description: 'Specialist builder attendance – five visits or days.'
  }
];

const CYLINDER_OPTIONS = [
  { id: 'CY01', code: 'CY01', label: 'Replace', description: 'Cylinder to be replaced' },
  { id: 'CY02', code: 'CY02', label: 'Retain', description: 'Retain existing cylinder' },
  { id: 'CY03', code: 'CY03', label: 'Remove', description: 'Cylinder to be removed' },
  { id: 'CY04', code: 'CY04', label: 'Unvented', description: 'Specify an unvented cylinder' },
  { id: 'CY05', code: 'CY05', label: 'Open vented', description: 'Specify an open vented cylinder' },
  { id: 'CY06', code: 'CY06', label: 'Mixergy', description: 'Install a Mixergy cylinder' }
];

const CONTROL_OPTIONS = [
  { id: 'CC01', code: 'CC01', label: 'Hive', description: 'Hive smart controls' },
  { id: 'CC02', code: 'CC02', label: 'Hive Mini', description: 'Hive Mini smart controls' },
  { id: 'CC03', code: 'CC03', label: 'Wireless room stat', description: 'Wireless room thermostat' },
  { id: 'CC04', code: 'CC04', label: 'Wired stat', description: 'Wired room thermostat' },
  { id: 'CC05', code: 'CC05', label: 'Programmer', description: 'Heating programmer' },
  { id: 'CC06', code: 'CC06', label: 'Cylinder stat', description: 'Cylinder thermostat' }
];

const SYSTEM_UPGRADE_OPTIONS = [
  { id: 'pump', label: 'Pump', type: 'toggle' },
  { id: 'pump-valves', label: 'Pump valves', type: 'toggle' },
  { id: 'three-port-valve', label: '3 port valve', type: 'toggle' },
  { id: 'two-port-22', label: '2 port valve 22mm', type: 'quantity' },
  { id: 'two-port-28', label: '2 port valve 28mm', type: 'quantity' },
  { id: 'wiring-centre', label: 'Wiring centre', type: 'toggle' },
  { id: 'reconfigure-y-plan', label: 'Reconfigure Y plan', type: 'toggle' },
  { id: 'reconfigure-s-plan', label: 'Reconfigure S plan', type: 'toggle' },
  { id: 'convert-fully-pumped', label: 'Convert to fully pumped', type: 'toggle' },
  { id: 'replace-open-vent', label: 'Replace open vent cold feed', type: 'toggle' },
  { id: 'replace-hw-expansion', label: 'Replace hot water expansion vessel', type: 'toggle' }
];

const SYSTEM_UPGRADE_MAP = new Map(SYSTEM_UPGRADE_OPTIONS.map(option => [option.id, option]));

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
  makingGood: new Set(),
  buildingWork: new Set(),
  condensateRoutes: new Set(),
  systemUpgrades: new Map(),
  cylinderSelections: new Set(),
  customerControls: new Set(),
  disruptionRooms: new Set(),
  flueRoute: []
};

const labelLookup = new Map([
  ...ACCESS_OPTIONS.map(option => [option.id, option.label]),
  ...BOILER_OPTIONS.map(option => [option.id, option.label]),
  ...NEW_BOILER_OPTIONS.map(option => [option.id, option.label]),
  ...FLUE_TYPES.map(option => [option.id, option.label]),
  ...FLUE_EXIT_POINTS.map(option => [option.id, option.label]),
  ...NEW_FLUE_DIRECTIONS.map(option => [option.id, option.label]),
  ...LOCATION_SPOTS.map(option => [option.id, option.label]),
  ...MAKING_GOOD_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}: ${option.description}`]),
  ...BUILDING_WORK_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}: ${option.description}`]),
  ...CONDENSATE_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}: ${option.description}`]),
  ...SYSTEM_UPGRADE_OPTIONS.map(option => [option.id, option.label]),
  ...CYLINDER_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}`]),
  ...CONTROL_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}`])
]);

document.addEventListener('DOMContentLoaded', () => {
  renderAccessOptions();
  renderBoilerOptions();
  renderFlueOptions();
  renderHotspotGroup('houseHotspots', 'location');
  renderHotspotGroup('newHouseHotspots', 'newBoilerLocation');
  renderNewBoilerOptions();
  renderNewFlueDirections();
  renderMakingGoodOptions();
  renderBuildingWorkOptions();
  renderCondensateOptions();
  renderSystemUpgradeOptions();
  renderCylinderOptions();
  renderControlOptions();
  renderDisruptionHotspots('disruptionHotspots', 'disruptionRooms');
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

function renderMakingGoodOptions() {
  const container = document.getElementById('makingGoodChoices');
  if (!container) return;
  container.innerHTML = '';
  MAKING_GOOD_OPTIONS.forEach(option => {
    const tile = createCheckboxTile('making-good', option, (optionId, checked) => {
      if (checked) {
        state.makingGood.add(optionId);
      } else {
        state.makingGood.delete(optionId);
      }
      syncCheckboxTiles(container, state.makingGood);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.makingGood);
}

function renderBuildingWorkOptions() {
  const container = document.getElementById('buildingWorkChoices');
  if (!container) return;
  container.innerHTML = '';
  BUILDING_WORK_OPTIONS.forEach(option => {
    const tile = createCheckboxTile('building-work', option, (optionId, isSelected) => {
      if (isSelected) {
        state.buildingWork.add(optionId);
      } else {
        state.buildingWork.delete(optionId);
      }
      syncCheckboxTiles(container, state.buildingWork);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.buildingWork);
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

function renderCondensateOptions() {
  const container = document.getElementById('condensateChoices');
  if (!container) return;
  container.innerHTML = '';
  CONDENSATE_OPTIONS.forEach(option => {
    const tile = createCheckboxTile('condensate-route', option, (optionId, isSelected) => {
      if (isSelected) {
        state.condensateRoutes.add(optionId);
      } else {
        state.condensateRoutes.delete(optionId);
      }
      syncCheckboxTiles(container, state.condensateRoutes);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.condensateRoutes);
}

function renderCylinderOptions() {
  const container = document.getElementById('cylinderChoices');
  if (!container) return;
  container.innerHTML = '';
  CYLINDER_OPTIONS.forEach(option => {
    const tile = createCheckboxTile('cylinder', option, (optionId, checked) => {
      if (checked) {
        state.cylinderSelections.add(optionId);
      } else {
        state.cylinderSelections.delete(optionId);
      }
      syncCheckboxTiles(container, state.cylinderSelections);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.cylinderSelections);
}

function renderControlOptions() {
  const container = document.getElementById('controlChoices');
  if (!container) return;
  container.innerHTML = '';
  CONTROL_OPTIONS.forEach(option => {
    const tile = createCheckboxTile('controls', option, (optionId, checked) => {
      if (checked) {
        state.customerControls.add(optionId);
      } else {
        state.customerControls.delete(optionId);
      }
      syncCheckboxTiles(container, state.customerControls);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.customerControls);
}

function renderSystemUpgradeOptions() {
  const container = document.getElementById('systemUpgradeGrid');
  if (!container) return;
  container.innerHTML = '';

  SYSTEM_UPGRADE_OPTIONS.forEach(option => {
    if (option.type === 'quantity') {
      const card = document.createElement('div');
      card.className = 'option-card upgrade-card quantity';
      card.dataset.optionId = option.id;
      card.innerHTML = `
        <strong>${option.label}</strong>
        <div class="quantity-controls" role="group" aria-label="Adjust quantity for ${option.label}">
          <button type="button" class="quantity-button" data-action="decrement" aria-label="Remove ${option.label}">−</button>
          <span class="quantity-value" aria-live="polite">0</span>
          <button type="button" class="quantity-button" data-action="increment" aria-label="Add ${option.label}">+</button>
        </div>
      `;
      const decrementButton = card.querySelector('.quantity-button[data-action="decrement"]');
      const incrementButton = card.querySelector('.quantity-button[data-action="increment"]');
      if (decrementButton) {
        decrementButton.addEventListener('click', () => {
          const current = state.systemUpgrades.get(option.id) || 0;
          if (current === 0) return;
          state.systemUpgrades.set(option.id, current - 1);
          syncSystemUpgradeCards();
          updateSummary();
        });
      }
      if (incrementButton) {
        incrementButton.addEventListener('click', () => {
          const current = state.systemUpgrades.get(option.id) || 0;
          state.systemUpgrades.set(option.id, current + 1);
          syncSystemUpgradeCards();
          updateSummary();
        });
      }
      container.appendChild(card);
    } else {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-card upgrade-card';
      button.dataset.optionId = option.id;
      button.innerHTML = `
        <strong>${option.label}</strong>
        <span class="upgrade-hint">Tap to include</span>
      `;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        const current = state.systemUpgrades.get(option.id) || 0;
        const next = current > 0 ? 0 : 1;
        state.systemUpgrades.set(option.id, next);
        syncSystemUpgradeCards();
        updateSummary();
      });
      container.appendChild(button);
    }
  });

  syncSystemUpgradeCards();
}

function syncSystemUpgradeCards() {
  const container = document.getElementById('systemUpgradeGrid');
  if (!container) return;

  container.querySelectorAll('[data-option-id]').forEach(card => {
    const optionId = card.dataset.optionId;
    const option = SYSTEM_UPGRADE_MAP.get(optionId);
    if (!option) return;
    const count = state.systemUpgrades.get(optionId) || 0;

    if (option.type === 'quantity') {
      card.classList.toggle('selected', count > 0);
      const valueEl = card.querySelector('.quantity-value');
      if (valueEl) {
        valueEl.textContent = count;
      }
      const decrementButton = card.querySelector('.quantity-button[data-action="decrement"]');
      if (decrementButton) {
        decrementButton.disabled = count === 0;
      }
    } else {
      card.classList.toggle('selected', count > 0);
      card.setAttribute('aria-pressed', count > 0 ? 'true' : 'false');
    }
  });
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

function renderDisruptionHotspots(containerId, stateKey) {
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
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      if (state[stateKey].has(spot.id)) {
        state[stateKey].delete(spot.id);
      } else {
        state[stateKey].add(spot.id);
      }
      syncHotspotMulti(container, state[stateKey]);
      updateSummary();
    });
    container.appendChild(button);
  });
  syncHotspotMulti(container, state[stateKey]);
}

function createRadioTile(groupName, option, onSelect) {
  const tile = document.createElement('div');
  tile.className = 'choice-tile';
  const inputId = `${groupName}-${option.id}`;
  tile.innerHTML = `
    <input type="radio" name="${groupName}" id="${inputId}" value="${option.id}">
    <label for="${inputId}">
      ${option.code ? `<span class="tile-badge">${option.code}</span>` : ''}
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

function createCheckboxTile(groupName, option, onToggle) {
  const tile = document.createElement('div');
  tile.className = 'choice-tile';
  const inputId = `${groupName}-${option.id}`;
  tile.innerHTML = `
    <input type="checkbox" name="${groupName}" id="${inputId}" value="${option.id}">
    <label for="${inputId}">
      ${option.code ? `<span class="tile-badge">${option.code}</span>` : ''}
      ${option.icon ? `<span class="tile-icon">${option.icon}</span>` : ''}
      <span class="tile-copy">
        <strong>${option.label}</strong>
        ${option.description ? `<span>${option.description}</span>` : ''}
      </span>
    </label>
  `;
  const input = tile.querySelector('input');
  input.addEventListener('change', () => {
    onToggle(option.id, input.checked);
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

function syncCheckboxTiles(container, selectedSet) {
  const tiles = container.querySelectorAll('.choice-tile');
  tiles.forEach(tile => {
    const input = tile.querySelector('input');
    const isSelected = selectedSet.has(input.value);
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

function syncHotspotMulti(container, selectedSet) {
  if (!container) return;
  container.querySelectorAll('.hotspot').forEach(button => {
    const selected = selectedSet.has(button.dataset.locationId);
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
}

function updateSummary() {
  const summaryList = document.getElementById('summaryList');
  const accessList = Array.from(state.access).map(id => labelLookup.get(id));
  const routeList = state.flueRoute.map(id => {
    const component = FLUE_COMPONENT_MAP.get(id);
    return component ? component.label : id;
  });
  const makingGoodList = MAKING_GOOD_OPTIONS.filter(option => state.makingGood.has(option.id)).map(option => labelLookup.get(option.id));
  const buildingWorkList = BUILDING_WORK_OPTIONS.filter(option => state.buildingWork.has(option.id)).map(option => labelLookup.get(option.id));
  const condensateList = CONDENSATE_OPTIONS.filter(option => state.condensateRoutes.has(option.id)).map(option => labelLookup.get(option.id));
  const upgradeList = SYSTEM_UPGRADE_OPTIONS.reduce((list, option) => {
    const count = state.systemUpgrades.get(option.id) || 0;
    if (count > 0) {
      if (option.type === 'quantity') {
        list.push(`${option.label} × ${count}`);
      } else {
        list.push(option.label);
      }
    }
    return list;
  }, []);
  const cylinderList = CYLINDER_OPTIONS.filter(option => state.cylinderSelections.has(option.id)).map(option => labelLookup.get(option.id));
  const controlList = CONTROL_OPTIONS.filter(option => state.customerControls.has(option.id)).map(option => labelLookup.get(option.id));
  const disruptionList = Array.from(state.disruptionRooms).map(id => labelLookup.get(id));
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
      label: 'Existing boiler location',
      value: state.location ? labelLookup.get(state.location) : 'Not recorded'
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
      label: 'Making good',
      value: makingGoodList.length ? makingGoodList.join(', ') : 'Not recorded'
    },
    {
      label: 'Building work & making good',
      value: buildingWorkList.length ? buildingWorkList.join(', ') : 'Not recorded'
    },
    {
      label: 'Condensate works',
      value: condensateList.length ? condensateList.join(', ') : 'Not recorded'
    },
    {
      label: 'System upgrade works',
      value: upgradeList.length ? upgradeList.join(', ') : 'Not recorded'
    },
    {
      label: 'Cylinder works',
      value: cylinderList.length ? cylinderList.join(', ') : 'Not recorded'
    },
    {
      label: 'Customer controls',
      value: controlList.length ? controlList.join(', ') : 'Not recorded'
    },
    {
      label: 'Flue route fittings',
      value: routeList.length ? routeList.join(' → ') : 'None added'
    },
    {
      label: 'Disruption zones',
      value: disruptionList.length ? disruptionList.join(', ') : 'Not recorded'
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
  state.makingGood.clear();
  state.buildingWork.clear();
  state.condensateRoutes.clear();
  state.systemUpgrades.clear();
  state.cylinderSelections.clear();
  state.customerControls.clear();
  state.disruptionRooms.clear();
  state.flueRoute = [];
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.checked = false;
  });
  syncAccessCards();
  syncHotspots(document.getElementById('houseHotspots'), state.location);
  syncHotspots(document.getElementById('newHouseHotspots'), state.newBoilerLocation);
  syncHotspotMulti(document.getElementById('disruptionHotspots'), state.disruptionRooms);
  document.querySelectorAll('.choice-group').forEach(group => syncChoiceTiles(group, ''));
  syncCheckboxTiles(document.getElementById('condensateChoices'), state.condensateRoutes);
  syncCheckboxTiles(document.getElementById('makingGoodChoices'), state.makingGood);
  syncCheckboxTiles(document.getElementById('buildingWorkChoices'), state.buildingWork);
  syncCheckboxTiles(document.getElementById('cylinderChoices'), state.cylinderSelections);
  syncCheckboxTiles(document.getElementById('controlChoices'), state.customerControls);
  syncSystemUpgradeCards();
  updateFlueBuilder();
  updateSummary();
}

function initFlueBuilder() {
  const controls = document.querySelectorAll('.builder-controls .chip-button');
  controls.forEach(button => {
    const componentId = button.dataset.component;
    const component = FLUE_COMPONENT_MAP.get(componentId);
    const icon = button.querySelector('.chip-icon');
    if (icon && component && component.icon) {
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
    segment.innerHTML = component && component.icon ? component.icon : '';
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
        <span>${component && component.label ? component.label : componentId}</span>
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
  const turret = '<path d="M32 28 V20 L40 12 L48 20 V28" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>';
  let elements = box;
  switch (direction) {
    case 'direct-rear':
      elements += '<path d="M28 40 H12" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="12" cy="40" r="4" fill="currentColor"/>';
      break;
    case 'turret-lift':
      elements += turret;
      elements += '<path d="M40 20 V8" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="40" cy="8" r="4" fill="currentColor"/>';
      break;
    case 'turret-rear':
      elements += turret;
      elements += '<path d="M28 40 H12" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="12" cy="40" r="4" fill="currentColor"/>';
      break;
    case 'turret-right':
      elements += turret;
      elements += '<path d="M52 40 H68" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="68" cy="40" r="4" fill="currentColor"/>';
      break;
    case 'turret-forward':
      elements += turret;
      elements += '<path d="M40 52 V68" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="40" cy="68" r="4" fill="currentColor"/>';
      break;
    case 'vertical':
      elements += '<path d="M40 52 V20" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>';
      elements += '<circle cx="40" cy="20" r="4" fill="currentColor"/>';
      elements += '<path d="M40 20 V8" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="40" cy="8" r="4" fill="currentColor"/>';
      break;
    default:
      break;
  }
  return `<svg viewBox="0 0 80 80" role="img" aria-hidden="true">${elements}</svg>`;
}
