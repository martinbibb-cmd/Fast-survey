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
  {
    id: 'regular',
    label: 'Regular (open-vent)',
    description: 'Header tank and vented cylinder.',
    image: 'assets/img/fast-survey/open-vent-schematic.svg',
    alt: 'Open-vent regular system with feed and expansion tank'
  },
  {
    id: 'system',
    label: 'System (sealed)',
    description: 'Cylinder with two motorised valves.',
    image: 'assets/img/fast-survey/s-plan.svg',
    alt: 'Sealed system showing S-plan zone valves'
  },
  {
    id: 'combi',
    label: 'Combi',
    description: 'No cylinder, instant hot water.',
    image: 'assets/img/fast-survey/boiler-generic.svg',
    alt: 'Wall-hung combi boiler illustration'
  },
  {
    id: 'storage-combi',
    label: 'Storage combi',
    description: 'Combination boiler with built-in store.',
    image: 'assets/img/fast-survey/boiler-generic.svg',
    alt: 'Storage combi boiler with integrated cylinder'
  },
  {
    id: 'warm-air',
    label: 'Warm air',
    description: 'Ducted warm air unit providing heating.',
    image: 'assets/img/fast-survey/warm-air.svg',
    alt: 'Warm air ducted heating diagram'
  },
  { id: 'none', label: 'None', description: 'No boiler currently installed.' }
];

const NEW_BOILER_OPTIONS = [
  { id: 'new-regular', label: 'Regular', description: 'Traditional open vented boiler.' },
  { id: 'new-system', label: 'System', description: 'Pressurised system with separate cylinder.' },
  { id: 'new-combi', label: 'Combi', description: 'Combination boiler for instant hot water.' }
];

const FLUE_TYPES = [
  {
    id: 'fanned-horizontal',
    label: 'Fanned horizontal',
    description: 'Fan-assisted flue leaving through a wall.',
    image: 'assets/img/fast-survey/rear-flue-dims.svg',
    alt: 'Horizontal fanned flue rear exit example'
  },
  {
    id: 'fanned-vertical',
    label: 'Fanned vertical',
    description: 'Fan-assisted flue terminating through the roof.',
    image: 'assets/img/fast-survey/roof-terminal.svg',
    alt: 'Vertical roof terminal'
  }
];

const FLUE_EXIT_POINTS = [
  {
    id: 'rear-wall',
    label: 'Rear wall',
    description: 'Exits directly behind the boiler.',
    image: 'assets/img/fast-survey/rear-flue-dims.svg',
    alt: 'Rear wall exit illustration'
  },
  {
    id: 'side-wall',
    label: 'Side wall',
    description: 'Terminates through a side elevation.',
    image: 'assets/img/fast-survey/rear-flue-dims.svg',
    alt: 'Side wall exit illustration'
  },
  {
    id: 'roof',
    label: 'Roof',
    description: 'Terminates vertically through the roof.',
    image: 'assets/img/fast-survey/roof-terminal.svg',
    alt: 'Roof terminal exit'
  }
];

const NEW_FLUE_DIRECTIONS = [
  {
    id: 'new-flue-horizontal',
    label: 'Horizontal',
    description: 'Horizontal run from the boiler.',
    image: 'assets/img/fast-survey/rear-flue-dims.svg',
    alt: 'Horizontal flue route illustration'
  },
  {
    id: 'new-flue-vertical',
    label: 'Vertical',
    description: 'Vertical run through the roof.',
    image: 'assets/img/fast-survey/roof-terminal.svg',
    alt: 'Vertical flue route illustration'
  }
];

const ZONING_OPTIONS = [
  {
    id: 'zoning-s-plan',
    label: 'S-Plan',
    description: 'Two motorised valves controlling heating and hot water.',
    image: 'assets/img/fast-survey/s-plan.svg',
    alt: 'Two zone valves with pumped circuit'
  },
  {
    id: 'zoning-y-plan',
    label: 'Y-Plan',
    description: 'Mid-position valve serving heating and hot water.',
    image: 'assets/img/fast-survey/y-plan.svg',
    alt: 'Mid-position valve heating schematic'
  },
  {
    id: 'zoning-open-vent',
    label: 'Open vented',
    description: 'Feed and expansion tank supplying a gravity circuit.',
    image: 'assets/img/fast-survey/open-vent-schematic.svg',
    alt: 'Open vented heating schematic'
  },
  {
    id: 'zoning-two-zone',
    label: 'Two-zone',
    description: 'Separate circuits for upstairs and downstairs zones.',
    image: 'assets/img/fast-survey/two-zone.svg',
    alt: 'Two-zone heating layout'
  },
  {
    id: 'zoning-one-pipe',
    label: 'One-pipe',
    description: 'Single loop circuit feeding each emitter in sequence.',
    image: 'assets/img/fast-survey/one-pipe.svg',
    alt: 'One-pipe circuit layout'
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
  },
  {
    id: 'CD12',
    code: 'CD12',
    label: 'Soakaway',
    description: 'Specialist builder installed soak away'
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
    description: 'New hole – same wall',
    image: 'assets/img/fast-survey/rear-flue-dims.svg',
    alt: 'Rear flue drilling and collar'
  },
  {
    id: 'FN03',
    code: 'FN03',
    label: 'New flue',
    description: 'New hole – alternative wall',
    image: 'assets/img/fast-survey/rear-flue-dims.svg',
    alt: 'Side wall flue drilling illustration'
  },
  {
    id: 'FN04',
    code: 'FN04',
    label: 'Orientation',
    description: 'Horizontal',
    image: 'assets/img/fast-survey/rear-flue-dims.svg',
    alt: 'Horizontal flue orientation'
  },
  {
    id: 'FN05',
    code: 'FN05',
    label: 'Orientation',
    description: 'Vertical',
    image: 'assets/img/fast-survey/roof-terminal.svg',
    alt: 'Vertical flue orientation'
  },
  {
    id: 'FN06',
    code: 'FN06',
    label: 'Sealing',
    description: 'Seal brickwork to flue',
    image: 'assets/img/fast-survey/flue-offset-40mm.svg',
    alt: 'Flue sealing illustration'
  },
  {
    id: 'FN07',
    code: 'FN07',
    label: 'Sealing',
    description: 'Vertical flashing kit',
    image: 'assets/img/fast-survey/roof-terminal.svg',
    alt: 'Vertical flashing kit illustration'
  },
  {
    id: 'FN08',
    code: 'FN08',
    label: 'Sealing',
    description: 'Flat roof flashing by specialist builder',
    image: 'assets/img/fast-survey/roof-terminal.svg',
    alt: 'Flat roof flashing illustration'
  }
];

