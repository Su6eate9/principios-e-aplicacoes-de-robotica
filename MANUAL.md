# Manual de Uso - Aplicação A\* para Navegação Robótica Móvel

## Índice

1. [Introdução](#introdução)
2. [Iniciando a Aplicação](#iniciando-a-aplicação)
3. [Interface da Aplicação](#interface-da-aplicação)
4. [Funcionalidades Principais](#funcionalidades-principais)
5. [Algoritmo A\*](#algoritmo-a)
6. [Formatos de Arquivo](#formatos-de-arquivo)
7. [Exemplos de Uso](#exemplos-de-uso)
8. [Solução de Problemas](#solução-de-problemas)

---

## Introdução

Esta aplicação web implementa o **Algoritmo A\*** para planejamento de trajetória em robótica móvel. Desenvolvida em HTML, CSS e JavaScript puro (sem dependências externas), permite:

- Carregar e criar mapas personalizados
- Definir pontos de início e destino
- Visualizar o caminho encontrado pelo algoritmo
- Animar a execução passo a passo
- Simular movimentos do robô

A aplicação utiliza uma grade bidimensional onde:

- **0** = célula livre (navegável)
- **1** = célula ocupada (obstáculo)

---

## Iniciando a Aplicação

### Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Nenhuma instalação ou servidor necessário

### Como Executar

1. Abra o arquivo `index.html` diretamente no navegador
2. A aplicação carregará automaticamente com um mapa padrão de 10×10

**Nota:** Por questões de segurança do navegador, ao carregar arquivos locais pode ser necessário executar através de um servidor HTTP local. Utilize:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server
```

---

## Interface da Aplicação

### Layout

A interface está dividida em quatro áreas principais:

#### 1. **Painel Lateral Esquerdo** (Controles)

Contém todas as ferramentas de gerenciamento e configuração:

- Gerenciar Mapas
- Mapas Padrão
- Coordenadas
- Movimento do Robô
- Configurações A\*
- Executar A\*
- Modo de Edição

#### 2. **Área Central** (Grade)

Exibe a grade interativa do mapa com:

- Células livres (fundo escuro)
- Obstáculos (células cinzas)
- Ponto inicial (azul, marcado com "S")
- Ponto de destino (verde, marcado com "D")
- Caminho encontrado (azul claro com pontos)
- Nós explorados durante a busca (transparentes)

#### 3. **Barra Inferior** (Status)

Mostra informações em tempo real:

- **Status**: Estado atual da aplicação
- **Custo Total**: Custo do caminho encontrado
- **Nós Visitados**: Quantidade de células exploradas
- **Tempo**: Tempo de execução do algoritmo

#### 4. **Notificações** (Canto Superior Direito)

Exibe mensagens de sucesso, erro, aviso ou informação.

### Cores e Legenda

| Cor                | Significado              |
| ------------------ | ------------------------ |
| Preto escuro       | Célula livre (0)         |
| Cinza              | Célula ocupada (1)       |
| Azul               | Ponto inicial (S)        |
| Verde              | Ponto de destino (D)     |
| Azul claro         | Caminho encontrado       |
| Azul transparente  | Nós abertos (explorados) |
| Cinza transparente | Nós fechados (visitados) |

---

## Funcionalidades Principais

### 1. Gerenciamento de Mapas

#### Carregar Mapa

- Clique em **"Carregar Mapa"**
- Selecione um arquivo `.txt` ou `.csv`
- O mapa será validado e carregado automaticamente
- Início e destino serão definidos nos cantos superior esquerdo e inferior direito

#### Salvar Mapa

- Clique em **"Salvar Mapa"**
- O arquivo será baixado como `mapa_YYYY-MM-DD.txt`
- O formato usa vírgulas como separador

#### Limpar Grade

- Clique em **"Limpar Grade"**
- Confirme a ação
- Toda a grade será zerada (células livres)
- Início e destino serão redefinidos

#### Mapas Padrão

Três mapas pré-configurados estão disponíveis:

- **Pequeno (10×10)**: Ideal para testes rápidos
- **Médio (20×20)**: Complexidade moderada
- **Grande (30×30)**: Labirinto complexo

Clique no botão correspondente para carregar.

---

### 2. Definição de Coordenadas

#### Método 1: Entrada Manual

1. Digite a **linha** e **coluna** desejada
2. Clique em **"Definir"** (ao lado do campo)
3. A aplicação validará se a coordenada é válida

**Validações:**

- Coordenada dentro dos limites do mapa
- Célula não pode estar ocupada
- Mensagem de erro será exibida se inválida

#### Método 2: Clique na Grade

1. Selecione o modo **"Definir início"** ou **"Definir destino"**
2. Clique na célula desejada na grade
3. O ponto será definido automaticamente

#### Visualização Atual

As coordenadas atuais são exibidas na seção "Coordenadas":

- **Início:** (linha, coluna)
- **Destino:** (linha, coluna)

---

### 3. Editor Visual

A grade é totalmente interativa. Você pode editar células diretamente:

#### Modos de Edição

**Alternar livre/ocupado** (padrão)

- Clique em uma célula para alternar entre livre (0) e ocupado (1)
- Mantenha pressionado e arraste para "pintar" múltiplas células
- Não é possível editar células marcadas como início ou destino

**Definir início**

- Clique em qualquer célula livre para definir como ponto inicial

**Definir destino**

- Clique em qualquer célula livre para definir como ponto de destino

#### Dicas de Edição

- Hover sobre uma célula para destacá-la
- Use o modo "pintar" para criar paredes rapidamente
- Limpe o caminho antes de editar para melhor visualização

---

### 4. Configurações do A\*

#### Movimentos Diagonais

- **Desmarcado**: Robô se move apenas em 4 direções (N, S, L, O)
- **Marcado**: Robô pode se mover em 8 direções (incluindo diagonais)

**Impacto:**

- Movimentos diagonais geralmente resultam em caminhos mais curtos
- Heurística muda de Manhattan para Euclidiana
- Custo diagonal é √2 ≈ 1.414

#### Velocidade da Animação

Controla a velocidade da animação passo a passo:

- **Lenta**: 200ms por passo (melhor para aprendizado)
- **Média**: 100ms por passo (padrão)
- **Rápida**: 30ms por passo (visualização rápida)

---

### 5. Execução do Algoritmo A\*

#### Executar

- Clique em **"Executar"**
- O algoritmo será executado instantaneamente
- O caminho será exibido na grade
- Estatísticas serão mostradas na barra inferior

**Informações Retornadas:**

- Caminho encontrado (ou mensagem de erro)
- Custo total do caminho
- Número de nós visitados
- Tempo de execução em milissegundos

#### Passo a Passo

- Clique em **"Passo a Passo"**
- A execução será animada, mostrando:
  - Nós sendo abertos (azul transparente)
  - Nós sendo fechados (cinza transparente)
  - Progressão da busca
  - Caminho final ao completar

**Controles durante a animação:**

- **Pausar**: Interrompe a animação
- Após pausar, você pode executar novamente ou resetar

#### Limpar Caminho

- Remove o caminho e visualizações do algoritmo
- Mantém o mapa e configurações
- Permite executar novamente

---

### 6. Simulação de Movimento do Robô

Esta funcionalidade emula tentativas de entrada do robô em coordenadas específicas.

#### Como Usar

1. Digite a **linha** e **coluna** desejada
2. Clique em **"Mover"**

#### Comportamento

- **Se a célula estiver livre (0):**
  - Robô ocupa a célula
  - Célula é marcada como ocupada (1)
  - Mensagem: "Robô movido para (linha, coluna)"
- **Se a célula estiver ocupada (1):**

  - Movimento é negado
  - Mensagem: "Célula ocupada - movimento não permitido"

- **Se fora dos limites:**
  - Mensagem: "Coordenada fora dos limites do mapa"

#### Casos de Uso

- Testar colisões
- Simular navegação incremental
- Validar comportamento do robô

---

## Algoritmo A\*

### Descrição

O **A\*** é um algoritmo de busca de caminho que combina:

- **Custo real** g(n): Distância do início até o nó atual
- **Heurística** h(n): Estimativa da distância do nó atual até o objetivo
- **Custo total** f(n) = g(n) + h(n)

### Funcionamento

1. Começa no nó inicial
2. Mantém duas listas:
   - **Lista Aberta**: Nós a serem explorados
   - **Lista Fechada**: Nós já visitados
3. A cada iteração:
   - Seleciona o nó com menor f(n) da lista aberta
   - Expande seus vizinhos
   - Atualiza custos se encontrar caminho melhor
4. Termina quando:
   - Alcança o objetivo (sucesso)
   - Lista aberta fica vazia (falha - sem caminho)

### Heurísticas Utilizadas

**Distância de Manhattan** (4 direções)

```
h(n) = |x₁ - x₂| + |y₁ - y₂|
```

**Distância Euclidiana** (8 direções)

```
h(n) = √[(x₁ - x₂)² + (y₁ - y₂)²]
```

### Propriedades

- **Completo**: Sempre encontra um caminho se existir
- **Ótimo**: Encontra o caminho de menor custo
- **Eficiente**: Usa heurística para guiar a busca

### Complexidade

- **Tempo**: O(b^d) no pior caso, mas geralmente muito melhor
- **Espaço**: O(b^d) para armazenar nós

Onde:

- b = fator de ramificação (número de vizinhos)
- d = profundidade da solução

---

## Formatos de Arquivo

### Formato Aceito

Arquivos de texto (`.txt` ou `.csv`) contendo apenas `0` e `1`:

**Exemplo 1: Com vírgulas**

```
0,0,1,0,0
0,1,0,0,0
0,0,0,1,0
0,0,0,0,0
```

**Exemplo 2: Com espaços**

```
0 0 1 0 0
0 1 0 0 0
0 0 0 1 0
0 0 0 0 0
```

**Exemplo 3: Sem separador**

```
00100
01000
00010
00000
```

### Regras de Validação

✅ **Permitido:**

- Apenas valores 0 e 1
- Separadores: vírgula, espaço ou nenhum
- Mínimo 2×2 células
- Máximo 200×200 células
- Mapa retangular (todas as linhas com mesmo tamanho)

❌ **Não permitido:**

- Valores diferentes de 0 ou 1
- Mapa não retangular
- Arquivo vazio
- Tamanhos fora dos limites

### Exportação

Mapas salvos usam o formato:

```
0,0,1,0,0
0,1,0,0,0
0,0,0,1,0
```

- Separador: vírgula
- Nome do arquivo: `mapa_YYYY-MM-DD.txt`

---

## Exemplos de Uso

### Exemplo 1: Mapa Simples

1. Carregue o mapa padrão **Pequeno (10×10)**
2. Início e destino são definidos automaticamente
3. Clique em **"Executar"**
4. Observe o caminho encontrado

**Resultado esperado:**

- Caminho traçado do canto superior esquerdo ao inferior direito
- Custo aproximado: 18 (dependendo do layout)

### Exemplo 2: Criar Mapa Personalizado

1. Clique em **"Limpar Grade"**
2. Selecione modo **"Alternar livre/ocupado"**
3. Desenhe obstáculos clicando e arrastando
4. Defina início e destino nos modos apropriados
5. Clique em **"Executar"**
6. Salve o mapa com **"Salvar Mapa"**

### Exemplo 3: Visualizar Algoritmo

1. Carregue qualquer mapa
2. Marque **"Permitir movimentos diagonais"**
3. Selecione velocidade **"Lenta"**
4. Clique em **"Passo a Passo"**
5. Observe:
   - Nós sendo explorados (azul transparente)
   - Nós visitados (cinza transparente)
   - Caminho final sendo construído

### Exemplo 4: Testar Caminho Impossível

1. Crie um mapa com obstáculos que dividem início e destino
2. Execute o algoritmo
3. Mensagem: "Caminho impossível - não há rota disponível"
4. Nós visitados mostrará quantas células foram exploradas

### Exemplo 5: Comparar 4 vs 8 Direções

1. Carregue o mesmo mapa
2. Execute com movimentos diagonais **desmarcados**
3. Anote o custo e tempo
4. Clique em **"Limpar Caminho"**
5. Marque movimentos diagonais
6. Execute novamente
7. Compare os resultados

**Observação:** Movimentos diagonais geralmente resultam em:

- Menor custo
- Menos nós visitados
- Caminho mais direto

---

## Solução de Problemas

### Mapa não carrega

**Problema:** "Erro: formato de arquivo inválido"

**Soluções:**

- Verifique se o arquivo contém apenas 0 e 1
- Certifique-se de que todas as linhas têm o mesmo tamanho
- Remova linhas vazias no final do arquivo
- Use codificação UTF-8

---

### Caminho não é encontrado

**Problema:** "Caminho impossível - não há rota disponível"

**Soluções:**

- Verifique se há um caminho livre entre início e destino
- Remova obstáculos bloqueando a passagem
- Tente com movimentos diagonais habilitados
- Redefina início e destino em locais acessíveis

---

### Coordenada não pode ser definida

**Problema:** "Não é possível definir início em célula ocupada"

**Soluções:**

- Escolha uma célula livre (0)
- Edite a célula para torná-la livre primeiro
- Verifique se a coordenada está dentro dos limites

---

### Performance lenta com mapas grandes

**Problema:** Aplicação fica lenta em mapas grandes

**Soluções:**

- Use mapas até 100×100 para melhor performance
- Evite animação passo a passo em mapas grandes
- Use execução direta (botão "Executar")
- Feche outras abas do navegador

---

### Arquivo não baixa ao salvar

**Problema:** Botão "Salvar Mapa" não funciona

**Soluções:**

- Verifique as configurações de download do navegador
- Permita downloads automáticos para o site
- Tente um navegador diferente
- Verifique se há espaço em disco

---

## Recursos Adicionais

### Atalhos e Dicas

- **Pintura rápida**: Mantenha o mouse pressionado e arraste
- **Reset rápido**: Use o botão "Limpar Grade" para começar do zero
- **Exportar trabalho**: Sempre salve mapas interessantes
- **Experimentação**: Teste diferentes configurações e compare

### Estrutura de Arquivos

```
aStar-robot-app/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos (darkmode)
├── js/
│   ├── main.js            # Inicialização e eventos
│   ├── astar.js           # Implementação do A*
│   ├── grid.js            # Gerenciamento da grade
│   ├── mapLoader.js       # Carregamento de mapas
│   └── ui.js              # Interface e renderização
└── assets/
    └── examples/
        ├── small.txt      # Mapa pequeno
        ├── medium.txt     # Mapa médio
        └── large.txt      # Mapa grande
```

### Código-Fonte

O código está amplamente comentado e organizado em módulos:

- **grid.js**: Lógica da grade e validações
- **astar.js**: Algoritmo A\* puro com gerador para animação
- **mapLoader.js**: Leitura, validação e salvamento de mapas
- **ui.js**: Renderização em Canvas e notificações
- **main.js**: Coordenação e event listeners

### Referências

**Algoritmo A\***

- Hart, P. E., Nilsson, N. J., & Raphael, B. (1968). A Formal Basis for the Heuristic Determination of Minimum Cost Paths. IEEE Transactions on Systems Science and Cybernetics.

**Robótica Móvel**

- Siegwart, R., & Nourbakhsh, I. R. (2004). Introduction to Autonomous Mobile Robots. MIT Press.

**Heurísticas**

- Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (4th ed.). Pearson.

---

## Contato e Suporte

Para dúvidas, sugestões ou reportar problemas:

- Consulte a documentação no código-fonte
- Verifique os comentários inline nos arquivos `.js`
- Analise os exemplos incluídos

---

## Licença

Este projeto é fornecido como material educacional.

**Versão:** 1.0  
**Data:** 2024
