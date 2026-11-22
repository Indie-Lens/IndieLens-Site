const express = require("express");
const router = express.Router();
const liveController = require("../controllers/liveController");

router.get("/", liveController.listar);
router.get("/:id", liveController.buscarPorId);
router.post("/", liveController.cadastrar);
router.put("/:id", liveController.atualizar);
router.delete("/:id", liveController.excluir);

module.exports = router;
