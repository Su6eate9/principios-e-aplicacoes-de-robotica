# Documentação Matemática - Exercícios de Robótica

## 1. Transformações Geométricas

### 1.1 Matrizes de Transformação Homogêneas

As transformações 2D são representadas por matrizes 3×3 homogêneas:

#### Matriz de Translação

```
T(dx, dy) = | 1   0   dx |
            | 0   1   dy |
            | 0   0   1  |
```

#### Matriz de Rotação

```
R(θ) = | cos(θ)  -sin(θ)  0 |
       | sin(θ)   cos(θ)  0 |
       | 0        0       1 |
```

#### Matriz de Transformação Composta (Rotação + Translação)

```
T(dx, dy, θ) = | cos(θ)  -sin(θ)  dx |
               | sin(θ)   cos(θ)  dy |
               | 0        0       1  |
```

### 1.2 Questão 1a - Ponto p = (0, 0, 1)

**Transformações:**

1. Translação: T₁(3, 2)
2. Rotação: T₂(45°)

**Ponto homogêneo:**

```
p = | 0 |
    | 0 |
    | 1 |
```

**Matriz T₁ (Translação):**

```
T₁ = | 1   0   3 |
     | 0   1   2 |
     | 0   0   1 |
```

**Matriz T₂ (Rotação 45°):**

```
cos(45°) = √2/2 ≈ 0.7071
sin(45°) = √2/2 ≈ 0.7071

T₂ = | 0.7071  -0.7071  0 |
     | 0.7071   0.7071  0 |
     | 0        0       1 |
```

**Transformação Composta:**

```
T = T₂ × T₁ = | 0.7071  -0.7071  3 | × | 1  0  3 |
              | 0.7071   0.7071  2 |   | 0  1  2 |
              | 0        0       1 |   | 0  0  1 |

    = | 0.7071  -0.7071  0.7071 |
      | 0.7071   0.7071  3.5355 |
      | 0        0       1      |
```

**Ponto Transformado q:**

```
q = T × p = | 0.7071  -0.7071  0.7071 | × | 0 |   | 0.7071  |
            | 0.7071   0.7071  3.5355 |   | 0 | = | 3.5355  |
            | 0        0       1      |   | 1 |   | 1       |
```

**Resultado:** q = (0.7071, 3.5355, 1)

### 1.3 Questão 1b - Ponto p = (0, 1, 1)

**Transformações:**

1. Rotação: T₁(-45°)
2. Translação: T₂(3, 2)

**Ponto homogêneo:**

```
p = | 0 |
    | 1 |
    | 1 |
```

**Matriz T₁ (Rotação -45°):**

```
cos(-45°) = √2/2 ≈ 0.7071
sin(-45°) = -√2/2 ≈ -0.7071

T₁ = | 0.7071   0.7071  0 |
     | -0.7071  0.7071  0 |
     | 0        0       1 |
```

**Matriz T₂ (Translação):**

```
T₂ = | 1   0   3 |
     | 0   1   2 |
     | 0   0   1 |
```

**Transformação Composta:**

```
T = T₂ × T₁ = | 1  0  3 | × | 0.7071   0.7071  0 |
              | 0  1  2 |   | -0.7071  0.7071  0 |
              | 0  0  1 |   | 0        0       1 |

    = | 0.7071   0.7071  3 |
      | -0.7071  0.7071  2 |
      | 0        0       1 |
```

**Ponto Transformado q:**

```
q = T × p = | 0.7071   0.7071  3 | × | 0 |   | 3.7071  |
            | -0.7071  0.7071  2 |   | 1 | = | 2.7071  |
            | 0        0       1 |   | 1 |   | 1       |
```

**Resultado:** q = (3.7071, 2.7071, 1)

**Nota:** Observe que a ordem das transformações importa! T₂×T₁ ≠ T₁×T₂

---

## 2. Modelo de Bicicleta (Cinemática de Veículos)

### 2.1 Modelo Cinemático

O modelo de bicicleta representa veículos com esterçamento Ackermann:

![Modelo de Bicicleta]

