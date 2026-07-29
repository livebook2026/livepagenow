/**
 * livepagenow — Оптимизированный JavaScript
 * - Удалены VK и OK кнопки
 * - Оставлен только ВК-сообщество
 * - Делегирование для тэгов
 * - Минимальный код
 */

'use strict';

// ============================================
// 1. ДАННЫЕ КНИГИ
// ============================================
const bookData = {
  title: 'Минская женщина-кошка из Маленькой Башкирии',
  author: 'Никита Кандиев',
  description: 'Алиса, девушка с душой кошки, обитает в минском квартале "Маленькая Башкирия", в родительском доме. \nЕё возлюбленный Ирек работает журналистом на местном телевидении, в то время как Алиса постигает тайны IT-технологий.',
  coverUrl: 'image/COVER.jpg',
  purchaseLink: 'https://www.litres.ru/book/nikita-kandiev/minskaya-zhenschina-koshka-iz-malenkoy-bashkirii-70258831/',
  vkCommunityUrl: 'https://vk.com/livepagenow'
};

// ============================================
// 2. КЭШИРОВАНИЕ DOM
// ============================================
const DOM = {
  cover: document.getElementById('bookCover'),
  title: document.getElementById('bookTitle'),
  author: document.getElementById('bookAuthor'),
  description: document.getElementById('bookDescription'),
  buyBtn: document.getElementById('buyButton'),
  stars: document.getElementById('starsContainer'),
  ratingText: document.getElementById('ratingText'),
  progressFill: document.getElementById('progressFill'),
  progressText: document.getElementById('progressText'),
  scrollBtn: document.getElementById('scrollTopBtn'),
  tagsSection: document.getElementById('tagsSection')
};

// ============================================
// 3. РЕНДЕРИНГ КНИГИ
// ============================================
function renderBook() {
  DOM.cover.src = bookData.coverUrl;
  DOM.cover.alt = `Обложка книги «${bookData.title}»`;
  DOM.title.textContent = bookData.title;
  DOM.author.textContent = bookData.author;
  DOM.description.textContent = bookData.description;
  DOM.buyBtn.href = bookData.purchaseLink;
}

renderBook();

// ============================================
// 4. СИСТЕМА РЕЙТИНГА
// ============================================
const STORAGE_KEY = 'livepagenow_book_rating';

function loadRating() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

function saveRating(rating) {
  try {
    localStorage.setItem(STORAGE_KEY, String(rating));
  } catch {
    // Тихая обработка
  }
}

let currentRating = loadRating();

function updateStars(rating) {
  const stars = DOM.stars.querySelectorAll('.star');
  const len = stars.length;
  
  for (let i = 0; i < len; i++) {
    stars[i].classList.toggle('active', i < rating);
  }
  
  DOM.ratingText.textContent = rating > 0 ? `Рейтинг: ${rating} из 5` : 'Оцените книгу';
  updateProgress(rating);
}

function updateProgress(rating) {
  const percentage = (rating / 5) * 100;
  DOM.progressFill.style.width = `${percentage}%`;
  DOM.progressText.textContent = `Рейтинг: ${Math.round(percentage)}%`;
}

updateStars(currentRating);

// Обработчики рейтинга
DOM.stars.addEventListener('click', (e) => {
  const star = e.target.closest('.star');
  if (!star) return;
  
  const rating = parseInt(star.dataset.value);
  currentRating = rating;
  saveRating(rating);
  updateStars(rating);
});

DOM.stars.addEventListener('mouseover', (e) => {
  const star = e.target.closest('.star');
  if (!star) return;
  
  const value = parseInt(star.dataset.value);
  const stars = DOM.stars.querySelectorAll('.star');
  const len = stars.length;
  
  for (let i = 0; i < len; i++) {
    stars[i].classList.toggle('hover', i < value);
  }
});

DOM.stars.addEventListener('mouseleave', () => {
  const stars = DOM.stars.querySelectorAll('.star');
  const len = stars.length;
  
  for (let i = 0; i < len; i++) {
    stars[i].classList.remove('hover');
  }
});

// ============================================
// 5. ТЭГИ (делегирование)
// ============================================
DOM.tagsSection.addEventListener('click', (e) => {
  const tag = e.target.closest('.tag');
  if (!tag) return;
  
  const tags = DOM.tagsSection.querySelectorAll('.tag');
  const len = tags.length;
  
  for (let i = 0; i < len; i++) {
    tags[i].classList.remove('active');
  }
  
  tag.classList.add('active');
});

// ============================================
// 6. ВК-СООБЩЕСТВО
// ============================================
document.querySelector('.social-btn.vk-community').addEventListener('click', () => {
  window.open(bookData.vkCommunityUrl, '_blank');
});

// ============================================
// 7. КНОПКА "НАВЕРХ"
// ============================================
let scrollTimeout;

window.addEventListener('scroll', () => {
  if (scrollTimeout) return;
  
  scrollTimeout = requestAnimationFrame(() => {
    const isVisible = window.pageYOffset > 300;
    DOM.scrollBtn.classList.toggle('visible', isVisible);
    scrollTimeout = null;
  });
});

DOM.scrollBtn.addEventListener('click', () => {
  window.scrollTo(0, 0);
});

// ============================================
// 8. ПОКУПКА
// ============================================
DOM.buyBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.open(bookData.purchaseLink, '_blank');
});