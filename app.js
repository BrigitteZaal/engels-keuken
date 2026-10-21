/* Finn's Engelse Keuken – oefen-app (vanilla JS, werkt ook offline als bestand) */
(() => {
const L = window.LESSON, PLAN = window.PLAN;
const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
const KEY = 'finnEngels.v1';
const TEST_DATE = '2026-11-02';

// ---------- state ----------
const blank = () => ({ stars: 0, stats: {}, done: {}, badges: {}, tests: [], rounds: 0, typedOk: 0, bestCombo: 0,
  settings: { big: '0', rate: '0.8', readNl: '0', sfx: '1', voice: '' } });
let S;
try { S = Object.assign(blank(), JSON.parse(window.Store.load(KEY) || '{}')); S.settings = Object.assign(blank().settings, S.settings); } catch (e) { S = blank(); }
const save = () => { try { window.Store.save(KEY, JSON.stringify(S)); } catch (e) {} };

// ---------- helpers ----------
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const norm = s => String(s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim();
const lev = (a, b) => { const m = a.length, n = b.length; const d = Array.from({ length: m + 1 }, (_, i) => [i]); for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; };
const todayStr = () => { const q = new URLSearchParams(location.search).get('today'); if (q) return q; const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);
const wordById = id => L.words.find(w => w.id === id);

// ---------- speech ----------
let voices = [];
function loadVoices() {
  voices = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
  const sel = $('#voiceSel'); if (!sel) return;
  const en = voices.filter(v => /^en[-_]/i.test(v.lang));
  sel.innerHTML = en.length ? en.map(v => `<option value="${esc(v.name)}">${esc(v.name)} (${esc(v.lang)})</option>`).join('') : '<option>Geen Engelse stem gevonden</option>';
  const best = S.settings.voice && en.find(v => v.name === S.settings.voice) ? S.settings.voice : (enVoice() || {}).name;
  if (best) sel.value = best;
}
function enVoice() {
  const en = voices.filter(v => /^en[-_]/i.test(v.lang));
  return en.find(v => v.name === S.settings.voice) || en.find(v => /en[-_]GB/i.test(v.lang) && /female|serena|kate|libby|sonia|google/i.test(v.name)) || en.find(v => /en[-_]GB/i.test(v.lang)) || en[0];
}
const nlVoice = () => voices.find(v => /^nl[-_]NL/i.test(v.lang)) || voices.find(v => /^nl/i.test(v.lang));
function say(text, lang = 'en', rate, cancel = true) {
  if (!window.speechSynthesis) return;
  if (cancel) speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = lang === 'en' ? enVoice() : nlVoice();
  if (v) u.voice = v;
  u.lang = lang === 'en' ? (v ? v.lang : 'en-GB') : 'nl-NL';
  u.rate = rate || parseFloat(S.settings.rate) || 0.8;
  speechSynthesis.speak(u);
}
const sayNl = (t, cancel = true) => say(t, 'nl', Math.max(0.9, parseFloat(S.settings.rate)), cancel);
const instr = t => { if (S.settings.readNl === '1') sayNl(t); };
if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }

// ---------- sounds & confetti ----------
let ac;
function tone(freqs, dur = 0.12) {
  if (S.settings.sfx !== '1') return;
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); let t = ac.currentTime;
    freqs.forEach(f => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.02); t += dur * 0.8; });
  } catch (e) {}
}
const sOk = () => tone([660, 880]), sSoft = () => tone([440, 494], 0.14), sWin = () => tone([523, 659, 784, 1046], 0.14);
function confetti() {
  const c = $('#confetti'), x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const cols = ['#E0482F', '#E9A517', '#3E8E4A', '#2F6FB5', '#7A4AA8'];
  const ps = Array.from({ length: 140 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, r: 4 + Math.random() * 6, vy: 2 + Math.random() * 3, vx: -1.5 + Math.random() * 3, c: pick(cols), a: Math.random() * 6 }));
  let f = 0; (function loop() { x.clearRect(0, 0, c.width, c.height); ps.forEach(p => { p.y += p.vy; p.x += p.vx; p.a += .1; x.fillStyle = p.c; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * .6); x.restore(); }); if (++f < 180) requestAnimationFrame(loop); else x.clearRect(0, 0, c.width, c.height); })();
}
function flash(msg) { const d = document.createElement('div'); d.className = 'combo'; d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), 950); }

// ---------- progress / mastery ----------
function rec(key, ok) { const s = S.stats[key] || (S.stats[key] = { ok: 0, bad: 0, streak: 0 }); if (ok) { s.ok++; s.streak++; } else { s.bad++; s.streak = 0; } }
const st = k => S.stats[k] || { ok: 0, bad: 0, streak: 0 };
const dirDone = k => st(k).ok >= 2 && st(k).streak >= 1;
const wordGot = w => dirDone('w:' + w.id + ':ne') && dirDone('w:' + w.id + ':en');
const phraseGot = p => dirDone('p:' + p.id);
const weakness = k => { const s = st(k); return (s.bad * 2 + 1) / (s.ok + 1) + (s.streak ? 0 : 0.5); };
const LEVELS = [[0, 'Afwashulp', '🧽'], [40, 'Hulpkok', '🥄'], [120, 'Kok', '🍳'], [250, 'Souschef', '🔪'], [450, 'Chef-kok', '👨‍🍳'], [700, 'Sterrenchef', '🌟']];
function level() { let i = 0; LEVELS.forEach((l, j) => { if (S.stars >= l[0]) i = j; }); const cur = LEVELS[i], nxt = LEVELS[i + 1]; return { name: cur[1], ic: cur[2], pct: nxt ? (S.stars - cur[0]) / (nxt[0] - cur[0]) * 100 : 100, next: nxt }; }
function addStars(n) { const before = level().name; S.stars += n; $('#starCount').textContent = S.stars; const after = level(); if (after.name !== before) { setTimeout(() => { flash(`Nieuw niveau: ${after.name} ${after.ic}`); sWin(); confetti(); }, 300); } }

const BADGES = [
  { id: 'first', ic: '🥄', name: 'Eerste ronde', how: 'Maak je eerste oefenronde af' },
  { id: 'g1', ic: '🥕', name: 'Groente-kenner', how: 'Alle woorden van Groep 1 in je voorraadkast' },
  { id: 'g2', ic: '🌶️', name: 'Smaak-proever', how: 'Alle woorden van Groep 2 in je voorraadkast' },
  { id: 'g3', ic: '🍳', name: 'Keuken-baas', how: 'Alle woorden van Groep 3 in je voorraadkast' },
  { id: 'phr', ic: '💬', name: 'Zinnen-chef', how: 'Alle 9 zinnen 2 keer goed' },
  { id: 'gram', ic: '🧠', name: 'Grammatica-held', how: 'Grammatica-ronde met 8 of meer goed' },
  { id: 'combo5', ic: '🔥', name: 'Op dreef', how: '5 keer achter elkaar goed' },
  { id: 'typer', ic: '⌨️', name: 'Typ-tijger', how: '20 woorden goed getypt' },
  { id: 'days3', ic: '📅', name: 'Volhouder', how: 'Op 3 dagen je missie gedaan' },
  { id: 'test8', ic: '🏆', name: 'Toets-klaar', how: 'Proeftoets met een 8 of hoger' }
];
function checkBadges() {
  const got = [];
  const give = id => { if (!S.badges[id]) { S.badges[id] = todayStr(); got.push(BADGES.find(b => b.id === id)); } };
  if (S.rounds >= 1) give('first');
  ['g1', 'g2', 'g3'].forEach(g => { if (L.words.filter(w => w.g === g).every(wordGot)) give(g); });
  if (L.phrases.every(phraseGot)) give('phr');
  if (S.bestCombo >= 5) give('combo5');
  if (S.gram8) give('gram');
  if (S.typedOk >= 20) give('typer');
  const daysDone = PLAN.filter(d => d.tasks.filter(t => !t.optional).length && d.tasks.filter(t => !t.optional).every(t => S.done[t.id])).length;
  if (daysDone >= 3) give('days3');
  if (S.tests.some(t => t.grade >= 8)) give('test8');
  save(); return got;
}

