# Dicionário de Dados

## 1. Visão geral das tabelas

| Tabela | Finalidade |
|---|---|---|
| `Registro` | Identificar os lotes importados dos dataset's  |
| `jogo_main` | Armazenar os dados principais de um jogo | 
| `jogo_suporte` | Registrar compatibilidade e idiomas de um jogo | 
| `jogo_playtime` | Registrar estatísticas de tempo de jogo |
| `jogo_midia` | Registrar referências de midia sobre o jogo |
| `jogo_metricas` | Registrar avaliações e dados númericos dos jogos |
| `jogo_detalhes` | Armazenar informações de detalhe do jogo | 
| `jogo_auxiliar` | Armazenar links e informações complementares sobre desenvolvedores | 
| `perfil` | Definir as personas disponíveis no site | 
| `usuario` | Registrar as contas que utilizam a plataforma |
| `projeto_simulacao` | Registrar os projetos simulados e armazenar seus resultados |
| `avaliacao_simulacao` | Registrar avaliações do usuário sobre uma simulação |
| `analise_jogo` | Registrar análises e indicadores calculados com base na concorrencia| 
| `sessao_usuario` | Registrar Inicio e fim de periodos de utilização de cada usuário| 
| `log_usuario` | Registrar eventos de utilização do SITE | 

## 2. Dicionário das tabelas
### 2.1. `Registro`

**Descrição:** identifica cada importação de dataset de forma distinta. Todos os jogos de uma mesma importação recebem o identificador desse lote.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `idRegistro` | `INT` | Identificador único da importação. Deve ser gerado uma vez por lote e reutilizado nas linhas importadas. |
| `dataRegistro` | `DATETIME` | Data e hora em que a importação foi registrada no sistema. |
| `dataMetrica` | `DATE` | Data real de referência dos dados, exibe a periodicidade de atualização dos dados. |

### 2.2. `jogo_main`

**Descrição:** armazena os dados principais de cada jogo em cada importação.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_jogo_rastreavel` | `INT` | Identificador de cada registro de jogo na tabela. |
| `id_jogo` | `INT` | Identificador original do jogo na fonte. Permite reconhecer o mesmo jogo em diferentes importações. |
| `idRegistro` | `INT` | Identificador do lote em que esta versão foi importada. |
| `nome` | `VARCHAR(255)` | Nome do jogo na importação. |
| `data_lancamento` | `DATE` | Data de lançamento informada pelo dataset. |
| `preco` | `DECIMAL(8,2)` | Preço do jogo em Dolares |
| `proprietarios_estimados` | `INT` | Estimativa de proprietários tendo como valor minimo 0 mas consideraremos apenas o MAIOR valor e não uma MÉDIA dentre os 2 valores. |
| `idade_minima` | `INT` | Idade mínima recomendada para jogar o jogo |
| `desenvolvedor` | `VARCHAR(45)` | Nome do desenvolvedor principal do jogo |

### 2.3. `jogo_suporte`

**Descrição:** registra compatibilidade de plataformas e idiomas disponíveis para o jogo.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_registro` | `INT` | Identificador da importação correspondente. |
| `id_jogo` | `INT` | Identificador do jogo correspondente. |
| `suporte_windows` | `TINYINT` | Indica suporte ao Windows. |
| `suporte_MAC` | `TINYINT` | Indica suporte ao macOS. |
| `suporte_linux` | `TINYINT` | Indica suporte ao Linux. |
| `idiomas_suportados` | `TEXT` | Lista de Idiomas disponíveis. |
| `idiomas_suportados_audio` | `TEXT` | Representa os idiomas de áudio/dublagem |

### 2.4. `jogo_playtime`

