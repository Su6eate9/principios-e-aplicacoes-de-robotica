const AppState = {
  grid: null,
  ui: null,
  mapLoader: null,
  notificationManager: null,
  astar: null,
  currentTool: "toggle",
  isDrawing: false,
  isAnimating: false,
  animationGenerator: null,
  animationSpeed: "medium",
};

function init() {
  AppState.grid = new Grid(10, 10);
  AppState.mapLoader = new MapLoader();
  AppState.notificationManager = new NotificationManager();

  const canvas = document.getElementById("grid-canvas");
  AppState.ui = new UI(canvas, AppState.grid);

  AppState.grid.setStart(0, 0);
  AppState.grid.setGoal(9, 9);
  updateCoordinateDisplay();

  AppState.ui.render();

  setupEventListeners();

  AppState.notificationManager.success("Aplicação carregada com sucesso");
  updateStatus("Pronto");
}

function setupEventListeners() {
  setupCanvasEvents();

  // Eventos de carregamento de mapas
  document
    .getElementById("file-input")
    .addEventListener("change", handleFileUpload);
  document.getElementById("save-map").addEventListener("click", handleSaveMap);
  document
    .getElementById("clear-map")
    .addEventListener("click", handleClearMap);

  // Mapas padrão
  document
    .getElementById("load-small")
    .addEventListener("click", () => loadDefaultMap("small"));
  document
    .getElementById("load-medium")
    .addEventListener("click", () => loadDefaultMap("medium"));
  document
    .getElementById("load-large")
    .addEventListener("click", () => loadDefaultMap("large"));

  // Coordenadas
  document
    .getElementById("set-start")
    .addEventListener("click", handleSetStart);
  document.getElementById("set-goal").addEventListener("click", handleSetGoal);

  // Movimento do robô
  document
    .getElementById("move-robot")
    .addEventListener("click", handleMoveRobot);

  // Configurações
  document
    .getElementById("allow-diagonal")
    .addEventListener("change", handleConfigChange);
  document
    .getElementById("speed")
    .addEventListener("change", handleSpeedChange);

  // Execução do A*
  document
    .getElementById("run-astar")
    .addEventListener("click", handleRunAStar);
  document
    .getElementById("step-astar")
    .addEventListener("click", handleStepAStar);
  document
    .getElementById("pause-astar")
    .addEventListener("click", handlePauseAStar);
  document
    .getElementById("reset-path")
    .addEventListener("click", handleResetPath);

  // Ferramentas de edição
  const toolRadios = document.querySelectorAll('input[name="tool"]');
  toolRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      AppState.currentTool = e.target.value;
    });
  });

  // Redimensionamento da janela
  window.addEventListener("resize", () => {
    AppState.ui.resize();
  });
}

function setupCanvasEvents() {
  const canvas = document.getElementById("grid-canvas");

  canvas.addEventListener("mousedown", handleCanvasMouseDown);
  canvas.addEventListener("mousemove", handleCanvasMouseMove);
  canvas.addEventListener("mouseup", handleCanvasMouseUp);
  canvas.addEventListener("mouseleave", handleCanvasMouseLeave);
}

function handleCanvasMouseDown(e) {
  AppState.isDrawing = true;
  handleCanvasClick(e);
}

function handleCanvasMouseMove(e) {
  const coords = AppState.ui.canvasToGrid(e.clientX, e.clientY);

  if (coords) {
    AppState.ui.setHoveredCell(coords.row, coords.col);

    if (AppState.isDrawing && AppState.currentTool === "toggle") {
      AppState.grid.toggleCell(coords.row, coords.col);
      AppState.ui.render();
    }
  } else {
    AppState.ui.clearHoveredCell();
  }
}

function handleCanvasMouseUp() {
  AppState.isDrawing = false;
}

function handleCanvasMouseLeave() {
  AppState.isDrawing = false;
  AppState.ui.clearHoveredCell();
}

function handleCanvasClick(e) {
  const coords = AppState.ui.canvasToGrid(e.clientX, e.clientY);

  if (!coords) return;

  const { row, col } = coords;

  switch (AppState.currentTool) {
    case "toggle":
      if (AppState.grid.toggleCell(row, col)) {
        AppState.ui.render();
      }
      break;

    case "start":
      if (AppState.grid.setStart(row, col)) {
        updateCoordinateDisplay();
        AppState.ui.render();
        AppState.notificationManager.success(
          `Início definido em (${row}, ${col})`
        );
      }
      break;

    case "goal":
      if (AppState.grid.setGoal(row, col)) {
        updateCoordinateDisplay();
        AppState.ui.render();
        AppState.notificationManager.success(
          `Destino definido em (${row}, ${col})`
        );
      }
      break;
  }
}