// ---------- coaching texts ----------
const OK = ['Top, chef!', 'Lekker bezig!', 'Yes, die zit erin.', 'Goed zo, dat onthoud je!', 'Perfect gekookt!', 'Knap gedaan!', 'Jij bent goed op dreef!', 'Precies goed!'];
const ALMOST = ['Bijna! Er is maar een klein stukje anders.', 'Zo dichtbij! Kijk even naar de gele letters.', 'Bijna perfect. Goed geprobeerd!'];
const LEARN = ['Geen probleem, dit is een leer-moment.', 'Fout is niet erg: zo leren je hersenen.', 'Goed dat je het probeert. Kijk even mee:', 'Deze komt later nog een keer terug, dan weet je hem.'];

// ---------- question builders ----------
const enOf = w => w.en, nlOf = w => w.nl;
function mcWord(w, dir) { // dir 'ne' = NL->EN, 'en' = EN->NL
  const others = shuffle(L.words.filter(x => x.id !== w.id && x.g === w.g)).slice(0, 2).concat(shuffle(L.words.filter(x => x.g !== w.g)).slice(0, 1));
  const opts = shuffle([w, ...others]);
  return dir === 'ne'
    ? { kind: 'mc', key: 'w:' + w.id + ':ne', pic: w.pic, lang: 'Nederlands', prompt: w.nl, ask: 'Wat is dit in het Engels?', sayPrompt: [w.nl, 'nl'], opts: opts.map(o => ({ t: o.en, ok: o === w, speak: o.en })), answer: w.en, after: [w.en, 'en'] }
    : { kind: 'mc', key: 'w:' + w.id + ':en', pic: '', lang: 'Engels', prompt: w.en, ask: 'Luister. Wat betekent dit?', sayPrompt: [w.en, 'en'], autoSay: true, opts: opts.map(o => ({ t: o.nl, ok: o === w })), answer: w.nl, after: [w.en, 'en'] };
}
function typeWord(w, dir, test) {
  return dir === 'ne'
    ? { kind: 'type', key: 'w:' + w.id + ':ne', pic: test ? '' : w.pic, lang: 'Nederlands', prompt: w.nl, ask: 'Schrijf het Engelse woord.', answers: [w.en], answer: w.en, sayAnswer: [w.en, 'en'], hearHelp: !test, test }
    : { kind: 'type', key: 'w:' + w.id + ':en', pic: test ? '' : w.pic, lang: 'Engels', prompt: w.en, ask: 'Schrijf het Nederlandse woord.', sayPrompt: [w.en, 'en'], autoSay: !test, answers: [w.nl, ...(w.altNl || [])], answer: w.nl, sayAnswer: [w.nl, 'nl'], test };
}
const toTiles = s => s.replace(/[.]$/, '').split(' ');
function phraseMc(p) {
  const others = shuffle(L.phrases.filter(x => x.id !== p.id)).slice(0, 2);
  return { kind: 'mc', key: 'p:' + p.id, pic: p.pic, lang: 'Engels', prompt: p.en, big: false, ask: 'Luister. Welke Nederlandse zin hoort erbij?', sayPrompt: [p.en, 'en'], autoSay: true, opts: shuffle([p, ...others]).map(o => ({ t: o.nl, ok: o === p })), answer: p.nl, after: [p.nl, 'nl'], tip: p.tip };
}
function phraseTiles(p, test) {
  return { kind: 'tiles', key: 'p:' + p.id, pic: test ? '' : p.pic, lang: 'Engels', prompt: p.en, ask: 'Maak de Nederlandse zin.', sayPrompt: [p.en, 'en'], autoSay: !test, target: toTiles(p.nl), extra: [], answer: p.nl, sayAnswer: [p.nl, 'nl'], tip: test ? '' : p.tip, test };
}
// grammar
function gramParts() {
  const many = Math.random() < 0.5, thing = pick(many ? L.grammarThings.more : L.grammarThings.one), adj = pick(L.adjectives), neg = Math.random() < 0.45, shortF = Math.random() < 0.4;
  const enLong = (many ? 'They are' : 'It is') + (neg ? ' not' : '');
  const enShort = (many ? "They're" : "It's") + (neg ? ' not' : '');
  const nl = (many ? 'Ze zijn' : 'Het is') + (neg ? ' niet' : '') + ' ' + adj.nl + '.';
  return { many, thing, adj, neg, shortF, enLong: enLong + ' ' + adj.en + '.', enShort: enShort + ' ' + adj.en + '.', nl };
}
function gramQ(test) {
  const t = pick(['choose', 'choose', 'short', 'nl2en', 'en2nl', 'type', 'meaning']);
  const g = gramParts();
  if (t === 'choose') {
    return { kind: 'mc', key: 'g:choose', pic: g.thing.pic, lang: 'Kies', prompt: `${g.thing.en}?`, sub: `____ ${g.neg ? '' : ''}${g.adj.en}.`, ask: `Is het 1 ding of zijn het meer dingen? Kies het goede begin.`,
      sayPrompt: [g.thing.en, 'en'], opts: shuffle(g.neg ? [{ t: 'It is not', ok: !g.many }, { t: 'They are not', ok: g.many }] : [{ t: 'It is', ok: !g.many }, { t: 'They are', ok: g.many }]), answer: (g.many ? 'They are' : 'It is') + (g.neg ? ' not' : '') + ' ' + g.adj.en + '.', after: [(g.many ? 'They are' : 'It is') + (g.neg ? ' not ' : ' ') + g.adj.en, 'en'],
      tip: g.many ? `${g.thing.nl}: dat zijn meer dingen, dus they are.` : `${g.thing.nl}: dat is 1 ding, dus it is.` };
  }
  if (t === 'short') {
    const f = pick(L.shortForms), rev = Math.random() < 0.4;
    return rev
      ? { kind: 'mc', key: 'g:short', pic: '✂️', lang: 'Korte vorm', prompt: f.short, ask: 'Wat is de lange vorm?', sayPrompt: [f.short, 'en'], opts: shuffle(L.shortForms.map(x => ({ t: x.long, ok: x === f }))), answer: f.long }
      : { kind: 'mc', key: 'g:short', pic: '✂️', lang: 'Lange vorm', prompt: f.long, ask: 'Hoe schrijf je dit korter?', sayPrompt: [f.long, 'en'], opts: shuffle(L.shortForms.map(x => ({ t: x.short, ok: x === f }))), answer: f.short };
  }
  if (t === 'nl2en') {
    const book = !test && Math.random() < 0.25 ? pick(L.grammarBook) : null;
    const nl = book ? book.nl : g.nl, en = book ? book.en : g.enLong;
    const many = /^They/.test(en);
    return { kind: 'tiles', key: 'g:nl2en', pic: test ? '' : (book ? '📖' : g.thing.pic), lang: 'Nederlands', prompt: nl, ask: 'Maak de Engelse zin.', sayPrompt: [nl, 'nl'], target: toTiles(en), extra: many ? ['It', 'is'] : ['They', 'are'], answer: en, sayAnswer: [en, 'en'], tip: test ? '' : (many ? 'Ze zijn = they are' : 'Het is = it is'), test };
  }
  if (t === 'en2nl') {
    const en = g.shortF ? g.enShort : g.enLong;
    return { kind: 'tiles', key: 'g:en2nl', pic: test ? '' : g.thing.pic, lang: 'Engels', prompt: en, ask: 'Maak de Nederlandse zin.', sayPrompt: [en, 'en'], autoSay: !test, target: toTiles(g.nl), extra: g.many ? ['Het', 'is'] : ['Ze', 'zijn'], answer: g.nl, sayAnswer: [g.nl, 'nl'], tip: test ? '' : (g.many ? "they are / they're = ze zijn" : "it is / it's = het is"), test };
  }
  if (t === 'type') {
    return { kind: 'type', key: 'g:type', pic: test ? '' : g.thing.pic, lang: 'Nederlands', prompt: g.nl, ask: 'Schrijf de zin in het Engels.', answers: [g.enLong, g.enShort], answer: g.enLong, sayAnswer: [g.enLong, 'en'], noBoxes: true, test, tip: test ? '' : "Je mag ook de korte vorm gebruiken (it's / they're)." };
  }
  // meaning
  const en = g.shortF ? g.enShort : g.enLong;
  const variants = [['Het is', 0, 0], ['Ze zijn', 1, 0], ['Het is niet', 0, 1], ['Ze zijn niet', 1, 1]];
  return { kind: 'mc', key: 'g:meaning', pic: test ? '' : g.thing.pic, lang: 'Engels', prompt: en, ask: 'Luister. Wat betekent deze zin?', sayPrompt: [en, 'en'], autoSay: !test, opts: shuffle(variants.map(v => ({ t: v[0] + ' ' + g.adj.nl + '.', ok: (!!v[1] === g.many) && (!!v[2] === g.neg) }))), answer: g.nl };
}

