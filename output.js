const FALLBACK_TEXT = 'No items recorded.';

const LEGACY_KEY_MAP = {
  Needs: 'needs',
  WorkingAtHeights: 'workingAtHeights',
  SystemCharacteristics: 'systemCharacteristics',
  ComponentsAssistance: 'assistanceComponents',
  Permissions: 'restrictions',
  Hazards: 'externalHazards',
  Delivery: 'delivery',
  Office: 'office',
  BoilerAndControls: 'newBoilerAndControls',
  Flue: 'flue',
  PipeWork: 'pipework',
  Disruption: 'disruption',
  CustomerActions: 'customerAgreedActions'
};

const STORAGE_KEY = 'surveyOutput';

let currentOutput = {};

function loadOutput() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored);
  } catch (error) {
    console.warn('Unable to read stored output', error);
    return {};
  }
}

function saveOutput() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentOutput));
  } catch (error) {
    console.warn('Unable to persist survey output', error);
  }
}

function ensureSemicolons(text) {
  const safeText = text == null ? FALLBACK_TEXT : text;

  return String(safeText)
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        return line;
      }
      if (/[;:.!?]$/.test(trimmed)) {
        return line;
      }
      const leadingWhitespace = (line.match(/^\s*/) || [''])[0];
      const withoutTrailing = trimmed.replace(/;+$/, '');
      return `${leadingWhitespace}${withoutTrailing};`;
    })
    .join('\n');
}

function resolveOutputKey(output, key) {
  if (typeof output[key] === 'string') {
    return key;
  }
  const legacyKey = LEGACY_KEY_MAP[key];
  if (legacyKey && typeof output[legacyKey] === 'string') {
    return legacyKey;
  }
  return key;
}

function getSanitizedValue(output, key) {
  const resolvedKey = resolveOutputKey(output, key);
  const rawValue = typeof output[resolvedKey] === 'string' ? output[resolvedKey] : '';
  const value = rawValue.trim().length ? rawValue : FALLBACK_TEXT;
  return ensureSemicolons(value);
}

function getRawValue(key) {
  const resolvedKey = resolveOutputKey(currentOutput, key);
  const rawValue = typeof currentOutput[resolvedKey] === 'string' ? currentOutput[resolvedKey] : '';
  return rawValue.trim().length ? rawValue : '';
}

function writeOutputToPage() {
  document.querySelectorAll('[data-output-field]').forEach(element => {
    const key = element.dataset.outputField;
    element.textContent = getSanitizedValue(currentOutput, key);
  });
}

function syncTextareas() {
  document.querySelectorAll('textarea.notes-engine-output').forEach(textarea => {
    const key = textarea.dataset.notesSection;
    if (!key) {
      return;
    }
    const value = getRawValue(key);
    if (value) {
      textarea.value = value;
    }
  });
}

function setOutputField(key, value) {
  const resolvedKey = resolveOutputKey(currentOutput, key);
  const finalValue = (() => {
    if (value == null) {
      return FALLBACK_TEXT;
    }
    const trimmed = String(value).trim();
    return trimmed.length ? trimmed : FALLBACK_TEXT;
  })();

  currentOutput[resolvedKey] = finalValue;

  const pre = document.querySelector(`[data-output-field="${key}"]`);
  if (pre) {
    pre.textContent = finalValue;
  }

  document
    .querySelectorAll(`textarea.notes-engine-output[data-notes-section="${key}"]`)
    .forEach(textarea => {
      textarea.value = finalValue;
    });

  saveOutput();
}

async function copyText(text) {
  if (!text) {
    return;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const temp = document.createElement('textarea');
  temp.value = text;
  temp.setAttribute('readonly', '');
  temp.style.position = 'absolute';
  temp.style.left = '-9999px';
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
}

function attachCopyHandlers() {
  document.querySelectorAll('[data-output-key]').forEach(button => {
    button.addEventListener('click', async () => {
      const key = button.dataset.outputKey;
      const text = getSanitizedValue(currentOutput, key);
      await copyText(text);
      button.classList.add('copied');
      const original = button.textContent;
      button.textContent = 'Copied!';
      window.setTimeout(() => {
        button.classList.remove('copied');
        button.textContent = original;
      }, 1800);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  currentOutput = loadOutput();
  writeOutputToPage();
  attachCopyHandlers();
  syncTextareas();
  window.SurveyOutputPage = {
    getState: () => ({ ...currentOutput }),
    setField: setOutputField,
    setFields: (entries) => {
      if (!entries || typeof entries !== 'object') {
        return;
      }
      Object.entries(entries).forEach(([key, value]) => {
        setOutputField(key, value);
      });
    },
    refreshTextareas: syncTextareas
  };
});
