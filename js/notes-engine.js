(function (global) {
  const SECTION_KEYS = [
    "Needs",
    "WorkingAtHeights",
    "SystemCharacteristics",
    "ComponentsAssistance",
    "Permissions",
    "Hazards",
    "Delivery",
    "Office",
    "BoilerAndControls",
    "Flue",
    "PipeWork",
    "Disruption",
    "CustomerActions"
  ];

  const bullet = (value) =>
    `↘️ ${String(value || "None recorded")
      .trim()
      .replace(/^[↘️\s]*/, "")
      .replace(/;*$/, "")};`;

  function normaliseBoilerValue(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[\[\](){}]/g, "")
      .trim();
  }

  function getScenarioLabel(BlrA, BlrB) {
    const format = (value) => {
      const cleaned = normaliseBoilerValue(value);
      return cleaned ? cleaned.toUpperCase() : "UNKNOWN";
    };
    return `${format(BlrA)}→${format(BlrB)}`;
  }

  function deriveScenario(input) {
    return getScenarioLabel(input.BlrA, input.BlrB);
  }

  const SCENARIO_DESCRIPTIONS = {
    "REGULAR→REGULAR": "like-for-like open-vented",
    "REGULAR→SYSTEM": "vented to sealed upgrade",
    "REGULAR→COMBI": "open-vent to combi conversion",
    "SYSTEM→SYSTEM": "sealed like-for-like",
    "SYSTEM→COMBI": "sealed to combi",
    "COMBI→COMBI": "combi like-for-like",
    "COMBI→SYSTEM": "combi to system conversion",
    "COMBI→REGULAR": "combi to open-vent",
    "SYSTEM→REGULAR": "sealed to open-vent"
  };

  function formatBoiler(value) {
    const trimmed = String(value || "boiler").trim();
    return trimmed || "boiler";
  }

  function formatLocation(value) {
    const trimmed = String(value || "proposed location").trim();
    return trimmed || "proposed location";
  }

  const SCENARIO_TEMPLATES = {
    "REGULAR→REGULAR": () => ({
      SystemCharacteristics: [
        "↘️ Like-for-like performance expected with incremental efficiency and control improvements;"
      ],
      BoilerAndControls: [
        "↘️ Proposed Regular boiler in Utility; controls to be set for clear scheduling and temperature management;",
        "↘️ Verify pump head and valve configuration match proposed hydraulics; set user controls for clear CH/DHW schedules;"
      ],
      Flue: [
        "↘️ Horizontal balanced flue on Rear wall; check boundary and adjacent openings to MI;",
        "↘️ Add plume management/deflector if discharge affects paths, windows, or boundary;"
      ],
      PipeWork: [
        "↘️ Adapt/renew local primaries as needed for proposed boiler hydraulics;"
      ],
      Disruption: [
        "↘️ Moderate disruption during boiler changeover and pipework alterations;"
      ]
    }),
    "REGULAR→SYSTEM": (input) => ({
      SystemCharacteristics: [
        "↘️ Converting vented primary to sealed system; expansion vessel replaces F&E;",
        "↘️ DHW remains stored via cylinder; improved recovery with matched sizing;"
      ],
      BoilerAndControls: [
        `↘️ Proposed ${formatBoiler(input.BlrB)} boiler in ${formatLocation(input.LocB)}; controls to be set for clear scheduling and temperature management;`,
        "↘️ Replace open-vented primary with sealed system; fit expansion vessel and PRV on primary;",
        "↘️ Retain or upgrade cylinder; fit/confirm CH and cylinder motorised valves for time/temperature control;",
        "↘️ User controls to provide separate CH and DHW schedules with cylinder stat;"
      ],
      PipeWork: [
        "↘️ Replace open-vent with sealed primary; install expansion vessel and filling loop;",
        "↘️ Primary to cylinder coil; confirm valve set for zoning;"
      ]
    }),
    "REGULAR→COMBI": (input) => ({
      SystemCharacteristics: [
        "↘️ Converting from vented & stored DHW to on-demand DHW via combi; removal of cylinder and cold water storage where present;",
        "↘️ System sealed and pressurised; expansion vessel replaces F&E tank;",
        "↘️ DHW is mains-pressure and not instant at outlet; single-draw best performance;"
      ],
      BoilerAndControls: [
        `↘️ Proposed ${formatBoiler(input.BlrB)} boiler in ${formatLocation(input.LocB)}; controls to be set for clear scheduling and temperature management;`,
        "↘️ Remove cylinder and F&E where present; rationalise to sealed combi with integral DHW plate;",
        "↘️ Motorised valve arrangement simplified to CH-only where needed (per MI);",
        "↘️ User controls: CH schedule/target via controller or app; DHW draw is on-demand with temperature set at boiler;"
      ],
      PipeWork: [
        "↘️ Remove vent/cold feed from F&E; convert to sealed primary with expansion set;",
        "↘️ Cold main to combi and DHW distribution from boiler;"
      ]
    }),
    "SYSTEM→COMBI": (input) => ({
      SystemCharacteristics: [
        "↘️ Moving from stored DHW to instantaneous; cylinder decommissioned/removed as applicable;",
        "↘️ Sealed primary remains; combi prioritises DHW over CH when running;",
        "↘️ DHW relies on mains pressure/flow; not instant at outlet; single-draw best;"
      ],
      BoilerAndControls: [
        `↘️ Proposed ${formatBoiler(input.BlrB)} boiler in ${formatLocation(input.LocB)}; controls to be set for clear scheduling and temperature management;`,
        "↘️ Decommission cylinder and associated zone valve(s); remove DHW pump if fitted;",
        "↘️ Single CH motorised valve retained/added as required by MI for load control;",
        "↘️ Combi user controls: DHW temperature on boiler, CH scheduling on programmer/app; priority to DHW during draw-off;"
      ],
      PipeWork: [
        "↘️ Cap/remove cylinder coil connections; rationalise primaries for combi flow/return;",
        "↘️ Cold feed to combi; DHW outlet to domestic hot water distribution;"
      ]
    }),
    "COMBI→SYSTEM": (input) => {
      const notes = {
        SystemCharacteristics: [
          "↘️ Converting from instantaneous DHW to stored hot water with a cylinder; hot water available to multiple outlets simultaneously;",
          "↘️ Space heating remains sealed; primary circuit pressure maintained via system expansion;",
          "↘️ Recovery time and stored volume dictate DHW performance; no expectation of instant hot water at outlet;"
        ],
        BoilerAndControls: [
          `↘️ Proposed ${formatBoiler(input.BlrB)} boiler in ${formatLocation(input.LocB)}; controls to be set for clear scheduling and temperature management;`,
          "↘️ Add system pump on primary as required by MI; motorised zone valve(s) for CH and cylinder control (S-Plan or per-zone);",
          (String(input.CylB || "").toUpperCase() === "UNVENTED" || !String(input.CylB || "").trim()
            ? "↘️ Fit unvented cylinder with T&P relief, expansion & safety set (G3 pack);"
            : "↘️ Fit vented/stores cylinder per selected type;"),
          "↘️ Programmer/timer updated for CH and cylinder schedules; room stat/sensor retained or replaced for efficient zoning;"
        ],
        PipeWork: [
          "↘️ Adapt primaries for system boiler flow/return; run primary to cylinder coil;",
          "↘️ Fit/confirm auto air vent, filling loop, and primary expansion set per MI;"
        ]
      };
      if (String(input.CylB || "").toUpperCase() === "UNVENTED" || !String(input.CylB || "").trim()) {
        notes.SystemCharacteristics.push(
          "↘️ Unvented cylinder expected; performance dependent on mains static/dynamic pressure and flow;"
        );
      }
      return notes;
    },
    "SYSTEM→SYSTEM": (input) => ({
      SystemCharacteristics: [
        "↘️ Sealed like-for-like replacement; expect uplift in efficiency and control refinement;",
        "↘️ Stored hot water retained with sealed primary and matched expansion provision;"
      ],
      BoilerAndControls: [
        `↘️ Proposed ${formatBoiler(input.BlrB)} boiler in ${formatLocation(input.LocB)}; controls to be set for clear scheduling and temperature management;`,
        "↘️ Confirm zoning valves and primary pump configuration align with sealed system controls;",
        "↘️ Optimise CH/DHW schedules and temperature targets for efficient operation;"
      ],
      PipeWork: [
        "↘️ Review primary pipework condition; renew/adapt as required to suit sealed system hydraulics;"
      ]
    }),
    "COMBI→COMBI": (input) => ({
      SystemCharacteristics: [
        "↘️ Combi like-for-like replacement; DHW delivery remains mains-pressure and draw-off dependent;",
        "↘️ Expect incremental efficiency gains and improved user control from modern appliance;"
      ],
      BoilerAndControls: [
        `↘️ Proposed ${formatBoiler(input.BlrB)} boiler in ${formatLocation(input.LocB)}; controls to be set for clear scheduling and temperature management;`,
        "↘️ Ensure system flush and filter provision protect plate heat exchanger and hydraulics;",
        "↘️ Set user controls for CH scheduling via controller/app; DHW temperature managed on boiler interface;"
      ],
      PipeWork: [
        "↘️ Review isolation valves and primary connections; renew as needed for new combi installation;"
      ]
    }),
    "COMBI→REGULAR": (input) => ({
      SystemCharacteristics: [
        "↘️ Moving from instantaneous DHW to vented stored hot water with cylinder and F&E provisions;",
        "↘️ Primary converts to open-vented circuit; pump and controls adjusted for gravity/vented configuration;"
      ],
      BoilerAndControls: [
        `↘️ Proposed ${formatBoiler(input.BlrB)} boiler in ${formatLocation(input.LocB)}; controls to be set for clear scheduling and temperature management;`,
        "↘️ Introduce feed & expansion tank; ensure vent and cold feed positions suit new hydraulics;",
        "↘️ Configure motorised valves/pump control for stored cylinder and space heating zoning;"
      ],
      PipeWork: [
        "↘️ Install vent and cold feed connections; route primaries to cylinder coil and heating circuit;",
        "↘️ Confirm gravity/suction considerations for pump and valve selection;"
      ]
    }),
    "SYSTEM→REGULAR": (input) => ({
      SystemCharacteristics: [
        "↘️ Sealed to open-vent conversion; feed and expansion tank reinstated for primary circuit;",
        "↘️ Stored DHW retained; adjust controls for vented/gravity compatible operation;"
      ],
      BoilerAndControls: [
        `↘️ Proposed ${formatBoiler(input.BlrB)} boiler in ${formatLocation(input.LocB)}; controls to be set for clear scheduling and temperature management;`,
        "↘️ Remove sealed expansion set; introduce vent/cold feed and verify pump overrun suitability;",
        "↘️ Configure CH/DHW controls for vented system with cylinder stat and motorised valves as applicable;"
      ],
      PipeWork: [
        "↘️ Modify primaries for open-vent routing; position vent and cold feed to protect boiler;",
        "↘️ Confirm pipe sizing to suit gravity head and prevent air locking;"
      ]
    })
  };

  function applyScenarioTemplate(input, sections, scenario) {
    const templateFactory = SCENARIO_TEMPLATES[scenario];
    if (!templateFactory) {
      return;
    }
    const template = templateFactory(input) || {};
    SECTION_KEYS.forEach((key) => {
      if (Array.isArray(template[key])) {
        template[key].forEach((entry) => {
          sections[key].push(bullet(entry));
        });
      }
    });
  }

  function ensureMinimum(sections) {
    SECTION_KEYS.forEach((key) => {
      if (!Array.isArray(sections[key])) {
        sections[key] = [];
      }
      if (sections[key].length === 0) {
        sections[key].push(bullet("None recorded"));
      }
    });
    return sections;
  }

  function splitList(value) {
    if (!value) {
      return [];
    }
    return String(value)
      .split(/[\n,;]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function applyNeeds(input, sections) {
    splitList(input.NeedsList).forEach((item) => sections.Needs.push(bullet(item)));
  }

  function applyWorkingAtHeights(input, sections) {
    const access = (input.Access || "").toLowerCase();
    const flueB = (input.FluB || "").toLowerCase();
    if (access.includes("ladder") && flueB.includes("vertical")) {
      sections.WorkingAtHeights.push(
        bullet("Ladder access to roof with standard linking ladders for vertical flue works")
      );
    }
    if (sections.WorkingAtHeights.length === 0) {
      sections.WorkingAtHeights.push(
        bullet("Internal access suitable; no specialist platform declared")
      );
    }
  }

  function applySystemCharacteristics(sections, scenario) {
    if (sections.SystemCharacteristics.length > 0) {
      return;
    }
    const description = SCENARIO_DESCRIPTIONS[scenario];
    if (description) {
      sections.SystemCharacteristics.push(bullet(`${description} scenario;`));
    } else {
      sections.SystemCharacteristics.push(
        bullet("Like-for-like performance expected with incremental efficiency and control improvements")
      );
    }
  }

  function applyComponentsAssistance(sections) {
    if (sections.ComponentsAssistance.length === 0) {
      sections.ComponentsAssistance.push(bullet("None recorded"));
    }
  }

  function applyPermissions(input, sections) {
    splitList(input.PermissionsHints).forEach((item) => sections.Permissions.push(bullet(item)));
  }

  function applyHazards(input, sections) {
    splitList(input.HazardsList).forEach((item) => sections.Hazards.push(bullet(item)));
  }

  function applyDelivery(input, sections) {
    splitList(input.DeliveryNotes).forEach((item) => sections.Delivery.push(bullet(item)));
    if ((input.Parking || "").trim()) {
      sections.Delivery.push(bullet(`Parking: ${(input.Parking || "").trim()}`));
    }
  }

  function applyOffice(input, sections) {
    splitList(input.OfficeNotes).forEach((item) => sections.Office.push(bullet(item)));
    splitList(input.FreeText).forEach((item) => sections.Office.push(bullet(item)));
  }

  function applyBoilerAndControls(input, sections) {
    const controlsHint = (input.ControlsChoice || "").trim();
    if (sections.BoilerAndControls.length === 0) {
      sections.BoilerAndControls.push(
        bullet(
          `Proposed ${formatBoiler(input.BlrB)} boiler in ${formatLocation(input.LocB)}; controls to be set for clear scheduling and temperature management;`
        )
      );
      sections.BoilerAndControls.push(
        bullet("Verify pump head and valve configuration match proposed hydraulics; set user controls for clear CH/DHW schedules")
      );
    }

    if (controlsHint) {
      sections.BoilerAndControls.push(bullet(`User control preference recorded: ${controlsHint}`));
    }
  }

  function applyFlue(input, sections) {
    const flueB = (input.FluB || "").toLowerCase();
    const termWall = (input.TermWall || "").toLowerCase();

    if (flueB.includes("vertical") && sections.Flue.length === 0) {
      sections.Flue.push(
        bullet("Vertical balanced flue through roof; weathering collar and roof flashing to MI"),
        bullet("Terminal height/clearances to be confirmed; add terminal guard if accessible <2 m")
      );
    } else if ((flueB.includes("fanned horizontal") || flueB.includes("horizontal")) && sections.Flue.length === 0) {
      const wall = (input.TermWall || "declared wall").trim();
      sections.Flue.push(
        bullet(`Horizontal balanced flue on ${wall}; check boundary and adjacent openings to MI`),
        bullet("Add plume management/deflector if discharge affects paths, windows, or boundary")
      );
    } else if (sections.Flue.length === 0) {
      sections.Flue.push(bullet("Flue arrangement to be confirmed on survey photos and MI checks"));
    }

    if (["front wall", "side alley", "boundary"].includes(termWall)) {
      sections.Flue.push(bullet("Boundary/alley check required; confirm distances to neighbouring property and public way"));
    }
  }

  function applyPipeWork(sections) {
    if (sections.PipeWork.length === 0) {
      sections.PipeWork.push(bullet("Adapt/renew local primaries as needed for proposed boiler hydraulics"));
    }
  }

  function applyDisruption(sections) {
    if (sections.Disruption.length === 0) {
      sections.Disruption.push(
        bullet("Moderate disruption during boiler changeover and pipework alterations")
      );
    }
  }

  function applyCustomerActions(input, sections, scenario) {
    if (scenario.includes("COMBI")) {
      sections.CustomerActions.push(
        bullet("DHW not instant at outlet; allow draw-off time from boiler"),
        bullet("Best performance with single DHW draw at a time"),
        bullet("Overall DHW performance depends on mains pressure/flow")
      );
    }

    if ((input.CylB || "").toUpperCase() === "UNVENTED") {
      sections.CustomerActions.push(
        bullet("Unvented cylinder requires G3 pack and D2 discharge route; suitability depends on verified mains static/dynamic readings")
      );
    }
  }

  function buildNotes(input) {
    const sections = {
      Needs: [],
      WorkingAtHeights: [],
      SystemCharacteristics: [],
      ComponentsAssistance: [],
      Permissions: [],
      Hazards: [],
      Delivery: [],
      Office: [],
      BoilerAndControls: [],
      Flue: [],
      PipeWork: [],
      Disruption: [],
      CustomerActions: []
    };

    const scenario = deriveScenario(input);

    applyScenarioTemplate(input, sections, scenario);
    applyNeeds(input, sections);
    applyWorkingAtHeights(input, sections);
    applySystemCharacteristics(sections, scenario);
    applyComponentsAssistance(sections);
    applyPermissions(input, sections);
    applyHazards(input, sections);
    applyDelivery(input, sections);
    applyOffice(input, sections);
    applyBoilerAndControls(input, sections);
    applyFlue(input, sections);
    applyPipeWork(sections);
    applyDisruption(sections);
    applyCustomerActions(input, sections, scenario);

    return ensureMinimum(sections);
  }

  function normalise(value) {
    return typeof value === "string" ? value : value == null ? "" : String(value);
  }

  function readPlannerState() {
    const safeGet = (key) => {
      try {
        return localStorage.getItem(key) || "";
      } catch (error) {
        return "";
      }
    };

    const fallbacks = (primary, ...alts) => {
      const values = [primary, ...alts];
      for (const key of values) {
        const value = safeGet(key);
        if (value) {
          return value;
        }
      }
      return "";
    };

    const data = {
      BlrA: fallbacks("BlrA", "existing_boiler_type"),
      FluA: fallbacks("FluA", "existing_flue_type"),
      CylA: fallbacks("CylA", "cylinder_a"),
      LocA: fallbacks("LocA", "existing_boiler_location"),
      BlrB: fallbacks("BlrB", "new_boiler_type"),
      FluB: fallbacks("FluB", "new_flue_type_or_direction"),
      CylB: fallbacks("CylB", "cylinder_b"),
      LocB: fallbacks("LocB", "new_boiler_location"),
      TermWall: fallbacks("TermWall", "flue_exit_wall"),
      TermHeight: fallbacks("TermHeight", "flue_terminal_height"),
      Access: fallbacks("Access", "access_equipment"),
      Parking: fallbacks("Parking", "parking"),
      PermissionsHints: fallbacks("PermissionsHints", "permissions_hints"),
      HazardsList: fallbacks("HazardsList", "hazards_list"),
      DeliveryNotes: fallbacks("DeliveryNotes", "delivery_notes"),
      OfficeNotes: fallbacks("OfficeNotes", "office_notes"),
      ControlsChoice: fallbacks("ControlsChoice", "controls_choice"),
      NeedsList: fallbacks("NeedsList", "needs_list"),
      FreeText: fallbacks("FreeText", "free_text")
    };

    const normalised = {};
    Object.keys(data).forEach((key) => {
      normalised[key] = normalise(data[key]);
    });
    return normalised;
  }

  function buildFromPlanner() {
    return buildNotes(readPlannerState());
  }

  global.NotesEngine = {
    buildNotes,
    buildFromPlanner,
    readPlannerState,
    SECTION_KEYS
  };
})(window);
