// src/routes/simularJogo.js
var express = require("express");
var router = express.Router();

var simularJogoController = require("../controllers/simularJogoController");

/**
 * @openapi
 * /simularJogo/listar/{idUsuario}:
 *   get:
 *     tags: [LeadGame]
 *     summary: Lista os jogos simulados por um usuário
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário.
 *     responses:
 *       '200':
 *         description: Lista de jogos simulados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Simulacao'
 *       '500':
 *         description: Erro ao consultar os jogos no banco de dados.
 */
router.get("/listar/:idUsuario", function (req, res) {
    simularJogoController.listar(req, res);
});

/**
 * @openapi
 * /simularJogo/semelhantes:
 *   get:
 *     tags: [LeadGame]
 *     summary: Busca jogos semelhantes por gênero e tag
 *     parameters:
 *       - in: query
 *         name: genero
 *         required: true
 *         schema:
 *           type: string
 *         description: Gênero usado para filtrar jogos.
 *       - in: query
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *         description: Tags do jogo; a API usa a primeira tag informada.
 *     responses:
 *       '200':
 *         description: Até três jogos semelhantes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JogoSemelhante'
 *       '400':
 *         description: Gênero ou tag ausente.
 *       '500':
 *         description: Erro ao buscar jogos semelhantes.
 */
router.get("/semelhantes", function (req, res) {
    simularJogoController.jogos_semelhantes(req, res);
});

/**
 * @openapi
 * /simularJogo/cadastrar:
 *   post:
 *     tags: [LeadGame]
 *     summary: Cadastra um jogo simulado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SimulacaoInput'
 *     responses:
 *       '201':
 *         description: Jogo simulado cadastrado.
 *       '400':
 *         description: Dados incompletos.
 *       '500':
 *         description: Erro ao cadastrar o jogo simulado.
 */
router.post("/cadastrar", function (req, res) {
    simularJogoController.cadastrar(req, res);
});

/**
 * @openapi
 * /simularJogo/atualizar/{id}:
 *   put:
 *     tags: [LeadGame]
 *     summary: Atualiza um jogo simulado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da simulação.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SimulacaoInput'
 *     responses:
 *       '200':
 *         description: Jogo simulado atualizado.
 *       '400':
 *         description: ID ou dados obrigatórios ausentes.
 *       '500':
 *         description: Erro ao atualizar o jogo simulado.
 */
router.put("/atualizar/:id", function (req, res) {
    simularJogoController.atualizar(req, res);
});

/**
 * @openapi
 * /simularJogo/deletar/{id}:
 *   delete:
 *     tags: [LeadGame]
 *     summary: Exclui um jogo simulado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da simulação.
 *     responses:
 *       '200':
 *         description: Jogo simulado excluído.
 *       '500':
 *         description: Erro ao excluir o jogo simulado.
 */
router.delete("/deletar/:id", function (req, res) {
    simularJogoController.deletar(req, res);
});

module.exports = router;
