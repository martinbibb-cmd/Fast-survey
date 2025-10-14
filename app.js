const outputSections = [
  "Needs",
  "Working at heights",
  "System characteristics",
  "Components that require assistance",
  "Restrictions",
  "Hazards",
  "Delivery",
  "Office",
  "Boiler and controls",
  "Flue",
  "Pipe"
];

const wizardSteps = [
  {
    id: "step-safety",
    title: "Safety & Access",
    description: "WAH, hazards, parking, deliveries",
    optionSlugs: ["safety_access", "working_at_heights", "hazards", "delivery"],
    defaultDepotSection: "Delivery"
  },
  {
    id: "step-existing",
    title: "Existing System",
    description: "Type, condition, quick photo checklist",
    optionSlugs: ["existing_system"],
    defaultDepotSection: "System characteristics"
  },
  {
    id: "step-house",
    title: "House & Locations",
    description: "Rooms list; tap current vs new location",
    optionSlugs: ["house_locations", "restrictions"],
    defaultDepotSection: "Restrictions"
  },
  {
    id: "step-cupboard",
    title: "Cupboard",
    description: "Cylinder, pumps, valves, wiring centre",
    optionSlugs: ["cupboard", "components_assistance"],
    defaultDepotSection: "Components that require assistance"
  },
  {
    id: "step-controls",
    title: "Controls",
    description: "Existing/user controls; Hive/Vaillant/etc notes",
    optionSlugs: ["controls", "boiler_controls"],
    defaultDepotSection: "Boiler and controls"
  },
  {
    id: "step-radiators",
    title: "Radiators & System",
    description: "TRVs, leaks, sludge, powerflush/cleaning",
    optionSlugs: ["radiators_system", "pipe"],
    defaultDepotSection: "System characteristics"
  },
  {
    id: "step-new-system",
    title: "New System Choice",
    description: "Combi/system/regular + model pick list stub",
    optionSlugs: ["new_system_choice", "needs"],
    defaultDepotSection: "Needs"
  },
  {
    id: "step-flue",
    title: "Flue",
    description: "Old/new arrangement; horizontal/vertical/plume/open/chimney",
    optionSlugs: ["flue"],
    defaultDepotSection: "Flue"
  },
  {
    id: "step-extras",
    title: "Extras",
    description: "Base packs, office notes, components",
    optionSlugs: ["extras", "office"],
    defaultDepotSection: "Office"
  }
];

const state = {
  options: {},
  mapping: {},
  pricebook: [],
  optionsByCode: new Map(),
  selections: [],
  selectionIndex: new Map(),
  manualNotes: [],
  photos: [],
  outputs: {},
  components: [],
  arrowSymbol: "↘️",
  unmappedSelected: new Set()
};

