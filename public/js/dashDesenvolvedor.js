let prototipos = [];

const grid = document.getElementById("grid");
const vazio = document.getElementById("vazio");
const modal = document.getElementById("modal");
const form = document.getElementById("form");
const modalTitulo = document.getElementById("modalTitulo");

let editandoId = null;

function obterIdUsuario() {
    return sessionStorage.ID_USUARIO;
}

function parseValorMonetario(valor) {
    if (typeof valor === "number") return Number.isFinite(valor) ? valor : NaN;
    const texto = String(valor || "").trim().toLowerCase();
    if (!texto) return NaN;

    const multiplicador = texto.endsWith("k") ? 1000 : 1;
    let limpo = texto.replace(/[^\d,.-]/g, "");
    if (!limpo) return NaN;
    if (limpo.includes(",")) {
        limpo = limpo.replace(/\./g, "").replace(",", ".");
    }
    const numero = Number(limpo) * multiplicador;
    return Number.isFinite(numero) ? Number(numero.toFixed(2)) : NaN;
}

function formatarPreco(valor) {
    if (valor === "" || valor === null || valor === undefined || Number.isNaN(Number(valor))) {
        return "—";
    }
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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
        if (form.elements.genero) form.elements.genero.value = prototipo.genero ?? "";
        if (form.elements.orcamento) form.elements.orcamento.value = prototipo.orcamento ?? prototipo.preco ?? "";
        if (form.elements.preco) form.elements.preco.value = prototipo.preco ?? "";
        if (form.elements.data) form.elements.data.value = prototipo.data ? String(prototipo.data).slice(0, 10) : "";
        if (form.elements.tag) form.elements.tag.value = prototipo.tag ?? "";
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
            <div>Gênero: <span class="genero"></span></div>
            <div>Orçamento / Preço: <span class="orcamento"></span></div>
        </div>
        <div class="card-acoes">
            <button type="button" title="Ver" data-ver="${p.id}">👁</button>
            <button type="button" title="Editar" data-editar="${p.id}">✎</button>
            <button type="button" title="Excluir" data-excluir="${p.id}">🗑</button>
        </div>`;

    card.querySelector(".card-titulo").textContent = p.nome;
    card.querySelector(".genero").textContent = p.genero;
    card.querySelector(".orcamento").textContent = formatarPreco(p.orcamento ?? p.preco);
    return card;
}

function renderizar() {
    grid.innerHTML = "";
    vazio.textContent = "Nenhum protótipo cadastrado ainda.";
    prototipos.forEach((p) => grid.appendChild(criarCard(p)));
    vazio.hidden = prototipos.length > 0;
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
    const existente = editandoId ? buscarPorId(editandoId) : null;
    const preco = parseValorMonetario(dados.preco ?? dados.orcamento);

    if (Number.isNaN(preco) || preco < 0) {
        alert("Informe um valor numérico válido para orçamento/preço.");
        return;
    }

    const corpo = {
        idUsuario: Number(idUsuario),
        nome: String(dados.nome || "").trim(),
        preco,
        data: String(dados.data || (existente && existente.data) || new Date().toISOString().slice(0, 10)),
        tag: String(dados.tag ?? (existente && existente.tag) ?? "").trim(),
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
        console.log("Ver dashboard de:", buscarPorId(Number(ver)));
    }
};

carregar();