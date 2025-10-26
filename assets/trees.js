const TREE_INDEX = {
  boiler: {
    title: 'Current vs New Boiler',
    summary: 'Compare existing appliance types with proposed replacements.',
    file: './data/trees/current-vs-new-boiler.opml'
  },
  flue: {
    title: 'Flue – Current vs Proposed',
    summary: 'Document the current flue and select the upgraded route.',
    file: './data/trees/flue-current-vs-new.opml'
  },
  cylinder: {
    title: 'Cylinder – Current vs Proposed',
    summary: 'Capture the existing cylinder and plan the new installation.',
    file: './data/trees/cylinder-current-vs-new.opml'
  },
  controls: {
    title: 'Controls – Current vs Proposed',
    summary: 'Record today’s controls and decide on the upgrade.',
    file: './data/trees/controls-current-vs-new.opml'
  },
  condensate: {
    title: 'Condensate – Current vs Proposed',
    summary: 'Assess condensate routing today and define the future path.',
    file: './data/trees/condensate-current-vs-new.opml'
  },
  terminal: {
    title: 'Terminal Options',
    summary: 'Specify the terminal finish for the installation.',
    file: './data/trees/terminal.opml'
  },
  powerflush: {
    title: 'Powerflush',
    summary: 'Confirm whether system cleansing is required.',
    file: './data/trees/powerflush.opml'
  },
  filter: {
    title: 'Filter',
    summary: 'Record the status of the heating system filter.',
    file: './data/trees/filter.opml'
  },
  systemControls: {
    title: 'System Controls',
    summary: 'Describe the overall heating control layout.',
    file: './data/trees/system-controls.opml'
  }
};

const TREE_ORDER = [
  'boiler',
  'flue',
  'cylinder',
  'controls',
  'condensate',
  'terminal',
  'powerflush',
  'filter',
  'systemControls'
];

const TREE_ALIASES = {
  'boiler-a-b': 'boiler',
  'flue-a-b': 'flue',
  'cylinder-a-b': 'cylinder',
  'controls-a-b': 'controls',
  'condensate-a-b': 'condensate',
  'terminal-options': 'terminal',
  'powerflush-options': 'powerflush',
  'filter-options': 'filter',
  'system-controls': 'systemControls'
};

Object.entries(TREE_ALIASES).forEach(([alias, key]) => {
  if (TREE_INDEX[key]) {
    TREE_INDEX[alias] = { ...TREE_INDEX[key], aliasFor: key };
  }
});
