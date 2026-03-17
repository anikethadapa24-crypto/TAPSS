/**
 * TAPSS Science Blitz — playable 3-minute quiz game
 */
(function () {
  'use strict';

  var POINTS_PER_CORRECT = 50;
  var TOTAL_SECONDS = 180; // 3 minutes
  var QUESTION_DELAY_MS = 1200; // time to show feedback before next question

  // Optional: load questions from a Google Sheet (CSV)
  // Publish your sheet as CSV and paste its URL here.
  // Columns: question, optionA, optionB, optionC, optionD, correctIndex (0–3)
  var QUESTIONS_CSV_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv';

  // Default built-in questions (used if sheet is not configured or load fails)
  var questions = [
    // Physics
    { q: 'A car doubles its speed from 20 m/s to 40 m/s. What happens to its kinetic energy, assuming mass stays the same?', options: ['It doubles', 'It triples', 'It becomes four times larger', 'It stays the same'], correct: 2 },
    { q: 'A 5 kg object is lifted 3 m vertically. (g = 10 m/s².) What gravitational potential energy does it gain?', options: ['15 J', '30 J', '150 J', '300 J'], correct: 2 },
    { q: 'An object moves in a circle at constant speed. Which statement is true?', options: ['Its velocity is constant', 'Its acceleration is zero', 'A net force points toward the center', 'No force acts on it'], correct: 2 },
    { q: 'A light ray passes from air into glass and bends toward the normal. What can you conclude?', options: ['Glass has lower refractive index than air', 'Glass has higher refractive index than air', 'Speed of light is greater in glass than air', 'Wavelength in glass is larger'], correct: 1 },
    { q: 'Which change will always increase the period of a simple pendulum (small angles)?', options: ['Increase mass of the bob', 'Increase string length', 'Increase amplitude', 'Use a denser material'], correct: 1 },

    // Chemistry
    { q: 'A solution has pH = 3. What is true?', options: ['[H⁺] = 1 × 10⁻³ M', '[H⁺] = 1 × 10³ M', 'Solution is weakly basic', 'Solution is neutral'], correct: 0 },
    { q: 'Which process is best described as oxidation?', options: ['Gain of electrons', 'Loss of electrons', 'Gain of neutrons', 'Loss of protons'], correct: 1 },
    { q: 'If temperature increases for a gas in a sealed, rigid container, what happens to the gas pressure (ideal gas)?', options: ['Decreases linearly', 'Stays the same', 'Increases linearly', 'Drops to zero'], correct: 2 },
    { q: 'Which pair correctly matches bond type and relative strength?', options: ['Covalent < Hydrogen < Ionic', 'Hydrogen < Ionic < Covalent', 'Ionic < Covalent < Metallic', 'Hydrogen > Covalent > Ionic'], correct: 1 },
    { q: 'What is the oxidation state of sulfur in H₂SO₄?', options: ['+2', '+4', '+6', '0'], correct: 2 },

    // Biology
    { q: 'In cellular respiration, which molecule is the final electron acceptor in the electron transport chain?', options: ['Carbon dioxide', 'NAD⁺', 'Oxygen', 'Lactic acid'], correct: 2 },
    { q: 'Which cellular structure is primarily responsible for modifying and packaging proteins for secretion?', options: ['Nucleus', 'Golgi apparatus', 'Ribosome', 'Lysosome'], correct: 1 },
    { q: 'If a trait is recessive and autosomal, which cross can produce a child with the trait when neither parent shows it?', options: ['AA × Aa', 'Aa × Aa', 'AA × aa', 'AA × AA'], correct: 1 },
    { q: 'Which process directly produces most of the ATP in aerobic respiration?', options: ['Glycolysis', 'Krebs cycle', 'Electron transport chain + chemiosmosis', 'Fermentation'], correct: 2 },
    { q: 'A cell is placed in a hypertonic solution. Which will happen?', options: ['Water enters; cell swells', 'Water leaves; cell shrinks', 'No net water movement', 'Solute enters until balance'], correct: 1 },

    // Earth & Environmental Science
    { q: 'Which gas is the largest contributor to the natural greenhouse effect on Earth?', options: ['Carbon dioxide (CO₂)', 'Methane (CH₄)', 'Water vapor (H₂O)', 'Ozone (O₃)'], correct: 2 },
    { q: 'At a convergent boundary where an oceanic plate meets a continental plate, what usually happens?', options: ['Oceanic plate subducts', 'Continental plate subducts', 'Both rise to form ridges', 'Plates slide past each other'], correct: 0 },
    { q: 'Which feedback loop would most strongly accelerate global warming?', options: ['More clouds that reflect sunlight', 'Melting ice decreases Earth’s albedo', 'Increased plant growth that absorbs CO₂', 'More volcanic ash blocking sunlight'], correct: 1 },
    { q: 'The Richter scale for earthquake magnitude is logarithmic. A magnitude 6 earthquake releases roughly how much more energy than magnitude 4?', options: ['2 times', '10 times', '30 times', '100 times'], correct: 3 },
    { q: 'Which process transfers carbon from the atmosphere to the lithosphere over geologic time?', options: ['Respiration', 'Photosynthesis', 'Formation of limestone sediments', 'Deforestation'], correct: 2 },

    // Data / Reasoning
    { q: 'A fair six-sided die is rolled twice. What is the probability the sum is exactly 9?', options: ['1/9', '1/6', '4/36', '1/12'], correct: 2 },
    { q: 'A dataset has a few extremely large outliers. Which measure of “average” is least affected?', options: ['Mean', 'Median', 'Sum', 'Standard deviation'], correct: 1 },
    { q: 'A scientist only changes one variable in an experiment and keeps all others constant. What is the variable she changes called?', options: ['Dependent variable', 'Independent variable', 'Control variable', 'Random variable'], correct: 1 },
    { q: 'A correlation coefficient r = 0.9 between two variables means:', options: ['Strong positive linear relationship', 'No relationship', 'Strong negative linear relationship', 'Cause and effect is proven'], correct: 0 },
    { q: 'Which scenario best demonstrates a controlled experiment?', options: ['Observing weather for a year', 'Giving fertilizer to one plant group but not another', 'Recording heights of students once', 'Surveying favorite foods'], correct: 1 },

    // Multi-step / conceptual
    { q: 'Doubling the force on an object while keeping its mass constant does what to its acceleration (Newton’s 2nd law)?', options: ['Halves it', 'Doubles it', 'Quadruples it', 'Leaves it unchanged'], correct: 1 },
    { q: 'Two resistors (4 Ω and 6 Ω) are connected in series to a 10 V battery. What is the total current?', options: ['1 A', '0.5 A', '2 A', '4 A'], correct: 1 },
    { q: 'Which change would shift a chemical equilibrium to favor products for an exothermic reaction?', options: ['Increase temperature', 'Decrease temperature', 'Remove products', 'Add catalyst only'], correct: 1 },
    { q: 'A population of bacteria doubles every hour. If you start with 500 cells, how many after 3 hours (assuming no limit)?', options: ['1000', '1500', '4000', '250'], correct: 2 },
    { q: 'Which situation best illustrates natural selection?', options: ['A rock eroding into sand', 'Antibiotic-resistant bacteria surviving and reproducing', 'Trees losing leaves in winter', 'Water freezing into ice'], correct: 1 },

    // Mixed challenge
    { q: 'Which orbit has the lowest gravitational potential energy (most tightly bound)?', options: ['A satellite very far from Earth', 'A satellite close to Earth', 'A satellite on an escape trajectory', 'They are all equal'], correct: 1 },
    { q: 'What is the main reason metals conduct electricity well?', options: ['They have tightly bound valence electrons', 'They have a “sea” of mobile electrons', 'They have no electrons', 'Their protons can move freely'], correct: 1 },
    { q: 'During photosynthesis, which step directly produces oxygen gas (O₂)?', options: ['Calvin cycle', 'Glycolysis', 'Splitting of water in the light reactions', 'Electron transport in mitochondria'], correct: 2 },
    { q: 'If the half-life of a radioactive isotope is 5 years, about what fraction of the original sample remains after 15 years?', options: ['1/2', '1/3', '1/4', '1/8'], correct: 3 },
    { q: 'Which of the following is an example of a negative feedback in the human body?', options: ['Blood clot formation', 'Labor contractions during birth', 'Shivering when body temperature drops', 'Fruit ripening triggered by ethylene'], correct: 2 }
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

  function parseQuestionsCsv(text) {
    var lines = text.split(/\r?\n/).filter(function (l) { return l.trim().length; });
    if (!lines.length) return [];
    var out = [];
    // assume first row is header
    for (var i = 1; i < lines.length; i++) {
      var row = lines[i];
      var cols = row.split(',');
      if (cols.length < 6) continue;
      var q = cols[0].trim();
      var a = cols[1].trim();
      var b = cols[2].trim();
      var c = cols[3].trim();
      var d = cols[4].trim();
      var correctIndex = parseInt(cols[5], 10);
      if (!q || !a || !b || !c || !d || isNaN(correctIndex)) continue;
      if (correctIndex < 0 || correctIndex > 3) continue;
      out.push({
        q: q,
        options: [a, b, c, d],
        correct: correctIndex
      });
    }
    return out;
  }

  function loadQuestionsFromSheet() {
    if (!QUESTIONS_CSV_URL || QUESTIONS_CSV_URL.indexOf('YOUR_SHEET_ID') !== -1) return;
    try {
      fetch(QUESTIONS_CSV_URL)
        .then(function (res) { return res.text(); })
        .then(function (text) {
          var parsed = parseQuestionsCsv(text);
          if (parsed && parsed.length >= 10) {
            questions = parsed;
          }
        })
        .catch(function () {
          // ignore failures, keep default questions
        });
    } catch (e) {
      // ignore
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

  // Try to load external questions once when the page is ready
  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      loadQuestionsFromSheet();
    } else {
      window.addEventListener('DOMContentLoaded', loadQuestionsFromSheet);
    }
  }

  if (startBtn) startBtn.addEventListener('click', startGame);
  if (playAgainBtn) playAgainBtn.addEventListener('click', startGame);
})();
