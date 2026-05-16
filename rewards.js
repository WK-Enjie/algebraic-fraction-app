/* =============================================
   FRACTOQUEST — Meaningful Rewards System
   ============================================= */

// ==================== COIN SYSTEM ====================
const Rewards = {

  getCoins() {
    return parseInt(localStorage.getItem('fq_coins') || '50'); // Start with 50 coins
  },

  addCoins(amount) {
    const newTotal = this.getCoins() + amount;
    localStorage.setItem('fq_coins', newTotal);
    this.floatCoinText(`+${amount} 🪙`);
    this.updateCoinDisplays();
    return newTotal;
  },

  spendCoins(amount) {
    const current = this.getCoins();
    if (current < amount) return false;
    localStorage.setItem('fq_coins', current - amount);
    this.updateCoinDisplays();
    return true;
  },

  updateCoinDisplays() {
    const coins = this.getCoins();
    document.querySelectorAll('.coin-display').forEach(el => {
      el.textContent = `🪙 ${coins}`;
    });
  },

  floatCoinText(text) {
    const el = document.createElement('div');
    el.className = 'float-coin';
    el.textContent = text;
    el.style.left = (30 + Math.random() * 40) + 'vw';
    el.style.top  = '40vh';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  },

  // Award coins after correct answer
  awardFromAnswer(points, streakCount) {
    let coins = Math.floor(points / 5);
    if (streakCount >= 3)  coins += 2;
    if (streakCount >= 5)  coins += 3;
    if (streakCount >= 10) coins += 5;
    if (localStorage.getItem('fq_double_coins') === '1') coins *= 2;
    this.addCoins(coins);
    MissionSystem.recordEvent('answer_correct');
    return coins;
  },
};

// ==================== POWER-UPS (Real Gameplay Help) ====================
// These are bought with coins and used DURING gameplay

