/* =============================================
   FRACTOQUEST — Main Game Logic (Complete)
   ============================================= */

// ==================== STATE ====================
const State = {
  mode: 'quest',
  level: 1,
  score: 0,
  lives: 3,
  hintUsed: false,
  hintUsedThisLevel: false,
  questionIndex: 0,
  questions: [],
  speedTimer: null,
  timeLeft: 60,
  selectedMCQ: null,
  currentQ: null,
  learnMode: false,
};

// ==================== EVENT HELPER ====================
function fireGameEvent(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

// ==================== SCREEN MANAGEMENT ====================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  if (id === 'screen-home')    updateHomeStats();
  if (id === 'screen-scores')  renderScores();
  if (id === 'screen-tutorial') initTutorial();
  if (id === 'screen-mode')    updateModeScreen();
  if (id === 'screen-rewards') {
    updateDailyStatus();
    if (typeof Rewards !== 'undefined') Rewards.updateCoinDisplays();
    if (typeof MissionSystem !== 'undefined') MissionSystem.renderMissions();
    if (typeof MasteryTracker !== 'undefined') MasteryTracker.render();
    if (typeof PowerUps !== 'undefined') PowerUps.renderShop();
    if (typeof BadgeSystem !== 'undefined') BadgeSystem.renderCabinet();
  }
}

function updateHomeStats() {
  const stars = parseInt(localStorage.getItem('fq_total_stars') || '0');
  const el = document.getElementById('total-stars-home');
  if (el) el.textContent = stars;
  if (typeof Rewards !== 'undefined') Rewards.updateCoinDisplays();
}

function updateModeScreen() {
  const lv   = localStorage.getItem('fq_level') || '1';
  const best = localStorage.getItem('fq_speed_best') || '--';
  const qp   = document.getElementById('quest-progress');
  const sb   = document.getElementById('speed-best');
  if (qp) qp.textContent = `Level ${lv}`;
  if (sb) sb.textContent = `Best: ${best}`;
  if (typeof Rewards !== 'undefined') Rewards.updateCoinDisplays();
}

// ==================== REWARDS TAB SWITCHER ====================
function switchRewardsTab(tab) {
  document.querySelectorAll('.rewards-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.rewards-tab-content').forEach(t => t.classList.remove('active'));

  const tabBtn = document.querySelector(`.rewards-tab[onclick*="${tab}"]`);
  const tabContent = document.getElementById(`tab-${tab}`);
  if (tabBtn) tabBtn.classList.add('active');
  if (tabContent) tabContent.classList.add('active');

  if (tab === 'missions' && typeof MissionSystem !== 'undefined') MissionSystem.renderMissions();
  if (tab === 'shop'     && typeof PowerUps     !== 'undefined') PowerUps.renderShop();
  if (tab === 'mastery'  && typeof MasteryTracker !== 'undefined') MasteryTracker.render();
  if (tab === 'badges'   && typeof BadgeSystem  !== 'undefined') BadgeSystem.renderCabinet();
}

