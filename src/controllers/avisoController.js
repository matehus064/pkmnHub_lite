var avisoModel = require("../models/avisoModel");

function listar(req, res) {
    avisoModel.listar().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function listarPorUsuario(req, res) {
    var idUsuario = req.params.idUsuario;

    avisoModel.listarPorUsuario(idUsuario)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado encontrado!");
                }
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "Houve um erro ao buscar os avisos: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function pesquisarDescricao(req, res) {
    var descricao = req.params.descricao;

    avisoModel.pesquisarDescricao(descricao)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado encontrado!");
                }
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function editar(req, res) {
    var novaDescricao = req.body.descricao;
    var idAviso = req.params.idAviso;

    avisoModel.editar(novaDescricao, idAviso)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao realizar o post: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );

}

function deletar(req, res) {
    var idAviso = req.params.idAviso;

    avisoModel.deletar(idAviso)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao deletar o post: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}



/*======================================
|              ADAPTAÇÃO               |     
======================================*/

function publicar(req, res) {
    var usuarioServer = req.body.usuario;
    var nomeCartaServer = req.body.nome_carta;
    var setCartaServer = req.body.nome_set;
    var numeroCartaServer = req.body.numero_set;
    var qntCartaServer = req.body.quantidade;
    var valorCompraServer = req.body.preco_compra;
    var menorLigaServer = req.body.preco_ligaPkmn;
    var imagemCartaServer = req.body.url_imagem;

    console.log(usuarioServer,
                nomeCartaServer,
                setCartaServer,
                numeroCartaServer,
                qntCartaServer,
                valorCompraServer,
                menorLigaServer,
                imagemCartaServer);

    if (nomeCartaServer == undefined) {
        res.status(400).send("O nome do Pokémon não foi definido!");
    } else if (setCartaServer == undefined) {
        res.status(400).send("A coleção (set) da carta não foi definida!");
    } else if (numeroCartaServer == undefined) {
        res.status(400).send("O número da carta no set não foi definido!");
    } else if (qntCartaServer == undefined) {
        res.status(400).send("A quantidade de cartas não foi definida!");
    } else if (valorCompraServer == undefined) {
        res.status(400).send("O valor de compra da carta não foi definido!");
    } else if (menorLigaServer == undefined) {
        res.status(400).send("O preço de mercado (Liga Pokémon) não foi definido!");
    } else if (imagemCartaServer == undefined) {
        res.status(400).send("A URL da imagem da carta está faltando!");
    } else {
        avisoModel.existeCarta(nomeCartaServer, numeroCartaServer)
            .then(function(resultado) {

                // ----- CARTA JÁ EXISTE: -----
                if (resultado.length == 1) {
                    let idCarta = resultado[0].id;

                    avisoModel.verificarCartaNaColecaoPorId(usuarioServer, idCarta)
                        .then(function(resultadoColecao) {
                            if (resultadoColecao.length > 0) {
                                return avisoModel.somarQuantidadeCompra(usuarioServer, idCarta, qntCartaServer, valorCompraServer, menorLigaServer);
                            } else {
                                return avisoModel.adicionarNaColecao(usuarioServer, idCarta, qntCartaServer, valorCompraServer, menorLigaServer);
                            }
                        })
                        .then(function(resultadoAcao) {
                            res.json(resultadoAcao);
                            avisoModel.registrarTransacao(usuarioServer, 'compra', valorCompraServer);

                            avisoModel.buscarValorTotalColecao(usuarioServer)
                                .then(function(resultadoValor) {
                                    let valorTotal = resultadoValor[0].valor_total_colecao;
                                    avisoModel.salvarSnapshot(usuarioServer, valorTotal);
                                });
                        })
                        .catch(function(erro) {
                            console.log("Erro na coleção:", erro);
                            res.status(500).json(erro.sqlMessage);
                        });

                // ----- CARTA NÃO EXISTE NO BD, CADASTRA E ADICIONA: -----
                } else if (resultado.length == 0) {
                    let idCartaNova;

                    avisoModel.cadastrar(nomeCartaServer, setCartaServer, numeroCartaServer, imagemCartaServer)
                        .then(function(resultadoCadastro) {
                            idCartaNova = resultadoCadastro.insertId;
                            return avisoModel.adicionarNaColecao(usuarioServer, idCartaNova, qntCartaServer, valorCompraServer, menorLigaServer);
                        })
                        .then(function(resultadoAcao) {
                            res.json(resultadoAcao);
                            avisoModel.registrarTransacao(usuarioServer, 'compra', valorCompraServer);

                            avisoModel.buscarValorTotalColecao(usuarioServer)
                                .then(function(resultadoValor) {
                                    let valorTotal = resultadoValor[0].valor_total_colecao;
                                    avisoModel.salvarSnapshot(usuarioServer, valorTotal);
                                });
                        })
                        .catch(function(erro) {
                            console.log("Erro no cadastro:", erro);
                            res.status(500).json(erro.sqlMessage);
                        });
                }
            })
            .catch(function(erro) {
                console.log("Erro ao buscar carta:", erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}




module.exports = {
    listar,
    listarPorUsuario,
    pesquisarDescricao,
    publicar,
    editar,
    deletar
}