var mysql = require("mysql2");

var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    charset: "utf8mb4"
};

var pool = null;

function obterPool() {
    if (!pool) {
        pool = mysql.createPool({
            ...mySqlConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        pool.on("error", function (erro) {
            console.error("ERRO NO POOL MySQL:", erro && (erro.sqlMessage || erro.message || erro));
        });
    }
    return pool;
}

function executar(instrucao, parametros) {
    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    return new Promise(function (resolve, reject) {
        var dbPool;
        try {
            dbPool = obterPool();
        } catch (erroPool) {
            return reject(erroPool);
        }

        dbPool.query(instrucao, parametros || [], function (erro, resultados) {
            if (erro) {
                return reject(erro);
            }
            resolve(resultados);
        });
    });
}

module.exports = {
    executar
};
