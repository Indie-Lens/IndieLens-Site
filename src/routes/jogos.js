var express = require("express");
var router = express.Router();

var jogoController = require("../controllers/jogoController");

/**
 * @swagger
 * /jogos:
 *   get:
 *     summary: Lista jogos do catálogo com métricas calculadas, filtros e paginação
 *     tags: [Jogos]
 *     parameters:
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Filtro por nome, gênero ou desenvolvedor
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *         description: Filtro por gênero (ex. RPG, Roguelike, Aventura, Simulação, Plataforma, Ação)
 *       - in: query
 *         name: plataforma
 *         schema:
 *           type: string
 *           enum: [windows, mac, linux]
 *         description: Filtro por plataforma suportada
 *       - in: query
 *         name: ordem
 *         schema:
 *           type: string
 *           enum: [viewers, avaliacao, recentes, horas]
 *         description: Critério de ordenação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Quantidade de jogos por página
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Deslocamento da paginação
 *     responses:
 *       200:
 *         description: Lista paginada de jogos
 */
router.get("/", function (req, res) {
    jogoController.listar(req, res);
});

/**
 * @swagger
 * /jogos/populares:
 *   get:
 *     summary: Lista os jogos mais populares do registro mais recente
 *     tags: [Jogos]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *           minimum: 1
 *           maximum: 20
 *         description: Quantidade máxima de jogos populares a retornar
 *     responses:
 *       200:
 *         description: Lista dos jogos mais populares
 */
router.get("/populares", function (req, res) {
    jogoController.populares(req, res);
});

module.exports = router;