// ==================== TUTORIAL ====================
const tutorialData = [
  {
    title: '🧮 What are Algebraic Fractions?',
    content: `
      <p>An <strong>algebraic fraction</strong> has letters in the numerator or denominator.</p>
      <div class="example-box">${fracHTML('3x','5')} &nbsp;&nbsp; ${fracHTML('a²b','4c')}</div>
      <p>We simplify them by cancelling common factors — just like regular fractions!</p>`,
  },
  {
    title: '✂️ How to Simplify',
    content: `
      <p><strong>Rule:</strong> Divide top and bottom by their common factors.</p>
      <div class="example-box">
        ${fracHTML('6x²','9x')} = ${fracHTML('2x','3')}
      </div>
      <div class="example-box" style="font-size:0.85em">
        Numbers: ${fracHTML('6','9')} → ${fracHTML('2','3')} (divide by 3)
        &nbsp;&nbsp; Variables: ${fracHTML('x²','x')} → x
      </div>`,
  },
  {
    title: '✖️ How to Multiply',
    content: `
      <p><strong>Rule:</strong> Multiply tops together, bottoms together, then simplify.</p>
      <div class="example-box">
        ${fracHTML('3x','4')} × ${fracHTML('8','x²')} = ${fracHTML('24x','4x²')} = ${fracHTML('6','x')}
      </div>
      <p>💡 Tip: Cancel common factors <em>before</em> multiplying!</p>`,
  },
  {
    title: '➗ How to Divide — KCF',
    content: `
      <p><strong>KCF: Keep · Change · Flip</strong></p>
      <div class="example-box">
        ${fracHTML('4x²','3')} ÷ ${fracHTML('2x','9')}
        = ${fracHTML('4x²','3')} × ${fracHTML('9','2x')} = 6x
      </div>
      <p>Keep the first fraction, Change ÷ to ×, Flip the second!</p>`,
  },
  {
    title: '🔍 Factorise to Simplify',
    content: `
      <p>Sometimes you must <strong>factor</strong> the numerator first:</p>
      <div class="example-box">
        ${fracHTML('x²−4','x+2')} = ${fracHTML('(x+2)(x−2)','x+2')} = x − 2
      </div>
      <p>Key patterns:<br>
      • x² − a² = (x+a)(x−a)<br>
      • x² + bx + c → find two numbers that × to c and + to b</p>`,
  },
  {
    title: '🎮 How to Play',
    content: `
      <p>• Pick the correct answer from 4 choices.</p>
      <p>• Use 💡 Hint if stuck — costs 5 points.</p>
      <p>• Buy Power-Ups in 🏪 Shop to help mid-game!</p>
      <p>• Complete 📅 Daily Missions to earn coins.</p>
      <p>• Check 📈 Mastery to see your weak topics.</p>
      <p>• Try ⚔️ Battle Duel — fight with spell mini-games!</p>
      <div class="example-box">Good luck, Apprentice Wizard! 🧙‍♂️✨</div>`,
  },
];

let tutorialPage = 0;

function initTutorial() {
  tutorialPage = 0;
  renderTutorial();
}

function renderTutorial() {
  const c = document.getElementById('tutorial-slides');
  if (!c) return;
  c.innerHTML = tutorialData.map((s, i) => `
    <div class="tutorial-slide ${i === tutorialPage ? 'active' : ''}">
      <h3>${s.title}</h3>${s.content}
    </div>`).join('');
  const pg = document.getElementById('tutorial-page');
  if (pg) pg.textContent = `${tutorialPage + 1} / ${tutorialData.length}`;
}

function tutorialPrev() {
  if (tutorialPage > 0) { tutorialPage--; renderTutorial(); }
}

function tutorialNext() {
  if (tutorialPage < tutorialData.length - 1) { tutorialPage++; renderTutorial(); }
}

// ==================== GAME START ====================
function startMode(mode) {
  State.mode  = mode;
  State.score = 0;
  State.lives = 3;
  State.hintUsed = false;
  State.hintUsedThisLevel = false;
  State.selectedMCQ = null;
  clearInterval(State.speedTimer);

  const timerEl = document.getElementById('hud-timer');
  if (timerEl) { timerEl.style.display = 'none'; timerEl.style.color = ''; }

  if (mode === 'quest') {
    State.level = parseInt(localStorage.getItem('fq_level') || '1');
    State.learnMode = false;
    loadLevel(State.level);
  } else if (mode === 'learn') {
    State.level = 1;
    State.learnMode = true;
    loadLevel(1, true);
  } else if (mode === 'speedrun') {
    State.level = 0;
    State.timeLeft = 60;
    State.learnMode = false;
    loadSpeedRun();
  }

  showScreen('screen-game');

  // Show inventory bar
  if (typeof PowerUps !== 'undefined') PowerUps.renderInventoryBar();
}

function loadLevel(level, learnMode = false) {
  const bank = QuestionBanks[`level${level}`] || QuestionBanks.level1;
  State.questions  = shuffle([...bank]);
  State.questionIndex = 0;
  State.learnMode  = learnMode;
  State.level      = level;
  State.hintUsedThisLevel = false;
  updateHUD();
  loadQuestion();
}

