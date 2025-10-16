(function(){
  // -------- Cloudflare Worker endpoint (set once via button) --------
  const DEFAULT_CF_ENDPOINT =
    localStorage.getItem("CF_GPT_URL") || "https://survey-brain-api.martinbibb.workers.dev/gpt-all";
  function setEndpoint(u){ localStorage.setItem("CF_GPT_URL",(u||"").trim()); }
  function getEndpoint(){ return localStorage.getItem("CF_GPT_URL") || DEFAULT_CF_ENDPOINT; }

  // -------- EXACT section keys → EXACT page headings (your list) --------
  const SECTION_MAP = {
    Needs:                          "Needs",
    WorkingAtHeights:               "Working at heights",
    SystemCharacteristics:          "System characteristics",
    ComponentsAssistance:           "Components that require assistance",
    Permissions:                    "Permissions",
    Hazards:                        "Hazards",
    Delivery:                       "Delivery",
    Office:                         "Office",
    BoilerAndControls:              "Boiler and controls",
    Flue:                           "Flue",
    PipeWork:                       "Pipe work",
    Disruption:                     "Disruption",
    CustomerActions:                "Customer actions"
  };

  // -------- Gather planner state (extend freely as your app evolves) --------
  const s = k => localStorage.getItem(k) || "";
  function readState(){
    return {
      // Core current/proposed + flue terminal + locations
      BlrA: s("BlrA") || s("existing_boiler_type"),
      FluA: s("FluA") || s("existing_flue_type"),
      CylA: s("CylA") || s("cylinder_a") || "NONE",
      LocA: s("LocA") || s("existing_boiler_location"),
      BlrB: s("BlrB") || s("new_boiler_type"),
      FluB: s("FluB") || s("new_flue_type_or_direction"),
      CylB: s("CylB") || s("cylinder_b") || ((s("new_boiler_type")||"").toUpperCase()==="COMBI" ? "NONE" : ""),
      LocB: s("LocB") || s("new_boiler_location"),
      TermWall:   s("TermWall")   || s("flue_exit_wall"),
      TermHeight: s("TermHeight") || s("flue_terminal_height"),

      // Extra data you already store (optional but helpful)
      Access:                s("access_equipment"),
      Parking:               s("parking"),
      PermissionsHints:      s("permissions_hints"),
      HazardsList:           s("hazards_list"),
      DeliveryNotes:         s("delivery_notes"),
      OfficeNotes:           s("office_notes"),
      ControlsChoice:        s("controls_choice"),
      NeedsList:             s("needs_list"),
      FreeText:              s("free_text")
    };
  }

  // -------- Prompt (scenario-driven A+B → notes). STRICT 13-key JSON out. --------
  function buildPrompt(data){
    const schema = {
      "Needs": [],
      "WorkingAtHeights": [],
      "SystemCharacteristics": [],
      "ComponentsAssistance": [],
      "Permissions": [],
      "Hazards": [],
      "Delivery": [],
      "Office": [],
      "BoilerAndControls": [],
      "Flue": [],
      "PipeWork": [],
      "Disruption": [],
      "CustomerActions": []
    };

    return `
You are an expert UK domestic heating surveyor. Produce depot-ready notes.

PRINCIPLES
- Scenario-driven: use A+B to infer the scenario (e.g., "SYSTEM→COMBI") and write notes accordingly. Do NOT additively combine A-notes and B-notes.
- No wiring talk. Mention F&E only when converting vented → sealed/combi.
- Every bullet MUST start with "↘️ " and end with ";".
- Use clear UK terms; concise, practical, MI-agnostic (no brands/prices).
- Balanced flues: add plume/deflector where relevant; boundary checks for front/alley/boundary; terminal guard if <2 m or accessible.
- If COMBI proposed: include DHW expectations (not instant at outlet; mains dependent; single draw best).
- If UNVENTED proposed: include G3 pack + D2 discharge and confirm mains static/dynamic suitability.
- ALWAYS return ALL 13 sections below; each must contain ≥1 bullet. If nothing applies, use "↘️ None recorded;".

INPUT (JSON):
${JSON.stringify(data, null, 2)}

OUTPUT (STRICT JSON with EXACT KEYS, arrays of bullet strings):
${JSON.stringify(schema, null, 2)}

Return ONLY the JSON object.`;
  }

  // -------- Call Cloudflare Worker --------
  async function callCloudflare(prompt){
    const url = getEndpoint();
    const res = await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ prompt }) });
    const text = await res.text();
    try { const obj = JSON.parse(text); return obj.output ?? obj; } catch { return JSON.parse(text); }
  }

  // -------- Rendering helpers --------
  function findHeading(text){
    const hs = Array.from(document.querySelectorAll("h1,h2,h3,h4"));
    return hs.find(h => h.textContent.trim().toLowerCase() === text.toLowerCase());
  }
  function ensureArea(headingText){
    let h = findHeading(headingText);
    if(!h){
      const top = document.querySelector("h1") || document.body;
      const wrap = document.createElement("section");
      const newH = document.createElement("h2"); newH.textContent = headingText;
      wrap.appendChild(newH);
      const anchor = top.nextElementSibling || top;
      anchor.parentNode.insertBefore(wrap, anchor);
      h = newH;
    }
    let ta = h.nextElementSibling;
    if(!ta || ta.tagName.toLowerCase()!=="textarea"){
      ta = document.createElement("textarea");
      ta.rows=10; ta.style.width="100%"; ta.style.marginTop="8px";
      h.parentNode.insertBefore(ta, h.nextSibling);
      const btn = document.createElement("button");
      btn.textContent="Copy"; btn.style.margin="6px 0 16px";
      btn.onclick=()=>{ ta.select(); document.execCommand("copy"); };
      ta.parentNode.insertBefore(btn, ta.nextSibling);
    }
    return ta;
  }
  function renderAll(sections){
    Object.entries(SECTION_MAP).forEach(([jsonKey, headingText])=>{
      const arr = Array.isArray(sections[jsonKey]) ? sections[jsonKey] : ["↘️ None recorded;"];
      const ta = ensureArea(headingText);
      ta.value = arr.join("\n");
    });
  }

  // -------- UI toolbar on Output page --------
  function addToolbar(){
    const bar = document.createElement("div");
    bar.style.display="flex"; bar.style.gap="10px"; bar.style.flexWrap="wrap"; bar.style.margin="12px 0";

    const btnGen = document.createElement("button");
    btnGen.textContent = "Generate with GPT (Cloudflare)";
    btnGen.onclick = async ()=>{
      try{
        const prompt = buildPrompt(readState());
        const json = await callCloudflare(prompt);
        renderAll(json);
      }catch(e){
        console.error(e);
        alert("Cloudflare call failed or invalid JSON. Try 'Copy Prompt' and manual paste.");
      }
    };

    const btnCopyPrompt = document.createElement("button");
    btnCopyPrompt.textContent = "Copy Prompt (manual)";
    btnCopyPrompt.onclick = async ()=>{
      const prompt = buildPrompt(readState());
      await navigator.clipboard.writeText(prompt);
      alert("Prompt copied. Paste into ChatGPT, copy JSON, then use 'Paste JSON'.");
    };

    const btnPaste = document.createElement("button");
    btnPaste.textContent = "Paste JSON";
    btnPaste.onclick = async ()=>{
      const txt = await navigator.clipboard.readText();
      try { renderAll(JSON.parse(txt)); } catch { alert("Clipboard doesn't contain valid JSON."); }
    };

    const btnEndpoint = document.createElement("button");
    btnEndpoint.textContent = "Endpoint…";
    btnEndpoint.onclick = ()=>{
      const cur = getEndpoint();
      const v = prompt("Cloudflare Worker URL", cur);
      if(v!==null){ setEndpoint(v); alert("Endpoint saved."); }
    };

    bar.appendChild(btnGen); bar.appendChild(btnCopyPrompt); bar.appendChild(btnPaste); bar.appendChild(btnEndpoint);

    const anchor = document.querySelector("h1") || document.body.firstElementChild;
    anchor.parentNode.insertBefore(bar, anchor.nextSibling);
  }

  if(document.readyState==="loading"){ document.addEventListener("DOMContentLoaded", addToolbar); }
  else { addToolbar(); }
})();
