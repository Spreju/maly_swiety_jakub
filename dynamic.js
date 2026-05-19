'use strict';

// lista zawodników
const playersList = document.getElementById("players-list");

// input wyszukiwania
const searchInput = document.getElementById("search");

// select pozycji
const positionFilter = document.getElementById("filter-position");

// select sortowania
const sortSelect = document.getElementById("sort");

// miejsce gdzie pokazujemy ilość wyników
const resultsInfo = document.getElementById("results-info");

// tutaj będziemy trzymać zawodników pobranych z API
let apiPlayers = [];

// ta zmienna mówi, z jakiej listy aktualnie korzystamy:
// na początku używamy lokalnej tablicy players z api.js
let currentPlayers = players;

const API_KEY = "54f7ebf2d5b93c24ba949c932130a794";

// ======================================
// FUNKCJA WYŚWIETLAJĄCA ZAWODNIKÓW
// ======================================

function renderPlayers(playersToShow) {

    // czyścimy listę
    playersList.innerHTML = "";

    // dodajemy nagłówek tabeli
    playersList.innerHTML += `
        <div class="player-row header">
            <div>Zawodnik</div>
            <div>Klub</div>
            <div>Pozycja</div>
            <div>Wiek</div>
            <div>Wartość</div>
            <div>Akcja</div>
        </div>
    `;

    // pętla po zawodnikach
    playersToShow.forEach(player => {

        playersList.innerHTML += `
            <div class="player-row">

                <div class="player-name">
                    ${player.name}
                </div>

                <div class="player-club">
                    ${player.club}
                </div>

                <div>
                    ${player.position}
                </div>

                <div>
                    ${player.age}
                </div>

                <div class="player-value">
                    ${player.valueToShow}
                </div>

                <div>
                    <button 
                        class="details-link"
                        onclick="showPlayerDetails(${player.id})"
                    >
                        Szczegóły
                    </button>
                </div>

            </div>
        `;
    });

    // pokazujemy ilość wyników
    resultsInfo.textContent =
        "Znaleziono zawodników: " + playersToShow.length;
}

// ======================================
// SZCZEGÓŁY ZAWODNIKA
// ======================================

function showPlayerDetails(playerId) {

    // szukamy zawodnika w aktualnej liście
    // czyli albo w lokalnych danych, albo w danych z API
    const player = currentPlayers.find(function(player) {
        return player.id === playerId;
    });

    if (!player) {
        return;
    }

    const detailCard = document.getElementById("detail-card");

    detailCard.innerHTML = `
        <div class="detail-header">
            <div class="detail-photo">
                <img src="${player.image}" alt="${player.name}">
            </div>

            <div class="detail-info">
                <h2>${player.name}</h2>
                <p><strong>Pozycja:</strong> ${player.position}</p>
                <p><strong>Wiek:</strong> ${player.age}</p>
                <p><strong>Klub:</strong> ${player.club}</p>
                <p><strong>Wartość rynkowa:</strong> ${player.valueToShow}</p>
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

    changeView("detail");
}

// ======================================
// FILTROWANIE I SORTOWANIE
// ======================================

function filterPlayers() {

    // kopiujemy tablicę players
    let filteredPlayers = [...currentPlayers];

    // ======================================
    // WYSZUKIWANIE
    // ======================================

    const searchText =
        searchInput.value.toLowerCase();

    if (searchText !== "") {

        filteredPlayers =
            filteredPlayers.filter(function(player) {

                return (
                    player.name.toLowerCase().includes(searchText) ||
                    player.club.toLowerCase().includes(searchText)
                );
            });
    }

    // ======================================
    // FILTR PO POZYCJI
    // ======================================

    const selectedPosition = positionFilter.value;

    if (selectedPosition !== "") {

        filteredPlayers =
            filteredPlayers.filter(function(player) {

                return player.position === selectedPosition;
            });
    }

    // ======================================
    // SORTOWANIE
    // ======================================

    const sortType = sortSelect.value;

    // sortowanie po nazwie A-Z
    if (sortType === "name") {

        filteredPlayers.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    // sortowanie po nazwie Z-A
    if (sortType === "name2") {

        filteredPlayers.sort(function(a, b) {
            return b.name.localeCompare(a.name);
        });
    }

    // sortowanie po wartości malejąco
    if (sortType === "value") {

        filteredPlayers.sort(function(a, b) {
            return b.value - a.value;
        });
    }

    // sortowanie po wartości rosnąco
    if (sortType === "value2") {

        filteredPlayers.sort(function(a, b) {
            return a.value - b.value;
        });
    }

    // sortowanie po wieku malejąco
    if (sortType === "age") {

        filteredPlayers.sort(function(a, b) {
            return b.age - a.age;
        });
    }

    // sortowanie po wieku rosnąco
    if (sortType === "age2") {

        filteredPlayers.sort(function(a, b) {
            return a.age - b.age;
        });
    }

    // pokazujemy wynik
    renderPlayers(filteredPlayers);
}

// ======================================
// POBIERANIE ZAWODNIKÓW Z API
// ======================================

async function searchPlayersFromApi(searchText) {

    const apiUrl =
        "https://v3.football.api-sports.io/players/profiles?search=" +
        encodeURIComponent(searchText);

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "x-apisports-key": API_KEY
            }
        });

        if (!response.ok) {
            throw new Error("Błąd API: " + response.status);
        }

        const data = await response.json();

        console.log("Dane z API:", data);

        const apiResults = data.response;

        apiPlayers = apiResults.map(function(item, index) {

            const player = item.player;

            return {
                id: index + 1000,
                name: player.name || "Brak nazwy",
                club: "Brak klubu",
                position: "Brak pozycji",
                age: player.age || "-",
                value: 0,
                valueToShow: "Brak danych",
                image: player.photo || "",

                matches: "-",
                goals: "-",
                assists: "-",
                grade: "-"
            };
        });

        currentPlayers = apiPlayers;
        renderPlayers(currentPlayers);

    } catch (error) {
        console.log("Nie udało się pobrać danych z API:", error);

        alert("Nie udało się pobrać danych z API.");
    }
}

// ======================================
// EVENT LISTENERS
// ======================================

// wpisywanie w wyszukiwarkę
searchInput.addEventListener("input", filterPlayers);

// zmiana selecta pozycji
positionFilter.addEventListener("change", filterPlayers);

// zmiana sortowania
sortSelect.addEventListener("change", filterPlayers);

// przycisk "Szukaj" na stronie głównej
const heroSearchButton = document.getElementById("hero-search-btn");

// input na stronie głównej
const heroSearchInput = document.getElementById("hero-search");

heroSearchButton.addEventListener("click", function() {

    const searchText = heroSearchInput.value.trim();

    if (searchText === "") {
        alert("Wpisz nazwisko zawodnika");
        return;
    }

    searchPlayersFromApi(searchText);
    changeView("players");
});

heroSearchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        const searchText = heroSearchInput.value.trim();

        if (searchText === "") {
            alert("Wpisz nazwisko zawodnika");
            return;
        }

        searchPlayersFromApi(searchText);
        changeView("players");
    }
});

// ======================================
// START
// ======================================

// po załadowaniu strony pokaż zawodników
renderPlayers(players);