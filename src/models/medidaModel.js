var database = require("../database/config");

function buscarUltimasMedidas(usuario, limite_linhas) {
    var instrucaoSql = `SELECT data_snapshot, valor_total FROM snapshot_colecao WHERE fk_usuario = ${usuario} ORDER BY id DESC LIMIT ${limite_linhas}`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMedidasEmTempoReal(usuario) {

    var instrucaoSql = `SELECT data_snapshot, valor_total FROM snapshot_colecao WHERE fk_usuario = ${usuario} ORDER BY id DESC LIMIT 1`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal
}