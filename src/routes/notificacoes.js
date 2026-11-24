var express = require("express");
var router = express.Router();

var notificacaoController = require("../controllers/notificacaoController");

router.get("/listar/:idUsuario",
    function (req, res) {
        notificacaoController.listarPorUsuario(req, res);
    }
);

router.get("/contador/:idUsuario",
    function (req, res) {
        notificacaoController.contarNaoLidas(req, res);
    }
);

router.get("/:idUsuario",
    function (req, res) {
        notificacaoController.listarPorUsuario(req, res);
    }
);

router.put("/ler/:idNotificacao",
    function (req, res) {
        notificacaoController.marcarComoLida(req, res);
    }
);

router.put("/lerTodas/:idUsuario",
    function (req, res) {
        notificacaoController.marcarTodasComoLidas(req, res);
    }
);

router.post("/cadastrar",
    function (req, res) {
        notificacaoController.cadastrarNotificacao(req, res);
    }
);

module.exports = router;
