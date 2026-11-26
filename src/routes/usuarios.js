var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

/**
 * @openapi
 * /usuarios/cadastrarUsuario:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Cadastra um usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CadastroUsuario'
 *     responses:
 *       '200':
 *         description: Usuário cadastrado.
 *       '500':
 *         description: Erro ao cadastrar o usuário.
 */
router.post("/cadastrarUsuario",
    function(req,res){
        usuarioController.cadastrarUsuario(req,res);
    }
);

/**
 * @openapi
 * /usuarios/autenticar:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Autentica um usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Credenciais'
 *     responses:
 *       '200':
 *         description: Login válido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioAutenticado'
 *       '403':
 *         description: Email ou senha inválidos.
 *       '500':
 *         description: Erro ao realizar login.
 */
router.post("/autenticar",
    function(req,res){
        usuarioController.autenticar(req,res);
    }
)

module.exports = router;