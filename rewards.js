/* =============================================
   FRACTOQUEST — Rewards & Side Games
   ============================================= */

// ==================== COIN & XP SYSTEM ====================
const Rewards = {

  getCoins() {
    return parseInt(localStorage.getItem('fq_coins') || '0');
  },

  addCoins(amount) {
    const current = this.getCoins();
    const newTotal = current + amount;
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

  // Called from main game.js after correct answer
  awardFromAnswer(points, streakCount) {
    // Base coins = points / 5
    let coins = Math.floor(points / 5);
    // Streak bonus
    if (streakCount >= 3) coins += 2;
    if (streakCount >= 5) coins += 3;
    if (streakCount >= 10) coins += 5;
    this.addCoins(coins);
    BadgeSystem.checkStreakBadge(streakCount);
    return coins;
  },
};

// ==================== BADGE SYSTEM ====================
const BadgeData = [
  {
    id: 'first_spell',
    name: 'First Spell',
    desc: 'Answer your first question correctly',
    icon: '🔮',
    condition: (s) => s.totalCorrect >= 1,
    algebra: 'You cast: x = correct!',
  },
  {
    id: 'simplifier',
    name: 'The Simplifier',
    desc: 'Simplify 10 fractions correctly',
    icon: '✂️',
    condition: (s) => s.simplifyCorrect >= 10,
    algebra: 'Mastered: cancelling common factors',
  },
  {
    id: 'multiplier',
    name: 'Multiplication Mage',
    desc: 'Multiply 5 algebraic fractions correctly',
    icon: '✖️',
    condition: (s) => s.multiplyCorrect >= 5,
    algebra: 'Rule: (a/b)×(c/d) = ac/bd',
  },
  {
    id: 'divider',
    name: 'Division Wizard',
    desc: 'Divide 5 algebraic fractions correctly',
    icon: '➗',
    condition: (s) => s.divideCorrect >= 5,
    algebra: 'Mastered: KCF — Keep, Change, Flip!',
  },
  {
    id: 'hot_streak',
    name: 'On Fire!',
    desc: 'Answer 5 in a row correctly',
    icon: '🔥',
    condition: (s) => s.bestStreak >= 5,
    algebra: 'Streak: x₁ + x₂ + x₃ + x₄ + x₅ = 💯',
  },
  {
    id: 'grand_streak',
    name: 'Unstoppable',
    desc: 'Answer 10 in a row correctly',
    icon: '⚡',
    condition: (s) => s.bestStreak >= 10,
    algebra: 'Perfect run: no errors = full simplification!',
  },
  {
    id: 'potion_master',
    name: 'Potion Master',
    desc: 'Complete 3 Potion Craft puzzles',
    icon: '🧪',
    condition: (s) => s.potionsBrewed >= 3,
    algebra: 'Solved linear equations to brew!',
  },
  {
    id: 'treasure_hunter',
    name: 'Treasure Hunter',
    desc: 'Open 3 treasure chests',
    icon: '🗺️',
    condition: (s) => s.chestsOpened >= 3,
    algebra: 'Cracked algebraic codes!',
  },
  {
    id: 'shopaholic',
    name: 'Spell Collector',
    desc: 'Buy 3 items from the Spell Shop',
    icon: '🏪',
    condition: (s) => s.itemsBought >= 3,
    algebra: 'Invested your fraction coins wisely!',
  },
  {
    id: 'level_master',
    name: 'Realm Master',
    desc: 'Complete all 6 levels',
    icon: '👑',
    condition: (s) => s.levelsCompleted >= 6,
    algebra: 'Full mastery: simplify, multiply, divide, factor!',
  },
  {
    id: 'factoriser',
    name: 'The Factoriser',
    desc: 'Correctly factorise 5 expressions',
    icon: '🔍',
    condition: (s) => s.factorCorrect >= 5,
    algebra: 'Mastered: x²−a²=(x+a)(x−a)',
  },
  {
    id: 'hint_free',
    name: 'No Hints Needed',
    desc: 'Complete a full level without any hints',
    icon: '🧠',
    condition: (s) => s.noHintLevels >= 1,
    algebra: 'Pure algebraic instinct!',
  },
];

const BadgeSystem = {

  getStats() {
    return JSON.parse(localStorage.getItem('fq_stats') || JSON.stringify({
      totalCorrect: 0,
      simplifyCorrect: 0,
      multiplyCorrect: 0,
      divideCorrect: 0,
      factorCorrect: 0,
      bestStreak: 0,
      currentStreak: 0,
      potionsBrewed: 0,
      chestsOpened: 0,
      itemsBought: 0,
      levelsCompleted: 0,
      noHintLevels: 0,
    }));
  },

  saveStats(stats) {
    localStorage.setItem('fq_stats', JSON.stringify(stats));
  },

  getEarned() {
    return JSON.parse(localStorage.getItem('fq_badges') || '[]');
  },

  recordCorrect(type, hintUsed) {
    const stats = this.getStats();
    stats.totalCorrect++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.bestStreak) stats.bestStreak = stats.currentStreak;

    if (type === 'simplify')       stats.simplifyCorrect++;
    if (type === 'multiply')       stats.multiplyCorrect++;
    if (type === 'divide')         stats.divideCorrect++;
    if (type === 'factor-simplify') stats.factorCorrect++;

    this.saveStats(stats);
    this.checkAll(stats);
    return stats.currentStreak;
  },

  recordWrong() {
    const stats = this.getStats();
    stats.currentStreak = 0;
    this.saveStats(stats);
  },

  recordLevelComplete(hintUsedInLevel) {
    const stats = this.getStats();
    stats.levelsCompleted++;
    if (!hintUsedInLevel) stats.noHintLevels++;
    this.saveStats(stats);
    this.checkAll(stats);
  },

  checkStreakBadge(streak) {
    const stats = this.getStats();
    this.checkAll(stats);
  },

  checkAll(stats) {
    const earned = this.getEarned();
    BadgeData.forEach(badge => {
      if (!earned.includes(badge.id) && badge.condition(stats)) {
        earned.push(badge.id);
        localStorage.setItem('fq_badges', JSON.stringify(earned));
        this.showBadgePopup(badge);
        Rewards.addCoins(15); // bonus coins for badge
      }
    });
  },

  showBadgePopup(badge) {
    const popup = document.getElementById('badge-popup');
    document.getElementById('badge-popup-icon').textContent = badge.icon;
    document.getElementById('badge-popup-name').textContent = badge.name;
    document.getElementById('badge-popup-desc').textContent = badge.desc;
    document.getElementById('badge-popup-algebra').textContent = badge.algebra;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 4000);
  },

  renderCabinet() {
    const earned = this.getEarned();
    const container = document.getElementById('badge-grid');
    container.innerHTML = BadgeData.map(badge => {
      const isEarned = earned.includes(badge.id);
      return `
        <div class="badge-card ${isEarned ? 'earned' : 'locked'}"
             onclick="BadgeSystem.showBadgeDetail('${badge.id}')">
          <div class="badge-icon">${isEarned ? badge.icon : '🔒'}</div>
          <div class="badge-name">${isEarned ? badge.name : '???'}</div>
        </div>
      `;
    }).join('');
  },

  showBadgeDetail(id) {
    const badge = BadgeData.find(b => b.id === id);
    const earned = this.getEarned();
    const isEarned = earned.includes(id);
    const modal = document.getElementById('badge-detail-modal');
    document.getElementById('bd-icon').textContent = isEarned ? badge.icon : '🔒';
    document.getElementById('bd-name').textContent = isEarned ? badge.name : 'Locked Badge';
    document.getElementById('bd-desc').textContent = badge.desc;
    document.getElementById('bd-algebra').innerHTML =
      isEarned
        ? `<span class="algebra-tag">${badge.algebra}</span>`
        : '<span style="color:var(--text-dim)">Complete the task to unlock!</span>';
    document.getElementById('bd-status').textContent =
      isEarned ? '✅ Unlocked!' : '🔒 Not yet earned';
    modal.style.display = 'flex';
  },
};

