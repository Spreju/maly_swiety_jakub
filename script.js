const formularz = document.querySelector("form");
const zawodnik = document.querySelector("#zawodnik");
const wyszukajzawodnik = document.querySelector("#szukajzawodnik");
const blad = document.querySelector("#blad");
const wynik = document.querySelector("#wynik"); 
const menu = document.querySelector("#menu");

// walidacja formularza
if (formularz) {
    formularz.addEventListener("submit", function(zatwierz) {
        zatwierz.preventDefault();

        const wyszukanie = wyszukajzawodnik.value.trim();

        if (wyszukanie == "") {
            blad.textContent = "Wpisz imie sportowca";
            return;
        } 

        if (wyszukanie.length < 3) {
            blad.textContent = "Wpisz minimum 3 znaki";
            return;
        }
    
        fetch("https://www.thesportsdb.com/api/v1/json/123/searchplayers.php?p=" + wyszukanie)
            .then(function(odpowiedz) {
                if (odpowiedz.ok) {
                    return odpowiedz.json();
                } else {
                    throw new Error("Problem z połączeniem z API");
                }
            })
            .then(function(dane) {
                localStorage.setItem("wynikWyszukiwania", JSON.stringify(dane));
                window.location.href = "zawodnicy.html";
            })
            .catch(function(brak) {
                blad.textContent = "Nie udało się pobrać danych z API";
            });
    });
}

// wypisywanie danych jak coś znajdzie i nie ma formularza
if (wynik && !formularz) {
    const zapisaneDane = localStorage.getItem("wynikWyszukiwania");
    if (zapisaneDane != null) {
        const dane = JSON.parse(zapisaneDane);
        if (dane.player == null) {
            wynik.innerHTML = "Nie znaleziono sportowca";
        } else {
            wynik.innerHTML = "";
            dane.player.forEach(function(zawodnik) {
                const zdjecie = zawodnik.strCutout || "assets/placeholder.png";
                wynik.innerHTML += `
                    <div class="zawodnik">
                        <h2>${zawodnik.strPlayer}</h2>
                        <div class="zdjecie">
                            <img alt="Zdjęcie sportowca" src="${zdjecie}">
                        </div>
                        <div class="dane">
                            <p>Sport: ${zawodnik.strSport}</p>
                            <p>Klub: ${zawodnik.strTeam}</p>
                            <p>Kraj: ${zawodnik.strNationality}</p>
                            <p>Pozycja: ${zawodnik.strPosition}</p>
                            <p>Data uro: ${zawodnik.dateBorn}</p>
                        </div>
                    </div>
                `;    
            });
        }
    } else {
        wynik.innerHTML = "Wyszukaj najpierw sportowca";
    }
} 

if (menu) {
    menu.addEventListener("click", function() {
        const nawigacja = document.querySelector("#calanawigacja");
        const przyciskmenu = document.querySelector("#menu");

        if (nawigacja.style.display === "flex") {
            nawigacja.style.display = "none";    
            przyciskmenu.textContent = "Rozwiń";
        } else {
            nawigacja.style.display = "flex";
            przyciskmenu.textContent = "Zwiń";
        }
    });
}