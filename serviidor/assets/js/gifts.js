document.addEventListener('DOMContentLoaded', () => {
    const giftsCard = document.getElementById('giftsCard');
    const giftsTapHint = document.getElementById('giftsTapHint');

    // =============================================
    // 1. ABRIR E FECHAR O CARD DE PRESENTES
    // =============================================
    if (giftsCard) {
        giftsCard.addEventListener('click', (e) => {
            // Impede que o clique no PIX feche o card inteiro
            if (e.target.closest('.pix-copy-area')) {
                return;
            }

            giftsCard.classList.toggle('active');
            const opened = giftsCard.classList.contains('active');

            if (giftsTapHint) {
                giftsTapHint.textContent = opened
                    ? 'Clique para fechar'
                    : 'Clique para ver a lista';
            }
        });
    }

    // =============================================
    // 2. COPIAR O PIX AO CLICAR NO E-MAIL + EMOJI
    // =============================================
    const pixCopyArea = document.getElementById('pixCopyArea');
    const feedback = document.getElementById('copyFeedback');

    if (pixCopyArea && feedback) {
        pixCopyArea.addEventListener('click', async (e) => {
            e.stopPropagation(); // ← ESSENCIAL: impede que o card feche

            const email = "coclarabytes@gmail.com";

            try {
                await navigator.clipboard.writeText(email);
            } catch (err) {
                // Fallback para navegadores antigos
                const textarea = document.createElement('textarea');
                textarea.value = email;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            // Mostra o "Copiado!" por 2 segundos
            feedback.classList.add('show');
            setTimeout(() => feedback.classList.remove('show'), 2000);
        });
    }
});