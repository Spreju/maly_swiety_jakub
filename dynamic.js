'use strict';

// ======================================
// Konfiguracja aplikacji
// ======================================

const API_KEY = '94003a8dddb9409153b5e4ad434a5164';
const API_SEASON = 2024;
const STORAGE_KEY = 'favorites';

const POSITION_TRANSLATIONS = {
    Attacker: 'Napastnik',
    Midfielder: 'Pomocnik',
    Defender: 'Obrońca',
    Goalkeeper: 'Bramkarz'
};

// ======================================
// Elementy DOM
// ======================================

const elements = {
    loader: document.getElementById('loader'),
    resultsInfo: document.getElementById('results-info'),

    views: document.querySelectorAll('.view'),
    navLinks: document.querySelectorAll('.nav-link'),
    logo: document.querySelector('.logo'),
    hamburger: document.getElementById('hamburger'),
    nav: document.getElementById('nav'),
    viewButtons: document.querySelectorAll('[data-view]'),

    playersList: document.getElementById('players-list'),
    searchInput: document.getElementById('search'),
    positionFilter: document.getElementById('filter-position'),
    sortSelect: document.getElementById('sort'),

    heroSearchInput: document.getElementById('hero-search'),
    heroSearchButton: document.getElementById('hero-search-btn'),
    heroLeagueSelect: document.getElementById('hero-league'),

    favoritesGrid: document.getElementById('favorites-grid'),
    favCount: document.getElementById('fav-count'),
    favEmpty: document.getElementById('fav-empty'),
    popularGrid: document.getElementById('popular-grid'),
    detailCard: document.getElementById('detail-card')
};

// ======================================
// Stan aplikacji
// ======================================

let apiPlayers = [];
let currentPlayers = players;
let favorites = loadFavorites();

// ======================================
// Funkcje pomocnicze
// ======================================

function loadFavorites() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveFavorites() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

function updateFavCount() {
    elements.favCount.textContent = favorites.length;
}

// Brak danych oznaczamy myślnikiem, ale realne 0 zostaje jako 0.
function showValue(value) {
    return value === null || value === undefined ? '-' : value;
}

function isMissingValue(value) {
    return value === '-' || value === null || value === undefined || value === '';
}

function toNumber(value) {
    return Number(value);
}

function compareNumbers(a, b, field, ascending = true) {
    const aValue = a[field];
    const bValue = b[field];
    const aMissing = isMissingValue(aValue);
    const bMissing = isMissingValue(bValue);

    if (aMissing && bMissing) return 0;
    if (aMissing) return 1;
    if (bMissing) return -1;

    return ascending
        ? toNumber(aValue) - toNumber(bValue)
        : toNumber(bValue) - toNumber(aValue);
}

function normalizeText(text) {
    return String(text)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ł/g, 'l')
        .replace(/Ł/g, 'l');
}

function translatePosition(position) {
    return POSITION_TRANSLATIONS[position] || position || '-';
}

function formatHeight(height) {
    if (!height || height === '-') return '-';
    return String(height).includes('cm') ? height : `${height} cm`;
}

function formatWeight(weight) {
    if (!weight || weight === '-') return '-';
    return String(weight).includes('kg') ? weight : `${weight} kg`;
}

function getAllPlayers() {
    return [...players, ...apiPlayers, ...favorites];
}

function setLoader(isVisible) {
    elements.loader.classList.toggle('hidden', !isVisible);
}

// ======================================
// Widoki i nawigacja
// ======================================

function changeView(viewName) {
    elements.views.forEach(view => view.classList.remove('active'));

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add('active');

    elements.navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.view === viewName);
    });

    elements.nav.classList.remove('open');
    elements.hamburger.classList.remove('open');
}

function handleViewChange(event) {
    const viewName = event.currentTarget.dataset.view;

    if (!viewName) return;

    event.preventDefault();
    changeView(viewName);
}

// ======================================
// Renderowanie zawodników
// ======================================

