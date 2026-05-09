/* =============================================
   FRACTOQUEST — Battle Duel Logic
   ============================================= */

const DuelState = {
  mode: 'pvp', // 'pvp' or 'cpu'
  difficulty: 'easy',
  totalRounds: 3,
  currentRound: 1,
  p1: { name: 'Wizard', avatar: '🧙‍♂️', hp: 3, maxHp: 3, wins: 0 },
  p2: { name: 'Rival', avatar: '🤖', hp: 3, maxHp: 3, wins: 0 },
  turn: 'p1', // 'p1' or 'p2'
  currentQ: null,
  selectedIdx: null,
  timerInterval: null,
  timeLeftMs: 15000,
  maxTimeMs: 15000,
  isProcessing: false,
  questionPool: [],
};

// ==================== SETUP FUNCTIONS ====================
function pickAvatar(player, emoji) {
  const target = player === 1 ? 'p1' : 'p2';
  DuelState[target].avatar = emoji;
  document.getElementById(`${target}-avatar`).textContent = emoji;
}

function setDuelMode(mode) {
  DuelState.mode = mode;
  document.getElementById('btn-pvp').classList.toggle('active', mode === 'pvp');
  document.getElementById('btn-cpu').classList.toggle('active', mode === 'cpu');
  const p2Input = document.getElementById('p2-name');
  const p2Label = document.getElementById('p2-label');
  if (mode === 'cpu') {
    p2Input.value = 'CPU Mage';
    p2Input.disabled = true;
    p2Label.textContent = 'CPU Opponent';
  } else {
    p2Input.value = 'Rival';
    p2Input.disabled = false;
    p2Label.textContent = 'Player 2';
  }
}

function setDifficulty(diff) {
  DuelState.difficulty = diff;
  ['easy', 'medium', 'hard'].forEach(d => {
    document.getElementById(`diff-${d}`).classList.toggle('active', d === diff);
  });
}

function setRounds(n) {
  DuelState.totalRounds = n;
  [3, 5, 7].forEach(r => {
    document.getElementById(`rounds-${r}`).classList.toggle('active', r === n);
  });
}

// ==================== START DUEL ====================
function startDuel() {
  DuelState.p1.name = document.getElementById('p1-name').value || 'P1';
  DuelState.p2.name = document.getElementById('p2-name').value || 'P2';
  DuelState.p1.wins = 0;
  DuelState.p2.wins = 0;
  DuelState.currentRound = 1;
  DuelState.questionPool = shuffle(getQuestionsByDifficulty(DuelState.difficulty));

  // Set max HP based on difficulty
  const maxHp = DuelState.difficulty === 'hard' ? 4 : 3;
  DuelState.p1.maxHp = maxHp;
  DuelState.p2.maxHp = maxHp;

  // Update HUD names/avatars
  document.getElementById('p1-hud-name').textContent = DuelState.p1.name;
  document.getElementById('p2-hud-name').textContent = DuelState.p2.name;
  document.getElementById('p1-hud-avatar').textContent = DuelState.p1.avatar;
  document.getElementById('p2-hud-avatar').textContent = DuelState.p2.avatar;
  document.getElementById('arena-p1-sprite').textContent = DuelState.p1.avatar;
  document.getElementById('arena-p2-sprite').textContent = DuelState.p2.avatar;

  showScreen('screen-duel');
  startRound();
}

function startRound() {
  DuelState.p1.hp = DuelState.p1.maxHp;
  DuelState.p2.hp = DuelState.p2.maxHp;
  DuelState.turn = 'p1';
  updateDuelHUD();

  // Show Round Banner
  const banner = document.getElementById('round-banner');
  document.getElementById('round-banner-text').textContent = `⚔️ Round ${DuelState.currentRound} ⚔️`;
  banner.style.display = 'flex';
  setTimeout(() => {
    banner.style.display = 'none';
    nextClash();
  }, 1500);
}

