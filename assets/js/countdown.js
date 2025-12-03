// Data do casamento (Lara & Pedro)
const weddingDate = new Date('2026-01-23T16:00:00');

// Estado para armazenar os valores anteriores
const previousTime = {
    days: null,
    hours: null,
    minutes: null,
    seconds: null
};

function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
}

function calcTime() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
}

function flipCard(container, currentValue, newValue) {
    const upperCard = container.querySelector('.upperCard span');
    const lowerCard = container.querySelector('.lowerCard span');
    const flipCardTop = container.querySelector('.flipCardTop');
    const flipCardBottom = container.querySelector('.flipCardBottom');
    const flipCardTopSpan = flipCardTop.querySelector('span');
    const flipCardBottomSpan = flipCardBottom.querySelector('span');

    const currentText = pad2(currentValue);
    const newText = pad2(newValue);

    // ===== CONFIGURAÇÃO INICIAL (seguindo o repositório) =====
    // 
    // ESTADO INICIAL (antes da animação):
    // - upperCard: mostra valor ATUAL (será coberto pelo flipCardTop)
    // - lowerCard: mostra valor ATUAL (ANTIGO!) - NÃO o novo!
    // - flipCardTop: mostra valor ATUAL, vai cair
    // - flipCardBottom: mostra valor NOVO, está escondido (rotateX 90°)
    //
    // DURANTE A ANIMAÇÃO:
    // 1. flipCardTop cai (0° → -90°), revelando upperCard por baixo
    // 2. Quando flipCardTop termina, upperCard é atualizado para NOVO
    // 3. flipCardBottom sobe (90° → 0°), cobrindo lowerCard
    // 4. Quando flipCardBottom termina, lowerCard é atualizado para NOVO

    // Configurar valores ANTES da animação
    upperCard.textContent = currentText;      // Valor atual (será atualizado no meio)
    lowerCard.textContent = currentText;      // Valor ANTIGO! (será atualizado no final)
    flipCardTopSpan.textContent = currentText; // Valor atual (vai cair)
    flipCardBottomSpan.textContent = newText;  // Valor novo (vai subir)

    // Remove animações anteriores e reseta posição
    flipCardTop.classList.remove('animate');
    flipCardBottom.classList.remove('animate');
    
    // Reseta as transformações
    flipCardTop.style.transform = 'rotateX(0deg)';
    flipCardBottom.style.transform = 'rotateX(90deg)';

    // Força reflow para garantir que o reset foi aplicado
    void flipCardTop.offsetWidth;

    // ===== FASE 1: flipCardTop cai (0° → -90°) =====
    flipCardTop.classList.add('animate');

    // ===== FASE 2: Após 250ms, atualiza upperCard e flipCardBottom sobe =====
    setTimeout(() => {
        // Atualiza upperCard para mostrar o novo valor
        // (fica visível por baixo do flipCardTop que já caiu)
        upperCard.textContent = newText;
        
        // Inicia animação do flipCardBottom subindo
        flipCardBottom.classList.add('animate');
    }, 250);

    // ===== FASE 3: Após 500ms (animação completa), reseta tudo =====
    setTimeout(() => {
        // Atualiza lowerCard para o novo valor
        // (agora está coberto pelo flipCardBottom que terminou de subir)
        lowerCard.textContent = newText;
        
        // Remove classes de animação
        flipCardTop.classList.remove('animate');
        flipCardBottom.classList.remove('animate');
        
        // Reseta flipCardTop para mostrar o novo valor (para próxima animação)
        flipCardTopSpan.textContent = newText;
        
        // Reseta as transformações para o estado inicial
        flipCardTop.style.transform = 'rotateX(0deg)';
        flipCardBottom.style.transform = 'rotateX(90deg)';
    }, 500);
}

function updateUnit(unit, newValue) {
    const currentValue = previousTime[unit];
    
    // Se não mudou, não faz nada
    if (currentValue === newValue) {
        return;
    }

    const container = document.querySelector(`.flipUnitContainer[data-unit="${unit}"]`);
    if (!container) return;

    // Se é a primeira vez, apenas define o valor sem animação
    if (currentValue === null) {
        const value = pad2(newValue);
        container.querySelector('.upperCard span').textContent = value;
        container.querySelector('.lowerCard span').textContent = value;
        container.querySelector('.flipCardTop span').textContent = value;
        container.querySelector('.flipCardBottom span').textContent = value;
    } else {
        // Anima a transição
        flipCard(container, currentValue, newValue);
    }

    previousTime[unit] = newValue;
}

function updateCountdown() {
    const time = calcTime();
    
    updateUnit('days', time.days);
    updateUnit('hours', time.hours);
    updateUnit('minutes', time.minutes);
    updateUnit('seconds', time.seconds);
}

function initDisplay() {
    const time = calcTime();
    const units = ['days', 'hours', 'minutes', 'seconds'];

    units.forEach(unit => {
        const container = document.querySelector(`.flipUnitContainer[data-unit="${unit}"]`);
        if (!container) return;

        const value = pad2(time[unit]);
        
        container.querySelector('.upperCard span').textContent = value;
        container.querySelector('.lowerCard span').textContent = value;
        container.querySelector('.flipCardTop span').textContent = value;
        container.querySelector('.flipCardBottom span').textContent = value;
        
        previousTime[unit] = time[unit];
    });
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    initDisplay();
    
    // Atualiza a cada segundo
    setInterval(updateCountdown, 1000);

    // Configura o evento de clique do Card de Dobra
    const card = document.getElementById('card');
    const tapHint = document.getElementById('tapHint');
    const foldingContainer = document.querySelector('.folding-countdown-container');

    if (card) {
        card.addEventListener('click', () => {
            card.classList.toggle('active');
            const opened = card.classList.contains('active');

            // Adiciona ou remove a classe active no container principal
            if (foldingContainer) {
                foldingContainer.classList.toggle('active', opened);
            }

            // Altera a dica de toque com base no estado
            if (tapHint) {
                tapHint.textContent = opened 
                    ? '↑ Clique para fechar' 
                    : '↓ Clique para ver a contagem';
            }
        });
    }
});