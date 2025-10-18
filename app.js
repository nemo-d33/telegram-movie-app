* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #0f1a2b 0%, #1a2b45 50%, #0f1a2b 100%);
    color: white;
    min-height: 100vh;
    padding: 20px;
    line-height: 1.4;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

/* Liquid Glass Effect Base Class */
.glass-effect {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 15px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Header */
.header {
    text-align: center;
    margin-bottom: 30px;
    padding: 30px 20px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);
}

.header h1 {
    font-size: 2.2em;
    font-weight: 700;
    margin-bottom: 8px;
    color: white;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.header p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1em;
    font-weight: 400;
}

/* Search */
.search-box {
    margin: 20px 0;
    text-align: center;
}

.search-input {
    width: 90%;
    max-width: 400px;
    padding: 14px 20px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 15px;
    color: white;
    font-size: 16px;
    outline: none;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    transition: all 0.3s ease;
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.5);
}

/* Categories */
.categories {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.category-btn {
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 12px;
    color: white;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.category-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
}

.category-btn.active {
    background: rgba(74, 144, 226, 0.4);
    border: 1px solid rgba(74, 144, 226, 0.6);
    box-shadow: 0 8px 32px 0 rgba(74, 144, 226, 0.4);
}

/* Movie Cards */
.movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 40px;
}

.movie-card {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.movie-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
}

.movie-poster {
    width: 100%;
    height: 220px;
    object-fit: cover;
    background: linear-gradient(135deg, #1a2b45 0%, #2d4a7a 100%);
}

.movie-info {
    padding: 14px;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
}

.movie-title {
    font-size: 0.9em;
    font-weight: 600;
    margin-bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: white;
}

.movie-year {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.85em;
}

/* Loading */
.loading {
    text-align: center;
    padding: 40px;
    font-size: 1.1em;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 15px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Video Player */
.player-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0a1525 0%, #1a2b45 100%);
    z-index: 1000;
    display: none;
}

.rutube-player {
    width: 100%;
    height: 100%;
}

.rutube-iframe {
    width: 100%;
    height: 100%;
    border: none;
}

.back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1001;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 12px 18px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
}

/* Empty State */
.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 50px 20px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 15px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);
}

.empty-state h3 {
    font-size: 1.3em;
    margin-bottom: 10px;
    color: white;
}

.empty-state p {
    color: rgba(255, 255, 255, 0.8);
}

/* Mobile Optimization */
@media (max-width: 768px) {
    body {
        padding: 15px;
    }
    
    .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
    }
    
    .movie-poster {
        height: 190px;
    }
    
    .header {
        padding: 25px 15px;
        margin-bottom: 20px;
    }
    
    .header h1 {
        font-size: 1.8em;
    }
    
    .search-input {
        padding: 12px 18px;
        font-size: 15px;
    }
    
    .categories {
        gap: 8px;
    }
    
    .category-btn {
        padding: 10px 16px;
        font-size: 13px;
    }
}

@media (max-width: 480px) {
    .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 10px;
    }
    
    .movie-poster {
        height: 180px;
    }
    
    .category-btn {
        padding: 10px 14px;
        font-size: 12px;
    }
    
    .back-btn {
        top: 15px;
        left: 15px;
        padding: 10px 15px;
        font-size: 14px;
    }
}
