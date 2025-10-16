const tg = window.Telegram.WebApp;

let movies = [];
let filteredMovies = [];
let currentCategory = 'all';

function initApp() {
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation();
    
    showLoading();
    
    setTimeout(() => {
        loadMovies();
        hideLoading();
        renderMovies(movies);
        setupEventListeners();
    }, 1000);
}

function loadMovies() {
    movies = [
        {
            id: 1,
            title: "Форсаж 9",
            year: "2021",
            poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=450&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/bb0c848e121e79263789b3b19460bff0/", // Замени на реальную embed ссылку
            rutubePageUrl: "https://rutube.ru/video/bb0c848e121e79263789b3b19460bff0/", // Замени на реальную страницу видео
            category: "films",
            description: "Доминик Торетто ведет спокойную жизнь с Летти и своим сыном."
        },
        {
            id: 2,
            title: "Мстители: Финал",
            year: "2019",
            poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/1234567891",
            rutubePageUrl: "https://rutube.ru/video/1234567891/",
            category: "films",
            description: "Оставшиеся в живых члены команды Мстителей пытаются исправить последствия действий Таноса."
        },
        {
            id: 3,
            title: "Игра в кальмара",
            year: "2021",
            poster: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=300&h=450&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/1234567892",
            rutubePageUrl: "https://rutube.ru/video/1234567892/",
            category: "series",
            description: "Сотни игроков-банкротов принимают приглашение сыграть в детские игры на выживание."
        },
        {
            id: 4,
            title: "Холодное сердце",
            year: "2013",
            poster: "https://images.unsplash.com/photo-1618336756473-37d8fcf7d7be?w=300&h=450&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/1234567893",
            rutubePageUrl: "https://rutube.ru/video/1234567893/",
            category: "cartoons",
            description: "Бесстрашная Анна отправляется в горы, чтобы найти свою сестру Эльзу."
        },
        {
            id: 5,
            title: "Джон Уик 4",
            year: "2023",
            poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/1234567894",
            rutubePageUrl: "https://rutube.ru/video/1234567894/",
            category: "films",
            description: "Джон Уик продолжает бороться с мафией и наемниками."
        },
        {
            id: 6,
            title: "Ведьмак",
            year: "2019",
            poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=450&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/1234567895",
            rutubePageUrl: "https://rutube.ru/video/1234567895/",
            category: "series",
            description: "Геральт из Ривии, мутант-охотник на чудовищ, пытается найти свое место в мире."
        }
    ];
    
    filteredMovies = [...movies];
}

function renderMovies(moviesArray) {
    const moviesList = document.getElementById('moviesList');
    
    if (moviesArray.length === 0) {
        moviesList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">
                📽️ Фильмы не найдены
            </div>
        `;
        return;
    }
    
    moviesList.innerHTML = moviesArray.map(movie => `
        <div class="movie-card" onclick="openMovie(${movie.id})">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster"
                 onerror="this.src='https://via.placeholder.com/300x450/333/fff?text=🎬'">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-year">${movie.year}</div>
            </div>
        </div>
    `).join('');
}

function openMovie(movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;
    
    tg.showPopup({
        title: `🎬 ${movie.title} (${movie.year})`,
        message: movie.description,
        buttons: [
            {id: 'watch', type: 'default', text: '🎥 Смотреть фильм'},
            {id: 'cancel', type: 'cancel'}
        ]
    }, function(buttonId) {
        if (buttonId === 'watch') {
            playRuTubeVideo(movie.rutubeEmbedUrl, movie.rutubePageUrl, movie.title);
        }
    });
}

function playRuTubeVideo(embedUrl, pageUrl, title) {
    const playerContainer = document.getElementById('playerContainer');
    const videoPlayerContainer = document.getElementById('rutubePlayer');
    
    console.log('Opening RuTube video:', embedUrl);
    
    // Создаем iframe с RuTube видеоплеером
    videoPlayerContainer.innerHTML = `
        <iframe 
            class="rutube-iframe"
            src="${embedUrl}" 
            frameborder="0" 
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
            webkitallowfullscreen
            mozallowfullscreen
        ></iframe>
    `;
    
    playerContainer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Фолбэк: если iframe не работает, предлагаем открыть в новой вкладке
    setTimeout(() => {
        const iframe = videoPlayerContainer.querySelector('iframe');
        if (!iframe || !iframe.contentWindow) {
            tg.showAlert('Не удалось загрузить видео. Открываю в браузере...');
            window.open(pageUrl, '_blank');
            closePlayer();
        }
    }, 3000);
}

function closePlayer() {
    const playerContainer = document.getElementById('playerContainer');
    const videoPlayerContainer = document.getElementById('rutubePlayer');
    
    // Останавливаем видео очисткой iframe
    videoPlayerContainer.innerHTML = '';
    
    playerContainer.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterMovies(searchTerm, currentCategory);
    });
    
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            currentCategory = category;
            filterMovies(searchInput.value.toLowerCase().trim(), category);
        });
    });
}

function filterMovies(searchTerm, category) {
    let results = [...movies];
    
    if (category !== 'all') {
        results = results.filter(movie => movie.category === category);
    }
    
    if (searchTerm) {
        results = results.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.description.toLowerCase().includes(searchTerm)
        );
    }
    
    filteredMovies = results;
    renderMovies(filteredMovies);
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('moviesList').innerHTML = '';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Закрытие плеера по нажатию ESC или клику вне плеера
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePlayer();
    }
});

// Закрытие по клику на затемненную область
document.getElementById('playerContainer').addEventListener('click', function(e) {
    if (e.target === this) {
        closePlayer();
    }
});

document.addEventListener('DOMContentLoaded', initApp);
