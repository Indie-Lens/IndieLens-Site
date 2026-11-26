var dashboardModel = require("../models/dashboardModel");

function responder(promessa, res) {
    promessa
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function destaque(req, res) {
    dashboardModel.jogoDestaque()
        .then(function (resultado) {
            res.json(resultado.length > 0 ? resultado[0] : {});
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function indicadores(req, res) {
    dashboardModel.indicadores()
        .then(function (resultado) {
            res.json(resultado[0]);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function lista(req, res) {
    var tipo = req.params.tipo;

    if (tipo === "alta") {
        return responder(dashboardModel.listaEmAlta(), res);
    }
    if (tipo === "promocao") {
        return responder(dashboardModel.listaPromocao(), res);
    }
    if (tipo === "lancamentos") {
        return responder(dashboardModel.listaLancamentos(), res);
    }
    return res.status(400).send("tipo inválido. Use: alta, promocao ou lancamentos.");
}

function graficoCcu(req, res) {
    responder(dashboardModel.graficoCcu(), res);
}

function graficoTags(req, res) {
    dashboardModel.graficoTags()
        .then(function (resultado) {
            var contagem = {};

            resultado.forEach(function (linha) {
                if (!linha.generos) return;
                linha.generos.split(",").forEach(function (g) {
                    var genero = g.trim();
                    if (genero) {
                        contagem[genero] = (contagem[genero] || 0) + 1;
                    }
                });
            });

            var ranking = Object.keys(contagem)
                .map(function (nome) {
                    return { nome: nome, total: contagem[nome] };
                })
                .sort(function (a, b) {
                    return b.total - a.total;
                })
                .slice(0, 5);

            res.json(ranking);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function graficoEngajamento(req, res) {
    responder(dashboardModel.graficoEngajamento(), res);
}

module.exports = {
    destaque,
    indicadores,
    lista,
    graficoCcu,
    graficoTags,
    graficoEngajamento
};
