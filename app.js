// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Глобальные переменные для хранения данных
let movies = [];          // Полный список фильмов
let filteredMovies = [];  // Отфильтрованный список фильмов
let currentCategory = 'all'; // Текущая выбранная категория

/**
 * Основная функция инициализации приложения
 * Вызывается при загрузке DOM
 */
function initApp() {
    console.log('Initializing app...');
    
    // Инициализация Telegram Web App
    tg.ready();
    tg.expand(); // Развернуть приложение на весь экран
    
    showLoading();
    
    // Имитация загрузки данных с задержкой
    setTimeout(() => {
        loadMovies();
        hideLoading();
        renderMovies(movies);
        setupEventListeners();
        initVolumeSlider();
        console.log('App initialized successfully');
    }, 100);
}

/**
 * Инициализация слайдера громкости
 * Создает интерактивный слайдер с обработкой событий мыши и касаний
 */
function initVolumeSlider() {
    const slider = document.getElementById('volumeSlider');
    const progress = document.getElementById('volumeProgress');
    const thumb = document.getElementById('volumeThumb');

    let isDragging = false;
    let sliderRect = slider.getBoundingClientRect();

    /**
     * Обновляет позицию thumb и прогресс слайдера
     * @param {number} percent - процент громкости (0-100)
     */
    const updateThumbAndProgress = (percent) => {
        percent = Math.max(0, Math.min(100, percent)); // Ограничение диапазона
        const px = (percent / 100) * sliderRect.width;
        progress.style.width = `${percent}%`;
        thumb.style.left = `${px}px`;
        
        // Обновление громкости в видео
        updateVideoVolume(percent / 100);
    }

    /**
     * Рассчитывает процент на основе позиции курсора
     * @param {number} clientX - координата X курсора
     * @returns {number} процент положения
     */
    const getPercentFromClientX = (clientX) => {
        const offsetX = clientX - sliderRect.left;
        return (offsetX / sliderRect.width) * 100;
    }

    /**
     * Обработчик перемещения курсора/касания
     * @param {number} clientX - координата X
     */
    const onMove = (clientX) => {
        const percent = getPercentFromClientX(clientX);
        updateThumbAndProgress(percent);
    }

    // Обработчики событий мыши
    const onMouseDown = (e) => {
        isDragging = true;
        sliderRect = slider.getBoundingClientRect();
        onMove(e.clientX);
        thumb.classList.add('active');
        e.preventDefault();
    }

    // Обработчики событий касания
    const onTouchStart = (e) => {
        isDragging = true;
        sliderRect = slider.getBoundingClientRect();
        onMove(e.touches[0].clientX);
        thumb.classList.add('active');
        e.preventDefault();
    }

    const onMouseMove = (e) => {
        if (isDragging) onMove(e.clientX);
    }

    const onTouchMove = (e) => {
        if (isDragging) onMove(e.touches[0].clientX);
        e.preventDefault();
    }

    // Остановка перетаскивания
    const stopDrag = () => {
        isDragging = false;
        thumb.classList.remove('active');
    }

    // Назначение обработчиков событий для thumb
    thumb.addEventListener('mousedown', onMouseDown);
    thumb.addEventListener('touchstart', onTouchStart, { passive: false });

    // Глобальные обработчики событий перетаскивания
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', stopDrag);

    // Обработчики клика по слайдеру
    slider.addEventListener('mousedown', (e) => {
        sliderRect = slider.getBoundingClientRect();
        onMove(e.clientX);
    });

    slider.addEventListener('touchstart', (e) => {
        sliderRect = slider.getBoundingClientRect();
        onMove(e.touches[0].clientX);
        e.preventDefault();
    }, { passive: false });

    // Инициализация слайдера значением 70%
    updateThumbAndProgress(70);
}

/**
 * Обновление громкости видео (заглушка)
 * @param {number} volume - громкость от 0 до 1
 */
function updateVideoVolume(volume) {
    const iframe = document.querySelector('.rutube-iframe');
    if (iframe && iframe.contentWindow) {
        // Заметка: RuTube iframe может не поддерживать внешний контроль громкости
        // Это в основном демонстрация UI
        console.log('Setting volume to:', volume);
    }
}

/**
 * Загрузка данных о фильмах
 * В реальном приложении здесь был бы API запрос
 */
