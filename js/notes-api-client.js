(function (global) {
  const API_ENDPOINT = "https://survey-brain-api.martinbibb.workers.dev/api/notes";
  const DEFAULT_SUMMARY_ENDPOINT = "https://survey-brain-api.martinbibb.workers.dev/gpt-all";
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

  function getSummaryEndpoint() {
    try {
      const stored = window.localStorage.getItem("CF_GPT_URL");
      if (stored && stored.trim()) {
        return stored.trim();
      }
    } catch (error) {
      console.warn("Unable to read summary endpoint override", error);
    }
    return DEFAULT_SUMMARY_ENDPOINT;
  }

  function normaliseSummaryPayload(input) {
    if (typeof input === "string") {
      return input;
    }
    try {
      return JSON.stringify(input, null, 2);
    } catch (error) {
      console.warn("Unable to stringify summary payload", error);
      return String(input);
    }
  }

  function extractSummaryFromResponse(parsed) {
    if (parsed == null) {
      return "";
    }

    if (typeof parsed === "string") {
      return parsed.trim();
    }

    const candidates = [];

    if (typeof parsed.output === "string") {
      candidates.push(parsed.output);
    }

    if (typeof parsed.summary === "string") {
      candidates.push(parsed.summary);
    }

    if (typeof parsed.result === "string") {
      candidates.push(parsed.result);
    }

    if (typeof parsed.message === "string") {
      candidates.push(parsed.message);
    }

    if (parsed.output && typeof parsed.output === "object") {
      const nested = extractSummaryFromResponse(parsed.output);
      if (nested) {
        candidates.push(nested);
      }
    }

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }

    if (Array.isArray(parsed)) {
      const joined = parsed
        .map(item => (typeof item === "string" ? item.trim() : extractSummaryFromResponse(item)))
        .filter(Boolean)
        .join(" ");
      return joined.trim();
    }

    if (parsed && typeof parsed === "object") {
      for (const value of Object.values(parsed)) {
        const extracted = extractSummaryFromResponse(value);
        if (extracted) {
          return extracted;
        }
      }
    }

    return "";
  }

  async function simplifyResultsAI(resultsJSON) {
    const endpoint = getSummaryEndpoint();
    const input = normaliseSummaryPayload(resultsJSON);
    const payload = {
      instructions: "Summarise this technical text in plain English, in one or two short sentences.",
      input
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const bodyText = await response.text();

    if (!response.ok) {
      const suffix = bodyText ? `: ${bodyText}` : "";
      throw new Error(`Summary endpoint returned ${response.status}${suffix}`);
    }

    if (!bodyText.trim()) {
      return "";
    }

    let parsed;
    try {
      parsed = JSON.parse(bodyText);
    } catch (error) {
      return bodyText.trim();
    }

    return extractSummaryFromResponse(parsed);
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
      setOutputMessage("Summarising survey results…", "loading");
      let simplifiedText = "";
      try {
        simplifiedText = await simplifyResultsAI(pretty);
      } catch (error) {
        console.error("Summary generation failed", error);
      }
      if (!simplifiedText) {
        simplifiedText = "Could not simplify results. Please try again.";
        setOutputMessage(simplifiedText, "error");
      } else {
        setOutputMessage(simplifiedText, "success");
      }
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
    sendToAPI,
    simplifyResultsAI
  };
})(window);
