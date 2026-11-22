// src/controllers/simularJogoController.js
var simularJogoModel = require("../models/simularJogoModel");

function listar(req, res) {
    var idUsuario = req.params.idUsuario;

    if (idUsuario == undefined) {
        return res.status(400).send("idUsuario está undefined!");
    }

    simularJogoModel.listar(idUsuario)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrar(req, res) {
    var idUsuario = req.body.idUsuario;
    var nome = req.body.nome;
    var preco = req.body.preco;
    var data = req.body.data;
    var tag = req.body.tag;
    var genero = req.body.genero;

    if (idUsuario == undefined || nome == undefined || preco == undefined ||
        data == undefined || tag == undefined || genero == undefined) {
        return res.status(400).send("Dados incompletos!");
    }

    simularJogoModel.cadastrar(idUsuario, nome, preco, data, tag, genero)
        .then(function (resultado) {
            res.status(201).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizar(req, res) {
    var id = req.params.id;
    var nome = req.body.nome;
    var preco = req.body.preco;
    var data = req.body.data;
    var tag = req.body.tag;
    var genero = req.body.genero;

    if (id == undefined || nome == undefined || preco == undefined ||
        data == undefined || tag == undefined || genero == undefined) {
        return res.status(400).send("Dados incompletos!");
    }

    simularJogoModel.atualizar(id, nome, preco, data, tag, genero)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function jogos_semelhantes(req, res) {
    var genero = req.query.genero;
    var tag = req.query.tag;

    if (genero == undefined || tag == undefined) {
        return res.status(400).send("genero ou tag está undefined!");
    }

    let tagPrincipal = tag.split(",")[0].trim();

    simularJogoModel.jogos_semelhantes(genero, tagPrincipal)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function deletar(req, res) {
    var id = req.params.id;

    if (id == undefined) {
        return res.status(400).send("id está undefined!");
    }

    simularJogoModel.deletar(id)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}



module.exports = {
    listar,
    cadastrar,
    atualizar,
    jogos_semelhantes,
    deletar
    
};