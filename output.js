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

function writeOutputToPage(output) {
  const defaultText = 'No items recorded.';
  document.querySelectorAll('[data-output-field]').forEach(element => {
    const key = element.dataset.outputField;
    const value = typeof output[key] === 'string' && output[key].trim().length
      ? output[key]
      : defaultText;
    element.textContent = value;
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
      const text = output[key] || '';
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
