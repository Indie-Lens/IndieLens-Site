// Dashboard de uma live: carrega a live (GET /lives/:id) e o histórico
// do streamer (GET /lives) para calcular comparações e gráficos.

(function () {
    const esc = LivesFmt.esc;
    const el = id => document.getElementById(id);

    const corRoxo = "#9749e0", corVerde = "#9cff00", corBorda = "#222330";
    const paletaJogos = [corVerde, corRoxo, "#8c8d9e", "#36374a", "#68329a", "#4a246e", "#c8ff66", "#5b5d73"];

    const chave = l => l.dataLive + " " + l.horaInicio;
    const media = lista => lista.length ? lista.reduce((a, b) => a + b, 0) / lista.length : 0;

    function definirTendencia(idEl, valor, outras, campo, sufixo) {
        const alvo = el(idEl);
        if (!outras.length) {
            alvo.textContent = "Primeira live registrada";
            alvo.className = "tendencia";
            return;
        }
        const ref = media(outras.map(l => l[campo]));
        let diff, texto;

        if (sufixo === "abs") {
            diff = Math.round(valor - ref);
            texto = `${diff >= 0 ? "↑" : "↓"} ${Math.abs(diff)} ${diff >= 0 ? "acima" : "abaixo"} da média`;
        } else {
            diff = ref > 0 ? Math.round(((valor - ref) / ref) * 100) : 0;
            texto = `${diff >= 0 ? "↑" : "↓"} ${Math.abs(diff)}% vs. suas lives`;
        }
        alvo.textContent = texto;
        alvo.className = "tendencia " + (diff >= 0 ? "positiva" : "negativa");
    }

    function preencherLive(live, outras) {
        const horario = `${LivesFmt.hora(live.horaInicio)} – ${LivesFmt.hora(live.horaTermino)}`;
        const duracao = LivesFmt.duracao(live.duracao);

        el("capaJogo").src = LivesFmt.imagemJogo(live.nomeJogo);
        el("capaJogo").alt = live.nomeJogo;
        el("badgeCategoria").textContent = live.categoria;
        el("badgeNota").textContent = `★ ${live.notaAvaliacao} / 5`;
        el("tituloLive").textContent = `${live.nomeJogo} — ${live.tituloLive}`;
        document.title = `${live.tituloLive} | INDIE LENS`;

        el("metaData").textContent = LivesFmt.data(live.dataLive);
        el("metaHorario").textContent = horario;
        el("metaDuracao").textContent = duracao;
        el("metaJogo").textContent = live.nomeJogo;

        el("indMedia").textContent = LivesFmt.numero(live.mediaEspectadores);
        el("indPico").textContent = LivesFmt.numero(live.picoEspectadores);
        el("indViews").textContent = LivesFmt.numero(live.visualizacoesTotais);
        el("indSeg").textContent = LivesFmt.numero(live.novosSeguidores);
        el("indDuracao").textContent = duracao;
        el("indHorario").textContent = horario;
        el("indData").textContent = LivesFmt.data(live.dataLive);

        definirTendencia("tendMedia", live.mediaEspectadores, outras, "mediaEspectadores");
        definirTendencia("tendPico", live.picoEspectadores, outras, "picoEspectadores");
        definirTendencia("tendViews", live.visualizacoesTotais, outras, "visualizacoesTotais");
        definirTendencia("tendSeg", live.novosSeguidores, outras, "novosSeguidores", "abs");

        el("avEstrelas").textContent = LivesFmt.estrelas(live.notaAvaliacao);
        el("avTexto").textContent = LivesFmt.notaTexto(live.notaAvaliacao);
        const chat = LivesFmt.chat(live.engajamentoChat);
        el("avChat").textContent = chat.texto;
        el("avChat").className = "avaliacao-valor " + chat.classe;
        el("avPontoAlto").textContent = live.pontoAlto || "—";
        el("avMelhoria").textContent = live.pontoMelhoria || "—";
    }

    function preencherTabela(todas, atual) {
        const recentes = todas.slice().sort((a, b) => chave(b).localeCompare(chave(a))).slice(0, 5);
        el("tabelaHistorico").innerHTML = recentes.map(l => {
            const ehAtual = l.idLive === atual.idLive;
            const nome = ehAtual ? `<strong>${esc(l.nomeJogo)}</strong>` : esc(l.nomeJogo);
            return `
            <tr class="${ehAtual ? "linha-atual" : ""}" style="cursor:pointer"
                onclick="location.href='./dashboardLive.html?id=${encodeURIComponent(l.idLive)}'">
                <td>${nome}</td>
                <td>${LivesFmt.data(l.dataLive, false)} • ${LivesFmt.hora(l.horaInicio)}</td>
                <td>${esc(LivesFmt.duracao(l.duracao))}</td>
                <td>${LivesFmt.numero(l.mediaEspectadores)}</td>
                <td>${LivesFmt.numero(l.picoEspectadores)}</td>
                <td>+${LivesFmt.numero(l.novosSeguidores)}</td>
                <td>★ ${l.notaAvaliacao}</td>
            </tr>`;
        }).join("");
    }

    function desenharGraficos(todas) {
        Chart.defaults.color = "#8c8d9e";
        Chart.defaults.font.family = "Inter, sans-serif";

        // 1) evolução: até as 10 últimas lives em ordem cronológica
        const cronologicas = todas.slice().sort((a, b) => chave(a).localeCompare(chave(b))).slice(-10);
        const ctx = el("graficoComparativo").getContext("2d");
        const gV = ctx.createLinearGradient(0, 0, 0, 400);
        gV.addColorStop(0, "rgba(156,255,0,0.3)");
        gV.addColorStop(1, "rgba(156,255,0,0.0)");
        const gR = ctx.createLinearGradient(0, 0, 0, 400);
        gR.addColorStop(0, "rgba(151,73,224,0.5)");
        gR.addColorStop(1, "rgba(151,73,224,0.0)");

        new Chart(ctx, {
            type: "line",
            data: {
                labels: cronologicas.map(l => LivesFmt.data(l.dataLive, false)),
                datasets: [
                    { label: "Pico", data: cronologicas.map(l => l.picoEspectadores), borderColor: corVerde, backgroundColor: gV, borderWidth: 2, tension: 0.4, fill: true, pointRadius: cronologicas.length === 1 ? 4 : 0 },
                    { label: "Média", data: cronologicas.map(l => l.mediaEspectadores), borderColor: corRoxo, backgroundColor: gR, borderWidth: 2, tension: 0.4, fill: true, pointRadius: cronologicas.length === 1 ? 4 : 0 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, grid: { color: corBorda } }, x: { grid: { display: false } } },
                plugins: { legend: { position: "top", align: "end", labels: { usePointStyle: true, boxWidth: 8 } } }
            }
        });

        // 2) pico médio por hora de início
        const porHora = {};
        todas.forEach(l => {
            const h = parseInt(l.horaInicio.slice(0, 2), 10);
            (porHora[h] = porHora[h] || []).push(l.picoEspectadores);
        });
        const horas = Object.keys(porHora).map(Number).sort((a, b) => a - b);
        const medias = horas.map(h => Math.round(media(porHora[h])));
        const maior = Math.max(...medias);

        new Chart(el("graficoHorarios"), {
            type: "bar",
            data: {
                labels: horas.map(h => `${h}h–${(h + 1) % 24}h`),
                datasets: [{
                    label: "Pico médio",
                    data: medias,
                    backgroundColor: medias.map(m => m === maior ? corVerde : corRoxo),
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { color: corBorda } }, x: { grid: { display: false } } }
            }
        });

        // 3) jogos transmitidos
        const porJogo = {};
        todas.forEach(l => { porJogo[l.nomeJogo] = (porJogo[l.nomeJogo] || 0) + 1; });
        const jogos = Object.keys(porJogo);

        new Chart(el("graficoJogos"), {
            type: "doughnut",
            data: {
                labels: jogos,
                datasets: [{
                    data: jogos.map(j => porJogo[j]),
                    backgroundColor: jogos.map((_, i) => paletaJogos[i % paletaJogos.length]),
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: "70%",
                plugins: { legend: { position: "right", labels: { usePointStyle: true, color: "#8c8d9e", padding: 15 } } }
            }
        });
    }

    async function iniciar() {
        const idLive = new URLSearchParams(window.location.search).get("id");
        if (!idLive) {
            window.location.href = "./selecionarLive.html";
            return;
        }

        let todas;
        try {
            const [live, lista] = await Promise.all([LivesAPI.buscarPorId(idLive), LivesAPI.listar()]);
            todas = lista;
            const outras = todas.filter(l => l.idLive !== live.idLive);

            preencherLive(live, outras);
            preencherTabela(todas, live);
        } catch (erro) {
            el("tituloLive").textContent = erro.message;
            return;
        }

        // gráficos separados: se o Chart.js não carregar, o resto da página continua
        try {
            desenharGraficos(todas);
        } catch (erro) {
            console.error("Erro ao desenhar gráficos:", erro);
        }
    }

    iniciar();
})();
