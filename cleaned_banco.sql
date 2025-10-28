CREATE DATABASE IF NOT EXISTS barbershop;
USE barbershop;

DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS employer;
DROP TABLE IF EXISTS clients;

CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_Cliente       VARCHAR(120)  NOT NULL,
    telefone_Celular    VARCHAR(30)   NOT NULL
);

CREATE TABLE employer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_Funcionario       VARCHAR(120)  NOT NULL,
    cargo_Funcionario      VARCHAR(30)   NOT NULL
);

CREATE TABLE schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_funcionario INT NOT NULL,
    servico VARCHAR(100) NOT NULL,
    data_agendamento DATETIME NOT NULL,
    CONSTRAINT fk_schedule_cliente
        FOREIGN KEY (id_cliente) REFERENCES clients(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_schedule_funcionario
        FOREIGN KEY (id_funcionario) REFERENCES employer(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO clients (nome_Cliente, telefone_Celular)
VALUES ('João Silva', '99999-8888');

INSERT INTO clients (nome_Cliente, telefone_Celular)
VALUES ('Nathalia', '99999-8888');

INSERT INTO clients (nome_Cliente, telefone_Celular)
VALUES ('Caio', '99999-8888');

INSERT INTO employer (nome_Funcionario, cargo_Funcionario)
VALUES ('Maria Souza', 'Cabelereira');

INSERT INTO employer (nome_Funcionario, cargo_Funcionario)
VALUES ('Lorenzo', 'Cabelereiro');

INSERT INTO schedule (id_cliente, id_funcionario, servico, data_agendamento)
VALUES (1, 1, 'Corte de cabelo', '2025-10-28 14:30:00');
