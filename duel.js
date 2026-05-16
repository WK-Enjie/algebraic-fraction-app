/* =============================================
   FRACTOQUEST — Battle Duel (Full RPG Edition)
   ============================================= */

// ==================== DUEL STATE ====================
const DuelState = {
  mode:          'pvp',
  difficulty:    'easy',
  totalRounds:   3,
  currentRound:  1,
  currentClash:  0,   // clash number within round
  maxClashes:    5,   // clashes per round before sudden death

  p1: {
    name: 'Wizard', avatar: '🧙‍♂️',
    hp: 5, maxHp: 5,
    mp: 3, maxMp: 3,   // mana for special spells
    wins: 0,
    shield: false,
    combo: 0,
    selectedSpell: null,
  },
  p2: {
    name: 'Rival', avatar: '🤖',
    hp: 5, maxHp: 5,
    mp: 3, maxMp: 3,
    wins: 0,
    shield: false,
    combo: 0,
    selectedSpell: null,
  },

  turn:          'p1',
  phase:         'spell-select', // spell-select | mini-game | result
  currentQ:      null,
  questionPool:  [],
  timerInterval: null,
  timeLeft:      0,
  isProcessing:  false,
  activeMinigame:null,
};

// ==================== SPELLS ====================
const Spells = [
  {
    id:      'fireball',
    name:    'Fireball',
    icon:    '🔥',
    desc:    'Answer an MCQ fraction question',
    color:   '#ef4444',
    damage:  2,
    mpCost:  0,
    game:    'mcq',
  },
  {
    id:      'lightning',
    name:    'Lightning',
    icon:    '⚡',
    desc:    'Speed-tap the correct answer fast!',
    color:   '#f59e0b',
    damage:  2,
    mpCost:  0,
    game:    'speedtap',
  },
  {
    id:      'vortex',
    name:    'Vortex',
    icon:    '🌀',
    desc:    'Arrange the solution steps in order',
    color:   '#8b5cf6',
    damage:  3,
    mpCost:  1,
    game:    'order',
  },
  {
    id:      'bomb',
    name:    'Bomb',
    icon:    '💣',
    desc:    'Fill in the missing part of the fraction',
    color:   '#10b981',
    damage:  3,
    mpCost:  1,
    game:    'fillin',
  },
  {
    id:      'shield_spell',
    name:    'Magic Shield',
    icon:    '🛡️',
    desc:    'Defend! Block next attack if correct',
    color:   '#3b82f6',
    damage:  0,
    mpCost:  1,
    game:    'mcq',
    isShield:true,
  },
];

// ==================== FILL-IN PUZZLES ====================
const FillInPuzzles = [
  {
    display:   `Simplify: ${fracHTML('6x²','9x')} = ${fracHTML('?','3')}`,
    answer:    '2x',
    options:   ['2x','3x','x²','6x'],
    slot:      'num',
    explain:   '6÷3=2, x²÷x=x → numerator is 2x',
  },
  {
    display:   `Simplify: ${fracHTML('10a³','5a')} = ${fracHTML('2a²','?')}`,
    answer:    '1',
    options:   ['1','5','a','2'],
    slot:      'den',
    explain:   '10÷5=2, a³÷a=a², denominator becomes 1',
  },
  {
    display:   `${fracHTML('3x','4')} × ${fracHTML('8','x²')} = ${fracHTML('6','?')}`,
    answer:    'x',
    options:   ['x','x²','2x','4'],
    slot:      'den',
    explain:   '24x ÷ 4x² = 6/x, denominator is x',
  },
  {
    display:   `${fracHTML('4a','3')} ÷ ${fracHTML('2a','?')} = 2`,
    answer:    '3',
    options:   ['3','2','6','9'],
    slot:      'den',
    explain:   'KCF: 4a/3 × ?/2a = 2 → ? = 3',
  },
  {
    display:   `Simplify: ${fracHTML('?','4x')} = ${fracHTML('3x','2')}`,
    answer:    '6x²',
    options:   ['6x²','3x','12x','6x'],
    slot:      'num',
    explain:   'Cross-multiply: ? = 3x × 4x ÷ 2 = 6x²',
  },
  {
    display:   `${fracHTML('x²−9','x+3')} = ?`,
    answer:    'x−3',
    options:   ['x−3','x+3','x−9','x'],
    slot:      'whole',
    explain:   'x²−9=(x+3)(x−3), cancel (x+3) → x−3',
  },
];

