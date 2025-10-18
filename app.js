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
            title: "Аватар",
            year: "2009",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/4e273d5e-6d14-4f8e-843f-3d15d71cc5a8/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/avatar/",
            rutubePageUrl: "https://rutube.ru/video/avatar/",
            category: "films",
            description: "Бывший морпех Джейк Салли прикован к инвалидному креслу. Несмотря на немощное тело, Джейк в душе по-прежнему остается воином."
        },
        {
            id: 2,
            title: "Август",
            year: "2023",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/7b9c6e7c-6e9a-4f4a-9e0a-9e9e9e9e9e9e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/august/",
            rutubePageUrl: "https://rutube.ru/video/august/",
            category: "films",
            description: "Драма о жизни в провинциальном городе."
        },
        {
            id: 3,
            title: "Анжелика",
            year: "2014",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/9c9c9c9c-9c9c-9c9c-9c9c-9c9c9c9c9c9c/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/angelique/",
            rutubePageUrl: "https://rutube.ru/video/angelique/",
            category: "films",
            description: "История жизни знаменитой маркизы де Анжелика."
        },
        {
            id: 4,
            title: "Анна Каренина",
            year: "2012",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/8e8e8e8e-8e8e-8e8e-8e8e-8e8e8e8e8e8e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/anna-karenina/",
            rutubePageUrl: "https://rutube.ru/video/anna-karenina/",
            category: "films",
            description: "Экранизация знаменитого романа Льва Толстого о трагической любви."
        },
        {
            id: 5,
            title: "Анчартед",
            year: "2022",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/7d7d7d7d-7d7d-7d7d-7d7d-7d7d7d7d7d7d/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/uncharted/",
            rutubePageUrl: "https://rutube.ru/video/uncharted/",
            category: "films",
            description: "Приключенческий фильм по мотивам популярной видеоигры."
        },
        {
            id: 6,
            title: "Атака Титанов",
            year: "2013",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/6c6c6c6c-6c6c-6c6c-6c6c-6c6c6c6c6c6c/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/attack-on-titan/",
            rutubePageUrl: "https://rutube.ru/video/attack-on-titan/",
            category: "series",
            description: "Человечество ведет борьбу за выживание против гигантских титанов."
        },
        {
            id: 7,
            title: "Балерина",
            year: "2016",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/5b5b5b5b-5b5b-5b5b-5b5b-5b5b5b5b5b5b/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/ballerina/",
            rutubePageUrl: "https://rutube.ru/video/ballerina/",
            category: "films",
            description: "Молодая девушка мечтает стать великой балериной."
        },
        {
            id: 8,
            title: "Барби",
            year: "2023",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/4a4a4a4a-4a4a-4a4a-4a4a-4a4a4a4a4a4a/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/barbie/",
            rutubePageUrl: "https://rutube.ru/video/barbie/",
            category: "films",
            description: "Кукла Барби отправляется в реальный мир, чтобы найти истинное счастье."
        },
        {
            id: 9,
            title: "Бен 10",
            year: "2005",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c3c/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/ben10/",
            rutubePageUrl: "https://rutube.ru/video/ben10/",
            category: "cartoons",
            description: "Мальчик Бен находит инопланетное устройство, позволяющее превращаться в различных пришельцев."
        },
        {
            id: 10,
            title: "Бесы",
            year: "2014",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/2d2d2d2d-2d2d-2d2d-2d2d-2d2d2d2d2d2d/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/besy/",
            rutubePageUrl: "https://rutube.ru/video/besy/",
            category: "series",
            description: "Экранизация романа Достоевского о революционерах-заговорщиках."
        },
        {
            id: 11,
            title: "Борат",
            year: "2006",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/1e1e1e1e-1e1e-1e1e-1e1e-1e1e1e1e1e1e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/borat/",
            rutubePageUrl: "https://rutube.ru/video/borat/",
            category: "films",
            description: "Казахский журналист Борат путешествует по Америке, снимая документальный фильм."
        },
        {
            id: 12,
            title: "Братья из Гримсби",
            year: "2016",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/0f0f0f0f-0f0f-0f0f-0f0f-0f0f0f0f0f0f/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/grimsby/",
            rutubePageUrl: "https://rutube.ru/video/grimsby/",
            category: "films",
            description: "Братья-шпионы попадают в невероятные приключения."
        },
        {
            id: 13,
            title: "Брюс всемогущий",
            year: "2003",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/bruce-almighty/",
            rutubePageUrl: "https://rutube.ru/video/bruce-almighty/",
            category: "films",
            description: "Бог решает передать свои способности обычному репортёру."
        },
        {
            id: 14,
            title: "Бумажный дом",
            year: "2017",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/paper-house/",
            rutubePageUrl: "https://rutube.ru/video/paper-house/",
            category: "series",
            description: "Группа грабителей под руководством таинственного Профессора готовит ограбление века."
        },
        {
            id: 15,
            title: "Ведьмак",
            year: "2019",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/9c102dfb-6bd5-469b-94e1-cb8b109c0aeb/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/witcher/",
            rutubePageUrl: "https://rutube.ru/video/witcher/",
            category: "series",
            description: "Геральт из Ривии, мутант-охотник на чудовищ, пытается найти свое место в мире."
        },
        {
            id: 16,
            title: "Век Адалин",
            year: "2015",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/age-of-adaline/",
            rutubePageUrl: "https://rutube.ru/video/age-of-adaline/",
            category: "films",
            description: "Женщина перестает стареть после несчастного случая и вынуждена скрывать свою тайну."
        },
        {
            id: 17,
            title: "Веном",
            year: "2018",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/venom/",
            rutubePageUrl: "https://rutube.ru/video/venom/",
            category: "films",
            description: "Журналист Эдди Брок становится носителем инопланетного симбиота Венома."
        },
        {
            id: 18,
            title: "Винни Пух: Кровь и мёд",
            year: "2023",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/winnie-the-pooh-blood-honey/",
            rutubePageUrl: "https://rutube.ru/video/winnie-the-pooh-blood-honey/",
            category: "films",
            description: "Хоррор-версия классической истории о Винни Пухе."
        },
        {
            id: 19,
            title: "Властелин колец",
            year: "2001",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/lord-of-the-rings/",
            rutubePageUrl: "https://rutube.ru/video/lord-of-the-rings/",
            category: "films",
            description: "Эпическая фэнтези-сага о борьбе за Кольцо Всевластия."
        },
        {
            id: 20,
            title: "Во все тяжкие",
            year: "2008",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/90909090-9090-9090-9090-909090909090/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/breaking-bad/",
            rutubePageUrl: "https://rutube.ru/video/breaking-bad/",
            category: "series",
            description: "Школьный учитель химии начинает производить метамфетамин, чтобы обеспечить семью."
        },
        {
            id: 21,
            title: "Волк с Уолл Стрит",
            year: "2013",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/80808080-8080-8080-8080-808080808080/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/wolf-of-wall-street/",
            rutubePageUrl: "https://rutube.ru/video/wolf-of-wall-street/",
            category: "films",
            description: "История брокера Джордана Белфорта и его пути к успеху на Уолл-стрит."
        },
        {
            id: 22,
            title: "Время (остров)",
            year: "2005",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/70707070-7070-7070-7070-707070707070/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/time-island/",
            rutubePageUrl: "https://rutube.ru/video/time-island/",
            category: "films",
            description: "Фантастический триллер о загадочном острове, где время течет по-другому."
        },
        {
            id: 23,
            title: "Время (на руке)",
            year: "2011",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/60606060-6060-6060-6060-606060606060/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/in-time/",
            rutubePageUrl: "https://rutube.ru/video/in-time/",
            category: "films",
            description: "В будущем время стало валютой, и люди вынуждены бороться за каждую минуту жизни."
        },
        {
            id: 24,
            title: "Выживший",
            year: "2015",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/50505050-5050-5050-5050-505050505050/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/the-revenant/",
            rutubePageUrl: "https://rutube.ru/video/the-revenant/",
            category: "films",
            description: "История выживания охотника в дикой природе после нападения медведя."
        },
        {
            id: 25,
            title: "Гадкий я",
            year: "2010",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/40404040-4040-4040-4040-404040404040/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/despicable-me/",
            rutubePageUrl: "https://rutube.ru/video/despicable-me/",
            category: "cartoons",
            description: "Суперзлодей Грю решает совершить величайшее ограбление в истории."
        },
        {
            id: 26,
            title: "Гангстерлэнд",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/30303030-3030-3030-3030-303030303030/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/gangsterland/",
            rutubePageUrl: "https://rutube.ru/video/gangsterland/",
            category: "films",
            description: "Криминальная драма о жизни в мире организованной преступности."
        },
        {
            id: 27,
            title: "Гарри Поттер",
            year: "2001",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/20202020-2020-2020-2020-202020202020/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/harry-potter/",
            rutubePageUrl: "https://rutube.ru/video/harry-potter/",
            category: "films",
            description: "Мальчик-сирота узнает, что он волшебник и отправляется в школу магии Хогвартс."
        },
        {
            id: 28,
            title: "Гренландия",
            year: "2020",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/10101010-1010-1010-1010-101010101010/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/greenland/",
            rutubePageUrl: "https://rutube.ru/video/greenland/",
            category: "films",
            description: "Семья пытается выжить во время глобальной катастрофы - падения кометы на Землю."
        },
        {
            id: 29,
            title: "Глубоководный горизонт",
            year: "2016",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/00000000-0000-0000-0000-000000000000/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/deepwater-horizon/",
            rutubePageUrl: "https://rutube.ru/video/deepwater-horizon/",
            category: "films",
            description: "Основано на реальных событиях катастрофы на нефтяной платформе в Мексиканском заливе."
        },
        {
            id: 30,
            title: "Гонка",
            year: "2013",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/11111111-1111-1111-1111-111111111111/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/rush/",
            rutubePageUrl: "https://rutube.ru/video/rush/",
            category: "films",
            description: "Драма о соперничестве гонщиков Формулы-1 Джеймса Ханта и Ники Лауды."
        },
        {
            id: 31,
            title: "Джентльмены",
            year: "2019",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/3c6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/the-gentlemen/",
            rutubePageUrl: "https://rutube.ru/video/the-gentlemen/",
            category: "films",
            description: "Американский наркобарон пытается продать свой бизнес в Лондоне."
        },
        {
            id: 32,
            title: "Джон Уик",
            year: "2014",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4d6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/john-wick/",
            rutubePageUrl: "https://rutube.ru/video/john-wick/",
            category: "films",
            description: "Бывший наемник мстит за убийство своей собаки."
        },
        {
            id: 33,
            title: "Диктатор",
            year: "2012",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/5e6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/the-dictator/",
            rutubePageUrl: "https://rutube.ru/video/the-dictator/",
            category: "films",
            description: "Диктатор одной страны попадает в Нью-Йорк."
        },
        {
            id: 34,
            title: "Догони меня, если сможешь",
            year: "2002",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/6f6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/catch-me-if-you-can/",
            rutubePageUrl: "https://rutube.ru/video/catch-me-if-you-can/",
            category: "films",
            description: "Молодой мошенник Фрэнк Эбегнейл обманывает банки и авиакомпании."
        },
        {
            id: 35,
            title: "Дом странных детей",
            year: "2016",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/7a6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/miss-peregrine/",
            rutubePageUrl: "https://rutube.ru/video/miss-peregrine/",
            category: "films",
            description: "Подросток обнаруживает приют для детей с необычными способностями."
        },
        {
            id: 36,
            title: "Друзья Оушена",
            year: "2001",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/8b6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/oceans-eleven/",
            rutubePageUrl: "https://rutube.ru/video/oceans-eleven/",
            category: "films",
            description: "Дэнни Оушен собирает команду для ограбления казино."
        },
        {
            id: 37,
            title: "Дюна",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9c6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/dune/",
            rutubePageUrl: "https://rutube.ru/video/dune/",
            category: "films",
            description: "Пол Атрейдес отправляется на опасную планету Арракис."
        },
        {
            id: 38,
            title: "Ёлки",
            year: "2010",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/1d6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/yolki/",
            rutubePageUrl: "https://rutube.ru/video/yolki/",
            category: "films",
            description: "Новогодние истории из разных городов России."
        },
        {
            id: 39,
            title: "Жизнь по вызову",
            year: "2023",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/7b9c6e7c-6e9a-4f4a-9e0a-9e9e9e9e9e9e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/on-call/",
            rutubePageUrl: "https://rutube.ru/video/on-call/",
            category: "series",
            description: "Медицинская драма о работе врачей скорой помощи."
        },
        {
            id: 40,
            title: "Звёздные войны",
            year: "1977",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/2e6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/star-wars/",
            rutubePageUrl: "https://rutube.ru/video/star-wars/",
            category: "films",
            description: "Эпическая сага о борьбе между Силой и Тёмной стороной."
        },
        {
            id: 41,
            title: "Зверополис",
            year: "2016",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/3f6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/zootopia/",
            rutubePageUrl: "https://rutube.ru/video/zootopia/",
            category: "cartoons",
            description: "Крольчиха Джуди Хопс становится первым кроликом-полицейским в Зверополисе."
        },
        {
            id: 42,
            title: "Зелёная книга",
            year: "2018",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4a6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/green-book/",
            rutubePageUrl: "https://rutube.ru/video/green-book/",
            category: "films",
            description: "Чернокожий музыкант и его водитель-итальянец путешествуют по США в 1960-х."
        },
        {
            id: 43,
            title: "Зелёная миля",
            year: "1999",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/5b6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/green-mile/",
            rutubePageUrl: "https://rutube.ru/video/green-mile/",
            category: "films",
            description: "Надзиратель тюрьмы знакомится с заключенным, обладающим даром исцеления."
        },
        {
            id: 44,
            title: "Игра в кальмара",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/6c6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/squid-game/",
            rutubePageUrl: "https://rutube.ru/video/squid-game/",
            category: "series",
            description: "Участники играют в смертельные детские игры за большой денежный приз."
        },
        {
            id: 45,
            title: "Иллюзия обмана",
            year: "2013",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/7d6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/now-you-see-me/",
            rutubePageUrl: "https://rutube.ru/video/now-you-see-me/",
            category: "films",
            description: "Группа иллюзионистов грабит банки во время своих шоу."
        },
        {
            id: 46,
            title: "Интерстеллар",
            year: "2014",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/8e6e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/interstellar/",
            rutubePageUrl: "https://rutube.ru/video/interstellar/",
            category: "films",
            description: "Группа исследователей путешествует через червоточину в поисках нового дома для человечества."
        },
        {
            id: 47,
            title: "Как приручить дракона",
            year: "2010",
            poster: "https://images.kinorium.com/movie/poster/399382/h280_52658332.jpg",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/how-to-train-your-dragon/",
            rutubePageUrl: "https://rutube.ru/video/how-to-train-your-dragon/",
            category: "cartoons",
            description: "Викинг Иккинг дружит с драконом Беззубиком."
        },
        {
            id: 48,
            title: "Каратэ-пацан",
            year: "1984",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/1a7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/karate-kid/",
            rutubePageUrl: "https://rutube.ru/video/karate-kid/",
            category: "films",
            description: "Подросток Дэниел учится карате у мастера Мияги."
        },
        {
            id: 49,
            title: "Кингсмэн",
            year: "2014",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/2b7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/kingsman/",
            rutubePageUrl: "https://rutube.ru/video/kingsman/",
            category: "films",
            description: "Молодой парень становится агентом секретной шпионской организации."
        },
        {
            id: 50,
            title: "Король Лев",
            year: "1994",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/3c7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/lion-king/",
            rutubePageUrl: "https://rutube.ru/video/lion-king/",
            category: "cartoons",
            description: "Львенок Симба становится королем саванны."
        },
        {
            id: 51,
            title: "Король Талсы",
            year: "2019",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4d7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/king-of-tulsa/",
            rutubePageUrl: "https://rutube.ru/video/king-of-tulsa/",
            category: "series",
            description: "Криминальная драма о жизни в Талсе."
        },
        {
            id: 52,
            title: "Корпорация монстров",
            year: "2001",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/5e7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/monsters-inc/",
            rutubePageUrl: "https://rutube.ru/video/monsters-inc/",
            category: "cartoons",
            description: "Монстры пугают детей, чтобы получить энергию."
        },
        {
            id: 53,
            title: "Красавица и чудовище",
            year: "1991",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/6f7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/beauty-and-the-beast/",
            rutubePageUrl: "https://rutube.ru/video/beauty-and-the-beast/",
            category: "cartoons",
            description: "Бель попадает в замок к Чудовищу и учится видеть его душу."
        },
        {
            id: 54,
            title: "Красное уведомление",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/7a7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/red-notice/",
            rutubePageUrl: "https://rutube.ru/video/red-notice/",
            category: "films",
            description: "Интерпол объявляет в розыск самых разыскиваемых преступников мира."
        },
        {
            id: 55,
            title: "Круэлла",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/8b7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/cruella/",
            rutubePageUrl: "https://rutube.ru/video/cruella/",
            category: "films",
            description: "Предыстория злодейки Круэллы де Виль из 101 далматинца."
        },
        {
            id: 56,
            title: "Кунг-фу панда",
            year: "2008",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9c7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/kung-fu-panda/",
            rutubePageUrl: "https://rutube.ru/video/kung-fu-panda/",
            category: "cartoons",
            description: "Пухлый панда По становится воином Кунг-Фу."
        },
        {
            id: 57,
            title: "Легенда",
            year: "2015",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/1d7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/legend/",
            rutubePageUrl: "https://rutube.ru/video/legend/",
            category: "films",
            description: "История близнецов Крэй, криминальных авторитетов Лондона."
        },
        {
            id: 58,
            title: "Лего Бэтмэн",
            year: "2017",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/2e7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/lego-batman/",
            rutubePageUrl: "https://rutube.ru/video/lego-batman/",
            category: "cartoons",
            description: "Бэтмен в мире Лего борется с преступностью."
        },
        {
            id: 59,
            title: "Лего фильм",
            year: "2014",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/3f7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/lego-movie/",
            rutubePageUrl: "https://rutube.ru/video/lego-movie/",
            category: "cartoons",
            description: "Обычный строитель Лего оказывается избранным, который должен спасти мир."
        },
        {
            id: 60,
            title: "Лего Чима",
            year: "2013",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4a7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/lego-chima/",
            rutubePageUrl: "https://rutube.ru/video/lego-chima/",
            category: "cartoons",
            description: "Приключения в фантастическом мире Чима."
        },
        {
            id: 61,
            title: "Леди Баг и Супер Кот",
            year: "2015",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/5b7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/miraculous/",
            rutubePageUrl: "https://rutube.ru/video/miraculous/",
            category: "cartoons",
            description: "Парижские подростки превращаются в супергероев Леди Баг и Супер Кота."
        },
        {
            id: 62,
            title: "Лило и Стич",
            year: "2002",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/6c7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/lilo-stitch/",
            rutubePageUrl: "https://rutube.ru/video/lilo-stitch/",
            category: "cartoons",
            description: "Девочка Лило adopts инопланетное существо Стича."
        },
        {
            id: 63,
            title: "Лихие",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/7d7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/the-hard/",
            rutubePageUrl: "https://rutube.ru/video/the-hard/",
            category: "series",
            description: "Криминальная драма о банде мотоциклистов."
        },
        {
            id: 64,
            title: "Лучше звоните Солу",
            year: "2015",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/8e7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/better-call-saul/",
            rutubePageUrl: "https://rutube.ru/video/better-call-saul/",
            category: "series",
            description: "Приквел 'Во все тяжкие' о адвокате Джимми Макгилле."
        },
        {
            id: 65,
            title: "Люди Икс",
            year: "2000",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9f7e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/x-men/",
            rutubePageUrl: "https://rutube.ru/video/x-men/",
            category: "films",
            description: "Мутанты с особыми способностями борются за выживание."
        },
        {
            id: 66,
            title: "Левша",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/1a8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/levsha/",
            rutubePageUrl: "https://rutube.ru/video/levsha/",
            category: "films",
            description: "История талантливого левши из русского фольклора."
        },
        {
            id: 67,
            title: "Мальчишник в Вегасе",
            year: "2009",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/2b8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/hangover/",
            rutubePageUrl: "https://rutube.ru/video/hangover/",
            category: "films",
            description: "Трое друзей просыпаются после мальчишника в Вегасе и не помнят, что произошло."
        },
        {
            id: 68,
            title: "Маска",
            year: "1994",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/3c8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/the-mask/",
            rutubePageUrl: "https://rutube.ru/video/the-mask/",
            category: "films",
            description: "Робкий банковский служащий находит магическую маску, превращающую его в супергероя."
        },
        {
            id: 69,
            title: "Мачо и ботан",
            year: "2012",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4d8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/21-jump-street/",
            rutubePageUrl: "https://rutube.ru/video/21-jump-street/",
            category: "films",
            description: "Двое полицейских внедряются в школу под прикрытием."
        },
        {
            id: 70,
            title: "Метод",
            year: "2015",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/5e8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/metod/",
            rutubePageUrl: "https://rutube.ru/video/metod/",
            category: "series",
            description: "Следователь Родион Меглин расследует сложные преступления."
        },
        {
            id: 71,
            title: "Мир Юрского Периода",
            year: "2015",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/6f8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/jurassic-world/",
            rutubePageUrl: "https://rutube.ru/video/jurassic-world/",
            category: "films",
            description: "Парк с динозаврами открывается, но что-то идет не так."
        },
        {
            id: 72,
            title: "Монстр вёрс",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/7a8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/monster-verse/",
            rutubePageUrl: "https://rutube.ru/video/monster-verse/",
            category: "films",
            description: "Вселенная монстров: Годзилла, Кинг Конг и другие."
        },
        {
            id: 73,
            title: "Монстры на каникулах",
            year: "2012",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/8b8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/hotel-transylvania/",
            rutubePageUrl: "https://rutube.ru/video/hotel-transylvania/",
            category: "cartoons",
            description: "Дракула управляет отелем для монстров."
        },
        {
            id: 74,
            title: "Мортал комбат",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9c8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/mortal-kombat/",
            rutubePageUrl: "https://rutube.ru/video/mortal-kombat/",
            category: "films",
            description: "Экранизация знаменитой видеоигры о смертельных боях."
        },
        {
            id: 75,
            title: "Мы Миллеры",
            year: "2013",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/1d8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/we-are-the-millers/",
            rutubePageUrl: "https://rutube.ru/video/we-are-the-millers/",
            category: "films",
            description: "Дилер марихуаны нанимает семью для перевозки наркотиков."
        },
        {
            id: 76,
            title: "Новый человек-паук",
            year: "2012",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/2e8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/amazing-spider-man/",
            rutubePageUrl: "https://rutube.ru/video/amazing-spider-man/",
            category: "films",
            description: "Питер Паркер становится Человеком-пауком и сражается с Ящером."
        },
        {
            id: 77,
            title: "Ночь в музее",
            year: "2006",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/3f8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/night-at-the-museum/",
            rutubePageUrl: "https://rutube.ru/video/night-at-the-museum/",
            category: "films",
            description: "Ночной сторож в музее обнаруживает, что экспонаты оживают ночью."
        },
        {
            id: 78,
            title: "Однажды в Голивуде",
            year: "2019",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4a8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/once-upon-a-time-in-hollywood/",
            rutubePageUrl: "https://rutube.ru/video/once-upon-a-time-in-hollywood/",
            category: "films",
            description: "Актер и его дублер пытаются найти свое место в меняющемся Голливуде 1969 года."
        },
        {
            id: 79,
            title: "Одноклассники",
            year: "2010",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/5b8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/odnoklassniki/",
            rutubePageUrl: "https://rutube.ru/video/odnoklassniki/",
            category: "films",
            description: "Комедия о встрече одноклассников через годы после школы."
        },
        {
            id: 80,
            title: "Ольга",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/6c8e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/olga/",
            rutubePageUrl: "https://rutube.ru/video/olga/",
            category: "series",
            description: "Комедийный сериал о жизни современной женщины."
        },
                {
            id: 101,
            title: "Сквозь слёзы я притворяюсь кошкой",
            year: "2020",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/8e9e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/through-tears/",
            rutubePageUrl: "https://rutube.ru/video/through-tears/",
            category: "films",
            description: "Драма о сложных отношениях и самопознании."
        },
        {
            id: 102,
            title: "Слово пацана: Кровь на асфальте",
            year: "2023",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/7b9c6e7c-6e9a-4f4a-9e0a-9e9e9e9e9e9e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/slovo-patsana/",
            rutubePageUrl: "https://rutube.ru/video/slovo-patsana/",
            category: "series",
            description: "Криминальная драма о подростковых бандах 1980-х годов."
        },
        {
            id: 103,
            title: "Соник",
            year: "2020",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9f9e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/sonic/",
            rutubePageUrl: "https://rutube.ru/video/sonic/",
            category: "films",
            description: "Синий ёж Соник сбегает на Землю и встречает шерифа Тома."
        },
        {
            id: 104,
            title: "Сумерки",
            year: "2008",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/1a10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/twilight/",
            rutubePageUrl: "https://rutube.ru/video/twilight/",
            category: "films",
            description: "Подросток Белла влюбляется в вампира Эдварда Каллена."
        },
        {
            id: 105,
            title: "Суперсемейка",
            year: "2004",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/2b10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/incredibles/",
            rutubePageUrl: "https://rutube.ru/video/incredibles/",
            category: "cartoons",
            description: "Семья супергероев выходит из отставки, чтобы спасти мир."
        },
        {
            id: 106,
            title: "Такси",
            year: "1998",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/3c10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/taxi/",
            rutubePageUrl: "https://rutube.ru/video/taxi/",
            category: "films",
            description: "Таксист Даниэль помогает полицейскому ловить банду грабителей."
        },
        {
            id: 107,
            title: "Тачки",
            year: "2006",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4d10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/cars/",
            rutubePageUrl: "https://rutube.ru/video/cars/",
            category: "cartoons",
            description: "Гоночный автомобиль Молния Маккуин попадает в маленький городок."
        },
        {
            id: 108,
            title: "Телохранитель киллера",
            year: "2017",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/5e10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/hitmans-bodyguard/",
            rutubePageUrl: "https://rutube.ru/video/hitmans-bodyguard/",
            category: "films",
            description: "Элитный телохранитель вынужден защищать своего заклятого врага - киллера."
        },
        {
            id: 109,
            title: "Тёмный рыцарь",
            year: "2008",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/6f10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/dark-knight/",
            rutubePageUrl: "https://rutube.ru/video/dark-knight/",
            category: "films",
            description: "Бэтмен сражается с Джокером, который хочет погрузить Готэм в хаос."
        },
        {
            id: 110,
            title: "Тихое место",
            year: "2018",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/7a10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/quiet-place/",
            rutubePageUrl: "https://rutube.ru/video/quiet-place/",
            category: "films",
            description: "Семья выживает в мире, где монстры охотятся на звук."
        },
        {
            id: 111,
            title: "Тихоокеанский рубеж",
            year: "2013",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/8b10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/pacific-rim/",
            rutubePageUrl: "https://rutube.ru/video/pacific-rim/",
            category: "films",
            description: "Гигантские роботы сражаются с монстрами из океанской бездны."
        },
        {
            id: 112,
            title: "Трансформеры",
            year: "2007",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9c10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/transformers/",
            rutubePageUrl: "https://rutube.ru/video/transformers/",
            category: "films",
            description: "Автоботы и десептиконы продолжают свою войну на Земле."
        },
        {
            id: 113,
            title: "Третий лишний",
            year: "2012",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/1d10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/ted/",
            rutubePageUrl: "https://rutube.ru/video/ted/",
            category: "films",
            description: "Медведь Тед, оживший плюшевый друг, мешает отношениям своего хозяина."
        },
        {
            id: 114,
            title: "Тупой ещё тупее",
            year: "1994",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/2e10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/dumb-and-dumber/",
            rutubePageUrl: "https://rutube.ru/video/dumb-and-dumber/",
            category: "films",
            description: "Двое глупых друзей отправляются в путешествие, чтобы вернуть чемодан с деньгами."
        },
        {
            id: 115,
            title: "Ты водишь",
            year: "2017",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/3f10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/baby-driver/",
            rutubePageUrl: "https://rutube.ru/video/baby-driver/",
            category: "films",
            description: "Молодой водитель-беглец работает на преступников, но хочет начать новую жизнь."
        },
        {
            id: 116,
            title: "Тэсс из рода д'Эрбервиллей",
            year: "1979",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4a10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/tess/",
            rutubePageUrl: "https://rutube.ru/video/tess/",
            category: "films",
            description: "Экранизация романа Томаса Харди о трагической судьбе молодой женщины."
        },
        {
            id: 117,
            title: "Ужасающий",
            year: "2023",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/7b9c6e7c-6e9a-4f4a-9e0a-9e9e9e9e9e9e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/terrifier/",
            rutubePageUrl: "https://rutube.ru/video/terrifier/",
            category: "films",
            description: "Жестокий клоун Арт терроризирует людей в Хэллоуин."
        },
        {
            id: 118,
            title: "Универ: Новая общага",
            year: "2011",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/5b10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/univer-new-dorm/",
            rutubePageUrl: "https://rutube.ru/video/univer-new-dorm/",
            category: "series",
            description: "Продолжение комедийного сериала о жизни студентов в общаге."
        },
        {
            id: 119,
            title: "Ущелье",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/6c10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/the-ravine/",
            rutubePageUrl: "https://rutube.ru/video/the-ravine/",
            category: "films",
            description: "Триллер о группе людей, оказавшихся в загадочном ущелье."
        },
        {
            id: 120,
            title: "Фантастические твари",
            year: "2016",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/7d10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/fantastic-beasts/",
            rutubePageUrl: "https://rutube.ru/video/fantastic-beasts/",
            category: "films",
            description: "Приквел Гарри Поттера о маге-зоологе Ньюте Саламандере."
        },
                {
            id: 121,
            title: "Феи",
            year: "2008",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/8e10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/tinker-bell/",
            rutubePageUrl: "https://rutube.ru/video/tinker-bell/",
            category: "cartoons",
            description: "Приключения феи Динь-Динь и ее подруг в Нетландии."
        },
        {
            id: 122,
            title: "Фишер",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9f10e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/fisher/",
            rutubePageUrl: "https://rutube.ru/video/fisher/",
            category: "films",
            description: "Драма о жизни профессионального игрока в покер."
        },
        {
            id: 123,
            title: "Флэш",
            year: "2014",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/1a11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/flash/",
            rutubePageUrl: "https://rutube.ru/video/flash/",
            category: "series",
            description: "Барри Аллен получает сверхскорость и становится супергероем Флэшем."
        },
        {
            id: 124,
            title: "Формула-1",
            year: "2019",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/2b11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/formula-1/",
            rutubePageUrl: "https://rutube.ru/video/formula-1/",
            category: "series",
            description: "Документальный сериал о мире Формулы-1."
        },
        {
            id: 125,
            title: "Форсаж",
            year: "2001",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/3c11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/fast-furious/",
            rutubePageUrl: "https://rutube.ru/video/fast-furious/",
            category: "films",
            description: "Уличные гонщики и их опасные приключения."
        },
        {
            id: 126,
            title: "Форс-мажоры",
            year: "2011",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4d11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/suits/",
            rutubePageUrl: "https://rutube.ru/video/suits/",
            category: "series",
            description: "Талантливый парень без юридического образования работает в престижной law firm."
        },
        {
            id: 127,
            title: "Ход Королевы",
            year: "2020",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/5e11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/queens-gambit/",
            rutubePageUrl: "https://rutube.ru/video/queens-gambit/",
            category: "series",
            description: "Девушка-сирота становится гроссмейстером в мире шахмат 1960-х."
        },
        {
            id: 128,
            title: "Холодное сердце",
            year: "2013",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/6f11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/frozen/",
            rutubePageUrl: "https://rutube.ru/video/frozen/",
            category: "cartoons",
            description: "Принцесса Эльза не может контролировать свои ледяные силы и сбегает из королевства."
        },
        {
            id: 129,
            title: "Хулиганы",
            year: "2005",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/7a11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/green-street/",
            rutubePageUrl: "https://rutube.ru/video/green-street/",
            category: "films",
            description: "Американский студент попадает в мир футбольных хулиганов в Лондоне."
        },
        {
            id: 130,
            title: "Царство небесное",
            year: "2005",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/8b11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/kingdom-of-heaven/",
            rutubePageUrl: "https://rutube.ru/video/kingdom-of-heaven/",
            category: "films",
            description: "Молодой кузнец становится рыцарем во время Крестовых походов."
        },
        {
            id: 131,
            title: "Час пик",
            year: "1998",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9c11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/rush-hour/",
            rutubePageUrl: "https://rutube.ru/video/rush-hour/",
            category: "films",
            description: "Гонконгский инспектор и лос-анджелесский детектив расследуют похищение дочери консула."
        },
        {
            id: 132,
            title: "Человек, который изменил всё",
            year: "2011",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/1d11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/moneyball/",
            rutubePageUrl: "https://rutube.ru/video/moneyball/",
            category: "films",
            description: "Менеджер бейсбольной команды использует статистику для создания winning team."
        },
        {
            id: 133,
            title: "Человек-паук (мультсериал)",
            year: "2017",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/2e11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/spider-man-animated/",
            rutubePageUrl: "https://rutube.ru/video/spider-man-animated/",
            category: "cartoons",
            description: "Приключения Питера Паркера в мультисериале о Человеке-пауке."
        },
        {
            id: 134,
            title: "Человек-паук",
            year: "2002",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/3f11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/spider-man/",
            rutubePageUrl: "https://rutube.ru/video/spider-man/",
            category: "films",
            description: "Питер Паркер получает паучьи способности и становится супергероем."
        },
        {
            id: 135,
            title: "Чикатилло",
            year: "2021",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4a11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/chikatilo/",
            rutubePageUrl: "https://rutube.ru/video/chikatilo/",
            category: "series",
            description: "Драма о расследовании серийных убийств Андрея Чикатилло."
        },
        {
            id: 136,
            title: "Шерлок",
            year: "2013",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/5b11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/sherlock/",
            rutubePageUrl: "https://rutube.ru/video/sherlock/",
            category: "series",
            description: "Современная адаптация рассказов о Шерлоке Холмсе."
        },
        {
            id: 137,
            title: "Шерлок Холмс",
            year: "2009",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/6c11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/sherlock-holmes/",
            rutubePageUrl: "https://rutube.ru/video/sherlock-holmes/",
            category: "films",
            description: "Шерлок Холмс и доктор Ватсон расследуют серию загадочных преступлений."
        },
        {
            id: 138,
            title: "Шоу Трумана",
            year: "1998",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/7d11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/truman-show/",
            rutubePageUrl: "https://rutube.ru/video/truman-show/",
            category: "films",
            description: "Мужчина discovers что его жизнь - это reality show."
        },
        {
            id: 139,
            title: "Энгри Бёрдс",
            year: "2016",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/8e11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/angry-birds/",
            rutubePageUrl: "https://rutube.ru/video/angry-birds/",
            category: "cartoons",
            description: "Экранизация популярной мобильной игры о злых птичках."
        },
        {
            id: 140,
            title: "Я - легенда",
            year: "2007",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9f11e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/i-am-legend/",
            rutubePageUrl: "https://rutube.ru/video/i-am-legend/",
            category: "films",
            description: "Последний человек в Нью-Йорке выживает среди мутантов-вампиров."
        },
        {
            id: 141,
            title: "DC",
            year: "2013",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/1a12e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/dc/",
            rutubePageUrl: "https://rutube.ru/video/dc/",
            category: "films",
            description: "Вселенная DC Comics с супергероями Бэтменом, Суперменом и другими."
        },
        {
            id: 142,
            title: "Ford против Ferrari",
            year: "2019",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/2b12e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/ford-vs-ferrari/",
            rutubePageUrl: "https://rutube.ru/video/ford-vs-ferrari/",
            category: "films",
            description: "Инженер и гонщик пытаются создать автомобиль, чтобы победить Ferrari в Ле-Мане."
        },
        {
            id: 143,
            title: "Gran Turismo",
            year: "2023",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/7b9c6e7c-6e9a-4f4a-9e0a-9e9e9e9e9e9e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/gran-turismo/",
            rutubePageUrl: "https://rutube.ru/video/gran-turismo/",
            category: "films",
            description: "Геймер становится профессиональным гонщиком благодаря симулятору Gran Turismo."
        },
        {
            id: 144,
            title: "Marvel",
            year: "2008",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/3c12e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/marvel/",
            rutubePageUrl: "https://rutube.ru/video/marvel/",
            category: "films",
            description: "Кинематографическая вселенная Marvel с супергероями."
        },
        {
            id: 145,
            title: "Minecraft в кино",
            year: "2025",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/4d12e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/minecraft/",
            rutubePageUrl: "https://rutube.ru/video/minecraft/",
            category: "films",
            description: "Экранизация популярной видеоигры Minecraft."
        },
        {
            id: 146,
            title: "Ninjago",
            year: "2011",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/5e12e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/ninjago/",
            rutubePageUrl: "https://rutube.ru/video/ninjago/",
            category: "cartoons",
            description: "Приключения ниндзя в мире Лего Ниндзяго."
        },
        {
            id: 147,
            title: "Wednesday",
            year: "2022",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/7b9c6e7c-6e9a-4f4a-9e0a-9e9e9e9e9e9e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/wednesday/",
            rutubePageUrl: "https://rutube.ru/video/wednesday/",
            category: "series",
            description: "Уэнсдэй Аддамс расследует тайны в академии для необычных детей."
        },
        {
            id: 148,
            title: "Zомбилэнд",
            year: "2009",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/6f12e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/zombieland/",
            rutubePageUrl: "https://rutube.ru/video/zombieland/",
            category: "films",
            description: "Группа выживших путешествует по Америке после зомби-апокалипсиса."
        },
        {
            id: 149,
            title: "007",
            year: "1962",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/7a12e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/007/",
            rutubePageUrl: "https://rutube.ru/video/007/",
            category: "films",
            description: "Приключения британского шпиона Джеймса Бонда."
        },
        {
            id: 150,
            title: "1+1",
            year: "2011",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/8b12e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/intouchables/",
            rutubePageUrl: "https://rutube.ru/video/intouchables/",
            category: "films",
            description: "Богатый аристократ нанимает в помощники парня из бедного района."
        },
        {
            id: 151,
            title: "300 спартанцев",
            year: "2006",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/9c12e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/300/",
            rutubePageUrl: "https://rutube.ru/video/300/",
            category: "films",
            description: "300 спартанцев во главе с царем Леонидом сражаются с персидской армией."
        },
        {
            id: 152,
            title: "50 оттенков серого",
            year: "2015",
            poster: "https://avatars.mds.yandex.net/get-kinopoisk-image/1773646/1d12e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e5e/600x900",
            rutubeEmbedUrl: "https://rutube.ru/play/embed/50-shades/",
            rutubePageUrl: "https://rutube.ru/video/50-shades/",
            category: "films",
            description: "Студентка начинает сложные отношения с бизнесменом Кристианом Греем."
        }
        // ... продолжаю добавлять остальные фильмы в том же формате
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
