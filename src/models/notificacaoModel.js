var database = require("../database/config");

function listarPorUsuario(idUsuario) {
    console.log(`
        Listando notificações do usuário:
        ID do Usuário: ${idUsuario}
    `);

    const instrucaoSQL = `
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
        WHERE id_usuario = ? OR id_usuario IS NULL
        ORDER BY data_criacao DESC;
    `;
    return database.executar(instrucaoSQL, [idUsuario]);
}

function contarNaoLidas(idUsuario) {
    console.log(`
        Contando notificações não lidas do usuário:
        ID do Usuário: ${idUsuario}
    `);

    const instrucaoSQL = `
        SELECT COUNT(*) AS total_notificacoes
        FROM notificacao
        WHERE (id_usuario = ? AND lida = 0)
           OR (id_usuario IS NULL AND lida = 0 AND DATEDIFF(CURRENT_TIMESTAMP, data_criacao) <= 7);
    `;
    return database.executar(instrucaoSQL, [idUsuario]);
}

function marcarComoLida(idNotificacao) {
    console.log(`
        Marcando notificação como lida:
        ID da Notificação: ${idNotificacao}
    `);

    const instrucaoSQL = `
        UPDATE notificacao
        SET
            lida = 1,
            data_leitura = CURRENT_TIMESTAMP
        WHERE id_notificacao = ?
          AND id_usuario IS NOT NULL;
    `;
    return database.executar(instrucaoSQL, [idNotificacao]);
}

function marcarTodasComoLidas(idUsuario) {
    console.log(`
        Marcando todas as notificações como lidas:
        ID do Usuário: ${idUsuario}
    `);

    const instrucaoSQL = `
        UPDATE notificacao
        SET
            lida = 1,
            data_leitura = CURRENT_TIMESTAMP
        WHERE id_usuario = ?
          AND lida = 0;
    `;
    return database.executar(instrucaoSQL, [idUsuario]);
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

    const valorUsuario = idUsuario ? Number(idUsuario) : null;
    const valorJogo = idJogo ? Number(idJogo) : null;

    const instrucaoSQL = `
        INSERT INTO notificacao (id_usuario, id_jogo, tipo, titulo, mensagem)
        VALUES (?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSQL, [valorUsuario, valorJogo, tipo, titulo, mensagem]);
}

module.exports = {
    listarPorUsuario,
    contarNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
    cadastrar
};
