// ==================== КОНФИГУРАЦИЯ И ПЕРЕМЕННЫЕ ====================

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Массивы для хранения данных о фильмах
let movies = [];          // Все фильмы
let filteredMovies = [];  // Отфильтрованные фильмы
let currentCategory = 'all'; // Текущая выбранная категория

// ==================== ОСНОВНЫЕ ФУНКЦИИ ПРИЛОЖЕНИЯ ====================

/**
 * Инициализация приложения - запускается при загрузке страницы
 */
function initApp() {
    console.log('🚀 Инициализация приложения...');
    
    // Инициализация Telegram Web App
    tg.ready();
    tg.expand();
    
    // Показываем индикатор загрузки
    showLoading();
    
    // Загружаем данные после короткой задержки
    setTimeout(() => {
        loadMovies();           // Загрузка фильмов
        hideLoading();          // Скрытие индикатора загрузки
        renderMovies(movies);   // Отрисовка фильмов
        setupEventListeners();  // Настройка обработчиков событий
        initVolumeSlider();     // Инициализация слайдера громкости
        
        console.log('✅ Приложение успешно инициализировано');
    }, 500);
}

/**
 * Загрузка данных о фильмах
 */
function loadMovies() {
    console.log('📀 Загрузка фильмов...');
    
    // Массив с данными о фильмах
    movies = [
        {
            id: 1,
            title: "Форсаж 9",
            year: "2021",
            poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=400&fit=crop",
            videoUrl: "https://rutube.ru/play/embed/bb0c848e121e79263789b3b19460bff0/",
            category: "films",
            description: "Доминик Торетто ведет спокойную жизнь с Летти и своим сыном."
        },
        {
            id: 2,
            title: "Мстители: Финал",
            year: "2019",
            poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=400&fit=crop",
            videoUrl: "https://rutube.ru/play/embed/1234567891",
            category: "films",
            description: "Оставшиеся в живых члены команды Мстителей пытаются исправить последствия действий Таноса."
        },
        {
            id: 3,
            title: "Игра в кальмара",
            year: "2021",
            poster: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=300&h=400&fit=crop",
            videoUrl: "https://rutube.ru/play/embed/1234567892",
            category: "series",
            description: "Сотни игроков-банкротов принимают приглашение сыграть в детские игры на выживание."
        },
        {
            id: 4,
            title: "Холодное сердце",
            year: "2013",
            poster: "https://images.unsplash.com/photo-1618336756473-37d8fcf7d7be?w=300&h=400&fit=crop",
            videoUrl: "https://rutube.ru/play/embed/1234567893",
            category: "cartoons",
            description: "Бесстрашная Анна отправляется в горы, чтобы найти свою сестру Эльзу."
        }
    ];
    
    // Копируем фильмы в отфильтрованный массив
    filteredMovies = [...movies];
    console.log('✅ Фильмы загружены:', movies.length);
}

/**
 * Отрисовка фильмов в сетке
 * @param {Array} moviesArray - массив фильмов для отрисовки
 */
