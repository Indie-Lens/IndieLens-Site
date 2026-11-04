const sidebarHost = document.getElementById("sidebar");

fetch("./sidebarLeadGame.html")
    .then((response) => {
        if (!response.ok) throw new Error("Não foi possível carregar a navegação do LeadGame.");
        return response.text();
    })
    .then((sidebarMarkup) => {
        sidebarHost.innerHTML = sidebarMarkup;
        const currentPath = window.location.pathname.toLowerCase();
        sidebarHost.querySelectorAll(".opcao[href]").forEach((link) => {
            if (new URL(link.href, window.location.href).pathname.toLowerCase() === currentPath) {
                link.classList.add("active");
            }
        });
    })
    .catch((error) => console.error(error));

window.abrirNotificacoes = () => {
    const panel = document.getElementById("barraNotificacoes");
    if (panel) panel.style.display = "block";
};

window.fecharNotificacoes = () => {
    const panel = document.getElementById("barraNotificacoes");
    if (panel) panel.style.display = "none";
};

window.abrirMenuMobile = () => {
    document.querySelector("#sidebar .left-container")?.classList.add("menu-aberto");
    document.querySelector("#sidebar .fundo-menu")?.classList.add("menu-aberto");
};

window.fecharMenuMobile = () => {
    document.querySelector("#sidebar .left-container")?.classList.remove("menu-aberto");
    document.querySelector("#sidebar .fundo-menu")?.classList.remove("menu-aberto");
};

