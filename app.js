'use strict';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// === NAWIGACJA MIĘDZY WIDOKAMI ===
function navigate(viewName) {
    // Ukryj wszystkie widoki
    $$('.view').forEach(v => v.classList.remove('active'));
    $(`#view-${viewName}`).classList.add('active');

    // Podświetl aktywny link
    $$('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = $(`.nav-link[data-view="${viewName}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Zamknij mobile menu
    $('#nav').classList.remove('open');
    $('#hamburger').classList.remove('open');

    window.scrollTo(0, 0);
}

// === START ===
document.addEventListener('DOMContentLoaded', () => {

    // Kliknięcia w linki nawigacji
    $$('[data-view]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(el.dataset.view);
        });
    });

    // Hamburger menu (mobile)
    $('#hamburger').addEventListener('click', () => {
        $('#hamburger').classList.toggle('open');
        $('#nav').classList.toggle('open');
    });

});