var notificacaoModel = require("../models/notificacaoModel");

function listarPorUsuario(req, res) {
    let idUsuario = req.params.idUsuario;

    if (idUsuario == undefined) {
        res.status(400).send("O idUsuario está indefinido!");
        return;
    }

    notificacaoModel.listarPorUsuario(idUsuario)
        .then(
            function (resultado) {
                console.log(`Notificações encontradas: ${resultado.length}`);
                res.status(200).json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(`Erro ao listar notificações: ${erro.sqlMessage}`);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function contarNaoLidas(req, res) {
    let idUsuario = req.params.idUsuario;

    if (idUsuario == undefined) {
        res.status(400).send("O idUsuario está indefinido!");
        return;
    }

    notificacaoModel.contarNaoLidas(idUsuario)
        .then(
            function (resultado) {
                res.status(200).json({
                    total_notificacoes: resultado[0]?.total_notificacoes ?? 0
                });
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(`Erro ao contar notificações não lidas: ${erro.sqlMessage}`);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function marcarComoLida(req, res) {
    let idNotificacao = req.params.idNotificacao;

    if (idNotificacao == undefined) {
        res.status(400).send("O idNotificacao está indefinido!");
        return;
    }

    notificacaoModel.marcarComoLida(idNotificacao)
        .then(
            function (resultado) {
                res.status(200).json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(`Erro ao marcar notificação como lida: ${erro.sqlMessage}`);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function marcarTodasComoLidas(req, res) {
    let idUsuario = req.params.idUsuario;

    if (idUsuario == undefined) {
        res.status(400).send("O idUsuario está indefinido!");
        return;
    }

    notificacaoModel.marcarTodasComoLidas(idUsuario)
        .then(
            function (resultado) {
                res.status(200).json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(`Erro ao marcar todas as notificações como lidas: ${erro.sqlMessage}`);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function cadastrarNotificacao(req, res) {
    let idUsuario = req.body.idUsuarioServer;
    let idJogo = req.body.idJogoServer;
    let tipo = req.body.tipoServer;
    let titulo = req.body.tituloServer;
    let mensagem = req.body.mensagemServer;

    if (tipo == undefined || titulo == undefined || mensagem == undefined) {
        res.status(400).send("Tipo, título ou mensagem da notificação está indefinido!");
        return;
    }

    notificacaoModel.cadastrar(idUsuario, idJogo, tipo, titulo, mensagem)
        .then(
            function (resultado) {
                res.status(201).json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(`Erro no cadastro de notificação: ${erro.sqlMessage}`);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    listarPorUsuario,
    contarNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
    cadastrarNotificacao
};
