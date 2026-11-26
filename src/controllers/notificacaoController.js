var notificacaoModel = require("../models/notificacaoModel");

function corrigirMojibake(texto) {
    if (typeof texto !== "string" || !texto) return texto;
    if (!/[ÃÂ][\u0080-\u00BF]/.test(texto)) return texto;
    if (/[^\u0000-\u00FF]/.test(texto)) return texto;

    try {
        const decodificado = Buffer.from(texto, "latin1").toString("utf8");
        if (decodificado.includes("\uFFFD")) return texto;
        if (Buffer.from(decodificado, "utf8").toString("latin1") !== texto) return texto;
        return decodificado;
    } catch {
        return texto;
    }
}

function normalizarNotificacoes(lista) {
    if (!Array.isArray(lista)) return lista;
    return lista.map((item) => ({
        ...item,
        tipo: corrigirMojibake(item.tipo),
        titulo: corrigirMojibake(item.titulo),
        mensagem: corrigirMojibake(item.mensagem)
    }));
}

function listarPorUsuario(req, res) {
    const idUsuario = Number(req.params.idUsuario);

    if (!Number.isInteger(idUsuario) || idUsuario < 0) {
        res.status(400).send("O idUsuario está indefinido ou inválido!");
        return;
    }

    notificacaoModel.listarPorUsuario(idUsuario)
        .then(function (resultado) {
            console.log(`Notificações encontradas: ${resultado.length}`);
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(200).json(normalizarNotificacoes(resultado));
        })
        .catch(function (erro) {
            console.log(erro);
            console.log(`Erro ao listar notificações: ${erro.sqlMessage}`);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function contarNaoLidas(req, res) {
    const idUsuario = Number(req.params.idUsuario);

    if (!Number.isInteger(idUsuario) || idUsuario < 0) {
        res.status(400).send("O idUsuario está indefinido ou inválido!");
        return;
    }

    notificacaoModel.contarNaoLidas(idUsuario)
        .then(function (resultado) {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(200).json({
                total_notificacoes: resultado[0]?.total_notificacoes ?? 0
            });
        })
        .catch(function (erro) {
            console.log(erro);
            console.log(`Erro ao contar notificações não lidas: ${erro.sqlMessage}`);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function marcarComoLida(req, res) {
    const idNotificacao = Number(req.params.idNotificacao);

    if (!Number.isInteger(idNotificacao) || idNotificacao <= 0) {
        res.status(400).send("O idNotificacao está indefinido ou inválido!");
        return;
    }

    notificacaoModel.marcarComoLida(idNotificacao)
        .then(function (resultado) {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log(`Erro ao marcar notificação como lida: ${erro.sqlMessage}`);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function marcarTodasComoLidas(req, res) {
    const idUsuario = Number(req.params.idUsuario);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        res.status(400).send("O idUsuario está indefinido ou inválido!");
        return;
    }

    notificacaoModel.marcarTodasComoLidas(idUsuario)
        .then(function (resultado) {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log(`Erro ao marcar todas as notificações como lidas: ${erro.sqlMessage}`);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

function cadastrarNotificacao(req, res) {
    const idUsuario = req.body.idUsuarioServer;
    const idJogo = req.body.idJogoServer;
    const tipo = req.body.tipoServer;
    const titulo = req.body.tituloServer;
    const mensagem = req.body.mensagemServer;

    if (tipo == undefined || titulo == undefined || mensagem == undefined) {
        res.status(400).send("Tipo, título ou mensagem da notificação está indefinido!");
        return;
    }

    notificacaoModel.cadastrar(idUsuario, idJogo, tipo, titulo, mensagem)
        .then(function (resultado) {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(201).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log(`Erro no cadastro de notificação: ${erro.sqlMessage}`);
            res.status(500).json(erro.sqlMessage || erro.message);
        });
}

module.exports = {
    listarPorUsuario,
    contarNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
    cadastrarNotificacao
};
