document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.check-item');
    const radios = document.querySelectorAll('.radio-item');
    const listaResumo = document.getElementById('lista-resumo');
    const valorTotalEl = document.getElementById('valor-total');
    const formWhatsapp = document.getElementById('form-whatsapp');

    function calcularOrcamento() {
        let total = 0;
        let htmlResumo = '';

        // 1. Verifica quais taxas/exames foram marcados
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

        // 2. Verifica qual pacote prático foi escolhido
        radios.forEach(radio => {
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

        // Se nada estiver marcado
        if (htmlResumo === '') {
            htmlResumo = '<p style="color: #888; font-style: italic;">Nenhum item selecionado.</p>';
        }

        // Atualiza a tela com a lista e o valor total
        listaResumo.innerHTML = htmlResumo;
        valorTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Ouve alterações nos inputs para recalcular na hora
    checkboxes.forEach(chk => chk.addEventListener('change', calcularOrcamento));
    radios.forEach(radio => radio.addEventListener('change', calcularOrcamento));

    // Executa no carregamento inicial
    calcularOrcamento();

    // 3. Ação de envio para o WhatsApp
    formWhatsapp.addEventListener('submit', (e) => {
        e.preventDefault();

        // Correção aplicada aqui (.value para pegar o texto digitado)
        const nomeAluno = document.getElementById('nome').value;
        const cidadeAluno = document.getElementById('cidade').value;
        const valorTotalTexto = valorTotalEl.textContent;

        let itensSelecionados = [];
        checkboxes.forEach(chk => {
            if (chk.checked) {
                itensSelecionados.push(`- ${chk.getAttribute('data-nome')} (R$ ${parseFloat(chk.getAttribute('data-valor')).toFixed(2).replace('.', ',')})`);
            }
        });
        radios.forEach(radio => {
            if (radio.checked) {
                itensSelecionados.push(`- Pacote: ${radio.getAttribute('data-nome')} (R$ ${parseFloat(radio.getAttribute('data-valor')).toFixed(2).replace('.', ',')})`);
            }
        });

        // Número do instrutor configurado
        const numeroWhatsApp = "558694350334";

        // Monta a mensagem estruturada corretamente
        let mensagem = `Olá! Meu nome é *${nomeAluno}* de *${cidadeAluno}*. Montei meu orçamento no site e gostaria de solicitar:\n\n`;
        mensagem += `*Itens Escolhidos:*\n${itensSelecionados.join('\n')}\n\n`;
        mensagem += `*Valor Total Estimado:* ${valorTotalTexto}\n\n`;
        mensagem += `Pode confirmar minha vaga e me orientar sobre os próximos passos?`;

        const mensagemCodificada = encodeURIComponent(mensagem);
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

        window.open(urlWhatsApp, '_blank');
    });
});