// ==================== SPELL SHOP ====================
const ShopItems = [
  {
    id: 'hat_star',
    name: 'Starlight Hat',
    desc: 'A hat that sparkles with math energy',
    icon: '🎩',
    wizardEmoji: '🧙‍♂️✨',
    price: 30,
    type: 'hat',
    algebra: 'Cost formula: 30 coins = 6 × 5',
  },
  {
    id: 'robe_fire',
    name: 'Flame Robe',
    desc: 'Burns with the power of algebra',
    icon: '🔥',
    wizardEmoji: '🧙🔥',
    price: 40,
    type: 'robe',
    algebra: 'Price: p = 8 × 5, solve for p',
  },
  {
    id: 'wand_crystal',
    name: 'Crystal Wand',
    desc: 'Amplifies correct answers',
    icon: '🔮',
    wizardEmoji: '🧙‍♂️🔮',
    price: 25,
    type: 'wand',
    algebra: 'Discount: 25 = 50 × (1 − x), x = 0.5',
  },
  {
    id: 'pet_owl',
    name: 'Math Owl Familiar',
    desc: 'Gives a free hint every 3 questions',
    icon: '🦉',
    wizardEmoji: '🦉🧙',
    price: 60,
    type: 'pet',
    algebra: 'Rate: 1 hint per 3 questions = 1/3',
    effect: 'free_hint',
  },
  {
    id: 'shield_gold',
    name: 'Golden Shield',
    desc: 'Block one wrong answer per level',
    icon: '🛡️',
    wizardEmoji: '🛡️🧙',
    price: 50,
    type: 'shield',
    algebra: 'Shield power: S = 1 life saved',
    effect: 'life_shield',
  },
  {
    id: 'scroll_double',
    name: 'Double XP Scroll',
    desc: 'Earn 2× coins for one full level',
    icon: '📜',
    wizardEmoji: '📜🧙',
    price: 45,
    type: 'scroll',
    algebra: 'Multiplier: coins × 2 = 2c',
    effect: 'double_coins',
    consumable: true,
  },
  {
    id: 'gem_streak',
    name: 'Streak Gem',
    desc: 'Preserves your streak on 1 wrong answer',
    icon: '💎',
    wizardEmoji: '💎🧙',
    price: 35,
    type: 'gem',
    algebra: 'Streak protection: s → s (no reset)',
    effect: 'streak_protect',
    consumable: true,
  },
  {
    id: 'hat_dragon',
    name: 'Dragon Scale Cap',
    desc: 'Legendary wizard headgear',
    icon: '🐉',
    wizardEmoji: '🐉🧙',
    price: 80,
    type: 'hat',
    algebra: 'Rarity formula: R = n!/( k!(n−k)! )',
  },
];

