var database = require("../database/config");

const MAPA_ORDEM = {
    viewers: "avgViewers DESC, m.id_jogo ASC",
    avaliacao: "avaliacaoPct DESC, avgViewers DESC, m.id_jogo ASC",
    recentes: "m.data_lancamento DESC, m.id_jogo ASC",
    horas: "horasMedianas DESC, avgViewers DESC, m.id_jogo ASC"
};

const SINONIMOS_GENERO = {
    "ação": ["Ação", "Action"],
    "acao": ["Ação", "Action"],
    "aventura": ["Aventura", "Adventure"],
    "simulação": ["Simulação", "Simulation"],
    "simulacao": ["Simulação", "Simulation"],
    "plataforma": ["Plataforma", "Platformer"],
    "rpg": ["RPG"],
    "roguelike": ["Roguelike"]
};

const MAPA_PLATAFORMA = {
    windows: "s.suporte_windows = 1",
    mac: "s.suporte_MAC = 1",
    linux: "s.suporte_linux = 1"
};

function construirFiltros({ idRegistroAtual, busca, genero, plataforma }) {
    const clausulas = ["m.id_registro = ?"];
    const params = [idRegistroAtual];

    if (busca && busca.trim() !== "") {
        const termo = `%${busca.trim()}%`;
        clausulas.push(
            "(LOWER(COALESCE(m.nome, '')) LIKE LOWER(?) OR LOWER(COALESCE(d.generos, '')) LIKE LOWER(?) OR LOWER(COALESCE(m.desenvolvedor, '')) LIKE LOWER(?))"
        );
        params.push(termo, termo, termo);
    }

    if (genero && genero.trim() !== "" && genero.trim().toLowerCase() !== "todos") {
        const chave = genero.trim().toLowerCase();
        const termosGenero = SINONIMOS_GENERO[chave] || [genero.trim()];
        const condicoesGenero = termosGenero.map(() => "LOWER(COALESCE(d.generos, '')) LIKE LOWER(?)");
        clausulas.push(`(${condicoesGenero.join(" OR ")})`);
        termosGenero.forEach((g) => params.push(`%${g}%`));
    }

    if (plataforma && MAPA_PLATAFORMA[plataforma.trim().toLowerCase()]) {
        clausulas.push(MAPA_PLATAFORMA[plataforma.trim().toLowerCase()]);
    }

    return {
        whereSql: clausulas.join(" AND "),
        params
    };
}

async function obterRegistrosReferencia(incluirAnterior = false) {
    const regAtualRows = await database.executar("SELECT MAX(id_registro) AS idRegistroAtual FROM registro;");
    const idRegistroAtual = regAtualRows && regAtualRows[0] ? regAtualRows[0].idRegistroAtual : null;

    if (idRegistroAtual === null || idRegistroAtual === undefined) {
        return { idRegistroAtual: null, idRegistroAnterior: null };
    }

    if (!incluirAnterior) {
        return { idRegistroAtual, idRegistroAnterior: null };
    }

    const regAntRows = await database.executar(
        "SELECT MAX(id_registro) AS idRegistroAnterior FROM registro WHERE id_registro < ?;",
        [idRegistroAtual]
    );
    const idRegistroAnterior = regAntRows && regAntRows[0] ? regAntRows[0].idRegistroAnterior : null;

    return { idRegistroAtual, idRegistroAnterior };
}