// ==================== ORDER PUZZLES ====================
const OrderPuzzles = [
  {
    question: `Simplify ${fracHTML('6x²','9x')}`,
    steps: [
      'Split: (6/9) × (x²/x)',
      'Simplify numbers: 6÷3=2, 9÷3=3',
      'Simplify variables: x²÷x=x',
      'Combine: 2x/3',
    ],
    correct: [0,1,2,3],
  },
  {
    question: `${fracHTML('4x','3')} ÷ ${fracHTML('2x','9')}`,
    steps: [
      'Keep: 4x/3',
      'Change ÷ to ×',
      'Flip second fraction: 9/2x',
      'Multiply: 36x/6x = 6',
    ],
    correct: [0,1,2,3],
  },
  {
    question: `Simplify ${fracHTML('x²−4','x+2')}`,
    steps: [
      'Identify: difference of squares',
      'Factorise: x²−4 = (x+2)(x−2)',
      'Rewrite: (x+2)(x−2) / (x+2)',
      'Cancel (x+2): answer = x−2',
    ],
    correct: [0,1,2,3],
  },
];

// ==================== SETUP ====================
function pickAvatar(player, emoji) {
  const key = player === 1 ? 'p1' : 'p2';
  DuelState[key].avatar = emoji;
  document.getElementById(`${key}-avatar`).textContent = emoji;
}

function setDuelMode(mode) {
  DuelState.mode = mode;
  ['pvp','cpu'].forEach(m => document.getElementById(`btn-${m}`).classList.toggle('active', m === mode));
  const inp = document.getElementById('p2-name');
  const lbl = document.getElementById('p2-label');
  if (mode === 'cpu') {
    inp.value = 'CPU Mage'; inp.disabled = true;
    lbl.textContent = 'CPU Opponent';
  } else {
    inp.value = 'Rival'; inp.disabled = false;
    lbl.textContent = 'Player 2';
  }
}

function setDifficulty(diff) {
  DuelState.difficulty = diff;
  ['easy','medium','hard'].forEach(d =>
    document.getElementById(`diff-${d}`).classList.toggle('active', d === diff));
}

function setRounds(n) {
  DuelState.totalRounds = n;
  [3,5,7].forEach(r =>
    document.getElementById(`rounds-${r}`).classList.toggle('active', r === n));
}

// ==================== START DUEL ====================
function startDuel() {
  DuelState.p1.name   = document.getElementById('p1-name').value || 'P1';
  DuelState.p2.name   = document.getElementById('p2-name').value || 'P2';
  DuelState.p1.wins   = 0;
  DuelState.p2.wins   = 0;
  DuelState.currentRound = 1;

  const maxHp = DuelState.difficulty === 'hard' ? 7 : DuelState.difficulty === 'medium' ? 6 : 5;
  DuelState.p1.maxHp = DuelState.p2.maxHp = maxHp;
  DuelState.questionPool = shuffle(getQuestionsByDifficulty(DuelState.difficulty));

  updateFighterAvatars();
  showScreen('screen-duel');
  startRound();
}

function updateFighterAvatars() {
  document.getElementById('p1-hud-name').textContent    = DuelState.p1.name;
  document.getElementById('p2-hud-name').textContent    = DuelState.p2.name;
  document.getElementById('p1-hud-avatar').textContent  = DuelState.p1.avatar;
  document.getElementById('p2-hud-avatar').textContent  = DuelState.p2.avatar;
  document.getElementById('arena-p1-sprite').textContent = DuelState.p1.avatar;
  document.getElementById('arena-p2-sprite').textContent = DuelState.p2.avatar;
}

// ==================== ROUND START ====================
function startRound() {
  const p = DuelState;
  p.p1.hp = p.p1.maxHp; p.p2.hp = p.p2.maxHp;
  p.p1.mp = p.p1.maxMp; p.p2.mp = p.p2.maxMp;
  p.p1.shield = false;   p.p2.shield = false;
  p.p1.combo  = 0;       p.p2.combo  = 0;
  p.turn = 'p1';
  p.currentClash = 0;
  p.phase = 'spell-select';
  updateDuelHUD();
  showRoundBanner(`⚔️ Round ${p.currentRound} — FIGHT! ⚔️`, () => startTurn());
}