function loadSpeedRun() {
  State.questions = shuffle(getAllQuestions());
  State.questionIndex = 0;
  updateHUD();

  const timerEl  = document.getElementById('hud-timer');
  const timerVal = document.getElementById('timer-val');
  if (timerEl)  timerEl.style.display = 'flex';
  if (timerVal) timerVal.textContent = '60';

  State.speedTimer = setInterval(() => {
    State.timeLeft--;
    if (timerVal) timerVal.textContent = State.timeLeft;
    if (State.timeLeft <= 10 && timerEl) timerEl.style.color = '#ef4444';
    if (State.timeLeft <= 0) {
      clearInterval(State.speedTimer);
      endSpeedRun();
    }
  }, 1000);

  loadQuestion();
}

// ==================== QUESTION FLOW ====================
function loadQuestion() {
  if (State.questionIndex >= State.questions.length) {
    if (State.mode === 'speedrun') {
      State.questions = shuffle(getAllQuestions());
      State.questionIndex = 0;
    } else {
      showLevelComplete();
      return;
    }
  }

  const q = State.questions[State.questionIndex];
  State.currentQ    = q;
  State.selectedMCQ = null;
  State.hintUsed    = false;

  // Reset UI elements
  const ids = {
    'question-label':   { prop: 'textContent', val: q.label },
    'question-display': { prop: 'innerHTML',   val: q.display },
  };
  Object.entries(ids).forEach(([id, cfg]) => {
    const el = document.getElementById(id);
    if (el) el[cfg.prop] = cfg.val;
  });

  const stepHint = document.getElementById('step-hint');
  if (stepHint) { stepHint.style.display = 'none'; stepHint.innerHTML = ''; }

  const speechBubble = document.getElementById('speech-bubble');
  if (speechBubble) speechBubble.style.display = 'none';

  const feedbackOverlay = document.getElementById('feedback-overlay');
  if (feedbackOverlay) feedbackOverlay.style.display = 'none';

  const btnHint = document.getElementById('btn-hint');
  if (btnHint) btnHint.disabled = false;

  const btnCheck = document.getElementById('btn-check');
  if (btnCheck) btnCheck.style.display = 'none';

  const wizardSprite = document.getElementById('wizard-sprite');
  if (wizardSprite) wizardSprite.className = 'wizard-sprite';

  // Free hint from inventory
  const freeHints = parseInt(localStorage.getItem('fq_free_hints') || '0');
  if (btnHint) btnHint.textContent = freeHints > 0 ? `💡 Hint (Free ×${freeHints})` : '💡 Hint (−5pts)';

  // Question number
  const qNum = document.getElementById('question-number');
  if (qNum) {
    qNum.textContent = State.mode === 'speedrun'
      ? `Q ${State.questionIndex + 1}`
      : `Q ${State.questionIndex + 1} / ${State.questions.length}`;
  }

  // Progress bar
  const pct = (State.questionIndex / State.questions.length) * 100;
  const pb  = document.getElementById('progress-bar');
  if (pb) pb.style.width = pct + '%';

  buildMCQ(q);

  // Refresh inventory bar
  if (typeof PowerUps !== 'undefined') PowerUps.renderInventoryBar();
}

function buildMCQ(q) {
  const area = document.getElementById('answer-area');
  if (!area) return;

  const opts = q.options.map((opt, i) => ({ ...opt, originalIndex: i }));
  const shuffled = shuffle(opts);

  area.innerHTML = `<div class="mcq-grid">
    ${shuffled.map(opt => `
      <div class="mcq-option" data-index="${opt.originalIndex}"
           onclick="selectMCQ(${opt.originalIndex}, this)">
        ${opt.html}
      </div>`).join('')}
  </div>`;
}