async function listarJogos({ busca, genero, plataforma, ordem, limit, offset }) {
    // Etapa 0: buscar o registro mais recente e o penúltimo uma única vez
    const { idRegistroAtual, idRegistroAnterior } = await obterRegistrosReferencia(true);

    if (idRegistroAtual === null || idRegistroAtual === undefined) {
        return [];
    }

    // Etapa 1: paginar primeiro no registro atual (JOIN apenas nas tabelas de filtro/ordenação)
    const { whereSql, params } = construirFiltros({ idRegistroAtual, busca, genero, plataforma });
    const orderBy = MAPA_ORDEM[ordem] || MAPA_ORDEM.viewers;
    const limiteConsulta = Number.isInteger(limit) && limit > 0 ? limit : 20;
    const offsetConsulta = Number.isInteger(offset) && offset >= 0 ? offset : 0;

    const sqlPagina = `
        SELECT
            m.id_jogo AS idJogo,
            m.nome AS nome,
            m.desenvolvedor AS desenvolvedor,
            m.preco AS preco,
            m.data_lancamento AS dataLancamento,
            d.generos AS generos,
            d.tags AS tags,
            d.descricao AS descricao,
            COALESCE(s.suporte_windows, 0) AS suporteWindows,
            COALESCE(s.suporte_MAC, 0) AS suporteMac,
            COALESCE(s.suporte_linux, 0) AS suporteLinux,
            mt.peak_CCU AS peakCcuAtual,
            ROUND(COALESCE(mt.peak_CCU, 0) / 10, 1) AS avgViewers,
            COALESCE(pt.mediana_horas_total, 0) AS horasMedianas,
            pt.mediana_horas_total AS medianaHorasAtual,
            ROUND(
                COALESCE(
                    mt.taxa_aprovacao,
                    (mt.avaliacoes_positivas * 100.0) / NULLIF(mt.avaliacoes_positivas + mt.avaliacoes_negativas, 0),
                    0
                ),
                1
            ) AS avaliacaoPct
        FROM jogo_main m
        LEFT JOIN jogo_metricas mt
            ON mt.id_jogo = m.id_jogo AND mt.id_registro = m.id_registro
        LEFT JOIN jogo_playtime pt
            ON pt.id_jogo = m.id_jogo AND pt.id_registro = m.id_registro
        LEFT JOIN jogo_detalhes d
            ON d.id_registro = m.id_registro AND d.id_jogo = m.id_jogo
        LEFT JOIN jogo_suporte s
            ON s.id_jogo = m.id_jogo AND s.id_registro = m.id_registro
        WHERE ${whereSql}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?;
    `;

    const jogosPagina = await database.executar(sqlPagina, [...params, limiteConsulta, offsetConsulta]);
    if (!jogosPagina || jogosPagina.length === 0) {
        return [];
    }

    // Etapa 2: buscar mídia, playtime anterior e últimos 5 peak_CCU somente para os <= 21 jogos da página
    const idsJogos = jogosPagina.map((j) => j.idJogo);
    const placeholders = idsJogos.map(() => "?").join(", ");

    const promessaMidia = database.executar(
        `SELECT id_jogo AS idJogo, imagem_cabecalho AS imagem
         FROM jogo_midia
         WHERE id_registro = ? AND id_jogo IN (${placeholders});`,
        [idRegistroAtual, ...idsJogos]
    );

    const promessaPlaytimeAnterior = (idRegistroAnterior !== null && idRegistroAnterior !== undefined)
        ? database.executar(
            `SELECT id_jogo AS idJogo, mediana_horas_total AS medianaHorasAnterior
             FROM jogo_playtime
             WHERE id_registro = ? AND id_jogo IN (${placeholders});`,
            [idRegistroAnterior, ...idsJogos]
        )
        : Promise.resolve([]);

    const promessaCcuHistorico = database.executar(
        `SELECT id_jogo AS idJogo, peak_CCU AS peakCcu
         FROM jogo_metricas
         WHERE id_jogo IN (${placeholders})
         ORDER BY id_jogo ASC, id_registro DESC;`,
        idsJogos
    );

    const [midiaRows, playtimeAntRows, ccuRows] = await Promise.all([
        promessaMidia,
        promessaPlaytimeAnterior,
        promessaCcuHistorico
    ]);

    const mapaImagem = {};
    for (const item of midiaRows || []) {
        mapaImagem[item.idJogo] = item.imagem;
    }

    const mapaMedianaAnterior = {};
    for (const item of playtimeAntRows || []) {
        mapaMedianaAnterior[item.idJogo] = item.medianaHorasAnterior;
    }

    const ccuPorJogo = {};
    for (const item of ccuRows || []) {
        let lista = ccuPorJogo[item.idJogo];
        if (!lista) {
            lista = [];
            ccuPorJogo[item.idJogo] = lista;
        }
        if (lista.length < 5) {
            lista.push(item.peakCcu);
        }
    }

    return jogosPagina.map((jogo) => {
        const valoresCcu = (ccuPorJogo[jogo.idJogo] || []).filter((v) => v !== null && v !== undefined);
        const ccuMedio = valoresCcu.length > 0
            ? Math.round(valoresCcu.reduce((acc, v) => acc + Number(v), 0) / valoresCcu.length)
            : Math.round(Number(jogo.peakCcuAtual || 0));

        const medianaAtual = jogo.medianaHorasAtual;
        const medianaAnterior = mapaMedianaAnterior[jogo.idJogo];
        const emAlta = (
            medianaAtual !== null && medianaAtual !== undefined &&
            medianaAnterior !== null && medianaAnterior !== undefined &&
            Number(medianaAtual) > Number(medianaAnterior)
        ) ? 1 : 0;

        return {
            idJogo: jogo.idJogo,
            nome: jogo.nome,
            desenvolvedor: jogo.desenvolvedor,
            preco: jogo.preco,
            dataLancamento: jogo.dataLancamento,
            generos: jogo.generos,
            tags: jogo.tags,
            descricao: jogo.descricao,
            imagem: mapaImagem[jogo.idJogo] !== undefined ? mapaImagem[jogo.idJogo] : null,
            suporteWindows: jogo.suporteWindows,
            suporteMac: jogo.suporteMac,
            suporteLinux: jogo.suporteLinux,
            avgViewers: jogo.avgViewers,
            horasMedianas: jogo.horasMedianas,
            ccuMedio: ccuMedio,
            avaliacaoPct: jogo.avaliacaoPct,
            emAlta: emAlta
        };
    });
}

