(function (global) {
  const API_ENDPOINT = "https://survey-brain-api.martinbibb.workers.dev/api/notes";
  const STORAGE_KEYS = [
    "BlrA",
    "FluA",
    "CylA",
    "LocA",
    "BlrB",
    "FluB",
    "CylB",
    "LocB",
    "TermWall",
    "TermHeight",
    "Access",
    "Parking",
    "PermissionsHints",
    "HazardsList",
    "DeliveryNotes",
    "OfficeNotes",
    "ControlsChoice",
    "NeedsList",
    "FreeText"
  ];

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key) || "";
    } catch (error) {
      console.warn(`Unable to access localStorage key ${key}`, error);
      return "";
    }
  }

  function collectPlannerState() {
    if (global.NotesEngine && typeof global.NotesEngine.readPlannerState === "function") {
      return global.NotesEngine.readPlannerState();
    }
    return STORAGE_KEYS.reduce((acc, key) => {
      acc[key] = readStorage(key);
      return acc;
    }, {});
  }

  function collectOutputSummary() {
    try {
      const stored = window.localStorage.getItem("surveyOutput");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn("Unable to parse stored survey output", error);
      return {};
    }
  }

  function collectNotesPreview() {
    if (!global.NotesEngine || typeof global.NotesEngine.buildFromPlanner !== "function") {
      return null;
    }
    try {
      return global.NotesEngine.buildFromPlanner();
    } catch (error) {
      console.warn("NotesEngine preview failed", error);
      return null;
    }
  }

  function collectSurveyData() {
    return {
      plannerState: collectPlannerState(),
      outputSummary: collectOutputSummary(),
      notesPreview: collectNotesPreview(),
      exportedAt: new Date().toISOString()
    };
  }

  async function sendToAPI(payload) {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      const suffix = errorBody ? `: ${errorBody}` : "";
      throw new Error(`API returned ${response.status}${suffix}`);
    }

    return response.json();
  }

  function setOutputMessage(message, status) {
    const target = document.getElementById("api-output");
    if (!target) {
      alert(message);
      return;
    }
    target.textContent = message;
    if (status) {
      target.dataset.status = status;
    } else {
      delete target.dataset.status;
    }
  }

  function setButtonState(button, isLoading) {
    if (!button) {
      return;
    }
    if (isLoading) {
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent;
      }
      button.textContent = "Sending…";
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
      button.removeAttribute("aria-busy");
    }
  }

  async function handleButtonClick(event) {
    const button = event.currentTarget;
    setButtonState(button, true);
    setOutputMessage("Sending survey data…", "loading");
    try {
      const payload = collectSurveyData();
      const data = await sendToAPI(payload);
      const pretty = JSON.stringify(data, null, 2);
      setOutputMessage(pretty, "success");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Unexpected error";
      setOutputMessage(`Error calling API: ${message}`, "error");
    } finally {
      setButtonState(button, false);
    }
  }

  async function copyApiResponse() {
    const output = document.getElementById("api-output");
    const button = document.getElementById("copyApiResponse");
    if (!output || !button) {
      return;
    }
    const text = output.textContent || "";
    if (!text.trim()) {
      return;
    }

    const write = async value => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
        return;
      }
      const temp = document.createElement("textarea");
      temp.value = value;
      temp.setAttribute("readonly", "");
      temp.style.position = "absolute";
      temp.style.left = "-9999px";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    };

    try {
      await write(text);
      button.classList.add("copied");
      const original = button.textContent;
      button.textContent = "Copied!";
      setTimeout(() => {
        button.classList.remove("copied");
        button.textContent = original;
      }, 1800);
    } catch (error) {
      console.error("Unable to copy API response", error);
      alert("Unable to copy response to clipboard. Please copy manually.");
    }
  }

  function init() {
    const button = document.getElementById("generateBtn");
    if (button) {
      button.addEventListener("click", handleButtonClick);
    }

    const copyButton = document.getElementById("copyApiResponse");
    if (copyButton) {
      copyButton.addEventListener("click", copyApiResponse);
    }

    setOutputMessage("Press \"Send to Survey Brain\" to generate structured notes.", "idle");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.SurveyBrainClient = {
    collectSurveyData,
    sendToAPI
  };
})(window);
