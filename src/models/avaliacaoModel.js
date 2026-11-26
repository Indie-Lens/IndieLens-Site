var database = require("../database/config");

function escapar(texto) {
    if (texto === null || texto === undefined) {
        return null;
    }
    return String(texto).replace(/'/g, "''");
}

function buscarPorStreamerEJogo(idStreamer, idJogo) {
    console.log(`Buscando avaliação do streamer ${idStreamer} para o jogo ${idJogo}`);

    let instrucaoSQL = `
        SELECT id_avaliacao, id_streamer, id_jogo, curtido, lista_desejos,
               ja_transmitido, nota_pessoal, data_criacao, data_atualizacao
        FROM avaliacao_jogo
        WHERE id_streamer = ${idStreamer} AND id_jogo = ${idJogo};
    `;
    return database.executar(instrucaoSQL);
}

function listarPorStreamer(idStreamer) {
    console.log(`Listando todas as avaliações do streamer ${idStreamer}`);

    let instrucaoSQL = `
        SELECT id_avaliacao, id_streamer, id_jogo, curtido, lista_desejos,
               ja_transmitido, nota_pessoal, data_criacao, data_atualizacao
        FROM avaliacao_jogo
        WHERE id_streamer = ${idStreamer}
        ORDER BY data_atualizacao DESC;
    `;
    return database.executar(instrucaoSQL);
}

function salvar(idStreamer, idJogo, curtido, listaDesejos, jaTransmitido, notaPessoal) {
    console.log(`Salvando avaliação (upsert) do streamer ${idStreamer} para o jogo ${idJogo}`);

    let nota = notaPessoal ? `'${escapar(notaPessoal)}'` : "NULL";

    let instrucaoSQL = `
        INSERT INTO avaliacao_jogo
            (id_streamer, id_jogo, curtido, lista_desejos, ja_transmitido, nota_pessoal)
        VALUES
            (${idStreamer}, ${idJogo}, ${curtido ? 1 : 0}, ${listaDesejos ? 1 : 0}, ${jaTransmitido ? 1 : 0}, ${nota})
        ON DUPLICATE KEY UPDATE
            curtido = VALUES(curtido),
            lista_desejos = VALUES(lista_desejos),
            ja_transmitido = VALUES(ja_transmitido),
            nota_pessoal = VALUES(nota_pessoal);
    `;
    return database.executar(instrucaoSQL);
}

function toggleCampo(idStreamer, idJogo, campo) {
    console.log(`Alternando "${campo}" do streamer ${idStreamer} para o jogo ${idJogo}`);

    let instrucaoSQL = `
        INSERT INTO avaliacao_jogo (id_streamer, id_jogo, ${campo})
        VALUES (${idStreamer}, ${idJogo}, 1)
        ON DUPLICATE KEY UPDATE ${campo} = 1 - ${campo};
    `;
    return database.executar(instrucaoSQL);
}

function atualizarNota(idStreamer, idJogo, notaPessoal) {
    console.log(`Atualizando nota pessoal do streamer ${idStreamer} para o jogo ${idJogo}`);

    let nota = notaPessoal ? `'${escapar(notaPessoal)}'` : "NULL";

    let instrucaoSQL = `
        INSERT INTO avaliacao_jogo (id_streamer, id_jogo, nota_pessoal)
        VALUES (${idStreamer}, ${idJogo}, ${nota})
        ON DUPLICATE KEY UPDATE nota_pessoal = VALUES(nota_pessoal);
    `;
    return database.executar(instrucaoSQL);
}

function deletar(idStreamer, idJogo) {
    console.log(`Removendo avaliação do streamer ${idStreamer} para o jogo ${idJogo}`);

    let instrucaoSQL = `
        DELETE FROM avaliacao_jogo
        WHERE id_streamer = ${idStreamer} AND id_jogo = ${idJogo};
    `;
    return database.executar(instrucaoSQL);
}

module.exports = {
    buscarPorStreamerEJogo,
    listarPorStreamer,
    salvar,
    toggleCampo,
    atualizarNota,
    deletar
};
