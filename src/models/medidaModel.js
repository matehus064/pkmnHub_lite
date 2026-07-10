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

function buscarTotalCartas(usuario) {
    var instrucaoSql = `
        SELECT SUM(quantidade) AS total_cartas_fisicas FROM colecao WHERE fk_usuario = ${usuario};
    `;
    return database.executar(instrucaoSql);
}

function buscarTotalCompra(usuario) {
    var instrucaoSql = `
        SELECT SUM(valor_transacao) AS total_compra FROM transacao WHERE fk_usuario = ${usuario} AND tipo_movimentacao = 'compra';
    `;
    return database.executar(instrucaoSql);
}

function buscarTotalVenda(usuario) {
    var instrucaoSql = `
        SELECT SUM(valor_transacao) AS total_venda FROM transacao WHERE fk_usuario = ${usuario} AND tipo_movimentacao = 'venda';
    `;
    return database.executar(instrucaoSql);
}

function buscarCartaMaisCara(usuario) {
    var instrucaoSql = `
        SELECT b.nome_carta, b.nome_set, b.url_imagem, c.preco_ligaPkmn FROM colecao AS c 
        JOIN cartas AS b ON c.fk_carta = b.id 
        WHERE c.fk_usuario = ${usuario}
        ORDER BY c.preco_ligaPkmn DESC LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal,
    buscarTotalCartas,
    buscarTotalCompra,
    buscarTotalVenda,
    buscarCartaMaisCara
}
