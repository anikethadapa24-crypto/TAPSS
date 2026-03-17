/**
 * TAPSS Science Blitz — Name-only entry, leaderboard with encrypted names (localStorage)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'blitz_leaderboard';
  var NAME_KEY = 'blitz_player_name';
  var ENC_KEY = 'TAPSS_BLITZ_KEY_2026';
  var MAX_ENTRIES = 50;
  var ONCE_KEY = 'blitz_played_once';

  var nameRequiredEl = document.getElementById('blitz-name-required');
  var gameWrap = document.getElementById('blitz-game-wrap');
  var gameArea = document.getElementById('science-blitz-game');
  var leaderboardBody = document.getElementById('blitz-leaderboard-body');
  var userDisplayEl = document.getElementById('blitz-user-display');
  var differentNameBtn = document.getElementById('blitz-different-name-btn');
  var nameForm = document.getElementById('blitz-name-form');
  var firstNameInput = document.getElementById('blitz-first-name');
  var lastNameInput = document.getElementById('blitz-last-name');
  var onceMessageEl = document.getElementById('blitz-once-message');
  var startBtnEl = document.getElementById('sb-start-btn');
  var playAgainBtnEl = document.getElementById('sb-play-again');

  function encryptName(text) {
    if (!text) return '';
    var bytes = [];
    for (var i = 0; i < text.length; i++) {
      bytes.push((text.charCodeAt(i) ^ ENC_KEY.charCodeAt(i % ENC_KEY.length)) & 0xFF);
    }
    try {
      return btoa(String.fromCharCode.apply(null, bytes));
    } catch (e) {
      return '';
    }
  }

  function decryptName(enc) {
    if (!enc) return '—';
    try {
      var raw = atob(enc);
      var out = [];
      for (var i = 0; i < raw.length; i++) {
        out.push(String.fromCharCode((raw.charCodeAt(i) ^ ENC_KEY.charCodeAt(i % ENC_KEY.length)) & 0xFF));
      }
      return out.join('');
    } catch (e) {
      return '—';
    }
  }

  function getStoredName() {
    try {
      return sessionStorage.getItem(NAME_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function setStoredName(name) {
    try {
      sessionStorage.setItem(NAME_KEY, name);
    } catch (e) {}
  }

  function clearStoredName() {
    try {
      sessionStorage.removeItem(NAME_KEY);
    } catch (e) {}
  }

  function getLeaderboard() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function setLeaderboard(arr) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (e) {}
  }

  function hasPlayedOnce() {
    try {
      return localStorage.getItem(ONCE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function markPlayedOnce() {
    try {
      localStorage.setItem(ONCE_KEY, '1');
    } catch (e) {}
  }

  function showOnceLocked() {
    if (onceMessageEl) onceMessageEl.classList.remove('blitz-hidden');
    if (nameRequiredEl) nameRequiredEl.classList.add('blitz-hidden');
    if (gameWrap) gameWrap.classList.add('blitz-hidden');
    if (startBtnEl) {
      startBtnEl.disabled = true;
      startBtnEl.textContent = 'Official run already completed';
    }
    if (playAgainBtnEl) {
      playAgainBtnEl.disabled = true;
      playAgainBtnEl.textContent = 'Only one official run allowed';
    }
    if (differentNameBtn) {
      differentNameBtn.disabled = true;
    }
  }

  function formatTimeDisplay(totalSeconds, timeRemaining) {
    var s = totalSeconds != null ? totalSeconds - (timeRemaining || 0) : 180;
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function showNameForm() {
    if (nameRequiredEl) nameRequiredEl.classList.remove('blitz-hidden');
    if (gameWrap) gameWrap.classList.add('blitz-hidden');
  }

  function showGame(displayName) {
    if (nameRequiredEl) nameRequiredEl.classList.add('blitz-hidden');
    if (gameWrap) gameWrap.classList.remove('blitz-hidden');
    if (gameArea) gameArea.classList.remove('blitz-hidden');
    if (userDisplayEl) userDisplayEl.textContent = displayName || '—';
  }

  function renderLeaderboard() {
    if (!leaderboardBody) return;
    var list = getLeaderboard();
    if (list.length === 0) {
      leaderboardBody.innerHTML = '<tr><td colspan="5" class="blitz-leaderboard-empty">No scores yet. Enter your name and play to appear here!</td></tr>';
      return;
    }
    list.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
    var rows = [];
    for (var i = 0; i < Math.min(list.length, 30); i++) {
      var d = list[i];
      var rank = i + 1;
      var name = decryptName(d.nameEncrypted);
      var time = d.timeDisplay != null ? d.timeDisplay : '3:00';
      var points = d.score != null ? d.score : '—';
      var correct = d.correctCount != null ? d.correctCount : '—';
      rows.push('<tr><td class="blitz-rank">' + rank + '</td><td>' + escapeHtml(name) + '</td><td>' + time + '</td><td>' + points + '</td><td>' + correct + '</td></tr>');
    }
    leaderboardBody.innerHTML = rows.join('');
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  if (nameForm && firstNameInput && lastNameInput) {
    nameForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = (firstNameInput.value || '').trim();
      var last = (lastNameInput.value || '').trim();
      if (!first || !last) return;
      var displayName = first + ' ' + last;
      setStoredName(displayName);
      showGame(displayName);
      renderLeaderboard();
    });
  }

  if (differentNameBtn) {
    differentNameBtn.addEventListener('click', function () {
      clearStoredName();
      showNameForm();
      renderLeaderboard();
    });
  }

  window.onBlitzGameEnd = function (data) {
    if (!data) return;
    var displayName = getStoredName();
    if (!displayName) return;
    var timeDisplay = data.totalSeconds != null && data.timeRemaining != null
      ? formatTimeDisplay(data.totalSeconds, data.timeRemaining)
      : '3:00';
    var entry = {
      nameEncrypted: encryptName(displayName),
      score: data.score || 0,
      correctCount: data.correctCount || 0,
      timeDisplay: timeDisplay
    };
    var list = getLeaderboard();
    list.push(entry);
    list.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
    if (list.length > MAX_ENTRIES) list = list.slice(0, MAX_ENTRIES);
    setLeaderboard(list);
    markPlayedOnce();
    showOnceLocked();
    setTimeout(renderLeaderboard, 100);
  };

  if (hasPlayedOnce()) {
    // Already played on this browser: lock the UI and do not allow another run
    showOnceLocked();
  } else {
    if (getStoredName()) {
      showGame(getStoredName());
    } else {
      showNameForm();
    }
  }
  renderLeaderboard();
})();
