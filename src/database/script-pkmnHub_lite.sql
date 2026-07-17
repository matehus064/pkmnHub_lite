create database if not exists pkmnHub_lite;

use pkmnHub_lite;

create table usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(45) NOT NULL UNIQUE,
    email VARCHAR(65) NOT NULL UNIQUE,
    senha VARCHAR(255),
    foto_perfil INT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table transacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT,
    tipo_movimentacao ENUM('compra', 'venda', 'troca'),
    valor_transacao DECIMAL(10, 2),
    data_movimento DATE DEFAULT (CURRENT_DATE), 
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

create table snapshot_colecao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT,
    valor_total DECIMAL(10, 2),
    data_snapshot DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);

create table cartas (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome_carta VARCHAR(45) NOT NULL,
    nome_set VARCHAR(45),
    numero_set VARCHAR(10),
    url_imagem VARCHAR(255)
);

CREATE TABLE colecao (
    fk_usuario INT,
    fk_carta INT,
    quantidade INT DEFAULT 1,
    preco_compra DECIMAL(10, 2),
    preco_ligaPkmn DECIMAL(10, 2),
    data_adicao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fk_usuario, fk_carta),
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_carta) REFERENCES cartas(id)
);