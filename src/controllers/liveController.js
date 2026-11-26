const liveModel = require("../models/liveModel");

function numeroInteiroNaoNegativo(valor) {
    return valor !== undefined && valor !== null && valor !== "" &&
        Number.isInteger(Number(valor)) && Number(valor) >= 0;
}

function idValido(valor) {
    return valor !== undefined && valor !== null && valor !== "" &&
        Number.isInteger(Number(valor)) && Number(valor) > 0;
}

function validarData(data) {
    if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
    const [ano, mes, dia] = data.split("-").map(Number);
    const dataVerificada = new Date(ano, mes - 1, dia);
    return dataVerificada.getFullYear() === ano &&
        dataVerificada.getMonth() === mes - 1 &&
        dataVerificada.getDate() === dia;
}

function validarHora(hora) {
    return typeof hora === "string" && /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(hora);
}

function calcularDuracao(horaInicio, horaTermino) {
    const [horaInicial, minutoInicial] = horaInicio.split(":").map(Number);
    const [horaFinal, minutoFinal] = horaTermino.split(":").map(Number);

    let minutos = (horaFinal * 60 + minutoFinal) - (horaInicial * 60 + minutoInicial);
    if (minutos <= 0) minutos += 24 * 60;

    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${horas}h ${minutosRestantes}min`;
}

function obterCampo(body, camelCase, snakeCase) {
    return body[camelCase] !== undefined ? body[camelCase] : body[snakeCase];
}

function normalizarDados(body) {
    const dados = {
        idStreamer: obterCampo(body, "idStreamer", "id_streamer"),
        nomeJogo: obterCampo(body, "nomeJogo", "nome_jogo"),
        categoria: body.categoria,
        tituloLive: obterCampo(body, "tituloLive", "titulo_live"),
        descricao: body.descricao,
        dataLive: obterCampo(body, "dataLive", "data_live"),
        horaInicio: obterCampo(body, "horaInicio", "hora_inicio"),
        horaTermino: obterCampo(body, "horaTermino", "hora_termino"),
        mediaEspectadores: obterCampo(body, "mediaEspectadores", "media_espectadores"),
        picoEspectadores: obterCampo(body, "picoEspectadores", "pico_espectadores"),
        visualizacoesTotais: obterCampo(body, "visualizacoesTotais", "visualizacoes_totais"),
        novosSeguidores: obterCampo(body, "novosSeguidores", "novos_seguidores"),
        notaAvaliacao: obterCampo(body, "notaAvaliacao", "nota_avaliacao"),
        engajamentoChat: obterCampo(body, "engajamentoChat", "engajamento_chat"),
        pontoAlto: obterCampo(body, "pontoAlto", "ponto_alto"),
        pontoMelhoria: obterCampo(body, "pontoMelhoria", "ponto_melhoria")
    };

    const obrigatorios = [
        ["nomeJogo", dados.nomeJogo],
        ["categoria", dados.categoria],
        ["tituloLive", dados.tituloLive],
        ["dataLive", dados.dataLive],
        ["horaInicio", dados.horaInicio],
        ["horaTermino", dados.horaTermino]
    ];

    const faltando = obrigatorios
        .filter(([, valor]) => typeof valor !== "string" || !valor.trim())
        .map(([campo]) => campo);

    if (faltando.length) {
        return { erro: `Preencha os campos obrigatórios: ${faltando.join(", ")}.` };
    }

    if (!idValido(dados.idStreamer)) return { erro: "Informe um idStreamer válido." };
    if (!validarData(dados.dataLive)) return { erro: "A data deve estar no formato AAAA-MM-DD e ser válida." };
    if (!validarHora(dados.horaInicio) || !validarHora(dados.horaTermino)) {
        return { erro: "Os horários devem estar no formato HH:MM ou HH:MM:SS." };
    }
    const inicioEmMinutos = dados.horaInicio.split(":").slice(0, 2).map(Number);
    const terminoEmMinutos = dados.horaTermino.split(":").slice(0, 2).map(Number);
    if (inicioEmMinutos[0] === terminoEmMinutos[0] && inicioEmMinutos[1] === terminoEmMinutos[1]) {
        return { erro: "O horário de início e término não pode ser igual." };
    }

    const metricas = [
        ["mediaEspectadores", dados.mediaEspectadores],
        ["picoEspectadores", dados.picoEspectadores],
        ["visualizacoesTotais", dados.visualizacoesTotais],
        ["novosSeguidores", dados.novosSeguidores]
    ];

    for (const [campo, valor] of metricas) {
        if (!numeroInteiroNaoNegativo(valor)) {
            return { erro: `${campo} deve ser um número inteiro não negativo.` };
        }
        dados[campo] = Number(valor);
    }

    if (dados.picoEspectadores < dados.mediaEspectadores) {
        return { erro: "O pico de espectadores deve ser maior ou igual à média." };
    }

    if (!Number.isInteger(Number(dados.notaAvaliacao)) ||
        Number(dados.notaAvaliacao) < 1 || Number(dados.notaAvaliacao) > 5) {
        return { erro: "A nota de avaliação deve ser um número inteiro entre 1 e 5." };
    }

    dados.notaAvaliacao = Number(dados.notaAvaliacao);
    dados.nomeJogo = dados.nomeJogo.trim();
    dados.categoria = dados.categoria.trim();
    dados.tituloLive = dados.tituloLive.trim();
    dados.descricao = dados.descricao ? String(dados.descricao).trim() : null;
    dados.engajamentoChat = dados.engajamentoChat ? String(dados.engajamentoChat).trim() : null;
    dados.pontoAlto = dados.pontoAlto ? String(dados.pontoAlto).trim() : null;
    dados.pontoMelhoria = dados.pontoMelhoria ? String(dados.pontoMelhoria).trim() : null;

    if (dados.nomeJogo.length > 100 || dados.categoria.length > 50 ||
        dados.tituloLive.length > 100 || (dados.descricao && dados.descricao.length > 500) ||
        (dados.pontoAlto && dados.pontoAlto.length > 150) ||
        (dados.pontoMelhoria && dados.pontoMelhoria.length > 150)) {
        return { erro: "Um ou mais campos ultrapassaram o limite de caracteres definido no DER." };
    }

    dados.duracao = calcularDuracao(dados.horaInicio, dados.horaTermino);
    if (dados.duracao.length > 20) return { erro: "A duração calculada ultrapassou 20 caracteres." };

    dados.idStreamer = Number(dados.idStreamer);
    return { dados };
}

async function listar(req, res) {
    const idStreamer = req.query.streamerId || req.query.idStreamer;
    if (!idValido(idStreamer)) {
        return res.status(400).json({ mensagem: "Informe um streamerId válido na query string." });
    }

    try {
        const lives = await liveModel.listarPorStreamer(Number(idStreamer));
        return res.status(200).json(lives);
    } catch (erro) {
        console.error("Erro ao listar lives:", erro);
        return res.status(500).json({ mensagem: "Não foi possível listar as lives." });
    }
}

async function buscarPorId(req, res) {
    const idLive = req.params.id;
    const idStreamer = req.query.streamerId || req.query.idStreamer;

    if (!idValido(idLive) || !idValido(idStreamer)) {
        return res.status(400).json({ mensagem: "Informe IDs válidos para a live e o streamer." });
    }

    try {
        const resultado = await liveModel.buscarPorId(Number(idLive), Number(idStreamer));
        if (!resultado.length) return res.status(404).json({ mensagem: "Live não encontrada para esse streamer." });
        return res.status(200).json(resultado[0]);
    } catch (erro) {
        console.error("Erro ao buscar live:", erro);
        return res.status(500).json({ mensagem: "Não foi possível buscar a live." });
    }
}

async function cadastrar(req, res) {
    const validacao = normalizarDados(req.body);
    if (validacao.erro) return res.status(400).json({ mensagem: validacao.erro });

    try {
        const resultado = await liveModel.cadastrar(validacao.dados);
        return res.status(201).json({ mensagem: "Live cadastrada com sucesso.", idLive: resultado.insertId });
    } catch (erro) {
        console.error("Erro ao cadastrar live:", erro);
        return res.status(500).json({ mensagem: "Não foi possível cadastrar a live." });
    }
}

async function atualizar(req, res) {
    const idLive = req.params.id;
    if (!idValido(idLive)) return res.status(400).json({ mensagem: "Informe um id de live válido." });

    const validacao = normalizarDados(req.body);
    if (validacao.erro) return res.status(400).json({ mensagem: validacao.erro });

    try {
        const resultado = await liveModel.atualizar(Number(idLive), validacao.dados.idStreamer, validacao.dados);
        if (!resultado.affectedRows) {
            const existente = await liveModel.buscarPorId(Number(idLive), validacao.dados.idStreamer);
            if (!existente.length) return res.status(404).json({ mensagem: "Live não encontrada para esse streamer." });
        }
        return res.status(200).json({ mensagem: "Live atualizada com sucesso." });
    } catch (erro) {
        console.error("Erro ao atualizar live:", erro);
        return res.status(500).json({ mensagem: "Não foi possível atualizar a live." });
    }
}

async function excluir(req, res) {
    const idLive = req.params.id;
    const idStreamer = req.query.streamerId || req.query.idStreamer || req.body.idStreamer || req.body.id_streamer;

    if (!idValido(idLive) || !idValido(idStreamer)) {
        return res.status(400).json({ mensagem: "Informe IDs válidos para a live e o streamer." });
    }

    try {
        const resultado = await liveModel.excluir(Number(idLive), Number(idStreamer));
        if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Live não encontrada para esse streamer." });
        return res.status(200).json({ mensagem: "Live excluída com sucesso." });
    } catch (erro) {
        console.error("Erro ao excluir live:", erro);
        return res.status(500).json({ mensagem: "Não foi possível excluir a live." });
    }
}

module.exports = { listar, buscarPorId, cadastrar, atualizar, excluir };