// ==================== CLASH FLOW ====================
function nextClash() {
  if (DuelState.questionPool.length < 2) {
    DuelState.questionPool = shuffle(getQuestionsByDifficulty(DuelState.difficulty));
  }
  DuelState.currentQ = DuelState.questionPool.pop();
  DuelState.selectedIdx = null;
  DuelState.isProcessing = false;

  // UI Reset
  document.getElementById('duel-q-label').textContent = DuelState.currentQ.label;
  document.getElementById('duel-q-display').innerHTML = DuelState.currentQ.display;
  document.getElementById('duel-check-btn').style.display = 'none';
  document.getElementById('duel-hint-btn').disabled = false;
  document.getElementById('cpu-thinking').style.display = 'none';
  document.getElementById('duel-turn-prompt').style.display = 'block';

  const activePlayer = DuelState.turn === 'p1' ? DuelState.p1 : DuelState.p2;
  document.getElementById('duel-turn-name').textContent = activePlayer.name;
  document.getElementById('duel-turn-badge').textContent = `${activePlayer.name}'s Turn`;

  // Highlight active HUD
  document.getElementById('p1-hud').classList.toggle('active-turn', DuelState.turn === 'p1');
  document.getElementById('p2-hud').classList.toggle('active-turn', DuelState.turn === 'p2');

  buildDuelMCQ(DuelState.currentQ);
  startDuelTimer();

  // If CPU turn
  if (DuelState.mode === 'cpu' && DuelState.turn === 'p2') {
    document.getElementById('duel-turn-prompt').style.display = 'none';
    document.getElementById('cpu-thinking').style.display = 'block';
    disableDuelInputs(true);
    cpuTakeTurn();
  } else {
    disableDuelInputs(false);
  }
}

function buildDuelMCQ(q) {
  const grid = document.getElementById('duel-mcq-grid');
  const opts = q.options.map((opt, i) => ({ ...opt, originalIndex: i }));
  const shuffled = shuffle(opts);
  grid.innerHTML = shuffled.map(opt => `
    <div class="duel-mcq-opt" data-index="${opt.originalIndex}" onclick="duelSelectMCQ(${opt.originalIndex}, this)">
      ${opt.html}
    </div>
  `).join('');
}

function duelSelectMCQ(idx, el) {
  if (DuelState.isProcessing) return;
  document.querySelectorAll('.duel-mcq-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  DuelState.selectedIdx = idx;
  document.getElementById('duel-check-btn').style.display = 'inline-block';
}

function submitDuelAnswer() {
  if (DuelState.selectedIdx === null || DuelState.isProcessing) return;
  clearInterval(DuelState.timerInterval);
  DuelState.isProcessing = true;
  disableDuelInputs(true);
  document.getElementById('duel-check-btn').style.display = 'none';

  const isCorrect = DuelState.selectedIdx === DuelState.currentQ.correctIndex;
  processDuelResult(isCorrect, DuelState.turn);
}

function processDuelResult(isCorrect, attackerKey) {
  const attacker = attackerKey === 'p1' ? DuelState.p1 : DuelState.p2;
  const defenderKey = attackerKey === 'p1' ? 'p2' : 'p1';
  const defender = defenderKey === 'p1' ? DuelState.p1 : DuelState.p2;

  // Visual feedback on MCQ
  document.querySelectorAll('.duel-mcq-opt').forEach(o => {
    const idx = parseInt(o.getAttribute('data-index'));
    if (idx === DuelState.currentQ.correctIndex) o.classList.add('correct');
    else if (idx === DuelState.selectedIdx && !isCorrect) o.classList.add('wrong');
  });

  if (isCorrect) {
    defender.hp = Math.max(0, defender.hp - 1);
    playAttackAnimation(attackerKey, defenderKey, true);
    showDuelToast(`${attacker.name} cast a spell! 💥 ${defender.name} takes 1 damage!`);
  } else {
    attacker.hp = Math.max(0, attacker.hp - 1);
    playAttackAnimation(attackerKey, attackerKey, false); // backfire
    showDuelToast(`${attacker.name}'s spell backfired! 💔 Takes 1 damage!`);
  }

  updateDuelHUD();

  // Check round end
  setTimeout(() => {
    if (DuelState.p1.hp <= 0 || DuelState.p2.hp <= 0) {
      endRound(DuelState.p1.hp <= 0 ? 'p2' : 'p1');
    } else {
      // Switch turn
      DuelState.turn = DuelState.turn === 'p1' ? 'p2' : 'p1';
      nextClash();
    }
  }, 1500);
}

// ==================== TIMER ====================
function startDuelTimer() {
  DuelState.timeLeftMs = DuelState.maxTimeMs;
  const bar = document.getElementById('duel-timer-bar');
  const text = document.getElementById('duel-timer-text');
  bar.style.width = '100%';
  bar.style.background = 'var(--success)';
  text.textContent = '15s';

  clearInterval(DuelState.timerInterval);
  DuelState.timerInterval = setInterval(() => {
    DuelState.timeLeftMs -= 50;
    const pct = (DuelState.timeLeftMs / DuelState.maxTimeMs) * 100;
    bar.style.width = pct + '%';
    text.textContent = Math.ceil(DuelState.timeLeftMs / 1000) + 's';

    if (pct < 30) bar.style.background = 'var(--danger)';
    else if (pct < 60) bar.style.background = 'var(--secondary)';

    if (DuelState.timeLeftMs <= 0) {
      clearInterval(DuelState.timerInterval);
      if (!DuelState.isProcessing) {
        DuelState.isProcessing = true;
        disableDuelInputs(true);
        document.getElementById('duel-check-btn').style.display = 'none';
        showDuelToast(`⏱️ Time's up! Spell fizzles and backfires!`);
        processDuelResult(false, DuelState.turn); // Timeout = backfire
      }
    }
  }, 50);
}

// ==================== CPU LOGIC ====================
function cpuTakeTurn() {
  const thinkTime = DuelState.difficulty === 'hard' ? 1000 : DuelState.difficulty === 'medium' ? 2000 : 3000;
  const correctChance = DuelState.difficulty === 'hard' ? 0.85 : DuelState.difficulty === 'medium' ? 0.60 : 0.35;

  // Animate dots
  let dots = 0;
  const dotInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    document.getElementById('cpu-dots').textContent = '.'.repeat(dots + 1);
  }, 300);

  setTimeout(() => {
    clearInterval(dotInterval);
    document.getElementById('cpu-thinking').style.display = 'none';

    const isCorrect = Math.random() < correctChance;
    let chosenIdx = DuelState.currentQ.correctIndex;
    if (!isCorrect) {
      const wrongOpts = [0, 1, 2, 3].filter(i => i !== DuelState.currentQ.correctIndex);
      chosenIdx = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
    }

    // Visually select
    const optEl = document.querySelector(`.duel-mcq-opt[data-index="${chosenIdx}"]`);
    if (optEl) optEl.classList.add('selected');
    DuelState.selectedIdx = chosenIdx;

    setTimeout(() => processDuelResult(isCorrect, 'p2'), 500);
  }, thinkTime);
}

