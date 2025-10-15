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

const LIFT_OPTIONS = [
  { id: 'lift-none', label: 'None', description: 'No double-handed lifts required.' },
  { id: 'lift-old-boiler', label: 'Old boiler', description: 'Existing boiler removal requires two people.' },
  { id: 'lift-new-boiler', label: 'New boiler', description: 'Replacement boiler lift requires two people.' },
  { id: 'lift-cylinder', label: 'Cylinder', description: 'Cylinder handling requires two people.' },
  { id: 'lift-heavy-rads', label: 'Heavy rads', description: 'Heavy radiators require two-person lift.' },
  { id: 'lift-boiler-loft', label: 'Boiler in loft', description: 'Loft boiler install needs two-person lift.' }
];

const PERMISSION_OPTIONS = [
  { id: 'perm-none', label: 'None', description: 'No special permissions required.' },
  { id: 'perm-flat', label: 'Flat', description: 'Flat – permissions from building management required.' },
  { id: 'perm-listed', label: 'Listed', description: 'Listed building consent required.' },
  { id: 'perm-conservation', label: 'Conservation area', description: 'Conservation area consent required.' },
  { id: 'perm-gated', label: 'Gated community', description: 'Access arrangements needed for gated community.' }
];

const HAZARD_OPTIONS = [
  { id: 'haz-dogs', label: 'Dogs', description: 'Dogs present on site.' },
  { id: 'haz-other-pets', label: 'Other pets', description: 'Other pets present on site.' },
  { id: 'haz-clutter', label: 'Clutter', description: 'Cluttered working areas.' },
  { id: 'haz-hygiene', label: 'Hygiene issues', description: 'General hygiene concerns.' },
  { id: 'haz-animal-mess', label: 'Animal mess', description: 'Animal mess present.' },
  { id: 'haz-nesting-insects', label: 'Nesting insects', description: 'Active nesting insects observed.' },
  { id: 'haz-uneven-ground', label: 'Uneven ground', description: 'Uneven or unstable ground.' },
  { id: 'haz-small-spaces', label: 'Small working spaces', description: 'Confined working area.' }
];

const DISRUPTION_LEVEL_OPTIONS = [
  { id: 'DI01', code: 'DI01', label: 'Minimal', description: 'Minimal disruption expected.' },
  { id: 'DI02', code: 'DI02', label: 'Moderate – carpets lifted', description: 'Carpets lifted in working areas.' },
  { id: 'DI03', code: 'DI03', label: 'High – floors lifted', description: 'Floorboards lifted to complete works.' },
  { id: 'DI04', code: 'DI04', label: 'Preparation – customer to clear areas/routes', description: 'Customer must clear access routes.' },
  { id: 'DI05', code: 'DI05', label: 'Protection – dust protection required', description: 'Dust protection or sheeting required.' }
];

const CUSTOMER_ACTION_OPTIONS = [
  { id: 'CA01', code: 'CA01', label: 'Clear working areas', description: 'Customer to clear working areas.' },
  { id: 'CA02', code: 'CA02', label: 'Gain permission where required', description: 'Customer to obtain permissions.' },
  { id: 'CA03', code: 'CA03', label: 'Ensure animals are kept safely', description: 'Pets to be safely contained.' },
  { id: 'CA04', code: 'CA04', label: 'Remove cupboard', description: 'Customer to remove cupboard.' },
  { id: 'CA05', code: 'CA05', label: 'Rebuild cupboard', description: 'Customer to rebuild cupboard after works.' },
  { id: 'CA06', code: 'CA06', label: 'Remove old flue & weather seal', description: 'Customer to remove existing flue and seal.' },
  { id: 'CA07', code: 'CA07', label: 'Supply specified items', description: 'Customer to supply agreed items.' }
];

