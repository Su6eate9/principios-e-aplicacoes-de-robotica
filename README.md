# Princípios e Aplicações de Robótica

Este repositório contém implementações e exercícios para a disciplina de Princípios e Aplicações de Robótica da UFMA.

## 📁 Estrutura do Projeto

```
src/
├── RobotExercises.jsx          # Componente principal com todos os exercícios
├── App.jsx                      # Aplicação React principal
├── robotRoute.jsx               # Navegação e transformações do robô
├── robotSimulationDynamic.py    # Simulação dinâmica em Python
└── robotSimulationStaticVelocity.jsx  # Simulação com velocidade estática
```

## 🎯 Exercícios Implementados

### 1. Transformações Geométricas (2.0 pontos)

- **1a)** Transformação de ponto com translação e rotação
- **1b)** Transformação com ordem inversa de operações
- Matrizes de transformação homogêneas
- Visualização interativa das transformações

### 2. Modelo de Bicicleta - Cinemática (4.0 pontos)

- **2a)** Cálculo de posição em função do tempo
- **2b)** Determinação de ângulos com velocidade angular
- **2c)** Controlador para navegação entre pontos
- Equações cinemáticas completas
- Interface com controles de tempo ajustáveis

### 3. Navegação Braitenberg (3.0 pontos)

- Estratégia de navegação reativa
- Controlador proporcional
- Visualização de trajetória em tempo real
- Cálculo de distância e ângulos

## 🚀 Como Executar

### Pré-requisitos

```bash
npm install
npm install lucide-react
```

### Executar React

```bash
npm start
```

### Executar Python (Simulação Dinâmica)

```bash
python src/robotSimulationDynamic.py
```

## 📚 Componentes

### RobotExercises.jsx

Componente React completo que implementa todas as questões da lista de exercícios com:

- Canvas interativo para visualização
- Cálculos matemáticos precisos
- Interface intuitiva com seleção de exercícios
- Controles ajustáveis para parâmetros

Veja [EXERCISES_README.md](./EXERCISES_README.md) para documentação completa.

### robotRoute.jsx

Implementação de navegação com:

- Sequência de comandos de movimento
- Matrizes de transformação
- Histórico de posições
- Visualização de trajetória

### robotSimulationDynamic.py

Simulação Python usando pygame com:

- Modelo cinemático de robô móvel
- Controlador para navegação até alvo
- Visualização de trajetória em tempo real
- Referencial do robô

### robotSimulationStaticVelocity.jsx

Simulação React com velocidade constante:

- Controle por teclado
- Visualização de orientação
- Canvas animado

## 🎨 Tecnologias Utilizadas

- **React** - Interface e visualizações interativas
- **JavaScript ES6+** - Lógica e cálculos
- **Canvas API** - Renderização gráfica
- **Tailwind CSS** - Estilização
- **Python + Pygame** - Simulação dinâmica
- **Lucide React** - Ícones

## 📐 Conceitos Implementados

- ✅ Transformações homogêneas 2D
- ✅ Cinemática de robôs móveis
- ✅ Modelo de bicicleta (Ackermann)
- ✅ Navegação reativa (Braitenberg)
- ✅ Controladores proporcionais
- ✅ Planejamento de trajetória

## 📖 Referências

- Siegwart, R., & Nourbakhsh, I. R. (2004). _Introduction to Autonomous Mobile Robots_
- Craig, J. J. (2005). _Introduction to Robotics: Mechanics and Control_

## 👨‍💻 Autor

Desenvolvido para a disciplina de Princípios e Aplicações de Robótica - UFMA

## 📄 Licença

Este projeto é para fins educacionais.