// ==================== ANIMATIONS & UI ====================
function playAttackAnimation(attackerKey, targetKey, isHit) {
  const attackerSprite = document.getElementById(`arena-${attackerKey}-sprite`);
  const targetSprite = document.getElementById(`arena-${targetKey}-sprite`);
  const targetEffect = document.getElementById(`${targetKey}-effect`);

  // Attacker lunge
  attackerSprite.classList.add('attacking');
  setTimeout(() => attackerSprite.classList.remove('attacking'), 400);

  if (isHit) {
    // Target hit
    setTimeout(() => {
      targetSprite.classList.add('hit');
      targetEffect.textContent = '-1 ❤️';
      targetEffect.classList.add('show-damage');
      document.getElementById('screen-duel').classList.add('screen-shake');

      setTimeout(() => {
        targetSprite.classList.remove('hit');
        targetEffect.classList.remove('show-damage');
        document.getElementById('screen-duel').classList.remove('screen-shake');
      }, 600);
    }, 200);
  } else {
    // Backfire
    setTimeout(() => {
      attackerSprite.classList.add('hit');
      targetEffect.textContent = '💥 Backfire!';
      targetEffect.classList.add('show-damage');
      document.getElementById('screen-duel').classList.add('screen-shake');

      setTimeout(() => {
        attackerSprite.classList.remove('hit');
        targetEffect.classList.remove('show-damage');
        document.getElementById('screen-duel').classList.remove('screen-shake');
      }, 600);
    }, 200);
  }
}

function updateDuelHUD() {
  // HP Bars
  const p1Pct = (DuelState.p1.hp / DuelState.p1.maxHp) * 100;
  const p2Pct = (DuelState.p2.hp / DuelState.p2.maxHp) * 100;
  document.getElementById('p1-hp-bar').style.width = p1Pct + '%';
  document.getElementById('p2-hp-bar').style.width = p2Pct + '%';
  document.getElementById('p1-hp-text').textContent = '❤️'.repeat(DuelState.p1.hp) + '🖤'.repeat(DuelState.p1.maxHp - DuelState.p1.hp);
  document.getElementById('p2-hp-text').textContent = '❤️'.repeat(DuelState.p2.hp) + '🖤'.repeat(DuelState.p2.maxHp - DuelState.p2.hp);

  // Round & Wins
  document.getElementById('duel-round-display').textContent = `R${DuelState.currentRound}`;
  document.getElementById('p1-wins-display').innerHTML = '🔵'.repeat(DuelState.p1.wins) + '⚪'.repeat(Math.ceil(DuelState.totalRounds/2) - DuelState.p1.wins);
  document.getElementById('p2-wins-display').innerHTML = '🔴'.repeat(DuelState.p2.wins) + '⚪'.repeat(Math.ceil(DuelState.totalRounds/2) - DuelState.p2.wins);
}

