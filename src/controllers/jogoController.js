var jogoModel = require("../models/jogoModel");

function parseInteiroPositivo(valor, padrao, min, max) {
    var parsed = Number.parseInt(valor, 10);
    if (Number.isNaN(parsed)) return padrao;
    if (parsed < min) return min;
    if (max !== undefined && parsed > max) return max;
    return parsed;
}

function listar(req, res) {
    var busca = typeof req.query.busca === "string" ? req.query.busca : "";
    var genero = typeof req.query.genero === "string" ? req.query.genero : "";
    var plataforma = typeof req.query.plataforma === "string" ? req.query.plataforma : "";
    var ordem = typeof req.query.ordem === "string" ? req.query.ordem : "viewers";
    var limit = parseInteiroPositivo(req.query.limit, 20, 1, 100);
    var offset = parseInteiroPositivo(req.query.offset, 0, 0);

    var filtros = {
        busca: busca,
        genero: genero,
        plataforma: plataforma,
        ordem: ordem,
        limit: limit,
        offset: offset
    };

    Promise.all([
        jogoModel.listarJogos(filtros),
        jogoModel.contarJogos(filtros)
    ])
        .then(function (resultados) {
            var jogos = resultados[0] || [];
            var total = resultados[1] && resultados[1][0] ? Number(resultados[1][0].total) : jogos.length;
            var temMais = offset + jogos.length < total;

            res.json({
                jogos: jogos,
                total: total,
                temMais: temMais,
                limit: limit,
                offset: offset
            });
        })
        .catch(function (erro) {
            console.error("Erro ao listar jogos:", erro);
            res.status(500).json({ erro: erro.sqlMessage || erro.message || "Erro ao listar jogos" });
        });
}

module.exports = {
    listar
};
