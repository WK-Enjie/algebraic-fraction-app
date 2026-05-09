/* =============================================
   FRACTOQUEST — Question Banks
   All levels, all questions, all explanations
   ============================================= */

// ── HTML helpers (shared, used by questions.js, game.js, rewards.js) ──
function fracHTML(num, den) {
  return `<span class="frac"><span class="num">${num}</span><span class="den">${den}</span></span>`;
}

function stepFrac(num, den) {
  return `<span class="frac frac-step"><span class="num">${num}</span><span class="den">${den}</span></span>`;
}

function opHTML(symbol) {
  return `<span class="op-symbol">${symbol}</span>`;
}

function arrowHTML() {
  return `<span class="step-arrow">→</span>`;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ══════════════════════════════════════════════
// QUESTION BANKS
// ══════════════════════════════════════════════
const QuestionBanks = {

  // ─────────────────────────────────────────
  // LEVEL 1 — Simplify numeric fractions
  // ─────────────────────────────────────────
  level1: [
    {
      type: 'simplify',
      label: 'Simplify fully:',
      display: fracHTML('12', '18'),
      answerText: '2/3',
      correctIndex: 0,
      points: 10,
      options: [
        { label: '2/3',  html: fracHTML('2','3') },
        { label: '3/4',  html: fracHTML('3','4') },
        { label: '4/6',  html: fracHTML('4','6') },
        { label: '6/9',  html: fracHTML('6','9') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('12','18')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Common factor?</span>
          <span class="exp-note">GCF(12, 18) = <strong>6</strong></span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Divide both by 6:</span>
          ${stepFrac('12 ÷ 6','18 ÷ 6')}
          ${arrowHTML()}
          ${stepFrac('2','3')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('2','3')}</div>
      `,
    },
    {
      type: 'simplify',
      label: 'Simplify fully:',
      display: fracHTML('15', '25'),
      answerText: '3/5',
      correctIndex: 0,
      points: 10,
      options: [
        { label: '3/5',  html: fracHTML('3','5') },
        { label: '5/3',  html: fracHTML('5','3') },
        { label: '1/2',  html: fracHTML('1','2') },
        { label: '6/10', html: fracHTML('6','10') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('15','25')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Common factor?</span>
          <span class="exp-note">GCF(15, 25) = <strong>5</strong></span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Divide both by 5:</span>
          ${stepFrac('15 ÷ 5','25 ÷ 5')}
          ${arrowHTML()}
          ${stepFrac('3','5')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('3','5')}</div>
      `,
    },
    {
      type: 'simplify',
      label: 'Simplify fully:',
      display: fracHTML('24', '36'),
      answerText: '2/3',
      correctIndex: 1,
      points: 10,
      options: [
        { label: '4/6',  html: fracHTML('4','6') },
        { label: '2/3',  html: fracHTML('2','3') },
        { label: '8/12', html: fracHTML('8','12') },
        { label: '3/4',  html: fracHTML('3','4') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('24','36')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Common factor?</span>
          <span class="exp-note">GCF(24, 36) = <strong>12</strong></span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Divide both by 12:</span>
          ${stepFrac('24 ÷ 12','36 ÷ 12')}
          ${arrowHTML()}
          ${stepFrac('2','3')}
        </div>
        <div class="exp-note-box">⚠️ ${stepFrac('4','6')} is NOT fully simplified — divide again by 2!</div>
        <div class="exp-answer">✅ Answer: ${stepFrac('2','3')}</div>
      `,
    },
    {
      type: 'simplify',
      label: 'Simplify fully:',
      display: fracHTML('30', '45'),
      answerText: '2/3',
      correctIndex: 1,
      points: 10,
      options: [
        { label: '6/9',   html: fracHTML('6','9') },
        { label: '2/3',   html: fracHTML('2','3') },
        { label: '3/5',   html: fracHTML('3','5') },
        { label: '10/15', html: fracHTML('10','15') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('30','45')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Common factor?</span>
          <span class="exp-note">GCF(30, 45) = <strong>15</strong></span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Divide both by 15:</span>
          ${stepFrac('30 ÷ 15','45 ÷ 15')}
          ${arrowHTML()}
          ${stepFrac('2','3')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('2','3')}</div>
      `,
    },
    {
      type: 'simplify',
      label: 'Simplify fully:',
      display: fracHTML('14', '21'),
      answerText: '2/3',
      correctIndex: 0,
      points: 10,
      options: [
        { label: '2/3', html: fracHTML('2','3') },
        { label: '7/3', html: fracHTML('7','3') },
        { label: '4/7', html: fracHTML('4','7') },
        { label: '3/7', html: fracHTML('3','7') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('14','21')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Common factor?</span>
          <span class="exp-note">GCF(14, 21) = <strong>7</strong></span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Divide both by 7:</span>
          ${stepFrac('14 ÷ 7','21 ÷ 7')}
          ${arrowHTML()}
          ${stepFrac('2','3')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('2','3')}</div>
      `,
    },
  ],

  // ─────────────────────────────────────────
  // LEVEL 2 — Simplify algebraic fractions
  // ─────────────────────────────────────────
  level2: [
    {
      type: 'simplify',
      label: 'Simplify:',
      display: fracHTML('6x²', '9x'),
      answerText: '2x/3',
      correctIndex: 0,
      points: 15,
      options: [
        { label: '2x/3',  html: fracHTML('2x','3') },
        { label: '3x/2',  html: fracHTML('3x','2') },
        { label: '2x²/3', html: fracHTML('2x²','3') },
        { label: '6x/9',  html: fracHTML('6x','9') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('6x²','9x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Split parts:</span>
          ${stepFrac('6','9')} ${opHTML('×')} ${stepFrac('x²','x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers (÷3):</span>
          ${stepFrac('6','9')} ${arrowHTML()} ${stepFrac('2','3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Variables (x²÷x):</span>
          ${stepFrac('x²','x')} ${arrowHTML()} <span class="exp-note">x</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          ${stepFrac('2','3')} ${opHTML('×')} x ${arrowHTML()} ${stepFrac('2x','3')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('2x','3')}</div>
      `,
    },
    {
      type: 'simplify',
      label: 'Simplify:',
      display: fracHTML('4a³', '12a'),
      answerText: 'a²/3',
      correctIndex: 0,
      points: 15,
      options: [
        { label: 'a²/3',   html: fracHTML('a²','3') },
        { label: '4a²/12', html: fracHTML('4a²','12') },
        { label: 'a/3',    html: fracHTML('a','3') },
        { label: 'a³/3',   html: fracHTML('a³','3') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('4a³','12a')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Split parts:</span>
          ${stepFrac('4','12')} ${opHTML('×')} ${stepFrac('a³','a')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers (÷4):</span>
          ${stepFrac('4','12')} ${arrowHTML()} ${stepFrac('1','3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Variables (3−1=2):</span>
          ${stepFrac('a³','a')} ${arrowHTML()} <span class="exp-note">a²</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          ${stepFrac('1','3')} ${opHTML('×')} a² ${arrowHTML()} ${stepFrac('a²','3')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('a²','3')}</div>
      `,
    },
    {
      type: 'simplify',
      label: 'Simplify:',
      display: fracHTML('10x³y', '5xy'),
      answerText: '2x²',
      correctIndex: 0,
      points: 15,
      options: [
        { label: '2x²',  html: '<span class="ans-plain">2x²</span>' },
        { label: '2x³y', html: '<span class="ans-plain">2x³y</span>' },
        { label: '10x²', html: '<span class="ans-plain">10x²</span>' },
        { label: '5x²',  html: '<span class="ans-plain">5x²</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('10x³y','5xy')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Split all parts:</span>
          ${stepFrac('10','5')} ${opHTML('×')} ${stepFrac('x³','x')} ${opHTML('×')} ${stepFrac('y','y')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers (÷5):</span>
          ${stepFrac('10','5')} ${arrowHTML()} <span class="exp-note">2</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">x-terms (3−1=2):</span>
          ${stepFrac('x³','x')} ${arrowHTML()} <span class="exp-note">x²</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">y-terms:</span>
          ${stepFrac('y','y')} ${arrowHTML()} <span class="exp-note">1 (cancels)</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          <span class="exp-note">2 × x² × 1 = <strong>2x²</strong></span>
        </div>
        <div class="exp-answer">✅ Answer: 2x²</div>
      `,
    },
    {
      type: 'simplify',
      label: 'Simplify:',
      display: fracHTML('15m²n', '3mn²'),
      answerText: '5m/n',
      correctIndex: 0,
      points: 15,
      options: [
        { label: '5m/n',   html: fracHTML('5m','n') },
        { label: '5mn',    html: '<span class="ans-plain">5mn</span>' },
        { label: '15m/3n', html: fracHTML('15m','3n') },
        { label: 'm/5n',   html: fracHTML('m','5n') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('15m²n','3mn²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Split parts:</span>
          ${stepFrac('15','3')} ${opHTML('×')} ${stepFrac('m²','m')} ${opHTML('×')} ${stepFrac('n','n²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers (÷3):</span>
          ${stepFrac('15','3')} ${arrowHTML()} <span class="exp-note">5</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">m-terms (2−1=1):</span>
          ${stepFrac('m²','m')} ${arrowHTML()} <span class="exp-note">m</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">n-terms (1−2= −1):</span>
          ${stepFrac('n','n²')} ${arrowHTML()} ${stepFrac('1','n')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          5 × m × ${stepFrac('1','n')} ${arrowHTML()} ${stepFrac('5m','n')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('5m','n')}</div>
      `,
    },
    {
      type: 'simplify',
      label: 'Simplify:',
      display: fracHTML('8p²q²', '4pq'),
      answerText: '2pq',
      correctIndex: 0,
      points: 15,
      options: [
        { label: '2pq',  html: '<span class="ans-plain">2pq</span>' },
        { label: '4pq',  html: '<span class="ans-plain">4pq</span>' },
        { label: '2p²q', html: '<span class="ans-plain">2p²q</span>' },
        { label: '8pq',  html: '<span class="ans-plain">8pq</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('8p²q²','4pq')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Split parts:</span>
          ${stepFrac('8','4')} ${opHTML('×')} ${stepFrac('p²','p')} ${opHTML('×')} ${stepFrac('q²','q')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers (÷4):</span>
          ${stepFrac('8','4')} ${arrowHTML()} <span class="exp-note">2</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">p-terms:</span>
          ${stepFrac('p²','p')} ${arrowHTML()} <span class="exp-note">p</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">q-terms:</span>
          ${stepFrac('q²','q')} ${arrowHTML()} <span class="exp-note">q</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          <span class="exp-note">2 × p × q = <strong>2pq</strong></span>
        </div>
        <div class="exp-answer">✅ Answer: 2pq</div>
      `,
    },
    {
      type: 'simplify',
      label: 'Simplify:',
      display: fracHTML('9x²y³', '3xy²'),
      answerText: '3xy',
      correctIndex: 2,
      points: 15,
      options: [
        { label: '9xy',  html: '<span class="ans-plain">9xy</span>' },
        { label: '3x²y', html: '<span class="ans-plain">3x²y</span>' },
        { label: '3xy',  html: '<span class="ans-plain">3xy</span>' },
        { label: '9x/y', html: fracHTML('9x','y') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('9x²y³','3xy²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Split parts:</span>
          ${stepFrac('9','3')} ${opHTML('×')} ${stepFrac('x²','x')} ${opHTML('×')} ${stepFrac('y³','y²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers (÷3):</span>
          ${stepFrac('9','3')} ${arrowHTML()} <span class="exp-note">3</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">x-terms (2−1=1):</span>
          ${stepFrac('x²','x')} ${arrowHTML()} <span class="exp-note">x</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">y-terms (3−2=1):</span>
          ${stepFrac('y³','y²')} ${arrowHTML()} <span class="exp-note">y</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          <span class="exp-note">3 × x × y = <strong>3xy</strong></span>
        </div>
        <div class="exp-answer">✅ Answer: 3xy</div>
      `,
    },
  ],

  // ─────────────────────────────────────────
  // LEVEL 3 — Multiply algebraic fractions
  // ─────────────────────────────────────────
  level3: [
    {
      type: 'multiply',
      label: 'Multiply and simplify:',
      display: `${fracHTML('3x','4')} ${opHTML('×')} ${fracHTML('8','x²')}`,
      answerText: '6/x',
      correctIndex: 0,
      points: 20,
      options: [
        { label: '6/x',     html: fracHTML('6','x') },
        { label: '24x/4x²', html: fracHTML('24x','4x²') },
        { label: '6x',      html: '<span class="ans-plain">6x</span>' },
        { label: '3/x',     html: fracHTML('3','x') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('3x','4')} ${opHTML('×')} ${stepFrac('8','x²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply tops &amp; bottoms:</span>
          ${stepFrac('3x × 8','4 × x²')} ${arrowHTML()} ${stepFrac('24x','4x²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers:</span>
          ${stepFrac('24','4')} ${arrowHTML()} <span class="exp-note">6</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify x-terms:</span>
          ${stepFrac('x','x²')} ${arrowHTML()} ${stepFrac('1','x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          6 × ${stepFrac('1','x')} ${arrowHTML()} ${stepFrac('6','x')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('6','x')}</div>
      `,
    },
    {
      type: 'multiply',
      label: 'Multiply and simplify:',
      display: `${fracHTML('2a','5')} ${opHTML('×')} ${fracHTML('15','4a²')}`,
      answerText: '3/2a',
      correctIndex: 0,
      points: 20,
      options: [
        { label: '3/2a',   html: fracHTML('3','2a') },
        { label: '6/5a',   html: fracHTML('6','5a') },
        { label: '15/4a',  html: fracHTML('15','4a') },
        { label: '30a/20', html: fracHTML('30a','20') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('2a','5')} ${opHTML('×')} ${stepFrac('15','4a²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply tops &amp; bottoms:</span>
          ${stepFrac('2a × 15','5 × 4a²')} ${arrowHTML()} ${stepFrac('30a','20a²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers:</span>
          ${stepFrac('30','20')} ${arrowHTML()} ${stepFrac('3','2')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify a-terms:</span>
          ${stepFrac('a','a²')} ${arrowHTML()} ${stepFrac('1','a')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          ${stepFrac('3','2')} × ${stepFrac('1','a')} ${arrowHTML()} ${stepFrac('3','2a')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('3','2a')}</div>
      `,
    },
    {
      type: 'multiply',
      label: 'Multiply and simplify:',
      display: `${fracHTML('x²','3')} ${opHTML('×')} ${fracHTML('6','x')}`,
      answerText: '2x',
      correctIndex: 0,
      points: 20,
      options: [
        { label: '2x',     html: '<span class="ans-plain">2x</span>' },
        { label: '6x²/3x', html: fracHTML('6x²','3x') },
        { label: '3x',     html: '<span class="ans-plain">3x</span>' },
        { label: '2x²',    html: '<span class="ans-plain">2x²</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('x²','3')} ${opHTML('×')} ${stepFrac('6','x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply tops &amp; bottoms:</span>
          ${stepFrac('x² × 6','3 × x')} ${arrowHTML()} ${stepFrac('6x²','3x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers:</span>
          ${stepFrac('6','3')} ${arrowHTML()} <span class="exp-note">2</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify x-terms:</span>
          ${stepFrac('x²','x')} ${arrowHTML()} <span class="exp-note">x</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          <span class="exp-note">2 × x = <strong>2x</strong></span>
        </div>
        <div class="exp-answer">✅ Answer: 2x</div>
      `,
    },
    {
      type: 'multiply',
      label: 'Multiply and simplify:',
      display: `${fracHTML('4p²','6q')} ${opHTML('×')} ${fracHTML('3q²','2p')}`,
      answerText: 'pq',
      correctIndex: 0,
      points: 20,
      options: [
        { label: 'pq',   html: '<span class="ans-plain">pq</span>' },
        { label: '2pq',  html: '<span class="ans-plain">2pq</span>' },
        { label: 'p²q',  html: '<span class="ans-plain">p²q</span>' },
        { label: '6p²q', html: '<span class="ans-plain">6p²q</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('4p²','6q')} ${opHTML('×')} ${stepFrac('3q²','2p')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply tops &amp; bottoms:</span>
          ${stepFrac('4p² × 3q²','6q × 2p')} ${arrowHTML()} ${stepFrac('12p²q²','12pq')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers:</span>
          ${stepFrac('12','12')} ${arrowHTML()} <span class="exp-note">1</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">p-terms:</span>
          ${stepFrac('p²','p')} ${arrowHTML()} <span class="exp-note">p</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">q-terms:</span>
          ${stepFrac('q²','q')} ${arrowHTML()} <span class="exp-note">q</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          <span class="exp-note">1 × p × q = <strong>pq</strong></span>
        </div>
        <div class="exp-answer">✅ Answer: pq</div>
      `,
    },
    {
      type: 'multiply',
      label: 'Multiply and simplify:',
      display: `${fracHTML('5','x')} ${opHTML('×')} ${fracHTML('x²','10')}`,
      answerText: 'x/2',
      correctIndex: 0,
      points: 20,
      options: [
        { label: 'x/2',   html: fracHTML('x','2') },
        { label: '5x/10', html: fracHTML('5x','10') },
        { label: 'x²/2',  html: fracHTML('x²','2') },
        { label: '2/x',   html: fracHTML('2','x') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('5','x')} ${opHTML('×')} ${stepFrac('x²','10')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply tops &amp; bottoms:</span>
          ${stepFrac('5 × x²','x × 10')} ${arrowHTML()} ${stepFrac('5x²','10x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers:</span>
          ${stepFrac('5','10')} ${arrowHTML()} ${stepFrac('1','2')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify x-terms:</span>
          ${stepFrac('x²','x')} ${arrowHTML()} <span class="exp-note">x</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          ${stepFrac('1','2')} × x ${arrowHTML()} ${stepFrac('x','2')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('x','2')}</div>
      `,
    },
    {
      type: 'multiply',
      label: 'Multiply and simplify:',
      display: `${fracHTML('3a²','4b')} ${opHTML('×')} ${fracHTML('8b²','9a')}`,
      answerText: '2ab/3',
      correctIndex: 1,
      points: 20,
      options: [
        { label: 'ab/3',  html: fracHTML('ab','3') },
        { label: '2ab/3', html: fracHTML('2ab','3') },
        { label: '2a²b',  html: '<span class="ans-plain">2a²b</span>' },
        { label: '6ab/4', html: fracHTML('6ab','4') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('3a²','4b')} ${opHTML('×')} ${stepFrac('8b²','9a')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('3a² × 8b²','4b × 9a')} ${arrowHTML()} ${stepFrac('24a²b²','36ab')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers:</span>
          ${stepFrac('24','36')} ${arrowHTML()} ${stepFrac('2','3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">a-terms:</span>
          ${stepFrac('a²','a')} ${arrowHTML()} <span class="exp-note">a</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">b-terms:</span>
          ${stepFrac('b²','b')} ${arrowHTML()} <span class="exp-note">b</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          ${stepFrac('2','3')} × ab ${arrowHTML()} ${stepFrac('2ab','3')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('2ab','3')}</div>
      `,
    },
  ],

  // ─────────────────────────────────────────
  // LEVEL 4 — Divide algebraic fractions
  // ─────────────────────────────────────────
  level4: [
    {
      type: 'divide',
      label: 'Divide and simplify:',
      display: `${fracHTML('4x²','3')} ${opHTML('÷')} ${fracHTML('2x','9')}`,
      answerText: '6x',
      correctIndex: 0,
      points: 25,
      options: [
        { label: '6x',    html: '<span class="ans-plain">6x</span>' },
        { label: '8x³/6', html: fracHTML('8x³','6') },
        { label: '6x²',   html: '<span class="ans-plain">6x²</span>' },
        { label: '3x',    html: '<span class="ans-plain">3x</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (KCF Method)</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('4x²','3')} ${opHTML('÷')} ${stepFrac('2x','9')}
        </div>
        <div class="exp-note-box">KCF: <strong>K</strong>eep · <strong>C</strong>hange ÷ to × · <strong>F</strong>lip 2nd fraction</div>
        <div class="exp-row">
          <span class="exp-label">After KCF:</span>
          ${stepFrac('4x²','3')} ${opHTML('×')} ${stepFrac('9','2x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('4x² × 9','3 × 2x')} ${arrowHTML()} ${stepFrac('36x²','6x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers:</span>
          ${stepFrac('36','6')} ${arrowHTML()} <span class="exp-note">6</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">x-terms:</span>
          ${stepFrac('x²','x')} ${arrowHTML()} <span class="exp-note">x</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          <span class="exp-note">6 × x = <strong>6x</strong></span>
        </div>
        <div class="exp-answer">✅ Answer: 6x</div>
      `,
    },
    {
      type: 'divide',
      label: 'Divide and simplify:',
      display: `${fracHTML('6a','5')} ${opHTML('÷')} ${fracHTML('3','10a')}`,
      answerText: '4a²',
      correctIndex: 0,
      points: 25,
      options: [
        { label: '4a²',    html: '<span class="ans-plain">4a²</span>' },
        { label: '2a/5',   html: fracHTML('2a','5') },
        { label: '4a',     html: '<span class="ans-plain">4a</span>' },
        { label: '12a²/5', html: fracHTML('12a²','5') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (KCF Method)</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('6a','5')} ${opHTML('÷')} ${stepFrac('3','10a')}
        </div>
        <div class="exp-note-box">KCF: Keep · Change · Flip</div>
        <div class="exp-row">
          <span class="exp-label">After KCF:</span>
          ${stepFrac('6a','5')} ${opHTML('×')} ${stepFrac('10a','3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('6a × 10a','5 × 3')} ${arrowHTML()} ${stepFrac('60a²','15')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify:</span>
          ${stepFrac('60','15')} ${arrowHTML()} <span class="exp-note">4</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Final:</span>
          <span class="exp-note">4 × a² = <strong>4a²</strong></span>
        </div>
        <div class="exp-answer">✅ Answer: 4a²</div>
      `,
    },
    {
      type: 'divide',
      label: 'Divide and simplify:',
      display: `${fracHTML('8m³','4')} ${opHTML('÷')} ${fracHTML('2m','1')}`,
      answerText: 'm²',
      correctIndex: 0,
      points: 25,
      options: [
        { label: 'm²',  html: '<span class="ans-plain">m²</span>' },
        { label: '2m²', html: '<span class="ans-plain">2m²</span>' },
        { label: '4m²', html: '<span class="ans-plain">4m²</span>' },
        { label: 'm³',  html: '<span class="ans-plain">m³</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (KCF Method)</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('8m³','4')} ${opHTML('÷')} ${stepFrac('2m','1')}
        </div>
        <div class="exp-note-box">KCF: Keep · Change · Flip</div>
        <div class="exp-row">
          <span class="exp-label">After KCF:</span>
          ${stepFrac('8m³','4')} ${opHTML('×')} ${stepFrac('1','2m')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('8m³ × 1','4 × 2m')} ${arrowHTML()} ${stepFrac('8m³','8m')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers:</span>
          ${stepFrac('8','8')} ${arrowHTML()} <span class="exp-note">1</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">m-terms (3−1=2):</span>
          ${stepFrac('m³','m')} ${arrowHTML()} <span class="exp-note">m²</span>
        </div>
        <div class="exp-answer">✅ Answer: m²</div>
      `,
    },
    {
      type: 'divide',
      label: 'Divide and simplify:',
      display: `${fracHTML('x²y','2')} ${opHTML('÷')} ${fracHTML('xy','4')}`,
      answerText: '2x',
      correctIndex: 0,
      points: 25,
      options: [
        { label: '2x',   html: '<span class="ans-plain">2x</span>' },
        { label: '2xy',  html: '<span class="ans-plain">2xy</span>' },
        { label: 'x²/2', html: fracHTML('x²','2') },
        { label: '4x',   html: '<span class="ans-plain">4x</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (KCF Method)</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('x²y','2')} ${opHTML('÷')} ${stepFrac('xy','4')}
        </div>
        <div class="exp-note-box">KCF: Keep · Change · Flip</div>
        <div class="exp-row">
          <span class="exp-label">After KCF:</span>
          ${stepFrac('x²y','2')} ${opHTML('×')} ${stepFrac('4','xy')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('x²y × 4','2 × xy')} ${arrowHTML()} ${stepFrac('4x²y','2xy')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers:</span>
          ${stepFrac('4','2')} ${arrowHTML()} <span class="exp-note">2</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">x-terms:</span>
          ${stepFrac('x²','x')} ${arrowHTML()} <span class="exp-note">x</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">y-terms:</span>
          ${stepFrac('y','y')} ${arrowHTML()} <span class="exp-note">1 (cancels)</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          <span class="exp-note">2 × x = <strong>2x</strong></span>
        </div>
        <div class="exp-answer">✅ Answer: 2x</div>
      `,
    },
    {
      type: 'divide',
      label: 'Divide and simplify:',
      display: `${fracHTML('15p','4')} ${opHTML('÷')} ${fracHTML('5p²','2')}`,
      answerText: '3/2p',
      correctIndex: 0,
      points: 25,
      options: [
        { label: '3/2p', html: fracHTML('3','2p') },
        { label: '6/p',  html: fracHTML('6','p') },
        { label: '3p/2', html: fracHTML('3p','2') },
        { label: '2/3p', html: fracHTML('2','3p') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (KCF Method)</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('15p','4')} ${opHTML('÷')} ${stepFrac('5p²','2')}
        </div>
        <div class="exp-note-box">KCF: Keep · Change · Flip</div>
        <div class="exp-row">
          <span class="exp-label">After KCF:</span>
          ${stepFrac('15p','4')} ${opHTML('×')} ${stepFrac('2','5p²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('15p × 2','4 × 5p²')} ${arrowHTML()} ${stepFrac('30p','20p²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers:</span>
          ${stepFrac('30','20')} ${arrowHTML()} ${stepFrac('3','2')}
        </div>
        <div class="exp-row">
          <span class="exp-label">p-terms:</span>
          ${stepFrac('p','p²')} ${arrowHTML()} ${stepFrac('1','p')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          ${stepFrac('3','2')} × ${stepFrac('1','p')} ${arrowHTML()} ${stepFrac('3','2p')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('3','2p')}</div>
      `,
    },
    {
      type: 'divide',
      label: 'Divide and simplify:',
      display: `${fracHTML('12x²','5y')} ${opHTML('÷')} ${fracHTML('4x','15y²')}`,
      answerText: '9xy',
      correctIndex: 2,
      points: 25,
      options: [
        { label: '9x/y', html: fracHTML('9x','y') },
        { label: '3xy',  html: '<span class="ans-plain">3xy</span>' },
        { label: '9xy',  html: '<span class="ans-plain">9xy</span>' },
        { label: '12xy', html: '<span class="ans-plain">12xy</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (KCF Method)</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('12x²','5y')} ${opHTML('÷')} ${stepFrac('4x','15y²')}
        </div>
        <div class="exp-note-box">KCF: Keep · Change · Flip</div>
        <div class="exp-row">
          <span class="exp-label">After KCF:</span>
          ${stepFrac('12x²','5y')} ${opHTML('×')} ${stepFrac('15y²','4x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('12x² × 15y²','5y × 4x')} ${arrowHTML()} ${stepFrac('180x²y²','20xy')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Numbers:</span>
          ${stepFrac('180','20')} ${arrowHTML()} <span class="exp-note">9</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">x-terms:</span>
          ${stepFrac('x²','x')} ${arrowHTML()} <span class="exp-note">x</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">y-terms:</span>
          ${stepFrac('y²','y')} ${arrowHTML()} <span class="exp-note">y</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          <span class="exp-note">9 × x × y = <strong>9xy</strong></span>
        </div>
        <div class="exp-answer">✅ Answer: 9xy</div>
      `,
    },
  ],

  // ─────────────────────────────────────────
  // LEVEL 5 — Factorise then simplify
  // ─────────────────────────────────────────
  level5: [
    {
      type: 'factor-simplify',
      label: 'Factorise then simplify:',
      display: fracHTML('x² − 4', 'x + 2'),
      answerText: 'x − 2',
      correctIndex: 0,
      points: 30,
      options: [
        { label: 'x − 2',  html: '<span class="ans-plain">x − 2</span>' },
        { label: 'x + 2',  html: '<span class="ans-plain">x + 2</span>' },
        { label: 'x − 4',  html: '<span class="ans-plain">x − 4</span>' },
        { label: 'x² − 2', html: '<span class="ans-plain">x² − 2</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('x² − 4','x + 2')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Factorise numerator:</span>
          <span class="exp-note">x² − 4 = <strong>(x + 2)(x − 2)</strong></span>
        </div>
        <div class="exp-note-box">Difference of two squares: a² − b² = (a+b)(a−b)</div>
        <div class="exp-row">
          <span class="exp-label">Rewrite:</span>
          ${stepFrac('(x + 2)(x − 2)','x + 2')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel (x + 2):</span>
          <span class="exp-note">(x − 2)</span>
        </div>
        <div class="exp-answer">✅ Answer: x − 2</div>
      `,
    },
    {
      type: 'factor-simplify',
      label: 'Factorise then simplify:',
      display: fracHTML('x² + 3x', 'x'),
      answerText: 'x + 3',
      correctIndex: 0,
      points: 30,
      options: [
        { label: 'x + 3',  html: '<span class="ans-plain">x + 3</span>' },
        { label: 'x² + 3', html: '<span class="ans-plain">x² + 3</span>' },
        { label: 'x²',     html: '<span class="ans-plain">x²</span>' },
        { label: '3x',     html: '<span class="ans-plain">3x</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('x² + 3x','x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Factorise numerator:</span>
          <span class="exp-note">x² + 3x = <strong>x(x + 3)</strong></span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Rewrite:</span>
          ${stepFrac('x(x + 3)','x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel x:</span>
          <span class="exp-note">x + 3</span>
        </div>
        <div class="exp-answer">✅ Answer: x + 3</div>
      `,
    },
    {
      type: 'factor-simplify',
      label: 'Factorise then simplify:',
      display: fracHTML('2x² + 6x', '4x'),
      answerText: '(x+3)/2',
      correctIndex: 0,
      points: 30,
      options: [
        { label: '(x+3)/2',  html: fracHTML('x + 3','2') },
        { label: '(2x+6)/4', html: fracHTML('2x + 6','4') },
        { label: 'x + 3',    html: '<span class="ans-plain">x + 3</span>' },
        { label: '(x+3)/4',  html: fracHTML('x + 3','4') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('2x² + 6x','4x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Factorise numerator:</span>
          <span class="exp-note">2x² + 6x = <strong>2x(x + 3)</strong></span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Rewrite:</span>
          ${stepFrac('2x(x + 3)','4x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel 2x:</span>
          ${stepFrac('x + 3','2')}
        </div>
        <div class="exp-note-box">2x ÷ 2x = 1 (top) &nbsp;|&nbsp; 4x ÷ 2x = 2 (bottom)</div>
        <div class="exp-answer">✅ Answer: ${stepFrac('x + 3','2')}</div>
      `,
    },
    {
      type: 'factor-simplify',
      label: 'Factorise then simplify:',
      display: fracHTML('x² − 9', 'x − 3'),
      answerText: 'x + 3',
      correctIndex: 0,
      points: 30,
      options: [
        { label: 'x + 3', html: '<span class="ans-plain">x + 3</span>' },
        { label: 'x − 3', html: '<span class="ans-plain">x − 3</span>' },
        { label: 'x + 9', html: '<span class="ans-plain">x + 9</span>' },
        { label: 'x − 9', html: '<span class="ans-plain">x − 9</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('x² − 9','x − 3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Factorise numerator:</span>
          <span class="exp-note">x² − 9 = <strong>(x + 3)(x − 3)</strong></span>
        </div>
        <div class="exp-note-box">Difference of two squares: a² − b² = (a+b)(a−b)</div>
        <div class="exp-row">
          <span class="exp-label">Rewrite:</span>
          ${stepFrac('(x + 3)(x − 3)','x − 3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel (x − 3):</span>
          <span class="exp-note">x + 3</span>
        </div>
        <div class="exp-answer">✅ Answer: x + 3</div>
      `,
    },
    {
      type: 'multiply',
      label: 'Multiply and simplify:',
      display: `${fracHTML('3x','x² + x')} ${opHTML('×')} ${fracHTML('x + 1','6')}`,
      answerText: '1/2',
      correctIndex: 0,
      points: 30,
      options: [
        { label: '1/2',  html: fracHTML('1','2') },
        { label: '3x/6', html: fracHTML('3x','6') },
        { label: 'x/2',  html: fracHTML('x','2') },
        { label: '3/2',  html: fracHTML('3','2') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('3x','x² + x')} ${opHTML('×')} ${stepFrac('x + 1','6')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Factorise x² + x:</span>
          <span class="exp-note">x² + x = <strong>x(x + 1)</strong></span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Rewrite:</span>
          ${stepFrac('3x','x(x + 1)')} ${opHTML('×')} ${stepFrac('x + 1','6')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('3x(x + 1)','6x(x + 1)')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel x and (x+1):</span>
          ${stepFrac('3','6')} ${arrowHTML()} ${stepFrac('1','2')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('1','2')}</div>
      `,
    },
    {
      type: 'divide',
      label: 'Divide and simplify:',
      display: `${fracHTML('4x² + 8x','3')} ${opHTML('÷')} ${fracHTML('x + 2','6')}`,
      answerText: '8x',
      correctIndex: 1,
      points: 30,
      options: [
        { label: '4x',  html: '<span class="ans-plain">4x</span>' },
        { label: '8x',  html: '<span class="ans-plain">8x</span>' },
        { label: '8x²', html: '<span class="ans-plain">8x²</span>' },
        { label: '4/3x',html: fracHTML('4','3x') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('4x² + 8x','3')} ${opHTML('÷')} ${stepFrac('x + 2','6')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Factorise 4x²+8x:</span>
          <span class="exp-note">4x² + 8x = <strong>4x(x + 2)</strong></span>
        </div>
        <div class="exp-note-box">KCF: Keep · Change · Flip</div>
        <div class="exp-row">
          <span class="exp-label">After KCF:</span>
          ${stepFrac('4x(x + 2)','3')} ${opHTML('×')} ${stepFrac('6','x + 2')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('4x(x+2) × 6','3(x+2)')} ${arrowHTML()} ${stepFrac('24x(x+2)','3(x+2)')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel (x+2):</span>
          ${stepFrac('24x','3')} ${arrowHTML()} <span class="exp-note">8x</span>
        </div>
        <div class="exp-answer">✅ Answer: 8x</div>
      `,
    },
  ],

  // ─────────────────────────────────────────
  // LEVEL 6 — Boss: multi-step mixed
  // ─────────────────────────────────────────
  level6: [
    {
      type: 'mixed',
      label: 'Evaluate (left to right):',
      display: `${fracHTML('4x²','6y')} ${opHTML('÷')} ${fracHTML('2x','3y²')} ${opHTML('×')} ${fracHTML('y','x²')}`,
      answerText: 'y²/x',
      correctIndex: 0,
      points: 40,
      options: [
        { label: 'y²/x', html: fracHTML('y²','x') },
        { label: 'y',    html: '<span class="ans-plain">y</span>' },
        { label: 'xy',   html: '<span class="ans-plain">xy</span>' },
        { label: 'x/y',  html: fracHTML('x','y') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (Left → Right)</div>
        <div class="exp-row">
          <span class="exp-label">Step 1 — ÷ pair:</span>
          ${stepFrac('4x²','6y')} ${opHTML('÷')} ${stepFrac('2x','3y²')}
        </div>
        <div class="exp-row exp-indent">
          KCF: ${stepFrac('4x²','6y')} ${opHTML('×')} ${stepFrac('3y²','2x')}
          ${arrowHTML()} ${stepFrac('12x²y²','12xy')} ${arrowHTML()} <span class="exp-note">xy</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Step 2 — × last:</span>
          xy ${opHTML('×')} ${stepFrac('y','x²')}
          ${arrowHTML()} ${stepFrac('xy²','x²')} ${arrowHTML()} ${stepFrac('y²','x')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('y²','x')}</div>
      `,
    },
    {
      type: 'mixed',
      label: 'Simplify:',
      display: `${fracHTML('x² + 5x + 6','x + 3')} ${opHTML('÷')} <span class="ans-plain">(x + 2)</span>`,
      answerText: '1',
      correctIndex: 0,
      points: 40,
      options: [
        { label: '1',          html: '<span class="ans-plain">1</span>' },
        { label: 'x + 2',      html: '<span class="ans-plain">x + 2</span>' },
        { label: 'x + 3',      html: '<span class="ans-plain">x + 3</span>' },
        { label: '(x+2)(x+3)', html: '<span class="ans-plain">(x+2)(x+3)</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('x² + 5x + 6','x + 3')} ${opHTML('÷')} (x + 2)
        </div>
        <div class="exp-row">
          <span class="exp-label">Factorise:</span>
          <span class="exp-note">x²+5x+6 = <strong>(x+2)(x+3)</strong></span>
        </div>
        <div class="exp-note-box">Find two numbers: multiply to 6, add to 5 → 2 and 3 ✓</div>
        <div class="exp-row">
          <span class="exp-label">Cancel (x+3):</span>
          ${stepFrac('(x+2)(x+3)','x+3')} ${arrowHTML()} (x+2)
        </div>
        <div class="exp-row">
          <span class="exp-label">÷ (x+2):</span>
          (x+2) ÷ (x+2) ${arrowHTML()} <span class="exp-note"><strong>1</strong></span>
        </div>
        <div class="exp-answer">✅ Answer: 1</div>
      `,
    },
    {
      type: 'mixed',
      label: 'Evaluate:',
      display: `${fracHTML('a²b','3')} ${opHTML('÷')} ${fracHTML('a','6b')} ${opHTML('÷')} ${fracHTML('2b','a')}`,
      answerText: 'a²b',
      correctIndex: 0,
      points: 40,
      options: [
        { label: 'a²b',  html: '<span class="ans-plain">a²b</span>' },
        { label: '2ab²', html: '<span class="ans-plain">2ab²</span>' },
        { label: 'a²b²', html: '<span class="ans-plain">a²b²</span>' },
        { label: '3ab',  html: '<span class="ans-plain">3ab</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (Left → Right)</div>
        <div class="exp-row">
          <span class="exp-label">Step 1:</span>
          ${stepFrac('a²b','3')} ${opHTML('÷')} ${stepFrac('a','6b')}
        </div>
        <div class="exp-row exp-indent">
          KCF: ${stepFrac('a²b','3')} ${opHTML('×')} ${stepFrac('6b','a')}
          ${arrowHTML()} ${stepFrac('6a²b²','3a')} ${arrowHTML()} <span class="exp-note">2ab²</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Step 2:</span>
          2ab² ${opHTML('÷')} ${stepFrac('2b','a')}
        </div>
        <div class="exp-row exp-indent">
          KCF: 2ab² ${opHTML('×')} ${stepFrac('a','2b')}
          ${arrowHTML()} ${stepFrac('2a²b²','2b')} ${arrowHTML()} <span class="exp-note">a²b</span>
        </div>
        <div class="exp-answer">✅ Answer: a²b</div>
      `,
    },
    {
      type: 'mixed',
      label: 'Multiply and simplify:',
      display: `${fracHTML('2x','y')} ${opHTML('×')} ${fracHTML('3y²','4x²')} ${opHTML('÷')} ${fracHTML('3y','2x')}`,
      answerText: '1',
      correctIndex: 0,
      points: 40,
      options: [
        { label: '1',     html: '<span class="ans-plain">1</span>' },
        { label: '3y/2x', html: fracHTML('3y','2x') },
        { label: '2x/y',  html: fracHTML('2x','y') },
        { label: '3/2',   html: fracHTML('3','2') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (Left → Right)</div>
        <div class="exp-row">
          <span class="exp-label">Step 1 — × first:</span>
          ${stepFrac('2x','y')} ${opHTML('×')} ${stepFrac('3y²','4x²')}
          ${arrowHTML()} ${stepFrac('6xy²','4x²y')} ${arrowHTML()} ${stepFrac('3y','2x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Step 2 — ÷ last:</span>
          ${stepFrac('3y','2x')} ${opHTML('÷')} ${stepFrac('3y','2x')}
        </div>
        <div class="exp-row exp-indent">
          KCF: ${stepFrac('3y','2x')} ${opHTML('×')} ${stepFrac('2x','3y')}
          ${arrowHTML()} ${stepFrac('6xy','6xy')} ${arrowHTML()} <span class="exp-note"><strong>1</strong></span>
        </div>
        <div class="exp-answer">✅ Answer: 1</div>
      `,
    },
    {
      type: 'mixed',
      label: 'Simplify:',
      display: `${fracHTML('x² − x − 6','x + 2')} ${opHTML('×')} ${fracHTML('x + 2','x − 3')}`,
      answerText: '1',
      correctIndex: 2,
      points: 40,
      options: [
        { label: 'x − 3',      html: '<span class="ans-plain">x − 3</span>' },
        { label: '(x+2)(x−3)', html: '<span class="ans-plain">(x+2)(x−3)</span>' },
        { label: '1',          html: '<span class="ans-plain">1</span>' },
        { label: 'x + 2',      html: '<span class="ans-plain">x + 2</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('x² − x − 6','x + 2')} ${opHTML('×')} ${stepFrac('x + 2','x − 3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Factorise:</span>
          <span class="exp-note">x²−x−6 = <strong>(x−3)(x+2)</strong></span>
        </div>
        <div class="exp-note-box">Numbers: multiply to −6, add to −1 → −3 and +2 ✓</div>
        <div class="exp-row">
          <span class="exp-label">Rewrite:</span>
          ${stepFrac('(x−3)(x+2)','x+2')} ${opHTML('×')} ${stepFrac('x+2','x−3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">All factors cancel:</span>
          ${stepFrac('(x−3)(x+2) × (x+2)','(x+2) × (x−3)')}
          ${arrowHTML()} <span class="exp-note"><strong>1</strong></span>
        </div>
        <div class="exp-answer">✅ Answer: 1</div>
      `,
    },
  ],
};