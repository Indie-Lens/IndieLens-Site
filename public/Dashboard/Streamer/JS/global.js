(function verificarAcessoPerfil() {
    try {
        var perfil = String(sessionStorage.getItem("PERFIL_USUARIO") || "").trim();
        var path = window.location.pathname.toLowerCase();

        if (perfil === "4" && (path.includes("/dashboard/leadgame/") || path.includes("/dashboard/desenvolvedor/"))) {
            window.location.replace("/Dashboard/Streamer/DashboardGeral.html");
        } else if (perfil === "3" && path.includes("/dashboard/streamer/")) {
            window.location.replace("/Dashboard/LeadGame/dashPrincipalLead.html");
        }
    } catch (erro) {
        console.error("Erro ao verificar acesso do perfil:", erro);
    }
})();

var ROTULOS_PERFIL_STREAMER = {
    "1": "Teste",
    "2": "Admin",
    "3": "Lead Game",
    "4": "Streamer"
};

function atualizarDadosUsuarioSidebar(escopo) {
    try {
        var raiz = escopo && typeof escopo.querySelectorAll === "function" ? escopo : document;
        var nome = (sessionStorage.getItem("NOME_USUARIO") || "").trim();
        var perfil = String(sessionStorage.getItem("PERFIL_USUARIO") || "").trim();
        var rotuloPerfil = ROTULOS_PERFIL_STREAMER[perfil];

        if (nome) {
            raiz.querySelectorAll(".nome-usuario").forEach(function (el) {
                if (el.textContent !== nome) {
                    el.textContent = nome;
                }
            });
            document.querySelectorAll(".acoes-usuario .perfil .nome, .topo-direita .perfil .nome").forEach(function (el) {
                if (el.textContent !== nome) {
                    el.textContent = nome;
                }
            });
        }

        if (rotuloPerfil) {
            raiz.querySelectorAll(".tipo-usuario").forEach(function (el) {
                if (el.textContent !== rotuloPerfil) {
                    el.textContent = rotuloPerfil;
                }
            });
        }

        var currentPath = window.location.pathname.toLowerCase();
        raiz.querySelectorAll(".opcao[href]").forEach(function (link) {
            try {
                if (new URL(link.href, window.location.href).pathname.toLowerCase() === currentPath) {
                    if (!link.classList.contains("active")) {
                        link.classList.add("active");
                    }
                }
            } catch (erro) {
                // Ignora href inválido
            }
        });

        raiz.querySelectorAll(".btn-perfil").forEach(function (botao) {
            if (!botao.getAttribute("onclick") && !botao.dataset.perfilBound) {
                botao.dataset.perfilBound = "1";
                botao.addEventListener("click", function () {
                    var destino = perfil === "3"
                        ? "/Dashboard/Desenvolvedor/Perfil.html"
                        : "/Dashboard/Streamer/Perfil.html";
                    window.location.href = destino;
                });
            }
        });
    } catch (erro) {
        console.error("Erro ao atualizar dados da sidebar:", erro);
    }
}

function alterarGenero() {
    var genero = document.getElementById("generoSelecionado").value;
    if (genero == "Aventura") {
        document.getElementById("barra1").style.width = "12%";
        document.getElementById("barra2").style.width = "87%";
        document.getElementById("barra3").style.width = "26%";
        document.getElementById("barra4").style.width = "5%";
        document.getElementById("posicao1").innerHTML = "12º";
        document.getElementById("posicao2").innerHTML = "87º";
        document.getElementById("posicao3").innerHTML = "26º";
        document.getElementById("posicao4").innerHTML = "5º";
    } else if (genero == "RPG") {
        document.getElementById("barra1").style.width = "35%";
        document.getElementById("barra2").style.width = "62%";
        document.getElementById("barra3").style.width = "18%";
        document.getElementById("barra4").style.width = "42%";
        document.getElementById("posicao1").innerHTML = "35º";
        document.getElementById("posicao2").innerHTML = "62º";
        document.getElementById("posicao3").innerHTML = "18º";
        document.getElementById("posicao4").innerHTML = "42º";
    } else if (genero == "Ação") {
        document.getElementById("barra1").style.width = "56%";
        document.getElementById("barra2").style.width = "23%";
        document.getElementById("barra3").style.width = "72%";
        document.getElementById("barra4").style.width = "15%";
        document.getElementById("posicao1").innerHTML = "56º";
        document.getElementById("posicao2").innerHTML = "23º";
        document.getElementById("posicao3").innerHTML = "72º";
        document.getElementById("posicao4").innerHTML = "15º";
    } else if (genero == "Puzzle") {
        document.getElementById("barra1").style.width = "22%";
        document.getElementById("barra2").style.width = "14%";
        document.getElementById("barra3").style.width = "48%";
        document.getElementById("barra4").style.width = "31%";
        document.getElementById("posicao1").innerHTML = "22º";
        document.getElementById("posicao2").innerHTML = "14º";
        document.getElementById("posicao3").innerHTML = "48º";
        document.getElementById("posicao4").innerHTML = "31º";
    } else if (genero == "Simulação") {
        document.getElementById("barra1").style.width = "41%";
        document.getElementById("barra2").style.width = "52%";
        document.getElementById("barra3").style.width = "29%";
        document.getElementById("barra4").style.width = "9%";
        document.getElementById("posicao1").innerHTML = "41º";
        document.getElementById("posicao2").innerHTML = "52º";
        document.getElementById("posicao3").innerHTML = "29º";
        document.getElementById("posicao4").innerHTML = "9º";
    }
}