**Descrição:** Registrar estatísticas de tempo de jogo.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_jogo` | `INT` | Identificador do jogo. |
| `id_registro` | `INT` | Identificador da importação. |
| `media_horas_total` | `INT` | Média do tempo total jogado pelos jogadores em HORAS. |
| `mediana_horas_total` | `INT` | Mediana do tempo total jogado pelos jogadores em HORAS. |
| `media_horas_duas_semanas` | `INT` | Média do tempo jogado na janela de duas semanas |
| `mediana_horas_duas_semanas` | `INT` | Mediana do tempo jogado na janela das ultimas duas semanas. |

### 2.5. `jogo_midia`

**Descrição:** armazena URLs de mídias relacionadas ao jogo.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_registro` | `INT` | Identificador da importação. |
| `id_jogo` | `INT` | Identificador do jogo. |
| `imagem_cabecalho` | `TEXT` | Referência da imagem de cabeçalho em URL. |
| `capturas_tela_URL` | `TEXT` | Lista de URLs das capturas de tela mais populares entre os jogadores. |
| `videos_URL` | `TEXT` | Lista de URLs de vídeos dos jogadores. |

### 2.6. `jogo_metricas`

**Descrição:** reúne indicadores quantitativos e avaliações recebidas pelo jogo na fonte de dados.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_registro` | `INT` | Identificador da importação. |
| `id_jogo` | `INT` | Identificador do jogo. |
| `peak_CCU` | `INT` | Pico de usuários simultâneos histórico.|
| `avaliacoes_positivas` | `INT` | Quantidade de avaliações positivas no dataset. |
| `avaliacoes_negativas` | `INT` | Quantidade de avaliações negativas no dataset. |
| `taxa_aprovacao` | `DECIMAL(5,2)` | Taxa de aprovação em %. Confirmar escala e fórmula; se for percentual, documentar o intervalo de 0 a 100. |
| `nota_metacritic` | `DECIMAL(5,2)` | Nota do Metacritic informada no CSV. Confirmar escala e representação de ausência. |
| `nota_usuarios` | `DECIMAL(5,2)` | Nota atribuída pelos usuários na fonte. Confirmar escala. |
| `qtd_dlc` | `INT` | Quantidade de conteúdos adicionais associados ao jogo. |
| `qtd_recomendacoes` | `INT` | Quantidade de recomendações registrada na fonte. |
| `qtd_conquistas` | `INT` | Quantidade de conquistas disponíveis no jogo. |

### 2.7. `jogo_detalhes`

**Descrição:** armazena informações descritivas e classificações provenientes do dataset.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_registro` | `INT` | Identificador da importação. |
| `id_jogo` | `INT` | Identificador do jogo. |
| `jogo_anotacoes` | `VARCHAR(45)` | Anotações de comentários ao jogo. |
| `publicante` | `VARCHAR(45)` | Publicadora do jogo. |
| `descricao` | `TEXT` | Descrição do jogo. |
| `tags` | `VARCHAR(45)` | Lista das Tags do jogo. |
| `generos` | `VARCHAR(45)` | Lista dos Gêneros do jogo. |
| `categorias` | `TEXT` | Lista das Categorias a qual o jogo pertence. |

### 2.8. `jogo_auxiliar`

**Descrição:** reúne referências externas e informações complementares.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_registro` | `INT` | Identificador da importação. |
| `id_jogo` | `INT` | Identificador do jogo. |
| `site_oficial` | `VARCHAR(100)` | URL do Endereço do site oficial. |
| `email_suporte` | `VARCHAR(100)` | E-mail de suporte do jogo. |
| `url_metacritic` | `VARCHAR(100)` | URL da página do jogo no Metacritic. |
| `usuario_review` | `VARCHAR(255)` | Lista das reviews de usuários, separadas por virgula. |
| `desconto_pct` | `INT` | Percentual de desconto observado na data de referência da importação |

### 2.9. `perfil`

**Descrição:** define a persona associada ao usuário na plataforma.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_perfil` | `INT` | Identificador do tipo de persona |
| `tipo` | `VARCHAR(45)` | tipo da persona. |
| `descricao` | `VARCHAR(100)` | Descrição das características da persona. |

### 2.10. `usuario`