const SpellShop = {

  getOwned() {
    return JSON.parse(localStorage.getItem('fq_owned') || '[]');
  },

  isOwned(id) {
    return this.getOwned().includes(id);
  },

  buy(id) {
    const item = ShopItems.find(i => i.id === id);
    if (!item) return;
    if (!item.consumable && this.isOwned(id)) {
      showShopMsg('Already owned! ✅', false);
      return;
    }
    if (!Rewards.spendCoins(item.price)) {
      showShopMsg(`Need ${item.price} 🪙 — earn more by playing! 💪`, false);
      return;
    }

    const owned = this.getOwned();
    if (!owned.includes(id)) owned.push(id);
    localStorage.setItem('fq_owned', JSON.stringify(owned));

    // Track badge stat
    const stats = BadgeSystem.getStats();
    stats.itemsBought++;
    BadgeSystem.saveStats(stats);
    BadgeSystem.checkAll(stats);

    this.applyEffect(item);
    showShopMsg(`${item.icon} ${item.name} purchased! ✨`, true);
    this.render();

    // Update wizard emoji if cosmetic
    if (item.wizardEmoji && !item.effect) {
      localStorage.setItem('fq_wizard_emoji', item.wizardEmoji);
    }
  },

  applyEffect(item) {
    if (item.effect === 'double_coins') {
      localStorage.setItem('fq_double_coins', '1');
    }
    if (item.effect === 'life_shield') {
      localStorage.setItem('fq_shield', '1');
    }
    if (item.effect === 'streak_protect') {
      localStorage.setItem('fq_streak_protect', '1');
    }
  },

  render() {
    const container = document.getElementById('shop-items');
    const owned = this.getOwned();
    container.innerHTML = ShopItems.map(item => {
      const isOwned = owned.includes(item.id);
      const canAfford = Rewards.getCoins() >= item.price;
      return `
        <div class="shop-card ${isOwned && !item.consumable ? 'owned' : ''} ${!canAfford && !isOwned ? 'too-costly' : ''}">
          <div class="shop-icon">${item.icon}</div>
          <div class="shop-name">${item.name}</div>
          <div class="shop-desc">${item.desc}</div>
          <div class="shop-algebra">${item.algebra}</div>
          <div class="shop-price">🪙 ${item.price}</div>
          <button class="btn btn-shop ${isOwned && !item.consumable ? 'btn-owned' : ''}"
                  onclick="SpellShop.buy('${item.id}')">
            ${isOwned && !item.consumable ? '✅ Owned' : `Buy — 🪙${item.price}`}
          </button>
        </div>
      `;
    }).join('');
  },
};

function showShopMsg(msg, success) {
  const el = document.getElementById('shop-msg');
  el.textContent = msg;
  el.style.color = success ? 'var(--success)' : 'var(--danger)';
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, 2500);
}

// ==================== SIDE GAME 1: POTION CRAFT ====================
// Solve a simple linear equation to brew a potion
// e.g. "3x + 2 = 11 → x = ?" → choose correct x

