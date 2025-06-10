-- Script para criar as tabelas do Pet Mania

-- Criar tabela de adestradores
CREATE TABLE IF NOT EXISTS adestradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    experiencia INT NOT NULL,
    especialidades JSON NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    sobre TEXT,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_cpf (cpf),
    INDEX idx_cidade_estado (cidade, estado)
);

-- Criar tabela de clientes (para futuro uso)
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_cpf (cpf)
);

-- Criar tabela de agendamentos (para futuro uso)
CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    adestrador_id INT NOT NULL,
    data_agendamento DATETIME NOT NULL,
    status ENUM('pendente', 'confirmado', 'cancelado', 'concluido') DEFAULT 'pendente',
    observacoes TEXT,
    preco DECIMAL(10,2) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (adestrador_id) REFERENCES adestradores(id) ON DELETE CASCADE,
    INDEX idx_data_agendamento (data_agendamento),
    INDEX idx_status (status)
);

-- Criar tabela de mensagens (para futuro uso)
CREATE TABLE IF NOT EXISTS mensagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    remetente_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    tipo_remetente ENUM('cliente', 'adestrador') NOT NULL,
    tipo_destinatario ENUM('cliente', 'adestrador') NOT NULL,
    assunto VARCHAR(200),
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_destinatario (destinatario_id, tipo_destinatario),
    INDEX idx_lida (lida),
    INDEX idx_data_envio (data_envio)
);

-- Inserir alguns dados de exemplo para teste (opcional)
-- INSERT INTO adestradores (nome, cpf, email, telefone, cidade, estado, experiencia, especialidades, preco, sobre, senha) 
-- VALUES 
-- ('João Silva', '123.456.789-01', 'joao@teste.com', '(11) 99999-9999', 'São Paulo', 'SP', 5, '["Cães grandes", "Comportamento agressivo"]', 150.00, 'Especialista em cães de grande porte com mais de 5 anos de experiência.', '$2b$10$exemplo.hash.aqui');

-- Verificar se as tabelas foram criadas
SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
ORDER BY TABLE_NAME;