**Descrição:** armazena as contas dos usuários.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_usuario` | `INT` | Identificador do usuário. |
| `id_perfil` | `INT` | Persona associada ao usuário. |
| `nome` | `VARCHAR(50)` | Nome do usuário. |
| `email` | `VARCHAR(100)` | E-mail da conta |
| `senha` | `VARCHAR(45)` | Senha de acesso da conta (podemos alterar para ser um hash, nem fudendo que vamos)|

### 2.11. `projeto_simulacao`

**Descrição:** registra as informações do jogo que o usuário pretende lançar e os resultados da simulação baseado nos critérios dados.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_simulacao` | `INT` | Identificador do registro de simulação. |
| `id_usuario` | `INT` | Usuário responsável pela simulação. |
| `nome_projeto` | `VARCHAR(100)` | Nome atribuído ao jogo da simulação. |
| `data_lancamento` | `DATE` | Data prevista de lançamento do jogo simulado. |
| `preco_estimado` | `DECIMAL(8,2)` | Preço de lançamento informado pelo usuário em dolares. (podemos adicionar conversão) |
| `generos` | `VARCHAR(100)` | Lista de Gêneros informados para o jogo, separado por virgula. |
| `tags` | `VARCHAR(100)` | Lista Tags informadas para o jogo, separado por virgula. |
| `score_viabilidade` | `DECIMAL(5,2)` | Indicador calculado de viabilidade do projeto de forma geral. (TODO FORMULA) |
| `score_concorrencia` | `DECIMAL(5,2)` | Indicador calculado de concorrência com base na concorrecia (TODO FORMULA) |
| `preco_sugerido` | `DECIMAL(8,2)` | Preço sugerido pela simulação com média em concorrentes. |
| `data_simulacao` | `DATETIME` | Data e Hora onde a simulação foi realizada |

### 2.12. `avaliacao_simulacao`

**Descrição:** registra o retorno do usuário sobre uma simulação realizada no site, pode ser editado pelo usuário.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_usuario` | `INT` | Usuário que realizou a avaliação. |
| `id_simulacao` | `INT` | id da Simulação avaliada. |
| `positiva` | `TINYINT` | Representação se a avaliação foi positiva. |
| `negativa` | `TINYINT` | Representação se a avaliação foi negativa. |
| `comentarios` | `VARCHAR(255)` | Comentário que o usuário fez sobre a simulação. |

### 2.13. `analise_jogo`

**Descrição:** registra análises realizadas pelo usuário e indicadores associados ao jogo considerado.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_analise` | `INT` | Identificador da análise salva. |
| `id_jogo` | `INT` | Jogo associado à análise no modelo atual. |
| `id_usuario` | `INT` | Usuário responsável pela análise. |
| `id_registro` | `INT` | Importação atual utilizada como referência, por padrão utilizar a mais recente. |
| `media_CCU_concorrencia` | `INT` | Média de usuários simultâneos dos concorrentes. |
| `preco_media_nicho` | `DECIMAL(8,2)` | Media dos preços dos jogos do nicho. |
| `taxa_aprovacao_nicho` | `DECIMAL(5,2)` | Taxa de aprovação do jogo em comparação com outros. |
| `diagnostico_mercado` | `VARCHAR(100)` | Diagnóstico produzido com base na análise. podemos utilizar BOBAI para gerar um texto embelezado. |
| `data_analise` | `DATETIME` | Data e hora da análise realizada. |

### 2.14. `sessao_usuario`

**Descrição:** registra os períodos de utilização da plataforma.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_sessao` | `INT` | Identificador da sessão. |
| `id_usuario` | `INT` | Usuário associado à sessão. |
| `inicio_sessao` | `DATETIME` | Data e hora de início da sessão do usuário. |
| `fim_sessao` | `DATETIME` | Data e hora de encerramento da sessão do usuário. Proposta: caso o usuário inicie uma nova automaticamente fecha a anterior. |

### 2.15. `log_usuario`

**Descrição:** registra eventos ocorridos durante a utilização da plataforma.

| Campo | Tipo no diagrama | Descrição e observações |
|---|---|---|
| `id_log` | `INT` | Identificador do evento registrado. |
| `id_usuario` | `INT` | Usuário responsável pelo evento. |
| `id_sessao` | `INT` | Sessão em que o evento ocorreu. |
| `tipo_evento` | `VARCHAR(50)` | Classificação do evento, ex: erro, ação. |
| `descricao_evento` | `VARCHAR(200)` | Descrição do evento ocorrido com tamplates ex: usuário clicou em botão {nomeBotão}. |