const PotionPuzzles = [
  {
    question: 'Solve for x:',
    equation: '3x = 12',
    answer: 4,
    options: [3, 4, 6, 9],
    steps: [
      `Start: 3x = 12`,
      `Divide both sides by 3`,
      `x = 12 ÷ 3 = <strong>4</strong>`,
    ],
    potion: '🔵 Blue Potion',
    potionEffect: '+10 coins',
  },
  {
    question: 'Solve for x:',
    equation: '2x + 5 = 13',
    answer: 4,
    options: [2, 3, 4, 9],
    steps: [
      `Start: 2x + 5 = 13`,
      `Subtract 5 from both sides: 2x = 8`,
      `Divide by 2: x = <strong>4</strong>`,
    ],
    potion: '🔴 Red Potion',
    potionEffect: '+15 coins',
  },
  {
    question: 'Solve for x:',
    equation: 'x/4 = 3',
    answer: 12,
    options: [7, 8, 12, 16],
    steps: [
      `Start: x/4 = 3`,
      `Multiply both sides by 4`,
      `x = 3 × 4 = <strong>12</strong>`,
    ],
    potion: '🟢 Green Potion',
    potionEffect: '+12 coins',
  },
  {
    question: 'Solve for x:',
    equation: '5x − 3 = 17',
    answer: 4,
    options: [3, 4, 5, 7],
    steps: [
      `Start: 5x − 3 = 17`,
      `Add 3 to both sides: 5x = 20`,
      `Divide by 5: x = <strong>4</strong>`,
    ],
    potion: '🟡 Gold Potion',
    potionEffect: '+20 coins',
  },
  {
    question: 'Solve for x:',
    equation: '2(x + 3) = 14',
    answer: 4,
    options: [2, 4, 5, 7],
    steps: [
      `Start: 2(x + 3) = 14`,
      `Divide both sides by 2: x + 3 = 7`,
      `Subtract 3: x = <strong>4</strong>`,
    ],
    potion: '🟣 Purple Potion',
    potionEffect: '+18 coins',
  },
  {
    question: 'Solve for x:',
    equation: '3x/2 = 9',
    answer: 6,
    options: [3, 4, 6, 9],
    steps: [
      `Start: 3x/2 = 9`,
      `Multiply both sides by 2: 3x = 18`,
      `Divide by 3: x = <strong>6</strong>`,
    ],
    potion: '⚗️ Magic Elixir',
    potionEffect: '+25 coins',
  },
  {
    question: 'Solve for x:',
    equation: '4x + 2 = 3x + 7',
    answer: 5,
    options: [3, 4, 5, 9],
    steps: [
      `Start: 4x + 2 = 3x + 7`,
      `Subtract 3x: x + 2 = 7`,
      `Subtract 2: x = <strong>5</strong>`,
    ],
    potion: '🌈 Rainbow Brew',
    potionEffect: '+30 coins',
  },
  {
    question: 'Solve for x:',
    equation: 'x/3 + 2 = 5',
    answer: 9,
    options: [6, 7, 9, 11],
    steps: [
      `Start: x/3 + 2 = 5`,
      `Subtract 2: x/3 = 3`,
      `Multiply by 3: x = <strong>9</strong>`,
    ],
    potion: '🔮 Crystal Brew',
    potionEffect: '+22 coins',
  },
];