function selectMCQ(index, el) {
  document.querySelectorAll('.mcq-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  State.selectedMCQ = index;

  const btnCheck = document.getElementById('btn-check');
  if (btnCheck) btnCheck.style.display = 'inline-block';

  // Learn mode: auto-show hint for free
  if (State.learnMode && !State.hintUsed) showHint(true);
}

// ==================== ANSWER CHECKING ====================
function checkAnswer() {
  if (State.selectedMCQ === null) return;
  const q = State.currentQ;
  const isCorrect = (State.selectedMCQ === q.correctIndex);

  // Mark options
  document.querySelectorAll('.mcq-option').forEach(o => {
    const idx = parseInt(o.getAttribute('data-index'));
    if (idx === q.correctIndex) o.classList.add('correct');
    else if (idx === State.selectedMCQ && !isCorrect) o.classList.add('wrong');
    o.style.pointerEvents = 'none';
  });

  if (isCorrect) handleCorrect(q);
  else           handleWrong(q);
}

function handleCorrect(q) {
  // Check if using free hint pack
  const freeHints = parseInt(localStorage.getItem('fq_free_hints') || '0');
  const pts = (State.hintUsed && freeHints === 0)
    ? Math.floor(q.points * 0.5)
    : q.points;

  State.score += pts;

  animateWizard('cast');
  spawnSparkles();
  showSpeechBubble(getCorrectPhrase());
  showFeedback(true, `+${pts} points! ✨`, q.explanationHTML);
  updateHUD();

  fireGameEvent('fq:correct', { type: q.type, points: q.points });
}

function handleWrong(q) {
  // Check for shield power-up
  if (localStorage.getItem('fq_shield') === '1') {
    localStorage.removeItem('fq_shield');
    if (typeof showToast !== 'undefined') showToast('🛡️ Shield blocked that! Life saved!');
    animateWizard('oops');
    showFeedback(false, '🛡️ Shielded! Study the solution:', q.explanationHTML);
    updateHUD();
    fireGameEvent('fq:wrong', { type: q.type });
    return;
  }

  State.lives = Math.max(0, State.lives - 1);
  animateWizard('oops');

  const qCard = document.getElementById('question-card');
  if (qCard) {
    qCard.classList.add('shake');
    setTimeout(() => qCard.classList.remove('shake'), 400);
  }

  showSpeechBubble('Oops! 😅 Study the steps!');
  showFeedback(false, 'Not quite — study the solution! 📚', q.explanationHTML);
  updateHUD();

  fireGameEvent('fq:wrong', { type: q.type });

  if (State.lives <= 0 && State.mode !== 'speedrun' && State.mode !== 'learn') {
    setTimeout(gameOver, 2000);
  }
}

function showFeedback(correct, msg, explanationHTML) {
  const emojiEl   = document.getElementById('feedback-emoji');
  const msgEl     = document.getElementById('feedback-msg');
  const expEl     = document.getElementById('feedback-explanation');
  const overlayEl = document.getElementById('feedback-overlay');

  if (emojiEl)   emojiEl.textContent  = correct ? getCorrectEmoji() : '😬';
  if (msgEl)     { msgEl.textContent  = msg; msgEl.style.color = correct ? 'var(--success)' : 'var(--danger)'; }
  if (expEl)     expEl.innerHTML      = explanationHTML;
  if (overlayEl) overlayEl.style.display = 'flex';
}

function nextQuestion() {
  const overlayEl = document.getElementById('feedback-overlay');
  if (overlayEl) overlayEl.style.display = 'none';
  State.questionIndex++;
  loadQuestion();
}

// ==================== HINTS ====================
function showHint(free = false) {
  if (!free) {
    // Check free hint pack first
    const freeHints = parseInt(localStorage.getItem('fq_free_hints') || '0');
    if (freeHints > 0) {
      localStorage.setItem('fq_free_hints', freeHints - 1);
      const btnHint = document.getElementById('btn-hint');
      if (btnHint) btnHint.textContent = freeHints - 1 > 0
        ? `💡 Hint (Free ×${freeHints - 1})` : '💡 Hint (−5pts)';
      // Don't mark as hint used — no penalty
    } else {
      State.hintUsed = true;
      State.hintUsedThisLevel = true;
      const btnHint = document.getElementById('btn-hint');
      if (btnHint) btnHint.disabled = true;
      fireGameEvent('fq:hintUsed');
    }
  }

  const hintEl = document.getElementById('step-hint');
  if (hintEl) {
    hintEl.innerHTML = getHintForType(State.currentQ.type);
    hintEl.style.display = 'block';
  }
}

function getHintForType(type) {
  const hints = {
    simplify:
      '💡 <strong>Split into number & variable parts.</strong> Divide numbers by their GCF. Subtract powers for variables (top power − bottom power).',
    multiply:
      '💡 <strong>Multiply tops × tops, bottoms × bottoms.</strong> Then simplify numbers (÷GCF) and variables (subtract powers).',
    divide:
      '💡 <strong>KCF:</strong> Keep 1st fraction → Change ÷ to × → Flip 2nd fraction. Then multiply as normal!',
    'factor-simplify':
      '💡 <strong>Factorise the numerator first!</strong> Look for: common factor, or difference of squares (a²−b²).',
    mixed:
      '💡 <strong>Work left to right.</strong> For ÷, use KCF. Simplify after each step.',
  };
  return hints[type] || '💡 Look for common factors to cancel top and bottom!';
}

// ==================== HUD ====================
function updateHUD() {
  const scoreEl = document.getElementById('hud-score');
  const levelEl = document.getElementById('hud-level');
  const livesEl = document.getElementById('hud-lives');

  if (scoreEl) scoreEl.textContent = State.score;
  if (levelEl) levelEl.textContent = State.mode === 'speedrun' ? 'Speed Run' : `Level ${State.level}`;
  if (livesEl) livesEl.textContent = [0,1,2].map(i => i < State.lives ? '❤️' : '🖤').join('');
}

// ==================== LEVEL COMPLETE ====================
function showLevelComplete() {
  clearInterval(State.speedTimer);

  const total = State.questions.reduce((s, q) => s + q.points, 0);
  const pct   = total > 0 ? Math.round((State.score / total) * 100) : 0;
  const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;

  if (State.mode === 'quest') {
    const key    = `fq_stars_${State.level}`;
    const saved  = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, Math.max(saved, stars));

    let totalStars = 0;
    for (let i = 1; i <= 6; i++) {
      totalStars += parseInt(localStorage.getItem(`fq_stars_${i}`) || '0');
    }
    localStorage.setItem('fq_total_stars', totalStars);

    if (State.level < 6) {
      const nextLv   = State.level + 1;
      const savedLv  = parseInt(localStorage.getItem('fq_level') || '1');
      if (nextLv > savedLv) localStorage.setItem('fq_level', nextLv);
    }
  }

  if (State.mode === 'speedrun') {
    const best = parseInt(localStorage.getItem('fq_speed_best') || '0');
    if (State.score > best) localStorage.setItem('fq_speed_best', State.score);
    saveHighScore(State.score);
    if (typeof MissionSystem !== 'undefined') {
      MissionSystem.recordEvent('speedrun_score', State.score);
    }
  }

  // Update complete screen
  const emojiEl  = document.getElementById('complete-emoji');
  const titleEl  = document.getElementById('complete-title');
  const starEl   = document.getElementById('star-rating');
  const statsEl  = document.getElementById('complete-stats');
  const coinsEl  = document.getElementById('complete-coins');
  const nextBtn  = document.getElementById('btn-next-level');

  if (emojiEl) emojiEl.textContent = stars === 3 ? '🏆' : stars === 2 ? '🌟' : '✨';
  if (titleEl) titleEl.textContent = State.mode === 'speedrun' ? "Time's Up!" : 'Level Complete!';
  if (starEl)  starEl.textContent  = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  if (statsEl) statsEl.innerHTML   = `Score: <strong>${State.score}</strong><br>Accuracy: <strong>${pct}%</strong>`;
  if (coinsEl) coinsEl.innerHTML   = typeof Rewards !== 'undefined'
    ? `🪙 Total coins: <strong>${Rewards.getCoins()}</strong>` : '';

  if (nextBtn) {
    nextBtn.style.display =
      (State.mode === 'speedrun' || State.mode === 'learn' || State.level >= 6)
        ? 'none' : 'inline-block';
  }

  fireGameEvent('fq:levelcomplete', {
    level: State.level,
    score: State.score,
    mode:  State.mode,
    hintUsedThisLevel: State.hintUsedThisLevel,
  });

  showScreen('screen-level-complete');
}

