document.addEventListener('DOMContentLoaded', () => {
    const giftsCard = document.getElementById('giftsCard');
    const giftsTapHint = document.getElementById('giftsTapHint');
    const giftsList = document.getElementById('giftsList');
    const verListaCompleta = document.getElementById('verListaCompleta');
    const modal = document.getElementById('presentesModal');
    const modalClose = document.getElementById('modalClose');
    const giftsListFull = document.getElementById('giftsListFull');

    // Modal de confirmação
    const confirmModal = document.getElementById('confirmModal');
    const confirmItemName = document.getElementById('confirmItemName');
    const confirmMessage = document.getElementById('confirmMessage'); // novo elemento
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');

    const SUPABASE_URL = 'https://ziajsqaagnwhcxqsaikf.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWpzcWFhZ253aGN4cXNhaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTQzNDQsImV4cCI6MjA4MDYzMDM0NH0.bQ_HKCseq14hWwbUsouca_XH6qzX-FDLQEwBwaQRLdE';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let todosPresentes = [];
    let itemPendente = null;

    async function carregarPresentes() {
        try {
            const { data, error } = await supabase
                .from('presentes')
                .select('id, presente, status, ilimitado')
                .order('id');
            if (error) throw error;
            todosPresentes = data;
            exibirListaCurta();
            exibirListaCompleta();
        } catch (err) {
            console.error('Erro Supabase:', err);
            usarFallback();
        }
    }

    function usarFallback() {
        todosPresentes = Array.from({ length: 33 }, (_, i) => ({
            id: i + 1,
            presente: `Presente ${i + 1}`,
            status: 'DISPONIVEL',
            ilimitado: i < 6
        }));
        exibirListaCurta();
        exibirListaCompleta();
    }

    function exibirListaCurta() {
        const disponiveis = todosPresentes.filter(p => p.status === 'DISPONIVEL').slice(0, 10);
        giftsList.innerHTML = '';
        disponiveis.forEach(item => criarItemPresente(item, giftsList));
        verListaCompleta.style.display = disponiveis.length >= 10 ? 'block' : 'none';
    }

    function exibirListaCompleta() {
        giftsListFull.innerHTML = '';
        const disponiveis = todosPresentes.filter(p => p.status === 'DISPONIVEL');
        const escolhidos = todosPresentes.filter(p => p.status === 'ESCOLHIDO');

        disponiveis.forEach(item => criarItemPresente(item, giftsListFull));
        escolhidos.forEach(item => {
            const div = criarItemPresente(item, giftsListFull);
            div.classList.add('selected');
            div.style.opacity = '0.6';
            div.style.pointerEvents = 'none';
        });
    }

    function criarItemPresente(item, container) {
        const div = document.createElement('div');
        div.className = 'gift-item';
        div.dataset.id = item.id;
        div.dataset.ilimitado = item.ilimitado;
        div.innerHTML = `${item.ilimitado ? 'Heart' : 'Diamond'} ${item.presente}`;

        div.addEventListener('click', (e) => {
            e.stopPropagation();

            if (div.classList.contains('selected')) return; // já escolhido

            itemPendente = { id: item.id, el: div, nome: item.presente, ilimitado: item.ilimitado };
            confirmItemName.textContent = item.presente;

            // MENSAGEM DIFERENTE PARA ILIMITADO
            if (item.ilimitado) {
                confirmMessage.innerHTML = `
                    <p>Este item <strong>pode ser presenteado por mais de uma pessoa</strong>.</p>
                    <p>Ao confirmar, ele será registrado como escolhido por você, mas <strong>continuará na lista</strong> para outros convidados.</p>
                `;
            } else {
                confirmMessage.innerHTML = `
                    <p>Caso você marque este item, ele <strong>ficará indisponível</strong> para os outros convidados.</p>
                    <p><strong>Este processo é irreversível.</strong></p>
                `;
            }

            confirmModal.classList.add('show');
        });

        container.appendChild(div);
        return div;
    }

    // CONFIRMAÇÃO
    confirmYes.addEventListener('click', async () => {
        if (!itemPendente) return;

        const { id, el, ilimitado } = itemPendente;

        if (ilimitado) {
            // Ilimitado: só muda visual
            el.classList.add('selected');
            el.innerHTML = `Checkmark ${itemPendente.nome}`;
        } else {
            // Finito: salva no banco
            try {
                const { error } = await supabase
                    .from('presentes')
                    .update({ status: 'ESCOLHIDO' })
                    .eq('id', id);
                if (error) throw error;

                el.classList.add('selected');
                el.style.opacity = '0.6';
                el.style.pointerEvents = 'none';
                el.innerHTML = `Checkmark ${itemPendente.nome}`;
                carregarPresentes();
            } catch (err) {
                alert('Erro ao reservar. Tente novamente.');
            }
        }

        confirmModal.classList.remove('show');
        itemPendente = null;
    });

    confirmNo.addEventListener('click', () => {
        confirmModal.classList.remove('show');
        itemPendente = null;
    });

    // ABRIR/FECHAR CARD
    giftsCard.addEventListener('click', (e) => {
        if (e.target.closest('.pix-copy-area') || 
            e.target.closest('.gift-item') || 
            e.target.closest('.ver-lista-btn')) return;

        giftsCard.classList.toggle('active');
        if (giftsCard.classList.contains('active')) {
            carregarPresentes();
            giftsTapHint.textContent = 'Clique para fechar';
        } else {
            giftsTapHint.textContent = 'Clique para ver a lista';
        }
    });

    // ABRIR MODAL COMPLETA
    verListaCompleta.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.classList.add('show');
        exibirListaCompleta();
    });

    // FECHAR MODAIS
    modalClose.addEventListener('click', () => modal.classList.remove('show'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
    confirmModal.addEventListener('click', e => { if (e.target === confirmModal) confirmModal.classList.remove('show'); });

    // COPIAR PIX
    document.getElementById('pixCopyArea')?.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText("coclarabytes@gmail.com");
            document.getElementById('copyFeedback').classList.add('show');
            setTimeout(() => document.getElementById('copyFeedback').classList.remove('show'), 2000);
        } catch (err) {
            alert('Copie manualmente: coclarabytes@gmail.com');
        }
    });
});