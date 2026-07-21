    let alteracao = false;
    
    function alterarModal(tipo) {
        let outroTipo = '';
        if (tipo === 'Compra') {
            outroTipo = 'Venda';
        } else {
            outroTipo = 'Compra';
        }

        let modalAtual = document.getElementById(`modal${tipo}`);
        let modalOutro = document.getElementById(`modal${outroTipo}`);
        let botao = document.getElementById(tipo.toLowerCase());
        let outroBotao = document.getElementById(outroTipo.toLowerCase());

        if (modalAtual.style.display === "flex") {
            modalAtual.style.display = "none";
            botao.innerHTML = '>';
        } else {
            modalOutro.style.display = "none";
            modalAtual.style.display = "flex";
            botao.innerHTML = '<';
            outroBotao.innerHTML = '>';
        }

        if (modalOutro.style.display == "none" && modalAtual.style.display == "none" && alteracao == true) {
            window.location.reload();
        }
    }

    function mensagemTemporizada(div, mensagem) {
        div.innerHTML = mensagem;
        setTimeout(() => {
            div.innerHTML = "";
        }, 5500);
    }

    function limparFormulario(tipo) {
        document.getElementById(`ipt_nome${tipo}`).value = '';
        document.getElementById(`ipt_numero${tipo}`).value = '';
        document.getElementById(`ipt_set${tipo}`).value = '';
        document.getElementById(`ipt_valor${tipo}`).value = 0;
        document.getElementById(`ipt_precoLiga${tipo}`).value = 0;
        document.getElementById(`ipt_qtd${tipo}`).value = 1;
        document.getElementById(`img_carta${tipo}`).style.opacity = 0;
    }

    function validandoImagem(numero, expansao, tipo) {
        let num = numero.value;

        let numCarta = Number(num.substring(0, 3));
        let numSetTotal = num.substring(4, 7);
        let cartasEncontradas = [];

        if (num.length < 7) {
            return false;
        }

        for (let setId in dadosCartas) {
            let cartas = dadosCartas[setId];
            for (let j = 0; j < cartas.length; j++) {
                if (Number(cartas[j].number) === numCarta && Number(cartas[j].numSet) === Number(numSetTotal)) {
                    cartasEncontradas.push(cartas[j]);
                    break;
                }
            }
        }

        let divMensagem = document.getElementById(`div_validacao${tipo}`)

        if (cartasEncontradas.length == 0) {
            mensagemTemporizada(divMensagem, "<span style='color: #EE3D2D'>Número de set inválido!</span>");
            return false;
        }

        if (cartasEncontradas.length > 1) {
            mensagemTemporizada(divMensagem, "<span style='color: #EE3D2D'>Múltiplos sets encontrados, insira a expansão!</span>");
            console.log(cartasEncontradas);
        }

        if (expansao) {
            for (let i = 0; i < cartasEncontradas.length; i++) {
                let set = null;
                for (let j = 0; j < sets.length; j++) {
                    if (sets[j].apiId === cartasEncontradas[i].setId) {
                        set = sets[j];
                        break;
                    }
                }
                if (set && (
                    expansao.value === set.nomePt ||
                    expansao.value === set.nomeEn ||
                    expansao.value === set.sigla
                )) {
                    cartasEncontradas = [cartasEncontradas[i]];
                    console.log(cartasEncontradas);
                    break;
                }
            }
        }

        if (cartasEncontradas.length !== 1) return false;
        let carta = cartasEncontradas[0];

        document.getElementById(`ipt_nome${tipo}`).value = carta.name;
        document.getElementById(`ipt_set${tipo}`).value = carta.setNameEn;
        document.getElementById(`img_carta${tipo}`).src = `https://images.scrydex.com/pokemon/${carta.setId}-${numCarta}/small`;
        document.getElementById(`img_carta${tipo}`).style.opacity = 1;
    }

        function publicar() {
        let usuario = sessionStorage.ID_USER;
        let nome_carta = document.getElementById(`ipt_nomeCompra`).value;
        let numero_set = document.getElementById(`ipt_numeroCompra`).value;
        let nome_set = document.getElementById(`ipt_setCompra`).value;
        let url_imagem = document.getElementById(`img_cartaCompra`).src;

        let preco_compra = document.getElementById(`ipt_valorCompra`).value;
        let preco_ligaPkmn = document.getElementById(`ipt_precoLigaCompra`).value;
        let quantidade = document.getElementById(`ipt_qtdCompra`).value;

        fetch(`/avisos/publicar/${usuario}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario,
                nome_carta: nome_carta,
                nome_set: nome_set,
                numero_set: numero_set,
                quantidade: quantidade,
                preco_compra: preco_compra,
                preco_ligaPkmn: preco_ligaPkmn,
                url_imagem: url_imagem
            }),
        }).then(function (resposta) {

            console.log("resposta: ", resposta);

            if (resposta.ok) {
                mensagemTemporizada(div_validacaoCompra, "<span style='color: #2ECC71'>Aquisição cadastrada com sucesso!</span>");
                limparFormulario('Compra');
                alteracao = true;
            } else if (resposta.status == 404) {
                mensagemTemporizada(div_validacaoCompra, "<span style='color: #EE3D2D'>Não foi possível realizar o cadastro, preencha todos os campos!</span>");
            } else {
                throw ("Houve um erro ao tentar realizar a postagem! Código da resposta: " + resposta.status);
            }
        }).catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

        return false;
    }

    function deletar() {
        let usuario = sessionStorage.ID_USER;
        let nome_carta = document.getElementById(`ipt_nomeVenda`).value;
        let numero_set = document.getElementById(`ipt_numeroVenda`).value;
        let nome_set = document.getElementById(`ipt_setVenda`).value;

        let preco_venda = document.getElementById(`ipt_valorVenda`).value;
        let preco_ligaPkmn = document.getElementById(`ipt_precoLigaVenda`).value;
        let quantidade = document.getElementById(`ipt_qtdVenda`).value;

        fetch(`/avisos/deletar/${usuario}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario,
                nome_carta: nome_carta,
                nome_set: nome_set,
                numero_set: numero_set,
                quantidade: quantidade,
                preco_venda: preco_venda,
                preco_ligaPkmn: preco_ligaPkmn
            }),
        }).then(function (resposta) {

            console.log("resposta: ", resposta);

            if (resposta.ok) {
                mensagemTemporizada(div_validacaoVenda, "<span style='color: #2ECC71'>Venda realizada com sucesso!</span>")
                limparFormulario('Venda');
                alteracao = true;
            } else if (resposta.status == 404) { 
                mensagemTemporizada(div_validacaoVenda, "<span style='color: #EE3D2D'>Não foi possível realizar o cadastro, preencha todos os campos!</span>");
            } else {
                throw ("Houve um erro ao tentar realizar a postagem! Código da resposta: " + resposta.status);
            }
        }).catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

        return false;
    }

        function alterarModalCarta(imagem) {
        let imagemSrc = imagem.src;

        img_modalCarta.src = imagemSrc.replace("small", "large");

        if (modalCarta.style.display == "flex") {
            modalCarta.style.display = "none";
        } else {
            modalCarta.style.display = "flex";
        }
    }