async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  try {
    updateStatus("Carregando mapa...");
    const mapArray = await AppState.mapLoader.loadFromFile(file);

    const validation = AppState.mapLoader.validateMap(mapArray);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Carrega o mapa na grade
    AppState.grid.loadFromArray(mapArray);
    AppState.ui.updateGrid(AppState.grid);

    // Define início e destino padrão
    AppState.grid.setStart(0, 0);
    AppState.grid.setGoal(AppState.grid.rows - 1, AppState.grid.cols - 1);
    updateCoordinateDisplay();
    AppState.ui.render();

    AppState.notificationManager.success(
      `Mapa carregado com sucesso (${AppState.grid.rows}×${AppState.grid.cols})`
    );
    updateStatus("Pronto");
  } catch (error) {
    AppState.notificationManager.error(
      `Erro ao carregar mapa: ${error.message}`
    );
    updateStatus("Erro ao carregar");
  }

  e.target.value = "";
}

function handleSaveMap() {
  try {
    const mapArray = AppState.grid.toArray();
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `mapa_${timestamp}.txt`;

    AppState.mapLoader.saveToFile(mapArray, filename);
    AppState.notificationManager.success(`Mapa salvo como ${filename}`);
  } catch (error) {
    AppState.notificationManager.error(`Erro ao salvar mapa: ${error.message}`);
  }
}

function handleClearMap() {
  if (confirm("Deseja realmente limpar toda a grade?")) {
    AppState.grid.clear();
    AppState.grid.setStart(0, 0);
    AppState.grid.setGoal(AppState.grid.rows - 1, AppState.grid.cols - 1);
    updateCoordinateDisplay();
    AppState.ui.clearPath();
    AppState.notificationManager.info("Grade limpa");
    updateStatus("Pronto");
  }
}

function loadDefaultMap(size) {
  try {
    const mapArray = AppState.mapLoader.getDefaultMap(size);
    AppState.grid.loadFromArray(mapArray);
    AppState.ui.updateGrid(AppState.grid);

    AppState.grid.setStart(0, 0);
    AppState.grid.setGoal(AppState.grid.rows - 1, AppState.grid.cols - 1);
    updateCoordinateDisplay();
    AppState.ui.render();

    const sizeNames = { small: "Pequeno", medium: "Médio", large: "Grande" };
    AppState.notificationManager.success(`Mapa ${sizeNames[size]} carregado`);
    updateStatus("Pronto");
  } catch (error) {
    AppState.notificationManager.error(
      `Erro ao carregar mapa padrão: ${error.message}`
    );
  }
}

function handleSetStart() {
  const row = parseInt(document.getElementById("start-row").value);
  const col = parseInt(document.getElementById("start-col").value);

  if (!AppState.grid.isValid(row, col)) {
    AppState.notificationManager.error("Coordenada fora dos limites do mapa");
    return;
  }

  if (AppState.grid.isOccupied(row, col)) {
    AppState.notificationManager.warning(
      "Não é possível definir início em célula ocupada"
    );
    return;
  }

  AppState.grid.setStart(row, col);
  updateCoordinateDisplay();
  AppState.ui.render();
  AppState.notificationManager.success(`Início definido em (${row}, ${col})`);
}

function handleSetGoal() {
  const row = parseInt(document.getElementById("goal-row").value);
  const col = parseInt(document.getElementById("goal-col").value);

  if (!AppState.grid.isValid(row, col)) {
    AppState.notificationManager.error("Coordenada fora dos limites do mapa");
    return;
  }

  if (AppState.grid.isOccupied(row, col)) {
    AppState.notificationManager.warning(
      "Não é possível definir destino em célula ocupada"
    );
    return;
  }

  AppState.grid.setGoal(row, col);
  updateCoordinateDisplay();
  AppState.ui.render();
  AppState.notificationManager.success(`Destino definido em (${row}, ${col})`);
}

function handleMoveRobot() {
  const row = parseInt(document.getElementById("move-row").value);
  const col = parseInt(document.getElementById("move-col").value);

  const result = AppState.grid.moveRobot(row, col);

  if (result.success) {
    AppState.ui.render();
    AppState.notificationManager.success(result.message);
  } else {
    AppState.notificationManager.error(result.message);
  }
}

function updateCoordinateDisplay() {
  const startDisplay = document.getElementById("current-start");
  const goalDisplay = document.getElementById("current-goal");

  if (AppState.grid.start) {
    const [row, col] = AppState.grid.start;
    startDisplay.textContent = `(${row}, ${col})`;
  } else {
    startDisplay.textContent = "Não definido";
  }

  if (AppState.grid.goal) {
    const [row, col] = AppState.grid.goal;
    goalDisplay.textContent = `(${row}, ${col})`;
  } else {
    goalDisplay.textContent = "Não definido";
  }
}

