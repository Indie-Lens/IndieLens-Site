var avaliacaoModel = require("../models/avaliacaoModel");

const CAMPOS_TOGGLE = {
    curtido: "curtido",
    desejos: "lista_desejos",
    transmitido: "ja_transmitido"
};

function buscar(req, res) {
    let idStreamer = req.params.idStreamer;
    let idJogo = req.params.idJogo;

    if (!idStreamer || !idJogo) {
        return res.status(400).send("idStreamer e idJogo são obrigatórios.");
    }

    avaliacaoModel.buscarPorStreamerEJogo(idStreamer, idJogo)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.json(resultado[0]);
            } else {
                res.json({
                    id_streamer: Number(idStreamer),
                    id_jogo: Number(idJogo),
                    curtido: 0,
                    lista_desejos: 0,
                    ja_transmitido: 0,
                    nota_pessoal: null
                });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function listar(req, res) {
    let idStreamer = req.params.idStreamer;

    if (!idStreamer) {
        return res.status(400).send("idStreamer é obrigatório.");
    }

    avaliacaoModel.listarPorStreamer(idStreamer)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function salvar(req, res) {
    let idStreamer = req.body.idStreamer;
    let idJogo = req.body.idJogo;
    let curtido = req.body.curtido;
    let listaDesejos = req.body.listaDesejos;
    let jaTransmitido = req.body.jaTransmitido;
    let notaPessoal = req.body.notaPessoal;

    if (!idStreamer || !idJogo) {
        return res.status(400).send("idStreamer e idJogo são obrigatórios.");
    }

    avaliacaoModel.salvar(idStreamer, idJogo, curtido, listaDesejos, jaTransmitido, notaPessoal)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function toggle(req, res) {
    let idStreamer = req.body.idStreamer;
    let idJogo = req.body.idJogo;
    let tipo = req.body.tipo;

    if (!idStreamer || !idJogo) {
        return res.status(400).send("idStreamer e idJogo são obrigatórios.");
    }

    let campo = CAMPOS_TOGGLE[tipo];
    if (!campo) {
        return res.status(400).send("tipo inválido. Use: curtido, desejos ou transmitido.");
    }

    avaliacaoModel.toggleCampo(idStreamer, idJogo, campo)
        .then(function () {
            return avaliacaoModel.buscarPorStreamerEJogo(idStreamer, idJogo);
        })
        .then(function (resultado) {
            res.json(resultado[0]);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarNota(req, res) {
    let idStreamer = req.body.idStreamer;
    let idJogo = req.body.idJogo;
    let notaPessoal = req.body.notaPessoal;

    if (!idStreamer || !idJogo) {
        return res.status(400).send("idStreamer e idJogo são obrigatórios.");
    }

    avaliacaoModel.atualizarNota(idStreamer, idJogo, notaPessoal)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function deletar(req, res) {
    let idStreamer = req.params.idStreamer;
    let idJogo = req.params.idJogo;

    if (!idStreamer || !idJogo) {
        return res.status(400).send("idStreamer e idJogo são obrigatórios.");
    }

    avaliacaoModel.deletar(idStreamer, idJogo)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    buscar,
    listar,
    salvar,
    toggle,
    atualizarNota,
    deletar
};
