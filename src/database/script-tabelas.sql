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
  senha VARCHAR(45) NULL,
  CONSTRAINT fk_usuario_perfil1
    FOREIGN KEY (id_perfil)
    REFERENCES perfil (id_perfil)
);

-- Projeto Simulacao
CREATE TABLE IF NOT EXISTS projetoSimulacao (
  idSimulacao INT NOT NULL,
  fkUsuario INT NOT NULL,
  nomeSimulacao VARCHAR(45) NULL,
  dtLancamento DATE NULL,
  precoEstimado DOUBLE NULL,
  tagsJogo VARCHAR(45) NULL,
  generosJogo VARCHAR(45) NULL,
  PRIMARY KEY (idSimulacao, fkUsuario),
  CONSTRAINT fk_projetoSimulacao_Usuario
    FOREIGN KEY (fkUsuario)
    REFERENCES usuario (id_usuario)
);

-- Jogo
CREATE TABLE IF NOT EXISTS jogo (
  idjogo INT PRIMARY KEY NOT NULL,
  name VARCHAR(45) NULL,
  dtLancamento DATE NULL,
  price DOUBLE NULL,
  peakccu INT NULL,
  generos VARCHAR(45) NULL,
  tags VARCHAR(45) NULL,
  linguagens VARCHAR(45) NULL
);

-- Analise Jogos (analiseJogos)
CREATE TABLE IF NOT EXISTS analiseJogos (
  id_analise INT NOT NULL,
  usuario_idUsuario INT NOT NULL,
  jogo_idjogo INT NOT NULL,
  data_analise DATE NULL,
  precorrente DOUBLE NULL,
  ccuConcorente INT NULL,
  PRIMARY KEY (id_analise, usuario_idUsuario, jogo_idjogo),
  CONSTRAINT fk_analiseJogos_usuario1
    FOREIGN KEY (usuario_idUsuario)
    REFERENCES usuario (id_usuario),
  CONSTRAINT fk_analiseJogos_jogo1
    FOREIGN KEY (jogo_idjogo)
    REFERENCES jogo (idjogo)
);

-- Jogo Detalhes (jogoDetalhes)
CREATE TABLE IF NOT EXISTS jogoDetalhes (
  idjogo INT PRIMARY KEY NOT NULL,
  review_positiva INT NULL,
  review_negativa INT NULL,
  score_metacritic DOUBLE NULL,
  score_usuario DOUBLE NULL,
  plataformas VARCHAR(45) NULL,
  classificacao INT NULL,
  CONSTRAINT fk_jogoDetalhes_jogo1
    FOREIGN KEY (idjogo)
    REFERENCES jogo (idjogo)
);

-- Sessao Usuario
CREATE TABLE IF NOT EXISTS sessao_usuario (
  id_sessao INT NOT NULL,
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
  id_log INT PRIMARY KEY NOT NULL,
  id_usuario INT NOT NULL,
  id_sessao INT NOT NULL,
  tipo_evento VARCHAR(50) NULL,
  descricao_evento VARCHAR(200) NULL,
  CONSTRAINT fk_log_usuario_sessao_usuario1
    FOREIGN KEY (id_sessao, id_usuario)
    REFERENCES sessao_usuario (id_sessao, id_usuario)
);

-- Projeto Simulacao
CREATE TABLE IF NOT EXISTS projeto_simulacao (
  id_simulacao INT PRIMARY KEY NOT NULL,
  id_usuario INT NOT NULL,
  nome_projeto VARCHAR(100) NOT NULL,
  data_lancamento DATE NOT NULL,
  preco_estimado DECIMAL(8,2) NOT NULL,
  generos VARCHAR(100) NULL,
  tags VARCHAR(100) NULL,
  score_viabilidade DECIMAL(5,2) NULL,
  score_concorrencia DECIMAL(5,2) NULL,
  preco_sugerido DECIMAL(8,2) NULL,
  data_simulacao DATETIME NULL,
  CONSTRAINT fk_projeto_simulacao_usuario1
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
);

-- Registro
CREATE TABLE IF NOT EXISTS Registro (
  id_registro INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  dataResgistro DATETIME NULL,
  dataMetrica DATE NULL
);

-- Jogo Main
CREATE TABLE IF NOT EXISTS jogo_main (
  id_jogo_rastreavel INT NOT NULL,
  id_jogo INT NOT NULL,
  id_registro INT NOT NULL,
  nome VARCHAR(255) NULL,
  data_lancamento DATE NULL,
  preco DECIMAL(8,2) NULL,
  proprietarios_estimados INT NULL,
  idade_minima INT NULL,
  desenvolvedor VARCHAR(45) NULL,
  PRIMARY KEY (id_jogo_rastreavel, id_jogo, id_registro),
  CONSTRAINT uq_jogo_main_jogo_registro
    UNIQUE (id_jogo, id_registro),
  CONSTRAINT fk_jogo_main_Registro1
    FOREIGN KEY (id_registro)
    REFERENCES Registro (id_registro)
);

