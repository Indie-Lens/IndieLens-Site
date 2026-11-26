require("dotenv").config({ path: ".env.dev" });
const db = require("./src/database/config");

/*
 * Popula o catálogo de jogos com 8 títulos indie em 2 registros temporais
 * (semana passada = id_registro 1, semana atual = id_registro 2).
 * Isso permite comparar evolução e usar MAX(id_registro) como "atual".
 */

const jogos = [
    { id: 1,  nome: 'Hollow Knight: Silksong', dev: 'Team Cherry',        idade: 10, donos: 2800000, preco: 99.00,  lanc: '2025-09-14',
      generos: 'Metroidvania, Ação, Aventura', tags: 'Metroidvania, Difícil, Indie, Pixel Art', categorias: 'Um jogador',
      desc: 'Explore um vasto reino em um metroidvania desafiador, com combate preciso e mundo interligado.',
      site: 'hollowknight.com', desconto: 0, site_img: 'Hollow.jpg',
      r1: { ccu: 395000, pos: 118000, neg: 2400, score: 92, meta: 90, rec: 120000, conq: 60, dlc: 0, donos: 2500000, htotal: 44, hduas: 12 },
      r2: { ccu: 430000, pos: 129800, neg: 2600, score: 94, meta: 92, rec: 131000, conq: 63, dlc: 0, donos: 2800000, htotal: 48, hduas: 20 } },

    { id: 2,  nome: 'Hades',                    dev: 'Supergiant Games',   idade: 16, donos: 4000000, preco: 44.99,  lanc: '2020-09-17',
      generos: 'Roguelike, Ação, RPG', tags: 'Roguelike, Ação, Indie, História Rica', categorias: 'Um jogador',
      desc: 'Desafie o deus da morte em batalhas roguelike frenéticas com narrativa envolvente.',
      site: 'supergiantgames.com', desconto: 50, site_img: 'Hades.jpg',
      r1: { ccu: 240000, pos: 125000, neg: 2500, score: 93, meta: 93, rec: 118000, conq: 49, dlc: 0, donos: 3900000, htotal: 46, hduas: 10 },
      r2: { ccu: 280000, pos: 129800, neg: 2600, score: 93, meta: 93, rec: 121000, conq: 49, dlc: 0, donos: 4000000, htotal: 48, hduas: 14 } },

    { id: 3,  nome: 'Stardew Valley',           dev: 'ConcernedApe',       idade: 0,  donos: 30000000, preco: 24.99, lanc: '2016-02-26',
      generos: 'Simulação, RPG', tags: 'Fazenda, Simulação, Relaxante, Indie', categorias: 'Um jogador, Multijogador',
      desc: 'Gerencie sua fazenda, cultive amizades e explore masmorras em um RPG de simulação.',
      site: 'stardewvalley.net', desconto: 40, site_img: 'StardewValleyBanner.png',
      r1: { ccu: 150000, pos: 740000, neg: 23000, score: 97, meta: 89, rec: 700000, conq: 40, dlc: 0, donos: 29000000, htotal: 125, hduas: 18 },
      r2: { ccu: 180000, pos: 756600, neg: 23400, score: 97, meta: 89, rec: 712000, conq: 40, dlc: 0, donos: 30000000, htotal: 130, hduas: 22 } },

    { id: 4,  nome: 'Cuphead',                  dev: 'Studio MDHR',        idade: 12, donos: 6000000, preco: 39.99,  lanc: '2017-09-29',
      generos: 'Ação, Run & Gun', tags: 'Difícil, Ação, Arte Única, Indie', categorias: 'Um jogador, Co-op',
      desc: 'Run-and-gun com arte estilo anos 30 e chefes desafiadores.',
      site: 'cupheadgame.com', desconto: 40, site_img: 'Cuphead.jpg',
      r1: { ccu: 85000, pos: 90000, neg: 6800, score: 90, meta: 88, rec: 85000, conq: 34, dlc: 1, donos: 5900000, htotal: 15, hduas: 6 },
      r2: { ccu: 98000, pos: 91300, neg: 6900, score: 90, meta: 88, rec: 86000, conq: 34, dlc: 1, donos: 6000000, htotal: 16, hduas: 9 } },

    { id: 5,  nome: 'Dave the Diver',           dev: 'MINTROCKET',         idade: 0,  donos: 3000000, preco: 59.99,  lanc: '2023-06-28',
      generos: 'Aventura, Casual, RPG', tags: 'Casual, Aventura, Culinária, Indie', categorias: 'Um jogador',
      desc: 'Mergulhe no oceano de dia e gerencie um restaurante de sushi à noite.',
      site: 'mintrocket.nexon.com', desconto: 0, site_img: 'DaveTheDiver.jpg',
      r1: { ccu: 130000, pos: 83000, neg: 3400, score: 96, meta: 90, rec: 80000, conq: 52, dlc: 0, donos: 2900000, htotal: 36, hduas: 14 },
      r2: { ccu: 150000, pos: 84900, neg: 3500, score: 96, meta: 90, rec: 82000, conq: 52, dlc: 0, donos: 3000000, htotal: 38, hduas: 17 } },

    { id: 6,  nome: 'Celeste',                  dev: 'Maddy Makes Games',  idade: 0,  donos: 1000000, preco: 34.99,  lanc: '2018-01-25',
      generos: 'Plataforma, Indie', tags: 'Difícil, Narrativa, Plataforma, Indie', categorias: 'Um jogador',
      desc: 'Ajude Madeline a escalar uma montanha em um plataforma de precisão com narrativa emocional.',
      site: 'celestegame.com', desconto: 60, site_img: 'celeste-e1534205369647.jpg',
      r1: { ccu: 7500, pos: 100000, neg: 1000, score: 99, meta: 92, rec: 98000, conq: 25, dlc: 0, donos: 980000, htotal: 9, hduas: 3 },
      r2: { ccu: 8700, pos: 101500, neg: 1000, score: 99, meta: 92, rec: 99500, conq: 25, dlc: 0, donos: 1000000, htotal: 10, hduas: 4 } },

    { id: 7,  nome: 'Undertale',                dev: 'Toby Fox',           idade: 10, donos: 5000000, preco: 19.99,  lanc: '2015-09-15',
      generos: 'RPG, Indie', tags: 'Narrativa, RPG, Cult, Indie', categorias: 'Um jogador',
      desc: 'RPG onde cada escolha muda o jogo. Narrativa impactante e comunidade fiel.',
      site: 'undertale.com', desconto: 0, site_img: 'tela.jpg',
      r1: { ccu: 9000, pos: 213000, neg: 4300, score: 98, meta: 92, rec: 210000, conq: 10, dlc: 0, donos: 4900000, htotal: 8, hduas: 2 },
      r2: { ccu: 11000, pos: 215600, neg: 4400, score: 98, meta: 92, rec: 212000, conq: 10, dlc: 0, donos: 5000000, htotal: 8, hduas: 3 } },

    { id: 8,  nome: 'Dead Cells',               dev: 'Motion Twin',        idade: 16, donos: 5000000, preco: 44.99,  lanc: '2018-08-07',
      generos: 'Roguelike, Metroidvania, Ação', tags: 'Roguelike, Ação, Metroidvania, Difícil', categorias: 'Um jogador',
      desc: 'Metroidvania roguelike de ação frenética com progressão permanente.',
      site: 'deadcells.com', desconto: 35, site_img: 'MeninaJogando.jpg',
      r1: { ccu: 68000, pos: 134000, neg: 8600, score: 94, meta: 89, rec: 130000, conq: 60, dlc: 4, donos: 4900000, htotal: 33, hduas: 11 },
      r2: { ccu: 76000, pos: 136300, neg: 8700, score: 94, meta: 89, rec: 133000, conq: 60, dlc: 4, donos: 5000000, htotal: 35, hduas: 13 } }
];