function showRoundBanner(text, callback) {
  const banner = document.getElementById('round-banner');
  document.getElementById('round-banner-text').textContent = text;
  banner.style.display = 'flex';
  setTimeout(() => { banner.style.display = 'none'; if (callback) callback(); }, 1800);
}

// ==================== TURN START ====================
function startTurn() {
  const p    = DuelState;
  const actor = p[p.turn];
  p.isProcessing = false;
  p.phase = 'spell-select';

  // Refresh question pool if needed
  if (p.questionPool.length < 3) {
    p.questionPool = shuffle(getQuestionsByDifficulty(p.difficulty));
  }
  p.currentQ = p.questionPool.pop();

  updateTurnPrompt();
  showSpellSelect();

  // CPU auto-selects spell
  if (p.mode === 'cpu' && p.turn === 'p2') {
    setTimeout(() => cpuPickSpell(), 1200);
  }
}

function updateTurnPrompt() {
  const actor = DuelState[DuelState.turn];
  document.getElementById('duel-turn-badge').textContent   = `${actor.name}'s Turn`;
  document.getElementById('duel-turn-name').textContent    = actor.name;
  document.getElementById('p1-hud').classList.toggle('active-turn', DuelState.turn === 'p1');
  document.getElementById('p2-hud').classList.toggle('active-turn', DuelState.turn === 'p2');
}

// ==================== SPELL SELECT PHASE ====================
function showSpellSelect() {
  const actor = DuelState[DuelState.turn];
  const duelMain = document.getElementById('duel-main-area');

  duelMain.innerHTML = `
    <div class="spell-select-area">
      <div class="spell-select-title">
        ${actor.avatar} ${actor.name} — Choose your spell!
        <div class="mp-display">✨ MP: ${'💜'.repeat(actor.mp)}${'🖤'.repeat(actor.maxMp - actor.mp)}</div>
      </div>
      <div class="spell-grid">
        ${Spells.map(spell => {
          const canAfford = actor.mp >= spell.mpCost;
          return `
            <div class="spell-card ${!canAfford ? 'spell-disabled' : ''}"
                 onclick="${canAfford ? `selectSpell('${spell.id}')` : ''}"
                 style="--spell-color:${spell.color}">
              <div class="spell-icon">${spell.icon}</div>
              <div class="spell-name">${spell.name}</div>
              <div class="spell-desc">${spell.desc}</div>
              <div class="spell-stats">
                ${spell.damage > 0 ? `💥 ${spell.damage} dmg` : '🛡️ Defend'}
                ${spell.mpCost > 0 ? ` &nbsp; ✨ ${spell.mpCost} MP` : ''}
              </div>
            </div>`;
        }).join('')}
      </div>
      ${DuelState.mode === 'pvp' ? `
        <div class="pass-device-note">
          📱 Pass device to ${actor.name}!
        </div>` : ''}
    </div>
  `;

  document.getElementById('duel-timer-wrap').style.display = 'none';
  document.getElementById('duel-actions').style.display    = 'none';
}

function selectSpell(spellId) {
  const spell = Spells.find(s => s.id === spellId);
  const actor = DuelState[DuelState.turn];
  DuelState[DuelState.turn].selectedSpell = spell;

  // Deduct MP
  actor.mp -= spell.mpCost;
  updateDuelHUD();

  // Show dramatic spell announcement
  const duelMain = document.getElementById('duel-main-area');
  duelMain.innerHTML = `
    <div class="spell-announce">
      <div class="spell-announce-icon">${spell.icon}</div>
      <div class="spell-announce-name">${spell.name}!</div>
      <div class="spell-announce-desc">${actor.name} casts ${spell.name}!</div>
    </div>
  `;

  setTimeout(() => launchMiniGame(spell), 1000);
}

// ==================== CPU SPELL SELECTION ====================
function cpuPickSpell() {
  const actor = DuelState.p2;
  // CPU strategy: use shield if low HP, else pick random affordable spell
  let available = Spells.filter(s => actor.mp >= s.mpCost);
  let picked;

  if (actor.hp <= 2 && available.find(s => s.isShield)) {
    picked = available.find(s => s.isShield);
  } else {
    // Weight towards simpler spells for easy CPU
    const weights = DuelState.difficulty === 'easy'
      ? ['fireball','fireball','fireball','lightning']
      : DuelState.difficulty === 'medium'
      ? ['fireball','lightning','vortex','bomb']
      : ['vortex','bomb','bomb','fireball','shield_spell'];

    const filtered = weights.filter(id => available.find(s => s.id === id));
    const pickedId = filtered[Math.floor(Math.random() * filtered.length)] || 'fireball';
    picked = available.find(s => s.id === pickedId) || available[0];
  }

  selectSpell(picked.id);
}

