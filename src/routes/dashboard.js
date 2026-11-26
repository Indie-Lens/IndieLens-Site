var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/destaque", function (req, res) {
    dashboardController.destaque(req, res);
});

router.get("/indicadores", function (req, res) {
    dashboardController.indicadores(req, res);
});

router.get("/lista/:tipo", function (req, res) {
    dashboardController.lista(req, res);
});

router.get("/grafico/ccu", function (req, res) {
    dashboardController.graficoCcu(req, res);
});

router.get("/grafico/tags", function (req, res) {
    dashboardController.graficoTags(req, res);
});

router.get("/grafico/engajamento", function (req, res) {
    dashboardController.graficoEngajamento(req, res);
});

module.exports = router;