const dadosPorGenero = {
    "Simulação": [
        { nome: "Stardew Valley", preco: 24.9, aprovacao: 97, donos: 28000000, pico: 94700 },
        { nome: "Dave the Diver", preco: 38.9, aprovacao: 96, donos: 1800000, pico: 9800 },
        { nome: "PowerWash Simulator", preco: 29.9, aprovacao: 94, donos: 2400000, pico: 14000 },
        { nome: "House Flipper", preco: 21.9, aprovacao: 92, donos: 3600000, pico: 17000 },
        { nome: "Potion Craft", preco: 31.9, aprovacao: 90, donos: 820000, pico: 3200 },
        { nome: "Two Point Hospital", preco: 36.9, aprovacao: 88, donos: 1700000, pico: 13000 },
        { nome: "Gas Station Simulator", preco: 34.9, aprovacao: 86, donos: 1200000, pico: 8800 },
        { nome: "Cook, Serve, Delicious! 3?!", preco: 22.9, aprovacao: 82, donos: 280000, pico: 1200 },
        { nome: "Train Station Renovation", preco: 27.9, aprovacao: 77, donos: 190000, pico: 900 },
        { nome: "Youtubers Life 2", preco: 35.9, aprovacao: 63, donos: 110000, pico: 720 }
    ],
    "RPG": [
        { nome: "Baldur's Gate 3", preco: 39.9, aprovacao: 96, donos: 18000000, pico: 875000 },
        { nome: "The Witcher 3: Wild Hunt", preco: 29.9, aprovacao: 95, donos: 50000000, pico: 103000 },
        { nome: "Undertale", preco: 19.9, aprovacao: 94, donos: 12000000, pico: 11000 },
        { nome: "Persona 5 Royal", preco: 38.9, aprovacao: 93, donos: 1800000, pico: 35000 },
        { nome: "Sea of Stars", preco: 34.9, aprovacao: 91, donos: 750000, pico: 8900 },
        { nome: "Disco Elysium", preco: 27.9, aprovacao: 89, donos: 3100000, pico: 5500 },
        { nome: "Octopath Traveler", preco: 39.9, aprovacao: 85, donos: 740000, pico: 4900 },
        { nome: "Pathfinder: Kingmaker", preco: 24.9, aprovacao: 80, donos: 1500000, pico: 12000 },
        { nome: "GreedFall", preco: 31.9, aprovacao: 72, donos: 1200000, pico: 4500 },
        { nome: "Edge Of Eternity", preco: 22.9, aprovacao: 61, donos: 260000, pico: 600 }
    ],
    "Ação": [
        { nome: "Hades", preco: 29.9, aprovacao: 98, donos: 8000000, pico: 54000 },
        { nome: "Dead Cells", preco: 31.9, aprovacao: 97, donos: 6000000, pico: 32000 },
        { nome: "Hollow Knight", preco: 24.9, aprovacao: 96, donos: 10000000, pico: 72000 },
        { nome: "Risk of Rain 2", preco: 36.9, aprovacao: 94, donos: 5000000, pico: 71000 },
        { nome: "Katana ZERO", preco: 27.9, aprovacao: 93, donos: 1400000, pico: 3600 },
        { nome: "Have a Nice Death", preco: 34.9, aprovacao: 88, donos: 280000, pico: 3100 },
        { nome: "Neon Abyss", preco: 22.9, aprovacao: 83, donos: 460000, pico: 2300 },
        { nome: "Rogue Legacy 2", preco: 39.9, aprovacao: 79, donos: 480000, pico: 4200 },
        { nome: "Skeletal Avenger", preco: 21.9, aprovacao: 70, donos: 42000, pico: 210 },
        { nome: "God's Trigger", preco: 25.9, aprovacao: 58, donos: 72000, pico: 180 }
    ],
    "Aventura": [
        { nome: "Outer Wilds", preco: 29.9, aprovacao: 95, donos: 3000000, pico: 17000 },
        { nome: "Firewatch", preco: 24.9, aprovacao: 94, donos: 4300000, pico: 18000 },
        { nome: "A Short Hike", preco: 19.9, aprovacao: 93, donos: 1700000, pico: 2900 },
        { nome: "What Remains of Edith Finch", preco: 22.9, aprovacao: 92, donos: 2000000, pico: 10000 },
        { nome: "Journey", preco: 31.9, aprovacao: 89, donos: 530000, pico: 2400 },
        { nome: "The Pathless", preco: 34.9, aprovacao: 84, donos: 86000, pico: 450 },
        { nome: "Deliver Us The Moon", preco: 36.9, aprovacao: 81, donos: 550000, pico: 2500 },
        { nome: "The Gunk", preco: 27.9, aprovacao: 75, donos: 34000, pico: 160 },
        { nome: "Beyond a Steel Sky", preco: 24.9, aprovacao: 68, donos: 95000, pico: 480 },
        { nome: "XEL", preco: 21.9, aprovacao: 57, donos: 12000, pico: 55 }
    ],
    "Estratégia": [
        { nome: "Slay the Spire", preco: 29.9, aprovacao: 97, donos: 6500000, pico: 57000 },
        { nome: "Into the Breach", preco: 24.9, aprovacao: 96, donos: 1100000, pico: 5000 },
        { nome: "FTL: Faster Than Light", preco: 19.9, aprovacao: 95, donos: 4800000, pico: 12000 },
        { nome: "Against the Storm", preco: 36.9, aprovacao: 93, donos: 530000, pico: 13000 },
        { nome: "Northgard", preco: 34.9, aprovacao: 88, donos: 2400000, pico: 15000 },
        { nome: "Dorfromantik", preco: 27.9, aprovacao: 86, donos: 500000, pico: 4100 },
        { nome: "The Wandering Village", preco: 31.9, aprovacao: 81, donos: 210000, pico: 2800 },
        { nome: "Reus 2", preco: 39.9, aprovacao: 76, donos: 39000, pico: 700 },
        { nome: "Autonauts", preco: 22.9, aprovacao: 69, donos: 260000, pico: 1100 },
        { nome: "The Colonists", preco: 25.9, aprovacao: 60, donos: 73000, pico: 220 }
    ],
    "Terror": [
        { nome: "Phasmophobia", preco: 34.9, aprovacao: 95, donos: 20000000, pico: 112000 },
        { nome: "Little Nightmares II", preco: 36.9, aprovacao: 94, donos: 3200000, pico: 12000 },
        { nome: "Amnesia: The Bunker", preco: 29.9, aprovacao: 92, donos: 610000, pico: 3900 },
        { nome: "SOMA", preco: 24.9, aprovacao: 91, donos: 3600000, pico: 3600 },
        { nome: "Signalis", preco: 31.9, aprovacao: 90, donos: 400000, pico: 3500 },
        { nome: "The Mortuary Assistant", preco: 27.9, aprovacao: 84, donos: 480000, pico: 4100 },
        { nome: "Layers of Fear", preco: 39.9, aprovacao: 78, donos: 1100000, pico: 5500 },
        { nome: "Remothered: Tormented Fathers", preco: 22.9, aprovacao: 72, donos: 300000, pico: 1600 },
        { nome: "Those Who Remain", preco: 25.9, aprovacao: 64, donos: 85000, pico: 170 },
        { nome: "Silver Chains", preco: 21.9, aprovacao: 56, donos: 35000, pico: 90 }
    ]
};

