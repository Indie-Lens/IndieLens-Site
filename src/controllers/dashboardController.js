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
            res.json(resultado && resultado.length > 0 ? resultado[0] : {});
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function indicadores(req, res) {
    dashboardModel.indicadores()
        .then(function (resultado) {
            res.json(resultado && resultado[0] ? resultado[0] : { jogosEmAlta: 0, emPromocao: 0, lancamentos: 0 });
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
    responder(dashboardModel.graficoTags(), res);
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
