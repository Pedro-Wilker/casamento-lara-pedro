// =============================================================
// confirmation.js — VERSÃO FINAL COM DROPDOWN (01/12/2025)
// Dropdown obrigatório: Parceiro(a) ou Filho(a)
// =============================================================

const PUBLIC_KEY        = "_dhpREtM40JPrykJa";
const SERVICE_ID        = "service_z2k0qfk";
const TEMPLATE_GUEST_ID = "template_oho555l";
const TEMPLATE_ADMIN_ID = "template_lruclco";

emailjs.init(PUBLIC_KEY);

let acompanhanteCount = 0;

// Botão + Adicionar acompanhante
document.getElementById('addAcompanhante').addEventListener('click', function () {
    acompanhanteCount++;
    const list = document.getElementById('acompanhantesList');
    const div = document.createElement('div');
    div.className = 'acompanhante-field';
    div.innerHTML = `
        <button type="button" class="remove-acompanhante" onclick="this.parentElement.remove(); acompanhanteCount=Math.max(0,acompanhanteCount-1)">×</button>
        
        <p class="acompanhante-label">Acompanhante ${acompanhanteCount}</p>
        
        <select name="acc_relacao_${acompanhanteCount}" class="relacao-select" required>
            <option value="" disabled selected>Selecione a relação</option>
            <option value="Parceiro(a)">Parceiro(a)</option>
            <option value="Filho(a)">Filho(a)</option>
        </select>
        
        <input type="text" name="acc_name_${acompanhanteCount}" placeholder="Nome completo" required>
        <input type="email" name="acc_email_${acompanhanteCount}" placeholder="E-mail (opcional)">
        <input type="tel" name="acc_phone_${acompanhanteCount}" placeholder="Telefone (opcional)">
        
        <button type="button" class="btn-add-mais" onclick="adicionarAcompanhanteAbaixo(this)">+ Adicionar outro acompanhante</button>
    `;
    list.appendChild(div);
});

// Função para adicionar acompanhante abaixo do botão clicado
function adicionarAcompanhanteAbaixo(botao) {
    acompanhanteCount++;
    const div = document.createElement('div');
    div.className = 'acompanhante-field';
    div.innerHTML = `
        <button type="button" class="remove-acompanhante" onclick="this.parentElement.remove(); acompanhanteCount=Math.max(0,acompanhanteCount-1)">×</button>
        
        <p class="acompanhante-label">Acompanhante ${acompanhanteCount}</p>
        
        <select name="acc_relacao_${acompanhanteCount}" class="relacao-select" required>
            <option value="" disabled selected>Selecione a relação</option>
            <option value="Parceiro(a)">Parceiro(a)</option>
            <option value="Filho(a)">Filho(a)</option>
        </select>
        
        <input type="text" name="acc_name_${acompanhanteCount}" placeholder="Nome completo" required>
        <input type="email" name="acc_email_${acompanhanteCount}" placeholder="E-mail (opcional)">
        <input type="tel" name="acc_phone_${acompanhanteCount}" placeholder="Telefone (opcional)">
        
        <button type="button" class="btn-add-mais" onclick="adicionarAcompanhanteAbaixo(this)">+ Adicionar outro acompanhante</button>
    `;
    
    // Insere o novo campo após o campo atual do botão clicado
    botao.parentElement.insertAdjacentElement('afterend', div);
}

// Envio do formulário
document.getElementById('confirmationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = this;
    const mainName  = form.main_name.value.trim();
    const mainEmail = form.main_email.value.trim();
    const mainPhone = form.main_phone.value.trim() || 'Não informado';

    // Monta lista completa
    let listaConvidados = `Convidado principal:\n${mainName} - ${mainEmail} - ${mainPhone}\n\nAcompanhantes:\n`;
    let temAcompanhante = false;

    for (let i = 1; i <= acompanhanteCount; i++) {
        const nome     = form[`acc_name_${i}`]?.value?.trim();
        const relacao  = form[`acc_relacao_${i}`]?.value;
        const email    = form[`acc_email_${i}`]?.value?.trim();
        const tel      = form[`acc_phone_${i}`]?.value?.trim() || 'Não informado';

        if (nome && relacao) {
            const emailTexto = email ? email : 'Não informado';
            listaConvidados += `${nome} – ${relacao} – ${emailTexto} – ${tel}\n`;
            temAcompanhante = true;
        }
    }

    if (!temAcompanhante) listaConvidados += "Nenhum acompanhante adicionado";

    // E-mail de agradecimento ao convidado
    emailjs.send(SERVICE_ID, TEMPLATE_GUEST_ID, {
        to_email: mainEmail,
        guest_name: mainName
    }).catch(err => console.error("Erro agradecimento:", err));

    // E-mail para os noivos
    emailjs.send(SERVICE_ID, TEMPLATE_ADMIN_ID, {
        convidados_lista: listaConvidados,
        data_envio: new Date().toLocaleString('pt-BR')
    }).catch(err => console.error("Erro admin:", err));

    // Sucesso
    form.style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Mapa mobile
document.querySelectorAll('.map-hint').forEach(hint => {
    hint.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            window.open('https://maps.app.goo.gl/3a0447cfddfaa62f', '_blank');
        }
    });
});