const PotionCraft = {
  currentPuzzle: null,
  selectedAnswer: null,
  attemptsLeft: 2,
  puzzleIndex: 0,

  open() {
    this.puzzleIndex = Math.floor(Math.random() * PotionPuzzles.length);
    this.currentPuzzle = PotionPuzzles[this.puzzleIndex];
    this.selectedAnswer = null;
    this.attemptsLeft = 2;
    this.render();
    document.getElementById('screen-potion').style.display = 'flex';
  },

  close() {
    document.getElementById('screen-potion').style.display = 'none';
  },

  render() {
    const p = this.currentPuzzle;
    document.getElementById('potion-flask').textContent = p.potion;
    document.getElementById('potion-question').textContent = p.question;
    document.getElementById('potion-equation').textContent = p.equation;
    document.getElementById('potion-attempts').textContent =
      `Attempts left: ${'❤️'.repeat(this.attemptsLeft)}`;
    document.getElementById('potion-steps').style.display = 'none';
    document.getElementById('potion-steps').innerHTML = '';
    document.getElementById('potion-result').innerHTML = '';

    const opts = shuffle([...p.options]);
    document.getElementById('potion-options').innerHTML = opts.map(opt => `
      <button class="potion-opt" onclick="PotionCraft.selectAnswer(${opt}, this)">
        x = ${opt}
      </button>
    `).join('');
  },

  selectAnswer(val, el) {
    if (this.selectedAnswer !== null) return;
    this.selectedAnswer = val;

    document.querySelectorAll('.potion-opt').forEach(b => b.disabled = true);

    if (val === this.currentPuzzle.answer) {
      el.classList.add('potion-correct');
      this.brewSuccess();
    } else {
      el.classList.add('potion-wrong');
      this.attemptsLeft--;
      document.getElementById('potion-attempts').textContent =
        `Attempts left: ${'❤️'.repeat(this.attemptsLeft)}`;

      if (this.attemptsLeft > 0) {
        // Let them try again
        this.selectedAnswer = null;
        setTimeout(() => {
          document.querySelectorAll('.potion-opt').forEach(b => {
            b.disabled = false;
            b.classList.remove('potion-wrong');
          });
          this.showPartialHint();
        }, 800);
      } else {
        this.brewFail();
      }
    }
  },

  showPartialHint() {
    const stepsEl = document.getElementById('potion-steps');
    stepsEl.innerHTML = `
      <div class="potion-hint">💡 First step: ${this.currentPuzzle.steps[0]}</div>
    `;
    stepsEl.style.display = 'block';
  },

  brewSuccess() {
    const p = this.currentPuzzle;
    const coinsEarned = 10 + (this.attemptsLeft * 5);
    Rewards.addCoins(coinsEarned);

    const stats = BadgeSystem.getStats();
    stats.potionsBrewed++;
    BadgeSystem.saveStats(stats);
    BadgeSystem.checkAll(stats);

    // Show full steps
    const stepsEl = document.getElementById('potion-steps');
    stepsEl.innerHTML = `
      <div class="step-title">📝 Solution:</div>
      ${p.steps.map(s => `<div class="brew-step">→ ${s}</div>`).join('')}
    `;
    stepsEl.style.display = 'block';

    document.getElementById('potion-result').innerHTML = `
      <div class="brew-success">
        ✅ ${p.potion} brewed! +${coinsEarned} 🪙
        <div class="brew-anim">✨🧪✨</div>
      </div>
    `;
  },

  brewFail() {
    const p = this.currentPuzzle;
    const stepsEl = document.getElementById('potion-steps');
    stepsEl.innerHTML = `
      <div class="step-title">📝 Full solution:</div>
      ${p.steps.map(s => `<div class="brew-step">→ ${s}</div>`).join('')}
    `;
    stepsEl.style.display = 'block';

    document.getElementById('potion-result').innerHTML = `
      <div class="brew-fail">❌ Potion failed! Study the steps and try again.</div>
    `;
  },

  nextPuzzle() {
    this.puzzleIndex = (this.puzzleIndex + 1) % PotionPuzzles.length;
    this.currentPuzzle = PotionPuzzles[this.puzzleIndex];
    this.selectedAnswer = null;
    this.attemptsLeft = 2;
    this.render();
  },
};

// ==================== SIDE GAME 2: TREASURE HUNT ====================
// Crack an algebraic code: evaluate a fraction expression → get the code digit

