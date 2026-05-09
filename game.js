/* =============================================
   FRACTOQUEST - Game Logic (Rectified)
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
  totalStars: 0,
  levelStars: [0, 0, 0, 0, 0, 0],
  speedTimer: null,
  timeLeft: 60,
  duelScores: [0, 0],
  duelTurn: 0,
  selectedMCQ: null,
  currentQ: null,
  learnMode: false,
  highScores: [],
};

// ==================== HTML HELPERS ====================
function fracHTML(num, den) {
  return `<span class="frac"><span class="num">${num}</span><span class="den">${den}</span></span>`;
}

function stepFrac(num, den) {
  // Larger rendering for explanation steps
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

// ==================== QUESTION BANKS ====================
// explanationHTML: renders proper fraction visuals in the feedback box

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
        { label: '2/3',   html: fracHTML('2','3') },
        { label: '3/4',   html: fracHTML('3','4') },
        { label: '4/6',   html: fracHTML('4','6') },
        { label: '6/9',   html: fracHTML('6','9') },
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
        { label: '3/5',   html: fracHTML('3','5') },
        { label: '5/3',   html: fracHTML('5','3') },
        { label: '1/2',   html: fracHTML('1','2') },
        { label: '6/10',  html: fracHTML('6','10') },
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
        <div class="exp-note">⚠️ Note: ${stepFrac('4','6')} is not fully simplified — divide again by 2!</div>
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
        { label: '2/3',  html: fracHTML('2','3') },
        { label: '7/3',  html: fracHTML('7','3') },
        { label: '4/7',  html: fracHTML('4','7') },
        { label: '3/7',  html: fracHTML('3','7') },
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
  // LEVEL 2 — Simplify algebraic fractions (monomials)
  //           Mix of standard + non-factorise
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
          <span class="exp-label">Split into number and variable parts:</span>
        </div>
        <div class="exp-row exp-indent">
          ${stepFrac('6','9')} ${opHTML('×')} ${stepFrac('x²','x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers (÷3):</span>
          ${stepFrac('6','9')} ${arrowHTML()} ${stepFrac('2','3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify variables (x²÷x):</span>
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
          <span class="exp-label">Variables:</span>
          ${stepFrac('a³','a')} ${arrowHTML()} <span class="exp-note">a² &nbsp;(subtract powers: 3−1=2)</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          ${stepFrac('1','3')} ${opHTML('×')} a² ${arrowHTML()} ${stepFrac('a²','3')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('a²','3')}</div>
      `,
    },
    {
      // Non-factorise: direct cancellation, answer is a whole expression
      type: 'simplify',
      label: 'Simplify:',
      display: fracHTML('10x³y', '5xy'),
      answerText: '2x²',
      correctIndex: 0,
      points: 15,
      options: [
        { label: '2x²',   html: '<span class="ans-plain">2x²</span>' },
        { label: '2x³y',  html: '<span class="ans-plain">2x³y</span>' },
        { label: '10x²',  html: '<span class="ans-plain">10x²</span>' },
        { label: '5x²',   html: '<span class="ans-plain">5x²</span>' },
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
          <span class="exp-label">x-terms:</span>
          ${stepFrac('x³','x')} ${arrowHTML()} <span class="exp-note">x² &nbsp;(3−1=2)</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">y-terms:</span>
          ${stepFrac('y','y')} ${arrowHTML()} <span class="exp-note">1 &nbsp;(cancels fully)</span>
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
          <span class="exp-label">m-terms:</span>
          ${stepFrac('m²','m')} ${arrowHTML()} <span class="exp-note">m &nbsp;(2−1=1)</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">n-terms:</span>
          ${stepFrac('n','n²')} ${arrowHTML()} ${stepFrac('1','n')} &nbsp;(1−2 = −1)
        </div>
        <div class="exp-row">
          <span class="exp-label">Combine:</span>
          5 × m × ${stepFrac('1','n')} ${arrowHTML()} ${stepFrac('5m','n')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('5m','n')}</div>
      `,
    },
    {
      // Non-factorise: simple cancellation — answer is a whole term
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
      // Extra non-factorise question
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
          <span class="exp-label">x-terms:</span>
          ${stepFrac('x²','x')} ${arrowHTML()} <span class="exp-note">x &nbsp;(2−1=1)</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">y-terms:</span>
          ${stepFrac('y³','y²')} ${arrowHTML()} <span class="exp-note">y &nbsp;(3−2=1)</span>
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
        { label: '6/x',      html: fracHTML('6','x') },
        { label: '24x/4x²',  html: fracHTML('24x','4x²') },
        { label: '6x',       html: '<span class="ans-plain">6x</span>' },
        { label: '3/x',      html: fracHTML('3','x') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('3x','4')} ${opHTML('×')} ${stepFrac('8','x²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply tops & bottoms:</span>
        </div>
        <div class="exp-row exp-indent">
          ${stepFrac('3x × 8','4 × x²')} ${arrowHTML()} ${stepFrac('24x','4x²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers:</span>
          ${stepFrac('24','4')} ${arrowHTML()} <span class="exp-note">6</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify variables:</span>
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
          <span class="exp-label">Multiply tops & bottoms:</span>
        </div>
        <div class="exp-row exp-indent">
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
      // Non-factorise: answer is a whole expression, no fraction
      type: 'multiply',
      label: 'Multiply and simplify:',
      display: `${fracHTML('x²','3')} ${opHTML('×')} ${fracHTML('6','x')}`,
      answerText: '2x',
      correctIndex: 0,
      points: 20,
      options: [
        { label: '2x',    html: '<span class="ans-plain">2x</span>' },
        { label: '6x²/3x',html: fracHTML('6x²','3x') },
        { label: '3x',    html: '<span class="ans-plain">3x</span>' },
        { label: '2x²',   html: '<span class="ans-plain">2x²</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('x²','3')} ${opHTML('×')} ${stepFrac('6','x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply tops & bottoms:</span>
        </div>
        <div class="exp-row exp-indent">
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
          <span class="exp-label">Multiply tops & bottoms:</span>
        </div>
        <div class="exp-row exp-indent">
          ${stepFrac('4p² × 3q²','6q × 2p')} ${arrowHTML()} ${stepFrac('12p²q²','12pq')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers:</span>
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
      // Non-factorise: answer is a fraction
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
          <span class="exp-label">Multiply tops & bottoms:</span>
        </div>
        <div class="exp-row exp-indent">
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
      // Extra non-factorise multiply
      type: 'multiply',
      label: 'Multiply and simplify:',
      display: `${fracHTML('3a²','4b')} ${opHTML('×')} ${fracHTML('8b²','9a')}`,
      answerText: '2ab/3',
      correctIndex: 1,
      points: 20,
      options: [
        { label: 'ab/3',   html: fracHTML('ab','3') },
        { label: '2ab/3',  html: fracHTML('2ab','3') },
        { label: '2a²b',   html: '<span class="ans-plain">2a²b</span>' },
        { label: '6ab/4',  html: fracHTML('6ab','4') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('3a²','4b')} ${opHTML('×')} ${stepFrac('8b²','9a')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply tops & bottoms:</span>
        </div>
        <div class="exp-row exp-indent">
          ${stepFrac('3a² × 8b²','4b × 9a')} ${arrowHTML()} ${stepFrac('24a²b²','36ab')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers:</span>
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
        { label: '6x',      html: '<span class="ans-plain">6x</span>' },
        { label: '8x³/6',   html: fracHTML('8x³','6') },
        { label: '6x²',     html: '<span class="ans-plain">6x²</span>' },
        { label: '3x',      html: '<span class="ans-plain">3x</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (KCF Method)</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('4x²','3')} ${opHTML('÷')} ${stepFrac('2x','9')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Step 1 — Keep 1st fraction:</span>
          ${stepFrac('4x²','3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Step 2 — Change ÷ to ×:</span>
          ${opHTML('×')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Step 3 — Flip 2nd fraction:</span>
          ${stepFrac('9','2x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Now multiply:</span>
          ${stepFrac('4x²','3')} ${opHTML('×')} ${stepFrac('9','2x')}
          ${arrowHTML()} ${stepFrac('36x²','6x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers:</span>
          ${stepFrac('36','6')} ${arrowHTML()} <span class="exp-note">6</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify x-terms:</span>
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
        <div class="exp-row">
          <span class="exp-label">KCF — flip 2nd fraction:</span>
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
      // Non-factorise: clean divide
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
        <div class="exp-row">
          <span class="exp-label">KCF — flip 2nd fraction:</span>
          ${stepFrac('8m³','4')} ${opHTML('×')} ${stepFrac('1','2m')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('8m³ × 1','4 × 2m')} ${arrowHTML()} ${stepFrac('8m³','8m')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers:</span>
          ${stepFrac('8','8')} ${arrowHTML()} <span class="exp-note">1</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify m-terms:</span>
          ${stepFrac('m³','m')} ${arrowHTML()} <span class="exp-note">m² &nbsp;(3−1=2)</span>
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
        <div class="exp-row">
          <span class="exp-label">KCF — flip 2nd fraction:</span>
          ${stepFrac('x²y','2')} ${opHTML('×')} ${stepFrac('4','xy')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('x²y × 4','2 × xy')} ${arrowHTML()} ${stepFrac('4x²y','2xy')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers:</span>
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
        { label: '3/2p',  html: fracHTML('3','2p') },
        { label: '6/p',   html: fracHTML('6','p') },
        { label: '3p/2',  html: fracHTML('3p','2') },
        { label: '2/3p',  html: fracHTML('2','3p') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (KCF Method)</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('15p','4')} ${opHTML('÷')} ${stepFrac('5p²','2')}
        </div>
        <div class="exp-row">
          <span class="exp-label">KCF — flip 2nd fraction:</span>
          ${stepFrac('15p','4')} ${opHTML('×')} ${stepFrac('2','5p²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('15p × 2','4 × 5p²')} ${arrowHTML()} ${stepFrac('30p','20p²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers:</span>
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
      // Extra non-factorise divide
      type: 'divide',
      label: 'Divide and simplify:',
      display: `${fracHTML('12x²','5y')} ${opHTML('÷')} ${fracHTML('4x','15y²')}`,
      answerText: '9xy',
      correctIndex: 2,
      points: 25,
      options: [
        { label: '9x/y',  html: fracHTML('9x','y') },
        { label: '3xy',   html: '<span class="ans-plain">3xy</span>' },
        { label: '9xy',   html: '<span class="ans-plain">9xy</span>' },
        { label: '12xy',  html: '<span class="ans-plain">12xy</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (KCF Method)</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('12x²','5y')} ${opHTML('÷')} ${stepFrac('4x','15y²')}
        </div>
        <div class="exp-row">
          <span class="exp-label">KCF — flip 2nd fraction:</span>
          ${stepFrac('12x²','5y')} ${opHTML('×')} ${stepFrac('15y²','4x')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('12x² × 15y²','5y × 4x')} ${arrowHTML()} ${stepFrac('180x²y²','20xy')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Simplify numbers:</span>
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
  //           + non-factorise mixed questions
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
        { label: 'x − 2', html: '<span class="ans-plain">x − 2</span>' },
        { label: 'x + 2', html: '<span class="ans-plain">x + 2</span>' },
        { label: 'x − 4', html: '<span class="ans-plain">x − 4</span>' },
        { label: 'x² − 2',html: '<span class="ans-plain">x² − 2</span>' },
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
        <div class="exp-note-box">Difference of 2 squares: a² − b² = (a+b)(a−b)</div>
        <div class="exp-row">
          <span class="exp-label">Rewrite:</span>
          ${stepFrac('(x + 2)(x − 2)','x + 2')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel (x + 2):</span>
          ${stepFrac('<s>(x + 2)</s>(x − 2)','<s>(x + 2)</s>')}
          ${arrowHTML()} <span class="exp-note">x − 2</span>
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
          ${stepFrac('<s>x</s>(x + 3)','<s>x</s>')}
          ${arrowHTML()} <span class="exp-note">x + 3</span>
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
        { label: '(x+3)/2', html: fracHTML('x + 3','2') },
        { label: '(2x+6)/4',html: fracHTML('2x + 6','4') },
        { label: 'x + 3',   html: '<span class="ans-plain">x + 3</span>' },
        { label: '(x+3)/4', html: fracHTML('x + 3','4') },
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
          ${stepFrac('<s>2x</s>(x + 3)','<s>4x→</s>2')}
          ${arrowHTML()} ${stepFrac('x + 3','2')}
        </div>
        <div class="exp-note-box">2x ÷ 2x = 1 (top), 4x ÷ 2x = 2 (bottom)</div>
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
        <div class="exp-note-box">Difference of 2 squares: a² − b² = (a+b)(a−b)</div>
        <div class="exp-row">
          <span class="exp-label">Rewrite:</span>
          ${stepFrac('(x + 3)(x − 3)','x − 3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel (x − 3):</span>
          ${stepFrac('(x + 3)<s>(x − 3)</s>','<s>(x − 3)</s>')}
          ${arrowHTML()} <span class="exp-note">x + 3</span>
        </div>
        <div class="exp-answer">✅ Answer: x + 3</div>
      `,
    },
    {
      // Non-factorise: multiply with polynomial in numerator (already expanded)
      type: 'multiply',
      label: 'Multiply and simplify:',
      display: `${fracHTML('3x','x² + x')} ${opHTML('×')} ${fracHTML('x + 1','6')}`,
      answerText: '1/2',
      correctIndex: 0,
      points: 30,
      options: [
        { label: '1/2',    html: fracHTML('1','2') },
        { label: '3x/6',   html: fracHTML('3x','6') },
        { label: 'x/2',    html: fracHTML('x','2') },
        { label: '3/2',    html: fracHTML('3','2') },
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
          ${stepFrac('3x(x + 1)','x(x + 1) × 6')} ${arrowHTML()} ${stepFrac('3x(x+1)','6x(x+1)')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel x and (x+1):</span>
          ${stepFrac('3<s>x(x+1)</s>','6<s>x(x+1)</s>')} ${arrowHTML()} ${stepFrac('3','6')} ${arrowHTML()} ${stepFrac('1','2')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('1','2')}</div>
      `,
    },
    {
      // Non-factorise: divide with polynomial already factored for learner
      type: 'divide',
      label: 'Divide and simplify:',
      display: `${fracHTML('4x² + 8x','3')} ${opHTML('÷')} ${fracHTML('x + 2','6')}`,
      answerText: '8x',
      correctIndex: 1,
      points: 30,
      options: [
        { label: '4x',   html: '<span class="ans-plain">4x</span>' },
        { label: '8x',   html: '<span class="ans-plain">8x</span>' },
        { label: '8x²',  html: '<span class="ans-plain">8x²</span>' },
        { label: '4/3x', html: fracHTML('4','3x') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('4x² + 8x','3')} ${opHTML('÷')} ${stepFrac('x + 2','6')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Factorise numerator:</span>
          <span class="exp-note">4x² + 8x = <strong>4x(x + 2)</strong></span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Rewrite:</span>
          ${stepFrac('4x(x + 2)','3')} ${opHTML('÷')} ${stepFrac('x + 2','6')}
        </div>
        <div class="exp-row">
          <span class="exp-label">KCF — flip 2nd fraction:</span>
          ${stepFrac('4x(x + 2)','3')} ${opHTML('×')} ${stepFrac('6','x + 2')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Multiply:</span>
          ${stepFrac('4x(x+2) × 6','3 × (x+2)')} ${arrowHTML()} ${stepFrac('24x(x+2)','3(x+2)')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel (x+2) and simplify:</span>
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
        { label: 'y²/x',  html: fracHTML('y²','x') },
        { label: 'y',     html: '<span class="ans-plain">y</span>' },
        { label: 'xy',    html: '<span class="ans-plain">xy</span>' },
        { label: 'x/y',   html: fracHTML('x','y') },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution (Left to Right)</div>
        <div class="exp-row">
          <span class="exp-label">Step 1 — ÷ first pair:</span>
          ${stepFrac('4x²','6y')} ${opHTML('÷')} ${stepFrac('2x','3y²')}
        </div>
        <div class="exp-row exp-indent">
          KCF: ${stepFrac('4x²','6y')} ${opHTML('×')} ${stepFrac('3y²','2x')}
          ${arrowHTML()} ${stepFrac('12x²y²','12xy')} ${arrowHTML()} <span class="exp-note">xy</span>
        </div>
        <div class="exp-row">
          <span class="exp-label">Step 2 — × last fraction:</span>
          xy ${opHTML('×')} ${stepFrac('y','x²')}
          ${arrowHTML()} ${stepFrac('xy²','x²')} ${arrowHTML()} ${stepFrac('y²','x')}
        </div>
        <div class="exp-answer">✅ Answer: ${stepFrac('y²','x')}</div>
      `,
    },
    {
      type: 'mixed',
      label: 'Simplify:',
      display: `${fracHTML('x² + 5x + 6','x + 3')} ${opHTML('÷')} <span style="font-size:0.9em">(x + 2)</span>`,
      answerText: '1',
      correctIndex: 0,
      points: 40,
      options: [
        { label: '1',         html: '<span class="ans-plain">1</span>' },
        { label: 'x + 2',     html: '<span class="ans-plain">x + 2</span>' },
        { label: 'x + 3',     html: '<span class="ans-plain">x + 3</span>' },
        { label: '(x+2)(x+3)',html: '<span class="ans-plain">(x+2)(x+3)</span>' },
      ],
      explanationHTML: `
        <div class="exp-title">📝 Step-by-step solution</div>
        <div class="exp-row">
          <span class="exp-label">Given:</span>
          ${stepFrac('x² + 5x + 6','x + 3')} ${opHTML('÷')} (x + 2)
        </div>
        <div class="exp-row">
          <span class="exp-label">Factorise numerator:</span>
          <span class="exp-note">x² + 5x + 6 = <strong>(x+2)(x+3)</strong></span>
        </div>
        <div class="exp-note-box">Find two numbers that multiply to 6 and add to 5: 2 and 3 ✓</div>
        <div class="exp-row">
          <span class="exp-label">Rewrite:</span>
          ${stepFrac('(x+2)(x+3)','x+3')} ${opHTML('÷')} (x+2)
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel (x+3):</span>
          ${stepFrac('<s>(x+2)(x+3)</s>→(x+2)','<s>x+3</s>')} ${arrowHTML()} (x+2) ${opHTML('÷')} (x+2)
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel (x+2):</span>
          <span class="exp-note"><strong>1</strong></span>
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
        <div class="exp-title">📝 Step-by-step solution (Left to Right)</div>
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
      // Non-factorise boss — triple product
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
        <div class="exp-title">📝 Step-by-step solution (Left to Right)</div>
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
          <span class="exp-label">Factorise x² − x − 6:</span>
          <span class="exp-note">Find two numbers: multiply to −6, add to −1</span>
        </div>
        <div class="exp-note-box">Try: −3 and 2 → (−3)×2=−6 ✓, (−3)+2=−1 ✓<br>So x²−x−6 = <strong>(x−3)(x+2)</strong></div>
        <div class="exp-row">
          <span class="exp-label">Rewrite:</span>
          ${stepFrac('(x−3)(x+2)','x+2')} ${opHTML('×')} ${stepFrac('x+2','x−3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel (x+2):</span>
          (x−3) ${opHTML('×')} ${stepFrac('x+2','x−3')}
          ${arrowHTML()} ${stepFrac('(x−3)(x+2)','x−3')}
        </div>
        <div class="exp-row">
          <span class="exp-label">Cancel (x−3):</span>
          <span class="exp-note">x + 2 ... wait, cancel completely → <strong>1</strong></span>
        </div>
        <div class="exp-note-box">All factors cancel: ${stepFrac('<s>(x−3)(x+2)</s>','<s>(x+2)(x−3)</s>')} = 1</div>
        <div class="exp-answer">✅ Answer: 1</div>
      `,
    },
  ],
};

// ==================== SCREEN MANAGEMENT ====================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'screen-home')   updateHomeStats();
  if (id === 'screen-scores') renderScores();
  if (id === 'screen-tutorial') initTutorial();
  if (id === 'screen-mode')   updateModeScreen();
}

function updateHomeStats() {
  const stars = parseInt(localStorage.getItem('fractoquest_total_stars') || '0');
  document.getElementById('total-stars-home').textContent = stars;
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
      <div class="example-box">${fracHTML('3x', '5')} &nbsp;&nbsp; ${fracHTML('a²b', '4c')}</div>
      <p>We simplify them by cancelling common factors — just like regular fractions!</p>
    `,
  },
  {
    title: '✂️ How to Simplify',
    content: `
      <p><strong>Rule:</strong> Divide top and bottom by their common factors.</p>
      <div class="example-box">
        ${fracHTML('6x²', '9x')} = ${fracHTML('2x', '3')}
      </div>
      <div class="example-box" style="font-size:0.85em">
        Numbers: ${fracHTML('6','9')} → ${fracHTML('2','3')} (divide by 3)
        &nbsp;&nbsp; Variables: ${fracHTML('x²','x')} → x (cancel one x)
      </div>
    `,
  },
  {
    title: '✖️ How to Multiply',
    content: `
      <p><strong>Rule:</strong> Multiply numerators together, denominators together, then simplify.</p>
      <div class="example-box">
        ${fracHTML('3x','4')} × ${fracHTML('8','x²')} = ${fracHTML('24x','4x²')} = ${fracHTML('6','x')}
      </div>
      <p>💡 Tip: Cancel common factors <em>before</em> multiplying to keep numbers small!</p>
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
      <p>Keep the first fraction, Change ÷ to ×, Flip the second fraction!</p>
    `,
  },
  {
    title: '🔍 Factorise to Simplify',
    content: `
      <p>Sometimes you must <strong>factor</strong> the numerator first:</p>
      <div class="example-box">
        ${fracHTML('x² − 4', 'x + 2')} = ${fracHTML('(x+2)(x−2)', 'x+2')} = x − 2
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
  State.selectedMCQ = null;
  State.duelScores = [0, 0];
  State.duelTurn = 0;
  clearInterval(State.speedTimer);

  document.getElementById('hud-timer').style.display = 'none';
  document.getElementById('hud-timer').style.color = '';

  if (mode === 'quest') {
    State.level = parseInt(localStorage.getItem('fractoquest_level') || '1');
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

  // Shuffle display options but track original index
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

  // Mark all options
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
}

function handleWrong(q) {
  State.lives = Math.max(0, State.lives - 1);
  animateWizard('oops');
  document.getElementById('question-card').classList.add('shake');
  setTimeout(() => document.getElementById('question-card').classList.remove('shake'), 400);
  showSpeechBubble('Oops! 😅 Study the steps below!');
  showFeedback(false, 'Not quite — study the solution! 📚', q.explanationHTML);
  updateHUD();

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
    document.getElementById('btn-hint').disabled = true;
  }
  const hintEl = document.getElementById('step-hint');
  hintEl.innerHTML = getHintForType(q.type);
  hintEl.style.display = 'block';
}

function getHintForType(type) {
  const hints = {
    simplify:
      '💡 <strong>Split into number part and variable part.</strong> Divide numbers by their GCF. Subtract powers for variables (top power − bottom power).',
    multiply:
      '💡 <strong>Multiply tops together, bottoms together.</strong> Then simplify numbers (÷ by GCF) and variables (subtract powers).',
    divide:
      '💡 <strong>KCF:</strong> Keep 1st fraction → Change ÷ to × → Flip 2nd fraction. Then multiply as normal!',
    'factor-simplify':
      '💡 <strong>Factorise the numerator first!</strong> Look for: common factor, difference of squares (a²−b²), or two brackets.',
    mixed:
      '💡 <strong>Work left to right.</strong> For ÷, use KCF. Simplify after each step to keep numbers manageable.',
  };
  return hints[type] || '💡 Look for common factors to cancel top and bottom!';
}

// ==================== HUD ====================
function updateHUD() {
  document.getElementById('hud-score').textContent = State.score;
  if (State.mode !== 'duel') {
    document.getElementById('hud-level').textContent =
      State.mode === 'speedrun' ? 'Speed Run' : `Level ${State.level}`;
  }
  const hearts = [0, 1, 2].map(i => i < State.lives ? '❤️' : '🖤').join('');
  document.getElementById('hud-lives').textContent = hearts;
}

// ==================== LEVEL COMPLETE ====================
function showLevelComplete() {
  clearInterval(State.speedTimer);

  const total = State.questions.reduce((s, q) => s + q.points, 0);
  const pct = total > 0 ? Math.round((State.score / total) * 100) : 0;
  const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;

  if (State.mode === 'quest') {
    const key = `fractoquest_stars_${State.level}`;
    const saved = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, Math.max(saved, stars));

    // Count total stars across all levels
    let totalStars = 0;
    for (let i = 1; i <= 6; i++) {
      totalStars += parseInt(localStorage.getItem(`fractoquest_stars_${i}`) || '0');
    }
    localStorage.setItem('fractoquest_total_stars', totalStars);

    if (State.level < 6) {
      const nextLv = State.level + 1;
      const savedLv = parseInt(localStorage.getItem('fractoquest_level') || '1');
      if (nextLv > savedLv) {
        localStorage.setItem('fractoquest_level', nextLv);
      }
    }
  }

  if (State.mode === 'speedrun') {
    const best = parseInt(localStorage.getItem('fractoquest_speed_best') || '0');
    if (State.score > best) {
      localStorage.setItem('fractoquest_speed_best', State.score);
    }
    saveHighScore(State.score);
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
    ${State.mode === 'speedrun' ? `<br>Questions done: <strong>${State.questionIndex}</strong>` : ''}
  `;

  const nextBtn = document.getElementById('btn-next-level');
  nextBtn.style.display =
    (State.mode === 'speedrun' || State.mode === 'learn' || State.level >= 6)
      ? 'none' : 'inline-block';

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
  return ['Spell cast! ✨','Brilliant! 🌟','Power unlocked! ⚡','Perfect! 💯','Wizard move! 🔮','Excellent! 🎉'][
    Math.floor(Math.random() * 6)];
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  showScreen('screen-home');
});