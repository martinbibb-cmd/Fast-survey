// Enhanced page logic: selectable nodes, enforced A→B flow, and live Depot notes.
(function(){
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
  const params = new URLSearchParams(location.search);
  const key = params.get('tree');

  const meta = key && TREE_INDEX[key];
  const titleEl = $('#tree-title');
  const rootEl = $('#tree-root');
  const overlay = $('#done-overlay');
  const selAEl = $('#selA');
  const selBEl = $('#selB');
  const notesBox = $('#notesBox');
  const flowHint = $('#flowHint');

  const STATE = {
    aPath: [],  // array of labels from root A downward
    bPath: [],  // array of labels from root B downward
    mode: 'A',  // enforce A → B
  };

  if(!meta){
    if (titleEl) titleEl.textContent = 'Unknown tree';
    if (rootEl) rootEl.innerHTML = `<p style="color:#9aa3b2">No tree registered for key: <code>${key||'(none)'}</code>.</p>`;
    return;
  }

  if (titleEl) titleEl.textContent = meta.title;

  fetch(meta.file).then(r => r.text()).then(xmlText => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');
    const body = xml.querySelector('body');
    if(!body){
      rootEl.textContent = 'Invalid OPML (no <body>)';
      return;
    }

    // Convert OPML outlines → nodes
    const toNode = (outlineEl, depth=0) => {
      const text = outlineEl.getAttribute('text') || outlineEl.getAttribute('title') || 'Untitled';
      const children = [...outlineEl.children]
        .filter(c => c.tagName.toLowerCase() === 'outline')
        .map(c => toNode(c, depth+1));
      return { text, children, depth, id: crypto.randomUUID() };
    };
    const roots = [...body.children]
      .filter(e => e.tagName.toLowerCase()==='outline')
      .map(e => toNode(e, 0));

    // Expecting two main trunks for A and B in A→B trees; fall back gracefully otherwise
    let trunkA = roots[0] || null;
    let trunkB = roots[1] || null;

    // Render two trunks as separate sections with headings and flow
    renderTree(trunkA, trunkB);
    runGrowthAnimation();

  }).catch(err => {
    console.error(err);
    rootEl.textContent = 'Failed to load tree data.';
  });

  function renderTree(trunkA, trunkB){
    rootEl.innerHTML = '';

    const wrap = document.createElement('section');
    wrap.className = 'tree grow';
    rootEl.appendChild(wrap);

    // Section A
    if (trunkA){
      wrap.appendChild(sectionTitleEl('A (Current)'));
      const aEl = renderTrunk(trunkA, 'A');
      aEl.id = 'sectionA';
      wrap.appendChild(aEl);
    }

    // Section B
    if (trunkB){
      wrap.appendChild(sectionTitleEl('B (Proposed)'));
      const bEl = renderTrunk(trunkB, 'B');
      bEl.id = 'sectionB';
      wrap.appendChild(bEl);
    }

    // controls
    $('#expand-all').onclick = () => $$('.children.hidden', wrap).forEach(el => el.classList.remove('hidden'));
    $('#collapse-all').onclick = () => $$('.children', wrap).forEach(el => el.classList.add('hidden'));
    $('#reset-growth').onclick = () => location.reload();

    $('#overlay-done').onclick = () => {
      overlay.classList.add('hidden');
      $('#collapse-all').click();
    };

    $('#copyNotes').onclick = async () => {
      try {
        await navigator.clipboard.writeText(notesBox.value);
        toast('Copied!');
      } catch {
        toast('Select & copy manually.');
        notesBox.select();
      }
    };

    $('#clearSel').onclick = () => {
      STATE.aPath = [];
      STATE.bPath = [];
      STATE.mode = 'A';
      // remove selected class
      $$('.node.selected').forEach(n => n.classList.remove('selected'));
      updateSummaries();
      hintForMode();
      scrollIntoView('#sectionA');
    };

    hintForMode();
  }

  function sectionTitleEl(label){
    const h = document.createElement('div');
    h.className = 'section-title';
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.textContent = label;
    const hint = document.createElement('span');
    hint.className = 'scroll-hint';
    h.appendChild(pill);
    h.appendChild(hint);
    return h;
  }

  function renderTrunk(rootNode, trunkKey){
    // BFS by depth to build horizontal layers
    const host = document.createElement('div');
    host.className = 'tree';
    let layer = 0;
    let current = [{node: rootNode, parent:null}];
    const allNodes = [];

    while(current.length){
      const layerEl = document.createElement('div');
      layerEl.className = 'layer';
      layerEl.dataset.depth = layer;

      current.forEach(({node}) => {
        const nodeEl = elNode(node, trunkKey);
        nodeEl.dataset.depth = node.depth;
        nodeEl.dataset.trunk = trunkKey;
        layerEl.appendChild(nodeEl);
        allNodes.push(nodeEl);
      });

      host.appendChild(layerEl);

      // next layer
      const next = [];
      current.forEach(({node}) => node.children.forEach(ch => next.push({node:ch, parent:node})));
      current = next;
      layer++;
    }

    // finish growth overlay timer calculation (for both trunks combined it’s fine to just compute here)
    const total = allNodes.length;
    const lastDelay = 90 * total; // ms (faster than before for snappier feel)
    setTimeout(() => overlay.classList.remove('hidden'), lastDelay + 300);

    return host;
  }

  function elNode(node, trunkKey){
    const wrap = document.createElement('div');
    wrap.className = 'node';
    wrap.dataset.nodeId = node.id;
    wrap.dataset.trunk = trunkKey;
    wrap.dataset.depth = node.depth;

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = node.text;
    wrap.appendChild(label);

    // selection click
    wrap.addEventListener('click', (e) => {
      e.stopPropagation();
      handleSelection(wrap);
    });

    // children container
    const childrenWrap = document.createElement('div');
    childrenWrap.className = 'children';
    if(node.children && node.children.length){
      if(node.depth > 0) childrenWrap.classList.add('hidden');

      const toggle = document.createElement('button');
      toggle.className = 'toggle';
      toggle.textContent = '⤵︎';
      toggle.title = 'Expand/Collapse branch';
      toggle.onclick = (e) => { e.stopPropagation(); childrenWrap.classList.toggle('hidden'); };
      wrap.appendChild(toggle);

      const connector = document.createElement('div');
      connector.className = 'connector';
      wrap.appendChild(connector);

      node.children.forEach(ch => {
        const childEl = elNode(ch, trunkKey);
        childrenWrap.appendChild(childEl);
      });
      wrap.appendChild(childrenWrap);
    }

    return wrap;
  }

  function handleSelection(nodeEl){
    const trunk = nodeEl.dataset.trunk; // 'A' or 'B'
    const depth = Number(nodeEl.dataset.depth);

    // Enforce A → B flow
    if (STATE.mode === 'A' && trunk !== 'A') {
      toast('Pick from A (Current) first.');
      scrollIntoView('#sectionA');
      return;
    }
    if (STATE.mode === 'B' && trunk !== 'B') {
      toast('Now pick from B (Proposed).');
      scrollIntoView('#sectionB');
      return;
    }

    // One selection per depth per trunk: clear previous selection at same depth
    const selector = `.node.selected[data-trunk="${trunk}"][data-depth="${depth}"]`;
    $$(selector).forEach(n => n.classList.remove('selected'));
    nodeEl.classList.add('selected');

    // Update path for the trunk: keep selections up to this depth
    const path = collectPathForTrunk(trunk);
    if (trunk === 'A') STATE.aPath = path;
    if (trunk === 'B') STATE.bPath = path;

    updateSummaries();

    // If finishing A’s first meaningful choice, move to B
    if (trunk === 'A') {
      STATE.mode = 'B';
      hintForMode();
      scrollIntoView('#sectionB');
    }
  }

  function collectPathForTrunk(trunk){
    // Build ordered path by ascending depth of selected nodes within a trunk
    const list = $$('.node.selected').filter(n => n.dataset.trunk === trunk);
    const sorted = list.sort((a,b) => Number(a.dataset.depth) - Number(b.dataset.depth));
    return sorted.map(n => $('.label', n).textContent.trim());
  }

  function updateSummaries(){
    // Render A summary
    renderList(selAEl, STATE.aPath);
    renderList(selBEl, STATE.bPath);

    // Build Depot text (semicolon line breaks)
    const a = STATE.aPath.join(' > ');
    const b = STATE.bPath.join(' > ');
    const depotLines = [
      a ? `Current: ${a};` : `Current: ;`,
      b ? `Proposed: ${b};` : `Proposed: ;`,
      `Reason(s): ;`,
      `Caveats/Notes: ;`
    ];
    notesBox.value = depotLines.join('\n');
  }

  function renderList(host, items){
    host.innerHTML = '';
    if (!items.length) {
      host.innerHTML = `<span class="muted">Nothing selected.</span>`;
      return;
    }
    items.forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'micro';
      row.textContent = `${i+1}. ${t}`;
      host.appendChild(row);
    });
  }

  function hintForMode(){
    if (!flowHint) return;
    if (STATE.mode === 'A') flowHint.textContent = 'Pick from A (Current) first…';
    else flowHint.textContent = 'Now pick from B (Proposed)…';
  }

  function runGrowthAnimation(){
    const nodes = Array.from(document.querySelectorAll('.tree.grow .node'));
    nodes.forEach((n, i) => {
      setTimeout(() => n.classList.add('grown'), 60 * i);
    });
  }

  function scrollIntoView(sel){
    const el = $(sel);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toast(msg){
    // tiny unobtrusive toast
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.position = 'fixed';
    t.style.bottom = '14px';
    t.style.left = '50%';
    t.style.transform = 'translateX(-50%)';
    t.style.background = 'rgba(0,0,0,.75)';
    t.style.color = 'white';
    t.style.padding = '8px 12px';
    t.style.borderRadius = '10px';
    t.style.fontSize = '13px';
    t.style.zIndex = '9999';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1500);
  }
})();