const TreasureChests = [
  {
    id: 0,
    name: 'Bronze Chest',
    icon: '📦',
    reward: 20,
    locked: true,
    clue: 'Evaluate:',
    expression: `<span class="frac"><span class="num">3x</span><span class="den">6</span></span> when x = 4`,
    answer: 2,
    options: [2, 4, 6, 8],
    workingHTML: `
      <div class="chest-step">Substitute x = 4:</div>
      <div class="chest-step">
        <span class="frac"><span class="num">3(4)</span><span class="den">6</span></span>
        = <span class="frac"><span class="num">12</span><span class="den">6</span></span>
        = <strong>2</strong>
      </div>
    `,
  },
  {
    id: 1,
    name: 'Silver Chest',
    icon: '🎁',
    reward: 35,
    locked: true,
    clue: 'Evaluate:',
    expression: `<span class="frac"><span class="num">2x²</span><span class="den">8</span></span> when x = 2`,
    answer: 1,
    options: [1, 2, 4, 8],
    workingHTML: `
      <div class="chest-step">Substitute x = 2:</div>
      <div class="chest-step">
        <span class="frac"><span class="num">2(2²)</span><span class="den">8</span></span>
        = <span class="frac"><span class="num">2(4)</span><span class="den">8</span></span>
        = <span class="frac"><span class="num">8</span><span class="den">8</span></span>
        = <strong>1</strong>
      </div>
    `,
  },
  {
    id: 2,
    name: 'Gold Chest',
    icon: '🏅',
    reward: 50,
    locked: true,
    clue: 'Find the value:',
    expression: `<span class="frac"><span class="num">4ab</span><span class="den">2b</span></span> when a = 3, b = 5`,
    answer: 6,
    options: [3, 5, 6, 10],
    workingHTML: `
      <div class="chest-step">Simplify first (cancel 2b):</div>
      <div class="chest-step">
        <span class="frac"><span class="num">4ab</span><span class="den">2b</span></span>
        = 2a
      </div>
      <div class="chest-step">Substitute a = 3: 2(3) = <strong>6</strong></div>
    `,
  },
  {
    id: 3,
    name: 'Crystal Chest',
    icon: '💎',
    reward: 70,
    locked: true,
    clue: 'Evaluate:',
    expression: `<span class="frac"><span class="num">x² − 4</span><span class="den">x + 2</span></span> when x = 5`,
    answer: 3,
    options: [3, 5, 7, 21],
    workingHTML: `
      <div class="chest-step">Factorise numerator: x²−4 = (x+2)(x−2)</div>
      <div class="chest-step">
        <span class="frac"><span class="num">(x+2)(x−2)</span><span class="den">x+2</span></span>
        = x − 2
      </div>
      <div class="chest-step">Substitute x = 5: 5 − 2 = <strong>3</strong></div>
    `,
  },
  {
    id: 4,
    name: 'Dragon Chest',
    icon: '🐲',
    reward: 100,
    locked: true,
    clue: 'Find the value:',
    expression: `<span class="frac"><span class="num">3x</span><span class="den">4</span></span> × <span class="frac"><span class="num">8</span><span class="den">x</span></span> when x = 7`,
    answer: 6,
    options: [6, 7, 12, 14],
    workingHTML: `
      <div class="chest-step">Multiply first, then substitute:</div>
      <div class="chest-step">
        <span class="frac"><span class="num">3x × 8</span><span class="den">4 × x</span></span>
        = <span class="frac"><span class="num">24x</span><span class="den">4x</span></span>
        = 6
      </div>
      <div class="chest-step">Answer is always <strong>6</strong> (x cancels!)</div>
    `,
  },
];

const TreasureHunt = {
  currentChest: null,
  chestStates: null,

  load() {
    this.chestStates = JSON.parse(
      localStorage.getItem('fq_chests') ||
      JSON.stringify(TreasureChests.map(c => ({ ...c })))
    );
  },

  save() {
    localStorage.setItem('fq_chests', JSON.stringify(this.chestStates));
  },

  open() {
    this.load();
    this.renderMap();
    document.getElementById('screen-treasure').style.display = 'flex';
  },

  close() {
    document.getElementById('screen-treasure').style.display = 'none';
  },

  renderMap() {
    const container = document.getElementById('treasure-map');
    container.innerHTML = this.chestStates.map((chest, i) => `
      <div class="chest-card ${chest.locked ? 'chest-locked' : 'chest-open'}"
           onclick="TreasureHunt.selectChest(${i})">
        <div class="chest-icon">${chest.locked ? '🔒' : '✅'}</div>
        <div class="chest-name">${chest.name}</div>
        <div class="chest-reward">🪙 ${chest.reward}</div>
      </div>
    `).join('');
    document.getElementById('treasure-puzzle').style.display = 'none';
  },

  selectChest(index) {
    const chest = this.chestStates[index];
    if (!chest.locked) {
      document.getElementById('treasure-puzzle').innerHTML = `
        <div class="chest-already-open">
          ✅ This chest is already opened!<br>You earned 🪙 ${chest.reward} from it.
        </div>
      `;
      document.getElementById('treasure-puzzle').style.display = 'block';
      return;
    }

    this.currentChest = index;
    const c = chest;

    document.getElementById('treasure-puzzle').style.display = 'block';
    document.getElementById('treasure-puzzle').innerHTML = `
      <div class="puzzle-header">🔐 Crack the code to open the ${c.name}!</div>
      <div class="puzzle-clue">${c.clue}</div>
      <div class="puzzle-expression">${c.expression}</div>
      <div class="puzzle-opts" id="treasure-opts">
        ${shuffle([...c.options]).map(opt => `
          <button class="treasure-btn" onclick="TreasureHunt.checkAnswer(${opt}, this)">
            ${opt}
          </button>
        `).join('')}
      </div>
      <div id="treasure-working" style="display:none" class="treasure-working"></div>
      <div id="treasure-result"></div>
    `;
  },

  checkAnswer(val, el) {
    const chest = this.chestStates[this.currentChest];
    document.querySelectorAll('.treasure-btn').forEach(b => b.disabled = true);

    const workingEl = document.getElementById('treasure-working');
    workingEl.innerHTML = `
      <div class="working-title">📝 Working:</div>
      ${chest.workingHTML}
    `;
    workingEl.style.display = 'block';

    const resultEl = document.getElementById('treasure-result');

    if (val === chest.answer) {
      el.classList.add('treasure-correct');
      chest.locked = false;
      this.save();

      const stats = BadgeSystem.getStats();
      stats.chestsOpened++;
      BadgeSystem.saveStats(stats);
      BadgeSystem.checkAll(stats);

      Rewards.addCoins(chest.reward);

      resultEl.innerHTML = `
        <div class="treasure-success">
          🎉 ${chest.name} Opened! +${chest.reward} 🪙<br>
          <span style="font-size:2em">${chest.icon}</span>
        </div>
      `;
      setTimeout(() => this.renderMap(), 1500);
    } else {
      el.classList.add('treasure-wrong');
      resultEl.innerHTML = `
        <div class="treasure-fail">
          ❌ Wrong code! Study the working above and try another chest.
        </div>
      `;
    }
  },
};

