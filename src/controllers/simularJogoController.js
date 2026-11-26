// src/controllers/simularJogoController.js
var simularJogoModel = require("../models/simularJogoModel");

function parseIdPositivo(valor) {
    var numero = Number(valor);
    return Number.isInteger(numero) && numero > 0 ? numero : null;
}

function parsePreco(valor) {
    if (typeof valor === "number") {
        return Number.isFinite(valor) ? Number(valor.toFixed(2)) : NaN;
    }
    if (typeof valor === "string") {
        var texto = valor.trim().replace(/[^\d,.-]/g, "");
        if (!texto) return NaN;
        if (texto.includes(",")) {
            texto = texto.replace(/\./g, "").replace(",", ".");
        }
        var numero = Number(texto);
        return Number.isFinite(numero) ? Number(numero.toFixed(2)) : NaN;
    }
    return NaN;
}

function validarDataIso(valor) {
    if (typeof valor !== "string") return false;
    var texto = valor.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;

    var partes = texto.split("-").map(Number);
    var dt = new Date(Date.UTC(partes[0], partes[1] - 1, partes[2]));
    return (
        dt.getUTCFullYear() === partes[0] &&
        dt.getUTCMonth() === partes[1] - 1 &&
        dt.getUTCDate() === partes[2]
    );
}

function validarDadosSimulacao(body) {
    var nome = typeof body.nome === "string" ? body.nome.trim() : "";
    var genero = typeof body.genero === "string" ? body.genero.trim() : "";
    var tag = body.tag == undefined ? null : String(body.tag).trim();
    var data = typeof body.data === "string" ? body.data.trim() : "";
    var preco = parsePreco(body.preco);

    if (!nome || !genero || tag === null || !data || Number.isNaN(preco)) {
        return { erro: "Dados incompletos ou inválidos!" };
    }
    if (preco < 0 || preco > 999999.99) {
        return { erro: "Preço deve estar entre 0 e 999999.99!" };
    }
    if (!validarDataIso(data)) {
        return { erro: "Data inválida! Utilize o formato YYYY-MM-DD." };
    }
    if (nome.length > 100 || genero.length > 100 || tag.length > 100) {
        return { erro: "Nome, gênero e tag devem ter no máximo 100 caracteres." };
    }

    return { nome, preco, data, tag, genero };
}

function responderErro(res, erro, fallback) {
    console.log(erro);
    res.status(500).json({ erro: (erro && (erro.sqlMessage || erro.message)) || fallback });
}

function listar(req, res) {
    var idUsuario = parseIdPositivo(req.params.idUsuario);

    if (!idUsuario) {
        return res.status(400).json({ erro: "idUsuario inválido!" });
    }

    simularJogoModel.listar(idUsuario)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "Erro ao listar simulações.");
        });
}

function cadastrar(req, res) {
    var idUsuario = parseIdPositivo(req.body.idUsuario);
    if (!idUsuario) {
        return res.status(400).json({ erro: "idUsuario inválido!" });
    }

    var dados = validarDadosSimulacao(req.body);
    if (dados.erro) {
        return res.status(400).json({ erro: dados.erro });
    }

    simularJogoModel.cadastrar(idUsuario, dados.nome, dados.preco, dados.data, dados.tag, dados.genero)
        .then(function (resultado) {
            res.status(201).json({
                id: resultado.insertId,
                affectedRows: resultado.affectedRows
            });
        })
        .catch(function (erro) {
            responderErro(res, erro, "Erro ao cadastrar o jogo simulado.");
        });
}

function atualizar(req, res) {
    var id = parseIdPositivo(req.params.id);
    if (!id) {
        return res.status(400).json({ erro: "id inválido!" });
    }

    var dados = validarDadosSimulacao(req.body);
    if (dados.erro) {
        return res.status(400).json({ erro: dados.erro });
    }

    simularJogoModel.atualizar(id, dados.nome, dados.preco, dados.data, dados.tag, dados.genero)
        .then(function (resultado) {
            if (!resultado || resultado.affectedRows === 0) {
                return res.status(404).json({ erro: "Simulação não encontrada." });
            }
            res.status(200).json({ affectedRows: resultado.affectedRows });
        })
        .catch(function (erro) {
            responderErro(res, erro, "Erro ao atualizar o jogo simulado.");
        });
}

function jogos_semelhantes(req, res) {
    var genero = req.query.genero;
    var tag = req.query.tag;

    if (genero == undefined || tag == undefined) {
        return res.status(400).json({ erro: "genero ou tag está undefined!" });
    }

    var generoLimpo = String(genero).trim();
    var tagPrincipal = String(tag).split(",")[0].trim();

    if (!generoLimpo && !tagPrincipal) {
        return res.status(400).json({ erro: "Informe ao menos um gênero ou tag!" });
    }

    simularJogoModel.jogos_semelhantes(generoLimpo, tagPrincipal)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "Erro ao buscar jogos semelhantes.");
        });
}

function deletar(req, res) {
    var id = parseIdPositivo(req.params.id);

    if (!id) {
        return res.status(400).json({ erro: "id inválido!" });
    }

    simularJogoModel.deletar(id)
        .then(function (resultado) {
            if (!resultado || resultado.affectedRows === 0) {
                return res.status(404).json({ erro: "Simulação não encontrada." });
            }
            res.status(200).json({ affectedRows: resultado.affectedRows });
        })
        .catch(function (erro) {
            responderErro(res, erro, "Erro ao excluir o jogo simulado.");
        });
}

module.exports = {
    listar,
    cadastrar,
    atualizar,
    jogos_semelhantes,
    deletar
};