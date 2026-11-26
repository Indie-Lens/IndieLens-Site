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

function construirFiltros({ busca, genero, plataforma }) {
    const clausulas = [
        `m.id_registro = (
            SELECT MAX(m2.id_registro)
            FROM jogo_main m2
            WHERE m2.id_jogo = m.id_jogo
        )`
    ];
    const params = [];

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

function listarJogos({ busca, genero, plataforma, ordem, limit, offset }) {
    const { whereSql, params } = construirFiltros({ busca, genero, plataforma });
    const orderBy = MAPA_ORDEM[ordem] || MAPA_ORDEM.viewers;

    const instrucaoSQL = `
        SELECT
            m.id_jogo AS idJogo,
            m.nome AS nome,
            m.desenvolvedor AS desenvolvedor,
            m.preco AS preco,
            m.data_lancamento AS dataLancamento,
            d.generos AS generos,
            d.tags AS tags,
            d.descricao AS descricao,
            mid.imagem_cabecalho AS imagem,
            COALESCE(s.suporte_windows, 0) AS suporteWindows,
            COALESCE(s.suporte_MAC, 0) AS suporteMac,
            COALESCE(s.suporte_linux, 0) AS suporteLinux,
            ROUND(COALESCE(mt.peak_CCU, 0) / 10, 1) AS avgViewers,
            COALESCE(pt.mediana_horas_total, 0) AS horasMedianas,
            ROUND(COALESCE(ccu5.ccu_medio, mt.peak_CCU, 0)) AS ccuMedio,
            ROUND(
                COALESCE(
                    mt.taxa_aprovacao,
                    (mt.avaliacoes_positivas * 100.0) / NULLIF(mt.avaliacoes_positivas + mt.avaliacoes_negativas, 0),
                    0
                ),
                1
            ) AS avaliacaoPct,
            CASE
                WHEN m.id_registro = (SELECT MAX(id_registro) FROM registro)
                 AND pt.mediana_horas_total IS NOT NULL
                 AND pt_ant.mediana_horas_total IS NOT NULL
                 AND pt.mediana_horas_total > pt_ant.mediana_horas_total
                THEN 1
                ELSE 0
            END AS emAlta
        FROM jogo_main m
        LEFT JOIN jogo_metricas mt
            ON mt.id_jogo = m.id_jogo AND mt.id_registro = m.id_registro
        LEFT JOIN jogo_playtime pt
            ON pt.id_jogo = m.id_jogo AND pt.id_registro = m.id_registro
        LEFT JOIN jogo_detalhes d
            ON d.id_jogo = m.id_jogo AND d.id_registro = m.id_registro
        LEFT JOIN jogo_midia mid
            ON mid.id_jogo = m.id_jogo AND mid.id_registro = m.id_registro
        LEFT JOIN jogo_suporte s
            ON s.id_jogo = m.id_jogo AND s.id_registro = m.id_registro
        LEFT JOIN jogo_playtime pt_ant
            ON pt_ant.id_jogo = m.id_jogo
            AND pt_ant.id_registro = (
                SELECT MAX(r.id_registro)
                FROM registro r
                WHERE r.id_registro < (SELECT MAX(r2.id_registro) FROM registro r2)
            )
        LEFT JOIN (
            SELECT
                jm.id_jogo,
                AVG(jm.peak_CCU) AS ccu_medio
            FROM jogo_metricas jm
            WHERE (
                SELECT COUNT(*)
                FROM jogo_metricas jm2
                WHERE jm2.id_jogo = jm.id_jogo
                  AND jm2.id_registro >= jm.id_registro
            ) <= 5
            GROUP BY jm.id_jogo
        ) ccu5 ON ccu5.id_jogo = m.id_jogo
        WHERE ${whereSql}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?;
    `;

    return database.executar(instrucaoSQL, [...params, limit, offset]);
}

function contarJogos({ busca, genero, plataforma }) {
    const { whereSql, params } = construirFiltros({ busca, genero, plataforma });

    const instrucaoSQL = `
        SELECT COUNT(*) AS total
        FROM jogo_main m
        LEFT JOIN jogo_detalhes d
            ON d.id_jogo = m.id_jogo AND d.id_registro = m.id_registro
        LEFT JOIN jogo_suporte s
            ON s.id_jogo = m.id_jogo AND s.id_registro = m.id_registro
        WHERE ${whereSql};
    `;

    return database.executar(instrucaoSQL, params);
}

module.exports = {
    listarJogos,
    contarJogos
};
