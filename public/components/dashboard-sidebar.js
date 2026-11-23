function escaparTextoNotificacao(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
}

window.carregarNotificacoes = async (marcarLidasAoAbrir = false) => {
    const panel = document.getElementById('barraNotificacoes');
    if (!panel) return;

    let container = document.getElementById('listaNotificacoes');
    if (!container) {
        panel.querySelectorAll('.notificacao').forEach((el) => el.remove());
        container = document.createElement('div');
        container.id = 'listaNotificacoes';
        panel.appendChild(container);
    }

    const idUsuario = sessionStorage.ID_USUARIO || 1;

    try {
        const resposta = await fetch(`/notificacoes/listar/${idUsuario}`);
        if (!resposta.ok) throw new Error(`Falha ao buscar notificações: ${resposta.status}`);

        const notificacoes = await resposta.json();
        container.innerHTML = '';

        if (!Array.isArray(notificacoes) || notificacoes.length === 0) {
            container.innerHTML = `
                <div class="notificacao">
                    <h3>Sem notificações</h3>
                    <p>Você não possui notificações no momento.</p>
                </div>
            `;
            return;
        }

        notificacoes.forEach((n) => {
            const jaLida = Number(n.lida) === 1;
            const item = document.createElement('div');
            item.className = 'notificacao';
            item.dataset.id = n.id_notificacao;
            if (jaLida) {
                item.style.opacity = '0.6';
            }

            item.innerHTML = `
                <h3>${escaparTextoNotificacao(n.titulo)}</h3>
                <p>${escaparTextoNotificacao(n.mensagem)}</p>
                <span>${escaparTextoNotificacao(n.tipo)}</span>
            `;
            container.appendChild(item);

            if (marcarLidasAoAbrir && !jaLida && n.id_usuario != null) {
                fetch(`/notificacoes/ler/${n.id_notificacao}`, { method: 'PUT' }).catch((erro) =>
                    console.error('Erro ao marcar notificação como lida:', erro)
                );
            }
        });
    } catch (erro) {
        console.error('Erro ao carregar notificações:', erro);
        container.innerHTML = `
            <div class="notificacao">
                <h3>Indisponível</h3>
                <p>Não foi possível carregar as notificações.</p>
            </div>
        `;
    }
};

window.loadDashboardSidebar = async (host, source) => {
    if (!host) return;
    try {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`Sidebar request failed: ${response.status}`);
        host.innerHTML = await response.text();
        await window.carregarNotificacoes(false);
    } catch (error) {
        console.error('Não foi possível carregar a navegação.', error);
    }
};

window.abrirNotificacoes = () => {
    const panel = document.getElementById('barraNotificacoes');
    if (panel) {
        panel.style.display = 'block';
        panel.classList.add('notificacoes-abertas');
    }
    window.carregarNotificacoes(true);
};

window.fecharNotificacoes = () => {
    const panel = document.getElementById('barraNotificacoes');
    if (panel) {
        panel.style.display = 'none';
        panel.classList.remove('notificacoes-abertas');
    }
};