const PIPEWORK_SECTIONS = [
  {
    id: 'gas-supply',
    key: 'gasSupply',
    title: 'Gas supply',
    options: [
      { id: 'GR01', code: 'GR01', label: 'Upgrade to 22 mm', description: 'Gas supply to be upgraded to 22 mm.' },
      { id: 'GR02', code: 'GR02', label: 'Tightness test pass required', description: 'Tightness test confirmation required.' },
      { id: 'GR03', code: 'GR03', label: 'Meter location restricts route', description: 'Gas meter position restricts proposed route.' },
      { id: 'GR04', code: 'GR04', label: 'Internal reroute', description: 'Internal gas pipework reroute required.' },
      { id: 'GR05', code: 'GR05', label: 'External reroute', description: 'External gas pipework reroute required.' }
    ]
  },
  {
    id: 'meter-type',
    key: 'meterType',
    title: 'Meter type',
    options: [
      { id: 'GR06', code: 'GR06', label: 'U6 – inside', description: 'U6 meter located inside.' },
      { id: 'GR07', code: 'GR07', label: 'U6 – outside', description: 'U6 meter located outside.' }
    ]
  },
  {
    id: 'route-complexity',
    key: 'routeComplexity',
    title: 'Route complexity',
    options: [
      { id: 'GR08', code: 'GR08', label: 'Simple / local', description: 'Simple/local route with minimal changes.' },
      { id: 'GR09', code: 'GR09', label: 'Reuse existing', description: 'Reuse existing gas route where possible.' },
      { id: 'GR10', code: 'GR10', label: 'Upsize sections for capacity', description: 'Upsize sections for capacity requirements.' },
      { id: 'GR11', code: 'GR11', label: 'Complex (clipping / drilling / routing)', description: 'Complex routing including clipping and drilling.' }
    ]
  },
  {
    id: 'gas-notes',
    key: 'gasNotes',
    title: 'Gas notes',
    options: [
      { id: 'GR12', code: 'GR12', label: 'Replace meter tail lead', description: 'Replace meter tail lead required.' },
      { id: 'GR13', code: 'GR13', label: 'Pressure drop risk over length', description: 'Risk of pressure drop due to run length.' }
    ]
  },
  {
    id: 'gas-guidance',
    key: 'gasGuidance',
    title: 'Gas guidance',
    options: [
      { id: 'GAS50', code: 'GAS50', label: '≤28 kW = 22 mm at boiler; >28 kW = 28 mm', description: 'Rule-of-thumb sizing guidance.' },
      { id: 'GAS51', code: 'GAS51', label: 'Max 1 mbar drop from meter to appliance', description: 'Compliance requirement for pressure drop.' },
      { id: 'GAS52', code: 'GAS52', label: 'U6 ≈ 63 kW max; U16 ≈ 169 kW max', description: 'Aggregate load awareness for meter sizing.' },
      { id: 'GAS53', code: 'GAS53', label: 'Long runs/many bends increase resistance', description: 'Upsize pipework to minimise resistance.' },
      { id: 'GAS54', code: 'GAS54', label: 'Final pipe size confirmed at commissioning', description: 'Final sizing to be confirmed during commissioning.' }
    ]
  },
  {
    id: 'condensate',
    key: 'condensate',
    title: 'Condensate',
    options: [
      { id: 'CD01', code: 'CD01', label: 'Internal waste – P-trap present', description: 'Internal waste with P-trap already installed.' },
      { id: 'CD02', code: 'CD02', label: 'Internal waste – new trap required', description: 'Install new trap on internal waste.' },
      { id: 'CD03', code: 'CD03', label: 'External run – insulate (42 mm MI)', description: 'Insulate external run with 42 mm MI.' },
      { id: 'CD04', code: 'CD04', label: 'External run – replace with 42 mm (MI compliant)', description: 'Replace external run with 42 mm MI compliant pipe.' },
      { id: 'CD05', code: 'CD05', label: 'Condensate pump required', description: 'Install condensate pump.' },
      { id: 'CD06', code: 'CD06', label: 'Soakaway – 42 mm pipe', description: 'Install soakaway with 42 mm pipe.' },
      { id: 'CD07', code: 'CD07', label: 'Soakaway – Gravel trap', description: 'Provide gravel trap for soakaway.' },
      { id: 'CD08', code: 'CD08', label: 'Gradient – Fall correction required', description: 'Correct gradient for condensate run.' },
      { id: 'CD09', code: 'CD09', label: 'Upgrade – 32 mm → 42 mm (MI compliant)', description: 'Upgrade condensate from 32 mm to 42 mm.' },
      { id: 'CD10', code: 'CD10', label: 'Discharge – External soil stack – termination check', description: 'Check termination at external soil stack.' },
      { id: 'CD11', code: 'CD11', label: 'Neutraliser fitted (where required)', description: 'Install condensate neutraliser where required.' }
    ]
  },
  {
    id: 'discharge',
    key: 'discharge',
    title: 'Discharge',
    options: [
      { id: 'DS01', code: 'DS01', label: 'PRV discharge – Pipework to outside', description: 'PRV discharge pipe routed outside.' },
      { id: 'DS02', code: 'DS02', label: 'Tundish – Visible and compliant', description: 'Tundish positioned for visible discharge.' },
      { id: 'DS03', code: 'DS03', label: 'Route – Under floor to outside', description: 'Run discharge under floor to outside.' },
      { id: 'DS04', code: 'DS04', label: 'Route – Direct to outside', description: 'Discharge routes directly outside.' },
      { id: 'DS05', code: 'DS05', label: 'Route – Behind cupboards', description: 'Discharge routed behind cupboards.' },
      { id: 'DS06', code: 'DS06', label: 'Route – Through cupboards', description: 'Discharge routed through cupboards.' }
    ]
  },
  {
    id: 'water-services',
    key: 'waterServices',
    title: 'Water services',
    options: [
      { id: 'WS01', code: 'WS01', label: 'Increase pressure / flow', description: 'Increase incoming mains pressure/flow.' },
      { id: 'WS02', code: 'WS02', label: 'Pressure reducing valve required', description: 'Fit pressure reducing valve.' },
      { id: 'WS03', code: 'WS03', label: 'Secondary return present', description: 'Secondary return present on system.' },
      { id: 'WS04', code: 'WS04', label: 'Scale filter required', description: 'Install scale filter.' },
      { id: 'WS05', code: 'WS05', label: 'Stop tap / service valve access', description: 'Ensure access to stop tap/service valve.' },
      { id: 'WS06', code: 'WS06', label: 'Route to under-counter', description: 'Route pipework to under-counter location.' },
      { id: 'WS07', code: 'WS07', label: 'Route to airing cupboard', description: 'Route pipework to airing cupboard.' }
    ]
  }
];

