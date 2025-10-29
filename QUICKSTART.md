# 🚀 Guia Rápido de Início

## Instalação e Execução em 5 Passos

### 1️⃣ Clone o Repositório

```bash
cd "c:\Users\aclau\Documents\Atlas\ufma\PRINCÍPIOS E APLICAÇÕES DE ROBÓTICAS\principios-e-aplicacoes-de-robotica"
```

### 2️⃣ Instale as Dependências

```bash
npm install
```

### 3️⃣ Execute a Aplicação React

```bash
npm start
```

A aplicação abrirá automaticamente em `http://localhost:3000`

### 4️⃣ Navegue pelos Exercícios

No menu lateral esquerdo, selecione o exercício que deseja visualizar:

#### 📐 Questão 1 - Transformações

- **1a)** Clique para ver transformação de (0,0) com translação e rotação
- **1b)** Clique para ver transformação de (0,1) com rotação e translação

#### 🚲 Questão 2 - Modelo de Bicicleta

- **2a)** Use o slider para ajustar o tempo e ver a trajetória
- **2b)** Veja o cálculo com velocidade angular específica
- **2c)** Veja o controlador navegando entre pontos

#### 🎯 Questão 3 - Navegação Braitenberg

- Visualize a estratégia de navegação do robô até o alvo

### 5️⃣ (Opcional) Execute a Simulação Python

Para executar a simulação dinâmica em Python:

```bash
# Certifique-se de ter pygame instalado
pip install pygame

# Execute a simulação
python src/robotSimulationDynamic.py
```

---

## 🎮 Controles e Interação

### Interface React

- **Clique** nos botões do menu para trocar de exercício
- **Slider de tempo** (exercício 2a): arraste para ver diferentes momentos da trajetória
- **Canvas**: visualização automática das transformações e trajetórias

### Simulação Python (se executada)

- **Setas ↑↓**: Ajustar o ângulo gamma
- **Clique no mapa**: Definir novo alvo para o robô

---

## 📊 O que Você Verá

### Canvas de Visualização

- **Grid cinza**: Sistema de coordenadas cartesianas
- **Eixos centrais**: X (horizontal) e Y (vertical)
- **Pontos verdes** 🟢: Posições iniciais
- **Pontos vermelhos** 🔴: Posições finais/alvos
- **Pontos azuis** 🔵: Posições intermediárias
- **Linhas verdes**: Trajetórias e transformações
- **Setas**: Direção do movimento

### Painéis de Informação

- **Resultado**: Valores calculados (coordenadas, ângulos, distâncias)
- **Informações**: Descrição da questão e parâmetros usados
- **Matriz**: Matrizes de transformação (quando aplicável)

---

## 🔧 Resolução de Problemas Comuns

### Erro: "npm: command not found"

**Solução**: Instale o Node.js de https://nodejs.org/

### Erro: "Module not found: Can't resolve 'lucide-react'"

**Solução**:

```bash
npm install lucide-react
```

### Canvas não aparece ou está em branco

**Solução**:

1. Verifique se o Tailwind CSS está configurado
2. Limpe o cache: `npm cache clean --force`
3. Reinstale: `rm -rf node_modules package-lock.json && npm install`

### Simulação Python não executa

**Solução**:

```bash
pip install pygame
# ou
pip3 install pygame
```

### Cálculos parecem incorretos

**Verificar**:

- Unidades: metros vs pixels
- Ângulos: graus vs radianos
- Sistema de coordenadas: Canvas usa Y invertido

---

## 📱 Estrutura Visual da Interface

```
┌─────────────────────────────────────────────────────────────┐
│  Exercícios de Robótica - Cinemática e Navegação            │
├──────────────┬──────────────────────────────────────────────┤
│              │                                               │
│  Menu        │         Canvas de Visualização               │
│  Lateral     │              (800x600)                        │
│              │                                               │
│ • Questão 1  │  [Visualização gráfica das transformações]   │
│   - 1a       │                                               │
│   - 1b       │                                               │
│              │                                               │
│ • Questão 2  ├──────────────────────────────────────────────┤
│   - 2a       │  Resultado:                                  │
│   - 2b       │  • Ponto transformado q: (x, y)              │
│   - 2c       │                                               │
│              ├──────────────────────────────────────────────┤
│ • Questão 3  │  Informações:                                │
│              │  • Descrição da questão                      │
│ [Controles]  │  • Parâmetros utilizados                     │
│              │  • Equações aplicadas                        │
└──────────────┴──────────────────────────────────────────────┘
```

---

## 📖 Documentação Adicional

- **EXERCISES_README.md**: Documentação completa dos exercícios
- **MATHEMATICAL_DOCS.md**: Todas as fórmulas e deduções matemáticas
- **README.md**: Visão geral do projeto

---

## 💡 Dicas de Uso

1. **Comece pela Questão 1a**: É a mais simples e ajuda a entender a interface
2. **Use o slider no exercício 2a**: Veja como a trajetória evolui no tempo
3. **Compare 1a e 1b**: Note como a ordem das transformações importa!
4. **Preste atenção nas cores**: Cada cor tem um significado específico
5. **Leia os painéis informativos**: Eles explicam o que está acontecendo

---

## 🎓 Conceitos que Você Vai Aprender

- ✅ Como transformações geométricas funcionam
- ✅ O que são matrizes homogêneas e por que são úteis
- ✅ Como robôs planejam seus movimentos
- ✅ Cinemática de veículos com esterçamento
- ✅ Estratégias de navegação reativa
- ✅ Controladores proporcionais

---

## 🆘 Precisa de Ajuda?

1. Consulte a documentação em `EXERCISES_README.md`
2. Veja as fórmulas em `MATHEMATICAL_DOCS.md`
3. Verifique o código-fonte em `src/RobotExercises.jsx`

---

**Desenvolvido para**: UFMA - Princípios e Aplicações de Robótica

**Bons estudos! 🤖📚**
