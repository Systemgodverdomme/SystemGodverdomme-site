(() => {
  'use strict';

  const SIM_KEY = 'sgvd_sim_on';
  const VISIT_KEY = 'sgvd_visit_count';
  const ROOT = document.documentElement;

  const signals = [
    'Transmission partielle. Ne corrigez rien.',
    'Le système fonctionne exactement comme prévu. C’est le problème.',
    'Vous avez été détecté. Rien de personnel.',
    'SGVD_NODE_01 répond encore.',
    'Ce message n’était pas prévu pour vous.',
    'Erreur humaine : fonctionnalité non désactivable.',
    'Le réel a été mis à jour sans votre consentement.'
  ];

  const terminalReplies = {
    help: 'COMMANDES : help · music · simulation · frouze · signal · status · clear · exit',
    music: 'ARCHIVE AUDIO DISPONIBLE → /titres/',
    status: () => `STATUT : ${isSimulationOn() ? 'SIMULATION INSTABLE' : 'RÉALITÉ PRÉSUMÉE'} // VISITE ${getVisitCount()}`,
    frouze: 'ANOMALIE FRONTALIÈRE DÉTECTÉE. PROCÉDURE CONSEILLÉE : /lesfrouzbacks/',
    signal: () => signals[Math.floor(Math.random() * signals.length)],
    godverdomme: 'Ce mot ne résout rien. Il décrit mieux le problème.',
    exit: 'TERMINAL MASQUÉ. LE TERMINAL, LUI, VOUS VOIT TOUJOURS.'
  };

  function getVisitCount() {
    const current = Math.max(0, parseInt(localStorage.getItem(VISIT_KEY) || '0', 10));
    return current;
  }

  function registerVisit() {
    const next = getVisitCount() + 1;
    localStorage.setItem(VISIT_KEY, String(next));
    return next;
  }

  function isSimulationOn() {
    return localStorage.getItem(SIM_KEY) === '1';
  }

  function applySimulation() {
    const on = isSimulationOn();
    if (on) ROOT.setAttribute('data-sim', 'on');
    else ROOT.removeAttribute('data-sim');
    document.querySelectorAll('[data-sgvd-sim-toggle], #simToggle').forEach(btn => {
      btn.textContent = on ? 'Simulation ON' : 'Simulation OFF';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function toggleSimulation() {
    localStorage.setItem(SIM_KEY, isSimulationOn() ? '0' : '1');
    applySimulation();
    flashSignal(isSimulationOn() ? 'SIMULATION ACTIVÉE // intégrité du signal dégradée' : 'SIMULATION SUSPENDUE // réalité non garantie');
  }

  function ensureSimulationButton() {
    if (document.getElementById('simToggle') || document.querySelector('[data-sgvd-sim-toggle]')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sgvd-sim-global';
    btn.setAttribute('data-sgvd-sim-toggle', '');
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = 'Simulation OFF';
    document.body.appendChild(btn);
  }

  function flashSignal(text) {
    let el = document.getElementById('sgvd-flash-signal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'sgvd-flash-signal';
      el.className = 'sgvd-flash-signal';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.remove('is-visible');
    void el.offsetWidth;
    el.classList.add('is-visible');
  }

  function terminalMarkup() {
    return `
      <button class="sgvd-terminal-launcher" type="button" aria-controls="sgvd-terminal" aria-expanded="false">&gt;_ TERMINAL</button>
      <section id="sgvd-terminal" class="sgvd-terminal" aria-label="Terminal System Godverdomme" hidden>
        <div class="sgvd-terminal-head"><span>SGVD_TERMINAL // NODE_01</span><button type="button" data-terminal-close aria-label="Fermer le terminal">×</button></div>
        <div class="sgvd-terminal-output" aria-live="polite"><p><span class="prompt">SYS&gt;</span> connexion acceptée.</p><p><span class="prompt">SYS&gt;</span> tapez <strong>help</strong>.</p></div>
        <form class="sgvd-terminal-form"><label class="sr-only" for="sgvd-terminal-input">Commande terminal</label><span class="prompt">USR&gt;</span><input id="sgvd-terminal-input" autocomplete="off" spellcheck="false" aria-label="Commande terminal" /></form>
      </section>`;
  }

  function setupTerminal() {
    if (document.getElementById('sgvd-terminal')) return;
    const host = document.createElement('div');
    host.className = 'sgvd-terminal-host';
    host.innerHTML = terminalMarkup();
    document.body.appendChild(host);

    const launcher = host.querySelector('.sgvd-terminal-launcher');
    const terminal = host.querySelector('.sgvd-terminal');
    const close = host.querySelector('[data-terminal-close]');
    const form = host.querySelector('.sgvd-terminal-form');
    const input = host.querySelector('#sgvd-terminal-input');
    const output = host.querySelector('.sgvd-terminal-output');

    const openTerminal = () => {
      terminal.hidden = false;
      launcher.setAttribute('aria-expanded', 'true');
      setTimeout(() => input.focus(), 0);
    };
    const closeTerminal = () => {
      terminal.hidden = true;
      launcher.setAttribute('aria-expanded', 'false');
      launcher.focus();
    };
    const line = (prefix, text) => {
      const p = document.createElement('p');
      const tag = document.createElement('span');
      tag.className = 'prompt';
      tag.textContent = prefix;
      p.append(tag, document.createTextNode(' ' + text));
      output.appendChild(p);
      output.scrollTop = output.scrollHeight;
    };

    launcher.addEventListener('click', () => terminal.hidden ? openTerminal() : closeTerminal());
    close.addEventListener('click', closeTerminal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !terminal.hidden) closeTerminal();
      if (e.key === '/' && terminal.hidden && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault(); openTerminal();
      }
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const command = input.value.trim().toLowerCase();
      if (!command) return;
      line('USR>', command);
      input.value = '';
      if (command === 'clear') { output.innerHTML = ''; return; }
      if (command === 'simulation') { toggleSimulation(); line('SYS>', isSimulationOn() ? 'SIMULATION ACTIVÉE.' : 'SIMULATION DÉSACTIVÉE.'); return; }
      if (command === 'exit') { line('SYS>', terminalReplies.exit); setTimeout(closeTerminal, 500); return; }
      const reply = terminalReplies[command];
      line('SYS>', typeof reply === 'function' ? reply() : (reply || `COMMANDE INCONNUE : ${command}`));
    });
  }

  function setupNodeEasterEgg() {
    const node = [...document.querySelectorAll('*')].find(el => el.children.length === 0 && el.textContent?.includes('SGVD_NODE_01'));
    if (!node) return;
    node.classList.add('sgvd-node-trigger');
    node.setAttribute('title', 'Signal instable');
    let clicks = 0;
    node.addEventListener('click', () => {
      clicks += 1;
      if (clicks >= 3) {
        clicks = 0;
        flashSignal(signals[Math.floor(Math.random() * signals.length)]);
        document.body.classList.add('sgvd-one-shot-glitch');
        setTimeout(() => document.body.classList.remove('sgvd-one-shot-glitch'), 650);
      }
    });
  }

  function setupFrouzeQuiz() {
    const quiz = document.getElementById('sgvd-frouze-quiz');
    if (!quiz) return;
    const questions = [...quiz.querySelectorAll('[data-frouze-question]')];
    const result = quiz.querySelector('[data-frouze-result]');
    const button = quiz.querySelector('[data-frouze-calc]');
    button?.addEventListener('click', () => {
      let answered = 0, score = 0;
      questions.forEach((q, index) => {
        const checked = q.querySelector(`input[name="fq${index}"]:checked`);
        if (checked) { answered++; score += Number(checked.value || 0); }
      });
      if (answered < questions.length) {
        result.hidden = false;
        result.innerHTML = '<strong>DOSSIER INCOMPLET.</strong><br>Le contrôle douanier exige toutes les réponses.';
        return;
      }
      const pct = Math.round((score / (questions.length * 2)) * 100);
      let label = 'TOURISTE ADMINISTRATIF';
      let punch = 'Vous traversez encore la frontière avec innocence.';
      if (pct >= 75) { label = 'FROUZBACK CERTIFIÉ — CLASSE G'; punch = 'Votre GPS connaît Bardonnex mieux que votre famille.'; }
      else if (pct >= 45) { label = 'FRONTALIER EN COURS DE CONTAMINATION'; punch = 'Vous dites encore « en Suisse » mais vous avez déjà vos habitudes.'; }
      result.hidden = false;
      result.innerHTML = `<span class="sgvd-score">${pct}%</span><strong>${label}</strong><br>${punch}`;
      localStorage.setItem('sgvd_frouze_score', String(pct));
      flashSignal(`DOSSIER FROUZBACK : ${pct}% // classification enregistrée localement`);
    });
  }

  function injectStylesheet() {
    if (document.querySelector('link[href="/assets/css/sgvd-interactive.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/sgvd-interactive.css';
    document.head.appendChild(link);
  }

  function init() {
    injectStylesheet();
    registerVisit();
    ensureSimulationButton();
    applySimulation();
    document.querySelectorAll('[data-sgvd-sim-toggle], #simToggle').forEach(btn => btn.addEventListener('click', toggleSimulation));
    setupTerminal();
    setupNodeEasterEgg();
    setupFrouzeQuiz();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