const PowerUps = {

  items: [
    {
      id:      'extra_life',
      name:    'Extra Life',
      desc:    'Restore 1 heart right now',
      icon:    '❤️',
      price:   15,
      howHelps:'Get back a lost life instantly during a level',
      useFn:   () => PowerUps.useExtraLife(),
    },
    {
      id:      'reveal_answer',
      name:    'Reveal Answer',
      desc:    'Show the correct option (once per question)',
      icon:    '🔍',
      price:   20,
      howHelps:'Highlight the correct MCQ choice without penalty',
      useFn:   () => PowerUps.useReveal(),
    },
    {
      id:      'time_freeze',
      name:    'Time Freeze',
      desc:    '+15 seconds in Speed Run',
      icon:    '⏸️',
      price:   10,
      howHelps:'Freeze the timer for 5 seconds in Speed Run',
      useFn:   () => PowerUps.useTimeFreeze(),
    },
    {
      id:      'retry_question',
      name:    'Question Retry',
      desc:    'Skip a question without losing a life',
      icon:    '🔄',
      price:   12,
      howHelps:'Pass on a hard question — no life lost',
      useFn:   () => PowerUps.useRetry(),
    },
    {
      id:      'duel_revive',
      name:    'Duel Revival',
      desc:    'Restore 2 HP in a duel battle',
      icon:    '💊',
      price:   18,
      howHelps:'Use mid-duel to restore 2 HP',
      useFn:   () => PowerUps.useDuelRevive(),
    },
    {
      id:      'hint_free',
      name:    'Free Hint Pack',
      desc:    '3 free hints, no point penalty',
      icon:    '💡',
      price:   25,
      howHelps:'Get 3 hints that cost no points',
      useFn:   () => PowerUps.useFreeHints(),
    },
    {
      id:      'double_coins',
      name:    'Coin Booster',
      desc:    '2× coins for your next level',
      icon:    '💰',
      price:   20,
      howHelps:'Double all coins earned in next level',
      useFn:   () => PowerUps.useDoubleCoins(),
    },
    {
      id:      'shield',
      name:    'Life Shield',
      desc:    'Block the next wrong answer',
      icon:    '🛡️',
      price:   22,
      howHelps:'One wrong answer won\'t cost a life',
      useFn:   () => PowerUps.useShield(),
    },
  ],

  getInventory() {
    return JSON.parse(localStorage.getItem('fq_inventory') || '{}');
  },

  saveInventory(inv) {
    localStorage.setItem('fq_inventory', JSON.stringify(inv));
  },

  getCount(id) {
    return this.getInventory()[id] || 0;
  },

  addToInventory(id, qty = 1) {
    const inv = this.getInventory();
    inv[id] = (inv[id] || 0) + qty;
    this.saveInventory(inv);
  },

  removeFromInventory(id) {
    const inv = this.getInventory();
    if ((inv[id] || 0) <= 0) return false;
    inv[id]--;
    this.saveInventory(inv);
    return true;
  },

  buy(id) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    if (!Rewards.spendCoins(item.price)) {
      showShopMsg(`Need ${item.price} 🪙 — earn more by answering questions!`, false);
      return;
    }
    this.addToInventory(id);
    const stats = BadgeSystem.getStats();
    stats.itemsBought++;
    BadgeSystem.saveStats(stats);
    BadgeSystem.checkAll(stats);
    showShopMsg(`${item.icon} ${item.name} added to inventory! ✨`, true);
    this.renderShop();
    this.renderInventoryBar();
  },

  // ── USE FUNCTIONS ──────────────────────────────

  useExtraLife() {
    if (!this.removeFromInventory('extra_life')) { showToast('No Extra Lives!'); return; }
    if (typeof State !== 'undefined' && State.lives < 3) {
      State.lives = Math.min(3, State.lives + 1);
      if (typeof updateHUD === 'function') updateHUD();
      showToast('❤️ Life restored!');
      this.renderInventoryBar();
    } else {
      showToast('Already at full health!');
      this.addToInventory('extra_life'); // refund
    }
  },

  useReveal() {
    if (!this.removeFromInventory('reveal_answer')) { showToast('No Reveals left!'); return; }
    // Highlight correct option
    if (typeof State !== 'undefined' && State.currentQ) {
      const correct = State.currentQ.correctIndex;
      document.querySelectorAll('.mcq-option').forEach(o => {
        if (parseInt(o.getAttribute('data-index')) === correct) {
          o.style.boxShadow = '0 0 0 3px #10b981';
          o.style.borderColor = 'var(--success)';
        }
      });
      showToast('🔍 Correct answer highlighted!');
    }
    this.renderInventoryBar();
  },

  useTimeFreeze() {
    if (!this.removeFromInventory('time_freeze')) { showToast('No Time Freezes!'); return; }
    if (typeof State !== 'undefined' && State.mode === 'speedrun') {
      State.timeLeft = Math.min(60, State.timeLeft + 15);
      document.getElementById('timer-val').textContent = State.timeLeft;
      showToast('⏸️ +15 seconds added!');
    } else {
      showToast('Only usable in Speed Run!');
      this.addToInventory('time_freeze'); // refund
    }
    this.renderInventoryBar();
  },

  useRetry() {
    if (!this.removeFromInventory('retry_question')) { showToast('No Retries!'); return; }
    if (typeof nextQuestion === 'function') {
      showToast('🔄 Question skipped — no life lost!');
      nextQuestion();
    }
    this.renderInventoryBar();
  },

  useDuelRevive() {
    if (!this.removeFromInventory('duel_revive')) { showToast('No Revivals!'); return; }
    if (typeof DuelState !== 'undefined') {
      const actor = DuelState[DuelState.turn];
      actor.hp = Math.min(actor.maxHp, actor.hp + 2);
      if (typeof updateDuelHUD === 'function') updateDuelHUD();
      showToast(`💊 ${actor.name} restored 2 HP!`);
    } else {
      showToast('Only usable in a Duel!');
      this.addToInventory('duel_revive');
    }
    this.renderInventoryBar();
  },

  useFreeHints() {
    if (!this.removeFromInventory('hint_free')) { showToast('No Hint Packs!'); return; }
    localStorage.setItem('fq_free_hints', '3');
    showToast('💡 3 free hints activated!');
    this.renderInventoryBar();
  },

  useDoubleCoins() {
    if (!this.removeFromInventory('double_coins')) { showToast('No Boosters!'); return; }
    localStorage.setItem('fq_double_coins', '1');
    showToast('💰 2× coins active for this level!');
    this.renderInventoryBar();
  },

  useShield() {
    if (!this.removeFromInventory('shield')) { showToast('No Shields!'); return; }
    localStorage.setItem('fq_shield', '1');
    showToast('🛡️ Shield active — next wrong answer blocked!');
    this.renderInventoryBar();
  },

  // ── RENDER SHOP ──────────────────────────────────
  renderShop() {
    const container = document.getElementById('shop-items');
    if (!container) return;
    const coins = Rewards.getCoins();
    container.innerHTML = this.items.map(item => {
      const count     = this.getCount(item.id);
      const canAfford = coins >= item.price;
      return `
        <div class="shop-card ${!canAfford ? 'too-costly' : ''}">
          <div class="shop-icon">${item.icon}</div>
          <div class="shop-name">${item.name}</div>
          <div class="shop-desc">${item.desc}</div>
          <div class="shop-how-helps">✅ ${item.howHelps}</div>
          <div class="shop-price">🪙 ${item.price}</div>
          ${count > 0 ? `<div class="shop-stock">In bag: ×${count}</div>` : ''}
          <button class="btn-shop ${!canAfford ? 'btn-cannot-afford' : ''}"
                  onclick="PowerUps.buy('${item.id}')">
            ${canAfford ? `Buy 🪙${item.price}` : `Need ${item.price} 🪙`}
          </button>
        </div>`;
    }).join('');
  },

  // ── INVENTORY BAR (shown during gameplay) ─────────
  renderInventoryBar() {
    const bar = document.getElementById('inventory-bar');
    if (!bar) return;
    const inv = this.getInventory();
    const hasItems = Object.values(inv).some(v => v > 0);

    if (!hasItems) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex';

    bar.innerHTML = this.items
      .filter(item => (inv[item.id] || 0) > 0)
      .map(item => `
        <div class="inv-item" onclick="PowerUps.use_${item.id}() || PowerUps.items.find(i=>i.id==='${item.id}').useFn()"
             title="${item.howHelps}">
          <span class="inv-icon">${item.icon}</span>
          <span class="inv-count">×${inv[item.id]}</span>
        </div>
      `).join('');

    // Re-attach click handlers properly
    bar.querySelectorAll('.inv-item').forEach((el, i) => {
      const itemId = this.items.filter(item => (inv[item.id] || 0) > 0)[i]?.id;
      if (itemId) {
        el.onclick = () => this.items.find(it => it.id === itemId)?.useFn();
      }
    });
  },
};

function showShopMsg(msg, success) {
  const el = document.getElementById('shop-msg');
  if (!el) return;
  el.textContent   = msg;
  el.style.color   = success ? 'var(--success)' : 'var(--danger)';
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, 2500);
}

// ==================== DAILY MISSIONS ====================
// 3 rotating missions per day — quick to complete, real coin rewards