// ---------- round builders ----------
function wordsFor(g) { return g === 'all' ? L.words : L.words.filter(w => w.g === g); }
function byWeak(list, keyFn, n) { return shuffle(list).sort((a, b) => weakness(keyFn(b)) - weakness(keyFn(a))).slice(0, n); }
function buildRound(mode, a, b) {
  if (mode === 'listen') {
    const ws = wordsFor(a); let qs = [];
    if (a === 'all') qs = byWeak(ws, w => 'w:' + w.id + ':ne', 10).map((w, i) => mcWord(w, i % 2 ? 'ne' : 'en'));
    else qs = shuffle(ws).map(w => mcWord(w, 'en')).concat(shuffle(ws).map(w => mcWord(w, 'ne')));
    return { title: 'Luister-spel', qs };
  }
  if (mode === 'type') {
    const ws = a === 'all' ? byWeak(L.words, w => 'w:' + w.id + ':' + (b === 'nl' ? 'ne' : 'en'), 12) : shuffle(wordsFor(a));
    return { title: b === 'nl' ? 'Typ-chef: Nederlands → Engels' : 'Typ-chef: Engels → Nederlands', qs: ws.map(w => typeWord(w, b === 'nl' ? 'ne' : 'en')) };
  }
  if (mode === 'phrases') {
    const ps = a === 'a' ? L.phrases.slice(0, 5) : a === 'b' ? L.phrases.slice(5) : L.phrases;
    return { title: 'Zinnen-puzzel', qs: shuffle(ps).map(phraseMc).concat(shuffle(ps).map(p => phraseTiles(p))) };
  }
  if (mode === 'grammar') return { title: 'Grammatica-spel', qs: Array.from({ length: 10 }, () => gramQ()), grammar: true };
  if (mode === 'tricky') {
    const items = [];
    L.words.forEach(w => { items.push({ k: 'w:' + w.id + ':ne', f: () => typeWord(w, 'ne') }); items.push({ k: 'w:' + w.id + ':en', f: () => Math.random() < .5 ? typeWord(w, 'en') : mcWord(w, 'en') }); });
    L.phrases.forEach(p => items.push({ k: 'p:' + p.id, f: () => phraseTiles(p) }));
    const top = shuffle(items).sort((x, y) => weakness(y.k) - weakness(x.k)).slice(0, 10);
    return { title: 'Lastige woordjes', qs: shuffle(top).map(i => i.f()) };
  }
  if (mode === 'test') {
    const ne = shuffle(L.words).slice(0, 7).map(w => typeWord(w, 'ne', true));
    const en = shuffle(L.words.filter(w => !ne.some(q => q.key.includes(':' + w.id + ':')))).slice(0, 7).map(w => typeWord(w, 'en', true));
    const ph = shuffle(L.phrases).slice(0, 4).map(p => phraseTiles(p, true));
    const gr = [];
    while (gr.length < 6) { const q = gramQ(true); if (!gr.some(x => x.key === q.key && x.prompt === q.prompt)) gr.push(q); }
    return { title: 'Proeftoets', qs: [...ne, ...en, ...ph, ...gr], test: true };
  }
}

