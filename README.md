aStar-robot-app/
│
├── index.html # Página principal
│
├── css/
│ └── style.css # Estilos completos (darkmode)
│
├── js/
│ ├── main.js # Inicialização e coordenação
│ ├── astar.js # Implementação do algoritmo A\*
│ ├── grid.js # Gerenciamento da grade
│ ├── mapLoader.js # Carregamento e salvamento
│ └── ui.js # Renderização e interface
│
├── assets/
│ └── examples/
│ ├── small.txt # Mapa 10×10
│ ├── medium.txt # Mapa 20×20
│ └── large.txt # Mapa 30×30
│
├── MANUAL.md # Manual completo de uso
└── README.md # Este arquivo

# Princípios e Aplicações de Robótica

Este repositório reúne materiais, códigos e exercícios para a disciplina **Princípios e Aplicações de Robótica** da UFMA.

## Objetivos da Disciplina

- Apresentar fundamentos matemáticos e computacionais da robótica móvel
- Explorar algoritmos de navegação, planejamento e controle
- Desenvolver habilidades práticas em simulação e programação de robôs
- Aplicar conceitos de cinemática, transformações geométricas e estratégias de navegação

## Conteúdo Programático

1. **Transformações Geométricas**
   - Matrizes homogêneas
   - Translação e rotação
   - Composição de transformações
2. **Modelos Cinemáticos de Robôs**
   - Modelo de bicicleta
   - Cinemática diferencial
   - Simulação de movimento
3. **Algoritmos de Navegação**
   - Algoritmo A\*
   - Controladores reativos (Braitenberg)
   - Planejamento de trajetórias
4. **Simulação Computacional**
   - Visualização gráfica (Canvas, React)
   - Simulação dinâmica (Python)

## Estrutura do Repositório

- `aStar-robot-app/` — Aplicação web completa do Algoritmo A\* para navegação
- `assets/` — Exemplos de mapas para simulação
- `reverseCinematic/` — Simulação dinâmica em Python
- `css/` e `js/` — Arquivos para versão HTML standalone dos exercícios

## Documentação

- `EXERCISES_README.md` — Detalhes dos exercícios resolvidos
- `MATHEMATICAL_DOCS.md` — Deduções matemáticas e fórmulas
- `QUICKSTART.md` — Guia rápido de uso
- `README_HTML.md` — Instruções para versão HTML

## Como Usar

- Para simular o Algoritmo A\*, abra `aStar-robot-app/index.html` ou execute um servidor local
- Para visualizar os exercícios, use a versão React ou HTML standalone
- Para simulação dinâmica, execute o script Python em `reverseCinematic/`

## Referências

- Siegwart, R., & Nourbakhsh, I. R. (2004). Introduction to Autonomous Mobile Robots
- Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach
- Hart, P. E., Nilsson, N. J., & Raphael, B. (1968). A Formal Basis for the Heuristic Determination of Minimum Cost Paths

---

**Desenvolvido para fins educacionais — UFMA 2025**