```
    ┌─────┐
    │     │  δ (ângulo de esterçamento)
    │  ●  │ ─→ v (velocidade)
    │     │
    └─────┘
      ↑ s (distância entre eixos)
```

**Variáveis:**

- `v` : velocidade linear (m/s)
- `s` : distância entre eixos (m)
- `δ` : ângulo de esterçamento (rad)
- `γ` : orientação do veículo (rad)
- `ω` : velocidade angular (rad/s)

### 2.2 Equações do Modelo

#### Velocidade Angular

```
ω = (v/s) × tan(δ)
```

#### Orientação em função do tempo

```
γ(t) = γ₀ + ω × t = γ₀ + (v/s) × tan(δ) × t
```

#### Posição (movimento circular)

```
R = s / tan(δ)  (raio de curvatura)

x(t) = R × [sin(γ(t)) - sin(γ₀)]
y(t) = R × [-cos(γ(t)) + cos(γ₀)]
```

Ou explicitamente:

```
x(t) = (s/tan(δ)) × [sin(γ₀ + (v/s)×tan(δ)×t) - sin(γ₀)]
y(t) = (s/tan(δ)) × [-cos(γ₀ + (v/s)×tan(δ)×t) + cos(γ₀)]
```

### 2.3 Questão 2a - Posição em t = 1s

**Dados:**

- v = 1 m/s
- s = 1 m
- δ = 45° = π/4 rad
- γ₀ = 0
- t = 1 s

**Cálculos:**

1. **Velocidade angular:**

```
ω = (v/s) × tan(δ) = (1/1) × tan(45°) = 1 × 1 = 1 rad/s
```

2. **Orientação em t=1s:**

```
γ(1) = 0 + 1 × 1 = 1 rad ≈ 57.3°
```

3. **Raio de curvatura:**

```
R = s / tan(δ) = 1 / tan(45°) = 1 / 1 = 1 m
```

4. **Posição em t=1s:**

```
x(1) = 1 × [sin(1) - sin(0)] = 1 × 0.8414 ≈ 0.841 m
y(1) = 1 × [-cos(1) + cos(0)] = 1 × [-0.5403 + 1] ≈ 0.460 m
```

**Resultado:**

- Posição: (0.841, 0.460) m
- Orientação: 57.3°

### 2.4 Questão 2b - Velocidade angular ω = 1/10 rad/s

**Dados:**

- v = 1 m/s
- s = 1 m
- ω = 1/10 rad/s = 0.1 rad/s
- γ₀ = 0
- t = 1 s

**Cálculos:**

1. **Ângulo de esterçamento δ:**

```
ω = (v/s) × tan(δ)
0.1 = (1/1) × tan(δ)
tan(δ) = 0.1
δ = arctan(0.1) ≈ 0.0997 rad ≈ 5.71°
```

2. **Orientação em t=1s:**

```
γ(1) = 0 + 0.1 × 1 = 0.1 rad ≈ 5.73°
```

3. **Raio de curvatura:**

```
R = v / ω = 1 / 0.1 = 10 m
```

4. **Posição em t=1s:**

```
x(1) = 10 × [sin(0.1) - sin(0)] ≈ 10 × 0.0998 ≈ 0.998 m
y(1) = 10 × [-cos(0.1) + cos(0)] ≈ 10 × 0.005 ≈ 0.050 m
```

**Resultado:**

- Posição: (0.998, 0.050) m
- Orientação: 5.73°
- Ângulo de esterçamento: 5.71°

### 2.5 Questão 2c - Controlador de Navegação

**Objetivo:** Navegar entre posições específicas

**Trajetórias:**

1. (170, 223) → (190, 250)
2. (190, 250) → (130, 170)

**Estratégia de Controle:**

Para cada segmento (x₀, y₀) → (xf, yf):

1. **Calcular distância:**

```
d = √[(xf - x₀)² + (yf - y₀)²]
```

2. **Calcular ângulo desejado:**

```
θd = arctan2(yf - y₀, xf - x₀)
```

3. **Erro de orientação:**