// ==================== MINI-GAME LAUNCHER ====================
function launchMiniGame(spell) {
  DuelState.phase = 'mini-game';
  DuelState.activeMinigame = spell.game;

  document.getElementById('duel-timer-wrap').style.display = 'flex';
  document.getElementById('duel-actions').style.display    = 'flex';

  switch (spell.game) {
    case 'mcq':      launchMCQ(spell);      break;
    case 'speedtap': launchSpeedTap(spell); break;
    case 'order':    launchOrder(spell);    break;
    case 'fillin':   launchFillIn(spell);   break;
  }

  // CPU plays the mini-game automatically
  if (DuelState.mode === 'cpu' && DuelState.turn === 'p2') {
    cpuPlayMiniGame(spell);
  }
}

// ==================== MINI-GAME 1: MCQ ====================
function launchMCQ(spell) {
  const q = DuelState.currentQ;
  const duelMain = document.getElementById('duel-main-area');
  duelMain.innerHTML = `
    <div class="minigame-header">
      <span class="minigame-spell-icon">${spell.icon}</span>
      <span class="minigame-title">${spell.name} — Answer to cast!</span>
    </div>
    <div class="duel-q-label">${q.label}</div>
    <div class="duel-q-display">${q.display}</div>
    <div class="duel-mcq-grid" id="duel-mcq-grid">
      ${shuffle(q.options.map((o,i) => ({...o, oi: i}))).map(o => `
        <div class="duel-mcq-opt" data-index="${o.oi}"
             onclick="duelMCQSelect(${o.oi}, this)">${o.html}</div>
      `).join('')}
    </div>
  `;

  startDuelTimer(15, () => duelTimesUp('mcq'));
}

