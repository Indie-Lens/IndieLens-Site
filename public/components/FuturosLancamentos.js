const inicializarFuturosLancamentos = (raiz = document) => {
    const API_BASE =
        window.location.protocol === "file:" ? "http://localhost:3333" : "";
    const FALLBACK_CAPA = "./assets/imgs/Logo.jpeg";

    const normalizarCapa = (url) => {
        if (typeof url !== "string") return FALLBACK_CAPA;
        const limpa = url.trim();
        if (!limpa) return FALLBACK_CAPA;
        if (/^https?:\/\//i.test(limpa)) return limpa;
        if (/^(?:\.\.\/)+assets\//i.test(limpa)) {
            return limpa.replace(/^(?:\.\.\/)+assets\//i, "./assets/");
        }
        if (limpa.startsWith("./assets/")) return limpa;
        if (limpa.startsWith("/assets/")) return "." + limpa;
        if (limpa.startsWith("assets/")) return "./" + limpa;
        return FALLBACK_CAPA;
    };

    const nomesMeses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];

    raiz.querySelectorAll(".futuros-lancamentos").forEach((componente) => {
        if (componente.dataset.inicializado === "true") return;
        componente.dataset.inicializado = "true";

        const tituloMes = componente.querySelector(".fl-mes-atual");
        const tituloLista = componente.querySelector(".fl-mes-lista");
        const diasContainer = componente.querySelector(".fl-dias");
        const itensContainer = componente.querySelector(".fl-itens");

        const hoje = new Date();
        let mesAtual = hoje.getMonth() + 1;
        let anoAtual = hoje.getFullYear();
        let lancamentosMes = [];
        let diaSelecionado = null;
        let requisicaoAtual = 0;

        const renderizarLista = () => {
            if (!itensContainer) return;
            itensContainer.innerHTML = "";

            const filtrados =
                diaSelecionado !== null
                    ? lancamentosMes.filter(
                          (item) => Number(item.dia) === diaSelecionado
                      )
                    : lancamentosMes;

            if (filtrados.length === 0) {
                const vazio = document.createElement("p");
                vazio.className = "fl-vazio-lista";
                vazio.textContent =
                    diaSelecionado !== null
                        ? `Nenhum lançamento previsto para o dia ${diaSelecionado}.`
                        : "Nenhum lançamento encontrado para este mês.";
                itensContainer.appendChild(vazio);
                return;
            }

            filtrados.forEach((jogo) => {
                const card = document.createElement("article");
                card.className = "fl-jogo";

                const dataDiv = document.createElement("div");
                dataDiv.className = "fl-data";
                const spanDia = document.createElement("span");
                spanDia.textContent = "DIA";
                const strongDia = document.createElement("strong");
                strongDia.textContent = String(jogo.dia ?? "");
                dataDiv.appendChild(spanDia);
                dataDiv.appendChild(strongDia);

                const nomeDiv = document.createElement("div");
                nomeDiv.className = "fl-nome-jogo";
                nomeDiv.textContent = jogo.nome || "Jogo sem título";

                const capaDiv = document.createElement("div");
                capaDiv.className = "fl-capa";
                const img = document.createElement("img");
                img.src = normalizarCapa(jogo.imagem);
                img.alt = `Capa de ${jogo.nome || "jogo"}`;
                img.addEventListener("error", () => {
                    if (img.dataset.fallbackAplicado === "1") return;
                    img.dataset.fallbackAplicado = "1";
                    img.src = FALLBACK_CAPA;
                });
                capaDiv.appendChild(img);

                card.appendChild(dataDiv);
                card.appendChild(nomeDiv);
                card.appendChild(capaDiv);
                itensContainer.appendChild(card);
            });
        };

        const renderizarCalendario = () => {
            const indiceMes = Math.max(0, Math.min(11, mesAtual - 1));
            tituloMes.textContent = `${nomesMeses[indiceMes]} ${anoAtual}`;
            tituloLista.textContent =
                nomesMeses[indiceMes].toLocaleUpperCase("pt-BR");

            const inicio = new Date(anoAtual, indiceMes, 1).getDay();
            const total = new Date(anoAtual, indiceMes + 1, 0).getDate();
            const diasComLancamento = new Set(
                lancamentosMes
                    .map((item) => Number(item.dia))
                    .filter((d) => Number.isInteger(d) && d >= 1 && d <= total)
            );

            diasContainer.innerHTML = "";

            for (let i = 0; i < inicio; i++) {
                const vazio = document.createElement("span");
                diasContainer.appendChild(vazio);
            }

            for (let dia = 1; dia <= total; dia++) {
                const botao = document.createElement("button");
                botao.className = "fl-dia";
                botao.type = "button";
                botao.textContent = String(dia);

                if (diasComLancamento.has(dia)) {
                    botao.classList.add("fl-tem-lancamento");
                }
                if (diaSelecionado === dia) {
                    botao.classList.add("fl-selecionado");
                }

                botao.addEventListener("click", () => {
                    diaSelecionado = diaSelecionado === dia ? null : dia;
                    renderizarCalendario();
                    renderizarLista();
                });

                diasContainer.appendChild(botao);
            }
        };

        const carregarMes = async (mes, ano) => {
            const idReq = ++requisicaoAtual;
            diaSelecionado = null;

            if (itensContainer) {
                itensContainer.innerHTML = "";
                const carregando = document.createElement("p");
                carregando.className = "fl-vazio-lista";
                carregando.textContent = "Carregando lançamentos...";
                itensContainer.appendChild(carregando);
            }

            const query =
                Number.isInteger(mes) && Number.isInteger(ano)
                    ? `?mes=${mes}&ano=${ano}`
                    : "";

            try {
                const resposta = await fetch(
                    `${API_BASE}/jogos/lancamentos${query}`
                );
                if (!resposta.ok) {
                    throw new Error(
                        `Erro ao carregar lançamentos (${resposta.status})`
                    );
                }
                const dados = await resposta.json();
                if (idReq !== requisicaoAtual) return;

                if (Number.isInteger(Number(dados?.mes))) {
                    mesAtual = Number(dados.mes);
                }
                if (Number.isInteger(Number(dados?.ano))) {
                    anoAtual = Number(dados.ano);
                }
                lancamentosMes = Array.isArray(dados?.lancamentos)
                    ? dados.lancamentos
                    : [];

                renderizarCalendario();
                renderizarLista();
            } catch (erro) {
                if (idReq !== requisicaoAtual) return;
                console.error("Erro ao carregar futuros lançamentos:", erro);
                lancamentosMes = [];
                renderizarCalendario();
                if (itensContainer) {
                    itensContainer.innerHTML = "";
                    const msgErro = document.createElement("p");
                    msgErro.className = "fl-vazio-lista";
                    msgErro.textContent =
                        "Não foi possível carregar os lançamentos.";
                    itensContainer.appendChild(msgErro);
                }
            }
        };

        componente
            .querySelector(".fl-mes-anterior")
            .addEventListener("click", () => {
                mesAtual--;
                if (mesAtual < 1) {
                    mesAtual = 12;
                    anoAtual--;
                }
                renderizarCalendario();
                carregarMes(mesAtual, anoAtual);
            });

        componente
            .querySelector(".fl-proximo-mes")
            .addEventListener("click", () => {
                mesAtual++;
                if (mesAtual > 12) {
                    mesAtual = 1;
                    anoAtual++;
                }
                renderizarCalendario();
                carregarMes(mesAtual, anoAtual);
            });

        renderizarCalendario();
        carregarMes();
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
        inicializarFuturosLancamentos()
    );
} else {
    inicializarFuturosLancamentos();
}
