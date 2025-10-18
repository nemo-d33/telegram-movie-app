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
        initVolumeSlider();
        console.log('App initialized successfully');
    }, 100);
}

function initVolumeSlider() {
    const slider = document.getElementById('volumeSlider');
    const progress = document.getElementById('volumeProgress');
    const thumb = document.getElementById('volumeThumb');

    let isDragging = false;
    let sliderRect = slider.getBoundingClientRect();

    const updateThumbAndProgress = (percent) => {
        percent = Math.max(0, Math.min(100, percent));
        const px = (percent / 100) * sliderRect.width;
        progress.style.width = `${percent}%`;
        thumb.style.left = `${px}px`;
        
        // Update volume in video iframe
        updateVideoVolume(percent / 100);
    }

    const getPercentFromClientX = (clientX) => {
        const offsetX = clientX - sliderRect.left;
        return (offsetX / sliderRect.width) * 100;
    }

    const onMove = (clientX) => {
        const percent = getPercentFromClientX(clientX);
        updateThumbAndProgress(percent);
    }

    const onMouseDown = (e) => {
        isDragging = true;
        sliderRect = slider.getBoundingClientRect();
        onMove(e.clientX);
        thumb.classList.add('active');
        e.preventDefault();
    }

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

    const stopDrag = () => {
        isDragging = false;
        thumb.classList.remove('active');
    }

    // Events
    thumb.addEventListener('mousedown', onMouseDown);
    thumb.addEventListener('touchstart', onTouchStart, { passive: false });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', stopDrag);

    slider.addEventListener('mousedown', (e) => {
        sliderRect = slider.getBoundingClientRect();
        onMove(e.clientX);
    });

    slider.addEventListener('touchstart', (e) => {
        sliderRect = slider.getBoundingClientRect();
        onMove(e.touches[0].clientX);
        e.preventDefault();
    }, { passive: false });

    // Initialize with 70% volume
    updateThumbAndProgress(70);
}

function updateVideoVolume(volume) {
    const iframe = document.querySelector('.rutube-iframe');
    if (iframe && iframe.contentWindow) {
        // Note: RuTube iframe may not support external volume control
        // This is primarily a UI demonstration
        console.log('Setting volume to:', volume);
    }
}

// Остальные функции остаются без изменений...
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
        // ... остальные фильмы
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
    
    playerContainer.style.display = 'flex';
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