const MissionTemplates = [
  { id: 'correct_3',   text: 'Answer 3 questions correctly',  event: 'answer_correct', need: 3,  reward: 20, icon: '✅' },
  { id: 'correct_5',   text: 'Answer 5 questions correctly',  event: 'answer_correct', need: 5,  reward: 30, icon: '🎯' },
  { id: 'no_hint',     text: 'Answer 3 in a row without hints',event:'streak_no_hint',  need: 3,  reward: 25, icon: '🧠' },
  { id: 'streak_5',    text: 'Get a 5-answer streak',          event: 'streak',         need: 5,  reward: 35, icon: '🔥' },
  { id: 'simplify_3',  text: 'Simplify 3 fractions correctly', event: 'simplify',       need: 3,  reward: 20, icon: '✂️' },
  { id: 'multiply_3',  text: 'Multiply 3 fractions correctly', event: 'multiply',       need: 3,  reward: 20, icon: '✖️' },
  { id: 'divide_3',    text: 'Divide 3 fractions correctly',   event: 'divide',         need: 3,  reward: 20, icon: '➗' },
  { id: 'play_duel',   text: 'Play a Battle Duel',             event: 'duel_played',    need: 1,  reward: 25, icon: '⚔️' },
  { id: 'win_duel',    text: 'Win a Battle Duel',              event: 'duel_won',       need: 1,  reward: 40, icon: '🏆' },
  { id: 'level_done',  text: 'Complete a full level',          event: 'level_complete', need: 1,  reward: 30, icon: '⭐' },
  { id: 'speedrun',    text: 'Score 50+ in Speed Run',         event: 'speedrun_score', need: 50, reward: 35, icon: '⏱️' },
  { id: 'brew_potion', text: 'Brew a potion successfully',     event: 'potion_brewed',  need: 1,  reward: 20, icon: '🧪' },
];

const MissionSystem = {

  getTodayKey() {
    return new Date().toDateString();
  },

  getMissions() {
    const saved = JSON.parse(localStorage.getItem('fq_missions') || 'null');
    if (saved && saved.date === this.getTodayKey()) return saved.missions;

    // Generate 3 missions for today based on day seed
    const seed = Math.floor(Date.now() / 86400000);
    const pool = [...MissionTemplates];
    const picked = [];
    for (let i = 0; i < 3; i++) {
      const idx = (seed + i * 7) % pool.length;
      picked.push({ ...pool[idx], progress: 0, done: false, claimed: false });
    }

    const data = { date: this.getTodayKey(), missions: picked };
    localStorage.setItem('fq_missions', JSON.stringify(data));
    return picked;
  },

  saveMissions(missions) {
    localStorage.setItem('fq_missions', JSON.stringify({
      date:     this.getTodayKey(),
      missions,
    }));
  },

  recordEvent(event, value = 1) {
    const missions  = this.getMissions();
    let changed = false;
    missions.forEach(m => {
      if (m.done || m.event !== event) return;
      m.progress = Math.min(m.need, (m.progress || 0) + value);
      if (m.progress >= m.need) {
        m.done = true;
        changed = true;
        this.notifyComplete(m);
      }
    });
    if (changed) this.saveMissions(missions);
    this.renderMissions();
  },

  claimReward(idx) {
    const missions = this.getMissions();
    const m = missions[idx];
    if (!m.done || m.claimed) return;
    m.claimed = true;
    this.saveMissions(missions);
    Rewards.addCoins(m.reward);
    showToast(`${m.icon} Mission complete! +${m.reward} 🪙`);
    this.renderMissions();
  },

  notifyComplete(mission) {
    showToast(`${mission.icon} Mission done: ${mission.text}! Claim your reward!`);
  },

  renderMissions() {
    const container = document.getElementById('mission-list');
    if (!container) return;
    const missions = this.getMissions();
    container.innerHTML = missions.map((m, i) => {
      const pct = Math.min(100, Math.round((m.progress / m.need) * 100));
      return `
        <div class="mission-card ${m.done ? 'mission-done' : ''} ${m.claimed ? 'mission-claimed' : ''}">
          <div class="mission-icon">${m.icon}</div>
          <div class="mission-body">
            <div class="mission-text">${m.text}</div>
            <div class="mission-bar-wrap">
              <div class="mission-bar" style="width:${pct}%"></div>
            </div>
            <div class="mission-progress">${m.progress}/${m.need}</div>
          </div>
          <div class="mission-reward">
            ${m.claimed
              ? '<span class="mission-claimed-label">✅ Done</span>'
              : m.done
              ? `<button class="btn-claim" onclick="MissionSystem.claimReward(${i})">+${m.reward}🪙</button>`
              : `<span class="mission-coins-preview">🪙${m.reward}</span>`
            }
          </div>
        </div>`;
    }).join('');
  },

  allClaimedToday() {
    return this.getMissions().every(m => m.claimed);
  },
};

// ==================== MASTERY TRACKER ====================
// Shows clearly what the student is good/weak at