function escapeCss(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(value);
  }
  return value.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`);
}

const dom = {
  wizardPanel: document.querySelector("#wizardPanel"),
  outputTabs: document.querySelector("#outputTabs"),
  outputContent: document.querySelector("#outputContent"),
  outputTemplate: document.querySelector("#outputTemplate"),
  wizardTemplate: document.querySelector("#wizardCardTemplate"),
  configModal: document.querySelector("#configModal"),
  optionsStatus: document.querySelector("#optionsStatus .status-text"),
  mappingStatus: document.querySelector("#mappingStatus .status-text"),
  pricebookStatus: document.querySelector("#pricebookStatus .status-text"),
  unmappedCodes: document.querySelector("#unmappedCodes"),
  dashToggle: document.querySelector("#dashToggle"),
  componentSearch: document.querySelector("#componentSearch"),
  componentSearchBtn: document.querySelector("#componentSearchBtn"),
  componentResults: document.querySelector("#componentResults"),
  selectedComponents: document.querySelector("#selectedComponents"),
  customerSummaryBox: document.querySelector("#customerSummaryBox")
};

document.querySelector("#configBtn").addEventListener("click", () => openConfigModal());
document.querySelector("#closeConfigBtn").addEventListener("click", () => closeConfigModal());
document.querySelector("#resetBtn").addEventListener("click", () => resetApp());
document.querySelector("#gptSummaryBtn").addEventListener("click", () => handleGptSummary());
document.querySelector("#exportZipBtn").addEventListener("click", () => exportZip());
document.querySelector("#exportPdfBtn").addEventListener("click", () => exportPdf());
dom.dashToggle.addEventListener("change", () => {
  state.arrowSymbol = dom.dashToggle.checked ? "-" : "↘️";
  rebuildOutputs();
});
dom.componentSearchBtn.addEventListener("click", () => runComponentSearch());
dom.componentSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    runComponentSearch();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && dom.configModal.getAttribute("aria-hidden") === "false") {
    closeConfigModal();
  }
});

init();

async function init() {
  registerServiceWorker();
  await Promise.all([loadOptionsTxt(), loadMapping(), loadPricebook()]);
  renderWizard();
  renderOutputTabs();
  rebuildOutputs();
}

async function loadOptionsTxt() {
  try {
    const response = await fetch("data/options.txt", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const parsed = parseOptions(text);
    state.options = parsed.sections;
    state.optionsByCode = parsed.byCode;
    dom.optionsStatus.textContent = "Loaded";
    dom.optionsStatus.classList.add("status-ok");
  } catch (error) {
    console.error("Failed to load options", error);
    dom.optionsStatus.textContent = "Error";
    dom.optionsStatus.classList.add("status-error");
  }
}

async function loadMapping() {
  try {
    const response = await fetch("data/mapping.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.mapping = await response.json();
    dom.mappingStatus.textContent = "Loaded";
    dom.mappingStatus.classList.add("status-ok");
  } catch (error) {
    console.error("Failed to load mapping", error);
    dom.mappingStatus.textContent = "Error";
    dom.mappingStatus.classList.add("status-error");
  }
}

async function loadPricebook() {
  try {
    const response = await fetch("data/pricebook.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.pricebook = await response.json();
    dom.pricebookStatus.textContent = `Loaded (${state.pricebook.length})`;
    dom.pricebookStatus.classList.add("status-ok");
  } catch (error) {
    console.error("Failed to load pricebook", error);
    dom.pricebookStatus.textContent = "Error";
    dom.pricebookStatus.classList.add("status-error");
  }
}

function parseOptions(text) {
  const sections = {};
  const byCode = new Map();
  let currentSection = null;
  const lines = text.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("[") && line.endsWith("]")) {
      currentSection = line.slice(1, -1);
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
      continue;
    }
    if (!currentSection) continue;
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length < 3) continue;
    const [code, category, specific] = parts;
    const entry = { code, category, specific, section: currentSection };
    sections[currentSection].push(entry);
    byCode.set(code, entry);
  }
  return { sections, byCode };
}

function renderWizard() {
  dom.wizardPanel.innerHTML = "";
  for (const step of wizardSteps) {
    const card = dom.wizardTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.section = step.id;
    card.querySelector("h2").textContent = step.title;
    card.querySelector(".card-description").textContent = step.description;
    const optionsList = card.querySelector(".options-list");
    const noteTarget = card.querySelector(".manual-note-target");
    const noteList = card.querySelector(".manual-note-list");
    populateDepotTargets(noteTarget, step.defaultDepotSection);
    const combinedOptions = [];
    for (const slug of step.optionSlugs) {
      if (state.options[slug]) {
        combinedOptions.push(...state.options[slug]);
      }
    }
    if (combinedOptions.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No selectable notes configured.";
      empty.className = "empty-message";
      optionsList.appendChild(empty);
    } else {
      for (const option of combinedOptions) {
        const item = createOptionItem(option);
        optionsList.appendChild(item);
      }
    }

    const textarea = card.querySelector(".manual-note textarea");
    card.querySelector(".add-manual-note").addEventListener("click", () => {
      const text = textarea.value.trim();
      if (!text) return;
      const depotSection = noteTarget.value;
      addManualNote({ text, depotSection, stepId: step.id });
      textarea.value = "";
      renderManualNotes(noteList, step.id);
      rebuildOutputs();
    });

    card.querySelector(".manual-note textarea").addEventListener("keydown", (event) => {
      if (event.key === "Enter" && event.metaKey) {
        event.preventDefault();
        card.querySelector(".add-manual-note").click();
      }
    });

    const fileInput = card.querySelector("input[type='file']");
    fileInput.addEventListener("change", (event) => {
      handlePhotoSelection(event.target.files, step.id);
      fileInput.value = "";
    });

    dom.wizardPanel.appendChild(card);
    renderManualNotes(noteList, step.id);
  }
  syncOptionStates();
}

function populateDepotTargets(selectEl, preferred) {
  selectEl.innerHTML = "";
  for (const section of outputSections) {
    const option = document.createElement("option");
    option.value = section;
    option.textContent = section;
    if (section === preferred) {
      option.selected = true;
    }
    selectEl.appendChild(option);
  }
}

function createOptionItem(option) {
  const item = document.createElement("label");
  item.className = "option-item";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.dataset.code = option.code;
  const info = document.createElement("div");
  const headline = document.createElement("div");
  headline.className = "option-headline";
  headline.textContent = option.specific;
  const meta = document.createElement("div");
  meta.className = "option-meta";
  meta.textContent = `${option.category} • ${option.code}`;
  info.append(headline, meta);
  item.append(checkbox, info);

  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      selectCode(option.code);
    } else {
      deselectCode(option.code);
    }
    syncOptionStates();
    rebuildOutputs();
  });

  item.addEventListener("click", (event) => {
    if (event.target === checkbox) return;
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
  });

  return item;
}

function renderManualNotes(listEl, stepId) {
  listEl.innerHTML = "";
  const notes = state.manualNotes.filter((note) => note.stepId === stepId);
  for (const note of notes.sort((a, b) => a.createdAt - b.createdAt)) {
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = `${note.depotSection}: ${note.text}`;
    const removeBtn = document.createElement("button");
    removeBtn.className = "secondary";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      removeManualNote(note.id);
      renderManualNotes(listEl, stepId);
      rebuildOutputs();
    });
    li.append(text, removeBtn);
    listEl.appendChild(li);
  }
}

function renderOutputTabs() {
  dom.outputTabs.innerHTML = "";
  dom.outputContent.innerHTML = "";
  for (const section of outputSections) {
    const tabButton = document.createElement("button");
    tabButton.textContent = section;
    tabButton.dataset.section = section;
    tabButton.addEventListener("click", () => activateOutputSection(section));
    dom.outputTabs.appendChild(tabButton);

    const outputNode = dom.outputTemplate.content.firstElementChild.cloneNode(true);
    outputNode.dataset.section = section;
    outputNode.querySelector(".output-title").textContent = section;
    const textarea = outputNode.querySelector("textarea");
    const copyBtn = outputNode.querySelector(".copy-btn");
    const clearBtn = outputNode.querySelector(".clear-btn");
    const rebuildBtn = outputNode.querySelector(".rebuild-btn");
    const insertManualBtn = outputNode.querySelector(".insert-manual-btn");

    copyBtn.addEventListener("click", () => copySection(section));
    clearBtn.addEventListener("click", () => {
      state.outputs[section] = "";
      textarea.value = "";
      updatePreview(section, "");
      refreshTabBadges();
    });
    rebuildBtn.addEventListener("click", () => rebuildOutputs());
    insertManualBtn.addEventListener("click", () => {
      const manualText = prompt(`Manual note for ${section}`);
      if (manualText && manualText.trim()) {
        addManualNote({ text: manualText.trim(), depotSection: section, stepId: null });
        rebuildOutputs();
      }
    });

    dom.outputContent.appendChild(outputNode);
  }
  if (outputSections.length) {
    activateOutputSection(outputSections[0]);
  }
}

function activateOutputSection(section) {
  const tabButtons = dom.outputTabs.querySelectorAll("button");
  tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.section === section);
  });
  const outputSectionsDom = dom.outputContent.querySelectorAll(".output-section");
  outputSectionsDom.forEach((node) => {
    node.classList.toggle("active", node.dataset.section === section);
  });
}

function selectCode(code) {
  if (state.selectionIndex.has(code)) return;
  const entry = { code, createdAt: Date.now() };
  state.selectionIndex.set(code, entry);
  state.selections.push(entry);
  evaluateUnmapped();
}

function deselectCode(code) {
  if (!state.selectionIndex.has(code)) return;
  state.selections = state.selections.filter((item) => item.code !== code);
  state.selectionIndex.delete(code);
  evaluateUnmapped();
}

function syncOptionStates() {
  const checkboxes = dom.wizardPanel.querySelectorAll("input[type='checkbox'][data-code]");
  checkboxes.forEach((checkbox) => {
    const code = checkbox.dataset.code;
    checkbox.checked = state.selectionIndex.has(code);
    checkbox.parentElement.classList.toggle("selected", checkbox.checked);
  });
}

function addManualNote({ text, depotSection, stepId, source = "manual" }) {
  const cleaned = sanitizeText(text);
  const id = crypto.randomUUID ? crypto.randomUUID() : `manual-${Date.now()}-${Math.random()}`;
  state.manualNotes.push({ id, text: cleaned, depotSection, createdAt: Date.now(), stepId, source });
  return id;
}

function removeManualNote(id) {
  state.manualNotes = state.manualNotes.filter((note) => note.id !== id);
}

function sanitizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function rebuildOutputs() {
  const outputs = buildDepotOutputs();
  state.outputs = outputs;
  for (const [section, content] of Object.entries(outputs)) {
    const textarea = dom.outputContent.querySelector(`.output-section[data-section="${escapeCss(section)}"] textarea`);
    if (textarea) textarea.value = content;
    updatePreview(section, content);
  }
  refreshTabBadges();
  updateCustomerSummary();
  renderManualNotesInCards();
  renderSelectedComponents();
  updateConfigBadges();
}

function buildDepotOutputs() {
  const outputs = {};
  const sortedSelections = [...state.selections].sort((a, b) => a.createdAt - b.createdAt);
  const sectionSets = new Map();
  for (const section of outputSections) {
    outputs[section] = [];
    sectionSets.set(section, new Set());
  }

  for (const { code } of sortedSelections) {
    const depotSection = state.mapping[code];
    if (!depotSection) continue;
    const option = state.optionsByCode.get(code);
    if (!option) continue;
    const formatted = formatLine(option.specific);
    const set = sectionSets.get(depotSection);
    if (!set) continue;
    if (!set.has(formatted)) {
      outputs[depotSection].push(formatted);
      set.add(formatted);
    }
  }

  const manualBySection = {};
  for (const note of [...state.manualNotes].sort((a, b) => a.createdAt - b.createdAt)) {
    if (!manualBySection[note.depotSection]) manualBySection[note.depotSection] = [];
    const formatted = formatLine(note.text);
    manualBySection[note.depotSection].push(formatted);
  }

  for (const section of outputSections) {
    const manual = manualBySection[section] || [];
    outputs[section] = [...(outputs[section] || []), ...manual];
  }

  for (const section of outputSections) {
    outputs[section] = (outputs[section] || []).join("\n");
  }

  return outputs;
}

function formatLine(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return `${state.arrowSymbol} ${cleaned};`;
}

function updatePreview(section, content) {
  const previewNode = dom.outputContent.querySelector(`.output-section[data-section="${escapeCss(section)}"] .preview-lines`);
  if (previewNode) {
    previewNode.textContent = content;
  }
}

function refreshTabBadges() {
  const tabButtons = dom.outputTabs.querySelectorAll("button");
  tabButtons.forEach((button) => {
    const section = button.dataset.section;
    const text = state.outputs[section] || "";
    const hasContent = Boolean(text.trim());
    button.classList.toggle("empty", !hasContent);
  });
}

function updateCustomerSummary() {
  const summary = buildGptCustomerSummary({
    selections: [...state.selections],
    manualNotes: [...state.manualNotes],
    outputs: state.outputs
  });
  dom.customerSummaryBox.value = summary;
}

function handleGptSummary() {
  const summary = buildGptCustomerSummary({
    selections: [...state.selections],
    manualNotes: [...state.manualNotes],
    outputs: state.outputs
  });
  dom.customerSummaryBox.value = summary;
}

function buildGptCustomerSummary() {
  return "";
}

function copySection(section) {
  const content = state.outputs[section] || "";
  navigator.clipboard.writeText(content).catch((error) => {
    console.error("Clipboard copy failed", error);
  });
}

function resetApp() {
  state.selections = [];
  state.selectionIndex.clear();
  state.manualNotes = [];
  state.photos = [];
  state.outputs = {};
  state.components = [];
  state.unmappedSelected.clear();
  syncOptionStates();
  rebuildOutputs();
  renderPhotoChips();
}

function openConfigModal() {
  dom.configModal.setAttribute("aria-hidden", "false");
  dom.configModal.focus();
  updateConfigBadges();
}

function closeConfigModal() {
  dom.configModal.setAttribute("aria-hidden", "true");
}

function updateConfigBadges() {
  const container = dom.unmappedCodes;
  container.innerHTML = "";
  if (state.unmappedSelected.size === 0) {
    container.textContent = "None selected.";
    container.classList.remove("has-items");
  } else {
    container.classList.add("has-items");
    for (const code of state.unmappedSelected) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = code;
      container.appendChild(badge);
    }
  }
}

function evaluateUnmapped() {
  state.unmappedSelected.clear();
  for (const entry of state.selections) {
    if (!state.mapping[entry.code]) {
      state.unmappedSelected.add(entry.code);
    }
  }
  updateConfigBadges();
}

function runComponentSearch() {
  const term = dom.componentSearch.value.trim().toLowerCase();
  dom.componentResults.innerHTML = "";
  if (!term) return;
  const matches = state.pricebook.filter((item) => {
    return [item.name, item.sku].some((field) => (field || "").toLowerCase().includes(term));
  });
  if (matches.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No components found.";
    dom.componentResults.appendChild(empty);
    return;
  }
  for (const item of matches) {
    const card = document.createElement("div");
    card.className = "component-card";
    const name = document.createElement("strong");
    name.textContent = item.name;
    const sku = document.createElement("div");
    sku.textContent = `SKU: ${item.sku}`;
    const price = document.createElement("div");
    price.textContent = `Price: ${item.price}`;
    const addBtn = document.createElement("button");
    addBtn.className = "primary";
    addBtn.textContent = "Add to Office";
    addBtn.addEventListener("click", () => {
      addComponent(item);
    });
    card.append(name, sku, price, addBtn);
    dom.componentResults.appendChild(card);
  }
}

function addComponent(item) {
  const exists = state.components.find((component) => component.sku === item.sku);
  if (exists) return;
  const text = `${item.name} (${item.sku}) ${item.price}`;
  const id = crypto.randomUUID ? crypto.randomUUID() : `component-${Date.now()}-${Math.random()}`;
  const noteId = addManualNote({ text, depotSection: "Office", stepId: null, source: "component" });
  state.components.push({ id, ...item, addedAt: Date.now(), noteId });
  rebuildOutputs();
}

function renderSelectedComponents() {
  dom.selectedComponents.innerHTML = "";
  for (const component of state.components.sort((a, b) => a.addedAt - b.addedAt)) {
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = `${component.name} (${component.sku}) ${component.price}`;
    const removeBtn = document.createElement("button");
    removeBtn.className = "secondary";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      state.components = state.components.filter((item) => item.id !== component.id);
      if (component.noteId) {
        removeManualNote(component.noteId);
      }
      rebuildOutputs();
    });
    li.append(text, removeBtn);
    dom.selectedComponents.appendChild(li);
  }
}

function renderManualNotesInCards() {
  const cards = dom.wizardPanel.querySelectorAll(".wizard-card");
  cards.forEach((card) => {
    const list = card.querySelector(".manual-note-list");
    const stepId = card.dataset.section;
    renderManualNotes(list, stepId);
  });
}

async function handlePhotoSelection(fileList, stepId) {
  const files = Array.from(fileList || []);
  for (const file of files) {
    try {
      const compressed = await compressImage(file);
      const photo = {
        id: crypto.randomUUID ? crypto.randomUUID() : `photo-${Date.now()}-${Math.random()}`,
        name: `${Date.now()}-${file.name.replace(/\s+/g, "-")}`,
        blob: compressed.blob,
        dataUrl: compressed.dataUrl,
        width: compressed.width,
        height: compressed.height,
        stepId,
        createdAt: Date.now()
      };
      state.photos.push(photo);
    } catch (error) {
      console.error("Photo compression failed", error);
    }
  }
  renderPhotoChips();
}

function renderPhotoChips() {
  const cards = dom.wizardPanel.querySelectorAll(".wizard-card");
  cards.forEach((card) => {
    const list = card.querySelector(".photo-list");
    const stepId = card.dataset.section;
    list.innerHTML = "";
    const photos = state.photos.filter((photo) => photo.stepId === stepId);
    for (const photo of photos.sort((a, b) => a.createdAt - b.createdAt)) {
      const chip = document.createElement("div");
      chip.className = "photo-chip";
      const span = document.createElement("span");
      span.textContent = photo.name;
      const remove = document.createElement("button");
      remove.className = "secondary";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        state.photos = state.photos.filter((p) => p.id !== photo.id);
        renderPhotoChips();
      });
      chip.append(span, remove);
      list.appendChild(chip);
    }
  });
}

function compressImage(file) {
  const maxDimension = 1600;
  const quality = 0.7;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }
            const reader2 = new FileReader();
            reader2.onload = () => {
              resolve({
                blob,
                dataUrl: reader2.result,
                width,
                height
              });
            };
            reader2.readAsDataURL(blob);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function exportZip() {
  const zip = new JSZip();
  const depotFolder = zip.folder("export").folder("depots");
  for (const section of outputSections) {
    const content = state.outputs[section] || "";
    await depotFolder.file(`${section}.txt`, content);
  }
  const exportFolder = zip.folder("export");
  await exportFolder.file(
    "components.json",
    JSON.stringify(state.components, null, 2)
  );
  await exportFolder.file(
    "selections.json",
    JSON.stringify(
      {
        selections: state.selections,
        manualNotes: state.manualNotes,
        generatedAt: new Date().toISOString()
      },
      null,
      2
    )
  );
  const photosFolder = exportFolder.folder("photos");
  for (const photo of state.photos) {
    await photosFolder.file(photo.name, photo.blob);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `depot-notes-${Date.now()}.zip`, "application/zip");
}

async function exportPdf() {
  try {
    const pdfBlob = await buildPdfSummary();
    downloadBlob(pdfBlob, `depot-summary-${Date.now()}.pdf`, "application/pdf");
  } catch (error) {
    console.error("PDF export failed", error);
  }
}

function downloadBlob(blob, filename, type) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function buildPdfSummary() {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const objects = [];
  const xObjects = [];

  const fontObject = addPdfObject(objects, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);

  for (let index = 0; index < state.photos.length; index += 1) {
    const photo = state.photos[index];
    const arrayBuffer = await photo.blob.arrayBuffer();
    const binary = new Uint8Array(arrayBuffer);
    const dict = `<< /Type /XObject /Subtype /Image /Width ${photo.width} /Height ${photo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${binary.length} >>`;
    const objectNumber = addPdfStreamObject(objects, dict, binary);
    xObjects.push({ name: `Im${index + 1}`, objectNumber, width: photo.width, height: photo.height });
  }

  let content = [];
  const margin = 40;
  let cursorY = pageHeight - margin;
  const lineHeight = 16;
  const addTextLine = (text, fontSize = 12) => {
    const safeText = text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    content.push(`BT /F1 ${fontSize} Tf ${margin} ${cursorY} Td (${safeText}) Tj ET`);
    cursorY -= lineHeight;
  };

  addTextLine("Depot Summary", 16);
  addTextLine(new Date().toLocaleString());
  addTextLine(`Selections recorded: ${state.selections.length}`);
  addTextLine(" ");

  for (const section of outputSections) {
    const lines = (state.outputs[section] || "").split("\n").filter(Boolean);
    if (lines.length === 0) continue;
    if (cursorY < margin + lineHeight * (lines.length + 2)) {
      content.push("/F1 12 Tf" );
    }
    addTextLine(section, 14);
    for (const line of lines) {
      addTextLine(line, 11);
    }
    addTextLine(" ");
  }

  if (xObjects.length) {
    addTextLine("Photos", 14);
    let photoX = margin;
    cursorY -= 10;
    const thumbnailWidth = 140;
    const thumbnailHeight = 90;
    for (const xObject of xObjects) {
      if (cursorY < margin + thumbnailHeight) {
        cursorY = margin;
      }
      content.push(`q ${thumbnailWidth} 0 0 ${thumbnailHeight} ${photoX} ${cursorY - thumbnailHeight} cm /${xObject.name} Do Q`);
      photoX += thumbnailWidth + 10;
      if (photoX + thumbnailWidth > pageWidth - margin) {
        photoX = margin;
        cursorY -= thumbnailHeight + 10;
      }
    }
  }

  const contentStream = content.join("\n");
  const encodedContent = new TextEncoder().encode(contentStream);
  const resourcesDict = buildResourcesDictionary(xObjects, fontObject);
  const contentObject = addPdfStreamObject(objects, `<< /Length ${encodedContent.length} >>`, encodedContent);
  const pageObject = addPdfObject(
    objects,
    `<< /Type /Page /Parent 2 0 R /Resources ${resourcesDict} /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Contents ${contentObject} 0 R >>`
  );
  const pagesObject = addPdfObject(objects, `<< /Type /Pages /Count 1 /Kids [${pageObject} 0 R] >>`);
  const catalogObject = addPdfObject(objects, `<< /Type /Catalog /Pages ${pagesObject} 0 R >>`);

  const pdfBytes = buildPdfBinary(objects, catalogObject);
  return new Blob([pdfBytes], { type: "application/pdf" });
}

function addPdfObject(objects, body) {
  const number = objects.length + 1;
  objects.push({ number, body, stream: null });
  return number;
}

function addPdfStreamObject(objects, dict, stream) {
  const number = objects.length + 1;
  objects.push({ number, body: dict, stream });
  return number;
}

function buildResourcesDictionary(xObjects, fontObject) {
  const entries = [`/Font << /F1 ${fontObject} 0 R >>`];
  if (xObjects.length) {
    const xobjectEntries = xObjects
      .map((obj) => `/${obj.name} ${obj.objectNumber} 0 R`)
      .join(" ");
    entries.push(`/XObject << ${xobjectEntries} >>`);
  }
  return `<< ${entries.join(" ")} >>`;
}

function buildPdfBinary(objects, catalogObjectNumber) {
  const header = "%PDF-1.4\n";
  const parts = [header];
  let offset = header.length;
  for (const obj of objects) {
    const text = getObjectText(obj);
    parts.push(text);
    offsets.push(offset);
    offset += text.length;
  }
  const xrefOffset = offset;
  const xrefLines = ["xref", `0 ${objects.length + 1}`, "0000000000 65535 f "];
  let runningOffset = header.length;
  for (const obj of objects) {
    const text = getObjectText(obj);
    xrefLines.push(`${runningOffset.toString().padStart(10, "0")} 00000 n `);
    runningOffset += text.length;
  }
  xrefLines.push("");
  const xref = xrefLines.join("\n");
  parts.push(xref);
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObjectNumber} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  parts.push(trailer);
  const pdfString = parts.join("");
  return new TextEncoder().encode(pdfString);
}

function getObjectText(obj) {
  if (obj.stream) {
    const stream = arrayBufferToBinary(obj.stream);
    return `${obj.number} 0 obj\n${obj.body}\nstream\n${stream}\nendstream\nendobj\n`;
  }
  return `${obj.number} 0 obj\n${obj.body}\nendobj\n`;
}

function arrayBufferToBinary(buffer) {
  if (typeof buffer === "string") return buffer;
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .catch((error) => console.error("Service worker registration failed", error));
  }
}

class ZipBuilder {
  constructor(prefix = "") {
    this.prefix = prefix;
    this.entries = [];
    this.root = this;
  }

  folder(name) {
    const folder = new ZipBuilder(`${this.prefix}${name}/`);
    folder.root = this.root;
    this.root.entries.push({ type: "dir", name: `${this.prefix}${name}/` });
    return folder;
  }

  async file(name, data) {
    const fullName = `${this.prefix}${name}`;
    const payload = await resolveData(data);
    this.root.entries.push({ type: "file", name: fullName, data: payload });
    return this;
  }

  async generateAsync({ type }) {
    const blob = await generateZipBlob(this.root.entries);
    if (type === "blob") return blob;
    return blob;
  }
}

class JSZip extends ZipBuilder {}

async function resolveData(data) {
  if (data instanceof Blob) {
    return new Uint8Array(await data.arrayBuffer());
  }
  if (data instanceof Uint8Array) {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }
  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  }
  if (typeof data.then === "function") {
    const resolved = await data;
    return resolveData(resolved);
  }
  return new Uint8Array();
}

async function generateZipBlob(entries) {
  const files = entries.filter((entry) => entry.type === "file");
  const encoder = new TextEncoder();
  const fileRecords = [];
  let offset = 0;
  const chunks = [];

  for (const entry of files) {
    const nameBytes = encoder.encode(entry.name);
    const data = entry.data;
    const crc = crc32(data);
    const localHeader = new DataView(new ArrayBuffer(30));
    localHeader.setUint32(0, 0x04034b50, true);
    localHeader.setUint16(4, 20, true);
    localHeader.setUint16(6, 0, true);
    localHeader.setUint16(8, 0, true);
    localHeader.setUint16(10, 0, true);
    localHeader.setUint16(12, 0, true);
    localHeader.setUint32(14, crc, true);
    localHeader.setUint32(18, data.length, true);
    localHeader.setUint32(22, data.length, true);
    localHeader.setUint16(26, nameBytes.length, true);
    localHeader.setUint16(28, 0, true);
    chunks.push(new Uint8Array(localHeader.buffer));
    chunks.push(nameBytes);
    chunks.push(data);
    fileRecords.push({
      nameBytes,
      crc,
      size: data.length,
      offset,
      flags: 0,
      compression: 0
    });
    offset += 30 + nameBytes.length + data.length;
  }

  const centralDirectoryChunks = [];
  let centralSize = 0;
  for (const record of fileRecords) {
    const header = new DataView(new ArrayBuffer(46));
    header.setUint32(0, 0x02014b50, true);
    header.setUint16(4, 20, true);
    header.setUint16(6, 20, true);
    header.setUint16(8, record.flags, true);
    header.setUint16(10, record.compression, true);
    header.setUint16(12, 0, true);
    header.setUint16(14, 0, true);
    header.setUint32(16, record.crc, true);
    header.setUint32(20, record.size, true);
    header.setUint32(24, record.size, true);
    header.setUint16(28, record.nameBytes.length, true);
    header.setUint16(30, 0, true);
    header.setUint16(32, 0, true);
    header.setUint16(34, 0, true);
    header.setUint16(36, 0, true);
    header.setUint32(38, 0, true);
    header.setUint32(42, record.offset, true);
    centralDirectoryChunks.push(new Uint8Array(header.buffer));
    centralDirectoryChunks.push(record.nameBytes);
    centralSize += 46 + record.nameBytes.length;
  }

  const centralOffset = offset;
  chunks.push(...centralDirectoryChunks);

  const endHeader = new DataView(new ArrayBuffer(22));
  endHeader.setUint32(0, 0x06054b50, true);
  endHeader.setUint16(4, 0, true);
  endHeader.setUint16(6, 0, true);
  endHeader.setUint16(8, fileRecords.length, true);
  endHeader.setUint16(10, fileRecords.length, true);
  endHeader.setUint32(12, centralSize, true);
  endHeader.setUint32(16, centralOffset, true);
  endHeader.setUint16(20, 0, true);
  chunks.push(new Uint8Array(endHeader.buffer));

  const totalLength = chunks.reduce((sum, part) => sum + part.length, 0);
  const zipBuffer = new Uint8Array(totalLength);
  let position = 0;
  for (const chunk of chunks) {
    zipBuffer.set(chunk, position);
    position += chunk.length;
  }
  return new Blob([zipBuffer], { type: "application/zip" });
}

function crc32(data) {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ data[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const crc32Table = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let j = 0; j < 8; j += 1) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c >>>= 1;
      }
    }
    table[i] = c >>> 0;
  }
  return table;
})();