-- Jogo Suporte
CREATE TABLE IF NOT EXISTS jogo_suporte (
  id_jogo INT NOT NULL,
  idRegistro INT NOT NULL,
  suporte_windows TINYINT NULL,
  suporte_MAC TINYINT NULL,
  suporte_linux TINYINT NULL,
  idiomas_suportados TEXT NULL,
  idiomas_suportados_audio TEXT NULL,
  PRIMARY KEY (id_jogo, idRegistro),
  CONSTRAINT fk_jogo_suporte_jogo_main1
    FOREIGN KEY (id_jogo, idRegistro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Jogo Metricas
CREATE TABLE IF NOT EXISTS jogo_metricas (
  id_jogo INT NOT NULL,
  idRegistro INT NOT NULL,
  peak_CCU INT NULL,
  avaliacoes_positivas INT NULL,
  avaliacoes_negativas INT NULL,
  taxa_aprovacao DECIMAL(5,2) NULL,
  nota_metacritic DECIMAL(5,2) NULL,
  nota_usuarios DECIMAL(5,2) NULL,
  qtd_dlc INT NULL,
  qtd_recomendacoes INT NULL,
  qtd_conquistas INT NULL,
  PRIMARY KEY (id_jogo, idRegistro),
  CONSTRAINT fk_jogo_metricas_jogo_main1
    FOREIGN KEY (id_jogo, idRegistro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Jogo Playtime
CREATE TABLE IF NOT EXISTS jogo_playtime (
  id_jogo INT NOT NULL,
  idRegistro INT NOT NULL,
  media_horas_total INT NULL,
  mediana_horas_total INT NULL,
  media_horas_duas_semanas INT NULL,
  mediana_horas_duas_semanas INT NULL,
  PRIMARY KEY (id_jogo, idRegistro),
  CONSTRAINT fk_jogo_playtime_jogo_main1
    FOREIGN KEY (id_jogo, idRegistro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Jogo Detalhes
CREATE TABLE IF NOT EXISTS jogo_detalhes (
  idRegistro INT NOT NULL,
  id_jogo INT NOT NULL,
  jogo_anotacoes VARCHAR(45) NULL,
  publicante VARCHAR(45) NULL,
  descricao TEXT NULL,
  tags VARCHAR(45) NULL,
  generos VARCHAR(45) NULL,
  categorias TEXT NULL,
  PRIMARY KEY (idRegistro, id_jogo),
  CONSTRAINT fk_jogo_detalhes_jogo_main1
    FOREIGN KEY (id_jogo, idRegistro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Jogo Auxiliar
CREATE TABLE IF NOT EXISTS jogo_auxiliar (
  id_jogo INT NOT NULL,
  idRegistro INT NOT NULL,
  site_oficial VARCHAR(100) NULL,
  email_suporte VARCHAR(100) NULL,
  url_metacritic VARCHAR(100) NULL,
  usuario_review VARCHAR(255) NULL,
  desconto_pct INT NULL,
  PRIMARY KEY (id_jogo, idRegistro),
  CONSTRAINT fk_jogo_auxiliar_jogo_main1
    FOREIGN KEY (id_jogo, idRegistro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Analise Jogo
CREATE TABLE IF NOT EXISTS analise_jogo (
  id_analise INT PRIMARY KEY NOT NULL,
  idRegistro INT NOT NULL,
  id_jogo INT NOT NULL,
  id_usuario INT NOT NULL,
  media_CCU_concorrencia INT NULL,
  preco_media_nicho DECIMAL(8,2) NULL,
  taxa_aprovacao_nicho DECIMAL(5,2) NULL,
  diagnostico_mercado VARCHAR(100) NULL,
  data_analise DATETIME NULL,
  CONSTRAINT fk_projeto_simulacao_usuario10
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario),
  CONSTRAINT fk_analise_jogo_jogo_main1
    FOREIGN KEY (id_jogo, idRegistro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Jogo Midia
CREATE TABLE IF NOT EXISTS jogo_midia (
  id_jogo INT NOT NULL,
  idRegistro INT NOT NULL,
  imagem_cabecalho TEXT NULL,
  capturas_tela_URL TEXT NULL,
  videos_URL TEXT NULL,
  PRIMARY KEY (id_jogo, idRegistro),
  CONSTRAINT fk_jogo_midia_jogo_main1
    FOREIGN KEY (id_jogo, idRegistro)
    REFERENCES jogo_main (id_jogo, id_registro)
);

-- Avaliacao Simulacao
CREATE TABLE IF NOT EXISTS avaliacao_simulacao (
  id_usuario INT NOT NULL,
  id_simulacao INT NOT NULL,
  positiva INT NULL,
  negativa INT NULL,
  comentarios VARCHAR(255) NULL,
  PRIMARY KEY (id_simulacao, id_usuario),
  CONSTRAINT fk_avaliacao_simulacao_usuario1
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario),
  CONSTRAINT fk_avaliacao_simulacao_projeto_simulacao1
    FOREIGN KEY (id_simulacao)
    REFERENCES projeto_simulacao (id_simulacao)
);

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  nome VARCHAR(75) NULL DEFAULT NULL,
  email VARCHAR(50) NULL DEFAULT NULL,
  senha VARCHAR(50) NULL DEFAULT NULL
)

-- visualizando os dados da TABELA
SELECT * FROM perfil;
SELECT * FROM usuario;
SELECT * FROM sessao_usuario;
SELECT * FROM log_usuario;

SELECT * FROM jogo_main;
SELECT * FROM jogo_metricas;
SELECT * FROM jogo_suporte;
SELECT * FROM projeto_simulacao;

-- INSERINDO DADOS PARAR PREENCHRE A TABELA
INSERT INTO perfil VALUES
(1 , "USUARIO_TESTE", "Usuário com tipo de teste para que seja possivel realizar testes dentro do database"),
(2 , "ADMIN", "Usuário com permissões administrativas de sistema, utilizado pelos desenvolvedores da aplicação"),
(3 , "DESENVOLVEDOR", "Usuário com acessos envolvendo publicar, escanear e visualizar jogos de forma mais aprofundada"),
(4 , "STREAMER", "Usuário com permissões mais básicas, tendo foco em uma HUD limpa e de fácil uso");

-- INSERINDO USUARIOS
INSERT INTO usuario (id_perfil, nome, email, senha) VALUES
(1, "UsuarioTeste", "Teste@Teste.com", "Senha123");

-- CASO DE ALGUM BO
-- DROP DATABASE indieLens;