const MasteryTracker = {

  getStats() {
    return JSON.parse(localStorage.getItem('fq_mastery') || JSON.stringify({
      simplify:  { correct: 0, attempts: 0 },
      multiply:  { correct: 0, attempts: 0 },
      divide:    { correct: 0, attempts: 0 },
      factor:    { correct: 0, attempts: 0 },
      mixed:     { correct: 0, attempts: 0 },
    }));
  },

  saveStats(stats) {
    localStorage.setItem('fq_mastery', JSON.stringify(stats));
  },

  record(type, correct) {
    const map = {
      'simplify': 'simplify',
      'multiply': 'multiply',
      'divide':   'divide',
      'factor-simplify': 'factor',
      'mixed':    'mixed',
    };
    const key = map[type] || 'simplify';
    const stats = this.getStats();
    stats[key].attempts++;
    if (correct) stats[key].correct++;
    this.saveStats(stats);
  },

  getPct(key) {
    const stats = this.getStats();
    const s = stats[key];
    if (!s || s.attempts === 0) return null;
    return Math.round((s.correct / s.attempts) * 100);
  },

  getLabel(pct) {
    if (pct === null)  return { text: 'Not tried', color: '#9d8ec7', emoji: '⬜' };
    if (pct >= 80)     return { text: 'Mastered!',  color: '#10b981', emoji: '🌟' };
    if (pct >= 60)     return { text: 'Good',        color: '#f59e0b', emoji: '👍' };
    if (pct >= 40)     return { text: 'Practice',    color: '#f97316', emoji: '📖' };
    return               { text: 'Needs work',   color: '#ef4444', emoji: '💪' };
  },

  getWeakestTopic() {
    const stats  = this.getStats();
    let worst    = null;
    let worstPct = Infinity;
    Object.keys(stats).forEach(key => {
      const s = stats[key];
      if (s.attempts === 0) return;
      const pct = (s.correct / s.attempts) * 100;
      if (pct < worstPct) { worstPct = pct; worst = key; }
    });
    return worst;
  },

  render() {
    const container = document.getElementById('mastery-cards');
    if (!container) return;

    const topics = [
      { key: 'simplify', label: 'Simplifying',   icon: '✂️' },
      { key: 'multiply', label: 'Multiplying',    icon: '✖️' },
      { key: 'divide',   label: 'Dividing',       icon: '➗' },
      { key: 'factor',   label: 'Factorising',    icon: '🔍' },
      { key: 'mixed',    label: 'Multi-step',     icon: '🔀' },
    ];

    const weak = this.getWeakestTopic();

    container.innerHTML = topics.map(t => {
      const pct   = this.getPct(t.key);
      const lbl   = this.getLabel(pct);
      const stats = this.getStats()[t.key];
      const isWeak = t.key === weak;
      return `
        <div class="mastery-card ${isWeak ? 'mastery-weak' : ''}">
          <div class="mastery-topic-icon">${t.icon}</div>
          <div class="mastery-body">
            <div class="mastery-topic">${t.label} ${isWeak ? '← focus here!' : ''}</div>
            <div class="mastery-bar-wrap">
              <div class="mastery-bar" style="width:${pct ?? 0}%; background:${lbl.color}"></div>
            </div>
            <div class="mastery-label" style="color:${lbl.color}">
              ${lbl.emoji} ${lbl.text} ${pct !== null ? `(${pct}%)` : ''}
            </div>
            ${stats.attempts > 0
              ? `<div class="mastery-detail">${stats.correct}/${stats.attempts} correct</div>`
              : '<div class="mastery-detail">Play to see progress</div>'}
          </div>
          ${isWeak ? `<button class="btn-practice-weak" onclick="practiceWeakTopic('${t.key}')">Practice →</button>` : ''}
        </div>`;
    }).join('');
  },
};

function practiceWeakTopic(key) {
  const map = {
    simplify: 2, multiply: 3, divide: 4, factor: 5, mixed: 6,
  };
  const level = map[key] || 2;
  showToast(`📖 Loading ${key} practice...`);
  document.getElementById('badge-detail-modal').style.display = 'none';
  showPanel(null);

  setTimeout(() => {
    if (typeof startMode !== 'undefined') {
      State.level = level;
      State.learnMode = true;
      startMode('learn');
    }
  }, 500);
}

// ==================== BADGE SYSTEM ====================
const BadgeData = [
  {
    id: 'first_spell',   name: 'First Spell',        icon: '🔮',
    desc: 'Answer your first question correctly',
    condition: (s) => s.totalCorrect >= 1,
    algebra: 'x = correct!',
    unlocks: null,
  },
  {
    id: 'simplifier',    name: 'The Simplifier',     icon: '✂️',
    desc: 'Simplify 10 fractions correctly',
    condition: (s) => s.simplifyCorrect >= 10,
    algebra: 'Mastered: cancel common factors',
    unlocks: 'Harder simplify questions unlocked!',
  },
  {
    id: 'multiplier',    name: 'Multiplication Mage',icon: '✖️',
    desc: 'Multiply 5 fractions correctly',
    condition: (s) => s.multiplyCorrect >= 5,
    algebra: '(a/b)×(c/d) = ac/bd',
    unlocks: null,
  },
  {
    id: 'divider',       name: 'Division Wizard',    icon: '➗',
    desc: 'Divide 5 fractions correctly',
    condition: (s) => s.divideCorrect >= 5,
    algebra: 'Mastered KCF!',
    unlocks: 'Duel spell: ⚡ Lightning unlocked!',
  },
  {
    id: 'factoriser',    name: 'The Factoriser',     icon: '🔍',
    desc: 'Correctly simplify 5 expressions by factorising',
    condition: (s) => s.factorCorrect >= 5,
    algebra: 'x²−a²=(x+a)(x−a)',
    unlocks: 'Duel spell: 🌀 Vortex unlocked!',
  },
  {
    id: 'hot_streak',    name: 'On Fire!',            icon: '🔥',
    desc: 'Get a 5-answer streak',
    condition: (s) => s.bestStreak >= 5,
    algebra: 'Streak × multiplier = bonus coins',
    unlocks: null,
  },
  {
    id: 'grand_streak',  name: 'Unstoppable',         icon: '⚡',
    desc: 'Get a 10-answer streak',
    condition: (s) => s.bestStreak >= 10,
    algebra: '10 correct = fully simplified mastery',
    unlocks: 'Boss Mode unlocked in Quest!',
  },
  {
    id: 'no_hints',      name: 'Pure Instinct',       icon: '🧠',
    desc: 'Complete a full level without hints',
    condition: (s) => s.noHintLevels >= 1,
    algebra: 'Self-sufficient algebraist!',
    unlocks: '+10 bonus coins per no-hint level forever',
  },
  {
    id: 'duel_winner',   name: 'Duel Champion',       icon: '⚔️',
    desc: 'Win 3 Battle Duels',
    condition: (s) => s.duelsWon >= 3,
    algebra: 'Battle mastery = algebraic dominance',
    unlocks: 'Hard CPU opponent unlocked!',
  },
  {
    id: 'potion_master', name: 'Potion Master',       icon: '🧪',
    desc: 'Brew 3 potions',
    condition: (s) => s.potionsBrewed >= 3,
    algebra: 'Linear equations mastered!',
    unlocks: 'Harder potion puzzles unlocked!',
  },
  {
    id: 'realm_master',  name: 'Realm Master',        icon: '👑',
    desc: 'Complete all 6 levels',
    condition: (s) => s.levelsCompleted >= 6,
    algebra: 'Full curriculum mastery achieved!',
    unlocks: '🎓 Algebra Graduate title + 100 bonus coins!',
  },
];