function duelMCQSelect(idx, el) {
  if (DuelState.isProcessing) return;
  document.querySelectorAll('.duel-mcq-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  DuelState.selectedIdx = idx;
  document.getElementById('duel-check-btn').style.display = 'inline-block';
}

function submitDuelAnswer() {
  if (DuelState.isProcessing) return;
  clearDuelTimer();

  switch (DuelState.activeMinigame) {
    case 'mcq':      submitMCQ();      break;
    case 'speedtap': submitSpeedTap(); break;
    case 'order':    submitOrder();    break;
    case 'fillin':   submitFillIn();   break;
  }
}

function submitMCQ() {
  const isCorrect = DuelState.selectedIdx === DuelState.currentQ.correctIndex;
  document.querySelectorAll('.duel-mcq-opt').forEach(o => {
    const i = parseInt(o.getAttribute('data-index'));
    if (i === DuelState.currentQ.correctIndex) o.classList.add('correct');
    else if (i === DuelState.selectedIdx && !isCorrect) o.classList.add('wrong');
    o.style.pointerEvents = 'none';
  });
  setTimeout(() => processDuelResult(isCorrect), 700);
}

// ==================== MINI-GAME 2: SPEED TAP ====================
let speedTapCorrectEl = null;
let speedTapAnswered  = false;

function launchSpeedTap(spell) {
  const q = DuelState.currentQ;
  speedTapAnswered = false;

  // Show all 4 options scattered on screen, player taps correct one fast
  const opts = shuffle(q.options.map((o, i) => ({ ...o, oi: i })));
  const positions = [
    'top:10%;left:10%', 'top:10%;right:10%',
    'bottom:10%;left:10%', 'bottom:10%;right:10%',
  ];

  const duelMain = document.getElementById('duel-main-area');
  duelMain.innerHTML = `
    <div class="minigame-header">
      <span class="minigame-spell-icon">${spell.icon}</span>
      <span class="minigame-title">Lightning — Tap the correct answer FAST!</span>
    </div>
    <div class="duel-q-label">${q.label}</div>
    <div class="duel-q-display">${q.display}</div>
    <div class="speedtap-arena" id="speedtap-arena">
      ${opts.map((o, i) => `
        <div class="speedtap-bubble" style="${positions[i]}"
             data-index="${o.oi}"
             onclick="speedTapSelect(${o.oi}, this)">
          ${o.html}
        </div>
      `).join('')}
    </div>
  `;

  // Bubbles float around
  startBubbleAnimation();
  startDuelTimer(10, () => duelTimesUp('speedtap'));
}

function startBubbleAnimation() {
  const bubbles = document.querySelectorAll('.speedtap-bubble');
  bubbles.forEach((b, i) => {
    const angle = (i / bubbles.length) * Math.PI * 2;
    let t = angle;
    const interval = setInterval(() => {
      if (!document.contains(b)) { clearInterval(interval); return; }
      t += 0.04;
      const cx = 50 + 30 * Math.cos(t);
      const cy = 50 + 25 * Math.sin(t + (i * Math.PI / 2));
      b.style.left = cx + '%';
      b.style.top  = cy + '%';
    }, 50);
  });
}

function speedTapSelect(idx, el) {
  if (speedTapAnswered || DuelState.isProcessing) return;
  speedTapAnswered = true;
  document.querySelectorAll('.speedtap-bubble').forEach(b => b.style.pointerEvents = 'none');
  clearDuelTimer();
  const isCorrect = idx === DuelState.currentQ.correctIndex;
  el.classList.add(isCorrect ? 'tap-correct' : 'tap-wrong');
  if (!isCorrect) {
    const correctEl = document.querySelector(`.speedtap-bubble[data-index="${DuelState.currentQ.correctIndex}"]`);
    if (correctEl) correctEl.classList.add('tap-correct');
  }
  setTimeout(() => processDuelResult(isCorrect), 700);
}

function submitSpeedTap() {
  if (!speedTapAnswered) {
    processDuelResult(false);
  }
}

// ==================== MINI-GAME 3: ORDER STEPS ====================
let orderPuzzle      = null;
let orderArranged    = [];
let orderRemaining   = [];

function launchOrder(spell) {
  orderPuzzle    = OrderPuzzles[Math.floor(Math.random() * OrderPuzzles.length)];
  orderArranged  = [];
  orderRemaining = shuffle([...orderPuzzle.steps.map((s, i) => ({ text: s, idx: i }))]);

  const duelMain = document.getElementById('duel-main-area');
  duelMain.innerHTML = `
    <div class="minigame-header">
      <span class="minigame-spell-icon">${spell.icon}</span>
      <span class="minigame-title">Vortex — Arrange the steps in ORDER!</span>
    </div>
    <div class="order-question">${orderPuzzle.question}</div>
    <div class="order-arranged" id="order-arranged">
      <div class="order-drop-hint">Tap steps below in the correct order ↓</div>
    </div>
    <div class="order-remaining" id="order-remaining">
      ${orderRemaining.map((s, i) => `
        <div class="order-step-chip" data-stepidx="${s.idx}" data-listidx="${i}"
             onclick="orderTapStep(${s.idx}, ${i}, this)">
          ${s.text}
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('duel-check-btn').style.display = 'inline-block';
  startDuelTimer(20, () => duelTimesUp('order'));
}

function orderTapStep(stepIdx, listIdx, el) {
  if (DuelState.isProcessing) return;
  el.classList.add('chip-selected');
  el.style.pointerEvents = 'none';
  orderArranged.push(stepIdx);

  const arranged = document.getElementById('order-arranged');
  const chip = document.createElement('div');
  chip.className = 'order-placed-chip';
  chip.textContent = `${orderArranged.length}. ${orderPuzzle.steps[stepIdx]}`;
  arranged.appendChild(chip);

  if (orderArranged.length === orderPuzzle.steps.length) {
    clearDuelTimer();
    submitOrder();
  }
}

function submitOrder() {
  const correct = orderPuzzle.correct;
  const isCorrect = orderArranged.every((v, i) => v === correct[i]);

  document.querySelectorAll('.order-placed-chip').forEach((chip, i) => {
    chip.style.background = orderArranged[i] === correct[i]
      ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)';
  });

  setTimeout(() => processDuelResult(isCorrect), 800);
}

// ==================== MINI-GAME 4: FILL IN ====================
let fillInPuzzle = null;

function launchFillIn(spell) {
  fillInPuzzle = FillInPuzzles[Math.floor(Math.random() * FillInPuzzles.length)];

  const duelMain = document.getElementById('duel-main-area');
  duelMain.innerHTML = `
    <div class="minigame-header">
      <span class="minigame-spell-icon">${spell.icon}</span>
      <span class="minigame-title">Bomb — Fill in the missing part!</span>
    </div>
    <div class="fillin-display">${fillInPuzzle.display}</div>
    <div class="fillin-options" id="fillin-options">
      ${shuffle([...fillInPuzzle.options]).map(opt => `
        <div class="fillin-chip" onclick="fillInSelect('${opt}', this)">${opt}</div>
      `).join('')}
    </div>
    <div id="fillin-result"></div>
  `;

  startDuelTimer(12, () => duelTimesUp('fillin'));
}