function taxa(pos, neg) {
    const total = pos + neg;
    return total === 0 ? 0 : Math.round((pos / total) * 10000) / 100;
}

async function run() {
    console.log("Limpando catálogo de jogos antigo...");
    await db.executar("SET FOREIGN_KEY_CHECKS = 0;");
    for (const t of ['jogo_metricas','jogo_detalhes','jogo_auxiliar','jogo_midia','jogo_playtime','jogo_main','registro']) {
        await db.executar(`DELETE FROM ${t};`);
    }
    await db.executar("SET FOREIGN_KEY_CHECKS = 1;");

    console.log("Inserindo registros temporais...");
    await db.executar(
        "INSERT INTO registro (id_registro, dataResgistro, dataMetrica) VALUES (1, NOW() - INTERVAL 7 DAY, CURDATE() - INTERVAL 7 DAY), (2, NOW(), CURDATE());"
    );

    for (const j of jogos) {
        for (const reg of [1, 2]) {
            const m = reg === 1 ? j.r1 : j.r2;

            await db.executar(
                `INSERT INTO jogo_main (id_jogo, id_registro, nome, desenvolvedor, idade_minima, proprietarios_estimados, preco, data_lancamento)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                [j.id, reg, j.nome, j.dev, j.idade, m.donos, j.preco, j.lanc]
            );

            await db.executar(
                `INSERT INTO jogo_metricas (id_jogo, id_registro, peak_CCU, qtd_donos, nota_score, nota_usuarios, nota_metacritic, qtd_dlc, qtd_conquistas, qtd_recomendacoes, avaliacoes_positivas, avaliacoes_negativas)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [j.id, reg, m.ccu, m.donos, m.score, m.score, m.meta, m.dlc, m.conq, m.rec, m.pos, m.neg]
            );

            await db.executar(
                `INSERT INTO jogo_detalhes (id_registro, id_jogo, tags, generos, descricao, categorias, publicante, jogo_anotacoes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                [reg, j.id, j.tags, j.generos, j.desc, j.categorias, j.dev, null]
            );

            await db.executar(
                `INSERT INTO jogo_auxiliar (id_jogo, id_registro, url_suporte, site_oficial, email_suporte, url_metacritic, usuario_review, desconto_pct)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                [j.id, reg, 'https://' + j.site + '/suporte', 'https://' + j.site, 'suporte@' + j.site, 'https://metacritic.com', null, reg === 2 ? j.desconto : 0]
            );

            await db.executar(
                `INSERT INTO jogo_midia (id_jogo, id_registro, videos_URL, imagem_cabecalho, capturas_tela_URL)
                 VALUES (?, ?, ?, ?, ?);`,
                [j.id, reg, null, '../../assets/imgs/' + j.site_img, '../../assets/imgs/' + j.site_img]
            );

            await db.executar(
                `INSERT INTO jogo_playtime (id_jogo, id_registro, media_horas_total, mediana_horas_total, media_horas_duas_semanas, mediana_horas_duas_semanas)
                 VALUES (?, ?, ?, ?, ?, ?);`,
                [j.id, reg, m.htotal, Math.round(m.htotal * 0.8), m.hduas, Math.round(m.hduas * 0.8)]
            );
        }
    }

    const total = await db.executar("SELECT COUNT(*) AS n FROM jogo_main;");
    console.log(`\nOK — ${jogos.length} jogos x 2 registros = ${total[0].n} linhas em jogo_main.`);
    process.exit(0);
}

run().catch(e => { console.error("ERRO:", e.sqlMessage || e.message); process.exit(1); });
