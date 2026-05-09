/* =============================================
   FRACTOQUEST — Main Game Logic
   ============================================= */

// ==================== STATE ====================
const State = {
  mode: 'quest',
  level: 1,
  score: 0,
  lives: 3,
  hintUsed: false,
  questionIndex: 0,
  questions: [],
  speedTimer: null,
  timeLeft: 60,
  selectedMCQ: null,
  currentQ: null,
  learnMode: false,
};

// ==================== EVENT HELPER ====================
// Fires events so rewards.js can listen without direct dependency
function fireGameEvent(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

// ==================== SCREEN MANAGEMENT ====================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  if (id === 'screen-home') updateHomeStats();
  if (id === 'screen-scores') renderScores();
  if (id === 'screen-tutorial') initTutorial();
  if (id === 'screen-mode') updateModeScreen();
}

function updateHomeStats() {
  const stars = parseInt(localStorage.getItem('fq_total_stars') || '0');
  document.getElementById('total-stars-home').textContent = stars;
  if (typeof Rewards !== 'undefined') Rewards.updateCoinDisplays();
}

function updateModeScreen() {
  const lv = localStorage.getItem('fq_level') || '1';
  document.getElementById('quest-progress').textContent = `Level ${lv}`;
  const best = localStorage.getItem('fq_speed_best') || '--';
  document.getElementById('speed-best').textContent = `Best: ${best}`;
  if (typeof Rewards !== 'undefined') Rewards.updateCoinDisplays();
}

// ==================== TUTORIAL ====================
const tutorialData = [
  {
    title: '🧮 What are Algebraic Fractions?',
    content: `<p>An <strong>algebraic fraction</strong> has letters in the numerator or denominator.</p>
      <div class="example-box">${fracHTML('3x', '5')} &nbsp;&nbsp; ${fracHTML('a²b', '4c')}</div>
      <p>We simplify them by cancelling common factors!</p>`,
  },
  {
    title: '✂️ How to Simplify',
    content: `<p><strong>Rule:</strong> Divide top and bottom by common factors.</p>
      <div class="example-box">${fracHTML('6x²', '9x')} = ${fracHTML('2x', '3')}</div>
      <p>Numbers: 6/9 → 2/3. Variables: x²/x → x.</p>`,
  },
  {
    title: '✖️ How to Multiply',
    content: `<p><strong>Rule:</strong> Multiply tops × tops, bottoms × bottoms, then simplify.</p>
      <div class="example-box">${fracHTML('3x','4')} × ${fracHTML('8','x²')} = ${fracHTML('24x','4x²')} = ${fracHTML('6','x')}</div>`,
  },
  {
    title: '➗ How to Divide — KCF',
    content: `<p><strong>KCF: Keep · Change · Flip</strong></p>
      <div class="example-box">${fracHTML('4x²','3')} ÷ ${fracHTML('2x','9')} = ${fracHTML('4x²','3')} × ${fracHTML('9','2x')} = 6x</div>`,
  },
  {
    title: '🔍 Factorise to Simplify',
    content: `<p>Sometimes you must <strong>factor</strong> first:</p>
      <div class="example-box">${fracHTML('x² − 4', 'x + 2')} = ${fracHTML('(x+2)(x−2)', 'x+2')} = x − 2</div>`,
  },
  {
    title: '🎮 How to Play',
    content: `<p>• Pick the correct answer from 4 choices.<br>
      • Use 💡 Hint if stuck (costs points).<br>
      • Read the solution steps after each question!<br>
      • Try the new ⚔️ Battle Duel mode!</p>`,
  },
];
let tutorialPage = 0;

function initTutorial() { tutorialPage = 0; renderTutorial(); }
function renderTutorial() {
  const c = document.getElementById('tutorial-slides');
  c.innerHTML = tutorialData.map((s, i) => `
    <div class="tutorial-slide ${i === tutorialPage ? 'active' : ''}">
      <h3>${s.title}</h3>${s.content}
    </div>`).join('');
  document.getElementById('tutorial-page').textContent = `${tutorialPage + 1} / ${tutorialData.length}`;
}
function tutorialPrev() { if (tutorialPage > 0) { tutorialPage--; renderTutorial(); } }
function tutorialNext() { if (tutorialPage < tutorialData.length - 1) { tutorialPage++; renderTutorial(); } }

