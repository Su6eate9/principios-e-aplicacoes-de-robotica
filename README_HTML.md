# 🤖 Exercícios de Robótica - Versão HTML Standalone

## 🚀 Como Executar

### Opção 1: Abrir Diretamente

1. Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge, etc.)
2. **Pronto!** A aplicação funcionará imediatamente

### Opção 2: Usar Live Server (Recomendado)

Se você tiver Python instalado:

```bash
# Python 3
python -m http.server 8000

# Ou Python 2
python -m SimpleHTTPServer 8000
```

Depois acesse: `http://localhost:8000`

### Opção 3: VS Code Live Server

1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

## 📁 Arquivos

- **index.html** - Estrutura HTML da aplicação
- **styles.css** - Estilos visuais (dark theme)
- **script.js** - Lógica JavaScript com todos os cálculos

## 🎯 Exercícios Disponíveis

### 1. Transformações Geométricas (2.0 pontos)

- **1a)** p=(0,0) → Translação(3,2) + Rotação(45°)
- **1b)** p=(0,1) → Rotação(-45°) + Translação(3,2)

### 2. Modelo de Bicicleta (4.0 pontos)

- **2a)** Posição do robô em função do tempo (slider de 0 a 5s)
- **2b)** Cálculo com ω = 1/10 rad/s
- **2c)** Controlador de navegação entre pontos

### 3. Navegação Braitenberg (3.0 pontos)

- Estratégia de navegação de (200,200) para (180,220)

## 🎮 Como Usar

1. **Selecione um exercício** no menu lateral esquerdo
2. **Visualize a solução** no canvas central
3. **Ajuste o tempo** (exercício 2a) usando o slider
4. **Leia os resultados** nos painéis abaixo do canvas

## 🎨 Legenda de Cores

- 🟢 **Verde**: Ponto/posição inicial
- 🔴 **Vermelho**: Ponto/posição final ou alvo
- 🔵 **Azul**: Pontos intermediários e trajetórias
- 🟡 **Amarelo**: Informações de resultado

## 📐 Características

- ✅ **Zero dependências** - Apenas HTML, CSS e JavaScript puro
- ✅ **Funciona offline** - Não precisa de internet
- ✅ **Responsivo** - Adapta a diferentes tamanhos de tela
- ✅ **Visual moderno** - Interface dark com animações suaves
- ✅ **Cálculos precisos** - Todas as fórmulas implementadas corretamente

## 🔧 Tecnologias Usadas

- HTML5 Canvas para visualizações gráficas
- CSS3 com Grid e Flexbox
- JavaScript ES6+ (Vanilla JS)
- Matemática: Matrizes de transformação, cinemática de robôs

## 📖 Conceitos Implementados

1. **Transformações Homogêneas 2D**

   - Matrizes 3×3
   - Translação e rotação
   - Composição de transformações

2. **Modelo de Bicicleta**

   - Cinemática de veículos
   - Ângulo de Ackermann
   - Trajetórias circulares

3. **Navegação Braitenberg**
   - Controlador reativo
   - Proporcional à distância
   - Correção de orientação

## 🌐 Compatibilidade

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ Internet Explorer (não suportado)

## 📱 Responsividade

A aplicação se adapta automaticamente a:

- Desktop (1920×1080 e maiores)
- Laptop (1366×768)
- Tablet (768×1024)
- Mobile (360×640)

## 💡 Dicas

1. Para melhor visualização, use tela em modo paisagem
2. Zoom do navegador: 100% (padrão)
3. Os cálculos são instantâneos - não há delay
4. O canvas usa coordenadas cartesianas padrão

## 🐛 Solução de Problemas

### Canvas não aparece

- Certifique-se de que JavaScript está habilitado no navegador
- Verifique se os 3 arquivos estão na mesma pasta

### Visualização incorreta

- Limpe o cache do navegador (Ctrl+F5)
- Teste em outro navegador

### Cálculos parecem errados

- Verifique se está no exercício correto
- Os resultados estão em unidades corretas (metros, graus, etc.)

## 📚 Documentação Completa

Para entender as fórmulas matemáticas em detalhes, consulte:

- **MATHEMATICAL_DOCS.md** - Todas as deduções matemáticas
- **EXERCISES_README.md** - Explicação detalhada de cada exercício

## 👨‍💻 Estrutura do Código

```
script.js
├── Funções Matemáticas
│   ├── calculateTransformationMatrix()
│   ├── multiplyMatrices()
│   └── transformPoint()
├── Exercícios (1a, 1b, 2a, 2b, 2c, 3)
│   └── Cada um retorna dados formatados
├── Geração de Trajetórias
│   ├── generateBicyclePath()
│   ├── generateLinearPath()
│   └── generateBraitenbergPath()
└── Renderização Canvas
    ├── drawGrid()
    └── renderExercise*()
```

## 🎓 Objetivo Educacional

Este projeto demonstra:

- Transformações geométricas em robótica
- Cinemática de robôs móveis
- Estratégias de navegação
- Visualização de conceitos matemáticos abstratos

## 📄 Licença

Desenvolvido para fins educacionais - UFMA 2025

## 🆘 Suporte

Se encontrar problemas:

1. Verifique o console do navegador (F12)
2. Confirme que todos os arquivos estão presentes
3. Teste em navegador diferente

---

**Bons estudos! 🤖📚**
