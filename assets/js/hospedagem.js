// =============================================================
// hospedagem.js — Carrossel de Hotéis
// Baseado no CodePen: https://codepen.io/supah/pen/xxJMbbg
// Efeito assimétrico diagonal com animação ao clicar
// =============================================================

/*--------------------
Vars
--------------------*/
let progress = 50;
let active = 0;
let isDown = false;
let startX = 0;

/*--------------------
Constants
--------------------*/
const speedDrag = -0.1;

/*--------------------
Hotels Data
--------------------*/
const hotelsData = [
    {
        name: 'Vila Babaçu',
        instagram: 'https://www.instagram.com/hotelvillababacu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
    },
    {
        name: 'Fiesta',
        instagram: 'https://www.instagram.com/fiestaparkhotel?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
    },
    {
        name: 'Serra do Ouro',
        instagram: 'https://www.instagram.com/hotelserradoouro?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
    }
];

/*--------------------
Get Z Index
--------------------*/
const getZindex = (array, index) => {
    return array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i));
};

/*--------------------
Elements
--------------------*/
let $items;
let $dots;

/*--------------------
Display Items
--------------------*/
const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$items], active)[index];
    item.style.setProperty('--zIndex', zIndex);
    item.style.setProperty('--active', (index - active) / $items.length);
};

/*--------------------
Animate
--------------------*/
const animate = () => {
    progress = Math.max(0, Math.min(progress, 100));
    active = Math.floor(progress / 100 * ($items.length - 1));
    
    $items.forEach((item, index) => displayItems(item, index, active));
    
    // Update dots
    if ($dots) {
        $dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === active);
        });
    }
    
    // NOVO: TODOS OS VÍDEOS TOCAM O TEMPO TODO
    $items.forEach((item) => {
        const video = item.querySelector('video');
        if (video && video.paused) {
            video.play().catch(() => {}); // ignora erro se o browser bloquear autoplay
        }
    });
};
/*--------------------
Handlers
--------------------*/
const handleMouseMove = (e) => {
    if (!isDown) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const mouseProgress = (x - startX) * speedDrag;
    progress = progress + mouseProgress;
    startX = x;
    animate();
};

const handleMouseDown = (e) => {
    isDown = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
};

const handleMouseUp = () => {
    isDown = false;
};

/*--------------------
Initialize
--------------------*/
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    $items = document.querySelectorAll('.carousel-item');
    $dots = document.querySelectorAll('.carousel-dot');
    
    if ($items.length === 0) return;

    // Initial animation
    animate();

    // Click on items to navigate
    $items.forEach((item, i) => {
        item.addEventListener('click', () => {
            const currentActive = Math.floor(progress / 100 * ($items.length - 1));
            
            // Se clicou no item ativo, abre o Instagram
            if (i === currentActive) {
                window.open(hotelsData[i].instagram, '_blank');
            } else {
                // Navega para o item clicado
                progress = (i / ($items.length - 1)) * 100;
                animate();
            }
        });
    });

    // Click on dots to navigate
    $dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            progress = (i / ($items.length - 1)) * 100;
            animate();
        });
    });

    // Touch/drag support
    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mousemove', handleMouseMove);
    carousel.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('mouseleave', handleMouseUp);
    carousel.addEventListener('touchstart', handleMouseDown, { passive: true });
    carousel.addEventListener('touchmove', handleMouseMove, { passive: true });
    carousel.addEventListener('touchend', handleMouseUp, { passive: true });
});