function handleConfigChange() {
  // Placeholder para futuras configurações
}

function handleSpeedChange(e) {
  AppState.animationSpeed = e.target.value;
}

function handleRunAStar() {
  if (AppState.isAnimating) {
    AppState.notificationManager.warning("Animação já em execução");
    return;
  }

  const validation = AppState.grid.validateForPathfinding();
  if (!validation.valid) {
    AppState.notificationManager.error(validation.message);
    return;
  }

  AppState.ui.clearPath();

  const allowDiagonal = document.getElementById("allow-diagonal").checked;

  AppState.astar = new AStar(AppState.grid);

  updateStatus("Executando A*...");
  const startTime = performance.now();

  const result = AppState.astar.findPath(allowDiagonal);

  const endTime = performance.now();
  const executionTime = (endTime - startTime).toFixed(2);

  if (result.success) {
    AppState.ui.setPath(result.path);
    AppState.notificationManager.success(result.message);
    updateStatus("Caminho encontrado");
    updatePathInfo(result.cost, result.visitedNodes, executionTime);
  } else {
    AppState.notificationManager.error(result.message);
    updateStatus("Sem caminho");
    updatePathInfo(0, result.visitedNodes, executionTime);
  }
}

async function handleStepAStar() {
  if (AppState.isAnimating) {
    AppState.notificationManager.warning("Animação já em execução");
    return;
  }

  const validation = AppState.grid.validateForPathfinding();
  if (!validation.valid) {
    AppState.notificationManager.error(validation.message);
    return;
  }

  AppState.ui.clearPath();

  const allowDiagonal = document.getElementById("allow-diagonal").checked;

  AppState.astar = new AStar(AppState.grid);

  AppState.animationGenerator =
    AppState.astar.findPathStepByStep(allowDiagonal);
  AppState.isAnimating = true;

  document.getElementById("pause-astar").disabled = false;
  document.getElementById("run-astar").disabled = true;
  document.getElementById("step-astar").disabled = true;

  updateStatus("Animando A*...");
  const startTime = performance.now();

  await animateAStar();

  const endTime = performance.now();
  const executionTime = (endTime - startTime).toFixed(2);

  document.getElementById("execution-time").textContent = `${executionTime} ms`;

  document.getElementById("pause-astar").disabled = true;
  document.getElementById("run-astar").disabled = false;
  document.getElementById("step-astar").disabled = false;
}

async function animateAStar() {
  const speeds = {
    slow: 200,
    medium: 100,
    fast: 30,
  };

  const delay = speeds[AppState.animationSpeed];

  for (const step of AppState.animationGenerator) {
    if (!AppState.isAnimating) {
      break;
    }

    if (step.type === "step") {
      AppState.ui.setExplorationNodes(step.openList, step.closedList);
      updatePathInfo("-", step.visitedNodes, "-");
      await sleep(delay);
    } else if (step.type === "complete") {
      if (step.success) {
        AppState.ui.setPath(step.path);
        AppState.notificationManager.success(step.message);
        updateStatus("Caminho encontrado");
        updatePathInfo(step.cost, step.visitedNodes, "-");
      } else {
        AppState.notificationManager.error(step.message);
        updateStatus("Sem caminho");
        updatePathInfo(0, step.visitedNodes, "-");
      }
    }
  }

  AppState.isAnimating = false;
}

function handlePauseAStar() {
  AppState.isAnimating = false;
  updateStatus("Animação pausada");
  document.getElementById("pause-astar").disabled = true;
  document.getElementById("run-astar").disabled = false;
  document.getElementById("step-astar").disabled = false;
}

function handleResetPath() {
  AppState.isAnimating = false;
  AppState.ui.clearPath();
  updateStatus("Pronto");
  updatePathInfo("-", "-", "-");
  document.getElementById("pause-astar").disabled = true;
  document.getElementById("run-astar").disabled = false;
  document.getElementById("step-astar").disabled = false;
  AppState.notificationManager.info("Caminho limpo");
}

function updateStatus(text) {
  document.getElementById("status-text").textContent = text;
}

function updatePathInfo(cost, nodesVisited, time) {
  document.getElementById("path-cost").textContent =
    typeof cost === "number" ? cost.toFixed(2) : cost;
  document.getElementById("nodes-visited").textContent = nodesVisited;
  document.getElementById("execution-time").textContent =
    typeof time === "number" ? `${time} ms` : time;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
