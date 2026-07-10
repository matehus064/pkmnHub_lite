var avisoModel = require("../models/avisoModel");

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
            .then(function (resultado) {

                // ----- CARTA JÁ EXISTE: -----
                if (resultado.length == 1) {
                    let idCarta = resultado[0].id;

                    avisoModel.verificarCartaNaColecaoPorId(usuarioServer, idCarta)
                        .then(function (resultadoColecao) {
                            if (resultadoColecao.length > 0) {
                                return avisoModel.somarQuantidadeCompra(usuarioServer, idCarta, qntCartaServer, valorCompraServer, menorLigaServer);
                            } else {
                                return avisoModel.adicionarNaColecao(usuarioServer, idCarta, qntCartaServer, valorCompraServer, menorLigaServer);
                            }
                        })
                        .then(function (resultadoAcao) {
                            res.json(resultadoAcao);
                            avisoModel.registrarTransacao(usuarioServer, 'compra', valorCompraServer);

                            avisoModel.buscarValorTotalColecao(usuarioServer)
                                .then(function (resultadoValor) {
                                    let valorTotal = resultadoValor[0].valor_total_colecao;
                                    avisoModel.salvarSnapshot(usuarioServer, valorTotal);
                                });
                        })
                        .catch(function (erro) {
                            console.log("Erro na coleção:", erro);
                            res.status(500).json(erro.sqlMessage);
                        });

                    // ----- CARTA NÃO EXISTE NO BD, CADASTRA E ADICIONA: -----
                } else if (resultado.length == 0) {
                    let idCartaNova;

                    avisoModel.cadastrar(nomeCartaServer, setCartaServer, numeroCartaServer, imagemCartaServer)
                        .then(function (resultadoCadastro) {
                            idCartaNova = resultadoCadastro.insertId;
                            return avisoModel.adicionarNaColecao(usuarioServer, idCartaNova, qntCartaServer, valorCompraServer, menorLigaServer);
                        })
                        .then(function (resultadoAcao) {
                            res.json(resultadoAcao);
                            avisoModel.registrarTransacao(usuarioServer, 'compra', valorCompraServer);

                            avisoModel.buscarValorTotalColecao(usuarioServer)
                                .then(function (resultadoValor) {
                                    let valorTotal = resultadoValor[0].valor_total_colecao;
                                    avisoModel.salvarSnapshot(usuarioServer, valorTotal);
                                });
                        })
                        .catch(function (erro) {
                            console.log("Erro no cadastro:", erro);
                            res.status(500).json(erro.sqlMessage);
                        });
                }
            })
            .catch(function (erro) {
                console.log("Erro ao buscar carta:", erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function deletar(req, res) {
    var usuarioServer = req.body.usuario;
    var nomeCartaServer = req.body.nome_carta;
    var setCartaServer = req.body.nome_set;
    var numeroCartaServer = req.body.numero_set;
    var qntCartaServer = req.body.quantidade;
    var valorVendaServer = req.body.preco_venda;
    var menorLigaServer = req.body.preco_ligaPkmn;

    if (nomeCartaServer == undefined) {
        res.status(400).send("O nome do Pokémon não foi definido!");
    } else if (numeroCartaServer == undefined) {
        res.status(400).send("O número da carta no set não foi definido!");
    } else if (qntCartaServer == undefined) {
        res.status(400).send("A quantidade de cartas não foi definida!");
    } else if (valorVendaServer == undefined) {
        res.status(400).send("O valor de venda da carta não foi definido!");
    } else if (menorLigaServer == undefined) {
        res.status(400).send("O preço de mercado (Liga Pokémon) não foi definido!");
    } else {
        avisoModel.buscarCartaNaColecao(usuarioServer, nomeCartaServer, numeroCartaServer)
            .then(function (resultado) {
                let carta = resultado[0].fk_carta;
                // ----- CARTA ESTÁ NA COLEÇÃO: -----
                if (resultado.length == 1) {

                    // ----- CASO A QUANTIDADE DE VENDA SEJA MENOR QUE A QUANTIDADE NA COLEÇÃO DO USUÁRIO: -----
                    if (resultado[0].quantidade - qntCartaServer > 0) {
                        avisoModel.atualizarQuantidade(usuarioServer, resultado[0].fk_carta, qntCartaServer)
                            .then(function (resultado) {
                                avisoModel.buscarValorTotalColecao(usuarioServer)
                                    .then(function (resultadoValor) {
                                        let valorTotal = resultadoValor[0].valor_total_colecao;
                                        if (valorTotal === null || valorTotal === undefined) {
                                            valorTotal = 0;
                                        }
                                        avisoModel.salvarSnapshot(usuarioServer, valorTotal);
                                    });
                                res.json(resultado);
                                avisoModel.registrarTransacao(usuarioServer, 'venda', valorVendaServer)
                            }).catch(function (erro) {
                                console.log(erro);
                                res.status(500).json(erro.sqlMessage);
                            });

                        // ----- CASO O USUÁRIO VENDA TODAS: -----
                    } else {
                        avisoModel.removerDaColecao(usuarioServer, carta)
                            .then(function (resultado) {
                                avisoModel.buscarValorTotalColecao(usuarioServer)
                                    .then(function (resultadoValor) {
                                        let valorTotal = resultadoValor[0].valor_total_colecao;
                                        if (valorTotal === null || valorTotal === undefined) {
                                            valorTotal = 0;
                                        }
                                        avisoModel.salvarSnapshot(usuarioServer, valorTotal);
                                    });
                                res.json(resultado);
                                avisoModel.registrarTransacao(usuarioServer, 'venda', valorVendaServer)
                            }).catch(function (erro) {
                                console.log(erro);
                                res.status(500).json(erro.sqlMessage);
                            });
                    }
                    // ----- CARTA NÃO ESTÁ NA COLEÇÃO: -----
                } else if (resultado.length == 0) {
                    res.status(404).send("Carta não encontrada na sua coleção!");
                }
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function listarPorUsuario(req, res) {
    var idUsuario = req.params.idUsuario;

    Promise.all([
        avisoModel.buscarTotalCartas(idUsuario),
        avisoModel.buscarTotalCompra(idUsuario),
        avisoModel.buscarTotalVenda(idUsuario),
        avisoModel.buscarCartaMaisCara(idUsuario)
    ]).then(function (resultados) {
        res.json({
            totalCartas: resultados[0],
            totalCompra: resultados[1],
            totalVenda: resultados[2],
            cartaMaisCara: resultados[3]
        })
    }).catch(
        function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao realizar ao buscar as kpis! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}


module.exports = {
    listarPorUsuario,
    pesquisarDescricao,
    publicar,
    editar,
    deletar
}