const BUILDING_WORK_OPTIONS = [
  {
    id: 'BW01',
    code: 'BW01',
    label: 'Fanned flue – same hole',
    description: 'Re-use existing opening with minimal making good.',
    image: 'assets/img/fast-survey/rear-flue-dims.svg',
    alt: 'Fanned flue using existing hole'
  },
  {
    id: 'BW02',
    code: 'BW02',
    label: 'Fanned flue – remodelling required',
    description: 'Alter surrounding finishes to suit the new fanned flue.',
    image: 'assets/img/fast-survey/rear-flue-dims.svg',
    alt: 'Fanned flue requiring remodelling'
  },
  {
    id: 'BW03',
    code: 'BW03',
    label: 'Fanned flue – new position',
    description: 'Form a new opening to relocate the flue termination.',
    image: 'assets/img/fast-survey/rear-flue-dims.svg',
    alt: 'Fanned flue in new position'
  },
  {
    id: 'BW04',
    code: 'BW04',
    label: 'Balanced changed to fanned – engineer to provide bricks',
    description: 'Engineer to supply bricks for infilling the old balanced flue.',
    image: 'assets/img/fast-survey/rear-flue-dims.svg',
    alt: 'Balanced to fanned conversion with engineer provided bricks'
  },
  {
    id: 'BW05',
    code: 'BW05',
    label: 'Balanced to fanned – customer provide bricks',
    description: 'Customer to supply bricks while converting from balanced to fanned.',
    image: 'assets/img/fast-survey/rear-flue-dims.svg',
    alt: 'Balanced to fanned conversion with customer bricks'
  },
  {
    id: 'BW06',
    code: 'BW06',
    label: 'Specialist builder (3)',
    description: 'Specialist builder attendance – three visits or days.',
    image: 'assets/img/fast-survey/flue-offset-40mm.svg',
    alt: 'Specialist builder support illustration'
  },
  {
    id: 'BW07',
    code: 'BW07',
    label: 'Specialist builder (5)',
    description: 'Specialist builder attendance – five visits or days.',
    image: 'assets/img/fast-survey/flue-offset-40mm.svg',
    alt: 'Extended specialist builder support illustration'
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

const DOUBLE_LIFT_OPTIONS = [
  { id: 'double-none', label: 'None' },
  { id: 'double-old-boiler', label: 'Old boiler' },
  { id: 'double-new-boiler', label: 'New boiler' },
  { id: 'double-cylinder', label: 'Cylinder' },
  { id: 'double-heavy-rads', label: 'Heavy rads' },
  { id: 'double-boiler-loft', label: 'Boiler in loft' }
];

const PERMISSION_OPTIONS = [
  { id: 'perm-none', label: 'None' },
  { id: 'perm-flat', label: 'Flat' },
  { id: 'perm-listen', label: 'Listen' },
  { id: 'perm-conservation', label: 'Conservation area' },
  { id: 'perm-gated-community', label: 'Gated community' }
];

const HAZARD_OPTIONS = [
  { id: 'haz-dogs', label: 'Dogs' },
  { id: 'haz-other-pets', label: 'Other pets' },
  { id: 'haz-clutter', label: 'Clutter' },
  { id: 'haz-hygiene', label: 'Hygiene issues' },
  { id: 'haz-animal-mess', label: 'Animal mess' },
  { id: 'haz-nesting-insects', label: 'Nesting insects' },
  { id: 'haz-uneven-ground', label: 'Uneven ground' },
  { id: 'haz-small-spaces', label: 'Small working spaces' }
];

const PIPEWORK_SECTIONS = [
  {
    id: 'gas-supply',
    label: 'Gas supply',
    options: [
      { id: 'GR01', code: 'GR01', label: 'Upgrade to 22 mm' },
      { id: 'GR02', code: 'GR02', label: 'Tightness test pass required' },
      { id: 'GR03', code: 'GR03', label: 'Meter location restricts route' },
      { id: 'GR04', code: 'GR04', label: 'Internal reroute' },
      { id: 'GR05', code: 'GR05', label: 'External reroute' }
    ]
  },
  {
    id: 'meter-type',
    label: 'Meter type',
    options: [
      { id: 'GR06', code: 'GR06', label: 'U6 – inside' },
      { id: 'GR07', code: 'GR07', label: 'U6 – outside' }
    ]
  },
  {
    id: 'route-complexity',
    label: 'Route complexity',
    options: [
      { id: 'GR08', code: 'GR08', label: 'Simple / local' },
      { id: 'GR09', code: 'GR09', label: 'Reuse existing' },
      { id: 'GR10', code: 'GR10', label: 'Upsize sections for capacity' },
      { id: 'GR11', code: 'GR11', label: 'Complex (clipping / drilling / routing)' }
    ]
  },
  {
    id: 'gas-notes',
    label: 'Gas notes',
    options: [
      { id: 'GR12', code: 'GR12', label: 'Replace meter tail lead' },
      { id: 'GR13', code: 'GR13', label: 'Pressure drop risk over length' }
    ]
  },
  {
    id: 'gas-pipework',
    label: 'Gas pipework',
    options: [
      {
        id: 'GAS50',
        code: 'GAS50',
        label: 'Rule-of-thumb: ≤28 kW = 22 mm at boiler; >28 kW = 28 mm (check calcs)'
      }
    ]
  },
  {
    id: 'gas-compliance',
    label: 'Gas compliance',
    options: [
      {
        id: 'GAS51',
        code: 'GAS51',
        label: 'Max 1 mbar drop from meter to appliance on new installations'
      }
    ]
  },
  {
    id: 'gas-meter',
    label: 'Gas meter',
    options: [
      { id: 'GAS52', code: 'GAS52', label: 'U6 ≈ 63 kW max; U16 ≈ 169 kW max (aggregate load awareness)' }
    ]
  },
  {
    id: 'gas-route',
    label: 'Gas route',
    options: [
      { id: 'GAS53', code: 'GAS53', label: 'Long runs/many bends increase resistance – upsize and minimise fittings' }
    ]
  },
  {
    id: 'gas-commission',
    label: 'Gas commission',
    options: [
      { id: 'GAS54', code: 'GAS54', label: 'Final pipe size confirmed at commissioning under load with new appliance' }
    ]
  }
];

const PIPEWORK_OPTION_DETAILS = PIPEWORK_SECTIONS.flatMap(section =>
  section.options.map(option => ({ ...option, section: section.label }))
);
const PIPEWORK_DETAIL_LOOKUP = new Map(
  PIPEWORK_OPTION_DETAILS.map(option => [option.id, option])
);

const DISRUPTION_CODES = [
  { id: 'DI01', code: 'DI01', label: 'Disruption', description: 'Minimal' },
  { id: 'DI02', code: 'DI02', label: 'Disruption', description: 'Moderate – carpets lifted' },
  { id: 'DI03', code: 'DI03', label: 'Disruption', description: 'High – floors lifted' },
  { id: 'DI04', code: 'DI04', label: 'Preparation', description: 'Customer to clear areas/routes' },
  { id: 'DI05', code: 'DI05', label: 'Protection', description: 'Dust protection required' }
];

const POWERFLUSH_OPTIONS = [
  { id: 'PF01', code: 'PF01', label: 'Customer declined' },
  { id: 'PF02', code: 'PF02', label: 'Cleanse and powerflush system' },
  { id: 'PF03', code: 'PF03', label: 'Cleanse only' },
  { id: 'PF04', code: 'PF04', label: 'System unsuitable for powerflush' },
  { id: 'PF05', code: 'PF05', label: 'Manual disconnection and flush' }
];

const CUSTOMER_ACTIONS = [
  { id: 'CA01', code: 'CA01', label: 'Customer', description: 'Clear working areas' },
  { id: 'CA02', code: 'CA02', label: 'Customer', description: 'Gain permission where required' },
  { id: 'CA03', code: 'CA03', label: 'Customer', description: 'Ensure animals are kept safely' },
  { id: 'CA04', code: 'CA04', label: 'Customer', description: 'Remove cupboard' },
  { id: 'CA05', code: 'CA05', label: 'Customer', description: 'Rebuild cupboard' },
  { id: 'CA06', code: 'CA06', label: 'Customer', description: 'Remove old flue & weather seal' },
  { id: 'CA07', code: 'CA07', label: 'Customer', description: 'Supply specified items' }
];

const AWARENESS_SECTIONS = [
  {
    id: 'system',
    label: 'System',
    options: [
      { id: 'ARS01', code: 'ARS01', label: 'Sealing an old system may expose hidden leaks' },
      { id: 'ARS02', code: 'ARS02', label: 'Existing radiators and valves may leak once pressurised' },
      { id: 'ARS03', code: 'ARS03', label: 'Old vented pipework and joints not designed for pressure' },
      { id: 'ARS04', code: 'ARS04', label: 'System converted from open vent to sealed — pressure relief valve fitted for safety' },
      { id: 'ARS05', code: 'ARS05', label: 'Pressure drops after installation may indicate existing weeps or hidden leaks' },
      { id: 'ARS06', code: 'ARS06', label: 'Customer advised to monitor pressure during initial days of use' },
      { id: 'ARS07', code: 'ARS07', label: 'No liability for existing system weaknesses or pre-existing faults' }
    ]
  },
  {
    id: 'combi',
    label: 'Combi',
    options: [
      { id: 'ARS08', code: 'ARS08', label: 'Combination boilers supply one outlet at a time — flow reduces with multiple use' },
      { id: 'ARS09', code: 'ARS09', label: 'Flow rate limited by mains water supply — cannot exceed incoming pressure or flow' },
      { id: 'ARS10', code: 'ARS10', label: 'Large households or multiple bathrooms may experience reduced performance' },
      { id: 'ARS11', code: 'ARS11', label: 'Cold mains restrictions may affect shower performance' },
      { id: 'ARS12', code: 'ARS12', label: 'Hot water temperature varies slightly with flow rate' },
      { id: 'ARS13', code: 'ARS13', label: 'Not suitable for power showers with pump — pump must be removed' },
      { id: 'ARS14', code: 'ARS14', label: 'Shower performance dependent on incoming cold main flow and pressure' }
    ]
  },
  {
    id: 'hot-water',
    label: 'Hot water',
    options: [
      { id: 'ARS15', code: 'ARS15', label: 'Stored cylinder water may take time to reheat' },
      { id: 'ARS16', code: 'ARS16', label: 'Mixergy or unvented cylinders require periodic servicing for safety' },
      { id: 'ARS17', code: 'ARS17', label: 'Unvented cylinder discharge tested and compliant at time of install only' },
      { id: 'ARS18', code: 'ARS18', label: 'Hot water recovery times vary depending on usage pattern' },
      { id: 'ARS19', code: 'ARS19', label: 'No liability for customer-supplied fixtures not designed for mains pressure' }
    ]
  },
  {
    id: 'condensate',
    label: 'Condensate',
    options: [
      { id: 'ARS20', code: 'ARS20', label: 'Condensate routes external — insulated to reduce freezing risk, not guaranteed' },
      { id: 'ARS21', code: 'ARS21', label: 'External soakaway provided only where suitable drainage available' },
      { id: 'ARS22', code: 'ARS22', label: 'Customer responsible for maintaining condensate route clear and free-flowing' },
      { id: 'ARS23', code: 'ARS23', label: 'No responsibility for freezing if installation complies with manufacturer MI' }
    ]
  },
  {
    id: 'controls',
    label: 'Controls',
    options: [
      { id: 'ARS24', code: 'ARS24', label: 'Controls installed in accordance with manufacturer’s instructions' },
      { id: 'ARS25', code: 'ARS25', label: 'Hive system can operate without Wi-Fi; only remote app access requires router connection and USB power' },
      { id: 'ARS26', code: 'ARS26', label: 'Smart controls may require network access for optional app features' },
      { id: 'ARS27', code: 'ARS27', label: 'No responsibility for internet connectivity or app integration issues' },
      { id: 'ARS28', code: 'ARS28', label: 'Room stat location based on best judgement at time of survey' }
    ]
  },
  {
    id: 'flue',
    label: 'Flue',
    options: [
      { id: 'ARS29', code: 'ARS29', label: 'Flue termination checked for clearance at time of install — future obstructions not covered' },
      { id: 'ARS30', code: 'ARS30', label: 'Brickwork and render made good to reasonable standard, not decorative finish' },
      { id: 'ARS31', code: 'ARS31', label: 'Flue sealing and flashings weatherproof only — not decorative' },
      { id: 'ARS32', code: 'ARS32', label: 'Existing holes or redundant flues made safe and sealed where practical' }
    ]
  },
  {
    id: 'access',
    label: 'Access',
    options: [
      { id: 'ARS33', code: 'ARS33', label: 'Safe access provided for installation only — permanent access is customer responsibility' },
      { id: 'ARS34', code: 'ARS34', label: 'Loft must be boarded, lit, and safe before works commence' },
      { id: 'ARS35', code: 'ARS35', label: 'Working at height precautions apply — scaffold or tower may be required' },
      { id: 'ARS36', code: 'ARS36', label: 'No work above safe height without suitable equipment' }
    ]
  },
  {
    id: 'customer',
    label: 'Customer',
    options: [
      { id: 'ARS37', code: 'ARS37', label: 'Customer to clear working area and ensure safe access' },
      { id: 'ARS38', code: 'ARS38', label: 'Pets to be contained during works' },
      { id: 'ARS39', code: 'ARS39', label: 'Noise, dust, and disruption unavoidable during installation' },
      { id: 'ARS40', code: 'ARS40', label: 'Water and heating supply may be temporarily unavailable during works' },
      { id: 'ARS41', code: 'ARS41', label: 'Customer responsible for redecorating or boxing in after completion' }
    ]
  },
  {
    id: 'general',
    label: 'General',
    options: [
      { id: 'ARS42', code: 'ARS42', label: 'All works carried out to Gas Safe and Building Regs at time of install' },
      { id: 'ARS43', code: 'ARS43', label: 'Manufacturer warranty subject to annual service' },
      { id: 'ARS44', code: 'ARS44', label: 'No liability for pre-existing faults or unrelated plumbing issues' },
      { id: 'ARS45', code: 'ARS45', label: 'Installation performance depends on system design and existing pipework' },
      { id: 'ARS46', code: 'ARS46', label: 'Recommendations given in good faith based on visible inspection' }
    ]
  }
];

const AWARENESS_OPTION_DETAILS = AWARENESS_SECTIONS.flatMap(section =>
  section.options.map(option => ({ ...option, section: section.label }))
);
const AWARENESS_DETAIL_LOOKUP = new Map(
  AWARENESS_OPTION_DETAILS.map(option => [option.id, option])
);

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
  { id: 'lounge', label: 'Lounge', top: 62, left: 90 },
  { id: 'existing-location', label: 'Existing', top: 86, left: 30 },
  { id: 'other-location', label: 'Other', top: 86, left: 70 }
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
  zoningLayout: '',
  makingGood: new Set(),
  buildingWork: new Set(),
  condensateRoutes: new Set(),
  systemUpgrades: new Map(),
  cylinderSelections: new Set(),
  customerControls: new Set(),
  disruptionRooms: new Set(),
  doubleLiftItems: new Set(),
  permissions: new Set(),
  hazards: new Set(),
  pipework: new Map(PIPEWORK_SECTIONS.map(section => [section.id, new Set()])),
  disruptionNotes: new Set(),
  powerflushSelection: '',
  customerActions: new Set(),
  awarenessSelections: new Map(AWARENESS_SECTIONS.map(section => [section.id, new Set()])),
  flueRoute: []
};

const PLANNER_FLUE_TYPE_VALUES = {
  'fanned-horizontal': 'Fanned horizontal',
  'fanned-vertical': 'Fanned vertical'
};

const PLANNER_FLUE_EXIT_VALUES = {
  'rear-wall': 'Rear wall',
  'side-wall': 'Side wall',
  roof: 'Roof'
};

const PLANNER_NEW_FLUE_VALUES = {
  'new-flue-horizontal': 'Horizontal',
  'new-flue-vertical': 'Vertical'
};

const labelLookup = new Map([
  ...ACCESS_OPTIONS.map(option => [option.id, option.label]),
  ...BOILER_OPTIONS.map(option => [option.id, option.label]),
  ...NEW_BOILER_OPTIONS.map(option => [option.id, option.label]),
  ...FLUE_TYPES.map(option => [option.id, option.label]),
  ...FLUE_EXIT_POINTS.map(option => [option.id, option.label]),
  ...NEW_FLUE_DIRECTIONS.map(option => [option.id, option.label]),
  ...ZONING_OPTIONS.map(option => [option.id, option.label]),
  ...LOCATION_SPOTS.map(option => [option.id, option.label]),
  ...MAKING_GOOD_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}: ${option.description}`]),
  ...BUILDING_WORK_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}: ${option.description}`]),
  ...CONDENSATE_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}: ${option.description}`]),
  ...SYSTEM_UPGRADE_OPTIONS.map(option => [option.id, option.label]),
  ...CYLINDER_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}`]),
  ...CONTROL_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}`]),
  ...DOUBLE_LIFT_OPTIONS.map(option => [option.id, option.label]),
  ...PERMISSION_OPTIONS.map(option => [option.id, option.label]),
  ...HAZARD_OPTIONS.map(option => [option.id, option.label]),
  ...PIPEWORK_OPTION_DETAILS.map(option => [option.id, `${option.code} – ${option.section}: ${option.label}`]),
  ...DISRUPTION_CODES.map(option => [option.id, `${option.code} – ${option.label}: ${option.description}`]),
  ...POWERFLUSH_OPTIONS.map(option => [option.id, option.code ? `${option.code} – ${option.label}` : option.label]),
  ...CUSTOMER_ACTIONS.map(option => [option.id, `${option.code} – ${option.description}`]),
  ...AWARENESS_OPTION_DETAILS.map(option => [option.id, `${option.code} – ${option.section}: ${option.label}`])
]);

const STEP_NOTES_STORAGE_KEY = 'surveyStepNotes';
let stepNotesState = {};

function loadStoredStepNotes() {
  try {
    const stored = window.localStorage.getItem(STEP_NOTES_STORAGE_KEY);
    if (!stored) {
      return {};
    }
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.warn('Unable to load stored step notes', error);
    return {};
  }
}

function persistStepNotesState() {
  try {
    const keys = Object.keys(stepNotesState);
    if (!keys.length) {
      window.localStorage.removeItem(STEP_NOTES_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STEP_NOTES_STORAGE_KEY, JSON.stringify(stepNotesState));
  } catch (error) {
    console.warn('Unable to store step notes', error);
  }
}

function handleStepNoteInput(noteKey, value) {
  if (value && value.trim().length) {
    stepNotesState[noteKey] = value;
  } else {
    delete stepNotesState[noteKey];
  }
  persistStepNotesState();
}

function clearStepNotesState() {
  stepNotesState = {};
  try {
    window.localStorage.removeItem(STEP_NOTES_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear stored step notes', error);
  }
}

function injectStepNotes() {
  stepNotesState = loadStoredStepNotes();
  const panels = Array.from(document.querySelectorAll('.content .panel'));
  panels.forEach((panel, index) => {
    if (!panel.id) {
      panel.id = `step-section-${index + 1}`;
    }
    if (panel.querySelector('.step-notes')) {
      return;
    }
    const noteKey = panel.id;
    const textareaId = `${noteKey}-notes`;
    const wrapper = document.createElement('div');
    wrapper.className = 'step-notes';

    const label = document.createElement('label');
    label.className = 'step-notes-label';
    label.setAttribute('for', textareaId);
    label.textContent = 'Notes';

    const textarea = document.createElement('textarea');
    textarea.className = 'step-notes-input';
    textarea.id = textareaId;
    textarea.name = textareaId;
    textarea.rows = 3;
    textarea.placeholder = 'Type notes for this step…';
    textarea.value = stepNotesState[noteKey] || '';
    textarea.addEventListener('input', event => {
      handleStepNoteInput(noteKey, event.target.value);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(textarea);
    panel.appendChild(wrapper);
  });
}

function updateTopBarHeightVar() {
  const height = topBarElement ? topBarElement.offsetHeight : 0;
  document.documentElement.style.setProperty('--top-bar-height', `${height}px`);
}

function persistPlannerValue(key, value) {
  try {
    if (value == null || value === '') {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn(`Unable to store planner key ${key}`, error);
  }
}

function storeLabelForSelection(key, optionId) {
  const label = optionId ? (labelLookup.get(optionId) || optionId) : '';
  persistPlannerValue(key, label);
}

function updateCylinderPlannerStorage() {
  let cylinderA = '';
  let cylinderB = '';
  const selections = state.cylinderSelections;
  const hasSelections = selections.size > 0;

  if (selections.has('CY03')) {
    cylinderA = 'VENTED_TANKED';
    cylinderB = 'NONE';
  }

  if (selections.has('CY02')) {
    cylinderA = 'VENTED_TANKED';
    if (!cylinderB) {
      cylinderB = 'VENTED_TANKED';
    }
  }

  if (selections.has('CY01')) {
    cylinderA = cylinderA || 'VENTED_TANKED';
  }

  if (selections.has('CY04')) {
    cylinderB = 'UNVENTED_MAINS';
  }

  if (selections.has('CY05')) {
    cylinderB = 'VENTED_TANKED';
  }

  if (selections.has('CY06')) {
    cylinderB = 'THERMAL_STORE';
  }

  const newBoilerLabel = state.newBoilerType ? (labelLookup.get(state.newBoilerType) || '') : '';
  if (!cylinderB && newBoilerLabel.toLowerCase().includes('combi')) {
    cylinderB = 'NONE';
  }

  if (!cylinderA && hasSelections) {
    cylinderA = 'VENTED_TANKED';
  }

  persistPlannerValue('CylA', cylinderA);
  persistPlannerValue('CylB', cylinderB);
}

let stepSections = [];
let stepNavButtons = [];
let currentStepIndex = 0;
let stepProgressLabel = null;
let prevStepButton = null;
let nextStepButton = null;
let topBarElement = null;

document.addEventListener('DOMContentLoaded', () => {
  topBarElement = document.querySelector('.top-bar');
  updateTopBarHeightVar();
  window.addEventListener('resize', updateTopBarHeightVar);
  renderAccessOptions();
  renderBoilerOptions();
  renderFlueOptions();
  renderHotspotGroup('houseHotspots', 'location');
  renderHotspotGroup('newHouseHotspots', 'newBoilerLocation');
  renderNewBoilerOptions();
  renderNewFlueDirections();
  renderZoningOptions();
  renderMakingGoodOptions();
  renderBuildingWorkOptions();
  renderCondensateOptions();
  renderSystemUpgradeOptions();
  renderCylinderOptions();
  renderControlOptions();
  renderDoubleLiftOptions();
  renderPermissionOptions();
  renderHazardOptions();
  renderPipeworkOptions();
  renderDisruptionCodeOptions();
  renderPowerflushOptions();
  renderCustomerActionOptions();
  renderAwarenessOptions();
  renderDisruptionHotspots('disruptionHotspots', 'disruptionRooms');
  initFlueBuilder();
  injectStepNotes();
  initStepNavigation();
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
  if (!container) return;
  container.innerHTML = '';
  container.classList.add('visual-grid');
  BOILER_OPTIONS.forEach(option => {
    const tile = createRadioTile('boiler', option, selectedId => {
      state.boilerType = selectedId;
      syncChoiceTiles(container, selectedId);
      updateSummary();
      persistPlannerValue('BlrA', option.label);
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
  typeGroup.classList.add('visual-grid');
  exitGroup.classList.add('visual-grid');

  FLUE_TYPES.forEach(option => {
    const tile = createRadioTile('flue-type', option, selectedId => {
      state.flueType = selectedId;
      syncChoiceTiles(typeGroup, selectedId);
      updateSummary();
      const storedValue = PLANNER_FLUE_TYPE_VALUES[selectedId] || option.label || selectedId;
      persistPlannerValue('FluA', storedValue);
    });
    typeGroup.appendChild(tile);
  });
  syncChoiceTiles(typeGroup, state.flueType);

  FLUE_EXIT_POINTS.forEach(option => {
    const tile = createRadioTile('flue-exit', option, selectedId => {
      state.flueExit = selectedId;
      syncChoiceTiles(exitGroup, selectedId);
      updateSummary();
      const storedValue = PLANNER_FLUE_EXIT_VALUES[selectedId] || option.label || selectedId;
      persistPlannerValue('TermWall', storedValue);
    });
    exitGroup.appendChild(tile);
  });
  syncChoiceTiles(exitGroup, state.flueExit);
}

function renderMakingGoodOptions() {
  const container = document.getElementById('makingGoodChoices');
  if (!container) return;
  container.innerHTML = '';
  container.classList.add('visual-grid');
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
  container.classList.add('visual-grid');
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
      persistPlannerValue('BlrB', option.label);
      updateCylinderPlannerStorage();
    });
    container.appendChild(tile);
  });
  syncChoiceTiles(container, state.newBoilerType);
}

function renderNewFlueDirections() {
  const container = document.getElementById('newFlueDirectionChoices');
  if (!container) return;
  container.innerHTML = '';
  container.classList.add('visual-grid');
  NEW_FLUE_DIRECTIONS.forEach(option => {
    const tile = createRadioTile('new-flue-direction', option, selectedId => {
      state.newFlueDirection = selectedId;
      syncChoiceTiles(container, selectedId);
      updateSummary();
      const storedValue = PLANNER_NEW_FLUE_VALUES[selectedId] || option.label || selectedId;
      persistPlannerValue('FluB', storedValue);
    });
    container.appendChild(tile);
  });
  syncChoiceTiles(container, state.newFlueDirection);
}

function renderZoningOptions() {
  const container = document.getElementById('zoningChoices');
  if (!container) return;
  container.innerHTML = '';
  container.classList.add('visual-grid');
  ZONING_OPTIONS.forEach(option => {
    const tile = createRadioTile('zoning-layout', option, selectedId => {
      state.zoningLayout = selectedId;
      syncChoiceTiles(container, selectedId);
      updateSummary();
      storeLabelForSelection('ZoneLayout', selectedId);
    });
    container.appendChild(tile);
  });
  syncChoiceTiles(container, state.zoningLayout);
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

function renderDoubleLiftOptions() {
  const container = document.getElementById('doubleLiftChoices');
  if (!container) return;
  container.innerHTML = '';
  DOUBLE_LIFT_OPTIONS.forEach(option => {
    const tile = createCheckboxTile('double-lift', option, (optionId, checked) => {
      toggleSetSelection(state.doubleLiftItems, optionId, checked, 'double-none');
      syncCheckboxTiles(container, state.doubleLiftItems);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.doubleLiftItems);
}

function renderPermissionOptions() {
  const container = document.getElementById('permissionChoices');
  if (!container) return;
  container.innerHTML = '';
  PERMISSION_OPTIONS.forEach(option => {
    const tile = createCheckboxTile('permissions', option, (optionId, checked) => {
      toggleSetSelection(state.permissions, optionId, checked, 'perm-none');
      syncCheckboxTiles(container, state.permissions);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.permissions);
}

function renderHazardOptions() {
  const container = document.getElementById('hazardChoices');
  if (!container) return;
  container.innerHTML = '';
  HAZARD_OPTIONS.forEach(option => {
    const tile = createCheckboxTile('hazards', option, (optionId, checked) => {
      if (checked) {
        state.hazards.add(optionId);
      } else {
        state.hazards.delete(optionId);
      }
      syncCheckboxTiles(container, state.hazards);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.hazards);
}

function renderPipeworkOptions() {
  const container = document.getElementById('pipeworkSections');
  if (!container) return;
  container.innerHTML = '';
  PIPEWORK_SECTIONS.forEach(section => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'fieldset subfieldset';
    const legend = document.createElement('legend');
    legend.textContent = section.label;
    fieldset.appendChild(legend);

    const choiceGroup = document.createElement('div');
    choiceGroup.className = 'choice-group';
    choiceGroup.dataset.pipeworkGroup = section.id;

    section.options.forEach(option => {
      const tile = createCheckboxTile(`pipe-${section.id}`, option, (optionId, checked) => {
        const sectionSet = state.pipework.get(section.id) || new Set();
        if (checked) {
          sectionSet.add(optionId);
        } else {
          sectionSet.delete(optionId);
        }
        state.pipework.set(section.id, sectionSet);
        syncCheckboxTiles(choiceGroup, sectionSet);
        updateSummary();
      });
      choiceGroup.appendChild(tile);
    });

    const sectionSet = state.pipework.get(section.id) || new Set();
    syncCheckboxTiles(choiceGroup, sectionSet);

    fieldset.appendChild(choiceGroup);
    container.appendChild(fieldset);
  });
}

function renderDisruptionCodeOptions() {
  const container = document.getElementById('disruptionCodeChoices');
  if (!container) return;
  container.innerHTML = '';
  DISRUPTION_CODES.forEach(option => {
    const tile = createCheckboxTile('disruption-codes', option, (optionId, checked) => {
      if (checked) {
        state.disruptionNotes.add(optionId);
      } else {
        state.disruptionNotes.delete(optionId);
      }
      syncCheckboxTiles(container, state.disruptionNotes);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.disruptionNotes);
}

function renderPowerflushOptions() {
  const container = document.getElementById('powerflushChoices');
  if (!container) return;
  container.innerHTML = '';
  POWERFLUSH_OPTIONS.forEach(option => {
    const tile = createRadioTile('powerflush', option, selectedId => {
      state.powerflushSelection = selectedId;
      syncChoiceTiles(container, selectedId);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncChoiceTiles(container, state.powerflushSelection);
}

function renderCustomerActionOptions() {
  const container = document.getElementById('customerActionChoices');
  if (!container) return;
  container.innerHTML = '';
  CUSTOMER_ACTIONS.forEach(option => {
    const tile = createCheckboxTile('customer-actions', option, (optionId, checked) => {
      if (checked) {
        state.customerActions.add(optionId);
      } else {
        state.customerActions.delete(optionId);
      }
      syncCheckboxTiles(container, state.customerActions);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.customerActions);
}

function renderAwarenessOptions() {
  const container = document.getElementById('awarenessSections');
  if (!container) return;
  container.innerHTML = '';
  AWARENESS_SECTIONS.forEach(section => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'fieldset subfieldset';
    const legend = document.createElement('legend');
    legend.textContent = section.label;
    fieldset.appendChild(legend);

    const choiceGroup = document.createElement('div');
    choiceGroup.className = 'choice-group';
    choiceGroup.dataset.awarenessGroup = section.id;

    section.options.forEach(option => {
      const tile = createCheckboxTile(`awareness-${section.id}`, option, (optionId, checked) => {
        const sectionSet = state.awarenessSelections.get(section.id) || new Set();
        if (checked) {
          sectionSet.add(optionId);
        } else {
          sectionSet.delete(optionId);
        }
        state.awarenessSelections.set(section.id, sectionSet);
        syncCheckboxTiles(choiceGroup, sectionSet);
        updateSummary();
      });
      choiceGroup.appendChild(tile);
    });

    const sectionSet = state.awarenessSelections.get(section.id) || new Set();
    syncCheckboxTiles(choiceGroup, sectionSet);

    fieldset.appendChild(choiceGroup);
    container.appendChild(fieldset);
  });
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
      if (stateKey === 'location') {
        storeLabelForSelection('LocA', state[stateKey]);
      } else if (stateKey === 'newBoilerLocation') {
        storeLabelForSelection('LocB', state[stateKey]);
      }
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
  const hasImage = Boolean(option.image);
  if (hasImage) {
    tile.classList.add('visual-choice');
  }
  const inputId = `${groupName}-${option.id}`;
  const labelContent = hasImage
    ? `
      ${option.code ? `<span class="tile-badge">${option.code}</span>` : ''}
      <figure>
        <img src="${option.image}" alt="${option.alt || option.label}">
        <figcaption>
          <strong>${option.label}</strong>
          ${option.description ? `<span>${option.description}</span>` : ''}
        </figcaption>
      </figure>
    `
    : `
      ${option.code ? `<span class="tile-badge">${option.code}</span>` : ''}
      ${option.icon ? `<span class="tile-icon">${option.icon}</span>` : ''}
      <span class="tile-copy">
        <strong>${option.label}</strong>
        ${option.description ? `<span>${option.description}</span>` : ''}
      </span>
    `;
  tile.innerHTML = `
    <input type="radio" name="${groupName}" id="${inputId}" value="${option.id}">
    <label for="${inputId}">
      ${labelContent}
    </label>
  `;
  const input = tile.querySelector('input');
  input.addEventListener('change', () => {
    onSelect(option.id);
  });
  return tile;
}

function toggleSetSelection(targetSet, optionId, checked, noneOptionId) {
  if (checked) {
    if (noneOptionId && optionId === noneOptionId) {
      targetSet.clear();
      targetSet.add(optionId);
    } else {
      if (noneOptionId) {
        targetSet.delete(noneOptionId);
      }
      targetSet.add(optionId);
    }
  } else {
    targetSet.delete(optionId);
  }
}

function createCheckboxTile(groupName, option, onToggle) {
  const tile = document.createElement('div');
  tile.className = 'choice-tile';
  const hasImage = Boolean(option.image);
  if (hasImage) {
    tile.classList.add('visual-choice');
  }
  const inputId = `${groupName}-${option.id}`;
  const labelContent = hasImage
    ? `
      ${option.code ? `<span class="tile-badge">${option.code}</span>` : ''}
      <figure>
        <img src="${option.image}" alt="${option.alt || option.label}">
        <figcaption>
          <strong>${option.label}</strong>
          ${option.description ? `<span>${option.description}</span>` : ''}
        </figcaption>
      </figure>
    `
    : `
      ${option.code ? `<span class="tile-badge">${option.code}</span>` : ''}
      ${option.icon ? `<span class="tile-icon">${option.icon}</span>` : ''}
      <span class="tile-copy">
        <strong>${option.label}</strong>
        ${option.description ? `<span>${option.description}</span>` : ''}
      </span>
    `;
  tile.innerHTML = `
    <input type="checkbox" name="${groupName}" id="${inputId}" value="${option.id}">
    <label for="${inputId}">
      ${labelContent}
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