function loadMovies() {
    movies = [
        {
            id: 1,
            title: "Форсаж 9",
            year: "2021",
            poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=400&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/bb0c848e121e79263789b3b19460bff0/",
            rutubePageUrl: "https://rutube.ru/video/bb0c848e121e79263789b3b19460bff0/",
            category: "films",
            description: "Доминик Торетто ведет спокойную жизнь с Летти и своим сыном."
        },
        {
            id: 2,
            title: "Мстители: Финал",
            year: "2019",
            poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=400&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/1234567891",
            rutubePageUrl: "https://rutube.ru/video/1234567891/",
            category: "films",
            description: "Оставшиеся в живых члены команды Мстителей пытаются исправить последствия действий Таноса."
        }
        // ... можно добавить больше фильмов
    ];
    
    // Инициализация отфильтрованного списка
    filteredMovies = [...movies];
}

/**
 * Отрисовка списка фильмов в сетке
 * @param {Array} moviesArray - массив фильмов для отображения
 */
function renderMovies(moviesArray) {
    const moviesList = document.getElementById('moviesList');
    
    // Проверка на пустой список
    if (moviesArray.length === 0) {
        moviesList.innerHTML = `
            <div class="empty-state">
                <h3>🎬 Фильмы не найдены</h3>
                <p>Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
            </div>
        `;
        return;
    }
    
    // Генерация HTML для каждой карточки фильма
    moviesList.innerHTML = moviesArray.map(movie => `
        <div class="movie-card" onclick="openMovie(${movie.id})">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster"
                 onerror="this.src='https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=400&fit=crop'">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-year">${movie.year}</div>
            </div>
        </div>
    `).join(''); // Объединение массива в строку
}

/**
 * Открытие попапа с информацией о фильме
 * @param {number} movieId - ID фильма
 */
function openMovie(movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;
    
    // Показ Telegram попапа
    tg.showPopup({
        title: `${movie.title} (${movie.year})`,
        message: movie.description,
        buttons: [
            {id: 'watch', type: 'default', text: '🎥 Смотреть'},
            {id: 'cancel', type: 'cancel'}
        ]
    }, function(buttonId) {
        if (buttonId === 'watch') {
            playRuTubeVideo(movie.rutubeEmbedUrl, movie.rutubePageUrl);
        }
    });
}

/**
 * Воспроизведение видео в RuTube плеере
 * @param {string} embedUrl - URL для embed iframe
 * @param {string} pageUrl - URL страницы видео
 */
function playRuTubeVideo(embedUrl, pageUrl) {
    const playerContainer = document.getElementById('playerContainer');
    const videoPlayerContainer = document.getElementById('rutubePlayer');
    
    // Вставка iframe с видео
    videoPlayerContainer.innerHTML = `
        <iframe 
            class="rutube-iframe"
            src="${embedUrl}" 
            frameborder="0" 
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
        ></iframe>
    `;
    
    // Показ контейнера с плеером
    playerContainer.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Блокировка прокрутки основного контента
}

/**
 * Закрытие видеоплеера
 */
function closePlayer() {
    const playerContainer = document.getElementById('playerContainer');
    const videoPlayerContainer = document.getElementById('rutubePlayer');
    
    // Очистка iframe и скрытие контейнера
    videoPlayerContainer.innerHTML = '';
    playerContainer.style.display = 'none';
    document.body.style.overflow = 'auto'; // Восстановление прокрутки
}

/**
 * Настройка всех обработчиков событий
 */
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    
    // Обработчик ввода в поисковую строку
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterMovies(searchTerm, currentCategory);
    });
    
    // Обработчики кликов по категориям
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Сброс активного состояния у всех кнопок
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Установка активного состояния на текущую кнопку
            this.classList.add('active');
            
            const category = this.dataset.category;
            currentCategory = category;
            filterMovies(searchInput.value.toLowerCase().trim(), category);
        });
    });
    
    // Обработчик клавиши Escape для закрытия плеера
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePlayer();
        }
    });
}

/**
 * Фильтрация фильмов по поисковому запросу и категории
 * @param {string} searchTerm - поисковый запрос
 * @param {string} category - категория для фильтрации
 */
function filterMovies(searchTerm, category) {
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
    
    // Обновление отфильтрованного списка и перерисовка
    filteredMovies = results;
    renderMovies(filteredMovies);
}

/**
 * Показ индикатора загрузки
 */
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('moviesList').innerHTML = '';
}

/**
 * Скрытие индикатора загрузки
 */
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);
