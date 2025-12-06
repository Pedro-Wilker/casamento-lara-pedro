document.addEventListener('DOMContentLoaded', function () {
    const envelope = document.getElementById('envelope');
    const seloBtn = document.getElementById('seloBtn');
    const conviteContent = document.getElementById('conviteContent');
    const body = document.body;
    let isOpened = false;

    function openEnvelope() {
        if (isOpened) return;
        isOpened = true;

        envelope.classList.add('opened');
        body.classList.add('envelope-opened');

        setTimeout(() => {
            conviteContent.classList.add('visible');
            if (window.innerWidth <= 480) {
                envelope.style.display = 'none';
            }
        }, 800);
    }

    seloBtn.addEventListener('click', openEnvelope);
    envelope.addEventListener('click', (e) => {
        if (e.target !== seloBtn && !seloBtn.contains(e.target)) {
            openEnvelope();
        }
    });
});