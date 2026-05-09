/* =============================================
   FRACTOQUEST — Rewards, Side Games & Badges
   ============================================= */

// ==================== COIN SYSTEM ====================
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

  awardFromAnswer(points, streakCount) {
    let coins = Math.floor(points / 5);
    if (streakCount >= 3)  coins += 2;
    if (streakCount >= 5)  coins += 3;
    if (streakCount >= 10) coins += 5;
    // Double coins scroll effect
    if (localStorage.getItem('fq_double_coins') === '1') coins *= 2;
    this.addCoins(coins);
    return coins;
  },
};

// ==================== STREAK TRACKER ====================
const StreakTracker = {
  count: 0,
  hintUsedThisLevel: false,

  increment(type) {
    this.count++;
    BadgeSystem.recordCorrect(type, this.count);
    Rewards.awardFromAnswer(
      State.currentQ ? State.currentQ.points : 10,
      this.count
    );
    this.updateDisplay();

    if (this.count === 3)  showToast('🔥 3 in a row! Bonus coins!');
    if (this.count === 5)  showToast('⚡ 5 streak! Unstoppable!');
    if (this.count === 10) showToast('👑 10 STREAK! LEGENDARY!');

    return this.count;
  },

  reset() {
    // Streak gem protection check
    if (localStorage.getItem('fq_streak_protect') === '1') {
      localStorage.removeItem('fq_streak_protect');
      showToast('💎 Streak Gem activated! Streak kept!');
      this.updateDisplay();
      return;
    }
    this.count = 0;
    BadgeSystem.recordWrong();
    this.updateDisplay();
  },

  levelComplete() {
    BadgeSystem.recordLevelComplete(this.hintUsedThisLevel);
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
    id: 'factoriser',
    name: 'The Factoriser',
    desc: 'Correctly simplify 5 expressions by factorising',
    icon: '🔍',
    condition: (s) => s.factorCorrect >= 5,
    algebra: 'Mastered: x²−a²=(x+a)(x−a)',
  },
  {
    id: 'hot_streak',
    name: 'On Fire!',
    desc: 'Answer 5 in a row correctly',
    icon: '🔥',
    condition: (s) => s.bestStreak >= 5,
    algebra: 'Streak: x₁+x₂+x₃+x₄+x₅ = 💯',
  },
  {
    id: 'grand_streak',
    name: 'Unstoppable',
    desc: 'Answer 10 in a row correctly',
    icon: '⚡',
    condition: (s) => s.bestStreak >= 10,
    algebra: 'Perfect run: no errors = fully simplified!',
  },
  {
    id: 'no_hints',
    name: 'No Hints Needed',
    desc: 'Complete a full level without any hints',
    icon: '🧠',
    condition: (s) => s.noHintLevels >= 1,
    algebra: 'Pure algebraic instinct!',
  },
  {
    id: 'potion_master',
    name: 'Potion Master',
    desc: 'Brew 3 potions successfully',
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
    id: 'forge_master',
    name: 'Forge Master',
    desc: 'Build 5 correct fractions in Fraction Forge',
    icon: '⚒️',
    condition: (s) => s.forgesBuilt >= 5,
    algebra: 'Mastered building simplified fractions!',
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
    id: 'duel_winner',
    name: 'Duel Champion',
    desc: 'Win 3 Battle Duels',
    icon: '⚔️',
    condition: (s) => s.duelsWon >= 3,
    algebra: 'Defeated opponents with algebra!',
  },
  {
    id: 'realm_master',
    name: 'Realm Master',
    desc: 'Complete all 6 levels',
    icon: '👑',
    condition: (s) => s.levelsCompleted >= 6,
    algebra: 'Full mastery: simplify, multiply, divide, factor!',
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

  saveStats(stats) {
    localStorage.setItem('fq_stats', JSON.stringify(stats));
  },

  getEarned() {
    return JSON.parse(localStorage.getItem('fq_badges') || '[]');
  },

  recordCorrect(type, streakCount) {
    const stats = this.getStats();
    stats.totalCorrect++;
    stats.currentStreak = streakCount;
    if (streakCount > stats.bestStreak) stats.bestStreak = streakCount;
    if (type === 'simplify')        stats.simplifyCorrect++;
    if (type === 'multiply')        stats.multiplyCorrect++;
    if (type === 'divide')          stats.divideCorrect++;
    if (type === 'factor-simplify') stats.factorCorrect++;
    this.saveStats(stats);
    this.checkAll(stats);
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

  recordDuelWin() {
    const stats = this.getStats();
    stats.duelsWon++;
    this.saveStats(stats);
    this.checkAll(stats);
  },

  checkAll(stats) {
    const earned = this.getEarned();
    let newlyEarned = false;
    BadgeData.forEach(badge => {
      if (!earned.includes(badge.id) && badge.condition(stats)) {
        earned.push(badge.id);
        newlyEarned = true;
        this.showBadgePopup(badge);
        Rewards.addCoins(15);
      }
    });
    if (newlyEarned) localStorage.setItem('fq_badges', JSON.stringify(earned));
  },

  showBadgePopup(badge) {
    const popup = document.getElementById('badge-popup');
    if (!popup) return;
    document.getElementById('badge-popup-icon').textContent    = badge.icon;
    document.getElementById('badge-popup-name').textContent    = badge.name;
    document.getElementById('badge-popup-desc').textContent    = badge.desc;
    document.getElementById('badge-popup-algebra').textContent = badge.algebra;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 4000);
  },

  renderCabinet() {
    const earned    = this.getEarned();
    const container = document.getElementById('badge-grid');
    if (!container) return;
    container.innerHTML = BadgeData.map(badge => {
      const isEarned = earned.includes(badge.id);
      return `
        <div class="badge-card ${isEarned ? 'earned' : 'locked'}"
             onclick="BadgeSystem.showBadgeDetail('${badge.id}')">
          <div class="badge-icon">${isEarned ? badge.icon : '🔒'}</div>
          <div class="badge-name">${isEarned ? badge.name : '???'}</div>
        </div>`;
    }).join('');
  },

  showBadgeDetail(id) {
    const badge    = BadgeData.find(b => b.id === id);
    const isEarned = this.getEarned().includes(id);
    const modal    = document.getElementById('badge-detail-modal');
    if (!modal || !badge) return;
    document.getElementById('bd-icon').textContent    = isEarned ? badge.icon : '🔒';
    document.getElementById('bd-name').textContent    = isEarned ? badge.name : 'Locked Badge';
    document.getElementById('bd-desc').textContent    = badge.desc;
    document.getElementById('bd-algebra').innerHTML   = isEarned
      ? `<span class="algebra-tag">${badge.algebra}</span>`
      : '<span style="color:var(--text-dim)">Complete the task to unlock!</span>';
    document.getElementById('bd-status').textContent  = isEarned ? '✅ Unlocked!' : '🔒 Not yet earned';
    modal.style.display = 'flex';
  },
};

// ==================== SPELL SHOP ====================
const ShopItems = [
  {
    id: 'hat_star',
    name: 'Starlight Hat',
    desc: 'A hat sparkling with math energy',
    icon: '🎩',
    price: 30,
    type: 'cosmetic',
    algebra: 'Cost: 30 = 6 × 5',
  },
  {
    id: 'robe_fire',
    name: 'Flame Robe',
    desc: 'Burns with the power of algebra',
    icon: '🔥',
    price: 40,
    type: 'cosmetic',
    algebra: 'Price: p = 8 × 5, solve for p',
  },
  {
    id: 'wand_crystal',
    name: 'Crystal Wand',
    desc: 'Amplifies correct answers',
    icon: '🔮',
    price: 25,
    type: 'cosmetic',
    algebra: 'Discount: 25 = 50 × (1−x), x = 0.5',
  },
  {
    id: 'pet_owl',
    name: 'Math Owl Familiar',
    desc: 'Gives a free hint once per level',
    icon: '🦉',
    price: 60,
    type: 'effect',
    effect: 'free_hint',
    algebra: 'Rate: 1 hint per level = 1/1',
  },
  {
    id: 'shield_gold',
    name: 'Golden Shield',
    desc: 'Block one wrong answer — life saved!',
    icon: '🛡️',
    price: 50,
    type: 'effect',
    effect: 'life_shield',
    consumable: true,
    algebra: 'Shield value: S = 1 life saved',
  },
  {
    id: 'scroll_double',
    name: 'Double Coins Scroll',
    desc: 'Earn 2× coins for one full level',
    icon: '📜',
    price: 45,
    type: 'effect',
    effect: 'double_coins',
    consumable: true,
    algebra: 'Multiplier: coins × 2 = 2c',
  },
  {
    id: 'gem_streak',
    name: 'Streak Gem',
    desc: 'Protect your streak on 1 wrong answer',
    icon: '💎',
    price: 35,
    type: 'effect',
    effect: 'streak_protect',
    consumable: true,
    algebra: 'Streak protection: s → s (no reset)',
  },
  {
    id: 'hat_dragon',
    name: 'Dragon Scale Cap',
    desc: 'Legendary wizard headgear',
    icon: '🐉',
    price: 80,
    type: 'cosmetic',
    algebra: 'Rarity: R = n! / (k!(n−k)!)',
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
      showShopMsg(`Need ${item.price} 🪙 — earn more by playing!`, false);
      return;
    }

    // Save ownership
    const owned = this.getOwned();
    if (!owned.includes(id)) owned.push(id);
    localStorage.setItem('fq_owned', JSON.stringify(owned));

    // Apply effect
    if (item.effect === 'double_coins')   localStorage.setItem('fq_double_coins', '1');
    if (item.effect === 'life_shield')    localStorage.setItem('fq_shield', '1');
    if (item.effect === 'streak_protect') localStorage.setItem('fq_streak_protect', '1');

    // Badge stat
    const stats = BadgeSystem.getStats();
    stats.itemsBought++;
    BadgeSystem.saveStats(stats);
    BadgeSystem.checkAll(stats);

    showShopMsg(`${item.icon} ${item.name} purchased! ✨`, true);
    this.render();
  },

  render() {
    const container = document.getElementById('shop-items');
    if (!container) return;
    const owned = this.getOwned();
    container.innerHTML = ShopItems.map(item => {
      const isOwned   = owned.includes(item.id) && !item.consumable;
      const canAfford = Rewards.getCoins() >= item.price;
      return `
        <div class="shop-card ${isOwned ? 'owned' : ''} ${!canAfford && !isOwned ? 'too-costly' : ''}">
          <div class="shop-icon">${item.icon}</div>
          <div class="shop-name">${item.name}</div>
          <div class="shop-desc">${item.desc}</div>
          <div class="shop-algebra">${item.algebra}</div>
          <div class="shop-price">🪙 ${item.price}</div>
          <button class="btn-shop ${isOwned ? 'btn-owned' : ''}"
                  onclick="SpellShop.buy('${item.id}')">
            ${isOwned ? '✅ Owned' : `Buy 🪙${item.price}`}
          </button>
        </div>`;
    }).join('');
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

// ==================== POTION CRAFT ====================
const PotionPuzzles = [
  {
    equation: '3x = 12', answer: 4, options: [3, 4, 6, 