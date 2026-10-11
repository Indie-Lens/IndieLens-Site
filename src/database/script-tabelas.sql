CREATE DATABASE IF NOT EXISTS indieLens;
USE indieLens;

-- Perfil
CREATE TABLE IF NOT EXISTS perfil (
  id_perfil INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  tipo VARCHAR(45) NULL,
  descricao VARCHAR(100) NULL
);

-- Usuario
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  id_perfil INT NOT NULL,
  nome VARCHAR(50) NULL,
  email VARCHAR(100) NULL,
  senha VARCHAR(255) NULL,
  CONSTRAINT fk_usuario_perfil1
    FOREIGN KEY (id_perfil)
    REFERENCES perfil (id_perfil)
);

-- Sessao Usuario
CREATE TABLE IF NOT EXISTS sessao_usuario (
  id_sessao INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  inicio_sessao DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  fim_sessao DATETIME NULL,
  PRIMARY KEY (id_sessao, id_usuario),
  CONSTRAINT fk_sessao_usuario_usuario1
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
);

-- Log Usuario
CREATE TABLE IF NOT EXISTS log_usuario (
  id_log INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  id_sessao INT NOT NULL,
  id_usuario INT NOT NULL,
  tipo_evento VARCHAR(50) NULL,
  descricao_evento VARCHAR(200) NULL,
  CONSTRAINT fk_log_usuario_sessao_usuario1
    FOREIGN KEY (id_sessao, id_usuario)
    REFERENCES sessao_usuario (id_sessao, id_usuario)
);

-- Projeto Simulacao
CREATE TABLE IF NOT EXISTS projeto_simulacao (
  id_simulacao INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  tags VARCHAR(100) NULL,
  generos VARCHAR(100) NULL,
  nome_projeto VARCHAR(100) NOT NULL,
  data_lancamento DATE NOT NULL,
  preco_estimado DECIMAL(8,2) NOT NULL,
  preco_sugerido DECIMAL(8,2) NULL,
  score_viabilidade DECIMAL(5,2) NULL,
  score_concorrencia DECIMAL(5,2) NULL,
  data_simulacao DATETIME NULL,
  CONSTRAINT fk_projeto_simulacao_usuario1
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
);

-- Registro
CREATE TABLE IF NOT EXISTS Registro (
  id_registro INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  dataResgistro DATETIME NULL,
  dataMetrica DATE NULL
);

-- Jogo Main
CREATE TABLE IF NOT EXISTS jogo_main (
  id_jogo_rastreavel INT NOT NULL AUTO_INCREMENT,
  id_jogo INT NOT NULL,
  id_registro INT NOT NULL,
  nome VARCHAR(255) NULL,
  desenvolvedor VARCHAR(100) NULL,
  idade_minima INT NULL,
  proprietarios_estimados INT NULL,
  preco DECIMAL(8,2) NULL,
  data_lancamento DATE NULL,
  PRIMARY KEY (id_jogo_rastreavel),
  CONSTRAINT uq_jogo_main_jogo_registro
    UNIQUE (id_jogo, id_registro),
  CONSTRAINT fk_jogo_main_Registro1
    FOREIGN KEY (id_registro)
    REFERENCES Registro (id_registro)
);