function renderPlayers(playersToShow) {
    elements.playersList.innerHTML = `
        <div class="player-row header">
            <div>Zawodnik</div>
            <div>Klub</div>
            <div>Pozycja</div>
            <div>Wiek</div>
            <div>Mecze</div>
            <div>Gole</div>
            <div>Akcja</div>
        </div>
    `;

    playersToShow.forEach(player => {
        const isFavorite = favorites.some(favorite => favorite.id === player.id);

        elements.playersList.innerHTML += `
            <div class="player-row">
                <div class="player-name" >
                    <span class="star ${isFavorite ? 'active' : ''}" data-id="${player.id}">
                        ${isFavorite ? '★' : '☆'}
                    </span>
                    ${player.name}
                </div>

                <div class="player-club" data-label="Klub">${player.club}</div>
                <div data-label="Pozycja">${translatePosition(player.position)}</div>
                <div data-label="Wiek">${player.age ?? '-'}</div>
                <div data-label="Mecze">${player.matches}</div>
                <div data-label="Gole">${player.goals}</div>

                <div>
                    <button class="details-link" data-id="${player.id}">Szczegóły</button>
                </div>
            </div>
        `;
    });

    elements.resultsInfo.textContent = playersToShow.length === 0
        ? 'Brak wyników'
        : `Znaleziono zawodników: ${playersToShow.length}`;
}

function renderPlayerDetails(playerId) {
    const player = getAllPlayers().find(item => item.id === playerId);

    if (!player) return;

    elements.detailCard.innerHTML = `
        <div class="detail-header">
            <div class="detail-photo">
                <img src="${player.image}" alt="${player.name}">
            </div>

            <div class="detail-info">
                <h2>${player.name}</h2>
                <p><strong>Pozycja:</strong> ${translatePosition(player.position)}</p>
                <p><strong>Wiek:</strong> ${player.age ?? '-'}</p>
                <p><strong>Klub:</strong> ${player.club}</p>
                <p><strong>Narodowość:</strong> ${player.nationality || '-'}</p>
                <p><strong>Wzrost:</strong> ${formatHeight(player.height)}</p>
                <p><strong>Waga:</strong> ${formatWeight(player.weight)}</p>
            </div>
        </div>

        <div class="detail-stats">
            <h3>Statystyki sezonu</h3>

            <div class="stats-grid">
                <div class="stat-box">
                    <span class="stat-number">${player.matches}</span>
                    <span class="stat-label">Mecze</span>
                </div>

                <div class="stat-box">
                    <span class="stat-number">${player.goals}</span>
                    <span class="stat-label">Gole</span>
                </div>

                <div class="stat-box">
                    <span class="stat-number">${player.assists}</span>
                    <span class="stat-label">Asysty</span>
                </div>

                <div class="stat-box">
                    <span class="stat-number">${player.grade}</span>
                    <span class="stat-label">Śr. ocena</span>
                </div>
            </div>
        </div>
    `;

    changeView('detail');
}

function renderFavorites() {
    elements.favoritesGrid.innerHTML = '';

    if (favorites.length === 0) {
        elements.favEmpty.style.visibility = 'visible';
        return;
    }

    elements.favEmpty.style.visibility = 'hidden';

    favorites.forEach(player => {
        elements.favoritesGrid.innerHTML += `
            <div class="detail-card">
                <h3>${player.name}</h3>
                <p>${player.club}</p>
                <button class="details-link" data-id="${player.id}">Szczegóły</button>
                <button class="fav-btn active" data-id="${player.id}">Usuń</button>
            </div>
        `;
    });
}

function renderPopular() {
    elements.popularGrid.innerHTML = '';

    players.slice(0, 3).forEach(player => {
        elements.popularGrid.innerHTML += `
            <div class="detail-card">
                <img src="${player.image}" width="120" alt="${player.name}">
                <h3>${player.name}</h3>
                <p>Wiek: ${player.age}</p>
            </div>
        `;
    });
}

// ======================================
// Ulubieni
// ======================================

function toggleFavorite(playerId) {
    const player = getAllPlayers().find(item => item.id === playerId);

    if (!player) return;

    const isFavorite = favorites.some(item => item.id === playerId);

    favorites = isFavorite
        ? favorites.filter(item => item.id !== playerId)
        : [...favorites, player];

    saveFavorites();
    updateFavCount();
    renderFavorites();
    renderPlayers(currentPlayers);
}

// ======================================
// Filtrowanie i sortowanie
// ======================================

function filterPlayers() {
    const searchText = normalizeText(elements.searchInput.value);
    const selectedPosition = elements.positionFilter.value;
    const sortType = elements.sortSelect.value;

    let filteredPlayers = [...currentPlayers];

    if (searchText) {
        filteredPlayers = filteredPlayers.filter(player => {
            const playerName = normalizeText(player.name);
            const playerClub = normalizeText(player.club);

            return playerName.includes(searchText) || playerClub.includes(searchText);
        });
    }

    if (selectedPosition) {
        filteredPlayers = filteredPlayers.filter(player => player.position === selectedPosition);
    }

    sortPlayers(filteredPlayers, sortType);
    renderPlayers(filteredPlayers);
}

