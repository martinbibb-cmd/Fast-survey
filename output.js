const OUTPUT_SECTIONS = [
  { key: 'workingAtHeights', title: 'Working at heights' },
  { key: 'systemCharacteristics', title: 'System characteristics' },
  { key: 'componentsAssistance', title: 'Components that require assistance' },
  { key: 'restrictions', title: 'Restrictions to work' },
  { key: 'hazards', title: 'External hazards' },
  { key: 'newBoilerAndControls', title: 'New boiler and controls' },
  { key: 'flue', title: 'Flue' },
  { key: 'pipeWork', title: 'Pipe work' },
  { key: 'disruption', title: 'Disruption' }
];

document.addEventListener('DOMContentLoaded', () => {
  renderOutput();
});

function renderOutput() {
  const container = document.getElementById('outputGrid');
  if (!container) return;
  container.innerHTML = '';

  let stored;
  try {
    stored = JSON.parse(window.localStorage.getItem('survey-output') || '{}');
  } catch (error) {
    stored = null;
  }

  if (!stored || Object.keys(stored).length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'output-empty';
    emptyState.textContent = 'No survey data is available yet. Complete the planner and return to this page.';
    container.appendChild(emptyState);
    return;
  }

  OUTPUT_SECTIONS.forEach(section => {
    const card = document.createElement('section');
    card.className = 'copy-card';
    card.setAttribute('data-section', section.key);

    const header = document.createElement('header');
    header.className = 'copy-card__header';
    header.innerHTML = `<h2>${section.title}</h2>`;

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy';

    const body = document.createElement('div');
    body.className = 'copy-card__body';

    const items = Array.isArray(stored[section.key]) ? stored[section.key].filter(Boolean) : [];
    const content = items.length ? items.join('\n') : 'No notes recorded.';

    const pre = document.createElement('pre');
    pre.className = 'copy-card__content';
    pre.textContent = content;

    copyButton.addEventListener('click', async () => {
      await copyToClipboard(content, copyButton);
    });

    header.appendChild(copyButton);
    body.appendChild(pre);
    card.appendChild(header);
    card.appendChild(body);
    container.appendChild(card);
  });
}

async function copyToClipboard(text, button) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopy(text);
    }
    showCopyState(button, true);
  } catch (error) {
    console.warn('Copy failed', error);
    showCopyState(button, false);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function showCopyState(button, success) {
  const original = button.textContent;
  button.textContent = success ? 'Copied!' : 'Copy failed';
  button.disabled = true;
  setTimeout(() => {
    button.textContent = original;
    button.disabled = false;
  }, 2000);
}