-- Jogo Suporte
CREATE TABLE IF NOT EXISTS jogo_suporte (
  id_jogo INT NOT NULL,
  id_registro INT NOT NULL,
  suporte_MAC TINYINT NULL,
  suporte_linux TINYINT NULL,
  suporte_windows TINYINT NULL,
  idiomas_suportados TEXT NULL,
  idiomas_suportados_audio TEXT NULL,
  PRIMARY KEY (id_jogo, id_registro),
  CONSTRAINT fk_jogo_suporte_jogo_main1
    FOREIGN KEY (id_jogo, id_registro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Jogo Metricas
CREATE TABLE IF NOT EXISTS jogo_metricas (
  id_jogo INT NOT NULL,
  id_registro INT NOT NULL,
  peak_CCU INT NULL,
  qtd_donos INT NULL,
  nota_score INT NULL,
  nota_usuarios INT NULL,
  nota_metacritic INT NULL,
  qtd_dlc INT NULL,
  qtd_conquistas INT NULL,
  qtd_recomendacoes INT NULL,
  avaliacoes_positivas INT NULL,
  avaliacoes_negativas INT NULL,
  PRIMARY KEY (id_jogo, id_registro),
  CONSTRAINT fk_jogo_metricas_jogo_main1
    FOREIGN KEY (id_jogo, id_registro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Jogo Playtime
CREATE TABLE IF NOT EXISTS jogo_playtime (
  id_jogo INT NOT NULL,
  id_registro INT NOT NULL,
  media_horas_total INT NULL,
  mediana_horas_total INT NULL,
  media_horas_duas_semanas INT NULL,
  mediana_horas_duas_semanas INT NULL,
  PRIMARY KEY (id_jogo, id_registro),
  CONSTRAINT fk_jogo_playtime_jogo_main1
    FOREIGN KEY (id_jogo, id_registro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Jogo Detalhes
CREATE TABLE IF NOT EXISTS jogo_detalhes (
  id_registro INT NOT NULL,
  id_jogo INT NOT NULL,
  tags TEXT NULL,
  generos TEXT NULL,
  descricao TEXT NULL,
  categorias TEXT NULL,
  publicante TEXT NULL,
  jogo_anotacoes TEXT NULL,
  PRIMARY KEY (id_registro, id_jogo),
  CONSTRAINT fk_jogo_detalhes_jogo_main1
    FOREIGN KEY (id_jogo, id_registro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Jogo Auxiliar
CREATE TABLE IF NOT EXISTS jogo_auxiliar (
  id_jogo INT NOT NULL,
  id_registro INT NOT NULL,
  url_suporte TEXT NULL,
  site_oficial TEXT NULL,
  email_suporte TEXT NULL,
  url_metacritic TEXT NULL,
  usuario_review TEXT NULL,
  desconto_pct INT NULL,
  PRIMARY KEY (id_jogo, id_registro),
  CONSTRAINT fk_jogo_auxiliar_jogo_main1
    FOREIGN KEY (id_jogo, id_registro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Analise Jogo
CREATE TABLE IF NOT EXISTS analise_jogo (
  id_analise INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  id_jogo INT NOT NULL,
  id_usuario INT NOT NULL,
  id_registro INT NOT NULL,
  media_CCU_concorrencia INT NULL,
  preco_media_nicho DECIMAL(8,2) NULL,
  taxa_aprovacao_nicho DECIMAL(5,2) NULL,
  diagnostico_mercado VARCHAR(100) NULL,
  data_analise DATETIME NULL,
  CONSTRAINT fk_projeto_simulacao_usuario10
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario),
  CONSTRAINT fk_analise_jogo_jogo_main1
    FOREIGN KEY (id_jogo, id_registro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Jogo Midia
CREATE TABLE IF NOT EXISTS jogo_midia (
  id_jogo INT NOT NULL,
  id_registro INT NOT NULL,
  videos_URL TEXT NULL,
  imagem_cabecalho TEXT NULL,
  capturas_tela_URL TEXT NULL,
  PRIMARY KEY (id_jogo, id_registro),
  CONSTRAINT fk_jogo_midia_jogo_main1
    FOREIGN KEY (id_jogo, id_registro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Avaliacao Simulacao
CREATE TABLE IF NOT EXISTS avaliacao_simulacao (
  id_usuario INT NOT NULL,
  id_simulacao INT NOT NULL,
  positiva TINYINT NULL,
  negativa TINYINT NULL,
  comentarios VARCHAR(255) NULL,
  PRIMARY KEY (id_simulacao, id_usuario),
  CONSTRAINT fk_avaliacao_simulacao_usuario1
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario),
  CONSTRAINT fk_avaliacao_simulacao_projeto_simulacao1
    FOREIGN KEY (id_simulacao)
    REFERENCES projeto_simulacao (id_simulacao)
);

-- Visualizando os dados das tabelas
SELECT * FROM perfil;
SELECT * FROM usuario;
SELECT * FROM sessao_usuario;
SELECT * FROM log_usuario;

SELECT * FROM jogo_main;
SELECT * FROM jogo_metricas;
SELECT * FROM jogo_suporte;
SELECT * FROM projeto_simulacao;

-- Inserindo perfis
INSERT INTO perfil (id_perfil, tipo, descricao) VALUES
(1, 'USUARIO_TESTE', 'Usuário com tipo de teste para que seja possivel realizar testes dentro do database'),
(2, 'ADMIN', 'Usuário com permissões administrativas de sistema, utilizado pelos desenvolvedores da aplicação'),
(3, 'DESENVOLVEDOR', 'Usuário com acessos envolvendo publicar, escanear e visualizar jogos de forma mais aprofundada'),
(4, 'STREAMER', 'Usuário com permissões mais básicas, tendo foco em uma HUD limpa e de fácil uso');

-- Inserindo usuario
INSERT INTO usuario (id_perfil, nome, email, senha) VALUES
(1, 'UsuarioTeste', 'Teste@Teste.com', 'Senha123');
-- CASO DE ALGUM BO
-- DROP DATABASE indieLens;