function fillInSelect(val, el) {
  if (DuelState.isProcessing) return;
  document.querySelectorAll('.fillin-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  DuelState.selectedFillIn = val;
  document.getElementById('duel-check-btn').style.display = 'inline-block';
}

function submitFillIn() {
  if (!DuelState.selectedFillIn) return;
  clearDuelTimer();
  const isCorrect = DuelState.selectedFillIn === fillInPuzzle.answer;

  document.querySelectorAll('.fillin-chip').forEach(c => {
    if (c.textContent === fillInPuzzle.answer) c.classList.add('tap-correct');
    else if (c.classList.contains('selected') && !isCorrect) c.classList.add('tap-wrong');
    c.style.pointerEvents = 'none';
  });

  const res = document.getElementById('fillin-result');
  if (res) res.innerHTML = `<div class="fillin-explain">💡 ${fillInPuzzle.explain}</div>`;

  setTimeout(() => processDuelResult(isCorrect), 900);
}

// ==================== TIMER ====================
function startDuelTimer(seconds, onExpire) {
  DuelState.timeLeft = seconds;
  const bar  = document.getElementById('duel-timer-bar');
  const text = document.getElementById('duel-timer-text');
  if (!bar || !text) return;
  bar.style.width      = '100%';
  bar.style.background = 'var(--success)';
  text.textContent     = seconds + 's';

  clearInterval(DuelState.timerInterval);
  let ms = seconds * 1000;
  DuelState.timerInterval = setInterval(() => {
    ms -= 50;
    const pct = (ms / (seconds * 1000)) * 100;
    bar.style.width = Math.max(0, pct) + '%';
    if (pct < 30) bar.style.background = 'var(--danger)';
    else if (pct < 60) bar.style.background = 'var(--secondary)';
    text.textContent = Math.ceil(ms / 1000) + 's';
    if (ms <= 0) { clearInterval(DuelState.timerInterval); onExpire(); }
  }, 50);
}

function clearDuelTimer() { clearInterval(DuelState.timerInterval); }

function duelTimesUp(game) {
  if (DuelState.isProcessing) return;
  showDuelToast('⏱️ Time\'s up! Spell fizzled!');
  processDuelResult(false);
}

// ==================== CPU MINI-GAME PLAY ====================
function cpuPlayMiniGame(spell) {
  const correctChance = DuelState.difficulty === 'hard' ? 0.85 : DuelState.difficulty === 'medium' ? 0.60 : 0.35;
  const thinkMs       = DuelState.difficulty === 'hard' ? 1500 : DuelState.difficulty === 'medium' ? 2500 : 4000;

  setTimeout(() => {
    if (DuelState.isProcessing) return;
    clearDuelTimer();
    const isCorrect = Math.random() < correctChance;
    processDuelResult(isCorrect);
  }, thinkMs);
}

// ==================== PROCESS RESULT ====================
function processDuelResult(isCorrect) {
  if (DuelState.isProcessing) return;
  DuelState.isProcessing = true;
  clearDuelTimer();

  const attackerKey  = DuelState.turn;
  const defenderKey  = attackerKey === 'p1' ? 'p2' : 'p1';
  const attacker     = DuelState[attackerKey];
  const defender     = DuelState[defenderKey];
  const spell        = attacker.selectedSpell || Spells[0];

  if (isCorrect) {
    attacker.combo++;

    if (spell.isShield) {
      // Shield spell — attacker gains shield
      attacker.shield = true;
      showDuelToast(`🛡️ ${attacker.name} raises a Magic Shield!`);
      playArenaEffect(attackerKey, '🛡️', false);
    } else {
      // Attack!
      let dmg = spell.damage;
      if (attacker.combo >= 3) { dmg += 1; showDuelToast(`🔥 COMBO x${attacker.combo}! Extra damage!`); }

      if (defender.shield) {
        defender.shield = false;
        showDuelToast(`🛡️ ${defender.name}'s shield blocked the attack!`);
        playArenaEffect(defenderKey, '🛡️', false);
      } else {
        defender.hp = Math.max(0, defender.hp - dmg);
        showDuelToast(`${spell.icon} ${attacker.name} hits for ${dmg} damage!`);
        playArenaEffect(defenderKey, `−${dmg}❤️`, true);
      }
    }

    // MP regen on correct
    attacker.mp = Math.min(attacker.maxMp, attacker.mp + 1);

  } else {
    // Wrong / timed out — backfire!
    attacker.combo = 0;
    const backfireDmg = 1;
    if (attacker.shield) {
      attacker.shield = false;
      showDuelToast(`💨 ${attacker.name}'s spell backfired but shield blocked it!`);
    } else {
      attacker.hp = Math.max(0, attacker.hp - backfireDmg);
      showDuelToast(`💥 Spell backfired! ${attacker.name} takes ${backfireDmg} damage!`);
      playArenaEffect(attackerKey, '💥 Backfire!', true);
    }
  }

  updateDuelHUD();
  showExplanation(isCorrect, DuelState.currentQ);

  // Check round end
  setTimeout(() => {
    hideExplanation();
    if (DuelState.p1.hp <= 0 || DuelState.p2.hp <= 0) {
      const roundWinner = DuelState.p1.hp <= 0 ? 'p2' : 'p1';
      endRound(roundWinner);
    } else {
      // Switch turn
      DuelState.turn = defenderKey;
      DuelState.currentClash++;
      startTurn();
    }
  }, 2800);
}

// ==================== EXPLANATION PANEL ====================
function showExplanation(correct, q) {
  const duelMain = document.getElementById('duel-main-area');
  const existing = duelMain.querySelector('.duel-explanation');
  if (existing) existing.remove();

  const expDiv = document.createElement('div');
  expDiv.className = 'duel-explanation';
  expDiv.innerHTML = `
    <div class="duel-exp-header ${correct ? 'exp-correct' : 'exp-wrong'}">
      ${correct ? '✅ Correct!' : '❌ Incorrect!'}
    </div>
    <div class="duel-exp-body">${q ? q.explanationHTML : ''}</div>
  `;
  duelMain.appendChild(expDiv);
}

function hideExplanation() {
  const el = document.querySelector('.duel-explanation');
  if (el) el.remove();
}

// ==================== ARENA EFFECTS ====================
function playArenaEffect(targetKey, text, isHit) {
  const sprite = document.getElementById(`arena-${targetKey}-sprite`);
  const effect = document.getElementById(`${targetKey}-effect`);
  if (!sprite || !effect) return;

  const attackerKey = targetKey === 'p1' ? 'p2' : 'p1';
  const attSprite   = document.getElementById(`arena-${attackerKey}-sprite`);

  attSprite.classList.add('attacking');
  setTimeout(() => attSprite.classList.remove('attacking'), 400);

  if (isHit) {
    setTimeout(() => {
      sprite.classList.add('hit');
      effect.textContent = text;
      effect.classList.add('show-damage');
      document.getElementById('screen-duel').classList.add('screen-shake');
      setTimeout(() => {
        sprite.classList.remove('hit');
        effect.classList.remove('show-damage');
        document.getElementById('screen-duel').classList.remove('screen-shake');
      }, 700);
    }, 200);
  } else {
    effect.textContent = text;
    effect.classList.add('show-damage');
    setTimeout(() => effect.classList.remove('show-damage'), 800);
  }
}

// ==================== HUD UPDATE ====================
function updateDuelHUD() {
  const p = DuelState;

  ['p1','p2'].forEach(key => {
    const pl  = p[key];
    const hpPct = (pl.hp / pl.maxHp) * 100;
    const bar = document.getElementById(`${key}-hp-bar`);
    if (bar) {
      bar.style.width      = hpPct + '%';
      bar.style.background = hpPct > 50 ? 'linear-gradient(90deg,#10b981,#34d399)'
                           : hpPct > 25 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
                           :              'linear-gradient(90deg,#ef4444,#f87171)';
    }

    const hpText = document.getElementById(`${key}-hp-text`);
    if (hpText) {
      const hearts = '❤️'.repeat(pl.hp) + '🖤'.repeat(Math.max(0, pl.maxHp - pl.hp));
      const shield = pl.shield ? ' 🛡️' : '';
      const combo  = pl.combo >= 3 ? ` 🔥×${pl.combo}` : '';
      hpText.textContent = hearts + shield + combo;
    }
  });

  document.getElementById('duel-round-display').textContent = `R${p.currentRound}`;
  const winsNeeded = Math.ceil(p.totalRounds / 2);
  document.getElementById('p1-wins-display').innerHTML =
    '🔵'.repeat(p.p1.wins) + '⚪'.repeat(Math.max(0, winsNeeded - p.p1.wins));
  document.getElementById('p2-wins-display').innerHTML =
    '🔴'.repeat(p.p2.wins) + '⚪'.repeat(Math.max(0, winsNeeded - p.p2.wins));
}

// ==================== ROUND END ====================
function endRound(winnerKey) {
  clearDuelTimer();
  const winner     = DuelState[winnerKey];
  winner.wins++;
  updateDuelHUD();

  const winsNeeded = Math.ceil(DuelState.totalRounds / 2);
  showRoundBanner(`🏆 ${winner.name} wins Round ${DuelState.currentRound}!`, () => {
    if (DuelState.p1.wins >= winsNeeded || DuelState.p2.wins >= winsNeeded) {
      endMatch(DuelState.p1.wins >= winsNeeded ? 'p1' : 'p2');
    } else {
      DuelState.currentRound++;
      startRound();
    }
  });
}

// ==================== MATCH END ====================
function endMatch(winnerKey) {
  clearDuelTimer();
  const winner = DuelState[winnerKey];
  const loser  = DuelState[winnerKey === 'p1' ? 'p2' : 'p1'];
  const isP1   = winnerKey === 'p1';
  const isCPU  = DuelState.mode === 'cpu';

  document.getElementById('result-trophy').textContent  = isP1 ? '🏆' : isCPU ? '💀' : '🏆';
  document.getElementById('result-title').textContent   = isP1 ? 'Victory!' : isCPU ? 'Defeat!' : 'Battle Over!';
  document.getElementById('result-winner').innerHTML    = `${winner.avatar} <strong>${winner.name}</strong> wins the battle!`;
  document.getElementById('result-stats').innerHTML     = `
    ${DuelState.p1.name}: ${DuelState.p1.wins} wins<br>
    ${DuelState.p2.name}: ${DuelState.p2.wins} wins<br>
    Difficulty: <strong>${DuelState.difficulty.toUpperCase()}</strong><br>
    Rounds played: <strong>${DuelState.currentRound}</strong>
  `;

  let coins = 0;
  if (isP1 || !isCPU) {
    coins = DuelState.difficulty === 'hard' ? 40 : DuelState.difficulty === 'medium' ? 25 : 15;
    if (typeof Rewards !== 'undefined') {
      Rewards.addCoins(coins);
      if (isP1 && typeof BadgeSystem !== 'undefined') BadgeSystem.recordDuelWin();
    }
  }

  document.getElementById('result-coins').innerHTML = (isP1 || !isCPU)
    ? `🪙 +${coins} coins earned!`
    : `Study the steps — you'll win next time! 💪`;

  showScreen('screen-duel-result');
}

// ==================== HINT ====================
function duelUseHint() {
  if (DuelState.isProcessing) return;
  const actor = DuelState[DuelState.turn];
  if (actor.hp <= 1) { showDuelToast('❌ Not enough HP!'); return; }

  actor.hp -= 1;
  updateDuelHUD();
  showDuelToast(`💡 Hint used! (-1 ❤️)`);
  document.getElementById('duel-hint-btn').disabled = true;

  // Dim two wrong options
  const opts = document.querySelectorAll('.duel-mcq-opt, .speedtap-bubble, .fillin-chip');
  let dimmed = 0;
  opts.forEach(o => {
    const idx = parseInt(o.getAttribute('data-index') || '-1');
    const val = o.textContent.trim();
    const isCorrect = (idx !== -1)
      ? idx === DuelState.currentQ?.correctIndex
      : val === fillInPuzzle?.answer;
    if (!isCorrect && dimmed < 2) {
      o.style.opacity = '0.25';
      o.style.pointerEvents = 'none';
      dimmed++;
    }
  });
}

// ==================== TOAST ====================
function showDuelToast(msg) {
  let t = document.getElementById('duel-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'duel-toast';
    t.className = 'duel-toast';
    document.getElementById('screen-duel').appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.remove('show'), 2200);
}

// ==================== QUIT ====================
function confirmQuitDuel() {
  clearDuelTimer();
  if (confirm('Forfeit the battle?')) showScreen('screen-mode');
}