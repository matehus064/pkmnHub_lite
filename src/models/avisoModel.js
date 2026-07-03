var database = require("../database/config");

function listar() {
    console.log("ACESSEI O AVISO  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar()");
    var instrucaoSql = `
        SELECT 
            a.id AS idAviso,
            a.titulo,
            a.descricao,
            a.fk_usuario,
            u.id AS idUsuario,
            u.nome,
            u.email,
            u.senha
        FROM aviso a
            INNER JOIN usuario u
                ON a.fk_usuario = u.id;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function pesquisarDescricao(texto) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function pesquisarDescricao()");
    var instrucaoSql = `
        SELECT 
            a.id AS idAviso,
            a.titulo,
            a.descricao,
            a.fk_usuario,
            u.id AS idUsuario,
            u.nome,
            u.email,
            u.senha
        FROM aviso a
            INNER JOIN usuario u
                ON a.fk_usuario = u.id
        WHERE a.descricao LIKE '${texto}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarPorUsuario(idUsuario) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listarPorUsuario()");
    var instrucaoSql = `
        SELECT 
            a.id AS idAviso,
            a.titulo,
            a.descricao,
            a.fk_usuario,
            u.id AS idUsuario,
            u.nome,
            u.email,
            u.senha
        FROM aviso a
            INNER JOIN usuario u
                ON a.fk_usuario = u.id
        WHERE u.id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function publicar(titulo, descricao, idUsuario) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function publicar(): ", titulo, descricao, idUsuario);
    var instrucaoSql = `
        INSERT INTO aviso (titulo, descricao, fk_usuario) VALUES ('${titulo}', '${descricao}', ${idUsuario});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editar(novaDescricao, idAviso) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function editar(): ", novaDescricao, idAviso);
    var instrucaoSql = `
        UPDATE aviso SET descricao = '${novaDescricao}' WHERE id = ${idAviso};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar(idAviso) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function deletar():", idAviso);
    var instrucaoSql = `
        DELETE FROM aviso WHERE id = ${idAviso};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

/*======================================
|              ADAPTAÇÃO               |     
======================================*/

function existeCarta(nomeCarta, numeroSet) {
    var instrucaoSql = `
        SELECT id, nome_carta, numero_set FROM cartas WHERE nome_carta = '${nomeCarta}' AND numero_set = '${numeroSet}';
    `;
    return database.executar(instrucaoSql);
}

function cadastrar(nomeCarta, nomeSet, numeroSet, urlImagem) { //OK
    var instrucaoSql = `
        INSERT INTO cartas (nome_carta, nome_set, numero_set, url_imagem) VALUES ('${nomeCarta}', '${nomeSet}', '${numeroSet}', '${urlImagem}');
    `;
    return database.executar(instrucaoSql);
}

function adicionarNaColecao(usuario, carta, quantidade, precoCompra, precoLigaPkmn) {
    var instrucaoSql = `
        INSERT INTO colecao (fk_usuario, fk_carta, quantidade, preco_compra, preco_ligaPkmn) VALUES ('${usuario}', '${carta}', '${quantidade}', '${precoCompra}', '${precoLigaPkmn}');
    `;
    return database.executar(instrucaoSql);
}

function verificarCartaNaColecaoPorId(usuario, carta) {
    var instrucaoSql = `
        SELECT quantidade FROM colecao WHERE fk_usuario = '${usuario}' AND fk_carta = '${carta}';
    `;
    return database.executar(instrucaoSql);
}

function somarQuantidadeCompra(usuario, carta, quantidade, precoCompra, precoLigaPkmn) {
    var instrucaoSql = `
        UPDATE colecao 
        SET quantidade = quantidade + ${quantidade}, 
            preco_compra = '${precoCompra}', 
            preco_ligaPkmn = '${precoLigaPkmn}'
        WHERE fk_usuario = '${usuario}' AND fk_carta = '${carta}';
    `;
    return database.executar(instrucaoSql);
}

function registrarTransacao(usuario, tipoMovimentacao, valorVenda) {
    var instrucaoSql = `
        INSERT INTO transacao (fk_usuario, tipo_movimentacao, valor_transacao) VALUES ('${usuario}', '${tipoMovimentacao}', '${valorVenda}');
    `;
    return database.executar(instrucaoSql);
}

function buscarValorTotalColecao(usuario) {
    var instrucaoSql = `
        SELECT SUM(c.preco_ligaPkmn * c.quantidade) AS valor_total_colecao FROM colecao c JOIN usuario u ON u.id = c.fk_usuario WHERE c.fk_usuario = '${usuario}';
    `;
    return database.executar(instrucaoSql);
}

function salvarSnapshot(usuario, valorTotal) {
    var instrucaoSql = `
        INSERT INTO snapshot_colecao (fk_usuario, valor_total) VALUES ('${usuario}', '${valorTotal}');
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    listar,
    listarPorUsuario,
    pesquisarDescricao,
    publicar,
    editar,
    deletar,
    existeCarta,
    cadastrar,
    adicionarNaColecao,
    verificarCartaNaColecaoPorId,
    somarQuantidadeCompra,
    registrarTransacao,
    buscarValorTotalColecao,
    salvarSnapshot
}
