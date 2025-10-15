const FALLBACK_TEXT = 'No items recorded.';

function loadOutput() {
  try {
    const stored = window.localStorage.getItem('surveyOutput');
    if (!stored) {
      return {};
    }
    return JSON.parse(stored);
  } catch (error) {
    console.warn('Unable to read stored output', error);
    return {};
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
      if (trimmed.endsWith(';') || trimmed.endsWith(':')) {
        return line;
      }
      const leadingWhitespace = (line.match(/^\s*/) || [''])[0];
      const withoutTrailing = trimmed.replace(/;+$/, '');
      return `${leadingWhitespace}${withoutTrailing};`;
    })
    .join('\n');
}

function getSanitizedValue(output, key) {
  const rawValue = typeof output[key] === 'string' ? output[key] : '';
  const value = rawValue.trim().length ? rawValue : FALLBACK_TEXT;
  return ensureSemicolons(value);
}

function writeOutputToPage(output) {
  document.querySelectorAll('[data-output-field]').forEach(element => {
    const key = element.dataset.outputField;
    element.textContent = getSanitizedValue(output, key);
  });
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

function attachCopyHandlers(output) {
  document.querySelectorAll('[data-output-key]').forEach(button => {
    button.addEventListener('click', async () => {
      const key = button.dataset.outputKey;
      const text = getSanitizedValue(output, key);
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
  const output = loadOutput();
  writeOutputToPage(output);
  attachCopyHandlers(output);
});