// ---------- views ----------
function setTab(t) { document.querySelectorAll('#tabs a[data-t]').forEach(a => a.classList.toggle('on', a.dataset.t === t)); }
const todayPlan = () => { const t = todayStr(); return PLAN.find(d => d.date === t) || (t < PLAN[0].date ? PLAN[0] : null); };
const goHash = (go, tid) => go === 'print' ? 'print.html' : '#play/' + go.replace(/:/g, '/') + (tid ? '?t=' + tid : '');
function taskRow(t) {
  const done = !!S.done[t.id];
  return `<div class="task ${done ? 'done' : ''}"><button class="chk" data-tick="${t.id}" aria-label="Afvinken">${done ? '✓' : ''}</button><span class="txt">${esc(t.text)}</span>
    <a class="btn ${done ? 'ghost' : 'leaf'} go" href="${goHash(t.go, t.id)}" ${t.go === 'print' ? `target="_blank" data-printtask="${t.id}"` : ''}>${done ? 'Nog eens' : 'Start'}</a></div>`;
}
function bindTicks() {
  app.querySelectorAll('[data-tick]').forEach(b => b.onclick = () => { const id = b.dataset.tick; S.done[id] = !S.done[id]; if (S.done[id]) { addStars(1); sOk(); } save(); checkBadges(); render(); });
  app.querySelectorAll('[data-printtask]').forEach(a => a.addEventListener('click', () => { S.done[a.dataset.printtask] = true; save(); setTimeout(render, 300); }));
}
function viewHome() {
  setTab('home');
  const t = todayStr(), left = daysBetween(t, TEST_DATE), d = todayPlan(), lv = level();
  const got = L.words.filter(wordGot).length, pgot = L.phrases.filter(phraseGot).length;
  const missed = PLAN.filter(p => p.date < t && !p.rest).flatMap(p => p.tasks.filter(x => !x.optional && !S.done[x.id])).slice(0, 3);
  let countTxt = left > 1 ? `<b>${left}</b><span>dagen tot de toets</span>` : left === 1 ? `<b>1</b><span>dag: morgen is de toets!</span>` : left === 0 ? `<b>Vandaag</b><span>is de toets</span>` : `<b>Klaar</b><span>de toets is geweest</span>`;
  app.innerHTML = `
  <div class="hero">
    <div class="card welcome"><span class="deco" aria-hidden="true">🍕</span>
      <p class="small" style="opacity:.9;margin:0">Toets Engels · Song 2, Lesson 2 · maandag 2 november</p>
      <h1>Hoi Finn! Klaar om te koken?</h1>
      <div class="count">${countTxt}</div>
      <p style="margin:.6em 0 0;max-width:30em">Elke dag een klein beetje. Zo zit alles op 2 november netjes in je hoofd.</p>
    </div>
    <div class="card">
      <div class="chef"><span class="lvl" aria-hidden="true">${lv.ic}</span><div style="flex:1"><div class="small muted">Jouw niveau</div><h2 style="margin:0">${lv.name}</h2></div><span class="pill">⭐ ${S.stars}</span></div>
      <div class="bar" style="margin:12px 0 6px"><i style="width:${lv.pct}%"></i></div>
      <p class="small muted">${lv.next ? `Nog ${lv.next[0] - S.stars} sterren tot ${lv.next[1]} ${lv.next[2]}` : 'Hoogste niveau bereikt!'}</p>
      <p class="small" style="margin:0"><b>${got}</b> van 23 woorden en <b>${pgot}</b> van 9 zinnen in je voorraadkast.</p>
    </div>
  </div>
  ${d ? `<section class="card mission">
    <div class="row" style="justify-content:space-between"><h2 style="margin:0">Missie van vandaag · ${esc(d.day)}</h2>
    <span class="tag ${d.test ? 'test' : d.rest ? 'rest' : d.busy ? 'busy' : ''}">${d.min ? `ongeveer ${d.min} min` : 'vrij'}</span></div>
    <h3 style="margin-top:8px">${esc(d.title)}</h3><p class="muted" style="margin:0">${esc(d.note)}</p>
    ${d.tasks.map(taskRow).join('')}
    <button class="speak" style="margin-top:14px" id="readMission">🔊 Lees de missie voor</button>
  </section>` : `<section class="card"><h2>Super gedaan, Finn</h2><p>De toetsperiode is voorbij. Je kunt hier altijd nog oefenen.</p></section>`}
  ${missed.length ? `<section class="card"><h3>Inhalen? Mag, hoeft niet</h3><p class="small muted">Deze waren voor eerdere dagen. Kies er hooguit één extra.</p>${missed.map(taskRow).join('')}</section>` : ''}
  <section class="grid g3">
    <a class="card mode" href="#play/tricky"><span class="ic">🎯</span><b>Lastige woordjes</b><span class="small muted">De woorden die je nog moeilijk vindt.</span></a>
    <a class="card mode" href="#play/test"><span class="ic">📝</span><b>Proeftoets</b><span class="small muted">Net als de echte toets, zonder hulp.</span></a>
    <a class="card mode" href="#modes"><span class="ic">🎮</span><b>Vrij oefenen</b><span class="small muted">Kies zelf een spel.</span></a>
  </section>`;
  bindTicks();
  const rm = $('#readMission'); if (rm) rm.onclick = () => sayNl(`Missie van vandaag. ${d.title}. ${d.note} ${d.tasks.map(x => x.text.replace(/[()→]/g, ' ')).join('. ')}`);
}
function viewPlan() {
  setTab('plan');
  const t = todayStr();
  app.innerHTML = `<section><h1>Planning tot de toets</h1>
  <p style="max-width:40em">Korte stukjes van 10 tot 20 minuten, zodat er ook tijd blijft voor huiswerk, dyslexie-oefeningen, oogtraining en voetbal. Op donderdag en vrijdag is het rustig. Lukt een dag niet? Schuif gewoon een dag op: de vrijdagen zijn ook inhaaldagen.</p>
  <div class="card" style="background:var(--sky-soft);border-color:var(--sky-soft)"><b>Tip voor ouders:</b> beste moment is een vast moment, bijvoorbeeld direct na het eten. Engels liever niet direct na de oogtraining of dyslexie-oefeningen; even pauze ertussen helpt. Hardop meelezen en samen de woorden laten voorlezen werkt goed.${window.Store.persistent ? '' : ' <br><b>Let op:</b> in deze online versie blijven vinkjes en sterren alleen bewaard zolang het tabblad open is. Gebruik de downloadversie om alles te bewaren, of vink af op Printblad 1.'}</div></section>
  <section class="grid">${PLAN.map(d => `<div class="day ${d.date === t ? 'today' : d.date < t ? 'past' : ''}">
    <div><div class="d">${esc(d.day)}</div><span class="tag ${d.test ? 'test' : d.rest ? 'rest' : d.busy ? 'busy' : ''}">${d.test ? 'toets' : d.rest ? 'vrij' : d.busy ? 'kort' : d.min + ' min'}</span>${d.date === t ? '<div class="small" style="color:var(--tomato);font-weight:700;margin-top:4px">vandaag</div>' : ''}</div>
    <div><h3 style="margin:0">${esc(d.title)}</h3><p class="small muted" style="margin:0">${esc(d.note)}</p>${d.tasks.map(taskRow).join('')}</div></div>`).join('')}</section>`;
  bindTicks();
}
function viewModes() {
  setTab('modes');
  const card = (h, ic, t, s) => `<a class="card mode" href="${h}"><span class="ic">${ic}</span><b>${t}</b><span class="small muted">${s}</span></a>`;
  app.innerHTML = `<section><h1>Kies een spel</h1><p class="muted">Woorden leer je allebei de kanten op. Zinnen van Engels naar Nederlands. Grammatica allebei de kanten op.</p></section>
  ${L.groups.map(g => `<section><h2>${g.short}: ${g.name} <span class="small muted">${wordsFor(g.id).map(w => w.pic).join(' ')}</span></h2><div class="grid g3">
    ${card('#play/learn/' + g.id, '👀', 'Leer-kaarten', 'Kijken, luisteren, nazeggen.')}
    ${card('#play/listen/' + g.id, '🎧', 'Luister-spel', 'Hoor het woord en kies.')}
    ${card('#play/type/' + g.id + '/nl', '⌨️', 'Typ-chef NL → EN', 'Schrijf het Engelse woord.')}
    ${card('#play/type/' + g.id + '/en', '✍️', 'Typ-chef EN → NL', 'Schrijf het Nederlandse woord.')}
  </div></section>`).join('')}
  <section><h2>Alle woorden door elkaar</h2><div class="grid g3">
    ${card('#play/listen/all', '🎧', 'Luister-mix', '10 woorden, vooral de lastige.')}
    ${card('#play/type/all/nl', '⌨️', 'Typ-mix NL → EN', '12 woorden.')}
    ${card('#play/type/all/en', '✍️', 'Typ-mix EN → NL', '12 woorden.')}
  </div></section>
  <section><h2>Zinnen (Engels → Nederlands)</h2><div class="grid g3">
    ${card('#play/plearn', '👀', 'Zinnen luisteren', 'Alle 9 zinnen rustig horen en lezen.')}
    ${card('#play/phrases/a', '🧩', 'Zinnen-puzzel 1–5', "Taco's, pizza, pannenkoeken, salade, handen.")}
    ${card('#play/phrases/b', '🧩', 'Zinnen-puzzel 6–9', 'Smaakt heerlijk, gezond, iedereen, groenten.')}
  </div></section>
  <section><h2>Grammatica: it is / they are</h2><div class="grid g3">
    ${card('#play/gexplain', '💡', 'Uitleg', 'Eén ding of meer dingen?')}
    ${card('#play/grammar', '🧠', 'Grammatica-spel', 'Kiezen, puzzelen en schrijven.')}
  </div></section>
  <section><h2>Toets-training</h2><div class="grid g3">
    ${card('#play/tricky', '🎯', 'Lastige woordjes', 'Wat je nog moeilijk vindt komt vaker.')}
    ${card('#play/test', '📝', 'Proeftoets', '24 vragen, zonder hulp, met cijfer.')}
  </div></section>`;
}
function viewShelf() {
  setTab('shelf');
  const dots = w => { const a = Math.min(2, st('w:' + w.id + ':ne').ok), b = Math.min(2, st('w:' + w.id + ':en').ok); return [a >= 1, a >= 2, b >= 1, b >= 2].map(x => `<i class="${x ? 'on' : ''}"></i>`).join(''); };
  app.innerHTML = `<section><h1>Mijn voorraadkast</h1><p class="muted" style="max-width:40em">Elk woord dat je 2 keer goed hebt van Nederlands naar Engels én 2 keer van Engels naar Nederlands, komt in je kast. De bolletjes laten zien hoe ver je bent.</p></section>
  ${L.groups.map(g => `<section><h2>${g.short}: ${g.name}</h2><div class="shelf">${wordsFor(g.id).map(w => `<div class="jar ${wordGot(w) ? 'got' : ''}"><div class="p">${w.pic}</div><b>${esc(w.en)}</b><div class="small muted">${esc(w.nl)}</div><div class="dots">${dots(w)}</div></div>`).join('')}</div></section>`).join('')}
  <section><h2>Zinnen</h2><div class="shelf">${L.phrases.map((p, i) => `<div class="jar ${phraseGot(p) ? 'got' : ''}"><div class="p">${p.pic}</div><b>Zin ${i + 1}</b><div class="small muted">${esc(p.en.split(' ').slice(0, 3).join(' '))}…</div></div>`).join('')}</div></section>
  <section><h2>Medailles</h2><div class="grid g2">${BADGES.map(b => `<div class="badge ${S.badges[b.id] ? 'got' : ''}"><span class="b">${b.ic}</span><div><b>${b.name}</b><div class="small muted">${b.how}</div></div></div>`).join('')}</div></section>
  ${S.tests.length ? `<section class="card"><h2>Proeftoetsen</h2>${S.tests.map(t => `<div class="row" style="justify-content:space-between;border-bottom:2px solid var(--line);padding:6px 0"><span>${esc(t.date)}</span><b>${t.score} van ${t.total} goed · cijfer ${t.grade.toFixed(1).replace('.', ',')}</b></div>`).join('')}</section>` : ''}
  ${syncHtml()}`;
  bindSync();
}