function ensureSemicolons(text) {
  if (text == null) {
    return '';
  }

  return String(text)
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        return line;
      }
      if (trimmed.endsWith(';') || trimmed.endsWith(':')) {
        return line;
      }
      const leadingWhitespace = (line.match(/^\s*/) || [''])[0];
      const withoutTrailing = trimmed.replace(/;+$/, '');
      return `${leadingWhitespace}${withoutTrailing};`;
    })
    .join('\n');
}

function formatBulletList(items) {
  if (!items.length) {
    return '';
  }
  return items
    .map(item => ensureSemicolons(`• ${item}`))
    .join('\n');
}

function formatSectionedList(sections) {
  if (!sections.length) {
    return '';
  }
  const content = sections
    .map(section => {
      const bulletText = formatBulletList(section.items || []);
      if (!bulletText.trim().length) {
        return '';
      }
      const headingLine = ensureSemicolons(`${section.heading}:`);
      return `${headingLine}\n${bulletText}`;
    })
    .filter(Boolean)
    .join('\n\n');
  return ensureSemicolons(content);
}

function fallbackText(text, fallback) {
  return text && text.trim().length ? text : fallback;
}

function buildOutputText(value, fallback) {
  return ensureSemicolons(fallbackText(value, fallback));
}

function initStepNavigation() {
  const shortcutList = document.getElementById('stepShortcuts');
  if (!shortcutList) {
    return;
  }

  stepSections = Array.from(document.querySelectorAll('.content .panel'));
  if (!stepSections.length) {
    shortcutList.innerHTML = '';
    return;
  }

  prevStepButton = document.getElementById('prevStep');
  nextStepButton = document.getElementById('nextStep');
  stepProgressLabel = document.getElementById('stepProgressLabel');

  if (prevStepButton) {
    prevStepButton.addEventListener('click', () => {
      showStep(currentStepIndex - 1);
    });
  }

  if (nextStepButton) {
    nextStepButton.addEventListener('click', () => {
      showStep(currentStepIndex + 1);
    });
  }

  shortcutList.innerHTML = '';
  stepNavButtons = stepSections.map((section, index) => {
    const listItem = document.createElement('li');
    const stepLabelElement = section.querySelector('.step-count');
    const headingElement = section.querySelector('h2');
    const stepLabel = stepLabelElement ? stepLabelElement.textContent.trim() : `Step ${index + 1}`;
    const titleLabel = headingElement ? headingElement.textContent.trim() : '';
    if (!section.id) {
      section.id = `step-section-${index + 1}`;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'step-nav-button';
    button.innerHTML = `
      <span class="step-nav-number">${stepLabel}</span>
      <span class="step-nav-title">${titleLabel}</span>
    `;
    button.setAttribute('aria-controls', section.id);
    button.addEventListener('click', () => showStep(index));
    listItem.appendChild(button);
    shortcutList.appendChild(listItem);
    return button;
  });

  const initialHash = window.location.hash.replace(/^#/, '');
  if (initialHash) {
    const initialIndex = stepSections.findIndex(section => section.id === initialHash);
    if (initialIndex >= 0) {
      currentStepIndex = initialIndex;
    }
  }

  showStep(currentStepIndex, { scroll: false, focus: false, smooth: false });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) {
      return;
    }
    const targetIndex = stepSections.findIndex(section => section.id === hash);
    if (targetIndex >= 0 && targetIndex !== currentStepIndex) {
      showStep(targetIndex, { scroll: false, focus: false, smooth: false });
    }
  });
}

