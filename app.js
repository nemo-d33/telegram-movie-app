const tg = window.Telegram.WebApp;

let movies = [];
let filteredMovies = [];
let currentCategory = 'all';

function initApp() {
    console.log('Initializing app...');
    tg.ready();
    tg.expand();
    
    showLoading();
    
    setTimeout(() => {
        loadMovies();
        hideLoading();
        renderMovies(movies);
        setupEventListeners();
        console.log('App initialized successfully');
    }, 100);
}

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
        },
        {
            id: 3,
            title: "Игра в кальмара",
            year: "2021",
            poster: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=300&h=400&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/1234567892",
            rutubePageUrl: "https://rutube.ru/video/1234567892/",
            category: "series",
            description: "Сотни игроков-банкротов принимают приглашение сыграть в детские игры на выживание."
        },
        {
            id: 4,
            title: "Холодное сердце",
            year: "2013",
            poster: "https://images.unsplash.com/photo-1618336756473-37d8fcf7d7be?w=300&h=400&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/1234567893",
            rutubePageUrl: "https://rutube.ru/video/1234567893/",
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
            <div class="empty-state">
                <h3>🎬 Фильмы не найдены</h3>
                <p>Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
            </div>
        `;
        return;
    }
    
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
}

// Остальные функции остаются без изменений...
function openMovie(movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;
    
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

function playRuTubeVideo(embedUrl, pageUrl) {
    const playerContainer = document.getElementById('playerContainer');
    const videoPlayerContainer = document.getElementById('rutubePlayer');
    
    videoPlayerContainer.innerHTML = `
        <iframe 
            class="rutube-iframe"
            src="${embedUrl}" 
            frameborder="0" 
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
        ></iframe>
    `;
    
    playerContainer.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePlayer() {
    const playerContainer = document.getElementById('playerContainer');
    const videoPlayerContainer = document.getElementById('rutubePlayer');
    
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
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePlayer();
        }
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

document.addEventListener('DOMContentLoaded', initApp);
