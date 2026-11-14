const byId = Object.fromEntries(exercises.map(exercise => [exercise.id, exercise]));
const groups = [...new Set(exercises.map(exercise => exercise.group))];
const presets = [
  {name:'Haut du corps', ids:['chest','lat','row','shoulder','tri']},
  {name:'Bas du corps', ids:['press','hip','ext','curl','calf']},
  {name:'Corps entier', ids:['press','chest','lat','rdl','crunch']}
];
const icons = {Pectoraux:'◈', Dos:'↔', Jambes:'⌁', Fessiers:'◇', Épaules:'△', Bras:'ϟ', Abdos:'⊞'};
const key = 'fit-log-v1';
const main = document.querySelector('#main');
const details = document.querySelector('#details');
const notice = document.querySelector('#notice');
const timer = document.querySelector('#timer');
let state = {ids:[], sessions:[], draft:null};
try {
  const saved = JSON.parse(localStorage.getItem(key));
  if (saved) state = saved;
} catch {
  notice.textContent = 'Impossible de lire les données enregistrées.';
}
let muscle = 'Tous';
let query = '';
let progressId = '';
let granularity = 'week';
let deadline = 0;
let restName = '';

function persist() {
  try {
    localStorage.setItem(key, JSON.stringify(state));
    return true;
  } catch {
    notice.textContent = 'Impossible d’enregistrer sur cet appareil. Vérifie le stockage du navigateur.';
    return false;
  }
}

function escapeHtml(value) {
  const entities = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
  return String(value).replace(/[&<>"']/g, character => entities[character]);
}

function today() {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth()+1).padStart(2,'0'), String(now.getDate()).padStart(2,'0')].join('-');
}

function formatDate(iso) {
  return new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T00:00:00Z'));
}

function number(value) {
  return new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2}).format(value);
}

