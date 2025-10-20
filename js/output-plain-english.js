(function (global) {
  function readEndpointOverride() {
    try {
      return localStorage.getItem('CF_GPT_URL') || null;
    } catch (error) {
      console.warn('Plain English helper: unable to read endpoint override', error);
      return null;
    }
  }

  const DEFAULT_ENDPOINT =
    readEndpointOverride() || 'https://survey-brain-api.martinbibb.workers.dev/gpt-all';

  const SECTION_ORDER = [
    'Needs',
    'WorkingAtHeights',
    'SystemCharacteristics',
    'ComponentsAssistance',
    'Permissions',
    'Hazards',
    'Delivery',
    'Office',
    'BoilerAndControls',
    'Flue',
    'PipeWork',
    'Disruption',
    'CustomerActions'
  ];

  const INSTRUCTIONS = String.raw`
You are the **Survey Output Rewriter**. Your task is to convert boiler survey notes into clear, plain-English sentences.

Guidance:
- Treat each section independently – never merge information from different sections.
- Preserve every distinct piece of information from the source text.
- Remove arrow markers, bullet symbols, and codes (for example “↘️ NE01 |”) unless the code itself conveys meaning that must stay; otherwise omit it.
- Write complete sentences using everyday language. Use as many sentences as necessary and keep each section concise.
- Maintain statements such as “No items recorded.” when present.
- Separate sentences with newline characters (\n). Do not number or bullet the lines.

Return the response as JSON with the same keys you receive (Needs, WorkingAtHeights, …). Each value must be a string containing the rewritten sentences for that section.`;

  function getEndpoint() {
    return readEndpointOverride() || DEFAULT_ENDPOINT;
  }

  function readSectionText() {
    const sections = {};
    SECTION_ORDER.forEach((key) => {
      const element = document.querySelector(`[data-output-field="${key}"]`);
      const text = element ? element.textContent || '' : '';
      sections[key] = text.trim();
    });
    return sections;
  }

  function validateResponse(result) {
    if (!result || typeof result !== 'object') {
      return false;
    }
    return SECTION_ORDER.every((key) => typeof result[key] === 'string');
  }

  async function callWorker(sections) {
    const payload = {
      instructions: `${INSTRUCTIONS}\n\nInput JSON:\n${JSON.stringify(sections, null, 2)}`,
      input: { sections }
    };

    const response = await fetch(getEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      throw new Error('Worker response was not valid JSON');
    }

    const candidate = parsed?.output || parsed;
    if (!validateResponse(candidate)) {
      throw new Error('Worker response did not include all section keys');
    }
    return candidate;
  }

  function applySections(sections) {
    if (global.SurveyOutputPage && typeof global.SurveyOutputPage.setFields === 'function') {
      global.SurveyOutputPage.setFields(sections);
      if (typeof global.SurveyOutputPage.refreshTextareas === 'function') {
        global.SurveyOutputPage.refreshTextareas();
      }
      return;
    }

    SECTION_ORDER.forEach((key) => {
      const value = sections[key];
      const target = document.querySelector(`[data-output-field="${key}"]`);
      if (target) {
        target.textContent = value;
      }
      document
        .querySelectorAll(`textarea.notes-engine-output[data-notes-section="${key}"]`)
        .forEach((textarea) => {
          textarea.value = value;
        });
    });
  }

  function setButtonState(button, isLoading, label) {
    if (!button) {
      return;
    }
    if (isLoading) {
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent;
      }
      button.disabled = true;
      button.textContent = label || 'Rewriting…';
      button.setAttribute('aria-busy', 'true');
    } else {
      const text = label || button.dataset.originalText || button.textContent;
      button.textContent = text;
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  }

  async function handlePlainEnglishClick(event) {
    const button = event.currentTarget;
    setButtonState(button, true);

    try {
      const sections = readSectionText();
      const result = await callWorker(sections);
      applySections(result);
      setButtonState(button, false, 'Plain English ready');
      window.setTimeout(() => {
        setButtonState(button, false, button.dataset.originalText || 'Plain English');
      }, 2000);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Plain English rewrite failed');
      setButtonState(button, false);
    }
  }

  function init() {
    const button = document.getElementById('plainEnglishBtn');
    if (button) {
      button.addEventListener('click', handlePlainEnglishClick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