// ==================== GAME START ====================
function startMode(mode) {
  State.mode = mode;
  State.score = 0;
  State.lives = 3;
  State.hintUsed = false;
  State.selectedMCQ = null;
  clearInterval(State.speedTimer);

  document.getElementById('hud-timer').style.display = 'none';
  document.getElementById('hud-timer').style.color = '';

  if (mode === 'quest') {
    State.level = parseInt(localStorage.getItem('fq_level') || '1');
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
}

function loadLevel(level, learnMode = false) {
  const bank = QuestionBanks[`level${level}`] || QuestionBanks.level1;
  State.questions = shuffle([...bank]);
  State.questionIndex = 0;
  State.learnMode = learnMode;
  State.level = level;
  updateHUD();
  loadQuestion();
}

function loadSpeedRun() {
  State.questions = shuffle(getAllQuestions());
  State.questionIndex = 0;
  updateHUD();
  document.getElementById('hud-timer').style.display = 'flex';
  document.getElementById('timer-val').textContent = '60';
  State.speedTimer = setInterval(() => {
    State.timeLeft--;
    document.getElementById('timer-val').textContent = State.timeLeft;
    if (State.timeLeft <= 10) document.getElementById('hud-timer').style.color = '#ef4444';
    if (State.timeLeft <= 0) { clearInterval(State.speedTimer); endSpeedRun(); }
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
  document.getElementById('question-number').textContent =
    State.mode === 'speedrun' ? `Q ${State.questionIndex + 1}` : `Q ${State.questionIndex + 1} / ${State.questions.length}`;

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
      <div class="mcq-option" data-index="${opt.originalIndex}" onclick="selectMCQ(${opt.originalIndex}, this)">
        ${opt.html}
      </div>`).join('')}
  </div>`;
}

function selectMCQ(index, el) {
  document.querySelectorAll('.mcq-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  State.selectedMCQ = index;
  document.getElementById('btn-check').style.display = 'inline-block';
  if (State.learnMode && !State.hintUsed) showHint(true);
}

function checkAnswer() {
  if (State.selectedMCQ === null) return;
  const q = State.currentQ;
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
  const pts = State.hintUsed ? Math.floor(q.points * 0.5) : q.points;
  State.score += pts;
  animateWizard('cast');
  spawnSparkles();
  showSpeechBubble(getCorrectPhrase());
  showFeedback(true, `+${pts} points! ✨`, q.explanationHTML);
  updateHUD();
  fireGameEvent('fq:correct', { type: q.type, points: q.points });
}

function handleWrong(q) {
  // Check for Shield item
  if (localStorage.getItem('fq_shield') === '1') {
    localStorage.removeItem('fq_shield');
    showToast('🛡️ Golden Shield blocked that! Life saved!');
    animateWizard('oops');
    showFeedback(false, '🛡️ Shielded! Check the solution:', q.explanationHTML);
    updateHUD();
    return; // Don't lose life, don't break streak
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
  document.getElementById('feedback-emoji').textContent = correct ? getCorrectEmoji() : '😬';
  document.getElementById('feedback-msg').textContent = msg;
  document.getElementById('feedback-msg').style.color = correct ? 'var(--success)' : 'var(--danger)';
  document.getElementById('feedback-explanation').innerHTML = explanationHTML;
  document.getElementById('feedback-overlay').style.display = 'flex';
}

function nextQuestion() {
  document.getElementById('feedback-overlay').style.display = 'none';
  State.questionIndex++;
  loadQuestion();
}

// ==================== HINTS ====================
function showHint(free = false) {
  if (!free) {
    State.hintUsed = true;
    document.getElementById('btn-hint').disabled = true;
    fireGameEvent('fq:hintUsed');
  }
  const hintEl = document.getElementById('step-hint');
  hintEl.innerHTML = getHintForType(State.currentQ.type);
  hintEl.style.display = 'block';
}

function getHintForType(type) {
  const hints = {
    simplify: '💡 <strong>Split into number & variable parts.</strong> Divide numbers by GCF. Subtract powers for variables.',
    multiply: '💡 <strong>Multiply tops × tops, bottoms × bottoms.</strong> Then simplify.',
    divide: '💡 <strong>KCF:</strong> Keep 1st → Change ÷ to × → Flip 2nd. Then multiply!',
    'factor-simplify': '💡 <strong>Factorise the numerator first!</strong> Look for common factors or difference of squares.',
    mixed: '💡 <strong>Work left to right.</strong> For ÷, use KCF. Simplify step-by-step.',
  };
  return hints[type] || '💡 Look for common factors to cancel!';
}

// ==================== HUD & END GAME ====================
function updateHUD() {
  document.getElementById('hud-score').textContent = State.score;
  document.getElementById('hud-level').textContent = State.mode === 'speedrun' ? 'Speed Run' : `Level ${State.level}`;
  const hearts = [0, 1, 2].map(i => i < State.lives ? '❤️' : '🖤').join('');
  document.getElementById('hud-lives').textContent = hearts;
}

function showLevelComplete() {
  clearInterval(State.speedTimer);
  const total = State.questions.reduce((s, q) => s + q.points, 0);
  const pct = total > 0 ? Math.round((State.score / total) * 100) : 0;
  const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;

  if (State.mode === 'quest') {
    const key = `fq_stars_${State.level}`;
    const saved = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, Math.max(saved, stars));
    let totalStars = 0;
    for (let i = 1; i <= 6; i++) totalStars += parseInt(localStorage.getItem(`fq_stars_${i}`) || '0');
    localStorage.setItem('fq_total_stars', totalStars);
    if (State.level < 6) {
      const nextLv = State.level + 1;
      const savedLv = parseInt(localStorage.getItem('fq_level') || '1');
      if (nextLv > savedLv) localStorage.setItem('fq_level', nextLv);
    }
  }

  if (State.mode === 'speedrun') {
    const best = parseInt(localStorage.getItem('fq_speed_best') || '0');
    if (State.score > best) localStorage.setItem('fq_speed_best', State.score);
    saveHighScore(State.score);
  }

  document.getElementById('complete-emoji').textContent = stars === 3 ? '🏆' : stars === 2 ? '🌟' : '✨';
  document.getElementById('complete-title').textContent = State.mode === 'speedrun' ? "Time's Up!" : 'Level Complete!';
  document.getElementById('star-rating').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  document.getElementById('complete-stats').innerHTML = `Score: <strong>${State.score}</strong><br>Accuracy: <strong>${pct}%</strong>`;
  document.getElementById('complete-coins').innerHTML = ''; // Handled by rewards.js listener
  document.getElementById('btn-next-level').style.display =
    (State.mode === 'speedrun' || State.mode === 'learn' || State.level >= 6) ? 'none' : 'inline-block';

  fireGameEvent('fq:levelcomplete', { level: State.level, score: State.score, mode: State.mode });
  showScreen('screen-level-complete');
}

function nextLevel() {
  if (State.level >= 6) return;
  State.level++;
  State.score = 0;
  State.lives = 3;
  loadLevel(State.level, State.learnMode);
  showScreen('screen-game');
}

function gameOver() {
  document.getElementById('complete-emoji').textContent = '💀';
  document.getElementById('complete-title').textContent = 'Game Over!';
  document.getElementById('star-rating').textContent = '☆☆☆';
  document.getElementById('complete-stats').innerHTML = `Score: <strong>${State.score}</strong><br>Keep practicing! 💪`;
  document.getElementById('btn-next-level').style.display = 'none';
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
  const el = document.getElementById('scores-list');
  if (!scores.length) { el.innerHTML = '<p style="text-align:center;color:var(--text-dim);padding:40px">No scores yet!</p>'; return; }
  const medals = ['🥇', '🥈', '🥉'];
  el.innerHTML = scores.map((s, i) => `
    <div class="score-item">
      <span class="score-rank">${medals[i] || (i + 1) + '.'}</span>
      <span class="score-name">Speed Run — ${s.date}</span>
      <span class="score-val">⭐ ${s.score}</span>
    </div>`).join('');
}
function clearScores() {
  if (confirm('Clear all high scores?')) { localStorage.removeItem('fq_scores'); renderScores(); }
}

// ==================== ANIMATIONS ====================
function animateWizard(type) { document.getElementById('wizard-sprite').className = 'wizard-sprite ' + type; }
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
  b.textContent = text; b.style.display = 'block';
  setTimeout(() => { b.style.display = 'none'; }, 2500);
}
function getCorrectEmoji() { return ['🎉','🌟','🔥','💯','⚡','🏆','✨'][Math.floor(Math.random() * 7)]; }
function getCorrectPhrase() { return ['Spell cast! ✨','Brilliant! 🌟','Power unlocked! ⚡','Perfect! 💯','Wizard move! 🔮'][Math.floor(Math.random() * 5)]; }

// ==================== REWARDS HUB HELPERS ====================
function showPanel(id) {
  document.querySelectorAll('.reward-panel').forEach(p => p.style.display = 'none');
  if (id) document.getElementById(id).style.display = 'block';
}
function handleDailyChallenge() {
  if (typeof DailyChallenge !== 'undefined' && DailyChallenge.isDoneToday()) {
    showToast('✅ Daily done! Come back tomorrow!');
  } else {
    startDailyChallenge();
  }
}
function startDailyChallenge() {
  if (typeof DailyChallenge === 'undefined') return;
  const q = DailyChallenge.getChallenge();
  State.mode = 'quest'; State.score = 0; State.lives = 3;
  State.questions = [q]; State.questionIndex = 0; State.learnMode = false; State.level = 'Daily';
  updateHUD(); loadQuestion(); showScreen('screen-game');
}
function updateDailyStatus() {
  const el = document.getElementById('daily-status');
  if (el && typeof DailyChallenge !== 'undefined') {
    el.textContent = DailyChallenge.isDoneToday() ? '✅ Done today!' : '+25 🪙 bonus available!';
  }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  showScreen('screen-home');
});