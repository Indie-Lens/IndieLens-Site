
let prototipos = JSON.parse(localStorage.getItem("prototipos") || "[]");

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

let editando = null;

// JOGOS DE REFERÊNCIA DEMONSTRATIVOS
const jogosMockados = [
    {
        nome: "Hollow Knight",
        preco: 46.99,
        data: "2017-02-24",
        tag: "Indie, Exploração",
        genero: "Metroidvania",
        descricao: "Exploração, combate e progressão em um mundo interconectado."
    },
    {
        nome: "Dead Cells",
        preco: 49.99,
        data: "2018-08-07",
        tag: "Indie, Roguelike",
        genero: "Roguelike / Ação",
        descricao: "Combate rápido, exploração e fases geradas proceduralmente."
    },
    {
        nome: "Celeste",
        preco: 36.99,
        data: "2018-01-25",
        tag: "Indie, Desafiador",
        genero: "Plataforma",
        descricao: "Plataforma desafiadora com foco em precisão e narrativa."
    },
    {
        nome: "Stardew Valley",
        preco: 24.99,
        data: "2016-02-26",
        tag: "Indie, Relaxante",
        genero: "Simulação / RPG",
        descricao: "Gerenciamento, exploração e evolução de um mundo próprio."
    },
    {
        nome: "Terraria",
        preco: 19.99,
        data: "2011-05-16",
        tag: "Sandbox, Aventura",
        genero: "Sandbox / Aventura",
        descricao: "Construção, exploração, criação de itens e combate."
    },
    {
        nome: "Undertale",
        preco: 19.99,
        data: "2015-09-15",
        tag: "Indie, Narrativo",
        genero: "RPG",
        descricao: "Narrativa marcante, personagens e escolhas do jogador."
    },
    {
        nome: "Cuphead",
        preco: 59.99,
        data: "2017-09-29",
        tag: "Indie, Desafiador",
        genero: "Plataforma / Ação",
        descricao: "Combates contra chefes com identidade visual própria."
    },
    {
        nome: "Slay the Spire",
        preco: 47.99,
        data: "2019-01-23",
        tag: "Indie, Estratégia",
        genero: "Estratégia / Cartas",
        descricao: "Construção de baralhos e decisões estratégicas a cada partida."
    },
    {
        nome: "Among Us",
        preco: 13.99,
        data: "2018-11-16",
        tag: "Multiplayer, Social",
        genero: "Multiplayer / Social",
        descricao: "Interação entre jogadores, dedução e partidas em grupo."
    },
    {
        nome: "Limbo",
        preco: 19.99,
        data: "2010-07-21",
        tag: "Indie, Atmosférico",
        genero: "Puzzle / Plataforma",
        descricao: "Quebra-cabeças ambientais e atmosfera minimalista."
    }
];

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

    const partes = data.split("-");

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function abrirModal(indice = null) {
    editando = indice;

    modalTitulo.textContent =
        indice === null ? "Cadastrar Jogo" : "Editar Jogo";

    form.reset();

    if (indice !== null) {
        const p = prototipos[indice];

        for (const campo in p) {
            if (form.elements[campo]) {
                form.elements[campo].value = p[campo];
            }
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
            <div>Preço: <span class="preco"></span></div>
            <div>Data: <span class="data"></span></div>
            <div>Tag: <span class="tag"></span></div>
            <div>Gênero: <span class="genero"></span></div>
        </div>

        <div class="card-acoes">
            <button type="button" title="Ver análise"
                data-ver="${indice}">👁</button>

            <button type="button" title="Editar"
                data-editar="${indice}">✎</button>

            <button type="button" title="Excluir"
                data-excluir="${indice}">🗑</button>
        </div>
    `;

    card.querySelector(".card-titulo").textContent = p.nome;
    card.querySelector(".preco").textContent = formatarPreco(p.preco);
    card.querySelector(".data").textContent = formatarData(p.data);
    card.querySelector(".tag").textContent = p.tag;
    card.querySelector(".genero").textContent = p.genero;

    return card;
}

// Atualiza a lista de protótipos
function renderizar() {
    grid.innerHTML = "";

    prototipos.forEach((p, i) => {
        grid.appendChild(criarCard(p, i));
    });

    vazio.hidden = prototipos.length > 0;

    localStorage.setItem("prototipos", JSON.stringify(prototipos));
}


function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Busca jogos semelhantes pelo gênero e pelas tags
function buscarJogosParecidos(prototipo) {
    const generoProjeto = normalizarTexto(prototipo.genero);

    const tagsProjeto = normalizarTexto(prototipo.tag)
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean);

    let encontrados = jogosMockados.filter(jogo => {
        const generoJogo = normalizarTexto(jogo.genero);

        const generoCombina =
            generoJogo.includes(generoProjeto) ||
            generoProjeto.includes(generoJogo);

        const tagsJogo = normalizarTexto(jogo.tag)
            .split(",")
            .map(tag => tag.trim());

        const tagCombina = tagsProjeto.some(tag =>
            tagsJogo.some(tagJogo =>
                tagJogo.includes(tag) || tag.includes(tagJogo)
            )
        );

        return generoCombina || tagCombina;
    });

    // Evita exibir menos de três referências
    // quando não existem correspondências suficientes.
    if (encontrados.length < 3) {
        const restantes = jogosMockados.filter(
            jogo => !encontrados.includes(jogo)
        );

        encontrados = [
            ...encontrados,
            ...restantes
        ];
    }

    return encontrados.slice(0, 3);
}


function criarJogoParecido(jogo) {
    const item = document.createElement("article");
    item.className = "jogo-parecido";

    const informacoes = document.createElement("div");

    const genero = document.createElement("span");
    genero.className = "jogo-genero";
    genero.textContent = jogo.genero;

    const nome = document.createElement("h4");
    nome.textContent = jogo.nome;

    const descricao = document.createElement("p");
    descricao.textContent = jogo.descricao;

    const tag = document.createElement("span");
    tag.className = "jogo-tag";
    tag.textContent = jogo.tag;

    const data = document.createElement("span");
    data.className = "jogo-data";
    data.textContent = "Lançamento: " + formatarData(jogo.data);

    informacoes.append(genero, nome, descricao, tag, data);

    const preco = document.createElement("span");
    preco.className = "jogo-preco";
    preco.textContent = formatarPreco(jogo.preco);

    item.append(informacoes, preco);

    return item;
}


function abrirAnalise(indice) {
    const prototipo = prototipos[indice];

    if (!prototipo) return;

    analiseNome.textContent = prototipo.nome;
    analiseGenero.textContent = prototipo.genero;
    analisePreco.textContent = formatarPreco(prototipo.preco);
    analiseData.textContent = formatarData(prototipo.data);
    analiseTag.textContent = prototipo.tag;

    const jogos = buscarJogosParecidos(prototipo);

    listaJogosParecidos.innerHTML = "";

    jogos.forEach(jogo => {
        listaJogosParecidos.appendChild(criarJogoParecido(jogo));
    });

    quantidadeJogos.textContent =
        jogos.length + (jogos.length === 1 ? " jogo" : " jogos");

    modalAnalise.hidden = false;

    document.getElementById("fecharAnalise").focus();
}


function fecharAnalise() {
    modalAnalise.hidden = true;
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
    const botao = e.target.closest("button");

    if (!botao) return;

    const { excluir, ver, editar } = botao.dataset;

    if (excluir !== undefined) {
        prototipos.splice(Number(excluir), 1);
        renderizar();
        return;
    }

    if (editar !== undefined) {
        abrirModal(Number(editar));
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

renderizar();