async function listarPopulares(limit = 5) {
    const { idRegistroAtual } = await obterRegistrosReferencia();
    if (idRegistroAtual === null || idRegistroAtual === undefined) {
        return [];
    }

    const parsedLimit = Number.parseInt(limit, 10);
    const limiteConsulta = Number.isInteger(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 20) : 5;

    const sql = `
        SELECT
            m.id_jogo AS idJogo,
            m.nome AS nome,
            d.generos AS generos,
            mid.imagem_cabecalho AS imagem,
            COALESCE(mt.peak_CCU, 0) AS peakCcu,
            COALESCE(s.suporte_windows, 0) AS suporteWindows,
            COALESCE(s.suporte_MAC, 0) AS suporteMac,
            COALESCE(s.suporte_linux, 0) AS suporteLinux
        FROM jogo_main m
        LEFT JOIN jogo_metricas mt
            ON mt.id_jogo = m.id_jogo AND mt.id_registro = m.id_registro
        LEFT JOIN jogo_detalhes d
            ON d.id_registro = m.id_registro AND d.id_jogo = m.id_jogo
        LEFT JOIN jogo_midia mid
            ON mid.id_jogo = m.id_jogo AND mid.id_registro = m.id_registro
        LEFT JOIN jogo_suporte s
            ON s.id_jogo = m.id_jogo AND s.id_registro = m.id_registro
        WHERE m.id_registro = ?
        ORDER BY mt.peak_CCU DESC, mt.qtd_recomendacoes DESC, mt.nota_score DESC, m.id_jogo ASC
        LIMIT ?;
    `;

    return database.executar(sql, [idRegistroAtual, limiteConsulta]);
}

module.exports = {
    obterRegistrosReferencia,
    listarJogos,
    listarPopulares
};