// ---------- learn (flashcards) ----------
function viewLearn(g, tid) {
  setTab('modes');
  const ws = wordsFor(g); let i = 0, flipped = false;
  const draw = () => {
    const w = ws[i];
    app.innerHTML = `<div class="stage"><div class="row" style="justify-content:space-between"><a href="#modes" class="small">← terug</a><span class="small muted">Leer-kaart ${i + 1} van ${ws.length}</span></div>
    <div class="progress">${ws.map((_, j) => `<i class="${j < i ? 'ok' : j === i ? 'now' : ''}"></i>`).join('')}</div>
    <div class="card q"><div class="pic">${w.pic}</div><div class="lang">Engels</div><div class="word">${esc(w.en)}</div>${w.syl ? `<div class="syl">${esc(w.syl)}</div>` : ''}
      <div class="row" style="justify-content:center;margin-top:12px"><button class="speak" id="s1">🔊 Hoor het</button><button class="speak slow" id="s2">🐢 Langzaam</button><button class="speak" id="s3">🔤 Spel het</button></div>
      <div id="back" style="margin-top:18px;${flipped ? '' : 'display:none'}"><div class="lang">Nederlands</div><div class="word" style="font-size:1.8rem;color:var(--leaf)">${esc(w.nl)}</div></div>
      <div class="coach" style="text-align:left"><span class="face">🧑‍🍳</span><div><b>Zeg het hardop na.</b> Kijk naar het woord terwijl je het hoort. Schrijf het daarna in de lucht met je vinger.</div></div>
    </div>
    <div class="row" style="justify-content:center;margin-top:16px">${i > 0 ? '<button class="btn ghost" id="prev">← Vorige</button>' : ''}<button class="btn mustard" id="flip">${flipped ? 'Verberg' : 'Draai om'}</button><button class="btn leaf" id="next">${i < ws.length - 1 ? 'Volgende →' : 'Klaar!'}</button></div></div>`;
    $('#s1').onclick = () => say(w.en); $('#s2').onclick = () => say(w.en, 'en', 0.5);
    $('#s3').onclick = () => { speechSynthesis.cancel(); w.en.split('').forEach(ch => ch === ' ' ? say('space', 'en', .8, false) : say(ch, 'en', .7, false)); say(w.en, 'en', .7, false); };
    $('#flip').onclick = () => { flipped = !flipped; draw(); if (flipped) sayNl(w.nl); };
    $('#next').onclick = () => { if (i < ws.length - 1) { i++; flipped = false; draw(); say(ws[i].en); } else finishSimple(ws.length, 'Leer-kaarten', tid, '#play/listen/' + g, 'Nu het luister-spel?'); };
    const pv = $('#prev'); if (pv) pv.onclick = () => { i--; flipped = false; draw(); say(ws[i].en); };
  };
  draw(); setTimeout(() => say(ws[0].en), 300);
}
function viewPLearn(tid) {
  setTab('modes'); let i = 0, show = false; const ps = L.phrases;
  const draw = () => { const p = ps[i];
    app.innerHTML = `<div class="stage"><div class="row" style="justify-content:space-between"><a href="#modes" class="small">← terug</a><span class="small muted">Zin ${i + 1} van ${ps.length}</span></div>
    <div class="progress">${ps.map((_, j) => `<i class="${j < i ? 'ok' : j === i ? 'now' : ''}"></i>`).join('')}</div>
    <div class="card q"><div class="pic">${p.pic}</div><div class="lang">Engels</div><div class="sent">${esc(p.en)}</div>
    <div class="row" style="justify-content:center;margin-top:10px"><button class="speak" id="s1">🔊 Hoor het</button><button class="speak slow" id="s2">🐢 Langzaam</button></div>
    <p class="small" style="margin-top:12px;color:var(--sky);font-weight:600">Woord-tip: ${esc(p.tip)}</p>
    <div style="${show ? '' : 'display:none'};margin-top:12px"><div class="lang">Nederlands</div><div class="sent" style="color:var(--leaf)">${esc(p.nl)}</div></div>
    <div class="coach" style="text-align:left"><span class="face">🧑‍🍳</span><div>Probeer eerst zelf te zeggen wat het betekent. Druk dan op <b>Laat zien</b>.</div></div></div>
    <div class="row" style="justify-content:center;margin-top:16px">${i ? '<button class="btn ghost" id="prev">← Vorige</button>' : ''}<button class="btn mustard" id="flip">${show ? 'Verberg' : 'Laat zien'}</button><button class="btn leaf" id="next">${i < ps.length - 1 ? 'Volgende →' : 'Klaar!'}</button></div></div>`;
    $('#s1').onclick = () => say(p.en); $('#s2').onclick = () => say(p.en, 'en', .55);
    $('#flip').onclick = () => { show = !show; draw(); if (show) sayNl(p.nl); };
    $('#next').onclick = () => { if (i < ps.length - 1) { i++; show = false; draw(); say(ps[i].en); } else finishSimple(ps.length, 'Zinnen luisteren', tid, '#play/phrases/a', 'Nu de zinnen-puzzel?'); };
    const pv = $('#prev'); if (pv) pv.onclick = () => { i--; show = false; draw(); say(ps[i].en); };
  }; draw(); setTimeout(() => say(ps[0].en), 300);
}
function viewGExplain(tid) {
  setTab('modes');
  app.innerHTML = `<div class="stage"><a href="#modes" class="small">← terug</a>
  <div class="card" style="margin-top:10px"><h1>It is of They are?</h1>
  <p>Stel jezelf één vraag: <b>is het 1 ding, of zijn het meer dingen?</b></p>
  <div class="gx"><div class="side one"><div style="font-size:2.4rem">🍅</div><h3>1 ding → <b class="k">it is</b></h3>
    <p style="margin:0"><b>It is</b> red and a bit sour.<br><span class="muted">Het is rood en een beetje zuur.</span></p>
    <p style="margin:.5em 0 0"><b>It is not</b> hard.<br><span class="muted">Het is niet hard.</span></p></div>
  <div class="side more"><div style="font-size:2.4rem">🥕🥕🥕</div><h3>meer dingen → <b class="k">they are</b></h3>
    <p style="margin:0"><b>They are</b> orange and crunchy.<br><span class="muted">Ze zijn oranje en knapperig.</span></p>
    <p style="margin:.5em 0 0"><b>They are not</b> sour.<br><span class="muted">Ze zijn niet zuur.</span></p></div></div>
  <h3 style="margin-top:18px">Korter schrijven ✂️</h3>
  <div class="gx"><div class="side" style="background:#fff">It is → <b>It's</b><br>It is not → <b>It's not</b></div><div class="side" style="background:#fff">They are → <b>They're</b><br>They are not → <b>They're not</b></div></div>
  <div class="coach"><span class="face">🧑‍🍳</span><div><b>Ezelsbruggetje:</b> <b>it</b> is kort, net als <b>1</b>. <b>They</b> heeft meer letters, net als <b>meer</b> dingen. En de <b>'</b> (komma bovenaan) staat op de plek waar letters zijn weggevallen.</div></div>
  <div class="row" style="margin-top:16px"><button class="speak" id="rd">🔊 Lees de uitleg voor</button><button class="speak" id="ex">🔊 Hoor de Engelse zinnen</button></div>
  <div class="row" style="margin-top:18px"><a class="btn leaf" href="#play/grammar${tid ? '?t=' + tid : ''}">Start het grammatica-spel →</a></div></div></div>`;
  $('#rd').onclick = () => sayNl('Is het 1 ding? Dan gebruik je it is. Zijn het meer dingen? Dan gebruik je they are. Het is niet, is it is not. Ze zijn niet, is they are not. Korter: it is wordt it\'s. They are wordt they\'re.');
  $('#ex').onclick = () => { speechSynthesis.cancel(); L.grammarBook.forEach(g => say(g.en, 'en', undefined, false)); ["It's", "It's not", "They're", "They're not"].forEach(x => say(x, 'en', undefined, false)); };
}
function finishSimple(n, title, tid, nextHref, nextTxt) {
  addStars(3); S.rounds++; if (tid) S.done[tid] = true; save(); const nb = checkBadges(); sWin(); confetti();
  app.innerHTML = `<div class="stage"><div class="card center result"><div class="big">⭐⭐⭐</div><h1 style="margin-top:10px">${esc(title)} klaar!</h1><p>Goed bekeken en beluisterd. +3 sterren.</p>${badgeHtml(nb)}
  <div class="row" style="justify-content:center"><a class="btn leaf" href="${nextHref}">${nextTxt}</a><a class="btn ghost" href="#home">Naar vandaag</a></div></div></div>`;
}
const badgeHtml = nb => nb.length ? `<div class="card" style="background:var(--mustard-soft);border-color:var(--mustard);margin:14px 0">${nb.map(b => `<div style="font-size:2rem">${b.ic}</div><b>Nieuwe medaille: ${b.name}</b>`).join('<hr style="border:0;border-top:2px solid var(--line)">')}</div>` : '';

