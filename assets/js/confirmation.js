// =============================================================
// confirmation.js — VERSÃO FINAL COM CARD DE PRAZO ENCERRADO
// =============================================================

// Mapa mobile
document.querySelectorAll('.map-hint').forEach(hint => {
    hint.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            window.open('https://maps.app.goo.gl/3a0447cfddfaa62f', '_blank');
        }
    });
});