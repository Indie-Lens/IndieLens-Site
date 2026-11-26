var express = require("express");
var router = express.Router();

var avaliacaoController = require("../controllers/avaliacaoController");

/**
 * @openapi
 * /avaliacoes/listar/{idStreamer}:
 *   get:
 *     tags: [Avaliações]
 *     summary: Lista avaliações de jogos de um streamer
 *     parameters:
 *       - in: path
 *         name: idStreamer
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do streamer.
 *     responses:
 *       '200':
 *         description: Lista de avaliações do streamer.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Avaliacao'
 *       '500':
 *         description: Erro ao consultar as avaliações.
 */
router.get("/listar/:idStreamer", function (req, res) {
    avaliacaoController.listar(req, res);
});

/**
 * @openapi
 * /avaliacoes/{idStreamer}/{idJogo}:
 *   get:
 *     tags: [Avaliações]
 *     summary: Busca a avaliação de um jogo para um streamer
 *     parameters:
 *       - in: path
 *         name: idStreamer
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idJogo
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Avaliação encontrada ou estado inicial sem interações.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avaliacao'
 *       '500':
 *         description: Erro ao buscar a avaliação.
 */
router.get("/:idStreamer/:idJogo", function (req, res) {
    avaliacaoController.buscar(req, res);
});

/**
 * @openapi
 * /avaliacoes/salvar:
 *   post:
 *     tags: [Avaliações]
 *     summary: Salva ou substitui uma avaliação de jogo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalvarAvaliacaoInput'
 *     responses:
 *       '200':
 *         description: Avaliação salva.
 *       '400':
 *         description: IDs do streamer e do jogo são obrigatórios.
 *       '500':
 *         description: Erro ao salvar a avaliação.
 */
router.post("/salvar", function (req, res) {
    avaliacaoController.salvar(req, res);
});

/**
 * @openapi
 * /avaliacoes/toggle:
 *   patch:
 *     tags: [Avaliações]
 *     summary: Alterna uma interação do streamer com o jogo
 *     description: Alterna entre ligado e desligado o estado indicado por tipo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToggleAvaliacaoInput'
 *     responses:
 *       '200':
 *         description: Estado atualizado da avaliação.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avaliacao'
 *       '400':
 *         description: IDs ausentes ou tipo inválido.
 *       '500':
 *         description: Erro ao atualizar a interação.
 */
router.patch("/toggle", function (req, res) {
    avaliacaoController.toggle(req, res);
});

/**
 * @openapi
 * /avaliacoes/nota:
 *   put:
 *     tags: [Avaliações]
 *     summary: Salva ou atualiza a nota pessoal sobre um jogo
 *     description: Envie notaPessoal como texto vazio para remover a nota.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotaAvaliacaoInput'
 *     responses:
 *       '200':
 *         description: Nota pessoal atualizada.
 *       '400':
 *         description: IDs do streamer e do jogo são obrigatórios.
 *       '500':
 *         description: Erro ao atualizar a nota.
 */
router.put("/nota", function (req, res) {
    avaliacaoController.atualizarNota(req, res);
});

/**
 * @openapi
 * /avaliacoes/{idStreamer}/{idJogo}:
 *   delete:
 *     tags: [Avaliações]
 *     summary: Remove a avaliação de um jogo para um streamer
 *     parameters:
 *       - in: path
 *         name: idStreamer
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idJogo
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Avaliação removida.
 *       '500':
 *         description: Erro ao remover a avaliação.
 */
router.delete("/:idStreamer/:idJogo", function (req, res) {
    avaliacaoController.deletar(req, res);
});

module.exports = router;
