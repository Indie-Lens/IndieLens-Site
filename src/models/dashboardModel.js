const database = require("../database/config");

/*
 * Todas as consultas usam o registro mais recente (idRegistroAtual escalar),
 * já que a base atualiza semanalmente e o mesmo jogo tem vários registros.
 * A parte de "perfil do streamer" (match / radar) fica de fora por enquanto.
 */

async function obterIdRegistroAtual() {
    const linhas = await database.executar("SELECT MAX(id_registro) AS idRegistroAtual FROM registro;");
    return linhas && linhas[0] ? linhas[0].idRegistroAtual : null;
}

async function jogoDestaque() {
    const idRegistroAtual = await obterIdRegistroAtual();
    if (idRegistroAtual === null || idRegistroAtual === undefined) {
        return [];
    }

    const instrucaoSQL = `
        SELECT
            m.id_jogo              AS idJogo,
            m.nome                 AS nome,
            m.desenvolvedor        AS desenvolvedor,
            m.preco                AS preco,
            m.data_lancamento      AS dataLancamento,
            d.generos              AS generos,
            d.tags                 AS tags,
            d.descricao            AS descricao,
            mid.imagem_cabecalho   AS imagem,
            mt.peak_CCU            AS peakCcu,
            mt.nota_score          AS notaScore,
            a.desconto_pct         AS descontoPct
        FROM jogo_main m
        JOIN jogo_metricas mt ON m.id_jogo = mt.id_jogo AND m.id_registro = mt.id_registro
        JOIN jogo_detalhes d  ON d.id_registro = m.id_registro AND d.id_jogo = m.id_jogo
        LEFT JOIN jogo_midia mid ON m.id_jogo = mid.id_jogo AND m.id_registro = mid.id_registro
        LEFT JOIN jogo_auxiliar a ON m.id_jogo = a.id_jogo AND m.id_registro = a.id_registro
        WHERE m.id_registro = ?
        ORDER BY mt.nota_score DESC, mt.peak_CCU DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSQL, [idRegistroAtual]);
}

async function indicadores() {
    const idRegistroAtual = await obterIdRegistroAtual();
    if (idRegistroAtual === null || idRegistroAtual === undefined) {
        return [{ jogosEmAlta: 0, emPromocao: 0, lancamentos: 0 }];
    }

    const instrucaoSQL = `
        SELECT
            jm.jogosEmAlta,
            (SELECT COUNT(*) FROM jogo_auxiliar WHERE id_registro = ? AND desconto_pct > 0) AS emPromocao,
            jm.lancamentos
        FROM (
            SELECT
                COUNT(*) AS jogosEmAlta,
                COALESCE(SUM(CASE WHEN data_lancamento >= (CURDATE() - INTERVAL 18 MONTH) THEN 1 ELSE 0 END), 0) AS lancamentos
            FROM jogo_main
            WHERE id_registro = ?
        ) jm;
    `;
    return database.executar(instrucaoSQL, [idRegistroAtual, idRegistroAtual]);
}

async function listaEmAlta() {
    const idRegistroAtual = await obterIdRegistroAtual();
    if (idRegistroAtual === null || idRegistroAtual === undefined) {
        return [];
    }

    const instrucaoSQL = `
        SELECT
            m.id_jogo            AS idJogo,
            m.nome               AS nome,
            d.generos            AS generos,
            mt.peak_CCU          AS peakCcu,
            mid.imagem_cabecalho AS imagem
        FROM jogo_main m
        JOIN jogo_metricas mt ON m.id_jogo = mt.id_jogo AND m.id_registro = mt.id_registro
        JOIN jogo_detalhes d  ON d.id_registro = m.id_registro AND d.id_jogo = m.id_jogo
        LEFT JOIN jogo_midia mid ON m.id_jogo = mid.id_jogo AND m.id_registro = mid.id_registro
        WHERE m.id_registro = ?
        ORDER BY mt.peak_CCU DESC
        LIMIT 10;
    `;
    return database.executar(instrucaoSQL, [idRegistroAtual]);
}

async function listaPromocao() {
    const idRegistroAtual = await obterIdRegistroAtual();
    if (idRegistroAtual === null || idRegistroAtual === undefined) {
        return [];
    }

    const instrucaoSQL = `
        SELECT
            m.id_jogo            AS idJogo,
            m.nome               AS nome,
            d.generos            AS generos,
            m.preco              AS preco,
            a.desconto_pct       AS descontoPct,
            mid.imagem_cabecalho AS imagem
        FROM jogo_main m
        JOIN jogo_auxiliar a  ON m.id_jogo = a.id_jogo  AND m.id_registro = a.id_registro
        JOIN jogo_detalhes d  ON d.id_registro = m.id_registro AND d.id_jogo = m.id_jogo
        LEFT JOIN jogo_midia mid ON m.id_jogo = mid.id_jogo AND m.id_registro = mid.id_registro
        WHERE m.id_registro = ? AND a.desconto_pct > 0
        ORDER BY a.desconto_pct DESC
        LIMIT 10;
    `;
    return database.executar(instrucaoSQL, [idRegistroAtual]);
}

async function listaLancamentos() {
    const idRegistroAtual = await obterIdRegistroAtual();
    if (idRegistroAtual === null || idRegistroAtual === undefined) {
        return [];
    }

    const instrucaoSQL = `
        SELECT
            m.id_jogo            AS idJogo,
            m.nome               AS nome,
            d.generos            AS generos,
            m.data_lancamento    AS dataLancamento,
            mid.imagem_cabecalho AS imagem
        FROM jogo_main m
        JOIN jogo_detalhes d  ON d.id_registro = m.id_registro AND d.id_jogo = m.id_jogo
        LEFT JOIN jogo_midia mid ON m.id_jogo = mid.id_jogo AND m.id_registro = mid.id_registro
        WHERE m.id_registro = ?
        ORDER BY m.data_lancamento DESC
        LIMIT 10;
    `;
    return database.executar(instrucaoSQL, [idRegistroAtual]);
}

async function graficoCcu() {
    const idRegistroAtual = await obterIdRegistroAtual();
    if (idRegistroAtual === null || idRegistroAtual === undefined) {
        return [];
    }

    const instrucaoSQL = `
        SELECT
            m.nome      AS nome,
            mt.peak_CCU AS peakCcu,
            ROUND((mt.avaliacoes_positivas + mt.avaliacoes_negativas) / 1000) AS concorrencia
        FROM jogo_main m
        JOIN jogo_metricas mt ON m.id_jogo = mt.id_jogo AND m.id_registro = mt.id_registro
        WHERE m.id_registro = ?
        ORDER BY mt.peak_CCU DESC
        LIMIT 6;
    `;
    return database.executar(instrucaoSQL, [idRegistroAtual]);
}

async function graficoTags() {
    const idRegistroAtual = await obterIdRegistroAtual();
    if (idRegistroAtual === null || idRegistroAtual === undefined) {
        return [];
    }

    const instrucaoSQL = `
        SELECT
            TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(d.generos, ',', n.n), ',', -1)) AS nome,
            COUNT(*) AS total
        FROM jogo_detalhes d
        JOIN (
            SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3
            UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
        ) n
            ON CHAR_LENGTH(d.generos) - CHAR_LENGTH(REPLACE(d.generos, ',', '')) >= n.n - 1
        WHERE d.id_registro = ?
          AND d.generos IS NOT NULL
          AND TRIM(d.generos) <> ''
        GROUP BY nome
        HAVING nome <> ''
        ORDER BY total DESC
        LIMIT 5;
    `;
    return database.executar(instrucaoSQL, [idRegistroAtual]);
}

async function graficoEngajamento() {
    const idRegistroAtual = await obterIdRegistroAtual();
    if (idRegistroAtual === null || idRegistroAtual === undefined) {
        return [];
    }

    const instrucaoSQL = `
        SELECT
            m.nome                       AS nome,
            p.media_horas_total          AS horasTotal,
            p.media_horas_duas_semanas   AS horasDuasSemanas
        FROM jogo_main m
        JOIN jogo_metricas mt ON m.id_jogo = mt.id_jogo AND m.id_registro = mt.id_registro
        JOIN jogo_playtime p  ON m.id_jogo = p.id_jogo  AND m.id_registro = p.id_registro
        WHERE m.id_registro = ?
        ORDER BY mt.peak_CCU DESC
        LIMIT 4;
    `;
    return database.executar(instrucaoSQL, [idRegistroAtual]);
}

module.exports = {
    jogoDestaque,
    indicadores,
    listaEmAlta,
    listaPromocao,
    listaLancamentos,
    graficoCcu,
    graficoTags,
    graficoEngajamento
};
