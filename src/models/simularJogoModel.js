var database = require("../database/config");

function cadastrar(idUsuario, nome, preco, data, tag, genero) {
    var instrucaoSql = `
        INSERT INTO projeto_simulacao
        (id_usuario, nome_projeto, preco_estimado, data_lancamento, tags, generos, data_simulacao)
        VALUES (?, ?, ?, ?, ?, ?, NOW());
    `;
    return database.executar(instrucaoSql, [idUsuario, nome, preco, data, tag, genero]);
}

function listar(idUsuario) {
    var instrucaoSql = `
        SELECT id_simulacao AS id,
               id_usuario AS idUsuario,
               nome_projeto AS nome,
               preco_estimado AS preco,
               DATE_FORMAT(data_lancamento, '%Y-%m-%d') AS data,
               DATE_FORMAT(data_simulacao, '%Y-%m-%d') AS dataCriacao,
               tags AS tag,
               generos AS genero
        FROM projeto_simulacao
        WHERE id_usuario = ?
        ORDER BY id_simulacao DESC;
    `;
    return database.executar(instrucaoSql, [idUsuario]);
}

function atualizar(id, nome, preco, data, tag, genero) {
    var instrucaoSql = `
        UPDATE projeto_simulacao
        SET nome_projeto = ?,
            preco_estimado = ?,
            data_lancamento = ?,
            tags = ?,
            generos = ?
        WHERE id_simulacao = ?;
    `;
    return database.executar(instrucaoSql, [nome, preco, data, tag, genero, id]);
}

function jogos_semelhantes(genero, tag) {
    var condicoes = [];
    var parametros = [];

    if (genero) {
        condicoes.push("d.generos LIKE ?");
        parametros.push(`%${genero}%`);
    }

    if (tag) {
        condicoes.push("d.tags LIKE ?");
        parametros.push(`%${tag}%`);
    }

    var filtro = condicoes.length > 0 ? `AND (${condicoes.join(" OR ")})` : "";

    var instrucaoSql = `
        SELECT m.nome,
               m.preco,
               DATE_FORMAT(m.data_lancamento, '%Y-%m-%d') AS data,
               LEFT(d.descricao, 120) AS descricao,
               d.generos AS genero,
               d.tags AS tag
        FROM jogo_main m
        JOIN jogo_detalhes d
          ON d.id_jogo = m.id_jogo AND d.id_registro = m.id_registro
        LEFT JOIN jogo_metricas mt
          ON mt.id_jogo = m.id_jogo AND mt.id_registro = m.id_registro
        WHERE m.id_registro = (SELECT MAX(id_registro) FROM jogo_main)
          ${filtro}
        ORDER BY mt.avaliacoes_positivas DESC
        LIMIT 3;
    `;
    return database.executar(instrucaoSql, parametros);
}

function deletar(id) {
    return database
        .executar("DELETE FROM avaliacao_simulacao WHERE id_simulacao = ?;", [id])
        .then(function () {
            return database.executar("DELETE FROM projeto_simulacao WHERE id_simulacao = ?;", [id]);
        });
}

module.exports = {
    listar,
    cadastrar,
    atualizar,
    jogos_semelhantes,
    deletar
};
