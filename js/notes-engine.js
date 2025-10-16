// Lightweight engine: inputs → flags → sectioned notes
// Expected inputs (pull from planner steps/localStorage):
// BlrA, FluA, CylA, LocA, BlrB, FluB, CylB, LocB, TermWall, TermHeight
(function(global){
  const NOTES = {
    SummaryChange: {},
    SystemChanges: {
      remove_cylinder:"\u2198\ufe0f Remove existing hot-water cylinder and associated components;",
      space_gain:"\u2198\ufe0f Space reclaimed from cylinder/loft tanks \u2014 confirm preferred use;",
      remove_FandE:"\u2198\ufe0f Remove F&E tanks and convert to sealed system where applicable;",
      cylinder_relocation:"\u2198\ufe0f New cylinder location \u2014 allow primary/secondary runs and compliant discharge path;"
    },
    HotWater: {
      combi_performance:"\u2198\ufe0f Combi hot-water performance depends on mains flow; simultaneous draws reduce flow/temperature;",
      cold_main_check:"\u2198\ufe0f Verify incoming cold main flow/pressure meets combi/unvented requirements; upgrade if inadequate;",
      unvented_requirements:"\u2198\ufe0f Provide unvented G3 safety set, correctly sized discharge (D2) and termination; confirm main capacity;",
      unvented_benefit:"\u2198\ufe0f Unvented cylinder provides mains-pressure hot water at multiple outlets (subject to main capacity);",
      vented_characteristics:"\u2198\ufe0f Vented cylinder performance depends on tank head height; consider shower pump where appropriate;",
      thermal_store_specifics:"\u2198\ufe0f Thermal store: confirm compatibility, heat source interfaces and delivery temperatures;"
    },
    Flue: {
      flue_clearances:"\u2198\ufe0f Check flue type/route/terminal clearances vs MI; confirm guards and plume management if needed;",
      terminal_guard_required:"\u2198\ufe0f Terminal <2 m above ground or accessible \u2014 provide terminal guard as required;",
      boundary_clearance_review:"\u2198\ufe0f Terminal near boundary/front/alley \u2014 confirm boundary clearances and neighbour impact;",
      plume_mitigation:"\u2198\ufe0f Anticipated plume \u2014 consider plume kit/deflector to protect paths, windows and boundaries;",
      chimney_decommission:"\u2198\ufe0f Decommission/liner considerations for chimney/open flue; cap and make good as required;"
    },
    Gas: { gas_supply_check:"\u2198\ufe0f Confirm gas pipe sizing and route for new input rating; upgrade if required;" },
    Condensate: { condensate_route:"\u2198\ufe0f Confirm compliant condensate route and termination;" },
    LocationAndMakingGood: { loc_old_new:"\u2198\ufe0f Old location: {LocA} \u2014 decommission/make good; New location: {LocB} \u2014 confirm mounting clearances and access;" },
    Controls: { controls_reconfig:"\u2198\ufe0f Configure for {BlrB} operation; confirm room/cylinder controls as specified;" },
    HouseKeeping: {
      system_cleanse:"\u2198\ufe0f Cleanse system and dose inhibitor; fit system filter as specified;",
      trvs_balancing:"\u2198\ufe0f Fit/verify TRVs where required and balance system on completion;"
    }
  };

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

  function deriveFlags(i){
    return {
      A_hasCylinder: i.CylA && i.CylA!=="NONE",
      A_isVented: ["VENTED_TANKED","FORTIC_COMBINED","PRIMATIC"].includes(i.CylA),
      B_isCombi: i.BlrB==="COMBI",
      B_isSystem: i.BlrB==="SYSTEM",
      B_needsCylinder: ["SYSTEM","REGULAR"].includes(i.BlrB) && i.CylB!=="NONE",
      Flu_change: i.FluA && i.FluB && i.FluA!==i.FluB,
      Chimney_to_RS: (["OPEN_FLUE","CHIMNEY"].includes(i.FluA) && ["H_BALANCED","V_BALANCED","PLUME_KIT"].includes(i.FluB)),
      Term_low: i.TermHeight==="LOW_LT_2M",
      Term_boundary: ["FRONT","ALLEY","NEAR_BOUNDARY","COURTYARD"].includes(i.TermWall),
      Loc_change: i.LocA && i.LocB && i.LocA!==i.LocB
    };
  }

  function resolve(i){
    const f = deriveFlags(i);
    const out = {
      SummaryChange: [],
      SystemChanges: [],
      HotWater: [],
      Flue: [],
      Gas: [],
      Condensate: [],
      LocationAndMakingGood: [],
      Controls: [],
      HouseKeeping: []
    };

    // Summary
    const title = (i.BlrA===i.BlrB && i.CylA===i.CylB) ? "\u2198\ufe0f Like for like;" : `\u2198\ufe0f Change from ${i.BlrA||"?"} to ${i.BlrB||"?"};`;
    out.SummaryChange.push(title);

    // System changes
    if (f.B_isCombi && f.A_hasCylinder){ out.SystemChanges.push("remove_cylinder","space_gain"); }
    if (f.A_isVented && (f.B_isCombi || (f.B_isSystem && i.CylB!=="VENTED_TANKED"))){ out.SystemChanges.push("remove_FandE"); }
    if (f.B_needsCylinder && f.Loc_change){ out.SystemChanges.push("cylinder_relocation"); }

    // Hot water: always add baseline
    out.HotWater.push("cold_main_check");
    if (f.B_isCombi){ out.HotWater.push("combi_performance"); }
    else if (i.CylB==="UNVENTED_MAINS"){ out.HotWater.push("unvented_requirements","unvented_benefit"); }
    else if (["VENTED_TANKED","FORTIC_COMBINED","PRIMATIC"].includes(i.CylB)){ out.HotWater.push("vented_characteristics"); }
    else if (i.CylB==="THERMAL_STORE"){ out.HotWater.push("thermal_store_specifics"); }

    // Flue
    if (f.Flu_change) out.Flue.push("flue_clearances");
    if (["H_BALANCED","V_BALANCED","PLUME_KIT"].includes(i.FluB)) out.Flue.push("flue_clearances");
    if (i.FluB==="PLUME_KIT" || i.FluB==="H_BALANCED") out.Flue.push("plume_mitigation");
    if (f.Term_low) out.Flue.push("terminal_guard_required");
    if (f.Term_boundary) out.Flue.push("boundary_clearance_review");
    if (f.Chimney_to_RS) out.Flue.push("chimney_decommission");

    // Gas / Condensate
    out.Gas.push("gas_supply_check");
    out.Condensate.push("condensate_route");

    // Locations / Controls / Housekeeping
    out.LocationAndMakingGood.push("loc_old_new");
    out.Controls.push("controls_reconfig");
    out.HouseKeeping.push("system_cleanse","trvs_balancing");

    // Expand keys to strings and inject variables
    function materialise(sectionKey, key){
      const s = NOTES[sectionKey][key] || key; // Summary line is prebuilt
      return s.replace("{LocA}", i.LocA||"?")
              .replace("{LocB}", i.LocB||"?")
              .replace("{BlrB}", i.BlrB||"?");
    }
    const finalOut = {};
    Object.keys(out).forEach(sec=>{
      finalOut[sec] = out[sec].map(k=>materialise(sec,k));
      if (sec==="HotWater" && finalOut[sec].length===0){
        finalOut[sec] = ["\u2198\ufe0f Verify incoming cold main flow/pressure meets specification;"];
      }
    });
    return finalOut;
  }

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
    return resolve(i);
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
