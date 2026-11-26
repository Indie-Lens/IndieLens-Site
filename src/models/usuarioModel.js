var database = require("../database/config");

function buscarPorEmail(email) {
    let instrucaoSQL = `SELECT id_usuario, email FROM usuario WHERE email = ? LIMIT 1;`;
    return database.executar(instrucaoSQL, [email]);
}

function cadastrar(nome, email, perfil, senha) {
    console.log(`Realizando cadastro de usuário: Nome: ${nome}, Email: ${email}, Perfil: ${perfil}`);

    let instrucaoSQL = `INSERT INTO usuario (id_perfil, nome, email, senha) VALUES (?, ?, ?, ?);`;
    return database.executar(instrucaoSQL, [perfil, nome, email, senha]);
}

function autenticar(email, senha) {
    console.log(`Realizando validação de login: Email: ${email}`);

    let instrucaoSQL = `SELECT id_usuario, id_perfil, nome, email FROM usuario WHERE email = ? AND senha = ?;`;
    return database.executar(instrucaoSQL, [email, senha]);
}

module.exports = {
    buscarPorEmail,
    cadastrar,
    autenticar
};