// ==================== SIDE GAME 3: FRACTION FORGE ====================
// Drag / tap to build the correct simplified fraction from jumbled pieces

const ForgePuzzles = [
  {
    question: 'Build the simplified form of:',
    given: `<span class="frac"><span class="num">6x²</span><span class="den">9x</span></span>`,
    targetNum: '2x',
    targetDen: '3',
    numPieces: ['2x', 'x²', '6', '3x'],
    denPieces: ['3', '9', '4', '6x'],
    hint: 'Divide 6/9 by 3. Divide x²/x → x.',
  },
  {
    question: 'Build the simplified form of:',
    given: `<span class="frac"><span class="num">4a³</span><span class="den">12a</span></span>`,
    targetNum: 'a²',
    targetDen: '3',
    numPieces: ['a²', 'a³', '4a', '2a'],
    denPieces: ['3', '12', '6', '4'],
    hint: 'Divide 4/12 → 1/3. Divide a³/a → a².',
  },
  {
    question: 'Build the simplified form of:',
    given: `<span class="frac"><span class="num">10x³</span><span class="den">5x</span></span>`,
    targetNum: '2x²',
    targetDen: '1',
    numPieces: ['2x²', 'x³', '10x', '5x²'],
    denPieces: ['1', '5', '2', 'x'],
    hint: '10/5 = 2. x³/x = x².',
  },
  {
    question: 'Build the result of:',
    given: `<span class="frac"><span class="num">3x</span><span class="den">4</span></span>
            <span class="op-symbol">×</span>
            <span class="frac"><span class="num">8</span><span class="den">x²</span></span>`,
    targetNum: '6',
    targetDen: 'x',
    numPieces: ['6', '24', '3', '8x'],
    denPieces: ['x', 'x²', '4x', '12'],
    hint: 'Multiply: 3x×8=24x, 4×x²=4x². Simplify: 24x/4x²=6/x.',
  },
];

const FractionForge = {
  currentPuzzle: null,
  selectedNum: null,
  selectedDen: null,

  open() {
    const idx = Math.floor(Math.random() * ForgePuzzles.length);
    this.currentPuzzle = ForgePuzzles[idx];
    this.selectedNum = null;
    this.selectedDen = null;
    this.render();
    document.getElementById('screen-forge').style.display = 'flex';
  },

  close() {
    document.getElementById('screen-forge').style.display = 'none';
  },

  render() {
    const p = this.currentPuzzle;
    document.getElementById('forge-question').textContent = p.question;
    document.getElementById('forge-given').innerHTML = p.given;
    document.getElementById('forge-hint-text').textContent = p.hint;
    document.getElementById('forge-hint-text').style.display = 'none';
    document.getElementById('forge-result').innerHTML = '';

    // Numerator slot
    document.getElementById('forge-num-pieces').innerHTML =
      shuffle([...p.numPieces]).map(piece => `
        <div class="forge-piece" onclick="FractionForge.selectNum('${piece}', this)">
          ${piece}
        </div>
      `).join('');

    // Denominator slot
    document.getElementById('forge-den-pieces').innerHTML =
      shuffle([...p.denPieces]).map(piece => `
        <div class="forge-piece" onclick="FractionForge.selectDen('${piece}', this)">
          ${piece}
        </div>
      `).join('');

    // Clear selection displays
    document.getElementById('forge-num-slot').innerHTML = '?';
    document.getElementById('forge-den-slot').innerHTML = '?';
  },

  selectNum(val, el) {
    document.querySelectorAll('#forge-num-pieces .forge-piece')
      .forEach(p => p.classList.remove('piece-selected'));
    el.classList.add('piece-selected');
    this.selectedNum = val;
    document.getElementById('forge-num-slot').textContent = val;
    this.tryCheck();
  },

  selectDen(val, el) {
    document.querySelectorAll('#forge-den-pieces .forge-piece')
      .forEach(p => p.classList.remove('piece-selected'));
    el.classList.add('piece-selected');
    this.selectedDen = val;
    document.getElementById('forge-den-slot').textContent = val;
    this.tryCheck();
  },

  tryCheck() {
    if (this.selectedNum === null || this.selectedDen === null) return;
    const p = this.currentPuzzle;
    const correct =
      this.selectedNum === p.targetNum &&
      this.selectedDen === p.targetDen;
    this.showResult(correct);
  },

  showResult(correct) {
    const resultEl = document.getElementById('forge-result');
    if (correct) {
      const coins = 15;
      Rewards.addCoins(coins);
      resultEl.innerHTML = `
        <div class="forge-success">
          ⚒️ Forged! +${coins} 🪙<br>
          <span class="frac forge-answer">
            <span class="num">${this.currentPuzzle.targetNum}</span>
            <span class="den">${this.currentPuzzle.targetDen}</span>
          </span>
          is correct! ✨
        </div>
      `;
    } else {
      resultEl.innerHTML = `
        <div class="forge-fail">
          ❌ Not quite. Check numerator and denominator separately!<br>
          <small>Use the hint button below. 💡</small>
        </div>
      `;
      // Allow retry — deselect
      setTimeout(() => {
        this.selectedNum = null;
        this.selectedDen = null;
        document.getElementById('forge-num-slot').textContent = '?';
        document.getElementById('forge-den-slot').textContent = '?';
        document.querySelectorAll('.forge-piece').forEach(p => p.classList.remove('piece-selected'));
        resultEl.innerHTML = '';
      }, 1200);
    }
  },

  showHint() {
    document.getElementById('forge-hint-text').style.display = 'block';
  },

  nextPuzzle() {
    this.open(); // random next
  },
};

