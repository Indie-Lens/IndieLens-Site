// src/routes/simularJogo.js
var express = require("express");
var router = express.Router();

var simularJogoController = require("../controllers/simularJogoController");

router.get("/listar/:idUsuario", function (req, res) {
    simularJogoController.listar(req, res);
});

router.get("/semelhantes", function (req, res) {
    simularJogoController.jogos_semelhantes(req, res);
});

router.post("/cadastrar", function (req, res) {
    simularJogoController.cadastrar(req, res);
});

router.put("/atualizar/:id", function (req, res) {
    simularJogoController.atualizar(req, res);
});

router.delete("/deletar/:id", function (req, res) {
    simularJogoController.deletar(req, res);
});

module.exports = router;