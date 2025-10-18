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

  const bullet = (value) => `↘️ ${String(value || "None recorded").trim().replace(/^[↘️\s]*/, "").replace(/;*$/, "")};`;

  function deriveScenario(input) {
    const a = (input.BlrA || "").toUpperCase();
    const b = (input.BlrB || "").toUpperCase();
    if (!a && !b) {
      return "UNKNOWN→UNKNOWN";
    }
    if (!a) {
      return `UNKNOWN→${b}`;
    }
    if (!b) {
      return `${a}→UNKNOWN`;
    }
    return `${a}→${b}`;
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

  function applySystemCharacteristics(input, sections) {
    const scenario = deriveScenario(input);
    const cylB = (input.CylB || "").toUpperCase();

    switch (scenario) {
      case "COMBI→SYSTEM":
        sections.SystemCharacteristics.push(
          bullet("Converting from instantaneous DHW to stored hot water with a cylinder; hot water available to multiple outlets simultaneously"),
          bullet("Space heating remains sealed; primary circuit pressure maintained via system expansion"),
          bullet("Recovery time and stored volume dictate DHW performance; no expectation of instant hot water at outlet")
        );
        if (cylB === "UNVENTED" || cylB === "") {
          sections.SystemCharacteristics.push(
            bullet("Unvented cylinder expected; performance dependent on mains static/dynamic pressure and flow")
          );
        }
        break;
      case "REGULAR→COMBI":
        sections.SystemCharacteristics.push(
          bullet("Converting from vented & stored DHW to on-demand DHW via combi; removal of cylinder and cold water storage where present"),
          bullet("System sealed and pressurised; expansion vessel replaces F&E tank"),
          bullet("DHW is mains-pressure and not instant at outlet; single-draw best performance")
        );
        break;
      case "SYSTEM→COMBI":
        sections.SystemCharacteristics.push(
          bullet("Moving from stored DHW to instantaneous; cylinder decommissioned/removed as applicable"),
          bullet("Sealed primary remains; combi prioritises DHW over CH when running"),
          bullet("DHW relies on mains pressure/flow; not instant at outlet; single-draw best")
        );
        break;
      case "REGULAR→SYSTEM":
        sections.SystemCharacteristics.push(
          bullet("Converting vented primary to sealed system; expansion vessel replaces F&E"),
          bullet("DHW remains stored via cylinder; improved recovery with matched sizing")
        );
        break;
      default:
        sections.SystemCharacteristics.push(
          bullet("Like-for-like performance expected with incremental efficiency and control improvements")
        );
    }
  }

  function applyComponentsAssistance(sections) {
    sections.ComponentsAssistance.push(bullet("None recorded"));
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
    const scenario = deriveScenario(input);
    const controlsHint = (input.ControlsChoice || "").trim();
    const cylB = (input.CylB || "").toUpperCase();

    sections.BoilerAndControls.push(
      bullet(`Proposed ${input.BlrB || "boiler"} boiler in ${input.LocB || "proposed location"}; controls to be set for clear scheduling and temperature management`)
    );

    if (scenario === "COMBI→SYSTEM") {
      sections.BoilerAndControls.push(
        bullet("Add system pump on primary as required by MI; motorised zone valve(s) for CH and cylinder control (S-Plan or per-zone)"),
        bullet(cylB === "UNVENTED" || cylB === "" ? "Fit unvented cylinder with T&P relief, expansion & safety set (G3 pack)" : "Fit vented/stores cylinder per selected type"),
        bullet("Programmer/timer updated for CH and cylinder schedules; room stat/sensor retained or replaced for efficient zoning")
      );
    } else if (scenario === "SYSTEM→COMBI") {
      sections.BoilerAndControls.push(
        bullet("Decommission cylinder and associated zone valve(s); remove DHW pump if fitted"),
        bullet("Single CH motorised valve retained/added as required by MI for load control"),
        bullet("Combi user controls: DHW temperature on boiler, CH scheduling on programmer/app; priority to DHW during draw-off")
      );
    } else if (scenario === "REGULAR→COMBI") {
      sections.BoilerAndControls.push(
        bullet("Remove cylinder and F&E where present; rationalise to sealed combi with integral DHW plate"),
        bullet("Motorised valve arrangement simplified to CH-only where needed (per MI)"),
        bullet("User controls: CH schedule/target via controller or app; DHW draw is on-demand with temperature set at boiler")
      );
    } else if (scenario === "REGULAR→SYSTEM") {
      sections.BoilerAndControls.push(
        bullet("Replace open-vented primary with sealed system; fit expansion vessel and PRV on primary"),
        bullet("Retain or upgrade cylinder; fit/confirm CH and cylinder motorised valves for time/temperature control"),
        bullet("User controls to provide separate CH and DHW schedules with cylinder stat")
      );
    } else {
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

    if (flueB.includes("vertical")) {
      sections.Flue.push(
        bullet("Vertical balanced flue through roof; weathering collar and roof flashing to MI"),
        bullet("Terminal height/clearances to be confirmed; add terminal guard if accessible <2 m")
      );
    } else if (flueB.includes("fanned horizontal") || flueB.includes("horizontal")) {
      const wall = (input.TermWall || "declared wall").trim();
      sections.Flue.push(
        bullet(`Horizontal balanced flue on ${wall}; check boundary and adjacent openings to MI`),
        bullet("Add plume management/deflector if discharge affects paths, windows, or boundary")
      );
    } else {
      sections.Flue.push(bullet("Flue arrangement to be confirmed on survey photos and MI checks"));
    }

    if (["front wall", "side alley", "boundary"].includes(termWall)) {
      sections.Flue.push(bullet("Boundary/alley check required; confirm distances to neighbouring property and public way"));
    }
  }

  function applyPipeWork(input, sections) {
    const scenario = deriveScenario(input);

    if (scenario === "COMBI→SYSTEM") {
      sections.PipeWork.push(
        bullet("Adapt primaries for system boiler flow/return; run primary to cylinder coil"),
        bullet("Fit/confirm auto air vent, filling loop, and primary expansion set per MI")
      );
    } else if (scenario === "SYSTEM→COMBI") {
      sections.PipeWork.push(
        bullet("Cap/remove cylinder coil connections; rationalise primaries for combi flow/return"),
        bullet("Cold feed to combi; DHW outlet to domestic hot water distribution")
      );
    } else if (scenario === "REGULAR→COMBI") {
      sections.PipeWork.push(
        bullet("Remove vent/cold feed from F&E; convert to sealed primary with expansion set"),
        bullet("Cold main to combi and DHW distribution from boiler")
      );
    } else if (scenario === "REGULAR→SYSTEM") {
      sections.PipeWork.push(
        bullet("Replace open-vent with sealed primary; install expansion vessel and filling loop"),
        bullet("Primary to cylinder coil; confirm valve set for zoning")
      );
    } else {
      sections.PipeWork.push(bullet("Adapt/renew local primaries as needed for proposed boiler hydraulics"));
    }
  }

  function applyDisruption(sections) {
    sections.Disruption.push(
      bullet("Moderate disruption during boiler changeover and pipework alterations")
    );
  }

  function applyCustomerActions(input, sections) {
    const scenario = deriveScenario(input);

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

    applyNeeds(input, sections);
    applyWorkingAtHeights(input, sections);
    applySystemCharacteristics(input, sections);
    applyComponentsAssistance(sections);
    applyPermissions(input, sections);
    applyHazards(input, sections);
    applyDelivery(input, sections);
    applyOffice(input, sections);
    applyBoilerAndControls(input, sections);
    applyFlue(input, sections);
    applyPipeWork(input, sections);
    applyDisruption(sections);
    applyCustomerActions(input, sections);

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