function renderMovies(moviesArray) {
    console.log('🎬 Отрисовка фильмов:', moviesArray.length);
    
    const moviesList = document.getElementById('moviesList');
    
    // Проверяем, что элемент существует
    if (!moviesList) {
        console.error('❌ Элемент moviesList не найден!');
        return;
    }
    
    // Если фильмов нет - показываем сообщение
    if (moviesArray.length === 0) {
        moviesList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">
                📽️ Фильмы не найдены
            </div>
        `;
        return;
    }
    
    // Создаем HTML для каждого фильма
    moviesList.innerHTML = moviesArray.map(movie => `
        <div class="movie-card" onclick="openMovie(${movie.id})">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster"
                 onerror="this.src='https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=400&fit=crop'">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-year">${movie.year}</div>
            </div>
        </div>
    `).join('');
    
    console.log('✅ Фильмы отрисованы успешно');
}

/**
 * Открытие информации о фильме
 * @param {number} movieId - ID фильма
 */
function openMovie(movieId) {
    console.log('🎥 Открытие фильма:', movieId);
    
    // Находим фильм по ID
    const movie = movies.find(m => m.id === movieId);
    if (!movie) {
        console.error('❌ Фильм не найден:', movieId);
        return;
    }
    
    // Показываем попап с информацией о фильме
    tg.showPopup({
        title: `🎬 ${movie.title} (${movie.year})`,
        message: movie.description,
        buttons: [
            {id: 'watch', type: 'default', text: '🎥 Смотреть фильм'},
            {id: 'cancel', type: 'cancel'}
        ]
    }, function(buttonId) {
        // Обработка нажатия кнопки
        if (buttonId === 'watch') {
            playVideo(movie.videoUrl, movie.title);
        }
    });
}

/**
 * Воспроизведение видео
 * @param {string} videoUrl - URL видео
 * @param {string} title - название фильма
 */
function playVideo(videoUrl, title) {
    console.log('▶️ Воспроизведение видео:', title);
    
    const playerContainer = document.getElementById('playerContainer');
    const videoPlayerContainer = document.getElementById('rutubePlayer');
    
    // Проверяем элементы
    if (!playerContainer || !videoPlayerContainer) {
        console.error('❌ Контейнеры плеера не найдены!');
        return;
    }
    
    // Создаем iframe с видео
    videoPlayerContainer.innerHTML = `
        <iframe 
            class="rutube-iframe"
            src="${videoUrl}" 
            frameborder="0" 
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
        ></iframe>
    `;
    
    // Показываем плеер
    playerContainer.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Видеоплеер открыт');
}

/**
 * Закрытие видеоплеера
 */
function closePlayer() {
    console.log('❌ Закрытие плеера');
    
    const playerContainer = document.getElementById('playerContainer');
    const videoPlayerContainer = document.getElementById('rutubePlayer');
    
    // Очищаем видео
    if (videoPlayerContainer) {
        videoPlayerContainer.innerHTML = '';
    }
    
    // Скрываем плеер
    if (playerContainer) {
        playerContainer.style.display = 'none';
    }
    
    // Возвращаем скролл
    document.body.style.overflow = 'auto';
}

// ==================== СЛАЙДЕР ГРОМКОСТИ ====================

/**
 * Инициализация слайдера громкости
 */
function initVolumeSlider() {
    console.log('🎚️ Инициализация слайдера громкости...');
    
    const slider = document.getElementById('volumeSlider');
    const progress = document.getElementById('volumeProgress');
    const thumb = document.getElementById('volumeThumb');

    let isDragging = false; // Флаг перетаскивания

    /**
     * Обновление позиции слайдера и прогресса
     * @param {number} percent - процент громкости (0-100)
     */
    const updateThumbAndProgress = (percent) => {
        // Ограничиваем значение от 0 до 100
        percent = Math.max(0, Math.min(100, percent));
        
        // Обновляем визуальное отображение
        progress.style.width = `${percent}%`;
        thumb.style.left = `${percent}%`;
        
        // Обновляем громкость видео (заглушка)
        updateVideoVolume(percent / 100);
    }

    /**
     * Обработка перемещения мыши/тача
     * @param {number} clientX - координата X
     */
    const onMove = (clientX) => {
        const rect = slider.getBoundingClientRect();
        // Вычисляем процент на основе позиции курсора
        const percent = ((clientX - rect.left) / rect.width) * 100;
        updateThumbAndProgress(percent);
    }

    // Обработчик начала перетаскивания
    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
    });

    // Обработчик движения мыши при перетаскивании
    function onMouseMove(e) {
        if (isDragging) onMove(e.clientX);
    }

    // Обработчик окончания перетаскивания
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', stopDrag);
    }

    // Обработчик клика по слайдеру
    slider.addEventListener('click', (e) => {
        onMove(e.clientX);
    });

    // Устанавливаем начальное значение громкости
    updateThumbAndProgress(70);
    console.log('✅ Слайдер громкости инициализирован');
}

/**
 * Обновление громкости видео (заглушка)
 * @param {number} volume - громкость от 0 до 1
 */
function updateVideoVolume(volume) {
    // В реальном приложении здесь будет код для управления громкостью видео
    console.log('🔊 Установка громкости:', volume);
}

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

/**
 * Настройка обработчиков событий
 */
function setupEventListeners() {
    console.log('🔧 Настройка обработчиков событий...');
    
    // Обработчик поиска
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterMovies(searchTerm, currentCategory);
        });
    }
    
    // Обработчики кнопок категорий
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Снимаем активный класс со всех кнопок
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Обновляем текущую категорию
            const category = this.dataset.category;
            currentCategory = category;
            
            // Применяем фильтрацию
            filterMovies(searchInput.value.toLowerCase().trim(), category);
        });
    });
    
    // Обработчик клавиши ESC для закрытия плеера
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePlayer();
        }
    });
    
    console.log('✅ Обработчики событий настроены');
}

/**
 * Фильтрация фильмов по поиску и категории
 * @param {string} searchTerm - поисковый запрос
 * @param {string} category - категория для фильтрации
 */
function filterMovies(searchTerm, category) {
    console.log('🔍 Фильтрация фильмов:', { searchTerm, category });
    
    let results = [...movies];
    
    // Фильтрация по категории
    if (category !== 'all') {
        results = results.filter(movie => movie.category === category);
    }
    
    // Фильтрация по поисковому запросу
    if (searchTerm) {
        results = results.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Обновляем отфильтрованный массив и перерисовываем
    filteredMovies = results;
    renderMovies(filteredMovies);
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

/**
 * Показать индикатор загрузки
 */
function showLoading() {
    const loading = document.getElementById('loading');
    const moviesList = document.getElementById('moviesList');
    
    if (loading) loading.style.display = 'block';
    if (moviesList) moviesList.innerHTML = '';
}

/**
 * Скрыть индикатор загрузки
 */
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

// ==================== ЗАПУСК ПРИЛОЖЕНИЯ ====================

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM загружен, запуск приложения...');
    initApp();
});

// Делаем функции глобальными для использования в HTML
window.openMovie = openMovie;
window.closePlayer = closePlayer;