function disableDuelInputs(disabled) {
  document.querySelectorAll('.duel-mcq-opt').forEach(o => o.style.pointerEvents = disabled ? 'none' : 'auto');
  document.getElementById('duel-hint-btn').disabled = disabled;
}

function duelUseHint() {
  if (DuelState.isProcessing) return;
  // Costs 1 HP to use hint in duel!
  const player = DuelState.turn === 'p1' ? DuelState.p1 : DuelState.p2;
  if (player.hp <= 1) {
    showDuelToast("❌ Not enough HP to use a hint!");
    return;
  }
  player.hp -= 1;
  updateDuelHUD();
  showDuelToast(`💡 ${player.name} used a hint! (-1 ❤️)`);
  document.getElementById('duel-hint-btn').disabled = true;

  // Highlight wrong answers slightly
  const wrongOpts = document.querySelectorAll('.duel-mcq-opt');
  let hidden = 0;
  wrongOpts.forEach(o => {
    const idx = parseInt(o.getAttribute('data-index'));
    if (idx !== DuelState.currentQ.correctIndex && hidden < 2) {
      o.style.opacity = '0.3';
      o.style.pointerEvents = 'none';
      hidden++;
    }
  });
}

function showDuelToast(msg) {
  let toast = document.getElementById('duel-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'duel-toast';
    toast.className = 'duel-toast';
    document.getElementById('screen-duel').appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ==================== ROUND & MATCH END ====================
function endRound(winnerKey) {
  clearInterval(DuelState.timerInterval);
  const winner = winnerKey === 'p1' ? DuelState.p1 : DuelState.p2;
  winner.wins++;
  updateDuelHUD();

  showDuelToast(`🏆 ${winner.name} wins Round ${DuelState.currentRound}!`);

  const winsNeeded = Math.ceil(DuelState.totalRounds / 2);
  setTimeout(() => {
    if (DuelState.p1.wins >= winsNeeded || DuelState.p2.wins >= winsNeeded) {
      endMatch(DuelState.p1.wins >= winsNeeded ? 'p1' : 'p2');
    } else {
      DuelState.currentRound++;
      startRound();
    }
  }, 2500);
}

function endMatch(winnerKey) {
  const winner = winnerKey === 'p1' ? DuelState.p1 : DuelState.p2;
  const loser = winnerKey === 'p1' ? DuelState.p2 : DuelState.p1;

  document.getElementById('result-trophy').textContent = winnerKey === 'p1' ? '🏆' : (DuelState.mode === 'cpu' ? '💀' : '🏆');
  document.getElementById('result-title').textContent = winnerKey === 'p1' ? 'Victory!' : (DuelState.mode === 'cpu' ? 'Defeat!' : 'Battle Over!');
  document.getElementById('result-winner').innerHTML = `Winner: <strong>${winner.name}</strong> ${winner.avatar}`;
  document.getElementById('result-stats').innerHTML = `
    Rounds Won: ${DuelState.p1.name} ${DuelState.p1.wins} - ${DuelState.p2.wins} ${DuelState.p2.name}<br>
    Difficulty: ${DuelState.difficulty.toUpperCase()}
  `;

  // Rewards
  let coins = 0;
  if (winnerKey === 'p1') {
    coins = DuelState.difficulty === 'hard' ? 30 : DuelState.difficulty === 'medium' ? 20 : 10;
    if (typeof Rewards !== 'undefined') Rewards.addCoins(coins);
  }
  document.getElementById('result-coins').innerHTML = winnerKey === 'p1' ? `+${coins} 🪙 Earned!` : 'Better luck next time!';

  showScreen('screen-duel-result');
}

function confirmQuitDuel() {
  clearInterval(DuelState.timerInterval);
  if (confirm('Forfeit the battle?')) {
    showScreen('screen-mode');
  }
}