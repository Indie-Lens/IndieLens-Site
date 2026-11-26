let prototipos = [];

const grid = document.getElementById("grid");
const vazio = document.getElementById("vazio");
const modal = document.getElementById("modal");
const form = document.getElementById("form");
const modalTitulo = document.getElementById("modalTitulo");

// Elementos do popup de análise
const modalAnalise = document.getElementById("modalAnalise");
const analiseNome = document.getElementById("analiseNome");
const analiseGenero = document.getElementById("analiseGenero");
const analisePreco = document.getElementById("analisePreco");
const analiseData = document.getElementById("analiseData");
const analiseTag = document.getElementById("analiseTag");

const listaJogosParecidos = document.getElementById("listaJogosParecidos");
const quantidadeJogos = document.getElementById("quantidadeJogos");

let editandoId = null;

function obterIdUsuario() {
    return sessionStorage.ID_USUARIO;
}

function formatarPreco(preco) {
    if (preco === "" || preco === null || preco === undefined) {
        return "-";
    }

    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(data) {
    if (!data) return "-";

    const partes = String(data).slice(0, 10).split("-");

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

async function extrairMensagemErro(res, fallback) {
    try {
        const texto = await res.text();
        if (!texto) return fallback;
        try {
            const json = JSON.parse(texto);
            return json.erro || json.message || fallback;
        } catch {
            return texto;
        }
    } catch {
        return fallback;
    }
}

function buscarPorId(id) {
    return prototipos.find((item) => Number(item.id) === Number(id)) || null;
}

function carregar() {
    const idUsuario = obterIdUsuario();
    if (!idUsuario) {
        prototipos = [];
        grid.innerHTML = "";
        vazio.textContent = "Sessão não encontrada. Faça login para visualizar suas simulações.";
        vazio.hidden = false;
        return;
    }

    vazio.textContent = "Carregando simulações...";
    vazio.hidden = false;

    fetch(`/simularJogo/listar/${encodeURIComponent(idUsuario)}`)
        .then(async (res) => {
            if (!res.ok) {
                throw new Error(await extrairMensagemErro(res, "Erro ao listar simulações."));
            }
            return res.json();
        })
        .then((dados) => {
            prototipos = Array.isArray(dados) ? dados : [];
            renderizar();
        })
        .catch((erro) => {
            console.log(erro);
            prototipos = [];
            grid.innerHTML = "";
            vazio.textContent = "Não foi possível carregar suas simulações.";
            vazio.hidden = false;
        });
}

function abrirModal(prototipo = null) {
    if (!obterIdUsuario()) {
        alert("Sessão não encontrada. Faça login novamente.");
        window.location.href = "/login.html";
        return;
    }

    editandoId = prototipo ? prototipo.id : null;
    modalTitulo.textContent = prototipo ? "Editar Jogo" : "Cadastrar Jogo";

    form.reset();

    if (prototipo) {
        if (form.elements.nome) form.elements.nome.value = prototipo.nome ?? "";
        if (form.elements.preco) form.elements.preco.value = prototipo.preco ?? "";
        if (form.elements.data) form.elements.data.value = prototipo.data ? String(prototipo.data).slice(0, 10) : "";
        if (form.elements.tag) form.elements.tag.value = prototipo.tag ?? "";
        if (form.elements.genero) form.elements.genero.value = prototipo.genero ?? "";
    }

    modal.hidden = false;
}

function fecharModal() {
    editandoId = null;
    form.reset();
    modal.hidden = true;
}

function criarCard(p) {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
        <h3 class="card-titulo"></h3>

        <div class="card-info">
            <div>Preço: <span class="preco"></span></div>
            <div>Data: <span class="data"></span></div>
            <div>Tag: <span class="tag"></span></div>
            <div>Gênero: <span class="genero"></span></div>
        </div>

        <div class="card-acoes">
            <button type="button" title="Ver análise"
                data-ver="${p.id}">👁</button>

            <button type="button" title="Editar"
                data-editar="${p.id}">✎</button>

            <button type="button" title="Excluir"
                data-excluir="${p.id}">🗑</button>
        </div>
    `;

    card.querySelector(".card-titulo").textContent = p.nome;
    card.querySelector(".preco").textContent = formatarPreco(p.preco);
    card.querySelector(".data").textContent = formatarData(p.data);
    card.querySelector(".tag").textContent = p.tag;
    card.querySelector(".genero").textContent = p.genero;

    return card;
}

function renderizar() {
    grid.innerHTML = "";
    vazio.textContent = "Nenhum protótipo cadastrado ainda.";
    vazio.hidden = prototipos.length > 0;

    prototipos.forEach((p) => {
        grid.appendChild(criarCard(p));
    });
}

function criarJogoParecido(jogo) {
    const item = document.createElement("article");
    item.className = "jogo-parecido";

    const informacoes = document.createElement("div");

    const genero = document.createElement("span");
    genero.className = "jogo-genero";
    genero.textContent = jogo.genero || "";

    const nome = document.createElement("h4");
    nome.textContent = jogo.nome || "";

    informacoes.append(genero, nome);

    if (jogo.descricao) {
        const descricao = document.createElement("p");
        descricao.textContent = jogo.descricao;
        informacoes.appendChild(descricao);
    }

    const tag = document.createElement("span");
    tag.className = "jogo-tag";
    tag.textContent = jogo.tag || "";
    informacoes.appendChild(tag);

    if (jogo.data) {
        const data = document.createElement("span");
        data.className = "jogo-data";
        data.textContent = "Lançamento: " + formatarData(jogo.data);
        informacoes.appendChild(data);
    }

    const preco = document.createElement("span");
    preco.className = "jogo-preco";
    preco.textContent = formatarPreco(jogo.preco);

    item.append(informacoes, preco);

    return item;
}

function abrirAnalise(id) {
    const prototipo = buscarPorId(id);

    if (!prototipo) return;

    analiseNome.textContent = prototipo.nome;
    analiseGenero.textContent = prototipo.genero;
    analisePreco.textContent = formatarPreco(prototipo.preco);
    analiseData.textContent = formatarData(prototipo.data);
    analiseTag.textContent = prototipo.tag;

    listaJogosParecidos.innerHTML = "";
    quantidadeJogos.textContent = "carregando...";
    modalAnalise.hidden = false;
    document.getElementById("fecharAnalise").focus();

    fetch(`/simularJogo/semelhantes?genero=${encodeURIComponent(prototipo.genero || "")}&tag=${encodeURIComponent(prototipo.tag || "")}`)
        .then(async (res) => {
            if (!res.ok) {
                throw new Error(await extrairMensagemErro(res, "Erro ao buscar jogos semelhantes."));
            }
            return res.json();
        })
        .then((jogos) => {
            const lista = Array.isArray(jogos) ? jogos : [];
            quantidadeJogos.textContent =
                lista.length + (lista.length === 1 ? " jogo" : " jogos");

            if (lista.length === 0) {
                listaJogosParecidos.innerHTML = "<p>Nenhum jogo semelhante encontrado.</p>";
                return;
            }

            lista.forEach((jogo) => {
                listaJogosParecidos.appendChild(criarJogoParecido(jogo));
            });
        })
        .catch((erro) => {
            console.log(erro);
            quantidadeJogos.textContent = "erro";
            listaJogosParecidos.innerHTML = "<p>Não foi possível carregar os jogos semelhantes.</p>";
        });
}

function fecharAnalise() {
    modalAnalise.hidden = true;
}

function deletar(id) {
    if (!confirm("Excluir este protótipo?")) return;

    fetch(`/simularJogo/deletar/${id}`, { method: "DELETE" })
        .then(async (res) => {
            if (!res.ok) {
                throw new Error(await extrairMensagemErro(res, "Erro ao excluir o protótipo."));
            }
            carregar();
        })
        .catch((erro) => {
            console.log(erro);
            alert(erro.message || "Não foi possível excluir o protótipo.");
        });
}

document.getElementById("btnCadastrar").onclick = () => abrirModal(null);

document.getElementById("btnCancelar").onclick = fecharModal;

form.onsubmit = (e) => {
    e.preventDefault();

    const idUsuario = obterIdUsuario();
    if (!idUsuario) {
        alert("Sessão não encontrada. Faça login novamente.");
        window.location.href = "/login.html";
        return;
    }

    const dados = Object.fromEntries(new FormData(form));
    const corpo = {
        idUsuario: Number(idUsuario),
        nome: String(dados.nome || "").trim(),
        preco: Number(dados.preco),
        data: String(dados.data || ""),
        tag: String(dados.tag || "").trim(),
        genero: String(dados.genero || "").trim()
    };

    const url = editandoId ? `/simularJogo/atualizar/${editandoId}` : "/simularJogo/cadastrar";
    const metodo = editandoId ? "PUT" : "POST";

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    })
        .then(async (res) => {
            if (!res.ok) {
                throw new Error(await extrairMensagemErro(res, "Não foi possível salvar o jogo."));
            }
            fecharModal();
            carregar();
        })
        .catch((erro) => {
            console.log(erro);
            alert(erro.message || "Não foi possível salvar o jogo.");
        });
};

grid.onclick = (e) => {
    const botao = e.target.closest("button");

    if (!botao) return;

    const { excluir, ver, editar } = botao.dataset;

    if (excluir !== undefined) {
        deletar(Number(excluir));
        return;
    }

    if (editar !== undefined) {
        abrirModal(buscarPorId(Number(editar)));
        return;
    }

    if (ver !== undefined) {
        abrirAnalise(Number(ver));
    }
};

// Fechar popup pelos botões
document.getElementById("fecharAnalise").onclick = fecharAnalise;

document.getElementById("fecharAnaliseRodape").onclick = fecharAnalise;

// Fechar clicando fora da janela
modalAnalise.addEventListener("click", (e) => {
    if (e.target === modalAnalise) {
        fecharAnalise();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (!modalAnalise.hidden) {
            fecharAnalise();
        } else if (!modal.hidden) {
            fecharModal();
        }
    }
});

carregar();