const BadgeSystem = {

  getStats() {
    return JSON.parse(localStorage.getItem('fq_stats') || JSON.stringify({
      totalCorrect:    0,
      simplifyCorrect: 0,
      multiplyCorrect: 0,
      divideCorrect:   0,
      factorCorrect:   0,
      bestStreak:      0,
      currentStreak:   0,
      potionsBrewed:   0,
      chestsOpened:    0,
      forgesBuilt:     0,
      itemsBought:     0,
      duelsWon:        0,
      levelsCompleted: 0,
      noHintLevels:    0,
    }));
  },

  saveStats(s) { localStorage.setItem('fq_stats', JSON.stringify(s)); },
  getEarned()  { return JSON.parse(localStorage.getItem('fq_badges') || '[]'); },

  recordCorrect(type, streakCount) {
    const s = this.getStats();
    s.totalCorrect++;
    s.currentStreak = streakCount;
    if (streakCount > s.bestStreak) s.bestStreak = streakCount;
    if (type === 'simplify')        s.simplifyCorrect++;
    if (type === 'multiply')        s.multiplyCorrect++;
    if (type === 'divide')          s.divideCorrect++;
    if (type === 'factor-simplify') s.factorCorrect++;
    this.saveStats(s);
    MasteryTracker.record(type, true);
    this.checkAll(s);
  },

  recordWrong(type) {
    const s = this.getStats();
    s.currentStreak = 0;
    this.saveStats(s);
    MasteryTracker.record(type, false);
  },

  recordLevelComplete(hintUsed) {
    const s = this.getStats();
    s.levelsCompleted++;
    if (!hintUsed) {
      s.noHintLevels++;
      // Bonus coins for no-hint levels if badge earned
      if (this.getEarned().includes('no_hints')) Rewards.addCoins(10);
    }
    this.saveStats(s);
    this.checkAll(s);
    MissionSystem.recordEvent('level_complete');
  },

  recordDuelWin() {
    const s = this.getStats();
    s.duelsWon++;
    this.saveStats(s);
    this.checkAll(s);
    MissionSystem.recordEvent('duel_won');
    MissionSystem.recordEvent('duel_played');
  },

  recordDuelPlayed() {
    MissionSystem.recordEvent('duel_played');
  },

  checkAll(stats) {
    const earned = this.getEarned();
    BadgeData.forEach(badge => {
      if (!earned.includes(badge.id) && badge.condition(stats)) {
        earned.push(badge.id);
        localStorage.setItem('fq_badges', JSON.stringify(earned));
        this.showBadgePopup(badge);
        Rewards.addCoins(15);
        // Special unlock rewards
        if (badge.id === 'realm_master') Rewards.addCoins(100);
      }
    });
  },

  showBadgePopup(badge) {
    const popup = document.getElementById('badge-popup');
    if (!popup) return;
    document.getElementById('badge-popup-icon').textContent    = badge.icon;
    document.getElementById('badge-popup-name').textContent    = badge.name;
    document.getElementById('badge-popup-desc').textContent    = badge.desc;
    document.getElementById('badge-popup-algebra').textContent = badge.unlocks
      ? `🔓 Unlocks: ${badge.unlocks}` : badge.algebra;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 5000);
  },

  renderCabinet() {
    const earned    = this.getEarned();
    const container = document.getElementById('badge-grid');
    if (!container) return;
    const total = BadgeData.length;
    const count = earned.length;

    // Header with count
    container.innerHTML = `
      <div class="badge-progress-header">
        🏅 ${count}/${total} badges earned
        <div class="badge-progress-bar-wrap">
          <div class="badge-progress-bar" style="width:${Math.round(count/total*100)}%"></div>
        </div>
      </div>
    ` + BadgeData.map(badge => {
      const isEarned = earned.includes(badge.id);
      return `
        <div class="badge-card ${isEarned ? 'earned' : 'locked'}"
             onclick="BadgeSystem.showBadgeDetail('${badge.id}')">
          <div class="badge-icon">${isEarned ? badge.icon : '🔒'}</div>
          <div class="badge-name">${isEarned ? badge.name : '???'}</div>
          ${badge.unlocks && isEarned ? '<div class="badge-unlocked-tag">🔓 Unlocks content</div>' : ''}
        </div>`;
    }).join('');
  },

  showBadgeDetail(id) {
    const badge    = BadgeData.find(b => b.id === id);
    const isEarned = this.getEarned().includes(id);
    const modal    = document.getElementById('badge-detail-modal');
    if (!modal || !badge) return;
    document.getElementById('bd-icon').textContent   = isEarned ? badge.icon : '🔒';
    document.getElementById('bd-name').textContent   = isEarned ? badge.name : 'Locked Badge';
    document.getElementById('bd-desc').textContent   = badge.desc;
    document.getElementById('bd-algebra').innerHTML  = isEarned
      ? `<span class="algebra-tag">${badge.algebra}</span>` : '<span style="color:var(--text-dim)">Complete task to unlock!</span>';
    document.getElementById('bd-status').innerHTML   = isEarned
      ? `✅ Earned! ${badge.unlocks ? `<br><strong>🔓 ${badge.unlocks}</strong>` : ''}`
      : '🔒 Not yet earned';
    modal.style.display = 'flex';
  },
};