function carregarPrototipos() {
    try {
        const salvos = JSON.parse(localStorage.getItem("prototipos") || "[]");
        return Array.isArray(salvos) ? salvos : [];
    } catch {
        return [];
    }
}

function normalizar(texto) {
    return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function lerPreco(valor) {
    if (typeof valor === "number") return Number.isFinite(valor) ? valor : 0;
    const texto = String(valor || "").trim().replace(/[^\d,.-]/g, "");
    if (texto.includes(",")) return Number(texto.replace(/\./g, "").replace(",", ".")) || 0;
    return Number(texto) || 0;
}

function dadosDoPrototipo(prototipo) {
    const precoInformado = prototipo.preco ?? prototipo.preco_estimado ?? prototipo.preco_sugerido;
    return {
        nome: prototipo.nome || prototipo.nome_projeto || "Protótipo sem nome",
        preco: precoInformado === "" || precoInformado === null || precoInformado === undefined ? null : lerPreco(precoInformado),
        data: prototipo.data || prototipo.data_lancamento || "",
        tag: prototipo.tag || prototipo.tags || "",
        genero: prototipo.genero || prototipo.generos || ""
    };
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarNumero(valor) {
    return Number(valor).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

function formatarCompacto(valor) {
    return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(valor);
}

function preencherSelect(select, opcoes, valorSelecionado) {
    select.replaceChildren();
    opcoes.forEach((opcao, indice) => {
        const option = document.createElement("option");
        option.value = String(indice);
        option.textContent = opcao.label;
        select.append(option);
    });
    select.value = String(valorSelecionado);
}

function detectarGenero(genero) {
    const valor = normalizar(genero);
    if (!valor) return null;
    return Object.keys(dadosPorGenero).find((categoria) => normalizar(categoria) === valor) || null;
}

const listaPrototipos = carregarPrototipos();
const prototipoSelect = document.getElementById("prototipoSelecionado");
const margemPrecoInput = document.getElementById("margemPreco");
const botaoBuscar = document.getElementById("buscarJogos");
const resultados = document.getElementById("resultadosComparacao");
const mensagemPainel = document.getElementById("mensagemPainel");
const temPrototipo = listaPrototipos.length > 0;
const parametros = new URLSearchParams(window.location.search);
const indiceInicial = Number(parametros.get("prototipo"));
let indicePrototipo = Number.isInteger(indiceInicial) && indiceInicial >= 0 && indiceInicial < listaPrototipos.length ? indiceInicial : 0;
let generoAtivo = temPrototipo ? detectarGenero(dadosDoPrototipo(listaPrototipos[indicePrototipo]).genero) : null;

function preencherPrototipos() {
    if (!listaPrototipos.length) {
        const option = document.createElement("option");
        option.textContent = "Nenhum protótipo simulado";
        prototipoSelect.replaceChildren(option);
        return;
    }
    preencherSelect(prototipoSelect, listaPrototipos.map((prototipo, indice) => {
        const dados = dadosDoPrototipo(prototipo);
        return { label: dados.nome, value: indice };
    }), indicePrototipo);
}

function media(lista, campo) {
    if (!lista.length) return 0;
    return lista.reduce((total, item) => total + Number(item[campo] || 0), 0) / lista.length;
}

function criarLinhaBarra(rotulo, valor, maximo, classe) {
    const largura = maximo > 0 ? Math.min((valor / maximo) * 100, 100) : 0;
    return `<div class="linha-barra"><span class="linha-barra-label">${rotulo}</span><div class="trilho-barra"><div class="preenchimento-barra ${classe}" style="width:${largura}%"></div></div><strong>${formatarMoeda(valor)}</strong></div>`;
}

function criarLinhaAprovacao(rotulo, valor, classe) {
    return `<div><div class="aprovacao-cabecalho"><span>${rotulo}</span><strong>${formatarNumero(valor)}%</strong></div><div class="trilho-aprovacao"><div class="preenchimento-aprovacao ${classe}" style="width:${Math.min(valor, 100)}%"></div></div></div>`;
}

function criarCelula(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    elemento.textContent = texto;
    return elemento;
}

function renderizarTabela(lista) {
    const tabela = document.getElementById("tabelaJogos");
    tabela.replaceChildren();
    const ordenados = [...lista].sort((a, b) => b.aprovacao - a.aprovacao);
    const quantidadeMelhores = Math.min(5, Math.ceil(ordenados.length / 2));
    const melhores = ordenados.slice(0, quantidadeMelhores);
    const piores = ordenados.slice(quantidadeMelhores).reverse();
    const linhas = [
        ...melhores.map((jogo) => ({ jogo, grupo: "Maior aprovação", menor: false })),
        ...piores.map((jogo) => ({ jogo, grupo: "Menor aprovação", menor: true }))
    ];

    if (!linhas.length) {
        const linha = document.createElement("tr");
        const celula = criarCelula("td", "", "Nenhum jogo encontrado com esse gênero e preço.");
        celula.colSpan = 6;
        linha.append(celula);
        tabela.append(linha);
    }

    linhas.forEach(({ jogo, grupo, menor }, indice) => {
        const linha = document.createElement("tr");
        const celulaJogo = document.createElement("td");
        const jogoCelula = document.createElement("div");
        jogoCelula.className = "jogo-celula";
        jogoCelula.append(
            criarCelula("span", "jogo-miniatura", jogo.nome.slice(0, 1)),
            (() => {
                const nome = document.createElement("span");
                nome.className = "jogo-nome";
                nome.append(criarCelula("strong", "", jogo.nome), criarCelula("small", "", `${generoAtivo} · referência ${indice + 1}`));
                return nome;
            })()
        );
        celulaJogo.append(jogoCelula);
        linha.append(
            celulaJogo,
            criarCelula("td", "", formatarMoeda(jogo.preco)),
            criarCelula("td", "taxa-avaliacao", `${jogo.aprovacao}%`),
            criarCelula("td", "", formatarCompacto(jogo.donos)),
            criarCelula("td", "", formatarCompacto(jogo.pico))
        );
        const grupoCelula = document.createElement("td");
        grupoCelula.append(criarCelula("span", `grupo-jogo${menor ? " menor" : ""}`, grupo));
        linha.append(grupoCelula);
        tabela.append(linha);
    });
    document.querySelector(".contador-referencias").textContent = `${linhas.length} jogos`;
}

function renderizar() {
    const prototipo = dadosDoPrototipo(listaPrototipos[indicePrototipo]);
    const preco = prototipo.preco;
    const margem = Math.min(100, Math.max(0, Number(margemPrecoInput.value) || 0)) / 100;
    const limiteInferior = preco * (1 - margem);
    const limiteSuperior = preco * (1 + margem);
    const jogosGenero = dadosPorGenero[generoAtivo] || [];
    let recorte = jogosGenero.filter((jogo) => jogo.preco >= limiteInferior && jogo.preco <= limiteSuperior);

    const precoMedio = media(recorte, "preco");
    const aprovacaoMedia = media(recorte, "aprovacao");
    const aprovacaoGenero = media(jogosGenero, "aprovacao");
    const proprietariosMedios = media(recorte, "donos");
    const picoMedio = media(recorte, "pico");
    const diferencaPercentual = precoMedio ? ((preco - precoMedio) / precoMedio) * 100 : 0;
    const escala = Math.max(preco, precoMedio) * 1.18 || 1;

    document.getElementById("nomePrototipo").textContent = prototipo.nome;
    document.getElementById("detalhesPrototipo").textContent = [prototipo.genero, prototipo.tag].filter(Boolean).join(" · ") || "Protótipo simulado";
    document.getElementById("precoPrototipo").textContent = formatarMoeda(preco);
    document.getElementById("precoMedio").textContent = formatarMoeda(precoMedio);
    document.getElementById("tituloRecorte").textContent = `Jogos de ${generoAtivo}`;
    document.getElementById("contextoRecorte").textContent = `Mesmo gênero · até ${formatarNumero(margem * 100)}% de diferença no preço`;
    document.getElementById("qtdJogos").textContent = formatarNumero(recorte.length);
    document.getElementById("mediaAprovacao").textContent = `${formatarNumero(aprovacaoMedia)}%`;
    document.getElementById("mediaProprietarios").textContent = formatarCompacto(proprietariosMedios);
    document.getElementById("mediaPico").textContent = formatarCompacto(picoMedio);
    document.getElementById("diferencaPreco").textContent = diferencaPercentual > 0.05
        ? `+${formatarNumero(diferencaPercentual)}% acima`
        : diferencaPercentual < -0.05
            ? `${formatarNumero(diferencaPercentual)}% abaixo`
            : "Igual à média";
    document.getElementById("barrasPreco").innerHTML = `${criarLinhaBarra("Seu protótipo", preco, escala, "")}${criarLinhaBarra("Média dos jogos", precoMedio, escala, "media")}<div class="escala-preco"><span>R$ 0</span><span>${formatarMoeda(escala)}</span></div>`;
    document.getElementById("barrasAprovacao").innerHTML = `${criarLinhaAprovacao("Mesmo gênero e preço parecido", aprovacaoMedia, "")}${criarLinhaAprovacao("Todos os preços do gênero", aprovacaoGenero, "genero")}<div class="aprovacao-legenda"><span><i></i>Gênero e preço parecido</span><span><i></i>Todos os preços</span></div>`;
    renderizarTabela(recorte);
    resultados.hidden = false;
    mensagemPainel.hidden = true;
}

preencherPrototipos();
document.getElementById("generoPrototipo").textContent = temPrototipo ? (generoAtivo || "Gênero não identificado") : "Aguardando protótipo";

if (!temPrototipo) {
    prototipoSelect.disabled = true;
    margemPrecoInput.disabled = true;
    botaoBuscar.disabled = true;
} else {
    const precoValido = dadosDoPrototipo(listaPrototipos[indicePrototipo]).preco > 0;
    botaoBuscar.disabled = !precoValido || !generoAtivo;
    mensagemPainel.textContent = !generoAtivo
        ? "Não foi possível identificar o gênero do protótipo para buscar jogos iguais."
        : !precoValido
            ? "Informe o preço do protótipo para liberar a busca."
            : "Escolha a diferença de preço e clique em “Buscar jogos”.";
}

prototipoSelect.addEventListener("change", () => {
    indicePrototipo = Number(prototipoSelect.value);
    generoAtivo = detectarGenero(dadosDoPrototipo(listaPrototipos[indicePrototipo]).genero);
    document.getElementById("generoPrototipo").textContent = generoAtivo || "Gênero não identificado";
    const temPreco = dadosDoPrototipo(listaPrototipos[indicePrototipo]).preco > 0;
    botaoBuscar.disabled = !temPreco || !generoAtivo;
    mensagemPainel.hidden = false;
    resultados.hidden = true;
    mensagemPainel.textContent = !generoAtivo
        ? "Não foi possível identificar o gênero do protótipo para buscar jogos iguais."
        : !temPreco
            ? "Informe o preço do protótipo para liberar a busca."
            : "Clique em “Buscar jogos” para ver os resultados.";
});

margemPrecoInput.addEventListener("input", () => {
    margemPrecoInput.value = Math.min(100, Math.max(0, Number(margemPrecoInput.value) || 0));
    mensagemPainel.hidden = false;
    resultados.hidden = true;
    mensagemPainel.textContent = "Clique em “Buscar jogos” para ver os resultados.";
});

botaoBuscar.addEventListener("click", renderizar);

if (window.lucide) lucide.createIcons();
