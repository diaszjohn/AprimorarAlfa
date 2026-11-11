document.addEventListener('DOMContentLoaded', () => {
    const radiosCategoria = document.querySelectorAll('.radio-categoria');
    const checkboxes = document.querySelectorAll('.check-item');
    const radiosPacote = document.querySelectorAll('.radio-item');
    const listaResumo = document.getElementById('lista-resumo');
    const valorTotalEl = document.getElementById('valor-total');
    const formWhatsapp = document.getElementById('form-whatsapp');

    function calcularOrcamento() {
        let total = 0;
        let htmlResumo = '';

        // 1. Categoria da CNH selecionada
        radiosCategoria.forEach(radio => {
            if (radio.checked) {
                const nome = radio.getAttribute('data-nome');
                const valor = parseFloat(radio.getAttribute('data-valor'));
                total += valor;
                htmlResumo += `
                    <div class="item-resumo-linha">
                        <span>• Categoria: ${nome}</span>
                        <span>R$ ${valor.toFixed(2).replace('.', ',')}</span>
                    </div>
                `;
            }
        });

        // 2. Taxas e exames marcados
        checkboxes.forEach(chk => {
            if (chk.checked) {
                const nome = chk.getAttribute('data-nome');
                const valor = parseFloat(chk.getAttribute('data-valor'));
                total += valor;
                htmlResumo += `
                    <div class="item-resumo-linha">
                        <span>• ${nome}</span>
                        <span>R$ ${valor.toFixed(2).replace('.', ',')}</span>
                    </div>
                `;
            }
        });

        // 3. Aulas ou pacote prático escolhido
        radiosPacote.forEach(radio => {
            if (radio.checked) {
                const nome = radio.getAttribute('data-nome');
                const valor = parseFloat(radio.getAttribute('data-valor'));
                total += valor;
                htmlResumo += `
                    <div class="item-resumo-linha">
                        <span>• ${nome}</span>
                        <span>R$ ${valor.toFixed(2).replace('.', ',')}</span>
                    </div>
                `;
            }
        });

        if (htmlResumo === '') {
            htmlResumo = '<p style="color: #888; font-style: italic;">Nenhum item selecionado.</p>';
        }

        listaResumo.innerHTML = htmlResumo;
        valorTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Ouvintes de eventos para recalcular ao alterar qualquer seleção
    radiosCategoria.forEach(radio => radio.addEventListener('change', calcularOrcamento));
    checkboxes.forEach(chk => chk.addEventListener('change', calcularOrcamento));
    radiosPacote.forEach(radio => radio.addEventListener('change', calcularOrcamento));

    // Executa no carregamento inicial
    calcularOrcamento();

    // Envio para o WhatsApp com total sigilo e processamento local
    formWhatsapp.addEventListener('submit', (e) => {
        e.preventDefault();

        const nomeAluno = document.getElementById('nome').value;
        const cidadeAluno = document.getElementById('cidade').value;
        const valorTotalTexto = valorTotalEl.textContent;

        let itensSelecionados = [];
        
        radiosCategoria.forEach(radio => {
            if (radio.checked) itensSelecionados.push(`- Categoria: ${radio.getAttribute('data-nome')}`);
        });
        checkboxes.forEach(chk => {
            if (chk.checked) itensSelecionados.push(`- ${chk.getAttribute('data-nome')} (R$ ${parseFloat(chk.getAttribute('data-valor')).toFixed(2).replace('.', ',')})`);
        });
        radiosPacote.forEach(radio => {
            if (radio.checked) itensSelecionados.push(`- Aulas/Pacote: ${radio.getAttribute('data-nome')} (R$ ${parseFloat(radio.getAttribute('data-valor')).toFixed(2).replace('.', ',')})`);
        });

        // Número do instrutor
        const numeroWhatsApp = "558694350334";

        let mensagem = `Olá! Meu nome é *${nomeAluno}* de *${cidadeAluno}*. Montei meu orçamento no site e gostaria de solicitar:\n\n`;
        mensagem += `*Itens Escolhidos:*\n${itensSelecionados.join('\n')}\n\n`;
        mensagem += `*Valor Total Estimado:* ${valorTotalTexto}\n\n`;
        mensagem += `Pode confirmar minha vaga e me orientar sobre os próximos passos?`;

        const mensagemCodificada = encodeURIComponent(mensagem);
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

        window.open(urlWhatsApp, '_blank');
    });
});