const AWARENESS_SECTIONS = [
  {
    id: 'aw-system',
    title: 'System',
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
    id: 'aw-combi',
    title: 'Combi',
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
    id: 'aw-hot-water',
    title: 'Hot water',
    options: [
      { id: 'ARS15', code: 'ARS15', label: 'Stored cylinder water may take time to reheat' },
      { id: 'ARS16', code: 'ARS16', label: 'Mixergy or unvented cylinders require periodic servicing for safety' },
      { id: 'ARS17', code: 'ARS17', label: 'Unvented cylinder discharge tested and compliant at time of install only' },
      { id: 'ARS18', code: 'ARS18', label: 'Hot water recovery times vary depending on usage pattern' },
      { id: 'ARS19', code: 'ARS19', label: 'No liability for customer-supplied fixtures not designed for mains pressure' }
    ]
  },
  {
    id: 'aw-condensate',
    title: 'Condensate',
    options: [
      { id: 'ARS20', code: 'ARS20', label: 'Condensate routes external — insulated to reduce freezing risk, not guaranteed' },
      { id: 'ARS21', code: 'ARS21', label: 'External soakaway provided only where suitable drainage available' },
      { id: 'ARS22', code: 'ARS22', label: 'Customer responsible for maintaining condensate route clear and free-flowing' },
      { id: 'ARS23', code: 'ARS23', label: 'No responsibility for freezing if installation complies with manufacturer MI' }
    ]
  },
  {
    id: 'aw-controls',
    title: 'Controls',
    options: [
      { id: 'ARS24', code: 'ARS24', label: 'Controls installed in accordance with manufacturer’s instructions' },
      { id: 'ARS25', code: 'ARS25', label: 'Hive system can operate without Wi-Fi; only remote app access requires router connection and USB power' },
      { id: 'ARS26', code: 'ARS26', label: 'Smart controls may require network access for optional app features' },
      { id: 'ARS27', code: 'ARS27', label: 'No responsibility for internet connectivity or app integration issues' },
      { id: 'ARS28', code: 'ARS28', label: 'Room stat location based on best judgement at time of survey' }
    ]
  },
  {
    id: 'aw-flue',
    title: 'Flue',
    options: [
      { id: 'ARS29', code: 'ARS29', label: 'Flue termination checked for clearance at time of install — future obstructions not covered' },
      { id: 'ARS30', code: 'ARS30', label: 'Brickwork and render made good to reasonable standard, not decorative finish' },
      { id: 'ARS31', code: 'ARS31', label: 'Flue sealing and flashings weatherproof only — not decorative' },
      { id: 'ARS32', code: 'ARS32', label: 'Existing holes or redundant flues made safe and sealed where practical' }
    ]
  },
  {
    id: 'aw-access',
    title: 'Access',
    options: [
      { id: 'ARS33', code: 'ARS33', label: 'Safe access provided for installation only — permanent access is customer responsibility' },
      { id: 'ARS34', code: 'ARS34', label: 'Loft must be boarded, lit, and safe before works commence' },
      { id: 'ARS35', code: 'ARS35', label: 'Working at height precautions apply — scaffold or tower may be required' },
      { id: 'ARS36', code: 'ARS36', label: 'No work above safe height without suitable equipment' }
    ]
  },
  {
    id: 'aw-customer',
    title: 'Customer',
    options: [
      { id: 'ARS37', code: 'ARS37', label: 'Customer to clear working area and ensure safe access' },
      { id: 'ARS38', code: 'ARS38', label: 'Pets to be contained during works' },
      { id: 'ARS39', code: 'ARS39', label: 'Noise, dust, and disruption unavoidable during installation' },
      { id: 'ARS40', code: 'ARS40', label: 'Water and heating supply may be temporarily unavailable during works' },
      { id: 'ARS41', code: 'ARS41', label: 'Customer responsible for redecorating or boxing in after completion' }
    ]
  },
  {
    id: 'aw-general',
    title: 'General',
    options: [
      { id: 'ARS42', code: 'ARS42', label: 'All works carried out to Gas Safe and Building Regs at time of install' },
      { id: 'ARS43', code: 'ARS43', label: 'Manufacturer warranty subject to annual service' },
      { id: 'ARS44', code: 'ARS44', label: 'No liability for pre-existing faults or unrelated plumbing issues' },
      { id: 'ARS45', code: 'ARS45', label: 'Installation performance depends on system design and existing pipework' },
      { id: 'ARS46', code: 'ARS46', label: 'Recommendations given in good faith based on visible inspection' }
    ]
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

function createEmptyPipeworkState() {
  return {
    gasSupply: new Set(),
    meterType: new Set(),
    routeComplexity: new Set(),
    gasNotes: new Set(),
    gasGuidance: new Set(),
    condensate: new Set(),
    discharge: new Set(),
    waterServices: new Set()
  };
}

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
  pipework: createEmptyPipeworkState(),
  systemUpgrades: new Map(),
  cylinderSelections: new Set(),
  customerControls: new Set(),
  disruptionRooms: new Set(),
  liftItems: new Set(),
  permissions: new Set(),
  hazards: new Set(),
  disruptionNotes: new Set(),
  customerActions: new Set(),
  awarenessNotes: new Set(),
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
  ...PIPEWORK_SECTIONS.flatMap(section =>
    section.options.map(option => [option.id, option.code ? `${option.code} – ${option.label}` : option.label])
  ),
  ...SYSTEM_UPGRADE_OPTIONS.map(option => [option.id, option.label]),
  ...CYLINDER_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}`]),
  ...CONTROL_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}`]),
  ...LIFT_OPTIONS.map(option => [option.id, option.label]),
  ...PERMISSION_OPTIONS.map(option => [option.id, option.label]),
  ...HAZARD_OPTIONS.map(option => [option.id, option.label]),
  ...DISRUPTION_LEVEL_OPTIONS.map(option => [option.id, option.code ? `${option.code} – ${option.label}` : option.label]),
  ...CUSTOMER_ACTION_OPTIONS.map(option => [option.id, `${option.code} – ${option.label}`]),
  ...AWARENESS_SECTIONS.flatMap(section =>
    section.options.map(option => [option.id, option.code ? `${option.code} – ${option.label}` : option.label])
  )
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
  renderPipeworkSections();
  renderSystemUpgradeOptions();
  renderCylinderOptions();
  renderControlOptions();
  renderDisruptionHotspots('disruptionHotspots', 'disruptionRooms');
  renderLiftOptions();
  renderPermissionOptions();
  renderHazardOptions();
  renderDisruptionLevels();
  renderCustomerActionOptions();
  renderAwarenessSections();
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

