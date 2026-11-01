window.loadDashboardSidebar = async (host, source) => {
    if (!host) return;
    try {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`Sidebar request failed: ${response.status}`);
        host.innerHTML = await response.text();
        const currentPath = window.location.pathname.replace(/\/$/, '').toLowerCase();
        host.querySelectorAll('.opcao[href]').forEach((link) => {
            const linkPath = new URL(link.href, window.location.href).pathname.replace(/\/$/, '').toLowerCase();
            if (linkPath === currentPath) link.classList.add('active');
        });
    } catch (error) {
        console.error('Não foi possível carregar a navegação.', error);
    }
};

window.abrirNotificacoes = () => {
    const panel = document.getElementById('barraNotificacoes');
    if (panel) panel.style.display = 'block';
};

window.fecharNotificacoes = () => {
    const panel = document.getElementById('barraNotificacoes');
    if (panel) panel.style.display = 'none';
};