// ---------- play engine ----------
function viewPlay(mode, a, b, tid) {
  setTab('modes');
  const R = buildRound(mode, a, b); if (!R) { location.hash = '#modes'; return; }
  let i = 0, combo = 0, results = [], earned = 0;
  const q0 = () => R.qs[i];
  function header() {
    return `<div class="row" style="justify-content:space-between"><a href="#modes" class="small">← stoppen</a><b>${esc(R.title)}</b><span class="small muted">${i + 1} / ${R.qs.length}</span></div>
    <div class="progress">${R.qs.map((_, j) => `<i class="${j < i ? (R.test ? 'ok' : results[j] ? 'ok' : 'bad') : j === i ? 'now' : ''}"></i>`).join('')}</div>`;
  }
  function promptHtml(q) {
    const sentence = q.prompt.length > 22;
    return `<div class="card q">${q.pic ? `<div class="pic">${q.pic}</div>` : ''}<div class="lang">${esc(q.lang)}</div>
      <div class="${sentence ? 'sent' : 'word'}">${esc(q.prompt)}</div>${q.sub ? `<div class="sent" style="color:var(--sky)">${esc(q.sub)}</div>` : ''}
      ${q.sayPrompt ? `<div class="row" style="justify-content:center;margin-top:8px"><button class="speak" id="sp">🔊 Hoor het</button>${q.sayPrompt[1] === 'en' ? '<button class="speak slow" id="spS">🐢</button>' : ''}</div>` : ''}
      <p style="margin:14px 0 0;font-weight:600">${esc(q.ask)}</p><div id="zone"></div><div id="fb"></div></div>`;
  }
  function draw() {
    const q = q0(); window.__cur = q;
    app.innerHTML = `<div class="stage">${header()}${promptHtml(q)}<div class="row" style="justify-content:center;margin-top:16px" id="nav"></div></div>`;
    if (q.sayPrompt) { $('#sp').onclick = () => say(q.sayPrompt[0], q.sayPrompt[1]); const s = $('#spS'); if (s) s.onclick = () => say(q.sayPrompt[0], 'en', .5); }
    instr(q.ask);
    if (q.autoSay) setTimeout(() => say(q.sayPrompt[0], q.sayPrompt[1], undefined, S.settings.readNl !== '1'), 250);
    ({ mc: drawMc, type: drawType, tiles: drawTiles })[q.kind](q);
  }
  function nextBtn(label = 'Volgende →') {
    $('#nav').innerHTML = `<button class="btn leaf" id="nx">${i < R.qs.length - 1 ? label : 'Bekijk je resultaat'}</button>`;
    const nx = $('#nx'); nx.focus(); nx.onclick = advance;
  }
  function advance() { i++; if (i < R.qs.length) draw(); else finish(); }
  function score(q, ok, stars, quiet) {
    results[i] = ok; rec(q.key, ok);
    if (R.test) { q._ok = ok; save(); return; }
    if (ok) { combo++; S.bestCombo = Math.max(S.bestCombo, combo); if (combo >= 3 && combo % 3 === 0) { flash(`🔥 ${combo} op rij!`); stars++; } sOk(); }
    else { combo = 0; sSoft(); }
    earned += stars; addStars(stars); save();
  }
  function fb(type, html) { $('#fb').innerHTML = `<div class="feedback ${type}">${html}</div>`; }

  function drawMc(q) {
    $('#zone').innerHTML = `<div class="opts" style="${q.key.startsWith('p:') ? 'grid-template-columns:1fr' : ''}">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.t)}</button>`).join('')}</div>`;
    let tries = 0;
    app.querySelectorAll('.opt').forEach(btn => btn.onclick = () => {
      const o = q.opts[+btn.dataset.k];
      if (R.test) { q._given = o.t; score(q, o.ok); advance(); return; }
      if (o.ok) {
        btn.classList.add('right'); app.querySelectorAll('.opt').forEach(x => x.disabled = true);
        score(q, tries === 0, tries === 0 ? 2 : 1);
        fb('ok', `${pick(OK)}${tries ? ' Tweede keer goed telt ook!' : ''}${q.tip ? `<div class="small" style="font-weight:500;margin-top:4px">${esc(q.tip)}</div>` : ''}`);
        if (q.after) say(q.after[0], q.after[1]);
        nextBtn();
      } else {
        tries++; btn.classList.add('wrong'); btn.disabled = true;
        if (tries === 1) { sSoft(); fb('learn', `Hmm, nog niet. Probeer het nog een keer.${q.tip && q.key.startsWith('g:') ? ` <div class="small" style="font-weight:500">Tip: ${esc(q.tip)}</div>` : ''}`); }
        else { app.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (q.opts[+x.dataset.k].ok) x.classList.add('right'); }); score(q, false, 0); fb('learn', `${pick(LEARN)} Het goede antwoord is: <b>${esc(q.answer)}</b>`); if (q.after) say(q.after[0], q.after[1]); nextBtn(); }
      }
    });
  }

  function drawType(q) {
    const target = q.answer; let hints = 0, phase = 'try';
    $('#zone').innerHTML = `${q.noBoxes || R.test ? '' : `<div class="boxes" id="boxes" aria-hidden="true"></div><div class="small muted">${target.replace(/ /g, '').length} letters${target.includes(' ') ? ', 2 woorden' : ''}</div>`}
      <input class="answer" id="ans" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Jouw antwoord" style="margin-top:12px">
      ${q.tip ? `<p class="small muted" style="margin:8px 0 0">${esc(q.tip)}</p>` : ''}`;
    const inp = $('#ans');
    const boxes = () => { const bx = $('#boxes'); if (!bx) return; const v = inp.value; bx.innerHTML = target.split('').map((ch, k) => ch === ' ' ? '<span class="sp"></span>' : `<span class="${k < hints ? 'shown' : ''}">${esc(v[k] && v[k] !== ' ' ? v[k] : '')}</span>`).join(''); };
    inp.oninput = boxes; boxes(); setTimeout(() => inp.focus(), 50);
    const navTry = () => { $('#nav').innerHTML = `${!R.test && !q.noBoxes ? '<button class="btn ghost" id="hint">💡 Letter-hint</button>' : ''}${q.hearHelp ? '<button class="btn ghost" id="hear">🔊 Hoor Engels</button>' : ''}<button class="btn leaf" id="chk">${R.test ? 'Volgende →' : 'Check'}</button>`;
      $('#chk').onclick = check;
      const h = $('#hint'); if (h) h.onclick = () => { if (hints < target.length) { hints++; if (target[hints - 1] === ' ') hints++; inp.value = target.slice(0, hints); boxes(); inp.focus(); } };
      const hr = $('#hear'); if (hr) hr.onclick = () => say(q.sayAnswer[0], q.sayAnswer[1]); };
    navTry();
    inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); if (phase === 'try') check(); else if (phase === 'copy') copyCheck(); else { const nx = $('#nx'); if (nx) nx.click(); } } };
    function check() {
      const v = norm(inp.value); if (!v && !R.test) { inp.focus(); return; }
      const ok = q.answers.some(a => norm(a) === v);
      if (R.test) { q._given = inp.value; score(q, ok); advance(); return; }
      if (ok) {
        phase = 'done'; inp.classList.add('ok'); inp.readOnly = true; S.typedOk++;
        const stars = hints ? 1 : 3; score(q, !hints || hints < 2, stars);
        fb('ok', `${pick(OK)} ${hints ? '' : '+3 sterren.'}`); say(q.sayAnswer[0], q.sayAnswer[1]); nextBtn(); return;
      }
      const d = Math.min(...q.answers.map(a => lev(norm(a), v)));
      const almost = d <= 2 && target.length > 3;
      score(q, false, almost ? 1 : 0);
      fb(almost ? 'almost' : 'learn', `${almost ? pick(ALMOST) : pick(LEARN)}
        <div class="small" style="margin-top:6px;font-weight:500">Jij schreef:</div><div class="diff">${diffHtml(inp.value.trim(), target)}</div>
        <div class="small" style="font-weight:500">Zo is het goed:</div><div class="diff" style="color:var(--leaf)">${esc(target)}</div>
        <div style="margin-top:6px">Schrijf het nu nog één keer goed over. Dan onthoud je het beter.</div>`);
      say(q.sayAnswer[0], q.sayAnswer[1]);
      phase = 'copy'; inp.value = ''; hints = 0; boxes(); inp.focus();
      $('#nav').innerHTML = `<button class="btn leaf" id="chk2">Check</button>`; $('#chk2').onclick = copyCheck;
    }
    function copyCheck() {
      if (q.answers.some(a => norm(a) === norm(inp.value))) { phase = 'done'; inp.classList.add('ok'); inp.readOnly = true; sOk(); addStars(1); earned++; fb('ok', 'Mooi overgeschreven! Deze komt later nog een keer terug.'); nextBtn(); }
      else { sSoft(); inp.select(); $('#fb').insertAdjacentHTML('beforeend', '<div class="feedback learn small" style="margin-top:8px">Bijna. Kijk letter voor letter naar het groene woord.</div>'); }
    }
  }

  function drawTiles(q) {
    const pool = shuffle([...q.target, ...q.extra].map((t, k) => ({ t, k }))); let built = [], tries = 0;
    const paint = () => {
      $('#zone').innerHTML = `<div class="built" id="built" style="margin-top:14px">${built.map((x, j) => `<button class="tile" data-b="${j}">${esc(x.t)}</button>`).join('')}</div>
        <div class="tiles">${pool.map(x => `<button class="tile ${built.includes(x) ? 'used' : ''}" data-p="${x.k}">${esc(x.t)}</button>`).join('')}</div>`;
      app.querySelectorAll('[data-p]').forEach(bn => bn.onclick = () => { const x = pool.find(p => p.k === +bn.dataset.p); if (!built.includes(x)) { built.push(x); paint(); } });
      app.querySelectorAll('[data-b]').forEach(bn => bn.onclick = () => { built.splice(+bn.dataset.b, 1); paint(); });
      const c = $('#chk'); if (c) c.disabled = built.length < q.target.length;
    };
    $('#nav').innerHTML = `<button class="btn ghost" id="clr">Opnieuw</button><button class="btn leaf" id="chk" disabled>${R.test ? 'Volgende →' : 'Check'}</button>`;
    $('#clr').onclick = () => { built = []; paint(); };
    $('#chk').onclick = () => {
      const got = built.map(x => x.t), ok = got.join(' ') === q.target.join(' ');
      if (R.test) { q._given = got.join(' '); score(q, ok); advance(); return; }
      if (ok) {
        score(q, tries === 0, tries === 0 ? 3 : 1); fb('ok', `${pick(OK)}${q.tip ? `<div class="small" style="font-weight:500;margin-top:4px">${esc(q.tip)}</div>` : ''}`);
        app.querySelectorAll('.tile').forEach(t => t.disabled = true); say(q.sayAnswer[0], q.sayAnswer[1]); nextBtn();
      } else if (tries === 0) {
        tries++; sSoft();
        const right = got.filter((t, j) => t === q.target[j]).length;
        fb('learn', `Goed bezig: ${right} ${right === 1 ? 'woord staat' : 'woorden staan'} al op de goede plek. Schuif nog wat en probeer opnieuw.${q.tip ? `<div class="small" style="font-weight:500">Tip: ${esc(q.tip)}</div>` : ''}`);
        $('#built').querySelectorAll('.tile').forEach((t, j) => { if (got[j] === q.target[j]) t.style.borderColor = 'var(--leaf)'; });
      } else {
        score(q, false, 0); fb('learn', `${pick(LEARN)}<div class="diff" style="color:var(--leaf);font-size:1.2rem;letter-spacing:.04em">${esc(q.answer)}</div>`);
        app.querySelectorAll('.tile').forEach(t => t.disabled = true); say(q.sayAnswer[0], q.sayAnswer[1]); nextBtn();
      }
    };
    paint();
  }

  function finish() {
    const n = R.qs.length, good = results.filter(Boolean).length; S.rounds++;
    if (tid) S.done[tid] = true;
    if (R.test) {
      const grade = Math.max(1, Math.min(10, 1 + 9 * good / n));
      S.tests.push({ date: todayStr(), score: good, total: n, grade }); addStars(5 + good); save(); const nb = checkBadges(); sWin(); confetti();
      const wrong = R.qs.filter(q => !q._ok);
      const msg = grade >= 8 ? 'Wauw, jij bent er klaar voor!' : grade >= 6.5 ? 'Mooi! Je bent goed op weg. Oefen de rode nog even.' : 'Goed dat je dit oefent! Nu weet je precies wat je nog moet leren.';
      app.innerHTML = `<div class="stage"><div class="card center result"><div class="small muted">Proeftoets</div><div class="big">${grade.toFixed(1).replace('.', ',')}</div><p><b>${good} van ${n} goed.</b> ${msg}</p>${badgeHtml(nb)}</div>
      ${wrong.length ? `<div class="card" style="margin-top:16px"><h2>Deze nog even oefenen</h2>${wrong.map(q => `<div style="padding:10px 0;border-bottom:2px solid var(--line)"><div class="small muted">${esc(q.prompt)}</div><div>Goed: <b style="color:var(--leaf)">${esc(q.answer)}</b></div>${q._given ? `<div class="small muted">Jij: ${esc(q._given)}</div>` : ''}</div>`).join('')}
      <p class="small muted" style="margin-top:10px">Deze komen nu vaker terug bij Lastige woordjes.</p></div>` : ''}
      <div class="row" style="justify-content:center;margin-top:16px"><a class="btn leaf" href="#play/tricky">Lastige woordjes oefenen</a><a class="btn ghost" href="#home">Naar vandaag</a></div></div>`;
      return;
    }
    if (R.grammar && good >= 8) S.gram8 = true;
    addStars(2); save(); const nb = checkBadges(); sWin(); if (good / n >= .6) confetti();
    const pct = good / n;
    const msg = pct === 1 ? 'Alles in één keer goed. Jij bent een echte chef!' : pct >= .8 ? 'Super gedaan! Bijna alles in één keer goed.' : pct >= .5 ? 'Lekker geoefend! Je hersenen zijn hard aan het werk.' : 'Knap dat je doorzet! De moeilijke komen vanzelf vaker terug, en dan gaan ze steeds beter.';
    app.innerHTML = `<div class="stage"><div class="card center result"><div class="big">${'⭐'.repeat(pct >= .8 ? 3 : pct >= .5 ? 2 : 1)}</div><h1 style="margin-top:10px">Ronde klaar!</h1>
      <p><b>${good} van ${n}</b> in één keer goed. +${earned + 2} sterren.</p><p>${msg}</p>${badgeHtml(nb)}
      <div class="row" style="justify-content:center"><a class="btn leaf" href="#home">Naar vandaag</a><button class="btn ghost" id="again">Nog een rondje</button></div></div></div>`;
    $('#again').onclick = () => viewPlay(mode, a, b);
    if (tid) sayNl('Ronde klaar. ' + msg);
  }
  draw();
}
function diffHtml(given, target) {
  let out = '';
  const n = Math.max(given.length, target.length);
  for (let k = 0; k < n; k++) { const g = given[k]; if (g === undefined) { out += `<span class="x">_</span>`; continue; } out += g.toLowerCase() === (target[k] || '').toLowerCase() ? esc(g) : `<span class="x">${esc(g)}</span>`; }
  return out || '…';
}


// ---------- voortgang meenemen (tablet <-> laptop) ----------
function encodeState() { const { settings, ...rest } = S; return btoa(unescape(encodeURIComponent(JSON.stringify(rest)))); }
function mergeState(o) {
  if (!o || typeof o !== 'object') return false;
  const st0 = o.stats || {};
  Object.keys(st0).forEach(k => { const a = S.stats[k], b = st0[k]; if (!a || (b.ok + b.bad) > (a.ok + a.bad)) S.stats[k] = b; });
  Object.assign(S.done, o.done || {});
  Object.keys(o.badges || {}).forEach(k => { if (!S.badges[k]) S.badges[k] = o.badges[k]; });
  (o.tests || []).forEach(t => { if (!S.tests.some(x => x.date === t.date && x.score === t.score && x.total === t.total)) S.tests.push(t); });
  ['stars', 'rounds', 'typedOk', 'bestCombo'].forEach(k => { S[k] = Math.max(S[k] || 0, o[k] || 0); });
  if (o.gram8) S.gram8 = true;
  save(); return true;
}
function checkImport() {
  const h = location.hash;
  if (!h.startsWith('#import=')) return;
  let ok = false;
  try { ok = mergeState(JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(h.slice(8))))))); } catch (e) { ok = false; }
  history.replaceState(null, '', location.pathname + location.search + '#home');
  setTimeout(() => { if (ok) { flash('Voortgang overgezet!'); sWin && sWin(); } else alert('Deze meeneem-link werkt niet (meer). Maak op het andere apparaat een nieuwe.'); }, 400);
}
function syncHtml() {
  return `<section class="card" id="sync"><h2>Voortgang meenemen</h2>
  <p class="small" style="max-width:40em">Oefent Finn soms op de tablet en soms op de laptop? Maak hier een meeneem-link en open die op het andere apparaat (bijvoorbeeld via WhatsApp of mail naar jezelf). De sterren, vinkjes en voorraadkast worden dan samengevoegd.</p>
  <div class="row"><button class="btn sky" id="mkLink">Maak meeneem-link</button></div>
  <div id="linkBox" class="hide" style="margin-top:12px"><input class="answer" id="linkTxt" readonly style="font-size:.75rem;text-align:left;letter-spacing:0">
  <div class="row" style="margin-top:10px"><button class="btn leaf" id="cpLink">Kopieer link</button><button class="btn ghost hide" id="shLink">Deel…</button></div><p class="small muted" id="cpMsg"></p></div></section>`;
}
function bindSync() {
  const mk = $('#mkLink'); if (!mk) return;
  mk.onclick = () => {
    const url = location.origin + location.pathname + '#import=' + encodeURIComponent(encodeState());
    $('#linkTxt').value = url; $('#linkBox').classList.remove('hide');
    if (navigator.share) { const sh = $('#shLink'); sh.classList.remove('hide'); sh.onclick = () => navigator.share({ title: "Finn's Engelse Keuken – voortgang", url }).catch(() => {}); }
  };
  $('#cpLink').onclick = async () => { const t = $('#linkTxt'); try { await navigator.clipboard.writeText(t.value); $('#cpMsg').textContent = 'Gekopieerd. Plak de link op het andere apparaat in de adresbalk.'; } catch (e) { t.select(); document.execCommand && document.execCommand('copy'); $('#cpMsg').textContent = 'Geselecteerd: kopieer met Ctrl+C of lang indrukken.'; } };
}

// ---------- router ----------
function render() {
  speechSynthesis && speechSynthesis.cancel && speechSynthesis.cancel();
  $('#starCount').textContent = S.stars;
  const [path, qs] = (location.hash.slice(1) || 'home').split('?');
  const tid = new URLSearchParams(qs || '').get('t');
  const p = path.split('/');
  window.scrollTo(0, 0);
  if (p[0] === 'plan') return viewPlan();
  if (p[0] === 'modes') return viewModes();
  if (p[0] === 'shelf') return viewShelf();
  if (p[0] === 'play') {
    if (p[1] === 'learn') return viewLearn(p[2] || 'g1', tid);
    if (p[1] === 'plearn') return viewPLearn(tid);
    if (p[1] === 'gexplain') return viewGExplain(tid);
    if (p[1] === 'grammar' && tid && !S.badges.seenGx) { S.badges.seenGx = 1; save(); return viewGExplain(tid); }
    return viewPlay(p[1], p[2], p[3], tid);
  }
  return viewHome();
}
window.addEventListener('hashchange', () => { if (location.hash.startsWith('#import=')) { checkImport(); } render(); });

// ---------- settings ----------
function applySettings() {
  document.documentElement.classList.toggle('big', S.settings.big === '1');
  document.querySelectorAll('.seg').forEach(sg => sg.querySelectorAll('button').forEach(b => b.classList.toggle('on', S.settings[sg.dataset.k] === b.dataset.v)));
}
document.querySelectorAll('.seg').forEach(sg => sg.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.settings[sg.dataset.k] = b.dataset.v; save(); applySettings(); if (sg.dataset.k === 'rate') say('Hello Finn, this is my voice.'); }));
$('#voiceSel').onchange = e => { S.settings.voice = e.target.value; save(); say('Hello Finn! Let\'s cook.'); };
$('#setBtn').onclick = () => { loadVoices(); $('#settings').classList.add('on'); };
$('#toSync').onclick = () => { $('#settings').classList.remove('on'); setTimeout(() => { const e = $('#sync'); if (e) e.scrollIntoView({ behavior: 'smooth' }); }, 200); };
$('#closeSet').onclick = () => $('#settings').classList.remove('on');
$('#settings').onclick = e => { if (e.target.id === 'settings') $('#settings').classList.remove('on'); };
$('#resetBtn').onclick = () => { if (confirm('Weet je het zeker? Alle sterren en voortgang worden gewist.')) { const keep = S.settings; S = blank(); S.settings = keep; save(); $('#settings').classList.remove('on'); render(); } };
applySettings();
checkImport();
const pn = $('#persistNote'); if (pn) pn.textContent = window.Store.persistent ? 'Voortgang wordt alleen op dit apparaat bewaard.' : 'In deze versie blijven sterren en vinkjes bewaard zolang dit tabblad open blijft. Wil je dat alles bewaard blijft? Gebruik de downloadversie, of vink af op Printblad 1.';
render();
})();