function renderPipeworkSections() {
  const container = document.getElementById('pipeworkSections');
  if (!container) return;
  container.innerHTML = '';

  PIPEWORK_SECTIONS.forEach(section => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'fieldset';
    fieldset.id = `${section.id}-fieldset`;
    fieldset.innerHTML = `
      <legend>${section.title}</legend>
      <div class="choice-group" role="group" aria-labelledby="${section.id}-fieldset"></div>
    `;

    const group = fieldset.querySelector('.choice-group');
    const selectionSet = state.pipework[section.key];

    section.options.forEach(option => {
      const tile = createCheckboxTile(section.id, option, (optionId, checked) => {
        updateSetWithNone(selectionSet, optionId, checked, null);
        syncCheckboxTiles(group, selectionSet);
        updateSummary();
      });
      group.appendChild(tile);
    });

    syncCheckboxTiles(group, selectionSet);
    container.appendChild(fieldset);
  });
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

function renderLiftOptions() {
  const container = document.getElementById('liftChoices');
  if (!container) return;
  container.innerHTML = '';
  LIFT_OPTIONS.forEach(option => {
    const tile = createCheckboxTile('lift-items', option, (optionId, checked) => {
      updateSetWithNone(state.liftItems, optionId, checked, 'lift-none');
      syncCheckboxTiles(container, state.liftItems);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.liftItems);
}

function renderPermissionOptions() {
  const container = document.getElementById('permissionChoices');
  if (!container) return;
  container.innerHTML = '';
  PERMISSION_OPTIONS.forEach(option => {
    const tile = createCheckboxTile('permissions', option, (optionId, checked) => {
      updateSetWithNone(state.permissions, optionId, checked, 'perm-none');
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
      updateSetWithNone(state.hazards, optionId, checked, null);
      syncCheckboxTiles(container, state.hazards);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.hazards);
}

function renderDisruptionLevels() {
  const container = document.getElementById('disruptionLevelChoices');
  if (!container) return;
  container.innerHTML = '';
  DISRUPTION_LEVEL_OPTIONS.forEach(option => {
    const tile = createCheckboxTile('disruption-level', option, (optionId, checked) => {
      updateSetWithNone(state.disruptionNotes, optionId, checked, null);
      syncCheckboxTiles(container, state.disruptionNotes);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.disruptionNotes);
}

function renderCustomerActionOptions() {
  const container = document.getElementById('customerActionChoices');
  if (!container) return;
  container.innerHTML = '';
  CUSTOMER_ACTION_OPTIONS.forEach(option => {
    const tile = createCheckboxTile('customer-actions', option, (optionId, checked) => {
      updateSetWithNone(state.customerActions, optionId, checked, null);
      syncCheckboxTiles(container, state.customerActions);
      updateSummary();
    });
    container.appendChild(tile);
  });
  syncCheckboxTiles(container, state.customerActions);
}

function renderAwarenessSections() {
  const container = document.getElementById('awarenessSections');
  if (!container) return;
  container.innerHTML = '';

  AWARENESS_SECTIONS.forEach(section => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'fieldset';
    fieldset.id = `${section.id}-fieldset`;
    fieldset.innerHTML = `
      <legend>${section.title}</legend>
      <div class="choice-group" role="group" aria-labelledby="${section.id}-fieldset"></div>
    `;

    const group = fieldset.querySelector('.choice-group');
    section.options.forEach(option => {
      const tile = createCheckboxTile(section.id, option, (optionId, checked) => {
        updateSetWithNone(state.awarenessNotes, optionId, checked, null);
        syncCheckboxTiles(group, state.awarenessNotes);
        updateSummary();
      });
      group.appendChild(tile);
    });

    syncCheckboxTiles(group, state.awarenessNotes);
    container.appendChild(fieldset);
  });
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

function updateSetWithNone(targetSet, optionId, checked, noneOptionId) {
  if (!checked) {
    targetSet.delete(optionId);
    return;
  }

  if (noneOptionId && optionId === noneOptionId) {
    targetSet.clear();
    targetSet.add(optionId);
    return;
  }

  if (noneOptionId) {
    targetSet.delete(noneOptionId);
  }

  targetSet.add(optionId);
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

function getPipeworkLabels(sectionKey) {
  const section = PIPEWORK_SECTIONS.find(item => item.key === sectionKey);
  if (!section) {
    return [];
  }
  const selectionSet = state.pipework[sectionKey];
  if (!selectionSet || selectionSet.size === 0) {
    return [];
  }
  return section.options
    .filter(option => selectionSet.has(option.id))
    .map(option => labelLookup.get(option.id));
}

function updateSummary() {
  const summaryList = document.getElementById('summaryList');
  const accessList = Array.from(state.access).map(id => labelLookup.get(id));
  const routeList = state.flueRoute.map(id => {
    const component = FLUE_COMPONENT_MAP.get(id);
    return component ? component.label : id;
  });
  const makingGoodList = MAKING_GOOD_OPTIONS.filter(option => state.makingGood.has(option.id)).map(option => labelLookup.get(option.id));
  const gasSupplyList = getPipeworkLabels('gasSupply');
  const meterTypeList = getPipeworkLabels('meterType');
  const routeComplexityList = getPipeworkLabels('routeComplexity');
  const gasNotesList = getPipeworkLabels('gasNotes');
  const gasGuidanceList = getPipeworkLabels('gasGuidance');
  const condensateList = getPipeworkLabels('condensate');
  const dischargeList = getPipeworkLabels('discharge');
  const waterServicesList = getPipeworkLabels('waterServices');
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
  const liftList = Array.from(state.liftItems).map(id => labelLookup.get(id));
  const permissionList = Array.from(state.permissions).map(id => labelLookup.get(id));
  const hazardList = Array.from(state.hazards).map(id => labelLookup.get(id));
  const disruptionNotesList = Array.from(state.disruptionNotes).map(id => labelLookup.get(id));
  const customerActionList = CUSTOMER_ACTION_OPTIONS.filter(option => state.customerActions.has(option.id)).map(option => labelLookup.get(option.id));
  const awarenessList = AWARENESS_SECTIONS.flatMap(section =>
    section.options.filter(option => state.awarenessNotes.has(option.id)).map(option => labelLookup.get(option.id))
  );
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
      label: 'Gas supply',
      value: gasSupplyList.length ? gasSupplyList.join(', ') : 'Not recorded'
    },
    {
      label: 'Gas meter',
      value: meterTypeList.length ? meterTypeList.join(', ') : 'Not recorded'
    },
    {
      label: 'Gas route complexity',
      value: routeComplexityList.length ? routeComplexityList.join(', ') : 'Not recorded'
    },
    {
      label: 'Gas notes',
      value: gasNotesList.length ? gasNotesList.join(', ') : 'Not recorded'
    },
    {
      label: 'Gas guidance',
      value: gasGuidanceList.length ? gasGuidanceList.join(', ') : 'Not recorded'
    },
    {
      label: 'Condensate works',
      value: condensateList.length ? condensateList.join(', ') : 'Not recorded'
    },
    {
      label: 'Discharge route',
      value: dischargeList.length ? dischargeList.join(', ') : 'Not recorded'
    },
    {
      label: 'Water services',
      value: waterServicesList.length ? waterServicesList.join(', ') : 'Not recorded'
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
    },
    {
      label: 'Double-handed lifts',
      value: liftList.length ? liftList.join(', ') : 'Not recorded'
    },
    {
      label: 'Permissions',
      value: permissionList.length ? permissionList.join(', ') : 'Not recorded'
    },
    {
      label: 'Site hazards',
      value: hazardList.length ? hazardList.join(', ') : 'Not recorded'
    },
    {
      label: 'Disruption notes',
      value: disruptionNotesList.length ? disruptionNotesList.join(', ') : 'Not recorded'
    },
    {
      label: 'Customer actions',
      value: customerActionList.length ? customerActionList.join(', ') : 'Not recorded'
    },
    {
      label: 'Awareness notes',
      value: awarenessList.length ? awarenessList.join(', ') : 'Not recorded'
    }
  ];

  summaryItems.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.label}</strong><span>${item.value}</span>`;
    summaryList.appendChild(li);
  });

  persistOutputState({
    accessList,
    gasSupplyList,
    meterTypeList,
    routeComplexityList,
    gasNotesList,
    gasGuidanceList,
    condensateList,
    dischargeList,
    waterServicesList,
    upgradeList,
    cylinderList,
    controlList,
    routeList,
    disruptionList,
    liftList,
    permissionList,
    hazardList,
    disruptionNotesList,
    customerActionList,
    awarenessList,
    makingGoodList
  });
}

function persistOutputState(precomputedLists) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    const payload = buildOutputPayload(precomputedLists);
    window.localStorage.setItem('survey-output', JSON.stringify(payload));
  } catch (error) {
    console.warn('Failed to persist survey output', error);
  }
}

function buildOutputPayload(lists) {
  const {
    accessList,
    gasSupplyList,
    meterTypeList,
    routeComplexityList,
    gasNotesList,
    gasGuidanceList,
    condensateList,
    dischargeList,
    waterServicesList,
    upgradeList,
    cylinderList,
    controlList,
    routeList,
    disruptionList,
    liftList,
    permissionList,
    hazardList,
    disruptionNotesList,
    customerActionList,
    awarenessList,
    makingGoodList
  } = lists;

  const workingAtHeights = accessList.filter(Boolean);
  const componentsAssistance = liftList.filter(Boolean);
  const restrictions = permissionList.filter(Boolean);
  const hazards = hazardList.filter(Boolean);

  const systemCharacteristics = [];
  if (state.boilerType) {
    systemCharacteristics.push(`Existing boiler: ${labelLookup.get(state.boilerType)}`);
  }
  if (condensateList.length) {
    systemCharacteristics.push(`Condensate works: ${condensateList.join(', ')}`);
  }
  if (customerActionList.length) {
    systemCharacteristics.push(`Customer actions: ${customerActionList.join(', ')}`);
  }
  if (awarenessList.length) {
    systemCharacteristics.push(`Awareness notes: ${awarenessList.join(', ')}`);
  }

  const upgradeDetails = upgradeList.length ? `System upgrades: ${upgradeList.join(', ')}` : null;
  const cylinderDetails = cylinderList.length ? `Cylinder works: ${cylinderList.join(', ')}` : null;
  const controlDetails = controlList.length ? `Controls: ${controlList.join(', ')}` : null;

  const newBoilerAndControls = [];
  if (state.location) {
    newBoilerAndControls.push(`Existing boiler location: ${labelLookup.get(state.location)}`);
  }
  if (state.newBoilerLocation) {
    newBoilerAndControls.push(`New boiler location: ${labelLookup.get(state.newBoilerLocation)}`);
  }
  if (state.newBoilerType) {
    newBoilerAndControls.push(`New boiler type: ${labelLookup.get(state.newBoilerType)}`);
  }
  if (upgradeDetails) {
    newBoilerAndControls.push(upgradeDetails);
  }
  if (cylinderDetails) {
    newBoilerAndControls.push(cylinderDetails);
  }
  if (controlDetails) {
    newBoilerAndControls.push(controlDetails);
  }

  const flue = [];
  if (state.flueType) {
    flue.push(`Existing flue type: ${labelLookup.get(state.flueType)}`);
  }
  if (state.flueExit) {
    flue.push(`Flue exit point: ${labelLookup.get(state.flueExit)}`);
  }
  if (state.newFlueDirection) {
    flue.push(`New flue direction: ${labelLookup.get(state.newFlueDirection)}`);
  }
  if (makingGoodList.length) {
    flue.push(`Making good: ${makingGoodList.join(', ')}`);
  }
  if (routeList.length) {
    flue.push(`Route fittings: ${routeList.join(' → ')}`);
  }

  const pipeWork = [];
  if (gasSupplyList.length) {
    pipeWork.push(`Gas supply: ${gasSupplyList.join(', ')}`);
  }
  if (meterTypeList.length) {
    pipeWork.push(`Meter type: ${meterTypeList.join(', ')}`);
  }
  if (routeComplexityList.length) {
    pipeWork.push(`Route complexity: ${routeComplexityList.join(', ')}`);
  }
  if (gasNotesList.length) {
    pipeWork.push(`Gas notes: ${gasNotesList.join(', ')}`);
  }
  if (gasGuidanceList.length) {
    pipeWork.push(`Gas guidance: ${gasGuidanceList.join(', ')}`);
  }
  if (condensateList.length) {
    pipeWork.push(`Condensate: ${condensateList.join(', ')}`);
  }
  if (dischargeList.length) {
    pipeWork.push(`Discharge: ${dischargeList.join(', ')}`);
  }
  if (waterServicesList.length) {
    pipeWork.push(`Water services: ${waterServicesList.join(', ')}`);
  }

  const disruption = [];
  if (disruptionNotesList.length) {
    disruption.push(`General: ${disruptionNotesList.join(', ')}`);
  }
  if (disruptionList.length) {
    disruption.push(`Areas: ${disruptionList.join(', ')}`);
  }

  const restrictionsWithMessage = [];
  if (restrictions.length) {
    restrictionsWithMessage.push(restrictions.join(', '));
  }
  restrictionsWithMessage.push('It is the customers responsibility to ensure these permissions are granted.');

  return {
    workingAtHeights,
    systemCharacteristics,
    componentsAssistance,
    restrictions: restrictionsWithMessage,
    hazards,
    newBoilerAndControls,
    flue,
    pipeWork,
    disruption
  };
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
  Object.values(state.pipework).forEach(set => set.clear());
  state.systemUpgrades.clear();
  state.cylinderSelections.clear();
  state.customerControls.clear();
  state.disruptionRooms.clear();
  state.liftItems.clear();
  state.permissions.clear();
  state.hazards.clear();
  state.disruptionNotes.clear();
  state.customerActions.clear();
  state.awarenessNotes.clear();
  state.flueRoute = [];
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.checked = false;
  });
  syncAccessCards();
  syncHotspots(document.getElementById('houseHotspots'), state.location);
  syncHotspots(document.getElementById('newHouseHotspots'), state.newBoilerLocation);
  syncHotspotMulti(document.getElementById('disruptionHotspots'), state.disruptionRooms);
  document.querySelectorAll('.choice-group').forEach(group => syncChoiceTiles(group, ''));
  syncCheckboxTiles(document.getElementById('makingGoodChoices'), state.makingGood);
  syncCheckboxTiles(document.getElementById('cylinderChoices'), state.cylinderSelections);
  syncCheckboxTiles(document.getElementById('controlChoices'), state.customerControls);
  renderPipeworkSections();
  renderLiftOptions();
  renderPermissionOptions();
  renderHazardOptions();
  renderDisruptionLevels();
  renderCustomerActionOptions();
  renderAwarenessSections();
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