// ==================== STREAK TRACKER ====================
const StreakTracker = {
  count: 0,
  hintUsedThisLevel: false,

  increment(type) {
    this.count++;
    BadgeSystem.recordCorrect(type, this.count);
    Rewards.awardFromAnswer(State?.currentQ?.points || 10, this.count);
    MissionSystem.recordEvent('streak', this.count);
    if (!this.hintUsedThisLevel) MissionSystem.recordEvent('streak_no_hint');
    MissionSystem.recordEvent(type);
    this.updateDisplay();
    return this.count;
  },

  reset(type) {
    if (localStorage.getItem('fq_streak_protect') === '1') {
      localStorage.removeItem('fq_streak_protect');
      showToast('🛡️ Shield protected your streak!');
      return;
    }
    this.count = 0;
    BadgeSystem.recordWrong(type);
    this.updateDisplay();
  },

  levelComplete(hintUsed) {
    BadgeSystem.recordLevelComplete(hintUsed || this.hintUsedThisLevel);
    this.hintUsedThisLevel = false;
    localStorage.removeItem('fq_double_coins');
  },

  updateDisplay() {
    const el = document.getElementById('streak-display');
    if (!el) return;
    if (this.count >= 3) {
      el.textContent = `🔥 ${this.count} streak!`;
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  },
};

// ==================== POTION CRAFT ====================
const PotionPuzzles = [
  { equation: '3x = 12',        answer: 4,  options: [3,4,6,9],    potion: '🔵 Blue Potion',   coins: 10,
    steps: ['3x = 12', 'Divide both sides by 3', 'x = <strong>4</strong>'] },
  { equation: '2x + 5 = 13',    answer: 4,  options: [2,3,4,9],    potion: '🔴 Red Potion',    coins: 15,
    steps: ['2x + 5 = 13', 'Subtract 5: 2x = 8', 'x = <strong>4</strong>'] },
  { equation: 'x/4 = 3',        answer: 12, options: [7,8,12,16],  potion: '🟢 Green Potion',  coins: 12,
    steps: ['x/4 = 3', 'Multiply by 4', 'x = <strong>12</strong>'] },
  { equation: '5x − 3 = 17',    answer: 4,  options: [3,4,5,7],    potion: '🟡 Gold Potion',   coins: 20,
    steps: ['5x − 3 = 17', 'Add 3: 5x = 20', 'x = <strong>4</strong>'] },
  { equation: '2(x + 3) = 14',  answer: 4,  options: [2,4,5,7],    potion: '🟣 Purple Potion', coins: 18,
    steps: ['2(x+3)=14', 'Divide by 2: x+3=7', 'x = <strong>4</strong>'] },
  { equation: '3x/2 = 9',       answer: 6,  options: [3,4,6,9],    potion: '⚗️ Elixir',        coins: 25,
    steps: ['3x/2=9', 'Multiply by 2: 3x=18', 'x = <strong>6</strong>'] },
  { equation: '4x + 2 = 3x + 7',answer: 5,  options: [3,4,5,9],    potion: '🌈 Rainbow Brew',  coins: 30,
    steps: ['4x+2=3x+7', 'Subtract 3x: x+2=7', 'x = <strong>5</strong>'] },
  { equation: 'x/3 + 2 = 5',    answer: 9,  options: [6,7,9,11],   potion: '🔮 Crystal Brew',  coins: 22,
    steps: ['x/3+2=5', 'Subtract 2: x/3=3', 'x = <strong>9</strong>'] },
];

const PotionCraft = {
  puzzle: null, attempts: 2,

  open() {
    this.puzzle = PotionPuzzles[Math.floor(Math.random() * PotionPuzzles.length)];
    this.attempts = 2;
    this.render();
    document.getElementById('screen-potion').style.display = 'flex';
    Rewards.updateCoinDisplays();
  },

  close() { document.getElementById('screen-potion').style.display = 'none'; },

  render() {
    const p = this.puzzle;
    document.getElementById('potion-flask').textContent    = p.potion;
    document.getElementById('potion-question').textContent = 'Solve for x:';
    document.getElementById('potion-equation').textContent = p.equation;
    document.getElementById('potion-attempts').textContent = `Attempts: ${'❤️'.repeat(this.attempts)}`;
    document.getElementById('potion-steps').style.display  = 'none';
    document.getElementById('potion-result').innerHTML     = '';
    document.getElementById('potion-options').innerHTML    =
      shuffle([...p.options]).map(o => `<button class="potion-opt" onclick="PotionCraft.select(${o},this)">x = ${o}</button>`).join('');
  },

  select(val, el) {
    document.querySelectorAll('.potion-opt').forEach(b => b.disabled = true);
    if (val === this.puzzle.answer) {
      el.classList.add('potion-correct');
      const coins = 10 + this.attempts * 5;
      Rewards.addCoins(coins);
      const s = BadgeSystem.getStats();
      s.potionsBrewed++;
      BadgeSystem.saveStats(s);
      BadgeSystem.checkAll(s);
      MissionSystem.recordEvent('potion_brewed');
      this.showSteps();
      document.getElementById('potion-result').innerHTML =
        `<div class="brew-success">✅ ${this.puzzle.potion} brewed! +${coins} 🪙<div class="brew-anim">✨🧪✨</div></div>`;
    } else {
      el.classList.add('potion-wrong');
      this.attempts--;
      document.getElementById('potion-attempts').textContent = `Attempts: ${'❤️'.repeat(Math.max(0,this.attempts))}`;
      if (this.attempts > 0) {
        setTimeout(() => {
          document.querySelectorAll('.potion-opt').forEach(b => { b.disabled = false; b.classList.remove('potion-wrong'); });
          document.getElementById('potion-steps').innerHTML = `<div class="potion-hint">💡 Hint: ${this.puzzle.steps[0]}</div>`;
          document.getElementById('potion-steps').style.display = 'block';
        }, 700);
      } else {
        this.showSteps();
        document.getElementById('potion-result').innerHTML =
          `<div class="brew-fail">❌ Potion failed! Study the steps above.</div>`;
      }
    }
  },

  showSteps() {
    const el = document.getElementById('potion-steps');
    el.innerHTML = `<div class="step-title">📝 Solution:</div>
      ${this.puzzle.steps.map(s => `<div class="brew-step">→ ${s}</div>`).join('')}`;
    el.style.display = 'block';
  },

  nextPuzzle() {
    this.puzzle = PotionPuzzles[Math.floor(Math.random() * PotionPuzzles.length)];
    this.attempts = 2;
    this.render();
  },
};

// ==================== TREASURE HUNT ====================
const TreasureChests = [
  { id:0, name:'Bronze Chest', icon:'📦', reward:20, locked:true,
    clue:'Evaluate:', expression:`${fracHTML('3x','6')} when x = 4`,
    answer:2, options:[2,4,6,8],
    workingHTML:`<div class="chest-step">${fracHTML('3(4)','6')} = ${fracHTML('12','6')} = <strong>2</strong></div>` },
  { id:1, name:'Silver Chest', icon:'🎁', reward:35, locked:true,
    clue:'Evaluate:', expression:`${fracHTML('2x²','8')} when x = 2`,
    answer:1, options:[1,2,4,8],
    workingHTML:`<div class="chest-step">${fracHTML('2(4)','8')} = ${fracHTML('8','8')} = <strong>1</strong></div>` },
  { id:2, name:'Gold Chest', icon:'🏅', reward:50, locked:true,
    clue:'Simplify first, then find the value:',
    expression:`${fracHTML('4ab','2b')} when a = 3`,
    answer:6, options:[3,5,6,10],
    workingHTML:`<div class="chest-step">${fracHTML('4ab','2b')} = 2a → 2(3) = <strong>6</strong></div>` },
  { id:3, name:'Crystal Chest', icon:'💎', reward:70, locked:true,
    clue:'Factorise, then evaluate:',
    expression:`${fracHTML('x²−4','x+2')} when x = 5`,
    answer:3, options:[3,5,7,21],
    workingHTML:`<div class="chest-step">(x+2)(x−2)/(x+2) = x−2 → 5−2 = <strong>3</strong></div>` },
  { id:4, name:'Dragon Chest', icon:'🐲', reward:100, locked:true,
    clue:'Multiply first, then evaluate:',
    expression:`${fracHTML('3x','4')} × ${fracHTML('8','x')}`,
    answer:6, options:[6,7,12,14],
    workingHTML:`<div class="chest-step">${fracHTML('24x','4x')} = 6 (x always cancels!)</div>` },
];

const TreasureHunt = {
  chests: null,
  load()  { const s = localStorage.getItem('fq_chests'); this.chests = s ? JSON.parse(s) : TreasureChests.map(c=>({...c})); },
  save()  { localStorage.setItem('fq_chests', JSON.stringify(this.chests)); },

  open() {
    this.load(); this.renderMap();
    document.getElementById('screen-treasure').style.display = 'flex';
    Rewards.updateCoinDisplays();
  },

  close() { document.getElementById('screen-treasure').style.display = 'none'; },

  renderMap() {
    document.getElementById('treasure-map').innerHTML = this.chests.map((c,i) => `
      <div class="chest-card ${c.locked ? 'chest-locked' : 'chest-open'}" onclick="TreasureHunt.selectChest(${i})">
        <div class="chest-icon">${c.locked ? '🔒' : '✅'}</div>
        <div class="chest-name">${c.name}</div>
        <div class="chest-reward">🪙 ${c.reward}</div>
      </div>`).join('');
    document.getElementById('treasure-puzzle').style.display = 'none';
  },

  selectChest(i) {
    const c = this.chests[i];
    const el = document.getElementById('treasure-puzzle');
    el.style.display = 'block';
    if (!c.locked) { el.innerHTML = `<div class="chest-already-open">✅ Already opened! You earned 🪙${c.reward}.</div>`; return; }
    el.innerHTML = `
      <div class="puzzle-header">🔐 Crack the code for ${c.name}!</div>
      <div class="puzzle-clue">${c.clue}</div>
      <div class="puzzle-expression">${c.expression}</div>
      <div class="puzzle-opts">
        ${shuffle([...c.options]).map(o => `<button class="treasure-btn" onclick="TreasureHunt.check(${i},${o},this)">${o}</button>`).join('')}
      </div>
      <div id="chest-working" style="display:none" class="treasure-working"></div>
      <div id="chest-result"></div>`;
  },

  check(ci, val, el) {
    const c = this.chests[ci];
    document.querySelectorAll('.treasure-btn').forEach(b => b.disabled = true);
    document.getElementById('chest-working').innerHTML = `<div class="working-title">📝 Working:</div>${c.workingHTML}`;
    document.getElementById('chest-working').style.display = 'block';
    if (val === c.answer) {
      el.classList.add('treasure-correct');
      c.locked = false; this.save();
      Rewards.addCoins(c.reward);
      const s = BadgeSystem.getStats(); s.chestsOpened++;
      BadgeSystem.saveStats(s); BadgeSystem.checkAll(s);
      document.getElementById('chest-result').innerHTML = `<div class="treasure-success">🎉 Opened! +${c.reward} 🪙</div>`;
      setTimeout(() => this.renderMap(), 1500);
    } else {
      el.classList.add('treasure-wrong');
      document.getElementById('chest-result').innerHTML = `<div class="treasure-fail">❌ Wrong! Study the working above.</div>`;
    }
  },
};

// ==================== FRACTION FORGE ====================
const ForgePuzzles = [
  { question:'Build the simplified form of:', given: fracHTML('6x²','9x'), targetNum:'2x', targetDen:'3',
    numPieces:['2x','x²','6','3x'], denPieces:['3','9','4','6x'], hint:'6/9=2/3. x²/x=x.' },
  { question:'Build the simplified form of:', given: fracHTML('4a³','12a'), targetNum:'a²', targetDen:'3',
    numPieces:['a²','a³','4a','2a'], denPieces:['3','12','6','4'], hint:'4/12=1/3. a³/a=a².' },
  { question:'Build the result of:', given:`${fracHTML('3x','4')} ${opHTML('×')} ${fracHTML('8','x²')}`,
    targetNum:'6', targetDen:'x', numPieces:['6','24','3','8x'], denPieces:['x','x²','4x','12'], hint:'24x/4x²=6/x.' },
];

const FractionForge = {
  puzzle:null, selNum:null, selDen:null,

  open() {
    this.puzzle=ForgePuzzles[Math.floor(Math.random()*ForgePuzzles.length)];
    this.selNum=null; this.selDen=null;
    this.render();
    document.getElementById('screen-forge').style.display='flex';
    Rewards.updateCoinDisplays();
  },

  close() { document.getElementById('screen-forge').style.display='none'; },

  render() {
    const p=this.puzzle;
    document.getElementById('forge-question').textContent=p.question;
    document.getElementById('forge-given').innerHTML=p.given;
    document.getElementById('forge-hint-text').style.display='none';
    document.getElementById('forge-result').innerHTML='';
    document.getElementById('forge-num-slot').textContent='?';
    document.getElementById('forge-den-slot').textContent='?';
    document.getElementById('forge-num-pieces').innerHTML=shuffle([...p.numPieces]).map(pc=>`<div class="forge-piece" onclick="FractionForge.pickNum('${pc}',this)">${pc}</div>`).join('');
    document.getElementById('forge-den-pieces').innerHTML=shuffle([...p.denPieces]).map(pc=>`<div class="forge-piece" onclick="FractionForge.pickDen('${pc}',this)">${pc}</div>`).join('');
  },

  pickNum(v,el) {
    document.querySelectorAll('#forge-num-pieces .forge-piece').forEach(p=>p.classList.remove('piece-selected'));
    el.classList.add('piece-selected'); this.selNum=v;
    document.getElementById('forge-num-slot').textContent=v; this.tryCheck();
  },

  pickDen(v,el) {
    document.querySelectorAll('#forge-den-pieces .forge-piece').forEach(p=>p.classList.remove('piece-selected'));
    el.classList.add('piece-selected'); this.selDen=v;
    document.getElementById('forge-den-slot').textContent=v; this.tryCheck();
  },

  tryCheck() {
    if (!this.selNum||!this.selDen) return;
    const ok=this.selNum===this.puzzle.targetNum&&this.selDen===this.puzzle.targetDen;
    if (ok) {
      Rewards.addCoins(15);
      const s=BadgeSystem.getStats(); s.forgesBuilt++;
      BadgeSystem.saveStats(s); BadgeSystem.checkAll(s);
      document.getElementById('forge-result').innerHTML=
        `<div class="forge-success">⚒️ Forged! +15 🪙 &nbsp; ${fracHTML(this.puzzle.targetNum,this.puzzle.targetDen)} ✅</div>`;
    } else {
      document.getElementById('forge-result').innerHTML=`<div class="forge-fail">❌ Not quite — retry!</div>`;
      setTimeout(()=>{
        this.selNum=null; this.selDen=null;
        document.getElementById('forge-num-slot').textContent='?';
        document.getElementById('forge-den-slot').textContent='?';
        document.querySelectorAll('.forge-piece').forEach(p=>p.classList.remove('piece-selected'));
        document.getElementById('forge-result').innerHTML='';
      },1000);
    }
  },

  showHint() {
    document.getElementById('forge-hint-text').textContent=this.puzzle.hint;
    document.getElementById('forge-hint-text').style.display='block';
  },

  nextPuzzle() { this.open(); },
};

// ==================== DAILY CHALLENGE ====================
const DailyChallenge = {
  getToday()    { return new Date().toDateString(); },
  isDoneToday() { return localStorage.getItem('fq_daily_date')===this.getToday(); },
  complete(score) {
    localStorage.setItem('fq_daily_date', this.getToday());
    Rewards.addCoins(25);
    MissionSystem.recordEvent('speedrun_score', score);
    showToast('📅 Daily done! +25 🪙');
  },
  getChallenge() {
    const day=Math.floor(Date.now()/86400000);
    const pool=[...QuestionBanks.level2,...QuestionBanks.level3,...QuestionBanks.level4];
    return pool[day%pool.length];
  },
};

// ==================== TOAST ====================
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('fq:correct', (e) => {
  StreakTracker.increment(e.detail.type);
});

document.addEventListener('fq:wrong', (e) => {
  StreakTracker.reset(e.detail.type);
});

document.addEventListener('fq:hintUsed', () => {
  StreakTracker.hintUsedThisLevel = true;
});

document.addEventListener('fq:levelcomplete', (e) => {
  StreakTracker.levelComplete(StreakTracker.hintUsedThisLevel);
  const el = document.getElementById('complete-coins');
  if (el) el.innerHTML = `🪙 Total coins: ${Rewards.getCoins()}`;
  if (e.detail.mode === 'quest' && !DailyChallenge.isDoneToday()) DailyChallenge.complete(e.detail.score);
  PowerUps.renderInventoryBar();
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  Rewards.updateCoinDisplays();
  MissionSystem.renderMissions();
  MasteryTracker.render();
  PowerUps.renderInventoryBar();
});