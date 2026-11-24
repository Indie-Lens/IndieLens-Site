
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

        var idUsuario = sessionStorage.ID_USUARIO || 1;

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
