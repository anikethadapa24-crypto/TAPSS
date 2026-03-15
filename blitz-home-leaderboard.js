/**
 * TAPSS Science Blitz — Home page leaderboard preview (reads same localStorage as game)
 * Expands as more entries exist; same storage key and decrypt as blitz-competition.js
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'blitz_leaderboard';
  var ENC_KEY = 'TAPSS_BLITZ_KEY_2026';
  var WRAP_ID = 'blitz-home-leaderboard-wrap';
  var BODY_ID = 'blitz-home-leaderboard-body';
  var MAX_VISIBLE = 15;

  var wrapEl = document.getElementById(WRAP_ID);
  var bodyEl = document.getElementById(BODY_ID);
  if (!wrapEl || !bodyEl) return;

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

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function getLeaderboard() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function render() {
    var list = getLeaderboard();
    if (list.length === 0) {
      bodyEl.innerHTML = '<tr><td colspan="5" class="blitz-leaderboard-empty">No scores yet. Play to appear here!</td></tr>';
      wrapEl.classList.remove('blitz-home-leaderboard-has-entries');
      wrapEl.setAttribute('data-entry-count', '0');
      return;
    }
    list.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
    var rows = [];
    var count = Math.min(list.length, MAX_VISIBLE);
    for (var i = 0; i < count; i++) {
      var d = list[i];
      var rank = i + 1;
      var name = decryptName(d.nameEncrypted);
      var time = d.timeDisplay != null ? d.timeDisplay : '3:00';
      var points = d.score != null ? d.score : '—';
      var correct = d.correctCount != null ? d.correctCount : '—';
      rows.push('<tr><td class="blitz-rank">' + rank + '</td><td>' + escapeHtml(name) + '</td><td>' + time + '</td><td>' + points + '</td><td>' + correct + '</td></tr>');
    }
    bodyEl.innerHTML = rows.join('');
    wrapEl.classList.add('blitz-home-leaderboard-has-entries');
    wrapEl.setAttribute('data-entry-count', String(list.length));
  }

  render();
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) render();
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) render();
  });
})();
