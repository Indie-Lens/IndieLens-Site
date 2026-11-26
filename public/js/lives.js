// Camada de acesso à API de lives + funções de formatação compartilhadas
// pelas telas: CadastrarLive, selecionarLive e dashboardLive.

const LivesAPI = (function () {

    // O backend filtra tudo por streamer. O login só guarda ID_USUARIO,
    // então usamos ID_STREAMER se existir e, senão, o ID do usuário.
    function idStreamer() {
        return sessionStorage.ID_STREAMER || sessionStorage.ID_USUARIO;
    }

    async function requisitar(url, opcoes) {
        const resposta = await fetch(url, opcoes);
        let corpo = null;
        try { corpo = await resposta.json(); } catch (e) { /* resposta sem JSON */ }

        if (!resposta.ok) {
            const mensagem = (corpo && corpo.mensagem) || "Erro ao comunicar com o servidor.";
            throw new Error(mensagem);
        }
        return corpo;
    }

    function exigirStreamer() {
        const id = idStreamer();
        if (!id) throw new Error("Sessão expirada. Faça login novamente.");
        return id;
    }

    // GET /lives?streamerId=
    function listar() {
        const id = exigirStreamer();
        return requisitar(`/lives?streamerId=${encodeURIComponent(id)}`);
    }

    // GET /lives/:id?streamerId=
    function buscarPorId(idLive) {
        const id = exigirStreamer();
        return requisitar(`/lives/${encodeURIComponent(idLive)}?streamerId=${encodeURIComponent(id)}`);
    }

    // POST /lives
    function cadastrar(dados) {
        const id = exigirStreamer();
        return requisitar("/lives", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.assign({ idStreamer: Number(id) }, dados))
        });
    }

    return { idStreamer, listar, buscarPorId, cadastrar };
})();


// ---------- formatação ----------

const LivesFmt = (function () {

    const IMAGENS_JOGOS = {
        "hades": "Hades.jpg",
        "stardew valley": "StardewValleyBanner.png",
        "hollow knight": "Hollow.jpg",
        "cuphead": "Cuphead.jpg",
        "dave the diver": "DaveTheDiver.jpg",
        "celeste": "celeste-e1534205369647.jpg"
    };

    const NOTAS_TEXTO = ["", "Fraca", "Abaixo do esperado", "Regular", "Boa", "Excelente"];

    const CHAT = {
        alto: { texto: "Alto", classe: "verde" },
        medio: { texto: "Médio", classe: "" },
        baixo: { texto: "Baixo", classe: "" }
    };

    // Escapa texto digitado pelo usuário antes de colocar em innerHTML
    function esc(valor) {
        return String(valor == null ? "" : valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // "2026-08-12" -> "12/08/2026"  (completa=false -> "12/08")
    function data(iso, completa = true) {
        if (!iso) return "";
        const [a, m, d] = iso.split("-");
        return completa ? `${d}/${m}/${a}` : `${d}/${m}`;
    }

    // "20:15:00" -> "20:15"
    function hora(h) {
        return h ? h.slice(0, 5) : "";
    }

    // "0h 30min" -> "30min"
    function duracao(d) {
        return d ? d.replace(/^0h\s*/, "") : "";
    }

    function numero(n) {
        return Number(n || 0).toLocaleString("pt-BR");
    }

    function imagemJogo(nome) {
        const arquivo = IMAGENS_JOGOS[String(nome || "").trim().toLowerCase()];
        return "../../assets/imgs/" + (arquivo || "Logo.jpeg");
    }

    function estrelas(nota) {
        const n = Math.max(0, Math.min(5, Number(nota) || 0));
        return "★".repeat(n) + "☆".repeat(5 - n);
    }

    function notaTexto(nota) {
        return NOTAS_TEXTO[Number(nota)] || "";
    }

    function chat(valor) {
        return CHAT[valor] || { texto: valor ? valor : "—", classe: "" };
    }

    return { esc, data, hora, duracao, numero, imagemJogo, estrelas, notaTexto, chat };
})();
