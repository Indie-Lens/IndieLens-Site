(function verificarAcessoPerfil() {
    try {
        const perfil = String(sessionStorage.getItem('PERFIL_USUARIO') || '').trim();
        const path = window.location.pathname.toLowerCase();

        if (perfil === '4' && (path.includes('/dashboard/leadgame/') || path.includes('/dashboard/desenvolvedor/'))) {
            window.location.replace('/Dashboard/Streamer/DashboardGeral.html');
        } else if (perfil === '3' && path.includes('/dashboard/streamer/')) {
            window.location.replace('/Dashboard/LeadGame/dashPrincipalLead.html');
        }
    } catch (erro) {
        console.error('Erro ao verificar acesso do perfil:', erro);
    }
})();

const ROTULOS_PERFIL_SIDEBAR = {
    '1': 'Teste',
    '2': 'Admin',
    '3': 'Lead Game',
    '4': 'Streamer'
};

function escaparTextoNotificacao(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
}

window.atualizarUsuarioSidebar = (escopo = document) => {
    try {
        const raiz = escopo && typeof escopo.querySelectorAll === 'function' ? escopo : document;
        const nome = (sessionStorage.getItem('NOME_USUARIO') || '').trim();
        const perfil = String(sessionStorage.getItem('PERFIL_USUARIO') || '').trim();
        const rotuloPerfil = ROTULOS_PERFIL_SIDEBAR[perfil];

        if (nome) {
            raiz.querySelectorAll('.nome-usuario').forEach((el) => {
                if (el.textContent !== nome) {
                    el.textContent = nome;
                }
            });
            document.querySelectorAll('.acoes-usuario .perfil .nome, .topo-direita .perfil .nome').forEach((el) => {
                if (el.textContent !== nome) {
                    el.textContent = nome;
                }
            });
        }

        if (rotuloPerfil) {
            raiz.querySelectorAll('.tipo-usuario').forEach((el) => {
                if (el.textContent !== rotuloPerfil) {
                    el.textContent = rotuloPerfil;
                }
            });
        }

        const currentPath = window.location.pathname.toLowerCase();
        raiz.querySelectorAll('.opcao[href]').forEach((link) => {
            try {
                if (new URL(link.href, window.location.href).pathname.toLowerCase() === currentPath) {
                    if (!link.classList.contains('active')) {
                        link.classList.add('active');
                    }
                }
            } catch {
                // Ignora href inválido
            }
        });

        raiz.querySelectorAll('.btn-perfil').forEach((botao) => {
            if (!botao.getAttribute('onclick') && !botao.dataset.perfilBound) {
                botao.dataset.perfilBound = '1';
                botao.addEventListener('click', () => {
                    const destino = (perfil === '4' || currentPath.includes('/dashboard/streamer/'))
                        ? '/Dashboard/Streamer/Perfil.html'
                        : '/Dashboard/Desenvolvedor/Perfil.html';
                    window.location.href = destino;
                });
            }
        });
    } catch (erro) {
        console.error('Erro ao atualizar usuário na sidebar:', erro);
    }
};

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

    const idUsuario = sessionStorage.ID_USUARIO || 0;

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
        window.atualizarUsuarioSidebar(host);
        const panel = host.querySelector('#barraNotificacoes');
        if (panel) panel.dataset.notificacoesInit = '1';
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

if (typeof window.abrirMenuMobile !== 'function') {
    window.abrirMenuMobile = () => {
        document.querySelector('#sidebar .left-container, #profile-sidebar .left-container')?.classList.add('menu-aberto');
        document.querySelector('#sidebar .fundo-menu, #profile-sidebar .fundo-menu')?.classList.add('menu-aberto');
    };
}

if (typeof window.fecharMenuMobile !== 'function') {
    window.fecharMenuMobile = () => {
        document.querySelector('#sidebar .left-container, #profile-sidebar .left-container')?.classList.remove('menu-aberto');
        document.querySelector('#sidebar .fundo-menu, #profile-sidebar .fundo-menu')?.classList.remove('menu-aberto');
    };
}

(function iniciarObservadorSidebar() {
    let atualizandoSidebar = false;

    function sincronizarSidebar(sidebar) {
        if (!sidebar || atualizandoSidebar) return;
        atualizandoSidebar = true;
        try {
            window.atualizarUsuarioSidebar(sidebar);
            const panel = sidebar.querySelector('#barraNotificacoes');
            if (panel && !panel.dataset.notificacoesInit) {
                panel.dataset.notificacoesInit = '1';
                window.carregarNotificacoes(false);
            }
        } catch (erro) {
            console.error('Erro ao sincronizar sidebar:', erro);
        } finally {
            atualizandoSidebar = false;
        }
    }

    function observarSidebar() {
        try {
            window.atualizarUsuarioSidebar(document);
            const sidebar = document.getElementById('sidebar');
            if (!sidebar || sidebar.dataset.observerAttached) return;

            sidebar.dataset.observerAttached = '1';
            sincronizarSidebar(sidebar);

            const observer = new MutationObserver((mutations) => {
                const alterouFilhosDiretos = mutations.some(
                    (m) => m.type === 'childList' && m.target === sidebar
                );
                if (alterouFilhosDiretos) {
                    sincronizarSidebar(sidebar);
                }
            });
            observer.observe(sidebar, { childList: true });
        } catch (erro) {
            console.error('Erro ao iniciar observador da sidebar:', erro);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observarSidebar);
    } else {
        observarSidebar();
    }
})();