function page() {
  return ['seances','progression'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'exercices';
}

function render() {
  const active = page();
  document.querySelectorAll('nav a').forEach(link => {
    if (link.hash === '#'+active) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  if (active === 'exercices') renderCatalog();
  else if (active === 'seances') renderSessions();
  else renderProgress();
}

function heading(title, description) {
  return '<header class="page-head"><h1>'+title+'</h1><p>'+description+'</p></header>';
}

function renderCatalog() {
  main.innerHTML = `<section class="hero">
    <div class="hero-copy"><p class="eyebrow">TON CARNET DE MUSCULATION</p><h1>Chaque série<br><em>compte.</em></h1>
    <p>Choisis tes exercices, note tes charges et suis ta progression en salle, semaine après semaine.</p>
    <a class="button primary" href="#seances">Préparer ma séance <span aria-hidden="true">↗</span></a></div>
    <div class="hero-graphic" aria-hidden="true"><i></i><i></i><i></i><div class="weight"><b></b><b></b><b></b><b></b></div></div>
  </section>
  <section aria-labelledby="catalog-title"><div class="section-head"><div><h2 id="catalog-title">Bibliothèque d’exercices</h2><p>Le matériel disponible varie selon le club.</p></div>
  <label class="search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Rechercher un exercice…" aria-label="Rechercher un exercice"></label></div>
  <div class="filters" aria-label="Groupes musculaires">${['Tous',...groups].map(group => `<button data-action="filter" data-id="${group}" aria-pressed="${muscle===group}">${group}</button>`).join('')}</div>
  <p id="count" class="muted" aria-live="polite"></p><div id="cards" class="grid"></div></section>`;
  main.querySelector('input').value = query;
  renderCards();
}

function renderCards() {
  const normalize = text => text.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
  const matches = exercises.filter(ex => (muscle==='Tous'||ex.group===muscle) && normalize([ex.name,ex.muscles,ex.equipment,machines[ex.machine]].join(' ')).includes(normalize(query.trim())));
  main.querySelector('#count').textContent = matches.length+' exercice'+(matches.length===1?'':'s');
  main.querySelector('#cards').innerHTML = matches.map(ex => `<article class="card"><div class="card-top"><span class="exercise-icon" aria-hidden="true">${icons[ex.group]}</span><span class="tag">${ex.equipment}</span></div>
    <h3>${ex.name}</h3><p>${ex.muscles}</p>${ex.machine ? '<p class="machine-name">'+machines[ex.machine]+'</p>' : ''}<div class="card-actions"><button data-action="details" data-id="${ex.id}">Voir la technique</button>
    <button class="pick" data-action="pick" data-id="${ex.id}" aria-label="${state.ids.includes(ex.id)?'Retirer':'Ajouter'} ${ex.name}" aria-pressed="${state.ids.includes(ex.id)}">${state.ids.includes(ex.id)?'✓':'+'}</button></div></article>`).join('') || '<p class="empty">Aucun exercice trouvé.</p>';
}

function showDetails(ex) {
  details.innerHTML = `<form method="dialog"><button aria-label="Fermer">×</button></form><span class="tag">${ex.equipment}</span>
  <h2 id="exercise-dialog-title">${ex.name}</h2><div class="exercise-visuals${ex.machine?' has-machine':''}">
  <section><h3>Muscles ciblés</h3>${muscleMap(ex.muscles)}</section>
  ${ex.machine ? `<section><h3>Appareil</h3>${machineFigure(ex.machine)}</section>` : ''}</div>
  <p><strong>Comment faire</strong><br>${ex.how}</p>
  <p><strong>Récupération suggérée</strong><br>${ex.rest} secondes entre les séries</p><button type="button" class="primary" data-action="rest" data-id="${ex.id}">Démarrer le chrono</button>`;
  details.showModal();
  const photo = details.querySelector('.machine-photo');
  photo?.addEventListener('error',()=>{ photo.hidden = true; details.querySelector('.photo-fallback').hidden = false; },{once:true});
}

function newExercise(id) {
  const previous = [...state.sessions].sort((a,b)=>b.date.localeCompare(a.date)).find(session=>session.entries.some(entry=>entry.id===id));
  const last = previous?.entries.find(entry=>entry.id===id)?.sets.at(-1);
  return {id, sets:Array.from({length:3},()=>({
    kg:last?.kg ?? (byId[id].equipment==='Poids du corps' ? 0 : ''), reps:last?.reps ?? '', done:false
  }))};
}

function renderSessions() {
  main.innerHTML = heading('Mes séances','Compose ton entraînement et enregistre les séries réellement effectuées.') +
  `<section class="panel"><div class="section-head"><h2>${state.draft?'Préparer la prochaine séance':'Préparer une séance'}</h2><a href="#exercices">Choisir des exercices ↗</a></div>
  <div class="filters">${presets.map((preset,index)=>`<button data-action="preset" data-id="${index}">${preset.name}</button>`).join('')}</div>
  ${state.ids.length ? '<ul class="selection">'+state.ids.map(id=>`<li>${byId[id].name}<button data-action="pick" data-id="${id}" aria-label="Retirer ${byId[id].name}">×</button></li>`).join('')+'</ul>' : '<p class="muted">Sélectionne des exercices ou choisis un modèle ci-dessus.</p>'}
  <button class="primary" data-action="start" ${!state.ids.length||state.draft?'disabled':''}>Démarrer la séance</button></section>` +
  (state.draft ? draftHtml() : '') +
  `<section class="panel"><h2>Historique</h2>${historyHtml()}</section>`;
  updateCalories();
}

function draftHtml() {
  const draft = state.draft;
  return `<form class="panel" id="workout"><h2>Séance en cours</h2>
  <div class="form-grid">
    <label>Nom<input maxlength="70" required data-field="name" value="${escapeHtml(draft.name)}"></label>
    <label>Date<input type="date" required data-field="date" value="${draft.date}"></label>
    <label>Durée (min)<input type="number" min="1" max="600" required data-field="minutes" value="${draft.minutes}"></label>
    <label>Poids du corps (kg)<input type="number" min="1" max="500" step="0.1" required data-field="body" value="${draft.body}"></label>
    <label>Intensité<select data-field="met"><option value="3.5">Modérée</option><option value="6" ${Number(draft.met)===6?'selected':''}>Soutenue</option></select></label>
  </div><p id="calories" class="kcal"></p><p class="muted">Coche les séries effectuées. Cocher une série lance le chrono de récupération de l’exercice.</p>
  ${draft.entries.map(entry=>`<fieldset><legend>${byId[entry.id].name}</legend>
    <button type="button" data-action="rest" data-id="${entry.id}">Récupération · ${byId[entry.id].rest} s</button>
    ${entry.sets.map((set,index)=>`<div class="series" data-entry="${entry.id}" data-index="${index}"><strong>Série ${index+1}</strong>
      <label>Charge (kg)<input type="number" min="0" max="2000" step="0.01" inputmode="decimal" data-set="kg" value="${set.kg}"></label>
      <label>Répétitions<input type="number" min="1" max="999" inputmode="numeric" data-set="reps" value="${set.reps}"></label>
      <label class="check"><input type="checkbox" data-set="done" ${set.done?'checked':''}> Faite</label>
      <button type="button" data-action="remove-set" data-id="${entry.id}" data-index="${index}" aria-label="Supprimer la série ${index+1} de ${byId[entry.id].name}" ${entry.sets.length===1?'disabled':''}>×</button>
    </div>`).join('')}<button type="button" data-action="add-set" data-id="${entry.id}">+ Ajouter une série</button></fieldset>`).join('')}
  <div class="actions"><button class="primary" type="submit">Enregistrer la séance</button><button type="button" data-action="cancel">Abandonner</button></div>
  </form>`;
}

function estimate(body, minutes, met) {
  if (!(body>0 && minutes>0)) return null;
  return Math.round(met * 3.5 * body * minutes / 200);
}

function updateCalories() {
  const output = document.querySelector('#calories');
  if (!output) return;
  const {body,minutes,met} = state.draft;
  const result = estimate(body,minutes,met);
  output.textContent = result===null ? 'Renseigne ta durée et ton poids pour estimer les calories.' : '≈ '+number(result)+' kcal dépensées sur la séance';
}

function historyHtml() {
  if (!state.sessions.length) return '<p class="muted">Tes séances enregistrées apparaîtront ici.</p>';
  return [...state.sessions].reverse().sort((a,b)=>b.date.localeCompare(a.date)).map(session => `<details class="history">
    <summary><strong>${escapeHtml(session.name)}</strong><span>${formatDate(session.date)} · ≈ ${session.kcal} kcal</span></summary>
    <ul>${session.entries.map(entry=>`<li><strong>${byId[entry.id].name}</strong> · ${entry.sets.map(set=>number(set.kg)+' kg × '+set.reps).join(' / ')}</li>`).join('')}</ul>
    <button data-action="repeat" data-id="${session.id}">Reprendre ces exercices</button>
  </details>`).join('');
}

function weekStart(iso) {
  const date = new Date(iso+'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay()+6)%7);
  return date.toISOString().slice(0,10);
}

function seriesFor(sessions, id, mode) {
  const buckets = new Map();
  for (const session of sessions) {
    const entry = session.entries.find(item=>item.id===id);
    if (!entry?.sets.length) continue;
    const date = mode==='week' ? weekStart(session.date) : session.date;
    const best = Math.max(...entry.sets.map(set=>set.kg));
    buckets.set(date,Math.max(buckets.get(date) ?? 0,best));
  }
  return [...buckets].sort(([a],[b])=>a.localeCompare(b));
}

function renderProgress() {
  const tracked = new Set(state.sessions.flatMap(session=>session.entries.map(entry=>entry.id)));
  const options = exercises.filter(ex=>tracked.has(ex.id));
  if (!tracked.has(progressId)) progressId = options[0]?.id ?? '';
  main.innerHTML = heading('Progression','Retrouve ta charge maximale enregistrée pour chaque exercice, par semaine ou par jour.') +
    (options.length ? `<section class="panel"><div class="form-grid">
    <label>Exercice<select id="exercise-select">${options.map(ex=>`<option value="${ex.id}" ${ex.id===progressId?'selected':''}>${ex.name}</option>`).join('')}</select></label>
    <label>Afficher par<select id="granularity"><option value="week">Semaine</option><option value="day" ${granularity==='day'?'selected':''}>Jour</option></select></label></div>
    ${['pull','dipassist'].includes(progressId)?'<p class="muted">La charge indique le poids d’assistance. Une baisse correspond à moins d’assistance.</p>':''}
    <div id="chart"></div><details><summary>Voir les valeurs du graphique</summary><div id="values"></div></details></section>` :
    '<section class="panel empty"><h2>Ton graphique commence ici</h2><p>Enregistre une séance pour voir les premières charges.</p><a class="button primary" href="#seances">Aller à mes séances ↗</a></section>');
  if (options.length) drawChart();
}

function drawChart() {
  const data = seriesFor(state.sessions,progressId,granularity);
  const holder = document.querySelector('#chart');
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 340;
  canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label','Graphique de charge maximale en kilogrammes. Les valeurs figurent dans le tableau suivant.');
  holder.append(canvas);
  const ctx = canvas.getContext('2d');
  const max = Math.max(...data.map(([,kg])=>kg),1);
  const step = Math.max(1, Math.ceil(max/4));
  const ceiling = step*4;
  const times = data.map(([date])=>Date.parse(date));
  const span = times.at(-1)-times[0];
  const points = data.map(([,kg],i)=>[span ? 78+668*(times[i]-times[0])/span : 412, 280-240*kg/ceiling]);
  ctx.font = '20px system-ui';
  ctx.fillStyle = '#64675e';
  ctx.fillText('kg',24,25);
  for (let i=0;i<=4;i++) {
    const y = 280-i*60;
    ctx.fillStyle = '#64675e';
    ctx.fillText(number(step*i),12,y+6);
    ctx.strokeStyle = '#deded5';
    ctx.beginPath(); ctx.moveTo(75,y); ctx.lineTo(752,y); ctx.stroke();
  }
  ctx.strokeStyle = '#bf450d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  points.forEach(([x,y],i)=>i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.stroke();
  for (const [x,y] of points) {
    ctx.fillStyle = '#bf450d';
    ctx.beginPath(); ctx.arc(x,y,5,0,2*Math.PI); ctx.fill();
  }
  ctx.fillStyle = '#64675e';
  ctx.textAlign = span?'left':'center';
  ctx.fillText(formatDate(data[0][0]),span?78:412,320);
  if (span) {
    ctx.textAlign = 'right';
    ctx.fillText(formatDate(data.at(-1)[0]),746,320);
  }
  document.querySelector('#values').innerHTML = '<table><thead><tr><th>'+ (granularity==='week'?'Semaine du':'Date') +'</th><th>Charge maximale</th></tr></thead><tbody>'+
    [...data].reverse().map(([date,kg])=>'<tr><td>'+formatDate(date)+'</td><td>'+number(kg)+' kg</td></tr>').join('')+'</tbody></table>';
}

function startRest(ex) {
  restName = ex.name;
  deadline = Date.now()+ex.rest*1000;
  timer.hidden = false;
  timer.innerHTML = '<div><strong id="clock"></strong><span id="rest-label"></span></div><button data-action="close-timer" aria-label="Fermer le chrono">×</button>';
  tick();
}

function tick() {
  if (timer.hidden) return;
  const remaining = Math.max(0,Math.ceil((deadline-Date.now())/1000));
  const clock = document.querySelector('#clock');
  const label = document.querySelector('#rest-label');
  clock.textContent = Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0');
  label.textContent = remaining ? restName+' · Récupération' : restName+' · Récupération terminée';
  if (!remaining && deadline) {
    deadline = 0;
    notice.textContent = 'Récupération terminée pour '+restName+'.';
  }
}

document.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const {action,id,index} = button.dataset;
  if (action==='filter') {
    muscle = id;
    main.querySelectorAll('[data-action="filter"]').forEach(filter=>filter.setAttribute('aria-pressed',filter===button));
    renderCards();
    return;
  }
  if (action==='details') return showDetails(byId[id]);
  if (action==='rest') {
    if (details.open) details.close();
    return startRest(byId[id]);
  }
  if (action==='close-timer') {
    timer.hidden = true;
    deadline = 0;
    return;
  }
  if (action==='pick') {
    state.ids = state.ids.includes(id)?state.ids.filter(item=>item!==id):[...state.ids,id];
    if (persist()) notice.textContent = state.ids.includes(id)?byId[id].name+' ajouté à la sélection.':byId[id].name+' retiré de la sélection.';
    if (page()==='exercices') {
      button.setAttribute('aria-pressed',state.ids.includes(id));
      button.setAttribute('aria-label',(state.ids.includes(id)?'Retirer ':'Ajouter ')+byId[id].name);
      button.textContent = state.ids.includes(id)?'✓':'+';
      return;
    }
    return renderSessions();
  }
  if (action==='preset') state.ids = [...presets[id].ids];
  if (action==='start' && !state.draft && state.ids.length) state.draft = {
    name:'Séance de musculation',date:today(),minutes:'',body:state.sessions.at(-1)?.body ?? '',met:3.5,entries:state.ids.map(newExercise)
  };
  if (action==='repeat') state.ids = state.sessions.find(session=>String(session.id)===id).entries.map(entry=>entry.id);
  if (action==='cancel') {
    if (!window.confirm('Abandonner la séance en cours ?')) return;
    state.draft = null;
    timer.hidden = true;
  }
  if (action==='add-set'||action==='remove-set') {
    const entry = state.draft.entries.find(item=>item.id===id);
    if (action==='add-set') entry.sets.push({...entry.sets.at(-1),done:false});
    else if (entry.sets.length>1) entry.sets.splice(Number(index),1);
    const y = scrollY;
    persist();
    renderSessions();
    scrollTo(0,y);
    return;
  }
  persist();
  render();
  if (action==='start') document.querySelector('#workout')?.scrollIntoView({block:'start'});
});

document.addEventListener('input', event => {
  const input = event.target;
  if (input.matches('.search input')) {
    query = input.value;
    return renderCards();
  }
  if (input.dataset.field) {
    state.draft[input.dataset.field] = input.value;
    updateCalories();
    persist();
  }
  if (input.dataset.set && input.type!=='checkbox') {
    const {entry,index} = input.closest('.series').dataset;
    state.draft.entries.find(item=>item.id===entry).sets[index][input.dataset.set] = input.value;
    persist();
  }
});

document.addEventListener('change', event => {
  const input = event.target;
  if (input.id==='exercise-select'||input.id==='granularity') {
    progressId = document.querySelector('#exercise-select').value;
    granularity = document.querySelector('#granularity').value;
    renderProgress();
    return;
  }
  if (input.dataset.set==='done') {
    const {entry,index} = input.closest('.series').dataset;
    state.draft.entries.find(item=>item.id===entry).sets[index].done = input.checked;
    persist();
    if (input.checked) startRest(byId[entry]);
  }
});

document.addEventListener('submit', event => {
  if (event.target.id!=='workout') return;
  event.preventDefault();
  const draft = state.draft;
  const completed = draft.entries.flatMap(entry=>entry.sets.filter(set=>set.done));
  if (!draft.name.trim() || !completed.length || completed.some(set=>set.kg===''||set.reps==='')) {
    notice.textContent = 'Indique un nom, puis renseigne la charge et les répétitions d’au moins une série cochée. Utilise 0 kg pour le poids du corps.';
    return;
  }
  const entries = draft.entries.map(entry=>({id:entry.id,sets:entry.sets.filter(set=>set.done).map(set=>({kg:Number(set.kg),reps:Number(set.reps)}))})).filter(entry=>entry.sets.length);
  const session = {id:Date.now(),name:draft.name.trim(),date:draft.date,body:draft.body,minutes:draft.minutes,met:draft.met,kcal:estimate(draft.body,draft.minutes,draft.met),entries};
  state.sessions.push(session);
  state.draft = null;
  if (!persist()) {
    state.sessions.pop();
    state.draft = draft;
    return;
  }
  timer.hidden = true;
  notice.textContent = 'Séance enregistrée.';
  renderSessions();
});

window.addEventListener('hashchange',()=>{ render(); window.scrollTo(0,0); });
setInterval(tick,250);
render();
