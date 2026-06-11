# FootballDB

## Opis projektu

FootballDB to przeglądarkowa aplikacja webowa umożliwiająca wyszukiwanie zawodników piłkarskich oraz przeglądanie ich danych i statystyk z sezonu 24/25.

Aplikacja korzysta z zewnętrznego API Football API (API-Football) i umożliwia pobieranie aktualnych danych o zawodnikach występujących w wybranych ligach piłkarskich.

Projekt został wykonany z wykorzystaniem technologii HTML5, CSS3 oraz JavaScript ES6 bez użycia frameworków.

---

## Cel projektu

Celem projektu było stworzenie aplikacji prezentującej oraz przetwarzającej dane pochodzące z zewnętrznego API zgodnie z wymaganiami przedmiotu Wprowadzenie do aplikacji WWW.

---

## Wykorzystane technologie

* HTML5
* CSS3
* JavaScript ES6
* Fetch API
* LocalStorage
* API-Football

---

## Funkcjonalności

### Wyszukiwanie zawodników

Użytkownik może wyszukać zawodnika po nazwisku.

Wyszukiwanie wykorzystuje zewnętrzne API Football API.

### Lista zawodników

Wyświetlane są podstawowe informacje:

* imię i nazwisko
* klub
* pozycja
* wiek
* liczba meczów
* liczba goli

### Szczegóły zawodnika

Dla wybranego zawodnika prezentowane są:

* zdjęcie
* klub
* pozycja
* wiek
* narodowość
* wzrost
* waga
* liczba meczów
* liczba goli
* liczba asyst
* średnia ocena

### Ulubieni zawodnicy

Użytkownik może:

* dodawać zawodników do ulubionych
* usuwać zawodników z ulubionych
* przeglądać listę ulubionych

Dane są przechowywane w LocalStorage.

### Filtrowanie

Możliwość filtrowania zawodników według pozycji:

* Bramkarz
* Obrońca
* Pomocnik
* Napastnik

### Sortowanie

Możliwość sortowania według:

* nazwy A-Z
* nazwy Z-A
* wieku rosnąco
* wieku malejąco
* liczby meczów rosnąco
* liczby meczów malejąco
* liczby goli rosnąco
* liczby goli malejąco

---

## Struktura projektu

### index.html

Zawiera strukturę aplikacji oraz definicję widoków.

### style.css

Odpowiada za wygląd aplikacji, responsywność oraz animacje.

### api.js

Przechowuje przykładowe dane lokalne wykorzystywane po uruchomieniu aplikacji.

### dynamic.js

Zawiera logikę aplikacji:

* pobieranie danych z API
* renderowanie widoków
* filtrowanie
* sortowanie
* obsługę ulubionych
* komunikację z API

---

## Obsługa błędów

Aplikacja obsługuje:

* błędy komunikacji z API
* brak wyników wyszukiwania
* błędne odpowiedzi API
* puste pole wyszukiwania

---

## Responsywność

Aplikacja została wykonana zgodnie z podejściem Mobile First.

Dla urządzeń mobilnych zastosowano:

* menu hamburgerowe
* responsywne układy Grid i Flexbox
* media queries

---

## Możliwe kierunki rozwoju

* paginacja wyników
* wyszukiwanie w wielu ligach jednocześnie
* porównywanie zawodników
* wykresy statystyk
* eksport ulubionych zawodników

---

## Autorzy

Jan Dylnicki

Michał Pankiewicz

