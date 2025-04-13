// Variáveis globais
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
let currentIndex = 0;
let isFlipped = false;
let currentCategory = 'all';

const frontEl = document.getElementById('flashcard-front');
const backEl = document.getElementById('flashcard-back');
const flashcardEl = document.getElementById('flashcard');
const categoryFilter = document.getElementById('category-filter');
const studyModeSelect = document.getElementById('study-mode');
const statsOverview = document.getElementById('stats-overview');

function renderFlashcard() {
  const filtered = getFilteredCards();
  if (filtered.length === 0) {
    frontEl.textContent = 'Sem cards';
    backEl.textContent = '';
    return;
  }
  const card = filtered[currentIndex % filtered.length];
  frontEl.textContent = card.front;
  backEl.textContent = card.back;
  updateStats();
}

function getFilteredCards() {
  return currentCategory === 'all'
    ? flashcards
    : flashcards.filter(c => c.category === currentCategory);
}

function flipCard() {
  isFlipped = !isFlipped;
  flashcardEl.classList.toggle('flipped', isFlipped);
}

function nextCard() {
  isFlipped = false;
  flashcardEl.classList.remove('flipped');
  currentIndex = (currentIndex + 1) % getFilteredCards().length;
  renderFlashcard();
}

function prevCard() {
  isFlipped = false;
  flashcardEl.classList.remove('flipped');
  currentIndex = (currentIndex - 1 + getFilteredCards().length) % getFilteredCards().length;
  renderFlashcard();
}

function updateStats() {
  statsOverview.textContent = `Total: ${flashcards.length} cards | Categoria: ${currentCategory}`;
}

function saveCards() {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

function updateCategories() {
  const categories = [...new Set(flashcards.map(c => c.category))];
  categoryFilter.innerHTML = '<option value="all">Todas</option>' +
    categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function loadTheme() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') document.body.classList.add('dark-mode');
}

// Eventos
document.getElementById('flip').addEventListener('click', flipCard);
document.getElementById('next').addEventListener('click', nextCard);
document.getElementById('prev').addEventListener('click', prevCard);
document.getElementById('toggle-theme').addEventListener('click', toggleTheme);

categoryFilter.addEventListener('change', e => {
  currentCategory = e.target.value;
  currentIndex = 0;
  renderFlashcard();
});

document.getElementById('add-flashcard').addEventListener('click', () => {
  document.getElementById('flashcard-editor').showModal();
});

document.getElementById('save-card').addEventListener('click', () => {
  const front = document.getElementById('card-front').value;
  const back = document.getElementById('card-back').value;
  const category = document.getElementById('card-category').value || 'geral';
  flashcards.push({ front, back, category });
  saveCards();
  updateCategories();
  renderFlashcard();
});

document.getElementById('cancel-card').addEventListener('click', () => {
  document.getElementById('flashcard-editor').close();
});

// Inicialização
loadTheme();
updateCategories();
renderFlashcard();
