const tg = window.Telegram.WebApp;

let movies = [];
let filteredMovies = [];
let currentCategory = 'all';
let vkWidget = null;

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
        
        // Инициализируем VK Widgets API
        if (window.VK) {
            VK.init({
                apiId: 0, // Для виджетов не требуется apiId
                onlyWidgets: true
            });
        }
    }, 1000);
}

function loadMovies() {
    movies = [
        {
            id: 1,
            title: "Форсаж 9",
            year: "2021",
            poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=450&fit=crop",
            // Формат VK видео: -groupID_videoID или video-owner_id_video_id
            vkVideoId: "-180001061_456242960", // Пример ID видео из VK
            videoUrl: "https://vkvideo.ru/video-180001061_456242960", // Полная ссылка для резерва
            category: "films",
            description: "Доминик Торетто ведет спокойную жизнь с Летти и своим сыном."
        },
        {
            id: 2,
            title: "Мстители: Финал",
            year: "2019",
            poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop",
            vkVideoId: "-180001061_456242961", // Замени на реальный ID
            videoUrl: "https://vk.com/video-180001061_456242961",
            category: "films",
            description: "Оставшиеся в живых члены команды Мстителей пытаются исправить последствия действий Таноса."
        },
        {
            id: 3,
            title: "Игра в кальмара",
            year: "2021",
            poster: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=300&h=450&fit=crop",
            vkVideoId: "-180001061_456242962", // Замени на реальный ID
            videoUrl: "https://vk.com/video-180001061_456242962",
            category: "series",
            description: "Сотни игроков-банкротов принимают приглашение сыграть в детские игры на выживание."
        },
        {
            id: 4,
            title: "Холодное сердце",
            year: "2013",
            poster: "https://images.unsplash.com/photo-1618336756473-37d8fcf7d7be?w=300&h=450&fit=crop",
            vkVideoId: "-180001061_456242963", // Замени на реальный ID
            videoUrl: "https://vk.com/video-180001061_456242963",
            category: "cartoons",
            description: "Бесстрашная Анна отправляется в горы, чтобы найти свою сестру Эльзу."
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
            playVKVideo(movie.vkVideoId, movie.videoUrl, movie.title);
        }
    });
}

function playVKVideo(vkVideoId, videoUrl, title) {
    const playerContainer = document.getElementById('playerContainer');
    const videoPlayerContainer = document.getElementById('vkVideoPlayer');
    
    // Очищаем предыдущий плеер
    videoPlayerContainer.innerHTML = '';
    
    // Создаем VK Video Widget
    if (window.VK && VK.Widgets) {
        vkWidget = VK.Widgets.Player(
            "vkVideoPlayer", 
            vkVideoId, 
            {
                width: '100%',
                height: '100%',
                auto_play: 1
            },
            function(player) {
                console.log('VK Player loaded');
            }
        );
    } else {
        // Fallback: открываем в новой вкладке если VK Widgets не загрузились
        window.open(videoUrl, '_blank');
        return;
    }
    
    playerContainer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePlayer() {
    const playerContainer = document.getElementById('playerContainer');
    const videoPlayerContainer = document.getElementById('vkVideoPlayer');
    
    // Останавливаем VK плеер если он существует
    if (vkWidget) {
        try {
            // VK Widgets API не имеет прямого метода destroy, поэтому просто очищаем контейнер
            videoPlayerContainer.innerHTML = '';
        } catch (e) {
            console.log('Error closing VK player:', e);
        }
        vkWidget = null;
    }
    
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

// Закрытие плеера по нажатию ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePlayer();
    }
});

document.addEventListener('DOMContentLoaded', initApp);
