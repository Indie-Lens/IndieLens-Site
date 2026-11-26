const express = require("express");
const router = express.Router();
const liveController = require("../controllers/liveController");

/**
 * @openapi
 * /lives:
 *   get:
 *     tags:
 *       - Lives
 *     summary: Lista as lives de um streamer
 *     parameters:
 *       - in: query
 *         name: streamerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do streamer. Também pode ser enviado como idStreamer.
 *     responses:
 *       '200':
 *         description: Lista de lives encontrada.
 *       '400':
 *         description: ID do streamer inválido ou ausente.
 *       '500':
 *         description: Erro ao listar as lives.
 */
router.get("/", liveController.listar);

/**
 * @openapi
 * /lives/{id}:
 *   get:
 *     tags:
 *       - Lives
 *     summary: Busca uma live de um streamer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da live.
 *       - in: query
 *         name: streamerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do streamer. Também pode ser enviado como idStreamer.
 *     responses:
 *       '200':
 *         description: Live encontrada.
 *       '400':
 *         description: Um dos IDs é inválido ou está ausente.
 *       '404':
 *         description: Live não encontrada para esse streamer.
 *       '500':
 *         description: Erro ao buscar a live.
 */
router.get("/:id", liveController.buscarPorId);

/**
 * @openapi
 * /lives:
 *   post:
 *     tags:
 *       - Lives
 *     summary: Cadastra uma live
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/LiveInput'
 *     responses:
 *       '201':
 *         description: Live cadastrada.
 *       '400':
 *         description: Campo obrigatório inválido ou ausente.
 *       '500':
 *         description: Erro ao cadastrar a live.
 */
router.post("/", liveController.cadastrar);

/**
 * @openapi
 * /lives/{id}:
 *   put:
 *     tags:
 *       - Lives
 *     summary: Atualiza uma live
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da live.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LiveInput'
 *     responses:
 *       '200':
 *         description: Live atualizada.
 *       '400':
 *         description: ID ou dados inválidos.
 *       '404':
 *         description: Live não encontrada para esse streamer.
 *       '500':
 *         description: Erro ao atualizar a live.
 */
router.put("/:id", liveController.atualizar);

/**
 * @openapi
 * /lives/{id}:
 *   delete:
 *     tags:
 *       - Lives
 *     summary: Exclui uma live
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da live.
 *       - in: query
 *         name: streamerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do streamer. Também pode ser enviado como idStreamer.
 *     responses:
 *       '200':
 *         description: Live excluída.
 *       '400':
 *         description: Um dos IDs é inválido ou está ausente.
 *       '404':
 *         description: Live não encontrada para esse streamer.
 *       '500':
 *         description: Erro ao excluir a live.
 */
router.delete("/:id", liveController.excluir);

module.exports = router;