function nextLevel() {
  if (State.level >= 6) return;
  State.level++;
  State.score = 0;
  State.lives = 3;
  State.hintUsedThisLevel = false;
  loadLevel(State.level, State.learnMode);
  showScreen('screen-game');
}

function gameOver() {
  const emojiEl = document.getElementById('complete-emoji');
  const titleEl = document.getElementById('complete-title');
  const starEl  = document.getElementById('star-rating');
  const statsEl = document.getElementById('complete-stats');
  const nextBtn = document.getElementById('btn-next-level');

  if (emojiEl) emojiEl.textContent = '💀';
  if (titleEl) titleEl.textContent = 'Game Over!';
  if (starEl)  starEl.textContent  = '☆☆☆';
  if (statsEl) statsEl.innerHTML   = `Score: <strong>${State.score}</strong><br>Keep practicing! 💪`;
  if (nextBtn) nextBtn.style.display = 'none';

  showScreen('screen-level-complete');
}

function confirmQuit() {
  clearInterval(State.speedTimer);
  if (confirm('Quit current game?')) showScreen('screen-mode');
}

function endSpeedRun() { showLevelComplete(); }

// ==================== HIGH SCORES ====================
function saveHighScore(score) {
  let scores = JSON.parse(localStorage.getItem('fq_scores') || '[]');
  scores.push({ score, date: new Date().toLocaleDateString() });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem('fq_scores', JSON.stringify(scores.slice(0, 10)));
}

