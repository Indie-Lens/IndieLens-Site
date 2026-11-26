const database = require("../database/config");

/*
 * Todas as consultas usam o registro mais recente (MAX(id_registro)),
 * já que a base atualiza semanalmente e o mesmo jogo tem vários registros.
 * A parte de "perfil do streamer" (match / radar) fica de fora por enquanto.
 */

const REGISTRO_ATUAL = "(SELECT MAX(id_registro) FROM registro)";
const REGISTRO_ANTERIOR = "(SELECT MAX(id_registro) FROM registro WHERE id_registro < " + REGISTRO_ATUAL + ")";

function jogoDestaque() {
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
        JOIN jogo_detalhes d  ON m.id_jogo = d.id_jogo  AND m.id_registro = d.id_registro
        LEFT JOIN jogo_midia mid ON m.id_jogo = mid.id_jogo AND m.id_registro = mid.id_registro
        LEFT JOIN jogo_auxiliar a ON m.id_jogo = a.id_jogo AND m.id_registro = a.id_registro
        WHERE m.id_registro = ${REGISTRO_ATUAL}
        ORDER BY mt.nota_score DESC, mt.peak_CCU DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSQL);
}

function indicadores() {
    const instrucaoSQL = `
        SELECT
            (SELECT COUNT(*) FROM jogo_main WHERE id_registro = ${REGISTRO_ATUAL}) AS jogosEmAlta,
            (SELECT COUNT(*) FROM jogo_auxiliar WHERE id_registro = ${REGISTRO_ATUAL} AND desconto_pct > 0) AS emPromocao,
            (SELECT COUNT(*) FROM jogo_main WHERE id_registro = ${REGISTRO_ATUAL} AND data_lancamento >= (CURDATE() - INTERVAL 18 MONTH)) AS lancamentos;
    `;
    return database.executar(instrucaoSQL);
}

function listaEmAlta() {
    const instrucaoSQL = `
        SELECT
            m.id_jogo            AS idJogo,
            m.nome               AS nome,
            d.generos            AS generos,
            mt.peak_CCU          AS peakCcu,
            mid.imagem_cabecalho AS imagem
        FROM jogo_main m
        JOIN jogo_metricas mt ON m.id_jogo = mt.id_jogo AND m.id_registro = mt.id_registro
        JOIN jogo_detalhes d  ON m.id_jogo = d.id_jogo  AND m.id_registro = d.id_registro
        LEFT JOIN jogo_midia mid ON m.id_jogo = mid.id_jogo AND m.id_registro = mid.id_registro
        WHERE m.id_registro = ${REGISTRO_ATUAL}
        ORDER BY mt.peak_CCU DESC
        LIMIT 10;
    `;
    return database.executar(instrucaoSQL);
}

function listaPromocao() {
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
        JOIN jogo_detalhes d  ON m.id_jogo = d.id_jogo  AND m.id_registro = d.id_registro
        LEFT JOIN jogo_midia mid ON m.id_jogo = mid.id_jogo AND m.id_registro = mid.id_registro
        WHERE m.id_registro = ${REGISTRO_ATUAL} AND a.desconto_pct > 0
        ORDER BY a.desconto_pct DESC
        LIMIT 10;
    `;
    return database.executar(instrucaoSQL);
}

function listaLancamentos() {
    const instrucaoSQL = `
        SELECT
            m.id_jogo            AS idJogo,
            m.nome               AS nome,
            d.generos            AS generos,
            m.data_lancamento    AS dataLancamento,
            mid.imagem_cabecalho AS imagem
        FROM jogo_main m
        JOIN jogo_detalhes d  ON m.id_jogo = d.id_jogo  AND m.id_registro = d.id_registro
        LEFT JOIN jogo_midia mid ON m.id_jogo = mid.id_jogo AND m.id_registro = mid.id_registro
        WHERE m.id_registro = ${REGISTRO_ATUAL}
        ORDER BY m.data_lancamento DESC
        LIMIT 10;
    `;
    return database.executar(instrucaoSQL);
}

function graficoCcu() {
    const instrucaoSQL = `
        SELECT
            m.nome      AS nome,
            mt.peak_CCU AS peakCcu,
            ROUND((mt.avaliacoes_positivas + mt.avaliacoes_negativas) / 1000) AS concorrencia
        FROM jogo_main m
        JOIN jogo_metricas mt ON m.id_jogo = mt.id_jogo AND m.id_registro = mt.id_registro
        WHERE m.id_registro = ${REGISTRO_ATUAL}
        ORDER BY mt.peak_CCU DESC
        LIMIT 6;
    `;
    return database.executar(instrucaoSQL);
}

function graficoTags() {
    const instrucaoSQL = `
        SELECT generos
        FROM jogo_detalhes
        WHERE id_registro = ${REGISTRO_ATUAL};
    `;
    return database.executar(instrucaoSQL);
}

function graficoEngajamento() {
    const instrucaoSQL = `
        SELECT
            m.nome                       AS nome,
            p.media_horas_total          AS horasTotal,
            p.media_horas_duas_semanas   AS horasDuasSemanas
        FROM jogo_main m
        JOIN jogo_metricas mt ON m.id_jogo = mt.id_jogo AND m.id_registro = mt.id_registro
        JOIN jogo_playtime p  ON m.id_jogo = p.id_jogo  AND m.id_registro = p.id_registro
        WHERE m.id_registro = ${REGISTRO_ATUAL}
        ORDER BY mt.peak_CCU DESC
        LIMIT 4;
    `;
    return database.executar(instrucaoSQL);
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
