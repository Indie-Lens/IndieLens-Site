var usuarioModel = require("../models/usuarioModel");

const PERFIS_VALIDOS = [1, 2, 3, 4];

function cadastrarUsuario(req, res) {
    let nome = typeof req.body.nomeServer === "string" ? req.body.nomeServer.trim() : "";
    let email = typeof req.body.emailServer === "string" ? req.body.emailServer.trim() : "";
    let tipo = Number(req.body.tipoServer);
    let senha = typeof req.body.senhaServer === "string" ? req.body.senhaServer : "";

    if (!nome || !email || !senha.trim()) {
        return res.status(400).json({ mensagem: "Nome, e-mail e senha são obrigatórios." });
    }

    if (!Number.isInteger(tipo) || !PERFIS_VALIDOS.includes(tipo)) {
        return res.status(400).json({ mensagem: "Tipo de perfil inválido." });
    }

    usuarioModel.buscarPorEmail(email)
        .then(function (usuariosExistentes) {
            if (usuariosExistentes.length > 0) {
                return res.status(409).json({ mensagem: "Já existe uma conta cadastrada com este e-mail." });
            }

            return usuarioModel.cadastrar(nome, email, tipo, senha)
                .then(function (resultado) {
                    res.status(200).json(resultado);
                });
        })
        .catch(function (erro) {
            console.log(erro);
            console.log(`Erro no cadastro: ${erro.sqlMessage || erro.message || erro}`);
            res.status(500).json({ mensagem: erro.sqlMessage || "Erro ao cadastrar usuário." });
        });
}

function autenticar(req, res) {
    let email = typeof req.body.emailServer === "string" ? req.body.emailServer.trim() : "";
    let senha = typeof req.body.senhaServer === "string" ? req.body.senhaServer : "";

    if (!email || !senha) {
        return res.status(400).send("E-mail e senha são obrigatórios.");
    }

    usuarioModel.autenticar(email, senha)
        .then(function (resultado) {
            console.log(`Resultados Encontrados: ${resultado.length}`);

            if (resultado.length == 1) {
                res.json({
                    id: resultado[0].id_usuario,
                    perfil: resultado[0].id_perfil,
                    nome: resultado[0].nome,
                    email: resultado[0].email
                });
            } else if (resultado.length == 0) {
                res.status(403).send("Email e/ou senha inválido(s)");
            } else {
                res.status(403).send("Mais de um usuário com o mesmo login e senha");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Erro ao realizar Login: ", erro.sqlMessage || erro.message || erro);
            res.status(500).json({ mensagem: erro.sqlMessage || "Erro ao realizar login." });
        });
}

module.exports = { cadastrarUsuario, autenticar };