function renderScores() {
  const scores = JSON.parse(localStorage.getItem('fq_scores') || '[]');
  const el     = document.getElementById('scores-list');
  if (!el) return;

  if (!scores.length) {
    el.innerHTML = '<p style="text-align:center;color:var(--text-dim);padding:40px">No scores yet! Play Speed Run to set a record! 🚀</p>';
    return;
  }

  const medals = ['🥇','🥈','🥉'];
  el.innerHTML = scores.map((s, i) => `
    <div class="score-item">
      <span class="score-rank">${medals[i] || (i + 1) + '.'}</span>
      <span class="score-name">Speed Run — ${s.date}</span>
      <span class="score-val">⭐ ${s.score}</span>
    </div>`).join('');
}

function clearScores() {
  if (confirm('Clear all high scores?')) {
    localStorage.removeItem('fq_scores');
    renderScores();
  }
}

// ==================== DAILY CHALLENGE ====================
function handleDailyChallenge() {
  if (typeof DailyChallenge === 'undefined') return;
  if (DailyChallenge.isDoneToday()) {
    if (typeof showToast !== 'undefined') showToast('✅ Daily done! Come back tomorrow!');
  } else {
    startDailyChallenge();
  }
}

function startDailyChallenge() {
  if (typeof DailyChallenge === 'undefined') return;
  const q = DailyChallenge.getChallenge();
  State.mode      = 'quest';
  State.score     = 0;
  State.lives     = 3;
  State.questions = [q];
  State.questionIndex = 0;
  State.currentQ  = null;
  State.learnMode = false;
  State.level     = 'Daily';
  State.hintUsedThisLevel = false;
  updateHUD();
  loadQuestion();
  showScreen('screen-game');
}

function updateDailyStatus() {
  const el = document.getElementById('daily-status');
  if (!el) return;
  if (typeof DailyChallenge !== 'undefined') {
    el.textContent = DailyChallenge.isDoneToday()
      ? '✅ Done today! Come back tomorrow'
      : '+25 🪙 bonus available!';
  }
}

// ==================== PANEL HELPER ====================
function showPanel(id) {
  document.querySelectorAll('.reward-panel').forEach(p => p.style.display = 'none');
  if (id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
  }
}

// ==================== ANIMATIONS ====================
function animateWizard(type) {
  const wiz = document.getElementById('wizard-sprite');
  if (wiz) wiz.className = 'wizard-sprite ' + type;
}

function spawnSparkles() {
  const emojis = ['✨','⭐','🌟','💫','🔮'];
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className   = 'sparkle';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left  = (20 + Math.random() * 60) + 'vw';
      el.style.top   = (20 + Math.random() * 40) + 'vh';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }, i * 100);
  }
}

function showSpeechBubble(text) {
  const b = document.getElementById('speech-bubble');
  if (!b) return;
  b.textContent = text;
  b.style.display = 'block';
  setTimeout(() => { b.style.display = 'none'; }, 2500);
}

function getCorrectEmoji() {
  return ['🎉','🌟','🔥','💯','⚡','🏆','✨'][Math.floor(Math.random() * 7)];
}

function getCorrectPhrase() {
  return [
    'Spell cast! ✨',
    'Brilliant! 🌟',
    'Power unlocked! ⚡',
    'Perfect! 💯',
    'Wizard move! 🔮',
    'Excellent! 🎉',
  ][Math.floor(Math.random() * 6)];
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  showScreen('screen-home');
});