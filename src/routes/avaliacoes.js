var express = require("express");
var router = express.Router();

var avaliacaoController = require("../controllers/avaliacaoController");

router.get("/listar/:idStreamer", function (req, res) {
    avaliacaoController.listar(req, res);
});

router.get("/:idStreamer/:idJogo", function (req, res) {
    avaliacaoController.buscar(req, res);
});

router.post("/salvar", function (req, res) {
    avaliacaoController.salvar(req, res);
});

router.patch("/toggle", function (req, res) {
    avaliacaoController.toggle(req, res);
});

router.put("/nota", function (req, res) {
    avaliacaoController.atualizarNota(req, res);
});

router.delete("/:idStreamer/:idJogo", function (req, res) {
    avaliacaoController.deletar(req, res);
});

module.exports = router;
