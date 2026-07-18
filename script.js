/**
 * Данные книги для издательства livepagenow
 */
const bookData = {
  title: 'Минская женщина-кошка из Маленькой Башкирии',
  author: 'Никита Кандиев',
  description: 'Алиса, девушка с душой кошки, обитает в минском квартале "Маленькая Башкирия", в родительском доме. \nЕё возлюбленный Ирек работает журналистом на местном телевидении, в то время как Алиса постигает тайны IT-технологий.',
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
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
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
  
  updateProgress(rating);
}

function updateProgress(rating) {
  const percentage = (rating / 5) * 100;
  progressFill.style.width = `${percentage}%`;
  progressText.textContent = `Рейтинг: ${Math.round(percentage)}%`;
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
// 3. Копирование описания
// ============================================
const copyButton = document.getElementById('copyButton');

copyButton.addEventListener('click', async () => {
  const description = bookData.description;
  
  try {
    await navigator.clipboard.writeText(description);
    
    copyButton.classList.add('copied');
    copyButton.innerHTML = '✅ Скопировано!';
    
    setTimeout(() => {
      copyButton.classList.remove('copied');
      copyButton.innerHTML = '📋 Копировать';
    }, 2000);
    
    console.log('📋 Описание скопировано в буфер обмена');
  } catch (err) {
    const textarea = document.createElement('textarea');
    textarea.value = description;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    copyButton.classList.add('copied');
    copyButton.innerHTML = '✅ Скопировано!';
    
    setTimeout(() => {
      copyButton.classList.remove('copied');
      copyButton.innerHTML = '📋 Копировать';
    }, 2000);
  }
});

// ============================================
// 4. Кнопка "Наверх"
// ============================================
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ============================================
// 5. Микро-анимации
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.tag, .social-btn, .action-buttons a');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 50);
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
    observer.observe(el);
  });
});

// ============================================
// 6. Тэги/жанры
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
// 7. Кнопки поделиться (ОБНОВЛЕНО)
// ============================================
function getShareUrl(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(`${bookData.title} — ${bookData.author}`);
  const description = encodeURIComponent(bookData.description.slice(0, 100));
  
  const shareUrls = {
    vk: `https://vk.com/share.php?url=${url}&title=${title}&description=${description}`,
    ok: `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${url}&st.comments=${title}`,
    // NEW: Email
    email: `mailto:?subject=${title}&body=Рекомендую книгу: ${decodeURIComponent(title)}%0A%0A${decodeURIComponent(bookData.description)}%0A%0AСсылка: ${decodeURIComponent(url)}`
  };
  
  return shareUrls[platform] || '';
}

document.querySelectorAll('[data-share]').forEach(btn => {
  btn.addEventListener('click', () => {
    const platform = btn.dataset.share;
    
    // ВК-сообщество
    if (platform === 'vk-community') {
      window.open(bookData.vkCommunityUrl, '_blank');
      return;
    }
    
    // NEW: Копировать ссылку
    if (platform === 'copy-link') {
      const link = window.location.href;
      navigator.clipboard.writeText(link).then(() => {
        btn.classList.add('copied');
        btn.textContent = '✅ Скопировано!';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = '🔗 Копировать ссылку';
        }, 2000);
        console.log('🔗 Ссылка скопирована:', link);
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        btn.classList.add('copied');
        btn.textContent = '✅ Скопировано!';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = '🔗 Копировать ссылку';
        }, 2000);
      });
      return;
    }
    
    // Остальные платформы
    const shareUrl = getShareUrl(platform);
    if (shareUrl) {
      if (platform === 'email') {
        window.location.href = shareUrl;
      } else {
        window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes');
      }
    }
  });
});

// ============================================
// 8. Покупка и фрагмент
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