/**
 * livepagenow — Минимальный JavaScript
 * Версия: 2.0
 * Рейтинг, тэги, навигация, покупка
 */

'use strict';

/* ============================================
   1. ДАННЫЕ КНИГИ
   ============================================ */

const book = {
  title: 'Минская женщина-кошка из Маленькой Башкирии',
  author: 'Никита Кандиев',
  description: 'Алиса, девушка с душой кошки, обитает в минском квартале "Маленькая Башкирия", в родительском доме. \nЕё возлюбленный Ирек работает журналистом на местном телевидении, в то время как Алиса постигает тайны IT-технологий.',
  cover: 'image/COVER.jpg',
  buy: 'https://www.litres.ru/book/nikita-kandiev/minskaya-zhenschina-koshka-iz-malenkoy-bashkirii-70258831/',
  vk: 'https://vk.com/livepagenow'
};

/* ============================================
   2. DOM-ССЫЛКИ
   ============================================ */

const $ = (id) => document.getElementById(id);

const el = {
  cover: $('bookCover'),
  title: $('bookTitle'),
  author: $('bookAuthor'),
  desc: $('bookDescription'),
  buy: $('buyButton'),
  stars: $('starsContainer'),
  ratingText: $('ratingText'),
  fill: $('progressFill'),
  progressText: $('progressText'),
  scroll: $('scrollTopBtn'),
  tags: document.getElementById('tagsSection')
};

/* ============================================
   3. РЕНДЕРИНГ КНИГИ
   ============================================ */

el.cover.src = book.cover;
el.cover.alt = `Обложка книги «${book.title}»`;
el.title.textContent = book.title;
el.author.textContent = book.author;
el.desc.textContent = book.description;
el.buy.href = book.buy;

/* ============================================
   4. СИСТЕМА РЕЙТИНГА
   ============================================ */

const STORAGE_KEY = 'livepagenow_book_rating';

// Загрузка рейтинга из localStorage
let rating = (() => {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
})();

// Обновление звёзд и прогресс-бара
function updateStars(r) {
  const stars = el.stars.querySelectorAll('.star');
  for (let i = 0; i < stars.length; i++) {
    stars[i].classList.toggle('active', i < r);
  }

  el.ratingText.textContent = r > 0 ? `Рейтинг: ${r} из 5` : 'Оцените книгу';

  const pct = (r / 5) * 100;
  el.fill.style.width = pct + '%';
  el.progressText.textContent = 'Рейтинг: ' + Math.round(pct) + '%';
}

// Инициализация рейтинга
updateStars(rating);

// Клик по звёздам
el.stars.addEventListener('click', (e) => {
  const star = e.target.closest('.star');
  if (!star) return;

  rating = parseInt(star.dataset.value);
  try {
    localStorage.setItem(STORAGE_KEY, String(rating));
  } catch {
    // Тихая обработка ошибки
  }
  updateStars(rating);
});

/* ============================================
   5. ТЭГИ-ЖАНРЫ (делегирование)
   ============================================ */

el.tags.addEventListener('click', (e) => {
  const tag = e.target.closest('.tag');
  if (!tag) return;

  const tags = el.tags.querySelectorAll('.tag');
  for (let i = 0; i < tags.length; i++) {
    tags[i].classList.remove('active');
  }
  tag.classList.add('active');
});

/* ============================================
   6. ВК-СООБЩЕСТВО
   ============================================ */

document.querySelector('.vk-community').addEventListener('click', () => {
  window.open(book.vk, '_blank');
});

/* ============================================
   7. КНОПКА "НАВЕРХ"
   ============================================ */

let scrollTimer = null;

window.addEventListener('scroll', () => {
  if (scrollTimer) return;

  scrollTimer = requestAnimationFrame(() => {
    el.scroll.classList.toggle('visible', window.pageYOffset > 300);
    scrollTimer = null;
  });
});

el.scroll.addEventListener('click', () => {
  window.scrollTo(0, 0);
});

/* ============================================
   8. КНОПКА ПОКУПКИ
   ============================================ */

el.buy.addEventListener('click', (e) => {
  e.preventDefault();
  window.open(book.buy, '_blank');
});