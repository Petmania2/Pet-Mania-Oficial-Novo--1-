-- Script para criar as tabelas do Pet Mania
CREATE TABLE USUARIOS (
    ID_USUARIO INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    NOME_USUARIO VARCHAR(70) NOT NULL,
    EMAIL_USUARIO VARCHAR(35) UNIQUE NOT NULL,
    CELULAR_USUARIO CHAR(11) UNIQUE NOT NULL,
    CPF_USUARIO CHAR(11) UNIQUE NOT NULL,
    SENHA_USUARIO VARCHAR(15) UNIQUE NOT NULL,
    CONFIRMA_SENHA_USUARIO VARCHAR(15) UNIQUE NOT NULL,
    TIPO_USUARIO CHAR(1) NOT NULL,
    DATA_NASC_USUARIO DATE NOT NULL,
    ID_PERFIL INT UNSIGNED NOT NULL DEFAULT 0,	-- foreign key com valor inicial 0
    FOREIGN KEY (ID_PERFIL) REFERENCES IMAGENS (ID_IMAGEM) -- relacionamento entre os campos chaves (primária e estrangeira)   
);
 
CREATE TABLE IMAGENS (
    ID_IMAGEM INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    NOME_IMAGEM VARCHAR(255) NOT NULL,
    IMAGEM_BLOB BLOB -- conteúdo da imagem (armazenado em binário)
);
 

-- Criar tabela de ESPECIALIDADES ADESTRADORES
CREATE TABLE IF NOT EXISTS ESPECIALIDADES_ADESTRADORES (
    id_esp_adestrador INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nome_esp_adestrador VARCHAR(40) NOT NULL
);
 
-- Criar tabela de adestradores
CREATE TABLE IF NOT EXISTS adestradores (
    id_adestrador INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    logradouro_adestrador varchar(100), /*endereço - rua- avenida*/
    num_resid_adestrador varchar(6) not null, /*num do tipo A123 se for apartamento*/
    complemento_adestrador varchar(50) not null, 
    bairro_adestrador varchar(30) not null,
    cidade_adestrador varchar(30) not null,
    uf_adestrador char(2) not null,
    cep_ADESTRADOR char(8) not null, 
    ID_USUARIO INT UNSIGNED NOT NULL,	-- foreign key
    FOREIGN KEY (ID_USUARIO) REFERENCES USUARIOS (ID_USUARIO), -- relacionamento entre os campos chaves (primária e estrangeira)
    anos_experiencia INT NOT NULL,
    id_esp_adestrador INT UNSIGNED NOT NULL,
    valor_sessao DECIMAL(10,2) NOT NULL,
    sobre_sua_experiencia VARCHAR(1000) NOT NULL,
    data_cadastro DATETIME NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_esp_adestrador) REFERENCES ESPECIALIDADES_ADESTRADORES (id_esp_adestrador) -- relacionamento entre os campos chaves (primária e estrangeira)
);
 
-- Criar tabela de clientes (para futuro uso)
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    logradouro_cliente varchar(100), /*endereço - rua- avenida*/
    num_resid_cliente varchar(6) not null, /*num do tipo A123 se for apartamento*/
    complemento_cliente varchar(50) not null, 
    bairro_paciente varchar(30) not null,
    cidade_paciente varchar(30) not null,
    uf_paciente char(2) not null,
    cep_paciente char(8) not null, 
    ID_USUARIO INT UNSIGNED NOT NULL,	-- foreign key
    FOREIGN KEY (ID_USUARIO) REFERENCES USUARIOS (ID_USUARIO) -- relacionamento entre os campos chaves (primária e estrangeira)
	-- TEMPORARIO latitude_paciente decimal(9,6) null,
	-- TEMPORARIO longitude_paciente decimal(9,6) null
);
 
create table disponibilidade_adestrador(
   ID_AGENDA INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,	
   DIA_SEMANA INT NOT NULL,
   ID_ADESTRADOR INT UNSIGNED NOT NULL,	-- foreign key
   HR_INICIO TIME NOT NULL,
   HR_FIM TIME NOT NULL,
   DURACAO_SESSAO INT NOT NULL,
   PRECO_SESSAO DECIMAL(6,2) NOT NULL,
   TAXA_LOCOMOCAO_SESSSAO DECIMAL(5,2),
   DT_TAXA_LOCOMOCAO DATE NOT NULL,
   FOREIGN KEY (ID_ADESTRADOR) REFERENCES adestradores (ID_ADESTRADOR) -- relacionamento entre os campos chaves (primária e estrangeira)
);
 
create table ADMINISTRADORES(
    ID_ADM INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ID_USUARIO INT UNSIGNED NOT NULL,	-- foreign key
    FOREIGN KEY (ID_USUARIO) REFERENCES USUARIOS (ID_USUARIO) -- relacionamento entre os campos chaves (primária e estrangeira)
);
 
-- Tabela RACA_PETS
CREATE TABLE RACA_PET (
	ID_RACA INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    NOME_RACA VARCHAR(50) NOT NULL
);
 
-- Tabela PETS
CREATE TABLE PETS (
    ID_PET INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    NOME_PET VARCHAR(50) NOT NULL,
    RACA_PET VARCHAR(100),
    VACINACAO_PET BOOLEAN,
    DATA_NASC_PET DATE,
    ID_CLIENTE INT UNSIGNED NOT NULL,
    ID_RACA INT UNSIGNED NOT NULL,
    FOREIGN KEY (ID_CLIENTE) REFERENCES clientes(ID_CLIENTE), 
    FOREIGN KEY (ID_RACA) REFERENCES RACA_PET(ID_RACA)
);
 
-- Tabela PEDIGREE
CREATE TABLE PEDIGREE (
    ID_PEDIGREE INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    COD_AUTENTICIDADE_PEDIGREE VARCHAR(10) UNIQUE,
    COD_MICROCHIP_PEDIGREE CHAR(15) UNIQUE,
    ID_PET INT UNSIGNED NOT NULL,
    FOREIGN KEY (ID_PET) REFERENCES PETS(ID_PET)
);
 

-- Tabela CERTIFICADO
CREATE TABLE CERTIFICADO (
    ID_CERTIFICADO INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    CNAE CHAR(7) UNIQUE NOT NULL,
    id_adestrador INT UNSIGNED NOT NULL,
   FOREIGN KEY (ID_ADESTRADOR) REFERENCES adestradores (ID_ADESTRADOR) -- relacionamento entre os campos chaves (primária e estrangeira)
);
 
-- Tabela INSTITUICOES
CREATE TABLE INSTITUICOES (
    ID_INSTITUICAO INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    RAZAO_SOCIAL VARCHAR(80) NOT NULL,
    CNPJ_INSTITUICAO CHAR(14) NOT NULL,
    ENDERECO_INSTITUICAO VARCHAR(120) NOT NULL,
    BAIRRO_INSTITUICAO VARCHAR(30) NOT NULL,
    CIDADE_INSTITUICAO VARCHAR(30) NOT NULL,
    UF_INSTITUICAO CHAR(2) NOT NULL,
    CEP_INSTITUICAO CHAR(8) NOT NULL,
    ID_CURSO INT UNSIGNED NOT NULL,
    FOREIGN KEY (ID_CURSO) REFERENCES CURSOS (ID_CURSO) -- relacionamento entre os campos chaves (primária e estrangeira)
);
 
-- Tabela CURSOS
CREATE TABLE CURSOS (
    ID_CURSO INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    NOME_CURSO VARCHAR(50),
    DURACAO_CURSO INT
);
 
-- ATÉ AQUI TUDO BEM
 