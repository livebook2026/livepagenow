/**
 * Данные книги для издательства livepagenow
 */
const bookData = {
  title: 'Минская женщина-кошка из Маленькой Башкирии',
  author: 'Никита Кандиев',
  description: 'Алиса, девушка с душой кошки, обитает в минском квартале "Маленькая Башкирия", в родительском доме. Её возлюбленный Ирек работает журналистом на местном телевидении, в то время как Алиса постигает тайны IT-технологий.',
  coverUrl: 'image/COVER.jpg',
  purchaseLink: 'https://www.litres.ru/book/nikita-kandiev/minskaya-zhenschina-koshka-iz-malenkoy-bashkirii-70258831/',
  fragmentLink: 'https://www.litres.ru/book/nikita-kandiev/minskaya-zhenschina-koshka-iz-malenkoy-bashkirii-70258831/chitat-onlayn/',
  tags: ['Современная проза', 'Драма', 'IT-роман', 'Любовный роман', 'Городская проза'],
  vkCommunityUrl: 'https://vk.com/livepagenow' // Замените на актуальную ссылку
};

// ============================================
// 1. Рендеринг основной информации
// ============================================
const coverEl = document.getElementById('bookCover');
const titleEl = document.getElementById('bookTitle');
const authorEl = document.getElementById('bookAuthor');
const descEl = document.getElementById('bookDescription');
const buyBtn = document.getElementById('buyButton');
const fragmentBtn = document.getElementById('fragmentButton');

function renderBook() {
  coverEl.src = bookData.coverUrl;
  coverEl.alt = `Обложка книги «${bookData.title}»`;
  titleEl.textContent = bookData.title;
  authorEl.textContent = bookData.author;
  descEl.textContent = bookData.description;
  buyBtn.href = bookData.purchaseLink;
  fragmentBtn.href = bookData.fragmentLink;
}

renderBook();

// ============================================
// 2. Система рейтинга
// ============================================
const STORAGE_KEY = 'livepagenow_book_rating';

function loadRating() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      return parseInt(saved, 10);
    }
  } catch (e) {
    console.warn('Не удалось загрузить рейтинг:', e);
  }
  return 0;
}

function saveRating(rating) {
  try {
    localStorage.setItem(STORAGE_KEY, String(rating));
  } catch (e) {
    console.warn('Не удалось сохранить рейтинг:', e);
  }
}

const starsContainer = document.getElementById('starsContainer');
const ratingText = document.getElementById('ratingText');
let currentRating = loadRating();

function updateStars(rating) {
  const stars = starsContainer.querySelectorAll('.star');
  stars.forEach((star, index) => {
    star.classList.toggle('active', index < rating);
  });
  
  if (rating > 0) {
    ratingText.textContent = `Рейтинг: ${rating} из 5`;
  } else {
    ratingText.textContent = 'Оцените книгу';
  }
}

starsContainer.addEventListener('click', (e) => {
  const star = e.target.closest('.star');
  if (!star) return;
  
  const rating = parseInt(star.dataset.value);
  currentRating = rating;
  saveRating(rating);
  updateStars(rating);
  
  star.classList.add('clicked');
  setTimeout(() => star.classList.remove('clicked'), 300);
});

starsContainer.addEventListener('mouseover', (e) => {
  const star = e.target.closest('.star');
  if (!star) return;
  
  const value = parseInt(star.dataset.value);
  const stars = starsContainer.querySelectorAll('.star');
  stars.forEach((s, index) => {
    s.classList.toggle('hover', index < value);
  });
});

starsContainer.addEventListener('mouseleave', () => {
  const stars = starsContainer.querySelectorAll('.star');
  stars.forEach(s => s.classList.remove('hover'));
});

// ============================================
// 3. Тэги/жанры
// ============================================
const tags = document.querySelectorAll('.tag');

tags.forEach(tag => {
  tag.addEventListener('click', () => {
    const tagName = tag.dataset.tag;
    console.log(`[Тэг] Выбран жанр: ${tagName}`);
    
    tags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    
    tag.style.transform = 'scale(0.92)';
    setTimeout(() => {
      tag.style.transform = '';
    }, 200);
  });
});

// ============================================
// 4. Кнопки поделиться
// ============================================
function getShareUrl(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(`${bookData.title} — ${bookData.author}`);
  
  const shareUrls = {
    vk: `https://vk.com/share.php?url=${url}&title=${title}&description=${encodeURIComponent(bookData.description.slice(0, 100))}`,
    ok: `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${url}&st.comments=${title}`
  };
  
  return shareUrls[platform] || '';
}

document.querySelectorAll('[data-share]').forEach(btn => {
  btn.addEventListener('click', () => {
    const platform = btn.dataset.share;
    
    if (platform === 'vk-community') {
      window.open(bookData.vkCommunityUrl, '_blank');
      return;
    }
    
    const shareUrl = getShareUrl(platform);
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes');
    }
  });
});

// ============================================
// 5. Покупка и фрагмент
// ============================================
buyBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(`[Покупка] ${bookData.title} — переход по ссылке: ${bookData.purchaseLink}`);
  window.open(bookData.purchaseLink, '_blank');
});

fragmentBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(`[Фрагмент] ${bookData.title} — открытие фрагмента на ЛитРес`);
  window.open(bookData.fragmentLink, '_blank');
});

// ============================================
// Инициализация
// ============================================
updateStars(currentRating);

console.log('📚 livepagenow — книга загружена:', bookData.title);
console.log(`⭐ Рейтинг: ${currentRating}/5`);
console.log(`🏷️ Жанры: ${bookData.tags.join(', ')}`);
console.log(`🔗 ВК-сообщество: ${bookData.vkCommunityUrl}`);