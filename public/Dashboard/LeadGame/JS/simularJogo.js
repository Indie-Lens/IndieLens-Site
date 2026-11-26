var grid = document.getElementById("grid");
var vazio = document.getElementById("vazio");
var modal = document.getElementById("modal");
var form = document.getElementById("form");
var modalTitulo = document.getElementById("modalTitulo");
var modalAnalise = document.getElementById("modalAnalise");

let prototipos = [];
let editandoId = null;

function obterIdUsuario() {
    return sessionStorage.ID_USUARIO;
}

function escrita(texto) {
    var div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function formatarPreco(valor) {
    if (valor === "" || valor === null || valor === undefined) {
        return "-";
    }
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(dataTexto) {
    if (!dataTexto) return "-";
    var partes = String(dataTexto).slice(0, 10).split("-");
    if (partes.length !== 3) return dataTexto;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

async function extrairMensagemErro(res, fallback) {
    try {
        var texto = await res.text();
        if (!texto) return fallback;
        try {
            var json = JSON.parse(texto);
            return json.erro || json.message || fallback;
        } catch {
            return texto;
        }
    } catch {
        return fallback;
    }
}

function carregar() {
    var idUsuario = obterIdUsuario();
    if (!idUsuario) {
        prototipos = [];
        grid.innerHTML = "";
        vazio.textContent = "Sessão não encontrada. Faça login novamente para visualizar suas simulações.";
        vazio.hidden = false;
        return;
    }

    vazio.textContent = "Carregando simulações...";
    vazio.hidden = false;

    fetch(`/simularJogo/listar/${encodeURIComponent(idUsuario)}`)
        .then(async res => {
            if (!res.ok) {
                throw new Error(await extrairMensagemErro(res, "Erro ao listar simulações."));
            }
            return res.json();
        })
        .then(dados => {
            prototipos = Array.isArray(dados) ? dados : [];
            renderizar();
        })
        .catch(erro => {
            console.log(erro);
            prototipos = [];
            grid.innerHTML = "";
            vazio.textContent = "Não foi possível carregar suas simulações no momento.";
            vazio.hidden = false;
        });
}

function renderizar() {
    grid.innerHTML = "";
    vazio.textContent = "Nenhum protótipo cadastrado ainda.";
    vazio.hidden = prototipos.length > 0;

    for (let i = 0; i < prototipos.length; i++) {
        var p = prototipos[i];

        var card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
            <h3 class="card-titulo">${escrita(p.nome)}</h3>

            <div class="card-info">
                <div>Preço: <span class="preco">${formatarPreco(p.preco)}</span></div>
                <div>Data: <span class="data">${formatarData(p.data)}</span></div>
                <div>Tag: <span class="tag">${escrita(p.tag)}</span></div>
                <div>Gênero: <span class="genero">${escrita(p.genero)}</span></div>
            </div>

            <div class="card-acoes">
                <button type="button" title="Ver análise" data-ver="${p.id}">👁</button>
                <button type="button" title="Editar" data-editar="${p.id}">✎</button>
                <button type="button" title="Excluir" data-excluir="${p.id}">🗑</button>
            </div>
        `;
        grid.appendChild(card);
    }
}

function buscarPorId(id) {
    for (let i = 0; i < prototipos.length; i++) {
        if (Number(prototipos[i].id) === Number(id)) {
            return prototipos[i];
        }
    }
    return null;
}

grid.addEventListener("click", evento => {
    var botao = evento.target.closest("button");
    if (!botao) return;

    var { ver, editar, excluir } = botao.dataset;

    if (excluir !== undefined) {
        deletar(Number(excluir));
        return;
    }

    if (editar !== undefined) {
        abrirModal(buscarPorId(Number(editar)));
        return;
    }

    if (ver !== undefined) {
        abrirAnalise(buscarPorId(Number(ver)));
    }
});

function abrirModal(proto) {
    if (!obterIdUsuario()) {
        alert("Sessão não encontrada. Redirecionando para o login.");
        window.location.href = "/login.html";
        return;
    }

    form.reset();
    editandoId = proto ? proto.id : null;
    modalTitulo.textContent = proto ? "Editar Jogo" : "Cadastrar Jogo";

    if (proto) {
        form.nome.value = proto.nome ?? "";
        form.preco.value = proto.preco ?? "";
        form.data.value = proto.data ? String(proto.data).slice(0, 10) : "";
        form.tag.value = proto.tag ?? "";
        form.genero.value = proto.genero ?? "";
    }

    modal.hidden = false;
}

function fecharModal() {
    editandoId = null;
    form.reset();
    modal.hidden = true;
}

document.getElementById("btnCadastrar").addEventListener("click", () => abrirModal(null));
document.getElementById("btnCancelar").addEventListener("click", fecharModal);

form.addEventListener("submit", evento => {
    evento.preventDefault();

    var idUsuario = obterIdUsuario();
    if (!idUsuario) {
        alert("Sessão não encontrada. Redirecionando para o login.");
        window.location.href = "/login.html";
        return;
    }

    var corpo = {
        idUsuario: Number(idUsuario),
        nome: form.nome.value.trim(),
        preco: Number(form.preco.value),
        data: form.data.value,
        tag: form.tag.value.trim(),
        genero: form.genero.value.trim()
    };

    var url = editandoId ? `/simularJogo/atualizar/${editandoId}` : "/simularJogo/cadastrar";
    var metodo = editandoId ? "PUT" : "POST";

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    })
        .then(async res => {
            if (!res.ok) {
                throw new Error(await extrairMensagemErro(res, "Não foi possível salvar o jogo."));
            }
            fecharModal();
            carregar();
        })
        .catch(erro => {
            console.log(erro);
            alert(erro.message || "Não foi possível salvar o jogo.");
        });
});

function deletar(id) {
    if (!confirm("Excluir este protótipo?")) return;

    fetch(`/simularJogo/deletar/${id}`, { method: "DELETE" })
        .then(async res => {
            if (!res.ok) {
                throw new Error(await extrairMensagemErro(res, "Erro ao excluir o protótipo."));
            }
            carregar();
        })
        .catch(erro => {
            console.log(erro);
            alert(erro.message || "Não foi possível excluir o protótipo.");
        });
}

function criarJogoParecido(j) {
    var item = document.createElement("article");
    item.className = "jogo-parecido";

    var descricao = j.descricao ? `<p>${escrita(j.descricao)}</p>` : "";
    var data = j.data ? `<span class="jogo-data">Lançamento: ${formatarData(j.data)}</span>` : "";

    item.innerHTML = `
        <div>
            <span class="jogo-genero">${escrita(j.genero)}</span>
            <h4>${escrita(j.nome)}</h4>
            ${descricao}
            <span class="jogo-tag">${escrita(j.tag)}</span>
            ${data}
        </div>
        <span class="jogo-preco">${formatarPreco(j.preco)}</span>
    `;

    return item;
}

function abrirAnalise(p) {
    if (!p) return;

    document.getElementById("analiseNome").textContent = p.nome;
    document.getElementById("analisePreco").textContent = formatarPreco(p.preco);
    document.getElementById("analiseData").textContent = formatarData(p.data);
    document.getElementById("analiseTag").textContent = p.tag;
    document.getElementById("analiseGenero").textContent = p.genero;

    var lista = document.getElementById("listaJogosParecidos");
    var contador = document.getElementById("quantidadeJogos");
    lista.innerHTML = "";
    contador.textContent = "carregando...";
    modalAnalise.hidden = false;
    document.getElementById("fecharAnalise").focus();

    fetch(`/simularJogo/semelhantes?genero=${encodeURIComponent(p.genero)}&tag=${encodeURIComponent(p.tag)}`)
        .then(res => {
            if (!res.ok) throw new Error("Erro ao buscar semelhantes");
            return res.json();
        })
        .then(jogos => {
            contador.textContent = `${jogos.length} jogo${jogos.length === 1 ? "" : "s"}`;

            if (jogos.length === 0) {
                lista.innerHTML = "<p>Nenhum jogo semelhante encontrado.</p>";
                return;
            }

            for (let i = 0; i < jogos.length; i++) {
                lista.appendChild(criarJogoParecido(jogos[i]));
            }
        })
        .catch(erro => {
            console.log(erro);
            contador.textContent = "erro";
            lista.innerHTML = "<p>Não foi possível carregar os jogos semelhantes.</p>";
        });
}

function fecharAnalise() {
    modalAnalise.hidden = true;
}

document.getElementById("fecharAnalise").addEventListener("click", fecharAnalise);
document.getElementById("fecharAnaliseRodape").addEventListener("click", fecharAnalise);

modalAnalise.addEventListener("click", e => {
    if (e.target === modalAnalise) {
        fecharAnalise();
    }
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        if (!modalAnalise.hidden) {
            fecharAnalise();
        } else if (!modal.hidden) {
            fecharModal();
        }
    }
});

carregar();