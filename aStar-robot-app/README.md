# Algoritmo A\* para Navegação em Robótica Móvel

![Status](https://img.shields.io/badge/status-completo-success)
![Versão](https://img.shields.io/badge/versão-1.0-blue)
![Licença](https://img.shields.io/badge/licença-educacional-green)

Aplicação web completa que implementa o **Algoritmo A\*** para planejamento de trajetória em robótica móvel. Desenvolvida com **HTML5, CSS3 e JavaScript ES6+ puro**, sem dependências externas.

## 🎯 Características

- ✅ **Sem frameworks ou bibliotecas externas** - 100% vanilla JavaScript
- ✅ **Interface darkmode** - Design moderno e confortável
- ✅ **Totalmente responsiva** - Funciona em desktop, tablet e mobile
- ✅ **Editor visual interativo** - Desenhe mapas diretamente na grade
- ✅ **Animação passo a passo** - Visualize o algoritmo em ação
- ✅ **Importação/exportação de mapas** - Arquivos TXT e CSV
- ✅ **Mapas padrão incluídos** - Pequeno, médio e grande
- ✅ **Simulação de movimento** - Teste colisões e navegação
- ✅ **4 ou 8 direções** - Movimentos cardinais ou com diagonais
- ✅ **Estatísticas em tempo real** - Custo, nós visitados, tempo

## 🚀 Demonstração Rápida

1. Abra `index.html` no seu navegador
2. Clique em "Executar" para ver o algoritmo em ação
3. Experimente "Passo a Passo" para visualizar a exploração

## 📁 Estrutura do Projeto

```
aStar-robot-app/
│
├── index.html              # Página principal
│
├── css/
│   └── style.css          # Estilos completos (darkmode)
│
├── js/
│   ├── main.js            # Inicialização e coordenação
│   ├── astar.js           # Implementação do algoritmo A*
│   ├── grid.js            # Gerenciamento da grade
│   ├── mapLoader.js       # Carregamento e salvamento
│   └── ui.js              # Renderização e interface
│
├── assets/
│   └── examples/
│       ├── small.txt      # Mapa 10×10
│       ├── medium.txt     # Mapa 20×20
│       └── large.txt      # Mapa 30×30
│
├── MANUAL.md              # Manual completo de uso
└── README.md              # Este arquivo
```

## 🔧 Como Usar

### Método 1: Abertura Direta

```bash
# Simplesmente abra o arquivo no navegador
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Método 2: Servidor HTTP Local

```bash
# Python 3
cd aStar-robot-app
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

## 📖 Guia Rápido

### 1. Carregar um Mapa

**Mapas Padrão:**

- Clique em "Pequeno (10×10)", "Médio (20×20)" ou "Grande (30×30)"

**Arquivo Personalizado:**

- Clique em "Carregar Mapa"
- Selecione um arquivo `.txt` ou `.csv` com 0s e 1s

### 2. Definir Início e Destino

**Opção A - Manual:**

- Digite linha e coluna
- Clique em "Definir"

**Opção B - Visual:**

- Selecione "Definir início" ou "Definir destino"
- Clique na célula desejada

### 3. Executar o Algoritmo

**Execução Completa:**

- Clique em "Executar"
- Resultado instantâneo

**Passo a Passo:**

- Clique em "Passo a Passo"
- Visualize a exploração
- Ajuste a velocidade (Lenta/Média/Rápida)

### 4. Editar o Mapa

- Selecione "Alternar livre/ocupado"
- Clique para alternar células
- Arraste para desenhar obstáculos

### 5. Salvar o Trabalho

- Clique em "Salvar Mapa"
- Arquivo será baixado como `mapa_YYYY-MM-DD.txt`

## 🎨 Interface

### Cores e Significados

| Cor                   | Elemento             |
| --------------------- | -------------------- |
| 🔵 Azul               | Ponto inicial (S)    |
| 🟢 Verde              | Ponto de destino (D) |
| ⬜ Preto              | Célula livre         |
| ⬛ Cinza              | Obstáculo            |
| 🔷 Azul claro         | Caminho encontrado   |
| 🔹 Azul transparente  | Nós explorados       |
| ⚪ Cinza transparente | Nós visitados        |

### Barra de Status

- **Status**: Estado da aplicação
- **Custo Total**: Distância do caminho
- **Nós Visitados**: Células exploradas
- **Tempo**: Duração da execução

## 🧠 Sobre o Algoritmo A\*

### O que é?

A\* (A-star) é um algoritmo de busca informada que encontra o caminho mais curto entre dois pontos. Ele combina:

- **g(n)**: Custo real do início até o nó atual
- **h(n)**: Heurística (estimativa) do nó atual até o objetivo
- **f(n) = g(n) + h(n)**: Custo total estimado

### Funcionamento

1. Começa no nó inicial
2. Mantém lista de nós a explorar (lista aberta)
3. Expande o nó com menor f(n)
4. Atualiza vizinhos e repete
5. Para quando alcança o objetivo ou esgota possibilidades

### Heurísticas Implementadas

**Distância de Manhattan** (4 direções)

```javascript
h(n) = |x₁ - x₂| + |y₁ - y₂|
```

Usada quando apenas movimentos cardinais (N, S, L, O) são permitidos.

**Distância Euclidiana** (8 direções)

```javascript
h(n) = √[(x₁ - x₂)² + (y₁ - y₂)²]
```

Usada quando movimentos diagonais são permitidos.

### Propriedades

- ✅ **Completo**: Sempre encontra um caminho (se existir)
- ✅ **Ótimo**: Encontra o caminho de menor custo
- ✅ **Eficiente**: Mais rápido que Dijkstra em muitos casos

## 📝 Formato de Arquivo

### Entrada Aceita

Arquivos de texto contendo apenas 0 (livre) e 1 (ocupado):

```
0,0,1,0,0
0,1,0,0,0
0,0,0,1,0
```

### Separadores Suportados

- Vírgulas: `0,1,0`
- Espaços: `0 1 0`
- Sem separador: `010`

### Validações

✅ Apenas 0 e 1  
✅ Mapa retangular  
✅ Mínimo 2×2  
✅ Máximo 200×200

## 🔍 Exemplos de Uso

### Exemplo 1: Teste Simples

```javascript
// Mapa 5×5
0, 0, 0, 0, 0;
0, 1, 1, 1, 0;
0, 0, 0, 0, 0;
0, 1, 1, 1, 0;
0, 0, 0, 0, 0;

// Início: (0,0)
// Destino: (4,4)
// Caminho encontrado!
```

### Exemplo 2: Sem Caminho

```javascript
// Mapa 5×5
0, 0, 0, 0, 0;
1, 1, 1, 1, 1;
0, 0, 0, 0, 0;
0, 0, 0, 0, 0;
0, 0, 0, 0, 0;

// Início: (0,0)
// Destino: (4,4)
// Caminho impossível!
```

## 🛠️ Arquitetura do Código

### Módulos Principais

#### `grid.js` - Gerenciamento da Grade

```javascript
class Grid {
  // Criação e manipulação da matriz
  // Validação de posições
  // Gerenciamento de início/destino
  // Obtenção de vizinhos
}
```

#### `astar.js` - Algoritmo A\*

```javascript
class AStar {
  // Implementação do algoritmo
  // Cálculo de heurísticas
  // Reconstrução do caminho
  // Gerador para animação passo a passo
}
```

#### `mapLoader.js` - Carregamento de Mapas

```javascript
class MapLoader {
  // Leitura de arquivos
  // Validação de formato
  // Salvamento de mapas
  // Geração de mapas padrão
}
```

#### `ui.js` - Interface Visual

```javascript
class UI {
  // Renderização em Canvas
  // Conversão de coordenadas
  // Visualização do caminho
  // Animação da busca
}

class NotificationManager {
  // Exibição de notificações
  // Tipos: sucesso, erro, aviso, info
}
```

#### `main.js` - Coordenação

```javascript
// Estado global da aplicação
// Event listeners
// Integração entre módulos
// Controle de fluxo
```

### Padrões Utilizados

- **Separação de responsabilidades**: Cada módulo tem função específica
- **Classes ES6**: Organização orientada a objetos
- **Generator Functions**: Para animação passo a passo
- **Event-driven**: Arquitetura baseada em eventos
- **Canvas API**: Renderização eficiente

## 🎓 Aspectos Educacionais

Esta aplicação é ideal para:

- 📚 **Ensino de Algoritmos**: Visualização clara do A\*
- 🤖 **Robótica Móvel**: Planejamento de trajetória
- 💻 **Desenvolvimento Web**: Exemplo de app completa
- 🎨 **UI/UX**: Interface darkmode bem projetada
- 🧪 **Experimentação**: Teste diferentes cenários

## 🔬 Possíveis Extensões

Ideias para expandir o projeto:

- [ ] Adicionar outros algoritmos (Dijkstra, BFS, DFS)
- [ ] Suporte para múltiplos robôs
- [ ] Custos variáveis por célula
- [ ] Exportar animação como GIF/vídeo
- [ ] Modo de edição avançado (arrastar obstáculos)
- [ ] Gerador de labirintos aleatórios
- [ ] Comparação lado a lado de algoritmos
- [ ] Métricas detalhadas de performance

## ⚙️ Requisitos Técnicos

### Navegadores Suportados

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Recursos Utilizados

- HTML5 Canvas
- ES6+ (Classes, Arrow Functions, Destructuring)
- CSS3 (Grid, Flexbox, Custom Properties)
- File API (para upload)
- Blob API (para download)

### Performance

- Mapas até 100×100: Excelente
- Mapas até 200×200: Boa
- Renderização otimizada com Canvas
- Animação com `setTimeout` configurável

## 🐛 Solução de Problemas

### Erro ao carregar arquivo

**Causa**: Formato inválido  
**Solução**: Verifique se o arquivo contém apenas 0 e 1

### Caminho não encontrado

**Causa**: Obstáculos bloqueando  
**Solução**: Remova obstáculos ou habilite diagonais

### Performance lenta

**Causa**: Mapa muito grande  
**Solução**: Use mapas menores ou execução direta

## 📚 Referências

### Algoritmo A\*

- Hart, P. E., Nilsson, N. J., & Raphael, B. (1968). "A Formal Basis for the Heuristic Determination of Minimum Cost Paths"

### Robótica

- Siegwart, R., & Nourbakhsh, I. R. (2004). "Introduction to Autonomous Mobile Robots"

### Inteligência Artificial

- Russell, S., & Norvig, P. (2020). "Artificial Intelligence: A Modern Approach"

## 📄 Licença

Este projeto é fornecido para fins educacionais.

## 👨‍💻 Desenvolvimento

**Tecnologias**: HTML5, CSS3, JavaScript ES6+  
**Paradigma**: Orientado a Objetos  
**Arquitetura**: Modular e desacoplada  
**Padrões**: Clean Code, SOLID principles

---

**Desenvolvido com foco em educação e clareza de código.**

Para mais informações, consulte o [Manual Completo](MANUAL.md).