```
θe = θd - θcurrent
```

4. **Leis de controle:**

```
v = Kv × d           (velocidade proporcional à distância)
ω = Kh × θe          (velocidade angular proporcional ao erro)
```

**Exemplo - Trajetória 1:**

```
Δx = 190 - 170 = 20 pixels
Δy = 250 - 223 = 27 pixels
d = √(20² + 27²) = √(400 + 729) = √1129 ≈ 33.6 pixels
θ = arctan2(27, 20) ≈ 53.5°
```

---

## 3. Navegação Braitenberg

### 3.1 Princípio

A navegação Braitenberg é uma estratégia reativa onde:

- A **velocidade** é proporcional à **distância** ao alvo
- A **direção** é proporcional ao **erro angular**

### 3.2 Equações do Controlador

**Variáveis:**

- (xr, yr): posição atual do robô
- (xt, yt): posição do alvo
- θ: orientação atual do robô
- Kv: ganho de velocidade
- Kh: ganho de direção

**Cálculos:**

1. **Vetor erro:**

```
Δx = xt - xr
Δy = yt - yr
```

2. **Distância ao alvo:**

```
d = √(Δx² + Δy²)
```

3. **Ângulo desejado:**

```
θd = arctan2(Δy, Δx)
```

4. **Erro angular:**

```
θe = θd - θ
```

5. **Comandos de controle:**

```
v* = Kv × d           (velocidade desejada)
γ = Kh × θe           (comando de direção)
```

### 3.3 Questão 3 - (200, 200) → (180, 220)

**Dados:**

- Posição inicial: (200, 200)
- Alvo: (180, 220)
- Kv = 0.5
- Kh = 1.0

**Cálculos:**

1. **Vetor erro:**

```
Δx = 180 - 200 = -20
Δy = 220 - 200 = 20
```

2. **Distância:**

```
d = √[(-20)² + 20²] = √800 ≈ 28.28 pixels
```

3. **Ângulo desejado:**

```
θd = arctan2(20, -20) = arctan2(1, -1) ≈ 135° (2º quadrante)
```

4. **Velocidade desejada:**

```
v* = Kv × d = 0.5 × 28.28 ≈ 14.14 pixels/s
```

5. **Comando de direção (assumindo θ = 0):**

```
γ = Kh × θe = 1.0 × 135° = 135°
```

**Comportamento:**

- O robô se vira para a esquerda (135°)
- Move-se em direção ao alvo com velocidade proporcional
- À medida que se aproxima, a velocidade diminui
- Quando d → 0, v\* → 0 (para no alvo)

### 3.4 Análise de Estabilidade

O sistema é **assintoticamente estável** se:

- Kv > 0: garante movimento em direção ao alvo
- Kh > 0: garante correção de orientação
- Existência de condição de parada: d < ε (tolerância)

**Função de Lyapunov:**

```
V = ½ d²

dV/dt = d × (-Kv × d) = -Kv × d² < 0  (para d > 0)
```

Logo, o sistema converge para o alvo.

---

## 4. Conversão de Unidades

### Pixels para Metros (usado nas simulações)

```
M2P = 3779.52 pixels/metro

metros → pixels: p = m × M2P
pixels → metros: m = p / M2P
```

### Ângulos

```
Radianos → Graus: θ° = θ × (180/π)
Graus → Radianos: θ = θ° × (π/180)
```

---

## 5. Referências e Fórmulas Importantes

### Trigonometria

```
sin²(θ) + cos²(θ) = 1
tan(θ) = sin(θ) / cos(θ)
arctan2(y, x): retorna ângulo no quadrante correto [-π, π]
```

### Matriz Rotação (propriedades)

```
R(θ)⁻¹ = R(-θ) = R(θ)ᵀ  (ortogonal)
R(θ₁) × R(θ₂) = R(θ₁ + θ₂)  (composição)
```

### Cinemática Diferencial

```
ẋ = v × cos(θ)
ẏ = v × sin(θ)
θ̇ = ω
```

---

**Fim da Documentação Matemática**
