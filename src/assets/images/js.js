// Configurações
const weddingDate = new Date('2026-01-23T00:00:00');
const refreshMs = 50;

// Estado para detectar mudança (shuffle)
const state = {
  days: null,
  hours: null,
  minutes: null,
  seconds: null
};

function pad2(n) {
  return (n < 10) ? '0' + n : '' + n;
}

function calcTime() {
  const now = new Date();
  const diff = weddingDate - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function flipUnit(unitName, newValue) {
  const container = document.querySelector(`.flipUnitContainer[data-unit="${unitName}"]`);
  if (!container) return;

  const upper = container.querySelector('.upperCard span');
  const lower = container.querySelector('.lowerCard span');
  const topFlip = container.querySelector('.flipCard.top');
  const bottomFlip = container.querySelector('.flipCard.bottom');

  const current = parseInt(upper.textContent, 10) || 0;
  if (current === newValue) return;

  const currentText = pad2(current);
  const newText = pad2(newValue);

  topFlip.querySelector('span').textContent = currentText;
  bottomFlip.querySelector('span').textContent = newText;

  topFlip.classList.add('fold');
  bottomFlip.classList.add('unfold');

  function onTopEnd() {
    topFlip.classList.remove('fold');
    upper.textContent = newText;
    topFlip.removeEventListener('animationend', onTopEnd);
  }

  function onBottomEnd() {
    bottomFlip.classList.remove('unfold');
    lower.textContent = newText;
    bottomFlip.removeEventListener('animationend', onBottomEnd);
  }

  topFlip.addEventListener('animationend', onTopEnd);
  bottomFlip.addEventListener('animationend', onBottomEnd);
}

function updateAll() {
  const t = calcTime();
  if (state.days !== t.days) flipUnit('days', t.days);
  if (state.hours !== t.hours) flipUnit('hours', t.hours);
  if (state.minutes !== t.minutes) flipUnit('minutes', t.minutes);
  if (state.seconds !== t.seconds) flipUnit('seconds', t.seconds);

  state.days = t.days;
  state.hours = t.hours;
  state.minutes = t.minutes;
  state.seconds = t.seconds;
}

function initDisplay() {
  const t = calcTime();
  ['days', 'hours', 'minutes', 'seconds'].forEach(u => {
    const container = document.querySelector(`.flipUnitContainer[data-unit="${u}"]`);
    if (!container) return;
    const upper = container.querySelector('.upperCard span');
    const lower = container.querySelector('.lowerCard span');
    const v = t[u];
    const txt = pad2(v);
    upper.textContent = txt;
    lower.textContent = txt;
    container.querySelector('.flipCard.top span').textContent = txt;
    container.querySelector('.flipCard.bottom span').textContent = txt;
  });

  state.days = t.days;
  state.hours = t.hours;
  state.minutes = t.minutes;
  state.seconds = t.seconds;
}

initDisplay();
setInterval(updateAll, refreshMs);

const card = document.getElementById('card');
const tapHint = document.getElementById('tapHint');

card.addEventListener('click', () => {
  card.classList.toggle('active');
  const opened = card.classList.contains('active');
  tapHint.textContent = opened ? '↑ Clique para fechar' : '↓ Clique para ver a contagem';
});