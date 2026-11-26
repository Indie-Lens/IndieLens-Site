const database = require("../database/config");

const camposSelect = `
    id_live AS idLive,
    id_streamer AS idStreamer,
    nome_jogo AS nomeJogo,
    categoria,
    titulo_live AS tituloLive,
    descricao,
    DATE_FORMAT(data_live, '%Y-%m-%d') AS dataLive,
    TIME_FORMAT(hora_inicio, '%H:%i:%s') AS horaInicio,
    TIME_FORMAT(hora_termino, '%H:%i:%s') AS horaTermino,
    duracao,
    media_espectadores AS mediaEspectadores,
    pico_espectadores AS picoEspectadores,
    visualizacoes_totais AS visualizacoesTotais,
    novos_seguidores AS novosSeguidores,
    nota_avaliacao AS notaAvaliacao,
    engajamento_chat AS engajamentoChat,
    ponto_alto AS pontoAlto,
    ponto_melhoria AS pontoMelhoria,
    data_registro AS dataRegistro
`;

function listarPorStreamer(idStreamer) {
    const instrucaoSQL = `
        SELECT ${camposSelect}
        FROM live
        WHERE id_streamer = ?
        ORDER BY data_live DESC, hora_inicio DESC, id_live DESC;
    `;

    return database.executar(instrucaoSQL, [idStreamer]);
}

function buscarPorId(idLive, idStreamer) {
    const instrucaoSQL = `
        SELECT ${camposSelect}
        FROM live
        WHERE id_live = ? AND id_streamer = ?
        LIMIT 1;
    `;

    return database.executar(instrucaoSQL, [idLive, idStreamer]);
}

function cadastrar(dados) {
    const instrucaoSQL = `
        INSERT INTO live (
            id_streamer,
            nome_jogo,
            categoria,
            titulo_live,
            descricao,
            data_live,
            hora_inicio,
            hora_termino,
            duracao,
            media_espectadores,
            pico_espectadores,
            visualizacoes_totais,
            novos_seguidores,
            nota_avaliacao,
            engajamento_chat,
            ponto_alto,
            ponto_melhoria,
            data_registro
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
    `;

    const valores = [
        dados.idStreamer,
        dados.nomeJogo,
        dados.categoria,
        dados.tituloLive,
        dados.descricao,
        dados.dataLive,
        dados.horaInicio,
        dados.horaTermino,
        dados.duracao,
        dados.mediaEspectadores,
        dados.picoEspectadores,
        dados.visualizacoesTotais,
        dados.novosSeguidores,
        dados.notaAvaliacao,
        dados.engajamentoChat,
        dados.pontoAlto,
        dados.pontoMelhoria
    ];

    return database.executar(instrucaoSQL, valores);
}

function atualizar(idLive, idStreamer, dados) {
    const instrucaoSQL = `
        UPDATE live SET
            nome_jogo = ?,
            categoria = ?,
            titulo_live = ?,
            descricao = ?,
            data_live = ?,
            hora_inicio = ?,
            hora_termino = ?,
            duracao = ?,
            media_espectadores = ?,
            pico_espectadores = ?,
            visualizacoes_totais = ?,
            novos_seguidores = ?,
            nota_avaliacao = ?,
            engajamento_chat = ?,
            ponto_alto = ?,
            ponto_melhoria = ?
        WHERE id_live = ? AND id_streamer = ?;
    `;

    const valores = [
        dados.nomeJogo,
        dados.categoria,
        dados.tituloLive,
        dados.descricao,
        dados.dataLive,
        dados.horaInicio,
        dados.horaTermino,
        dados.duracao,
        dados.mediaEspectadores,
        dados.picoEspectadores,
        dados.visualizacoesTotais,
        dados.novosSeguidores,
        dados.notaAvaliacao,
        dados.engajamentoChat,
        dados.pontoAlto,
        dados.pontoMelhoria,
        idLive,
        idStreamer
    ];

    return database.executar(instrucaoSQL, valores);
}

function excluir(idLive, idStreamer) {
    const instrucaoSQL = `
        DELETE FROM live
        WHERE id_live = ? AND id_streamer = ?;
    `;

    return database.executar(instrucaoSQL, [idLive, idStreamer]);
}

module.exports = {
    listarPorStreamer,
    buscarPorId,
    cadastrar,
    atualizar,
    excluir
};