function sortPlayers(playersToSort, sortType) {
    const sortOptions = {
        name: (a, b) => a.name.localeCompare(b.name, 'pl'),
        name2: (a, b) => b.name.localeCompare(a.name, 'pl'),
        goals: (a, b) => compareNumbers(a, b, 'goals', false),
        goals2: (a, b) => compareNumbers(a, b, 'goals', true),
        matches: (a, b) => compareNumbers(a, b, 'matches', false),
        matches2: (a, b) => compareNumbers(a, b, 'matches', true),
        age: (a, b) => compareNumbers(a, b, 'age', false),
        age2: (a, b) => compareNumbers(a, b, 'age', true)
    };

    if (sortOptions[sortType]) {
        playersToSort.sort(sortOptions[sortType]);
    }
}

// ======================================
// API-Football
// ======================================

function buildApiUrl(searchText) {
    const normalizedSearchText = normalizeText(searchText);
    const leagueId = elements.heroLeagueSelect.value;

    return 'https://v3.football.api-sports.io/players?search=' +
        encodeURIComponent(normalizedSearchText) +
        '&league=' + leagueId +
        '&season=' + API_SEASON;
}

function mapApiPlayer(item) {
    const player = item.player;
    const stats = item.statistics?.[0];

    return {
        id: player.id,
        name: player.name || 'Brak nazwy',
        nationality: player.nationality || '-',
        height: player.height || '-',
        weight: player.weight || '-',
        club: stats?.team?.name || 'Brak klubu',
        position: stats?.games?.position || 'Brak pozycji',
        age: player.age ? Number(player.age) : null,
        image: player.photo || '',
        matches: showValue(stats?.games?.appearences),
        goals: showValue(stats?.goals?.total),
        assists: showValue(stats?.goals?.assists),
        grade: stats?.games?.rating ? parseFloat(stats.games.rating).toFixed(2) : '-'
    };
}

async function searchPlayersFromApi(searchText) {
    setLoader(true);

    try {
        const response = await fetch(buildApiUrl(searchText), {
            method: 'GET',
            headers: {
                'x-apisports-key': API_KEY
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Błąd API: ${response.status}`);
        }

        if (data.errors && Object.keys(data.errors).length > 0) {
            throw new Error(JSON.stringify(data.errors));
        }

        if (!data.response || data.response.length === 0) {
            apiPlayers = [];
            currentPlayers = [];
            renderPlayers([]);
            elements.resultsInfo.textContent = `Brak wyników z API dla: ${searchText}`;
            return;
        }

        apiPlayers = data.response.map(mapApiPlayer);
        currentPlayers = apiPlayers;
        renderPlayers(currentPlayers);
    } catch (error) {
        console.error('Nie udało się pobrać danych z API:', error);
        alert('Nie udało się pobrać danych z API.');
    } finally {
        setLoader(false);
    }
}

// ======================================
// Obsługa zdarzeń
// ======================================

function handleHeroSearch() {
    const searchText = elements.heroSearchInput.value.trim();

    if (!searchText) {
        alert('Wpisz nazwisko zawodnika');
        return;
    }

    searchPlayersFromApi(searchText);
    changeView('players');
}

function handlePlayersListClick(event) {
    const id = Number(event.target.dataset.id);

    if (event.target.classList.contains('details-link')) {
        renderPlayerDetails(id);
    }

    if (event.target.classList.contains('star')) {
        toggleFavorite(id);
    }
}

function handleFavoritesClick(event) {
    const id = Number(event.target.dataset.id);

    if (event.target.classList.contains('details-link')) {
        renderPlayerDetails(id);
    }

    if (event.target.classList.contains('fav-btn')) {
        toggleFavorite(id);
    }
}

function addEventListeners() {
    elements.searchInput.addEventListener('input', filterPlayers);
    elements.positionFilter.addEventListener('change', filterPlayers);
    elements.sortSelect.addEventListener('change', filterPlayers);

    elements.heroSearchButton.addEventListener('click', handleHeroSearch);
    elements.heroSearchInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') handleHeroSearch();
    });

    elements.playersList.addEventListener('click', handlePlayersListClick);
    elements.favoritesGrid.addEventListener('click', handleFavoritesClick);

    elements.logo.addEventListener('click', handleViewChange);
    elements.viewButtons.forEach(button => button.addEventListener('click', handleViewChange));

    elements.hamburger.addEventListener('click', () => {
        elements.nav.classList.toggle('open');
        elements.hamburger.classList.toggle('open');
    });
}

// ======================================
// Start aplikacji
// ======================================

function init() {
    addEventListeners();
    renderPlayers(players);
    updateFavCount();
    renderFavorites();
    renderPopular();
}

init();