function showStep(index, options = {}) {
  if (!stepSections.length) {
    return;
  }

  const { scroll = true, focus = true, smooth = true } = options;
  const targetIndex = Math.max(0, Math.min(index, stepSections.length - 1));
  currentStepIndex = targetIndex;

  stepSections.forEach((section, idx) => {
    const isActive = idx === currentStepIndex;
    section.hidden = !isActive;
    section.classList.toggle('is-active', isActive);
    const heading = section.querySelector('h2');
    if (heading) {
      if (isActive) {
        heading.setAttribute('tabindex', '-1');
      } else if (heading.hasAttribute('tabindex')) {
        heading.removeAttribute('tabindex');
      }
    }
  });

  stepNavButtons.forEach((button, idx) => {
    if (!button) {
      return;
    }
    const isActive = idx === currentStepIndex;
    button.classList.toggle('is-active', isActive);
    if (isActive) {
      button.setAttribute('aria-current', 'page');
      button.setAttribute('aria-pressed', 'true');
    } else {
      button.removeAttribute('aria-current');
      button.setAttribute('aria-pressed', 'false');
    }
  });

  const activeSection = stepSections[currentStepIndex];
  if (!activeSection) {
    return;
  }

  if (stepProgressLabel) {
    stepProgressLabel.textContent = `Step ${currentStepIndex + 1} of ${stepSections.length}`;
  }

  if (prevStepButton) {
    prevStepButton.disabled = currentStepIndex === 0;
  }

  if (nextStepButton) {
    const isLastStep = currentStepIndex === stepSections.length - 1;
    nextStepButton.disabled = isLastStep;
    nextStepButton.textContent = isLastStep ? 'Survey complete' : 'Next step';
  }

  if (activeSection.id) {
    const newHash = `#${activeSection.id}`;
    if (window.location.hash !== newHash) {
      if (window.history && typeof window.history.replaceState === 'function') {
        window.history.replaceState(null, '', newHash);
      } else {
        window.location.hash = newHash;
      }
    }
  }

  if (scroll) {
    const offset = topBarElement ? topBarElement.offsetHeight + 24 : 16;
    const targetTop = window.scrollY + activeSection.getBoundingClientRect().top - offset;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  if (focus) {
    const heading = activeSection.querySelector('h2');
    if (heading && typeof heading.focus === 'function') {
      heading.focus();
    }
  }
}

function persistOutputState(payload) {
  try {
    window.localStorage.setItem('surveyOutput', JSON.stringify(payload));
  } catch (error) {
    console.warn('Unable to store survey output', error);
  }
}

function updateSummary() {
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
  const doubleLiftList = Array.from(state.doubleLiftItems).map(id => labelLookup.get(id));
  const permissionList = Array.from(state.permissions).map(id => labelLookup.get(id));
  const hazardList = Array.from(state.hazards).map(id => labelLookup.get(id));
  const pipeworkSections = PIPEWORK_SECTIONS.map(section => {
    const selected = Array.from(state.pipework.get(section.id) || []);
    if (!selected.length) {
      return null;
    }
    const items = selected.map(optionId => {
      const detail = PIPEWORK_DETAIL_LOOKUP.get(optionId);
      return detail ? `${detail.code} – ${detail.label}` : labelLookup.get(optionId);
    });
    return { heading: section.label, items };
  }).filter(Boolean);
  const pipeworkSummaryList = pipeworkSections.flatMap(section => section.items.map(item => `${section.heading}: ${item}`));
  const disruptionCodeList = Array.from(state.disruptionNotes).map(id => labelLookup.get(id));
  const powerflushSelection = state.powerflushSelection ? labelLookup.get(state.powerflushSelection) : 'Not recorded';
  const customerActionList = Array.from(state.customerActions).map(id => labelLookup.get(id));
  const awarenessSections = AWARENESS_SECTIONS.map(section => {
    const selected = Array.from(state.awarenessSelections.get(section.id) || []);
    if (!selected.length) {
      return null;
    }
    const items = selected.map(optionId => {
      const detail = AWARENESS_DETAIL_LOOKUP.get(optionId);
      return detail ? `${detail.code} – ${detail.label}` : labelLookup.get(optionId);
    });
    return { heading: section.label, items };
  }).filter(Boolean);
  const awarenessSummaryList = awarenessSections.flatMap(section => section.items.map(item => `${section.heading}: ${item}`));

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
      label: 'Zoning layout',
      value: state.zoningLayout ? labelLookup.get(state.zoningLayout) : 'Not recorded'
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
      label: 'Two-person lift items',
      value: doubleLiftList.length ? doubleLiftList.join(', ') : 'Not recorded'
    },
    {
      label: 'Permissions',
      value: permissionList.length ? permissionList.join(', ') : 'Not recorded'
    },
    {
      label: 'Hazards',
      value: hazardList.length ? hazardList.join(', ') : 'Not recorded'
    },
    {
      label: 'Pipework notes',
      value: pipeworkSummaryList.length ? pipeworkSummaryList.join(' | ') : 'Not recorded'
    },
    {
      label: 'Disruption requirements',
      value: disruptionCodeList.length ? disruptionCodeList.join(', ') : 'Not recorded'
    },
    {
      label: 'Powerflushing requirements',
      value: powerflushSelection
    },
    {
      label: 'Customer actions',
      value: customerActionList.length ? customerActionList.join(', ') : 'Not recorded'
    },
    {
      label: 'Awareness items',
      value: awarenessSummaryList.length ? awarenessSummaryList.join(' | ') : 'Not recorded'
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

  const newBoilerLines = [
    `Existing boiler location: ${state.location ? labelLookup.get(state.location) : 'Not recorded'}`,
    `New boiler location: ${state.newBoilerLocation ? labelLookup.get(state.newBoilerLocation) : 'Not recorded'}`,
    `New boiler type: ${state.newBoilerType ? labelLookup.get(state.newBoilerType) : 'Not recorded'}`,
    `Condensate works: ${condensateList.length ? condensateList.join(', ') : 'Not recorded'}`,
    `System upgrades: ${upgradeList.length ? upgradeList.join(', ') : 'Not recorded'}`,
    `Zoning layout: ${state.zoningLayout ? labelLookup.get(state.zoningLayout) : 'Not recorded'}`,
    `Cylinder works: ${cylinderList.length ? cylinderList.join(', ') : 'Not recorded'}`,
    `Controls: ${controlList.length ? controlList.join(', ') : 'Not recorded'}`
  ];

  const flueLines = [
    `Existing flue type: ${state.flueType ? labelLookup.get(state.flueType) : 'Not recorded'}`,
    `Flue exit point: ${state.flueExit ? labelLookup.get(state.flueExit) : 'Not recorded'}`,
    `New flue direction: ${state.newFlueDirection ? labelLookup.get(state.newFlueDirection) : 'Not recorded'}`,
    `Making good: ${makingGoodList.length ? makingGoodList.join(', ') : 'Not recorded'}`
  ];

  const disruptionSections = [];
  if (disruptionCodeList.length) {
    disruptionSections.push({ heading: 'Requirements', items: disruptionCodeList });
  }
  if (state.powerflushSelection) {
    disruptionSections.push({ heading: 'Powerflushing', items: [powerflushSelection] });
  }
  if (disruptionList.length) {
    disruptionSections.push({ heading: 'Rooms affected', items: disruptionList });
  }

  const systemCharacteristicsLines = summaryItems.map(item => `${item.label}: ${item.value}`);

  const restrictionsLines = [...permissionList, 'It is the customers responsibility to ensure these permissions are granted.'];

  const outputPayload = {
    workingAtHeights: buildOutputText(formatBulletList(accessList), 'No items recorded.'),
    systemCharacteristics: buildOutputText(formatBulletList(systemCharacteristicsLines), 'No items recorded.'),
    assistanceComponents: buildOutputText(formatBulletList(doubleLiftList), 'No items recorded.'),
    restrictions: buildOutputText(formatBulletList(restrictionsLines), 'It is the customers responsibility to ensure these permissions are granted.'),
    externalHazards: buildOutputText(formatBulletList(hazardList), 'No items recorded.'),
    newBoilerAndControls: buildOutputText(formatBulletList(newBoilerLines), 'No items recorded.'),
    flue: buildOutputText(formatBulletList(flueLines), 'No items recorded.'),
    pipework: buildOutputText(formatSectionedList(pipeworkSections), 'No items recorded.'),
    disruption: buildOutputText(formatSectionedList(disruptionSections), 'No items recorded.'),
    customerAgreedActions: buildOutputText(formatBulletList(customerActionList), 'No items recorded.'),
    additional: buildOutputText(formatSectionedList(awarenessSections), 'No items recorded.')
  };

  persistOutputState(outputPayload);
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
  state.zoningLayout = '';
  state.makingGood.clear();
  state.buildingWork.clear();
  state.condensateRoutes.clear();
  state.systemUpgrades.clear();
  state.cylinderSelections.clear();
  state.customerControls.clear();
  state.disruptionRooms.clear();
  state.doubleLiftItems.clear();
  state.permissions.clear();
  state.hazards.clear();
  state.pipework.forEach(set => set.clear());
  state.disruptionNotes.clear();
  state.powerflushSelection = '';
  state.customerActions.clear();
  state.awarenessSelections.forEach(set => set.clear());
  state.flueRoute = [];
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.checked = false;
  });
  ['BlrA','FluA','TermWall','TermHeight','LocA','LocB','BlrB','FluB','CylA','CylB','ZoneLayout'].forEach(key => {
    persistPlannerValue(key, '');
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
  syncCheckboxTiles(document.getElementById('doubleLiftChoices'), state.doubleLiftItems);
  syncCheckboxTiles(document.getElementById('permissionChoices'), state.permissions);
  syncCheckboxTiles(document.getElementById('hazardChoices'), state.hazards);
  syncCheckboxTiles(document.getElementById('disruptionCodeChoices'), state.disruptionNotes);
  syncChoiceTiles(document.getElementById('powerflushChoices'), state.powerflushSelection);
  syncCheckboxTiles(document.getElementById('customerActionChoices'), state.customerActions);
  syncChoiceTiles(document.getElementById('zoningChoices'), state.zoningLayout);
  document.querySelectorAll('[data-pipework-group]').forEach(group => {
    const sectionId = group.dataset.pipeworkGroup;
    const sectionSet = state.pipework.get(sectionId) || new Set();
    syncCheckboxTiles(group, sectionSet);
  });
  document.querySelectorAll('[data-awareness-group]').forEach(group => {
    const sectionId = group.dataset.awarenessGroup;
    const sectionSet = state.awarenessSelections.get(sectionId) || new Set();
    syncCheckboxTiles(group, sectionSet);
  });
  syncSystemUpgradeCards();
  document.querySelectorAll('.step-notes-input').forEach(textarea => {
    textarea.value = '';
  });
  clearStepNotesState();
  updateFlueBuilder();
  if (stepSections.length) {
    showStep(0, { scroll: true, smooth: false, focus: false });
  }
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