function escaparTextoNotificacao(texto) {
    var div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function carregarNotificacoes(marcarLidasAoAbrir) {
    var panel = document.getElementById("barraNotificacoes");
    if (!panel) return;

    var container = document.getElementById("listaNotificacoes");
    if (!container) {
        panel.querySelectorAll(".notificacao").forEach(function (elemento) { elemento.remove(); });
        container = document.createElement("div");
        container.id = "listaNotificacoes";
        panel.appendChild(container);
    }

    var idUsuario = sessionStorage.ID_USUARIO || 0;

    fetch("/notificacoes/listar/" + idUsuario)
        .then(function (res) {
            if (!res.ok) throw new Error("Erro ao buscar notificações");
            return res.json();
        })
        .then(function (notificacoes) {
            container.innerHTML = "";

            if (!Array.isArray(notificacoes) || notificacoes.length === 0) {
                container.innerHTML =
                    '<div class="notificacao">' +
                        "<h3>Sem notificações</h3>" +
                        "<p>Você não possui notificações no momento.</p>" +
                    "</div>";
                return;
            }

            notificacoes.forEach(function (n) {
                var jaLida = Number(n.lida) === 1;
                var item = document.createElement("div");
                item.className = "notificacao";
                item.dataset.id = n.id_notificacao;
                if (jaLida) {
                    item.style.opacity = "0.6";
                }

                item.innerHTML =
                    "<h3>" + escaparTextoNotificacao(n.titulo) + "</h3>" +
                    "<p>" + escaparTextoNotificacao(n.mensagem) + "</p>" +
                    "<span>" + escaparTextoNotificacao(n.tipo) + "</span>";
                container.appendChild(item);

                if (marcarLidasAoAbrir && !jaLida && n.id_usuario != null) {
                    fetch("/notificacoes/ler/" + n.id_notificacao, { method: "PUT" })
                        .catch(function (erro) { console.log(erro); });
                }
            });
        })
        .catch(function (erro) {
            console.log(erro);
            container.innerHTML =
                '<div class="notificacao">' +
                    "<h3>Indisponível</h3>" +
                    "<p>Não foi possível carregar as notificações.</p>" +
                "</div>";
        });
}

function abrirNotificacoes() {
    var panel = document.getElementById("barraNotificacoes");
    if (panel) {
        panel.style.display = "block";
        panel.classList.add("notificacoes-abertas");
    }
    carregarNotificacoes(true);
}

function fecharNotificacoes() {
    var panel = document.getElementById("barraNotificacoes");
    if (panel) {
        panel.style.display = "none";
        panel.classList.remove("notificacoes-abertas");
    }
}

if (typeof window.abrirMenuMobile !== "function") {
    window.abrirMenuMobile = function () {
        var sidebar = document.querySelector("#sidebar .left-container, #profile-sidebar .left-container");
        var fundo = document.querySelector("#sidebar .fundo-menu, #profile-sidebar .fundo-menu");
        if (sidebar) sidebar.classList.add("menu-aberto");
        if (fundo) fundo.classList.add("menu-aberto");
    };
}

if (typeof window.fecharMenuMobile !== "function") {
    window.fecharMenuMobile = function () {
        var sidebar = document.querySelector("#sidebar .left-container, #profile-sidebar .left-container");
        var fundo = document.querySelector("#sidebar .fundo-menu, #profile-sidebar .fundo-menu");
        if (sidebar) sidebar.classList.remove("menu-aberto");
        if (fundo) fundo.classList.remove("menu-aberto");
    };
}

(function iniciarObservadorSidebarStreamer() {
    var atualizandoSidebar = false;

    function sincronizarSidebar(sidebar) {
        if (!sidebar || atualizandoSidebar) return;
        atualizandoSidebar = true;
        try {
            atualizarDadosUsuarioSidebar(sidebar);
            var panel = sidebar.querySelector("#barraNotificacoes");
            if (panel && !panel.dataset.notificacoesInit) {
                panel.dataset.notificacoesInit = "1";
                carregarNotificacoes(false);
            }
        } catch (erro) {
            console.error("Erro ao sincronizar sidebar:", erro);
        } finally {
            atualizandoSidebar = false;
        }
    }

    function observarSidebar() {
        try {
            atualizarDadosUsuarioSidebar(document);
            var sidebar = document.getElementById("sidebar");
            if (!sidebar || sidebar.dataset.observerAttached) return;

            sidebar.dataset.observerAttached = "1";
            sincronizarSidebar(sidebar);

            var observer = new MutationObserver(function (mutations) {
                var alterouFilhosDiretos = mutations.some(function (m) {
                    return m.type === "childList" && m.target === sidebar;
                });
                if (alterouFilhosDiretos) {
                    sincronizarSidebar(sidebar);
                }
            });
            observer.observe(sidebar, { childList: true });
        } catch (erro) {
            console.error("Erro ao iniciar observador da sidebar:", erro);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", observarSidebar);
    } else {
        observarSidebar();
    }
})();
