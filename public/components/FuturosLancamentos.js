const inicializarFuturosLancamentos = (raiz = document) => {
    raiz.querySelectorAll(".futuros-lancamentos").forEach((componente) => {
        if (componente.dataset.inicializado === "true") return;
        componente.dataset.inicializado = "true";

        const tituloMes = componente.querySelector(".fl-mes-atual");
        const tituloLista = componente.querySelector(".fl-mes-lista");
        const diasContainer = componente.querySelector(".fl-dias");
        let mesAtual = 8;
        let anoAtual = 2026;

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

        const renderizar = () => {
            tituloMes.textContent = `${nomesMeses[mesAtual]} ${anoAtual}`;
            tituloLista.textContent =
                nomesMeses[mesAtual].toLocaleUpperCase("pt-BR");
            const inicio = new Date(anoAtual, mesAtual, 1).getDay();
            const total = new Date(anoAtual, mesAtual + 1, 0).getDate();
            diasContainer.innerHTML = "";

            for (let i = 0; i < inicio; i++) {
                const vazio = document.createElement("span");
                diasContainer.appendChild(vazio);
            }

            for (let dia = 1; dia <= total; dia++) {
                const botao = document.createElement("button");
                botao.className = "fl-dia";
                botao.type = "button";
                botao.textContent = dia;
                if (
                    mesAtual === 8 &&
                    anoAtual === 2026 &&
                    [1, 10, 21].includes(dia)
                )
                    botao.classList.add("fl-tem-lancamento");
                botao.addEventListener("click", () => {
                    componente
                        .querySelectorAll(".fl-dia")
                        .forEach((item) =>
                            item.classList.remove("fl-selecionado")
                        );
                    botao.classList.add("fl-selecionado");
                });
                diasContainer.appendChild(botao);
            }
        };

        componente
            .querySelector(".fl-mes-anterior")
            .addEventListener("click", () => {
                mesAtual--;
                if (mesAtual < 0) {
                    mesAtual = 11;
                    anoAtual--;
                }
                renderizar();
            });
        componente
            .querySelector(".fl-proximo-mes")
            .addEventListener("click", () => {
                mesAtual++;
                if (mesAtual > 11) {
                    mesAtual = 0;
                    anoAtual++;
                }
                renderizar();
            });
        renderizar();
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
        inicializarFuturosLancamentos()
    );
} else {
    inicializarFuturosLancamentos();
}
