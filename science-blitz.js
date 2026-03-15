/**
 * TAPSS Science Blitz — playable 3-minute quiz game
 */
(function () {
  'use strict';

  var POINTS_PER_CORRECT = 50;
  var TOTAL_SECONDS = 180; // 3 minutes
  var QUESTION_DELAY_MS = 1200; // time to show feedback before next question

  var questions = [
    { q: 'What gas do plants absorb from the air for photosynthesis?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], correct: 1 },
    { q: 'Which part of the plant carries water from roots to leaves?', options: ['Phloem', 'Xylem', 'Stomata', 'Chlorophyll'], correct: 1 },
    { q: 'What is the chemical formula for water?', options: ['CO2', 'H2O', 'O2', 'NaCl'], correct: 1 },
    { q: 'In a simple circuit, what does a battery provide?', options: ['Resistance', 'Voltage', 'Insulation', 'Ground'], correct: 1 },
    { q: 'What type of reaction releases heat?', options: ['Endothermic', 'Exothermic', 'Neutral', 'Catalytic'], correct: 1 },
    { q: 'Which organ pumps blood through the body?', options: ['Brain', 'Lungs', 'Heart', 'Liver'], correct: 2 },
    { q: 'What force keeps planets in orbit around the Sun?', options: ['Magnetism', 'Friction', 'Gravity', 'Electricity'], correct: 2 },
    { q: 'What is the primary gas in Earth\'s atmosphere?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'], correct: 2 },
    { q: 'Which state of matter has a fixed volume but no fixed shape?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], correct: 1 },
    { q: 'What do we call the path of electric current?', options: ['Wave', 'Circuit', 'Field', 'Beam'], correct: 1 },
    { q: 'What process do plants use to make food from sunlight?', options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'], correct: 1 },
    { q: 'Which planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correct: 2 },
    { q: 'What is the smallest unit of life?', options: ['Atom', 'Cell', 'Molecule', 'Organ'], correct: 1 },
    { q: 'What type of energy is stored in a battery?', options: ['Kinetic', 'Chemical', 'Solar', 'Nuclear'], correct: 1 },
    { q: 'Which layer of Earth is mostly molten metal?', options: ['Crust', 'Mantle', 'Outer core', 'Inner core'], correct: 2 },
    { q: 'What does DNA stand for?', options: ['Dynamic Nuclear Acid', 'Deoxyribonucleic Acid', 'Diatomic Nitrogen Atom', 'Dense Neural Array'], correct: 1 },
    { q: 'What is the boiling point of water in Celsius?', options: ['90°C', '100°C', '110°C', '0°C'], correct: 1 },
    { q: 'Which gas do humans primarily exhale?', options: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Hydrogen'], correct: 2 },
    { q: 'What is the speed of light in a vacuum (approximately)?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'], correct: 0 },
    { q: 'What do we call a substance that speeds up a reaction without being used up?', options: ['Reactant', 'Product', 'Catalyst', 'Inhibitor'], correct: 2 },
    { q: 'Which organ filters waste from blood?', options: ['Heart', 'Lungs', 'Kidneys', 'Stomach'], correct: 2 },
    { q: 'What force opposes motion between two surfaces?', options: ['Gravity', 'Friction', 'Magnetism', 'Tension'], correct: 1 },
    { q: 'What is the main gas released by burning fossil fuels?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'], correct: 2 },
    { q: 'Which subatomic particle has a positive charge?', options: ['Electron', 'Neutron', 'Proton', 'Photon'], correct: 2 },
    { q: 'What process breaks down rocks into smaller pieces?', options: ['Erosion', 'Weathering', 'Deposition', 'Condensation'], correct: 1 },
    { q: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correct: 2 },
    { q: 'Which type of wave do we use to see?', options: ['Radio', 'Visible light', 'X-ray', 'Microwave'], correct: 1 },
    { q: 'What do bees collect from flowers to make honey?', options: ['Pollen', 'Nectar', 'Seeds', 'Leaves'], correct: 1 },
    { q: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'], correct: 2 },
    { q: 'Which planet has the most visible rings?', options: ['Jupiter', 'Uranus', 'Saturn', 'Neptune'], correct: 2 },
    { q: 'What is Inertia?', options: ['An objects force', 'An object mass', 'An object weight', 'An object that has natural resistance to any change in motion'], correct: 3 }
  ];

  var state = {
    timeLeft: TOTAL_SECONDS,
    score: 0,
    correctCount: 0,
    currentIndex: 0,
    shuffled: [],
    timerId: null,
    feedbackTimeout: null
  };

  var startScreen = document.getElementById('sb-start');
  var playScreen = document.getElementById('sb-play');
  var resultsScreen = document.getElementById('sb-results');
  var startBtn = document.getElementById('sb-start-btn');
  var timerEl = document.getElementById('sb-timer');
  var scoreEl = document.getElementById('sb-score');
  var questionEl = document.getElementById('sb-question');
  var answersEl = document.getElementById('sb-answers');
  var feedbackEl = document.getElementById('sb-feedback');
  var finalScoreEl = document.getElementById('sb-final-score');
  var impactScoreEl = document.getElementById('sb-impact-score');
  var correctCountEl = document.getElementById('sb-correct-count');
  var playAgainBtn = document.getElementById('sb-play-again');

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function showScreen(screen) {
    startScreen.classList.remove('sb-active');
    playScreen.classList.remove('sb-active');
    resultsScreen.classList.remove('sb-active');
    startScreen.setAttribute('aria-hidden', 'true');
    playScreen.setAttribute('aria-hidden', 'true');
    resultsScreen.setAttribute('aria-hidden', 'true');
    screen.classList.add('sb-active');
    screen.setAttribute('aria-hidden', 'false');
  }

  function tick() {
    state.timeLeft--;
    if (timerEl) timerEl.textContent = formatTime(state.timeLeft);
    if (state.timeLeft <= 0) {
      clearInterval(state.timerId);
      state.timerId = null;
      endGame();
    }
  }

  function showQuestion() {
    if (!questionEl || !answersEl) return;
    var q = state.shuffled[state.currentIndex];
    if (!q) {
      showQuestion();
      return;
    }
    questionEl.textContent = q.q;
    answersEl.innerHTML = '';
    q.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sb-answer-btn';
      btn.textContent = opt;
      btn.setAttribute('data-index', String(i));
      btn.addEventListener('click', onAnswerClick);
      answersEl.appendChild(btn);
    });
    if (feedbackEl) {
      feedbackEl.textContent = '';
      feedbackEl.className = 'sb-feedback';
    }
  }

  function onAnswerClick(e) {
    var btn = e.target;
    if (!btn.classList.contains('sb-answer-btn')) return;
    var chosen = parseInt(btn.getAttribute('data-index'), 10);
    var q = state.shuffled[state.currentIndex];
    var correct = q.correct === chosen;

    var allBtns = answersEl.querySelectorAll('.sb-answer-btn');
    allBtns.forEach(function (b) { b.disabled = true; });

    if (correct) {
      state.score += POINTS_PER_CORRECT;
      state.correctCount++;
      if (scoreEl) scoreEl.textContent = state.score;
      btn.classList.add('sb-correct');
      if (feedbackEl) {
        feedbackEl.textContent = '✓ Discovery! +' + POINTS_PER_CORRECT + ' points';
        feedbackEl.className = 'sb-feedback sb-feedback-correct';
      }
    } else {
      var correctBtn = allBtns[q.correct];
      if (correctBtn) correctBtn.classList.add('sb-correct');
      btn.classList.add('sb-wrong');
      if (feedbackEl) {
        feedbackEl.textContent = 'Correct answer: ' + q.options[q.correct];
        feedbackEl.className = 'sb-feedback sb-feedback-wrong';
      }
    }

    state.currentIndex++;
    if (state.feedbackTimeout) clearTimeout(state.feedbackTimeout);
    state.feedbackTimeout = setTimeout(function () {
      if (state.timeLeft <= 0) return;
      if (state.currentIndex >= state.shuffled.length) {
        state.shuffled = shuffle(questions);
        state.currentIndex = 0;
      }
      showQuestion();
    }, QUESTION_DELAY_MS);
  }

  function endGame() {
    showScreen(resultsScreen);
    if (finalScoreEl) finalScoreEl.textContent = state.score;
    if (impactScoreEl) impactScoreEl.textContent = state.score;
    if (correctCountEl) correctCountEl.textContent = state.correctCount;
    if (typeof window.onBlitzGameEnd === 'function') {
      window.onBlitzGameEnd({
        score: state.score,
        correctCount: state.correctCount,
        timeRemaining: state.timeLeft,
        totalSeconds: TOTAL_SECONDS
      });
    }
  }

  function startGame() {
    state.timeLeft = TOTAL_SECONDS;
    state.score = 0;
    state.correctCount = 0;
    state.currentIndex = 0;
    state.shuffled = shuffle(questions);
    if (state.timerId) clearInterval(state.timerId);
    if (state.feedbackTimeout) clearTimeout(state.feedbackTimeout);

    if (timerEl) timerEl.textContent = formatTime(state.timeLeft);
    if (scoreEl) scoreEl.textContent = '0';

    showScreen(playScreen);
    showQuestion();
    state.timerId = setInterval(tick, 1000);
  }

  if (startBtn) startBtn.addEventListener('click', startGame);
  if (playAgainBtn) playAgainBtn.addEventListener('click', startGame);
})();
