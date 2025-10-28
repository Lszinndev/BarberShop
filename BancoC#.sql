CREATE DATABASE barbershop;
use barbershop;

SELECT * FROM Appointments;

CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_Cliente       VARCHAR(120)  NOT NULL,
    numero_Telefone    VARCHAR(30)   NOT NULL
);

SELECT * FROM clients;

INSERT INTO clients (nome_Cliente, numero_Telefone, servico_Solicitado, barbeiro_Nome, data_Agendada)
VALUES
('João da Silva', '11999990000', 'Corte de cabelo', 'Marcos', '2025-10-27 14:30:00'),
('Pedro Andrade', '11988887777', 'Barba completa',  'Carlos', '2025-10-28 10:00:00'),
('Lucas Pereira', '11977776666', 'Corte e barba',   'Rafael', '2025-10-29 16:00:00');

SELECT * FROM clients;

SELECT * FROM clients WHERE id = 1;

UPDATE clients
SET
    nome_Cliente = 'João da Silva Junior',
    numero_Telefone = '11999998888',
    servico_Solicitado = 'Corte + sobrancelha',
    barbeiro_Nome = 'Marcos',
    data_Agendada = '2025-10-27 15:00:00'
WHERE id = 1;

DELETE FROM clients WHERE id = 2;

SELECT * FROM clients;

SELECT * FROM clients
WHERE DATE(data_Agendada) = '2025-10-28';

ALTER TABLE clients
ADD COLUMN observacoes TEXT(255) NULL AFTER data_Agendada;

ALTER TABLE clients
CHANGE COLUMN numero_Telefone telefone_Celular VARCHAR(30) NOT NULL;

CREATE TABLE employer (
id INT AUTO_INCREMENT PRIMARY KEY,
    nome_Funcionario       VARCHAR(120)  NOT NULL,
    cargo_Funcionario		VARCHAR(30)	 NOT NULL
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


INSERT INTO clients (nome_Cliente, numero_Telefone)
VALUES ('João Silva', '99999-8888');

INSERT INTO employer (nome_Funcionario, cargo_Funcionario)
VALUES ('Maria Souza', 'Cabelereira');

INSERT INTO schedule (id_cliente, id_funcionario, servico, data_agendamento)
VALUES (1, 1, 'Corte de cabelo', '2025-10-28 14:30:00');

SELECT * FROM schedule;

SELECT 
    s.id AS id_agendamento,
    c.nome_Cliente AS nome_cliente,
    e.nome_Funcionario AS nome_funcionario,
    s.servico,
    s.data_agendamento
FROM schedule
JOIN clients c ON s.id_cliente = c.id
JOIN employer e ON s.id_funcionario = e.id;


