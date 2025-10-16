// Lightweight engine: inputs → flags → sectioned notes
// Expected inputs (pull from planner steps/localStorage):
// BlrA, FluA, CylA, LocA, BlrB, FluB, CylB, LocB, TermWall, TermHeight
(function(global){
  const SCENARIOS = {
    // Like-for-like replacements
    "REGULAR>REGULAR": {
      title: "\u2198\ufe0f Regular boiler replacement;",
      SystemChanges: [
        "\u2198\ufe0f Replace regular boiler like-for-like; retain primary layout;",
        "\u2198\ufe0f Confirm pump / 2-port or 3-port valve operation (no wiring detail);"
      ],
      HotWater: [
        "\u2198\ufe0f Cylinder-fed hot water \u2014 performance depends on cylinder type and tank head;",
        "\u2198\ufe0f Consider insulation/upgrade of existing cylinder if suboptimal;"
      ]
    },
    "SYSTEM>SYSTEM": {
      title: "\u2198\ufe0f System boiler replacement;",
      SystemChanges: [
        "\u2198\ufe0f Replace system boiler like-for-like; sealed/pressurised circuit retained;",
        "\u2198\ufe0f Confirm expansion vessel and PRV condition/capacity;"
      ],
      HotWater: [
        "\u2198\ufe0f Cylinder supplies hot water; performance depends on unvented/vented selection;"
      ]
    },
    "COMBI>COMBI": {
      title: "\u2198\ufe0f Combi boiler replacement;",
      SystemChanges: [
        "\u2198\ufe0f Replace combi like-for-like; verify plate HEX performance and DHW set-up;"
      ],
      HotWater: [
        "\u2198\ufe0f Combi DHW depends on mains flow/pressure; single draw is optimal; simultaneous draws reduce performance;",
        "\u2198\ufe0f Hot water is \u2018on demand\u2019 and not instant at outlets \u2014 run-off time applies;"
      ]
    },

    // Conversions
    "REGULAR>SYSTEM": {
      title: "\u2198\ufe0f Convert Regular to System boiler;",
      SystemChanges: [
        "\u2198\ufe0f Decommission feed & expansion tanks; convert to sealed/pressurised system;",
        "\u2198\ufe0f Install system boiler with integral pump/expansion as specified;"
      ],
      HotWater: [
        "\u2198\ufe0f Cylinder supplies hot water; choose unvented for mains pressure where suitable;",
        "\u2198\ufe0f Verify mains capacity if selecting unvented;"
      ]
    },
    "REGULAR>COMBI": {
      title: "\u2198\ufe0f Convert Regular to Combi;",
      SystemChanges: [
        "\u2198\ufe0f Remove cylinder and loft tanks; convert to sealed/pressurised system;",
        "\u2198\ufe0f Reconfigure pipework for direct CH flow/return to combi;"
      ],
      HotWater: [
        "\u2198\ufe0f Combi provides hot water on demand \u2014 not instant at outlets (run-off time);",
        "\u2198\ufe0f Performance depends on mains flow/pressure; single tap best, simultaneous taps reduce flow/temperature;"
      ]
    },
    "SYSTEM>COMBI": {
      title: "\u2198\ufe0f Convert System to Combi;",
      SystemChanges: [
        "\u2198\ufe0f Remove cylinder; sealed/pressurised circuit retained;",
        "\u2198\ufe0f Reconfigure for combi primary connections;"
      ],
      HotWater: [
        "\u2198\ufe0f On-demand DHW (not instant at outlet); mains capacity dictates performance; single draw preferred;"
      ]
    },
    "COMBI>SYSTEM": {
      title: "\u2198\ufe0f Convert Combi to System boiler with cylinder;",
      SystemChanges: [
        "\u2198\ufe0f Introduce cylinder and sealed primary circuit appropriate to system boiler;",
        "\u2198\ufe0f Provide cylinder controls/sensors per MI;"
      ],
      HotWater: [
        "\u2198\ufe0f Cylinder-based HW allows multi-outlet draw; unvented gives mains pressure where main is adequate;"
      ]
    },
    "COMBI>REGULAR": {
      title: "\u2198\ufe0f Convert Combi to Regular boiler with F&E;",
      SystemChanges: [
        "\u2198\ufe0f Introduce F&E tanks and regular primary layout;",
        "\u2198\ufe0f Provide cylinder coil/controls per scheme;"
      ],
      HotWater: [
        "\u2198\ufe0f Cylinder-fed HW; performance depends on cylinder type and tank head (if vented);"
      ]
    },
    "REGULAR>ELECTRIC_WET": {
      title: "\u2198\ufe0f Convert Regular to Electric wet boiler;",
      SystemChanges: [
        "\u2198\ufe0f Decommission gas appliance and F&E as specified; implement sealed circuit if required;"
      ],
      HotWater: [
        "\u2198\ufe0f HW via cylinder (specify type); electrical capacity/tariff considerations apply;"
      ]
    },
    "SYSTEM>ELECTRIC_WET": {
      title: "\u2198\ufe0f Convert System to Electric wet boiler;",
      SystemChanges: [
        "\u2198\ufe0f Replace heat source with electric boiler; sealed circuit retained;"
      ],
      HotWater: [
        "\u2198\ufe0f HW via cylinder; check electrical capacity and tariffs;"
      ]
    }
  };

  // Cylinder overlays (applied by proposed cylinder where relevant)
  const CYL_OVERLAYS = {
    UNVENTED_MAINS: [
      "\u2198\ufe0f Provide unvented (G3) safety set and correctly sized discharge (D2) termination;",
      "\u2198\ufe0f Confirm static pressure and dynamic flow meet unvented specification;"
    ],
    VENTED_TANKED: [
      "\u2198\ufe0f Vented cylinder performance depends on tank head; consider shower pump where appropriate;"
    ],
    THERMAL_STORE: [
      "\u2198\ufe0f Thermal store: confirm interfaces/temperatures and suitability for emitters;"
    ],
    NONE: [] // e.g., combi
  };

  // Universal sanity checks (always appended)
  const UNIVERSAL = {
    Gas: ["\u2198\ufe0f Confirm gas pipe sizing and route for new input rating; upgrade if required;"],
    Condensate: ["\u2198\ufe0f Confirm compliant condensate route and termination;"],
    HouseKeeping: [
      "\u2198\ufe0f Cleanse system and dose inhibitor; fit system filter as specified;",
      "\u2198\ufe0f Fit/verify TRVs where required and balance system on completion;"
    ]
  };

  // Flue/terminal overlays (applied to any scenario)
  function flueOverlays(i){
    const out = [];
    const isBalanced = ["H_BALANCED","V_BALANCED","PLUME_KIT"].includes(i.FluB);
    const changed = i.FluA && i.FluB && i.FluA !== i.FluB;
    if (changed || isBalanced) out.push("\u2198\ufe0f Check flue type/route/terminal clearances vs MI; confirm guards and plume management if needed;");
    if (i.FluB === "PLUME_KIT" || i.FluB === "H_BALANCED") out.push("\u2198\ufe0f Anticipated plume \u2014 consider plume kit/deflector to protect paths, windows and boundaries;");
    if (i.TermHeight === "LOW_LT_2M") out.push("\u2198\ufe0f Terminal <2 m or accessible \u2014 provide terminal guard as required;");
    if (["FRONT","ALLEY","NEAR_BOUNDARY","COURTYARD"].includes(i.TermWall)) out.push("\u2198\ufe0f Terminal near boundary/front/alley \u2014 confirm boundary clearances and neighbour impact;");
    if (["OPEN_FLUE","CHIMNEY"].includes(i.FluA) && isBalanced) out.push("\u2198\ufe0f Decommission/liner considerations for chimney/open flue; cap and make good as required;");
    return out;
  }

  // Location overlay (applies to any scenario)
  function locationOverlay(i){
    return [`\u2198\ufe0f Old location: ${i.LocA||"?"} \u2014 decommission/make good; New location: ${i.LocB||"?"} \u2014 confirm mounting clearances and access;`];
  }

  // Derived rules needed only for a couple scenarios
  function deriveRemoval(i){
    // Explicit cylinder/F&E messaging for *conversions* where appropriate
    const msgs = [];
    const A_isVented = ["VENTED_TANKED","FORTIC_COMBINED","PRIMATIC"].includes(i.CylA);
    if (i.scenario === "REGULAR>COMBI" || i.scenario === "SYSTEM>COMBI"){
      if (i.CylA && i.CylA !== "NONE") msgs.push("\u2198\ufe0f Remove cylinder and associated components;");
      if (A_isVented) msgs.push("\u2198\ufe0f Remove F&E tanks and convert to sealed/pressurised system;");
    }
    if (i.scenario === "REGULAR>SYSTEM"){
      if (A_isVented && i.CylB !== "VENTED_TANKED") msgs.push("\u2198\ufe0f Remove F&E tanks and convert to sealed/pressurised system;");
    }
    if (i.scenario === "COMBI>SYSTEM") {
      msgs.push("\u2198\ufe0f Introduce cylinder and associated controls as specified;");
    }
    if (i.scenario === "COMBI>REGULAR") {
      msgs.push("\u2198\ufe0f Introduce F&E tanks and regular primary layout;");
    }
    return msgs;
  }

  function resolveScenario(inputs){
    const i = {...inputs};
    i.scenario = `${i.BlrA}>${i.BlrB}`;
    const base = SCENARIOS[i.scenario] || { title:`\u2198\ufe0f System conversion (${i.scenario});`, SystemChanges:[], HotWater:[] };

    // Build section buckets
    const sections = {
      SummaryChange: [base.title],
      SystemChanges: [...(base.SystemChanges || []), ...deriveRemoval(i)],
      HotWater: [...(base.HotWater || [])],
      Flue: flueOverlays(i),
      Gas: [...UNIVERSAL.Gas],
      Condensate: [...UNIVERSAL.Condensate],
      LocationAndMakingGood: locationOverlay(i),
      Controls: [`\u2198\ufe0f Configure for ${i.BlrB} operation; confirm room/cylinder controls as specified;`],
      HouseKeeping: [...UNIVERSAL.HouseKeeping]
    };

    // Cylinder overlay by *proposed* cylinder
    if (i.BlrB !== "COMBI" && i.CylB){
      const overlay = CYL_OVERLAYS[i.CylB] || [];
      sections.HotWater.push(...overlay);
    }

    // Guarantee HotWater has at least one baseline line
    if (sections.HotWater.length === 0){
      sections.HotWater.push("\u2198\ufe0f Verify incoming cold main flow/pressure meets specification;");
    }
    return sections;
  }

  // Normalise planner values to engine enums
  function normalise(v, map){ return (map[v] || v || "").toUpperCase(); }
  const FLUE_MAP = {
    "Horizontal (balanced)": "H_BALANCED",
    "Vertical (balanced)": "V_BALANCED",
    "Plume kit": "PLUME_KIT",
    "Open flue": "OPEN_FLUE",
    "Chimney": "CHIMNEY",
    "Balanced": "H_BALANCED",
    "Fanned": "H_BALANCED",
    "Side flue": "H_BALANCED",
    "Rear flue": "H_BALANCED",
    "Direct rear": "H_BALANCED",
    "Turret rear": "H_BALANCED",
    "Turret right": "H_BALANCED",
    "Turret forward": "H_BALANCED",
    "Turret lift": "V_BALANCED",
    "Vertical": "V_BALANCED",
    "HORIZONTAL":"H_BALANCED","VERTICAL":"V_BALANCED"
  };
  const WALL_MAP = {
    "Rear": "REAR","Front":"FRONT","Left":"LEFT_SIDE","Right":"RIGHT_SIDE",
    "Courtyard":"COURTYARD","Alley":"ALLEY","Near boundary":"NEAR_BOUNDARY",
    "Wall":"WALL_GENERIC","Flat roof":"ROOF_FLAT","Pitched roof":"ROOF_PITCHED"
  };
  const HEIGHT_MAP = {
    "<2 m":"LOW_LT_2M","2–2.5 m":"MID_2_TO_2_5M",">2.5 m":"HIGH_GT_2_5M"
  };

  // Public API
  function buildNoteSections(raw){
    const i = {
      BlrA: normalise(raw.BlrA,{}),
      FluA: normalise(raw.FluA,FLUE_MAP),
      CylA: normalise(raw.CylA,{}),
      LocA: normalise(raw.LocA,{}),
      BlrB: normalise(raw.BlrB,{}),
      FluB: normalise(raw.FluB,FLUE_MAP),
      CylB: normalise(raw.CylB,{}),
      LocB: normalise(raw.LocB,{}),
      TermWall: normalise(raw.TermWall,WALL_MAP),
      TermHeight: normalise(raw.TermHeight,HEIGHT_MAP)
    };
    return resolveScenario(i);
  }

  // Try pull from localStorage (Fast-survey planner)
  function readPlannerState(){
    // Use your existing storage keys if present; fallback to inferred ones.
    const ls = (k)=>localStorage.getItem(k) || "";
    // Common keys you likely already set in steps:
    const data = {
      BlrA: ls("BlrA") || ls("existing_boiler_type"),
      FluA: ls("FluA") || ls("existing_flue_type"),
      CylA: ls("CylA") || ls("cylinder_a"),
      LocA: ls("LocA") || ls("existing_boiler_location"),
      BlrB: ls("BlrB") || ls("new_boiler_type"),
      FluB: ls("FluB") || ls("new_flue_type_or_direction"),
      CylB: ls("CylB") || ls("cylinder_b"),
      LocB: ls("LocB") || ls("new_boiler_location"),
      TermWall: ls("TermWall") || ls("flue_exit_wall"),
      TermHeight: ls("TermHeight") || ls("flue_terminal_height")
    };
    return data;
  }

  // Convenience: build from planner (used on output.html)
  function buildFromPlanner(){
    const state = readPlannerState();
    return buildNoteSections(state);
  }

  // Expose
  global.NotesEngine = { buildNoteSections, buildFromPlanner };
})(window);
