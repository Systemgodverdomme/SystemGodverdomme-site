(() => {
  'use strict';

  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();

  ready(() => {
    const tools = document.querySelector('.tools-panel');
    const source = document.getElementById('dictionary-source');
    if (!tools || !source) return;

    const entries = [...source.querySelectorAll('dt')].map((dt, index) => {
      const dd = dt.nextElementSibling;
      return {
        id: `entry-${index + 1}`,
        term: dt.textContent.trim(),
        definition: dd?.textContent.trim() || ''
      };
    }).filter(item => item.term);
    if (!entries.length) return;

    const actions = document.createElement('div');
    actions.className = 'dictionary-actions';
    actions.innerHTML = `
      <button class="dictionary-action" type="button" data-dict-random>↯ Terme aléatoire</button>
      <button class="dictionary-action" type="button" data-dict-daily>◉ Mot du jour</button>
      <button class="dictionary-action" type="button" data-dict-diagnostic>⌁ Diagnostic SGVD</button>`;

    const feature = document.createElement('section');
    feature.className = 'dictionary-feature';
    feature.hidden = true;
    feature.setAttribute('aria-live', 'polite');
    feature.innerHTML = `
      <div>
        <p class="label" data-dict-feature-label>Signal lexical</p>
        <h2 data-dict-feature-term></h2>
        <p data-dict-feature-definition></p>
        <p class="dictionary-copy-note" data-dict-copy-note></p>
      </div>
      <div class="dictionary-feature-actions">
        <button class="dictionary-action" type="button" data-dict-open>Voir dans le lexique</button>
        <button class="dictionary-action" type="button" data-dict-copy>Copier le lien</button>
      </div>`;

    const diagnostic = document.createElement('section');
    diagnostic.className = 'dictionary-diagnostic';
    diagnostic.hidden = true;
    diagnostic.innerHTML = `
      <h2>Quel type d’anomalie SGVD êtes-vous ?</h2>
      <div class="dictionary-diagnostic-options">
        <button class="dictionary-action" type="button" data-dict-profile="chaos">Je transforme tout en bordel organisé.</button>
        <button class="dictionary-action" type="button" data-dict-profile="satire">Je démonte surtout par le sarcasme.</button>
        <button class="dictionary-action" type="button" data-dict-profile="signal">Je repère les bugs avant les autres.</button>
      </div>
      <p class="dictionary-diagnostic-result" data-dict-diagnostic-result></p>`;

    tools.append(actions, feature, diagnostic);

    const termEl = feature.querySelector('[data-dict-feature-term]');
    const defEl = feature.querySelector('[data-dict-feature-definition]');
    const labelEl = feature.querySelector('[data-dict-feature-label]');
    const noteEl = feature.querySelector('[data-dict-copy-note]');
    let current = null;

    const cardFor = item => document.getElementById(item.id)?.closest('.entry-card');
    const linkFor = item => `${location.origin}${location.pathname}#${item.id}`;

    function reveal(item, label = 'Signal lexical') {
      current = item;
      feature.hidden = false;
      labelEl.textContent = label;
      termEl.textContent = item.term;
      defEl.textContent = item.definition;
      noteEl.textContent = '';
    }

    function openItem(item) {
      const search = document.getElementById('search-bar');
      if (search?.value) {
        search.value = '';
        search.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const card = cardFor(item);
      if (!card) return;
      document.querySelectorAll('.entry-card.is-target').forEach(el => el.classList.remove('is-target'));
      card.classList.add('is-target');
      history.replaceState(null, '', `#${item.id}`);
      card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      setTimeout(() => card.classList.remove('is-target'), 1800);
    }

    function randomEntry() {
      return entries[Math.floor(Math.random() * entries.length)];
    }

    function dailyEntry() {
      const now = new Date();
      const key = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      let hash = 0;
      for (const ch of key) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
      return entries[Math.abs(hash) % entries.length];
    }

    actions.querySelector('[data-dict-random]').addEventListener('click', () => reveal(randomEntry(), 'Interception aléatoire'));
    actions.querySelector('[data-dict-daily]').addEventListener('click', () => reveal(dailyEntry(), 'Mot du jour // stable 24 h'));
    actions.querySelector('[data-dict-diagnostic]').addEventListener('click', () => {
      diagnostic.hidden = !diagnostic.hidden;
      if (!diagnostic.hidden) diagnostic.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    feature.querySelector('[data-dict-open]').addEventListener('click', () => current && openItem(current));
    feature.querySelector('[data-dict-copy]').addEventListener('click', async () => {
      if (!current) return;
      const url = linkFor(current);
      try {
        await navigator.clipboard.writeText(url);
        noteEl.textContent = 'Lien copié. Transmission autorisée.';
      } catch {
        noteEl.textContent = url;
      }
    });

    const profiles = {
      chaos: ['Godverdommiser', 'Godverdommation', 'Godverdommination', 'Godverdommique'],
      satire: ['Godverdommoclastie', 'Godverdommotisme', 'Godverdommédie', 'Godverdommisme'],
      signal: ['Godverdommologue', 'Godverdommystique', 'Godverdommètre', 'Godverdommulation']
    };
    const result = diagnostic.querySelector('[data-dict-diagnostic-result]');
    diagnostic.querySelectorAll('[data-dict-profile]').forEach(button => button.addEventListener('click', () => {
      const pool = profiles[button.dataset.dictProfile] || [];
      const name = pool[Math.floor(Math.random() * pool.length)];
      const item = entries.find(entry => entry.term.toLowerCase() === name.toLowerCase()) || randomEntry();
      result.innerHTML = `<strong>${item.term}</strong> — ${item.definition}`;
      reveal(item, 'Diagnostic lexical');
    }));

    if (location.hash.startsWith('#entry-')) {
      const item = entries.find(entry => `#${entry.id}` === location.hash);
      if (item) setTimeout(() => { reveal(item, 'Lien direct'); openItem(item); }, 120);
    }
  });
})();