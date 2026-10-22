let prototipos = JSON.parse(localStorage.getItem("prototipos") || "[]");

const grid = document.getElementById("grid");
const vazio = document.getElementById("vazio");
const modal = document.getElementById("modal");
const form = document.getElementById("form");
const modalTitulo = document.getElementById("modalTitulo");

let editando = null;

function abrirModal(indice = null) {
    editando = indice;
    modalTitulo.textContent = indice === null ? "Cadastrar Jogo" : "Editar Jogo";
    if (indice !== null) {
        const p = prototipos[indice];
        for (const campo in p) {
            if (form.elements[campo]) form.elements[campo].value = p[campo];
        }
    }
    modal.hidden = false;
}

function fecharModal() {
    editando = null;
    form.reset();
    modal.hidden = true;
}

function criarCard(p, indice) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
        <h3 class="card-titulo"></h3>
        <div class="card-info">
            <div>Genre: <span class="genero"></span></div>
            <div>Budget: <span class="orcamento"></span></div>
        </div>
        <div class="card-acoes">
            <button type="button" title="Ver" data-ver="${indice}">👁</button>
            <button type="button" title="Editar" data-editar="${indice}">✎</button>
            <button type="button" title="Excluir" data-excluir="${indice}">🗑</button>
        </div>`;

    card.querySelector(".card-titulo").textContent = p.nome;
    card.querySelector(".genero").textContent = p.genero;
    card.querySelector(".orcamento").textContent = "$" + p.orcamento;
    return card;
}

function renderizar() {
    grid.innerHTML = "";
    prototipos.forEach((p, i) => grid.appendChild(criarCard(p, i)));
    vazio.hidden = prototipos.length > 0;
    localStorage.setItem("prototipos", JSON.stringify(prototipos));
}

document.getElementById("btnCadastrar").onclick = () => abrirModal();
document.getElementById("btnCancelar").onclick = fecharModal;

form.onsubmit = (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    if (editando === null) {
        prototipos.push(dados);
    } else {
        prototipos[editando] = dados;
    }
    fecharModal();
    renderizar();
};

grid.onclick = (e) => {
    const { excluir, ver, editar } = e.target.dataset;
    if (excluir !== undefined) {
        prototipos.splice(Number(excluir), 1);
        renderizar();
    }
    if (editar !== undefined) {
        abrirModal(Number(editar));
    }
    if (ver !== undefined) {
        console.log("Ver dashboard de:", prototipos[Number(ver)]);
    }
};

renderizar();