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

# aStar-robot-app

Aplicação web para simulação do Algoritmo A\* em robótica móvel.

## Conteúdo

- Visualização interativa do Algoritmo A\*
- Editor de mapas (obstáculos, início, destino)
- Animação passo a passo
- Importação/exportação de mapas
- Estatísticas em tempo real

## Estrutura

- `index.html` — Página principal
- `css/style.css` — Estilos visuais
- `js/` — Lógica do algoritmo e interface
- `assets/examples/` — Mapas de exemplo

## Como usar

Abra `index.html` no navegador ou execute um servidor local:

```bash
python -m http.server 8000
```

## Documentação

Consulte o [MANUAL.md](MANUAL.md) para instruções detalhadas.