// ==================== STREAK TRACKER ====================
// Integrated into main game flow

const StreakTracker = {
  count: 0,
  hintUsedThisLevel: false,

  reset() {
    this.count = 0;
    BadgeSystem.recordWrong();
    this.updateDisplay();

    // Streak gem protection
    if (localStorage.getItem('fq_streak_protect') === '1') {
      localStorage.removeItem('fq_streak_protect');
      this.count = 1; // preserve 1
      showToast('💎 Streak Gem used! Streak protected!');
    }
  },

  increment(type) {
    this.count++;
    const streak = BadgeSystem.recordCorrect(type, this.count);
    const coinsEarned = Rewards.awardFromAnswer(
      State.currentQ ? State.currentQ.points : 10,
      this.count
    );

    // Double coins effect
    if (localStorage.getItem('fq_double_coins') === '1') {
      Rewards.addCoins(coinsEarned); // add again (double)
    }

    this.updateDisplay();
    return this.count;
  },

  levelComplete() {
    BadgeSystem.recordLevelComplete(this.hintUsedThisLevel);
    this.hintUsedThisLevel = false;
    localStorage.removeItem('fq_double_coins'); // scroll expires
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

// ==================== DAILY CHALLENGE ====================
const DailyChallenge = {

  getToday() {
    return new Date().toDateString();
  },

  isDoneToday() {
    return localStorage.getItem('fq_daily_date') === this.getToday();
  },

  complete(score) {
    localStorage.setItem('fq_daily_date', this.getToday());
    const bonus = 25;
    Rewards.addCoins(bonus);
    showToast(`📅 Daily Challenge done! +${bonus} 🪙 bonus!`);
  },

  getChallenge() {
    // Pick a question based on day of year
    const day = Math.floor(Date.now() / 86400000);
    const allQ = [
      ...QuestionBanks.level2,
      ...QuestionBanks.level3,
      ...QuestionBanks.level4,
    ];
    return allQ[day % allQ.length];
  },
};

// ==================== TOAST NOTIFICATION ====================
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast show';
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== INIT REWARDS ====================
document.addEventListener('DOMContentLoaded', () => {
  Rewards.updateCoinDisplays();

  // Hook into main game correct/wrong handlers via events
  document.addEventListener('fq:correct', (e) => {
    const streak = StreakTracker.increment(e.detail.type);
    if (streak === 3) showToast('🔥 3 in a row! Bonus coins incoming!');
    if (streak === 5) showToast('⚡ 5 streak! You\'re unstoppable!');
    if (streak === 10) showToast('👑 10 STREAK! LEGENDARY!');
  });

  document.addEventListener('fq:wrong', () => {
    StreakTracker.reset();
  });

  document.addEventListener('fq:levelcomplete', () => {
    StreakTracker.levelComplete();
  });
});