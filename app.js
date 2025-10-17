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
        setupSmoothAnimations();
    }, 1000);
}

function setupSmoothAnimations() {
    // Add smooth entrance animations for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe movie cards for animation
    setTimeout(() => {
        document.querySelectorAll('.movie-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }, 100);
}

function loadMovies() {
    movies = [
        {
            id: 1,
            title: "Форсаж 9",
            year: "2021",
            poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=500&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/bb0c848e121e79263789b3b19460bff0/",
            rutubePageUrl: "https://rutube.ru/video/bb0c848e121e79263789b3b19460bff0/",
            category: "films",
            description: "Доминик Торетто ведет спокойную жизнь с Летти и своим сыном, но покой оказывается недолгим."
        },
        {
            id: 2,
            title: "Мстители: Финал",
            year: "2019",
            poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=500&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/1234567891",
            rutubePageUrl: "https://rutube.ru/video/1234567891/",
            category: "films",
            description: "Оставшиеся в живых члены команды Мстителей пытаются исправить последствия действий Таноса."
        },
        {
            id: 3,
            title: "Игра в кальмара",
            year: "2021",
            poster: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&h=500&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/1234567892",
            rutubePageUrl: "https://rutube.ru/video/1234567892/",
            category: "series",
            description: "Сотни игроков-банкротов принимают приглашение сыграть в детские игры на выживание."
        },
        {
            id: 4,
            title: "Холодное сердце",
            year: "2013",
            poster: "https://images.unsplash.com/photo-1618336756473-37d8fcf7d7be?w=400&h=500&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/1234567893",
            rutubePageUrl: "https://rutube.ru/video/1234567893/",
            category: "cartoons",
            description: "Бесстрашная Анна отправляется в горы, чтобы найти свою сестру Эльзу."
        },
        {
            id: 5,
            title: "Джон Уик 4",
            year: "2023",
            poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=500&fit=crop",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/1234567894",
            rutubePageUrl: "https://rutube.ru/video/1234567894/",
            category: "films",
            description: "Джон Уик продолжает бороться с мафией и наемниками по всему миру."
        },
        {
            id: 6,
            title: "Ведьмак",
            year: "2019",
            poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=500&fit=crop",
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
            <div class="glass-empty-state">
                <div style="font-size: 3em; margin-bottom: 20px;">🎬</div>
                <div style="font-size: 1.2em; color: rgba(255, 255, 255, 0.8);">
                    Фильмы не найдены
                </div>
                <div style="color: rgba(255, 255, 255, 0.6); margin-top: 10px;">
                    Попробуйте изменить поисковый запрос или выбрать другую категорию
                </div>
            </div>
        `;
        return;
    }
    
    moviesList.innerHTML = moviesArray.map(movie => `
        <div class="movie-card" onclick="openMovie(${movie.id})">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster"
                 onerror="this.src='https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=500&fit=crop'">
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
    
    // Create smooth modal appearance
    tg.showPopup({
        title: `🎬 ${movie.title}`,
        message: `${movie.year}\n\n${movie.description}`,
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
    
    // Enhanced iframe with better fullscreen support
    videoPlayerContainer.innerHTML = `
        <iframe 
            class="rutube-iframe"
            src="${embedUrl}" 
            frameborder="0" 
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowfullscreen
            webkitallowfullscreen
            mozallowfullscreen
            msallowfullscreen
        ></iframe>
    `;
    
    // Smooth player entrance
    playerContainer.style.display = 'flex';
    playerContainer.style.opacity = '0';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        playerContainer.style.opacity = '1';
        playerContainer.style.transition = 'opacity 0.3s ease';
    }, 10);
    
    // Enhanced fallback with better user experience
    setTimeout(() => {
        const iframe = videoPlayerContainer.querySelector('iframe');
        if (!iframe || !iframe.contentWindow) {
            tg.showAlert('Оптимизируем просмотр... Открываю в браузере для лучшего качества');
            setTimeout(() => {
                window.open(pageUrl, '_blank');
                closePlayer();
            }, 1500);
        }
    }, 5000);
}

function closePlayer() {
    const playerContainer = document.getElementById('playerContainer');
    const videoPlayerContainer = document.getElementById('rutubePlayer');
    
    // Smooth exit animation
    playerContainer.style.opacity = '0';
    
    setTimeout(() => {
        // Stop and cleanup
        videoPlayerContainer.innerHTML = '';
        playerContainer.style.display = 'none';
        playerContainer.classList.remove('fullscreen');
        document.body.style.overflow = 'auto';
    }, 300);
}

function toggleFullscreen() {
    const playerContainer = document.getElementById('playerContainer');
    playerContainer.classList.toggle('fullscreen');
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    
    // Enhanced search with debouncing
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterMovies(searchTerm, currentCategory);
        }, 300);
    });
    
    // Enhanced category buttons with ripple effect
    const categoryBtns = document.querySelectorAll('.glass-category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.dataset.category;
            currentCategory = category;
            filterMovies(searchInput.value.toLowerCase().trim(), category);
        });
    });
    
    // Enhanced keyboard controls
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePlayer();
        }
        if (e.key === 'F11' || (e.altKey && e.key === 'Enter')) {
            e.preventDefault();
            toggleFullscreen();
        }
    });
    
    // Close player when clicking on backdrop
    document.getElementById('playerContainer').addEventListener('click', function(e) {
        if (e.target === this) {
            closePlayer();
        }
    });
}

function filterMovies(searchTerm, category) {
    let results = [...movies];
    
    // Filter by category
    if (category !== 'all') {
        results = results.filter(movie => movie.category === category);
    }
    
    // Filter by search term
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
