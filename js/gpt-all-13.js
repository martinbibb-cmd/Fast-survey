(function(){
  const DEFAULT_CF_ENDPOINT =
    localStorage.getItem("CF_GPT_URL") || "https://survey-brain-api.martinbibb.workers.dev/gpt-all";

  function setEndpoint(url){
    localStorage.setItem("CF_GPT_URL", (url || "").trim());
  }

  function getEndpoint(){
    return localStorage.getItem("CF_GPT_URL") || DEFAULT_CF_ENDPOINT;
  }

  const SECTION_MAP = {
    Needs: "Needs",
    WorkingAtHeights: "Working at heights",
    SystemCharacteristics: "System characteristics",
    ComponentsAssistance: "Components that require assistance",
    Permissions: "Permissions",
    Hazards: "Hazards",
    Delivery: "Delivery",
    Office: "Office",
    BoilerAndControls: "Boiler and controls",
    Flue: "Flue",
    PipeWork: "Pipe work",
    Disruption: "Disruption",
    CustomerActions: "Customer actions"
  };

  const SECTION_KEYS = Object.keys(SECTION_MAP);

  const bullet = (value) => `↘️ ${String(value || "None recorded").trim().replace(/^[↘️\s]*/, "").replace(/;*$/, "")};`;

  const stripBullet = (value) => {
    if (typeof value !== "string") {
      return "";
    }
    return value.replace(/^↘️\s*/u, "").replace(/;*$/u, "").trim();
  };

  function ensureSentence(text){
    const cleaned = String(text || "").trim().replace(/\s+/g, " ");
    if (!cleaned) {
      return "";
    }
    const initial = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return /[.!?]$/u.test(initial) ? initial : `${initial}.`;
  }

  function uniqueSentences(sentences){
    const seen = new Set();
    return sentences.filter((sentence) => {
      const key = sentence.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  function humanJoin(list){
    if (!list.length) {
      return "";
    }
    if (list.length === 1) {
      return list[0];
    }
    if (list.length === 2) {
      return `${list[0]} and ${list[1]}`;
    }
    return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
  }

  function buildEngineerSummary(bullets){
    const sentences = uniqueSentences(
      bullets
        .map(stripBullet)
        .map(ensureSentence)
        .filter(Boolean)
    );
    if (!sentences.length || sentences.every((sentence) => /^None recorded\.?$/iu.test(sentence))) {
      return "None recorded.";
    }
    return sentences.join(" ");
  }

  function buildCustomerSummary(sectionKey, bullets){
    const sentences = bullets
      .map(stripBullet)
      .map((sentence) => sentence.replace(/[.!?]+$/u, "").trim())
      .filter((sentence) => sentence && !/^None recorded$/iu.test(sentence));

    if (!sentences.length) {
      return sectionKey === "CustomerActions"
        ? "No additional actions needed from you."
        : "Nothing extra needed from you.";
    }

    const joined = humanJoin(sentences.map((sentence) => sentence.replace(/\s+/g, " ")));
    if (!joined) {
      return sectionKey === "CustomerActions"
        ? "No additional actions needed from you."
        : "Nothing extra needed from you.";
    }

    if (sectionKey === "CustomerActions") {
      return `Here's what we need from you: ${joined}.`;
    }

    return `Here's what we're doing: ${joined}.`;
  }

  function summariseSections(sections){
    const normalised = normaliseSections(sections);
    const summarised = {};
    SECTION_KEYS.forEach((key) => {
      const engineer = buildEngineerSummary(normalised[key] || []);
      const customer = buildCustomerSummary(key, normalised[key] || []);
      summarised[key] = [
        bullet(`Engineer summary: ${engineer} ;; Customer summary: ${customer}`)
      ];
    });
    return summarised;
  }

  function normaliseBullet(value){
    if (typeof value !== "string") {
      return null;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    if (/^↘️\s.*;$/u.test(trimmed)) {
      return trimmed;
    }
    return bullet(trimmed.replace(/^↘️\s*/u, "").replace(/;*$/, ""));
  }

  function normaliseSections(sections){
    const normalised = {};
    SECTION_KEYS.forEach((key) => {
      const raw = Array.isArray(sections?.[key]) ? sections[key] : [];
      const cleaned = raw
        .map(normaliseBullet)
        .filter(Boolean);
      normalised[key] = cleaned.length ? cleaned : [bullet("None recorded")];
    });
    return normalised;
  }

  function validateSections(sections){
    if (!sections || typeof sections !== "object") {
      return false;
    }
    return SECTION_KEYS.every((key) => Array.isArray(sections[key]));
  }

  function readState(){
    if (window.NotesEngine && typeof window.NotesEngine.readPlannerState === "function") {
      return window.NotesEngine.readPlannerState();
    }
    const safeGet = (key) => {
      try {
        return localStorage.getItem(key) || "";
      } catch (error) {
        return "";
      }
    };
    const fallbacks = (primary, ...alts) => {
      const keys = [primary, ...alts];
      for (const key of keys) {
        const value = safeGet(key);
        if (value) {
          return value;
        }
      }
      return "";
    };
    return {
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
  }

  function buildManualPrompt(data){
    const template = SECTION_KEYS.reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});

    return `You are an expert UK domestic heating surveyor. Produce depot-ready notes.\n\nGOAL\n- Given an INPUT JSON, produce STRICT JSON with EXACT KEYS (13 sections), each an array of bullets.\n- Every bullet MUST start with "↘️ " and end with ";".\n- Scenario-driven notes (A+B → single scenario label like "COMBI→SYSTEM"). DO NOT additively merge A-only and B-only lists.\n- No wiring talk. Mention F&E ONLY when converting vented → sealed/combi.\n- Balanced flues: add plume/deflector where relevant; add boundary checks for front/alley/boundary; terminal guard if <2 m or accessible.\n- If COMBI proposed: include DHW expectations (not instant at outlet; mains dependent; single draw best).\n- If UNVENTED proposed: include G3 pack + D2 discharge and confirm mains static/dynamic suitability.\n- ALWAYS return ALL 13 sections; if nothing applies, include "↘️ None recorded;".\n\nINPUT JSON\n${JSON.stringify(data, null, 2)}\n\nOUTPUT (STRICT JSON with EXACT KEYS, arrays of bullet strings)\n${JSON.stringify(template, null, 2)}\n\nReturn ONLY the JSON object.`;
  }

  async function callCloudflare(input){
    const url = getEndpoint();
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input })
    });
    const text = await response.text();
    if (!response.ok) {
      let message = `Cloudflare returned ${response.status}`;
      if (text) {
        message += `: ${text}`;
      }
      throw new Error(message);
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      throw new Error("Worker response was not valid JSON");
    }
    if (parsed && typeof parsed.error === "string" && parsed.error) {
      throw new Error(parsed.error);
    }
    const candidate = parsed?.output || parsed?.notes || parsed;
    if (!validateSections(candidate)) {
      throw new Error("Worker response missing expected 13 sections");
    }
    return summariseSections(candidate);
  }

  function findHeading(text){
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4"));
    return headings.find((heading) => heading.textContent.trim().toLowerCase() === text.toLowerCase());
  }

  function ensureArea(headingText){
    let heading = findHeading(headingText);
    if (!heading) {
      const wrapper = document.createElement("section");
      const newHeading = document.createElement("h2");
      newHeading.textContent = headingText;
      wrapper.appendChild(newHeading);
      const anchor = document.querySelector("h1") || document.body.firstElementChild;
      anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
      heading = newHeading;
    }
    let textarea = heading.nextElementSibling;
    if (!textarea || textarea.tagName.toLowerCase() !== "textarea") {
      textarea = document.createElement("textarea");
      textarea.rows = 10;
      textarea.style.width = "100%";
      textarea.style.marginTop = "8px";
      heading.parentNode.insertBefore(textarea, heading.nextSibling);
      const button = document.createElement("button");
      button.textContent = "Copy";
      button.style.margin = "6px 0 16px";
      button.onclick = () => {
        textarea.select();
        document.execCommand("copy");
      };
      textarea.parentNode.insertBefore(button, textarea.nextSibling);
    }
    return textarea;
  }

  function renderAll(sections){
    const normalised = normaliseSections(sections);
    Object.entries(SECTION_MAP).forEach(([key, headingText]) => {
      const textarea = ensureArea(headingText);
      textarea.value = normalised[key].join("\n");
    });
  }

  async function addToolbar(){
    const bar = document.createElement("div");
    bar.style.display = "flex";
    bar.style.gap = "10px";
    bar.style.flexWrap = "wrap";
    bar.style.margin = "12px 0";

    const btnGen = document.createElement("button");
    btnGen.textContent = "Generate with Cloudflare";
    btnGen.onclick = async () => {
      try {
        const input = readState();
        const result = await callCloudflare(input);
        renderAll(result);
      } catch (error) {
        console.error(error);
        alert(error instanceof Error ? error.message : "Cloudflare call failed");
      }
    };

    const btnManual = document.createElement("button");
    btnManual.textContent = "Copy manual prompt";
    btnManual.onclick = async () => {
      const prompt = buildManualPrompt(readState());
      await navigator.clipboard.writeText(prompt);
      alert("Prompt copied. Paste into ChatGPT, copy JSON, then use 'Paste JSON'.");
    };

    const btnPaste = document.createElement("button");
    btnPaste.textContent = "Paste JSON";
    btnPaste.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        const json = JSON.parse(text);
        if (!validateSections(json)) {
          throw new Error("JSON missing expected section keys");
        }
        renderAll(summariseSections(json));
      } catch (error) {
        console.error(error);
        alert("Clipboard does not contain valid depot JSON.");
      }
    };

    const btnEndpoint = document.createElement("button");
    btnEndpoint.textContent = "Endpoint…";
    btnEndpoint.onclick = () => {
      const current = getEndpoint();
      const value = prompt("Cloudflare Worker URL", current);
      if (value !== null) {
        setEndpoint(value);
        alert("Endpoint saved.");
      }
    };

    bar.appendChild(btnGen);
    bar.appendChild(btnManual);
    bar.appendChild(btnPaste);
    bar.appendChild(btnEndpoint);

    const anchor = document.querySelector("h1") || document.body.firstElementChild;
    anchor.parentNode.insertBefore(bar, anchor.nextSibling);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addToolbar);
  } else {
    addToolbar();
  }
})();
