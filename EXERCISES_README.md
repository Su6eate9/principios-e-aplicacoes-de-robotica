# Exercícios de Robótica - Soluções em React

Este componente React (`RobotExercises.jsx`) implementa as soluções para os exercícios de Princípios e Aplicações de Robótica.

## 📋 Questões Implementadas

### 1. Transformações e Pontos (Questão 1 - 2.0 pontos)

#### 1a) Transformação do ponto p = (0, 0, 1)

- **Operações**: Translação (3, 2) e Rotação de 45°
- **Visualização**: Mostra o ponto inicial, após translação e após rotação
- **Resultado**: Calcula a matriz de transformação combinada T₂ × T₁
- **Fórmula**:
  ```
  T = [cos(θ)  -sin(θ)  dx]
      [sin(θ)   cos(θ)  dy]
      [0        0       1 ]
  ```

#### 1b) Transformação do ponto p = (0, 1, 1)

- **Operações**: Rotação de -45° e Translação (3, 2)
- **Ordem diferente**: Note que a ordem das transformações importa!
- **Visualização**: Trajetória completa do ponto

### 2. Modelo de Bicicleta - Cinemática Robótica (Questão 2 - 4.0 pontos)

#### 2a) Posição do robô em t = 1s

- **Parâmetros**:
  - Velocidade: v = 1 m/s
  - Distância entre eixos: s = 1m
  - Ângulo de direção: δ = 45°
  - Orientação inicial: γ = 0
- **Controles interativos**: Slider para ajustar o tempo (0 a 5 segundos)
- **Visualização**: Trajetória circular do robô
- **Equações**:
  ```
  γ(t) = (v/s) × tan(δ) × t
  x(t) = (s/tan(δ)) × [sin(γ(t)) - sin(γ₀)]
  y(t) = (s/tan(δ)) × [-cos(γ(t)) + cos(γ₀)]
  ```

#### 2b) Velocidade angular ω = 1/10 rad/s

- **Condições**: v = 1m/s, s = 1m, t = 1s
- **Cálculo**: Determina o ângulo de direção δ necessário
- **Fórmula**: ω = (v/s) × tan(δ)
- **Resultado**: Posição final e ângulo δ calculado

#### 2c) Controlador de navegação

- **Trajetórias**:
  1. (170, 223) → (190, 250)
  2. (190, 250) → (130, 170)
- **Implementação**: Controlador para deslocar o robô entre posições específicas
- **Visualização**: Mostra o caminho planejado entre os pontos

### 3. Navegação Braitenberg (Questão 3 - 3.0 pontos)

#### Navegação de (200, 200) para (180, 220)

- **Estratégia**: Controlador Braitenberg (proporcional)
- **Parâmetros**:
  - Kv = 0.5 (ganho de velocidade)
  - Kh = 1.0 (ganho de direção)
- **Visualização**:
  - Ponto verde: posição inicial
  - Círculo vermelho: alvo
  - Linha azul: trajetória calculada
- **Equações**:
  ```
  v* = Kv × distância
  γ = Kh × ângulo_desejado
  ```

## 🎨 Recursos Visuais

- **Canvas Interativo**: Visualização gráfica de todas as transformações
- **Grid de Coordenadas**: Sistema de coordenadas cartesianas
- **Cores Diferenciadas**:
  - 🔵 Azul: Pontos intermediários e trajetórias
  - 🟢 Verde: Pontos iniciais
  - 🔴 Vermelho: Pontos finais/alvos
  - 🟡 Amarelo: Informações de resultado

## 🚀 Como Usar

### Instalação

```bash
npm install lucide-react
```

### Uso no React

```jsx
import RobotExercises from "./src/RobotExercises";

function App() {
  return <RobotExercises />;
}
```

### Navegação

1. **Selecione um exercício** no menu lateral esquerdo
2. **Visualize a solução** no canvas central
3. **Ajuste parâmetros** quando disponível (ex: tempo no exercício 2a)
4. **Leia os resultados** nos painéis informativos

## 📐 Conceitos Matemáticos Implementados

### Matrizes de Transformação Homogêneas

```
Translação:        Rotação:
[1  0  dx]        [cos(θ)  -sin(θ)  0]
[0  1  dy]        [sin(θ)   cos(θ)  0]
[0  0   1]        [0        0       1]
```

### Modelo Cinemático de Bicicleta

- Representa robôs com esterçamento nas rodas dianteiras
- Usado em carros autônomos e AGVs
- Equações diferenciais para movimento circular

### Controlador Braitenberg

- Navegação reativa baseada em sensores
- Velocidade proporcional à distância
- Direção proporcional ao ângulo de erro

## 🎯 Características do Componente

- ✅ **Zero dependências externas** (além do React e Lucide Icons)
- ✅ **Totalmente responsivo**
- ✅ **Cálculos precisos** em tempo real
- ✅ **Interface intuitiva** com dark mode
- ✅ **Visualizações animadas** e interativas
- ✅ **Educacional**: mostra passo a passo das transformações

## 📊 Estrutura do Código

```
RobotExercises.jsx
├── Estados (useState)
│   ├── selectedExercise - exercício atual
│   ├── bicycleTime - tempo para modelo de bicicleta
│   ├── bicycleParams - parâmetros do modelo
│   └── robotPos/targetPos - posições para navegação
├── Funções de Cálculo
│   ├── calculateTransformationMatrix()
│   ├── multiplyMatrices()
│   ├── transformPoint()
│   ├── exercise1a(), exercise1b()
│   ├── exercise2a(), exercise2b(), exercise2c()
│   └── exercise3()
├── Funções de Geração de Trajetória
│   ├── generateBicyclePath()
│   ├── generateLinearPath()
│   └── generateBraitenbergPath()
└── Renderização Canvas (useEffect)
    ├── Desenho de grid e eixos
    ├── Renderização por exercício
    └── Atualização de resultados
```

## 🔬 Aplicações Práticas

Este código demonstra conceitos fundamentais usados em:

- **Robôs móveis autônomos**
- **Carros autônomos**
- **Drones**
- **AGVs (Automated Guided Vehicles)**
- **Simuladores de robótica**

## 📝 Notas Importantes

1. **Sistemas de Coordenadas**: O canvas usa coordenadas de tela (Y invertido), mas os cálculos usam coordenadas cartesianas padrão
2. **Escala**: 50 pixels = 1 unidade de distância
3. **Ângulos**: Todos os cálculos internos usam radianos, mas a exibição usa graus
4. **Precisão**: Resultados exibidos com 3-4 casas decimais

## 🐛 Solução de Problemas

### Canvas não aparece

- Verifique se o componente está sendo renderizado corretamente
- Certifique-se de que o CSS do Tailwind está configurado

### Cálculos incorretos

- Verifique as unidades (metros vs pixels)
- Confirme os ângulos (radianos vs graus)

### Performance lenta

- Reduza o número de steps nas trajetórias
- Otimize o número de renderizações

## 📚 Referências

- Siegwart, R., & Nourbakhsh, I. R. (2004). _Introduction to Autonomous Mobile Robots_
- Craig, J. J. (2005). _Introduction to Robotics: Mechanics and Control_
- Modelo de Bicicleta: Cinemática de veículos não-holonômicos

---

**Desenvolvido para**: Disciplina de Princípios e Aplicações de Robótica - UFMA
**Tecnologias**: React, Canvas API, JavaScript ES6+
