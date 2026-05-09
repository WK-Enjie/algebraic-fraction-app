/* =============================================
   FRACTOQUEST — Core Game Logic
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
  totalStars: 0,
  speedTimer: null,
  timeLeft: 60,
  duelTurn: 0,
  selectedMCQ: null,
  currentQ: null,
  learnMode: false,
};

// ==================== SCREEN MANAGEMENT ====================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'screen-home')    updateHomeStats();
  if (id === 'screen-scores')  renderScores();
  if (id === 'screen-tutorial') initTutorial();
  if (id === 'screen-mode')    updateModeScreen();
  if (id === 'screen-rewards') {
    updateDailyStatus();
    if (typeof Rewards !== 'undefined') Rewards.updateCoinDisplays();
  }
}

function updateHomeStats() {
  let totalStars = 0;
  for (let i = 1; i <= 6; i++) {
    totalStars += parseInt(localStorage.getItem(`fractoquest_stars_${i}`) || '0');
  }
  document.getElementById('total-stars-home').textContent = totalStars;
  if (typeof Rewards !== 'undefined') Rewards.updateCoinDisplays();
  const savedEmoji = localStorage.getItem('fq_wizard_emoji') || '🧙‍♂️';
  document.getElementById('wizard-home-display').textContent = savedEmoji;
}

function updateModeScreen() {
  const lv = localStorage.getItem('fractoquest_level') || '1';
  document.getElementById('quest-progress').textContent = `Level ${lv}`;
  const best = localStorage.getItem('fractoquest_speed_best') || '--';
  document.getElementById('speed-best').textContent = `Best: ${best}`;
}

// ==================== TUTORIAL ====================
const tutorialData = [
  {
    title: '🧮 What are Algebraic Fractions?',
    content: `
      <p>An <strong>algebraic fraction</strong> has letters (variables) in the numerator or denominator.</p>
      <div class="example-box">${fracHTML('3x','5')} &nbsp;&nbsp; ${fracHTML('a²b','4c')}</div>
      <p>We simplify them by cancelling common factors — just like regular fractions!</p>
    `,
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
      </div>
    `,
  },
  {
    title: '✖️ How to Multiply',
    content: `
      <p><strong>Rule:</strong> Multiply tops together, bottoms together, then simplify.</p>
      <div class="example-box">
        ${fracHTML('3x','4')} × ${fracHTML('8','x²')} = ${fracHTML('24x','4x²')} = ${fracHTML('6','x')}
      </div>
      <p>💡 Cancel common factors <em>before</em> multiplying to keep numbers small!</p>
    `,
  },
  {
    title: '➗ How to Divide — KCF',
    content: `
      <p><strong>KCF: Keep · Change · Flip</strong></p>
      <div class="example-box">
        ${fracHTML('4x²','3')} ÷ ${fracHTML('2x','9')}
        = ${fracHTML('4x²','3')} × ${fracHTML('9','2x')}
        = ${fracHTML('36x²','6x')} = 6x
      </div>
      <p>Keep the first, Change ÷ to ×, Flip the second!</p>
    `,
  },
  {
    title: '🔍 Factorise to Simplify',
    content: `
      <p>Sometimes you must <strong>factor</strong> the numerator first:</p>
      <div class="example-box">
        ${fracHTML('x² − 4','x + 2')} = ${fracHTML('(x+2)(x−2)','x+2')} = x − 2
      </div>
      <p>Key patterns:<br>
      • x² − a² = (x+a)(x−a) — Difference of squares<br>
      • x² + bx + c — find two numbers that multiply to c and add to b</p>
    `,
  },
  {
    title: '🎮 How to Play',
    content: `
      <p>• Pick the correct answer from 4 choices.</p>
      <p>• Use <strong>💡 Hint</strong> if stuck — costs 5 points.</p>
      <p>• Read the <strong>solution steps</strong> after each question!</p>
      <p>• Earn ⭐⭐⭐ by scoring 80%+</p>
      <p>• Visit <strong>🎁 Rewards Hub</strong> for side games and shop!</p>
      <div class="example-box">Good luck, Apprentice Wizard! 🧙‍♂️✨</div>
    `,
  },
];

let tutorialPage = 0;

function initTutorial() {
  tutorialPage = 0;
  renderTutorial();
}

function renderTutorial() {
  const container = document.getElementById('tutorial-slides');
  container.innerHTML = tutorialData.map((slide, i) => `
    <div class="tutorial-slide ${i === tutorialPage ? 'active' : ''}">
      <h3>${slide.title}</h3>
      ${slide.content}
    </div>
  `).join('');
  document.getElementById('tutorial-page').textContent =
    `${tutorialPage + 1} / ${tutorialData.length}`;
}

function tutorialPrev() {
  if (tutorialPage > 0) { tutorialPage--; renderTutorial(); }
}

function tutorialNext() {
  if (tutorialPage < tutorialData.length - 1) { tutorialPage++; renderTutorial(); }
}

// ==================== GAME START ====================
function startMode(mode) {
  State.mode = mode;
  State.score = 0;
  State.lives = 3;
  State.hintUsed = false;
  State.hintUsedThisLevel = false;
  State.selectedMCQ = null;
  State.duelTurn = 0;
  clearInterval(State.speedTimer);

  document.getElementById('hud-timer').style.display = 'none';
  document.getElementById('hud-timer').style.color = '';
  if (document.getElementById('streak-display')) {
    document.getElementById('streak-display').style.display = 'none';
  }

  if (mode === 'quest') {
    State.level = parseInt(localStorage.getItem('fractoquest_level') || '1');
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
  } else if (mode === 'duel') {
    State.level = 2;
    State.learnMode = false;
    loadLevel(2);
  }

  showScreen('screen-game');
}

function loadLevel(level, learnMode = false) {
  const bankKey = `level${level}`;
  const bank = QuestionBanks[bankKey] || QuestionBanks.level1;
  State.questions = shuffle([...bank]);
  State.questionIndex = 0;
  State.learnMode = learnMode;
  State.level = level;
  updateHUD();
  loadQuestion();
}

function loadSpeedRun() {
  const all = [
    ...QuestionBanks.level1,
    ...QuestionBanks.level2,
    ...QuestionBanks.level3,
    ...QuestionBanks.level4,
  ];
  State.questions = shuffle(all);
  State.questionIndex = 0;
  updateHUD();

  document.getElementById('hud-timer').style.display = 'flex';
  document.getElementById('timer-val').textContent = '60';

  clearInterval(State.speedTimer);
  State.speedTimer = setInterval(() => {
    State.timeLeft--;
    document.getElementById('timer-val').textContent = State.timeLeft;
    if (State.timeLeft <= 10) {
      document.getElementById('hud-timer').style.color = '#ef4444';
    }
    if (State.timeLeft <= 0) {
      clearInterval(State.speedTimer);
      endSpeedRun();
    }
  }, 1000);

  loadQuestion();
}

// ==================== QUESTION LOADING ====================
function loadQuestion() {
  if (State.questionIndex >= State.questions.length) {
    if (State.mode === 'speedrun') {
      const all = [
        ...QuestionBanks.level1,
        ...QuestionBanks.level2,
        ...QuestionBanks.level3,
        ...QuestionBanks.level4,
      ];
      State.questions = shuffle(all);
      State.questionIndex = 0;
    } else {
      showLevelComplete();
      return;
    }
  }

  const q = State.questions[State.questionIndex];
  State.currentQ = q;
  State.selectedMCQ = null;
  State.hintUsed = false;

  document.getElementById('question-label').textContent = q.label;
  document.getElementById('question-display').innerHTML = q.display;
  document.getElementById('step-hint').style.display = 'none';
  document.getElementById('step-hint').innerHTML = '';
  document.getElementById('speech-bubble').style.display = 'none';
  document.getElementById('feedback-overlay').style.display = 'none';
  document.getElementById('btn-hint').disabled = false;
  document.getElementById('btn-check').style.display = 'none';
  document.getElementById('wizard-sprite').className = 'wizard-sprite';

  // Set wizard emoji from shop
  const savedEmoji = localStorage.getItem('fq_wizard_emoji') || '🧙‍♂️';
  document.getElementById('wizard-sprite').textContent = savedEmoji;

  if (State.mode === 'duel') {
    document.getElementById('hud-level').textContent =
      `Player ${State.duelTurn + 1}'s Turn`;
  }

  document.getElementById('question-number').textContent =
    State.mode === 'speedrun'
      ? `Q ${State.questionIndex + 1}`
      : `Q ${State.questionIndex + 1} / ${State.questions.length}`;

  const pct = (State.questionIndex / State.questions.length) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';

  buildMCQ(q);
}

function buildMCQ(q) {
  const area = document.getElementById('answer-area');
  const opts = q.options.map((opt, i) => ({ ...opt, originalIndex: i }));
  const shuffled = shuffle(opts);

  area.innerHTML = `<div class="mcq-grid">
    ${shuffled.map(opt => `
      <div class="mcq-option" data-index="${opt.originalIndex}"
           onclick="selectMCQ(${opt.originalIndex}, this)">
        ${opt.html}
      </div>
    `).join('')}
  </div>`;
}

function selectMCQ(index, el) {
  document.querySelectorAll('.mcq-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  State.selectedMCQ = index;
  document.getElementById('btn-check').style.display = 'inline-block';

  if (State.learnMode && !State.hintUsed) {
    showHint(true);
  }
}

// ==================== ANSWER CHECKING ====================
function checkAnswer() {
  const q = State.currentQ;
  if (State.selectedMCQ === null) return;

  const isCorrect = (State.selectedMCQ === q.correctIndex);

  document.querySelectorAll('.mcq-option').forEach(o => {
    const idx = parseInt(o.getAttribute('data-index'));
    if (idx === q.correctIndex) o.classList.add('correct');
    else if (idx === State.selectedMCQ && !isCorrect) o.classList.add('wrong');
    o.style.pointerEvents = 'none';
  });

  if (isCorrect) handleCorrect(q);
  else handleWrong(q);
}

function handleCorrect(q) {
  // Check for double coins scroll
  const doubleCoins = localStorage.getItem('fq_double_coins') === '1';

  const pts = State.hintUsed ? Math.floor(q.points * 0.5) : q.points;
  State.score += pts;

  animateWizard('cast');
  spawnSparkles();
  showSpeechBubble(getCorrectPhrase());
  showFeedback(true, `+${pts} points! ✨`, q.explanationHTML);
  updateHUD();

  // Fire event for rewards system
  fireGameEvent('fq:correct', { type: q.type, points: pts, double: doubleCoins });
}

function handleWrong(q) {
  // Check shield
  if (localStorage.getItem('fq_shield') === '1') {
    localStorage.removeItem('fq_shield');
    showToast('🛡️ Golden Shield blocked that! Life saved!');
    animateWizard('oops');
    showFeedback(false, '🛡️ Shielded! Study the solution:', q.explanationHTML);
    document.getElementById('feedback-msg').style.color = 'var(--secondary)';
    updateHUD();
    fireGameEvent('fq:shielded', {});
    return;
  }

  State.lives = Math.max(0, State.lives - 1);
  animateWizard('oops');
  document.getElementById('question-card').classList.add('shake');
  setTimeout(() => document.getElementById('question-card').classList.remove('shake'), 400);
  showSpeechBubble('Oops! 😅 Study the steps!');
  showFeedback(false, 'Not quite — study the solution! 📚', q.explanationHTML);
  updateHUD();

  fireGameEvent('fq:wrong', { type: q.type });

  if (State.lives <= 0 && State.mode !== 'speedrun' && State.mode !== 'learn') {
    setTimeout(gameOver, 2000);
  }
}

function showFeedback(correct, msg, explanationHTML) {
  document.getElementById('feedback-emoji').textContent =
    correct ? getCorrectEmoji() : '😬';
  document.getElementById('feedback-msg').textContent = msg;
  document.getElementById('feedback-msg').style.color =
    correct ? 'var(--success)' : 'var(--danger)';
  document.getElementById('feedback-explanation').innerHTML = explanationHTML;
  document.getElementById('feedback-overlay').style.display = 'flex';
}

function nextQuestion() {
  document.getElementById('feedback-overlay').style.display = 'none';
  if (State.mode === 'duel') {
    State.duelTurn = (State.duelTurn + 1) % 2;
  }
  State.questionIndex++;
  loadQuestion();
}

// ==================== HINTS ====================
function showHint(free = false) {
  const q = State.currentQ;
  if (!free) {
    State.hintUsed = true;
    State.hintUsedThisLevel = true;
    document.getElementById('btn-hint').disabled = true;
  }
  const hintEl = document.getElementById('step-hint');
  hintEl.innerHTML = getHintForType(q.type);
  hintEl.style.display = 'block';
}

function getHintForType(type) {
  const hints = {
    simplify:
      '💡 <strong>Split into numbers and variables separately.</strong> Divide numbers by GCF. Subtract powers (top − bottom).',
    multiply:
      '💡 <strong>Multiply tops together, bottoms together.</strong> Then simplify numbers (÷ GCF) and variables (subtract powers).',
    divide:
      '💡 <strong>KCF:</strong> Keep 1st fraction → Change ÷ to × → Flip 2nd fraction. Then multiply!',
    'factor-simplify':
      '💡 <strong>Factorise the numerator first!</strong> Look for: common factor, x²−a²=(x+a)(x−a), or two brackets.',
    mixed:
      '💡 <strong>Work left to right.</strong> For ÷, use KCF first. Simplify after each step.',
  };
  return hints[type] || '💡 Look for common factors to cancel!';
}

// ==================== HUD ====================
function updateHUD() {
  document.getElementById('hud-score').textContent = State.score;
  if (State.mode !== 'duel') {
    document.getElementById('hud-level').textContent =
      State.mode === 'speedrun' ? 'Speed Run' :
      State.level === 'Daily'   ? '📅 Daily'  : `Level ${State.level}`;
  }
  const hearts = [0, 1, 2].map(i => i < State.lives ? '❤️' : '🖤').join('');
  document.getElementById('hud-lives').textContent = hearts;

  if (typeof Rewards !== 'undefined') Rewards.updateCoinDisplays();
}

// ==================== LEVEL COMPLETE ====================
function showLevelComplete() {
  clearInterval(State.speedTimer);

  const total = State.questions.reduce((s, q) => s + q.points, 0);
  const pct   = total > 0 ? Math.round((State.score / total) * 100) : 0;
  const stars  = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;

  if (State.mode === 'quest') {
    const key   = `fractoquest_stars_${State.level}`;
    const saved = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, Math.max(saved, stars));

    const nextLv   = State.level + 1;
    const savedLv  = parseInt(localStorage.getItem('fractoquest_level') || '1');
    if (nextLv <= 6 && nextLv > savedLv) {
      localStorage.setItem('fractoquest_level', nextLv);
    }

    if (typeof BadgeSystem !== 'undefined') {
      BadgeSystem.recordLevelComplete(State.hintUsedThisLevel);
    }
  }

  if (State.mode === 'speedrun') {
    const best = parseInt(localStorage.getItem('fractoquest_speed_best') || '0');
    if (State.score > best) {
      localStorage.setItem('fractoquest_speed_best', State.score);
    }
    saveHighScore(State.score);
  }

  // Daily challenge check
  if (typeof DailyChallenge !== 'undefined' && !DailyChallenge.isDoneToday()) {
    if (State.mode === 'quest' || State.level === 'Daily') {
      DailyChallenge.complete(State.score);
    }
  }

  document.getElementById('complete-emoji').textContent =
    stars === 3 ? '🏆' : stars === 2 ? '🌟' : '✨';
  document.getElementById('complete-title').textContent =
    State.mode === 'speedrun' ? "Time's Up!" : 'Level Complete!';
  document.getElementById('star-rating').textContent =
    '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  document.getElementById('complete-stats').innerHTML = `
    Score: <strong>${State.score}</strong><br>
    Accuracy: <strong>${pct}%</strong>
    ${State.mode === 'speedrun'
      ? `<br>Questions done: <strong>${State.questionIndex}</strong>` : ''}
  `;

  const nextBtn = document.getElementById('btn-next-level');
  nextBtn.style.display =
    (State.mode === 'speedrun' || State.mode === 'learn' ||
     State.level === 'Daily' || State.level >= 6)
      ? 'none' : 'inline-block';

  fireGameEvent('fq:levelcomplete', { level: State.level, score: State.score });

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
  document.getElementById('complete-emoji').textContent = '💀';
  document.getElementById('complete-title').textContent = 'Game Over!';
  document.getElementById('star-rating').textContent = '☆☆☆';
  document.getElementById('complete-stats').innerHTML = `
    Score: <strong>${State.score}</strong><br>
    Keep practicing — you'll get it! 💪
  `;
  document.getElementById('btn-next-level').style.display = 'none';
  showScreen('screen-level-complete');
}

function confirmQuit() {
  clearInterval(State.speedTimer);
  if (confirm('Quit current game?')) showScreen('screen-mode');
}

function endSpeedRun() {
  showLevelComplete();
}

// ==================== HIGH SCORES ====================
function saveHighScore(score) {
  let scores = JSON.parse(localStorage.getItem('fractoquest_scores') || '[]');
  scores.push({ score, date: new Date().toLocaleDateString() });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 10);
  localStorage.setItem('fractoquest_scores', JSON.stringify(scores));
}

function renderScores() {
  const scores = JSON.parse(localStorage.getItem('fractoquest_scores') || '[]');
  const medals = ['🥇', '🥈', '🥉'];
  const el = document.getElementById('scores-list');
  if (scores.length === 0) {
    el.innerHTML = '<p style="text-align:center;color:var(--text-dim);padding:40px">No scores yet! Play Speed Run to set a record! 🚀</p>';
    return;
  }
  el.innerHTML = scores.map((s, i) => `
    <div class="score-item">
      <span class="score-rank">${medals[i] || (i + 1) + '.'}</span>
      <span class="score-name">Speed Run — ${s.date}</span>
      <span class="score-val">⭐ ${s.score}</span>
    </div>
  `).join('');
}

function clearScores() {
  if (confirm('Clear all high scores?')) {
    localStorage.removeItem('fractoquest_scores');
    renderScores();
  }
}

// ==================== DAILY CHALLENGE ====================
function startDailyChallenge() {
  if (typeof DailyChallenge === 'undefined') return;
  const q = DailyChallenge.getChallenge();
  State.mode   = 'quest';
  State.score  = 0;
  State.lives  = 3;
  State.questions    = [q];
  State.questionIndex = 0;
  State.currentQ     = null;
  State.learnMode    = false;
  State.level        = 'Daily';
  updateHUD();
  loadQuestion();
  showScreen('screen-game');
}

function updateDailyStatus() {
  const el = document.getElementById('daily-status');
  if (el && typeof DailyChallenge !== 'undefined') {
    el.textContent = DailyChallenge.isDoneToday()
      ? '✅ Done! Come back tomorrow'
      : '+25 🪙 bonus available!';
  }
  if (typeof Rewards !== 'undefined') Rewards.updateCoinDisplays();
}

// ==================== PANEL HELPER ====================
function showPanel(id) {
  document.querySelectorAll('.reward-panel').forEach(p => p.style.display = 'none');
  if (id) document.getElementById(id).style.display = 'block';
}

// ==================== ANIMATIONS ====================
function animateWizard(type) {
  const wiz = document.getElementById('wizard-sprite');
  wiz.className = 'wizard-sprite ' + type;
}

function spawnSparkles() {
  const emojis = ['✨', '⭐', '🌟', '💫', '🔮'];
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'sparkle';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = (20 + Math.random() * 60) + 'vw';
      el.style.top  = (20 + Math.random() * 40) + 'vh';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }, i * 100);
  }
}

function showSpeechBubble(text) {
  const b = document.getElementById('speech-bubble');
  b.textContent = text;
  b.style.display = 'block';
  setTimeout(() => { b.style.display = 'none'; }, 2500);
}

function getCorrectEmoji() {
  return ['🎉','🌟','🔥','💯','⚡','🏆','✨'][Math.floor(Math.random() * 7)];
}

function getCorrectPhrase() {
  return ['Spell cast! ✨','Brilliant! 🌟','Power unlocked! ⚡',
          'Perfect! 💯','Wizard move! 🔮','Excellent! 🎉'][Math.floor(Math.random() * 6)];
}

// ==================== EVENT BUS ====================
function fireGameEvent(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast show';
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  showScreen('screen-home');
});