const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const opcoes = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "IndieLens API",
            version: "1.0.0",
            description: "Documentação da API do IndieLens"
        },
        servers: [
            {
                url: "/",
                description: "Servidor atual"
            }
        ],
        components: {
            schemas: {
                LiveInput: {
                    type: "object",
                    required: [
                        "idStreamer", "nomeJogo", "categoria", "tituloLive",
                        "dataLive", "horaInicio", "horaTermino",
                        "mediaEspectadores", "picoEspectadores",
                        "visualizacoesTotais", "novosSeguidores", "notaAvaliacao"
                    ],
                    properties: {
                        idStreamer: { type: "integer", example: 12 },
                        nomeJogo: { type: "string", example: "Hollow Knight" },
                        categoria: { type: "string", example: "Metroidvania" },
                        tituloLive: { type: "string", example: "Rumo ao final" },
                        dataLive: { type: "string", format: "date", example: "2026-11-24" },
                        horaInicio: { type: "string", example: "19:00" },
                        horaTermino: { type: "string", example: "21:30" },
                        mediaEspectadores: { type: "integer", example: 120 },
                        picoEspectadores: { type: "integer", example: 180 },
                        visualizacoesTotais: { type: "integer", example: 950 },
                        novosSeguidores: { type: "integer", example: 14 },
                        notaAvaliacao: { type: "integer", minimum: 1, maximum: 5, example: 4 },
                        descricao: { type: "string" },
                        engajamentoChat: { type: "string" },
                        pontoAlto: { type: "string" },
                        pontoMelhoria: { type: "string" }
                    }
                },
                CadastroUsuario: {
                    type: "object",
                    required: ["nomeServer", "emailServer", "tipoServer", "senhaServer"],
                    properties: {
                        nomeServer: { type: "string", example: "Ana Silva" },
                        emailServer: { type: "string", format: "email", example: "ana@email.com" },
                        tipoServer: { type: "integer", example: 2 },
                        senhaServer: { type: "string", format: "password" }
                    }
                },
                Credenciais: {
                    type: "object",
                    required: ["emailServer", "senhaServer"],
                    properties: {
                        emailServer: { type: "string", format: "email", example: "ana@email.com" },
                        senhaServer: { type: "string", format: "password" }
                    }
                },
                UsuarioAutenticado: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 12 },
                        perfil: { type: "integer", example: 2 },
                        nome: { type: "string", example: "Ana Silva" },
                        email: { type: "string", format: "email", example: "ana@email.com" }
                    }
                },
                SimulacaoInput: {
                    type: "object",
                    required: ["idUsuario", "nome", "preco", "data", "tag", "genero"],
                    properties: {
                        idUsuario: { type: "integer", example: 12 },
                        nome: { type: "string", example: "Meu jogo indie" },
                        preco: { type: "number", format: "double", example: 29.9 },
                        data: { type: "string", format: "date", example: "2026-12-01" },
                        tag: { type: "string", example: "Roguelike, Ação" },
                        genero: { type: "string", example: "Ação" }
                    }
                },
                Simulacao: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 34 },
                        nome: { type: "string", example: "Meu jogo indie" },
                        preco: { type: "number", format: "double", example: 29.9 },
                        data: { type: "string", format: "date", example: "2026-12-01" },
                        tag: { type: "string", example: "Roguelike, Ação" },
                        genero: { type: "string", example: "Ação" }
                    }
                },
                JogoSemelhante: {
                    type: "object",
                    properties: {
                        nome: { type: "string", example: "Jogo parecido" },
                        preco: { type: "number", format: "double", example: 24.9 },
                        data: { type: "string", format: "date", example: "2026-10-15" },
                        descricao: { type: "string", nullable: true },
                        genero: { type: "string" },
                        tag: { type: "string" }
                    }
                },
                Avaliacao: {
                    type: "object",
                    properties: {
                        id_avaliacao: { type: "integer", example: 5 },
                        id_streamer: { type: "integer", example: 12 },
                        id_jogo: { type: "integer", example: 456 },
                        curtido: { type: "integer", enum: [0, 1], example: 1 },
                        lista_desejos: { type: "integer", enum: [0, 1], example: 0 },
                        ja_transmitido: { type: "integer", enum: [0, 1], example: 0 },
                        nota_pessoal: { type: "string", nullable: true, maxLength: 500 },
                        data_criacao: { type: "string", format: "date-time" },
                        data_atualizacao: { type: "string", format: "date-time" }
                    }
                },
                SalvarAvaliacaoInput: {
                    type: "object",
                    required: ["idStreamer", "idJogo"],
                    properties: {
                        idStreamer: { type: "integer", example: 12 },
                        idJogo: { type: "integer", example: 456 },
                        curtido: { type: "boolean", example: true },
                        listaDesejos: { type: "boolean", example: false },
                        jaTransmitido: { type: "boolean", example: false },
                        notaPessoal: { type: "string", nullable: true, maxLength: 500 }
                    }
                },
                ToggleAvaliacaoInput: {
                    type: "object",
                    required: ["idStreamer", "idJogo", "tipo"],
                    properties: {
                        idStreamer: { type: "integer", example: 12 },
                        idJogo: { type: "integer", example: 456 },
                        tipo: {
                            type: "string",
                            enum: ["curtido", "desejos", "transmitido"],
                            example: "curtido"
                        }
                    }
                },
                NotaAvaliacaoInput: {
                    type: "object",
                    required: ["idStreamer", "idJogo"],
                    properties: {
                        idStreamer: { type: "integer", example: 12 },
                        idJogo: { type: "integer", example: 456 },
                        notaPessoal: { type: "string", nullable: true, maxLength: 500 }
                    }
                }
            }
        }
    },
    apis: [
        path.join(__dirname, "routes", "*.js")
            .split(path.sep)
            .join("/")
    ]
};

const especificacao = swaggerJsdoc(opcoes);

module.exports = especificacao;
