document.addEventListener('DOMContentLoaded', () => {
    const giftsCard = document.getElementById('giftsCard');
    const giftsTapHint = document.getElementById('giftsTapHint');

    if (giftsCard) {
        giftsCard.addEventListener('click', () => {
            giftsCard.classList.toggle('active');
            const opened = giftsCard.classList.contains('active');

            if (giftsTapHint) {
                giftsTapHint.textContent = opened 
                    ? '↑ Clique para fechar' 
                    : '↓ Clique para ver a lista';
            }
        });
    }
});