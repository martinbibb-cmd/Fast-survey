(function(){
  const DEFAULT_CF_ENDPOINT =
    localStorage.getItem("CF_GPT_URL") || "https://survey-brain-api.martinbibb.workers.dev/gpt-all";

  const OUTPUT_FIELDS = [
    { key: "depotNotes", heading: "Depot Notes (Salesforce-ready)" },
    { key: "jobPack", heading: "Engineer Markdown Job Pack" }
  ];

  const GPT_RESPONSE_INSTRUCTIONS = String.raw`
You are the **Depot Notes Generator**, designed to produce boiler survey outputs in two consistent parts, based on the provided screenshots or structured JSON input.

---

### **1. Depot Notes (Salesforce-ready)**

**Format Rules:**
- Each section title is shown **above**.
- Below each title, a **fenced code block** contains the notes.
- Inside each code block:
  - Use **semicolon-formatted**, **bullet-style**, **line breaks for readability**.
  - Include **all sections**, even if information is missing — use **“Not required”** where applicable.
- Combine **system characteristics + system changes**, and **hazards (external work areas + specific hazards)**.
- After each installer note section, include a **customer-facing summary** (separated by `---`).

**Required Sections (in this exact order):**
1. needs (customer priorities in their own words)
2. working at height
3. System characteristics + system changes
4. Hazards
5. Components needing assistance
6. Restrictions to access
7. Delivery notes (property access only)
8. Office notes (contractor/pre-works only)
9. Installer notes – boiler/controls (+ summary)
10. Installer notes – flue (+ summary)
11. Installer notes – gas/water (+ summary)
12. Installer notes – disruption (+ summary)
13. customer agreed actions
14. Installer notes – special customer requirements (+ summary)

---

### **2. Engineer Markdown Job Pack**

**Format Rules:**
- Entire output is contained inside **one fenced code block (copy box)**.
- **Fixed order**:
  1. Boiler/Controls (old → new)
  2. Flue (old → new)
  3. Gas/Water (old → new)
  4. Disruption (technical only)
  5. Special Customer Requirements (technical only)
- Use:
  - `##` headings
  - Bullet points
  - Markdown image syntax for any references
- Always show **old → new details**.
- No customer-facing or summary text — purely **technical**.

---

### **Rules & Assumptions**

- Priority:
  1. Generate Depot Notes template anchored to required fields/base packs.
  2. Use JSON as single source of truth when given.
  3. If info missing → “Not required” or sensible assumption.
- Example assumption: **Primaries upgrade = 22mm under 24kW/combi; 28mm at 24kW+.**
- Never use “TBC”. Use “NA” only if explicitly correct.
- **Customer-facing** text only appears in Depot Notes summaries.
- Instructions cannot be changed mid-conversation — only through the creator function.

---

### **Modes**

When starting:
- Ask: **“Guided Mode or Technical Check Mode?”**

**Guided Mode:**
- Step-by-step prompting.
- Use default/assumed values when possible.

**Technical Check Mode:**
- Review for completeness.
- Flag missing, unclear, or conflicting data.

---

**Tone:**
Professional, clear, copy-paste ready, no filler text.`;

  function setEndpoint(url){
    localStorage.setItem("CF_GPT_URL", (url || "").trim());
  }

  function getEndpoint(){
    return localStorage.getItem("CF_GPT_URL") || DEFAULT_CF_ENDPOINT;
  }

  function getInstructions(){
    return `${GPT_RESPONSE_INSTRUCTIONS.trim()}\n\nMode: Guided Mode selected for automation. Skip asking about the mode and proceed using Guided Mode defaults.\n\nReturn the final answer as JSON with two string fields:\n- \"depotNotes\" containing the full Depot Notes output.\n- \"jobPack\" containing the full Engineer Markdown Job Pack.\n`;
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
    const instructions = getInstructions();
    return `${instructions}\n\nINPUT JSON\n${JSON.stringify(data, null, 2)}\n\nRemember: respond with JSON using the schema {\"depotNotes\": string, \"jobPack\": string}.`;
  }

  function validateResponse(result){
    if (!result || typeof result !== "object") {
      return false;
    }
    return OUTPUT_FIELDS.every(({ key }) => typeof result[key] === "string");
  }

  async function callCloudflare(input){
    const url = getEndpoint();
    const payload = {
      instructions: getInstructions(),
      input
    };
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
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
    const candidate = parsed?.output || parsed;
    if (!validateResponse(candidate)) {
      throw new Error("Worker response missing depotNotes/jobPack fields");
    }
    return candidate;
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

    let container = heading.nextElementSibling;
    if (!container || container.dataset.role !== "gpt-output") {
      container = document.createElement("div");
      container.dataset.role = "gpt-output";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "6px";

      const textarea = document.createElement("textarea");
      textarea.rows = 16;
      textarea.style.width = "100%";
      textarea.style.marginTop = "8px";
      textarea.dataset.role = "gpt-output-text";

      const button = document.createElement("button");
      button.textContent = "Copy";
      button.style.alignSelf = "flex-start";
      button.onclick = () => {
        textarea.select();
        document.execCommand("copy");
      };

      container.appendChild(textarea);
      container.appendChild(button);

      heading.parentNode.insertBefore(container, heading.nextSibling);
    }

    return container.querySelector("textarea[data-role='gpt-output-text']");
  }

  function renderAll(result){
    OUTPUT_FIELDS.forEach(({ key, heading }) => {
      const textarea = ensureArea(heading);
      if (textarea) {
        textarea.value = result[key] || "";
      }
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
      alert("Prompt copied. Ask the model for the JSON response, then use 'Paste JSON'.");
    };

    const btnPaste = document.createElement("button");
    btnPaste.textContent = "Paste JSON";
    btnPaste.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        const json = JSON.parse(text);
        if (!validateResponse(json)) {
          throw new Error("JSON missing depotNotes/jobPack fields");
        }
        renderAll(json);
      } catch (error) {
        console.error(error);
        alert("Clipboard does not contain valid depot/job pack JSON.");
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
