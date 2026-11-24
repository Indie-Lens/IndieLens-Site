var database = require("../database/config");

function listarPorUsuario(idUsuario) {
    console.log(`
        Listando notificações do usuário:
        ID do Usuário: ${idUsuario}
    `);

    let instrucaoSQL = `
        SELECT 
            id_notificacao,
            id_usuario,
            id_jogo,
            tipo,
            titulo,
            mensagem,
            data_criacao,
            data_leitura,
            CASE 
                WHEN id_usuario IS NULL AND DATEDIFF(CURRENT_TIMESTAMP, data_criacao) > 7 THEN 1
                ELSE lida
            END AS lida
        FROM notificacao
        WHERE id_usuario = ${idUsuario} OR id_usuario IS NULL
        ORDER BY data_criacao DESC;
    `;
    return database.executar(instrucaoSQL);
}

function contarNaoLidas(idUsuario) {
    console.log(`
        Contando notificações não lidas do usuário:
        ID do Usuário: ${idUsuario}
    `);

    let instrucaoSQL = `
        SELECT COUNT(*) AS total_notificacoes
        FROM notificacao
        WHERE (id_usuario = ${idUsuario} AND lida = 0)
           OR (id_usuario IS NULL AND DATEDIFF(CURRENT_TIMESTAMP, data_criacao) <= 7);
    `;
    return database.executar(instrucaoSQL);
}

function marcarComoLida(idNotificacao) {
    console.log(`
        Marcando notificação como lida:
        ID da Notificação: ${idNotificacao}
    `);

    let instrucaoSQL = `
        UPDATE notificacao
        SET
            lida = 1,
            data_leitura = CURRENT_TIMESTAMP
        WHERE id_notificacao = ${idNotificacao}
          AND id_usuario IS NOT NULL;
    `;
    return database.executar(instrucaoSQL);
}

function marcarTodasComoLidas(idUsuario) {
    console.log(`
        Marcando todas as notificações como lidas:
        ID do Usuário: ${idUsuario}
    `);

    let instrucaoSQL = `
        UPDATE notificacao
        SET
            lida = 1,
            data_leitura = CURRENT_TIMESTAMP
        WHERE id_usuario = ${idUsuario}
          AND lida = 0;
    `;
    return database.executar(instrucaoSQL);
}

function cadastrar(idUsuario, idJogo, tipo, titulo, mensagem) {
    console.log(`
        Realizando cadastro de notificação:
        ID do Usuário: ${idUsuario},
        ID do Jogo: ${idJogo},
        Tipo: ${tipo},
        Título: ${titulo},
        Mensagem: ${mensagem}
    `);

    let valorUsuario = idUsuario ? idUsuario : "NULL";
    let valorJogo = idJogo ? idJogo : "NULL";

    let instrucaoSQL = `
        INSERT INTO notificacao (id_usuario, id_jogo, tipo, titulo, mensagem)
        VALUES (${valorUsuario}, ${valorJogo}, "${tipo}", "${titulo}", "${mensagem}");
    `;
    return database.executar(instrucaoSQL);
}

module.exports = {
    listarPorUsuario,
    contarNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
    cadastrar
};
