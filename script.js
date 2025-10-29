// Configurações globais
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
let canvas, ctx;
let currentExercise = "1a";
let bicycleTime = 1.0;

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  setupEventListeners();
  renderExercise("1a");
});

// Event Listeners
function setupEventListeners() {
  // Botões de exercício
  const buttons = document.querySelectorAll(".exercise-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      buttons.forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");

      const exercise = e.target.dataset.exercise;
      currentExercise = exercise;
      renderExercise(exercise);

      // Mostrar/ocultar controle de tempo
      const timeControl = document.getElementById("time-control");
      if (exercise === "2a") {
        timeControl.classList.remove("hidden");
      } else {
        timeControl.classList.add("hidden");
      }
    });
  });

  // Slider de tempo
  const timeSlider = document.getElementById("time-slider");
  timeSlider.addEventListener("input", (e) => {
    bicycleTime = parseFloat(e.target.value);
    document.getElementById("time-value").textContent = bicycleTime.toFixed(1);
    document.getElementById("time-display").textContent =
      bicycleTime.toFixed(1);
    if (currentExercise === "2a") {
      renderExercise("2a");
    }
  });
}

// Funções Matemáticas
function calculateTransformationMatrix(dx, dy, dtheta) {
  const thetaRad = (dtheta * Math.PI) / 180;
  const cos = Math.cos(thetaRad);
  const sin = Math.sin(thetaRad);

  if (dtheta !== 0) {
    return [
      [cos, -sin, dx],
      [sin, cos, dy],
      [0, 0, 1],
    ];
  } else {
    return [
      [1, 0, dx],
      [0, 1, dy],
      [0, 0, 1],
    ];
  }
}

function multiplyMatrices(m1, m2) {
  const result = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        result[i][j] += m1[i][k] * m2[k][j];
      }
    }
  }
  return result;
}

function transformPoint(matrix, point) {
  return {
    x: matrix[0][0] * point.x + matrix[0][1] * point.y + matrix[0][2],
    y: matrix[1][0] * point.x + matrix[1][1] * point.y + matrix[1][2],
  };
}

function formatMatrix(matrix) {
  return matrix
    .map((row) => row.map((val) => val.toFixed(4).padStart(10)).join("  "))
    .join("\n");
}

// Exercícios
function exercise1a() {
  const point = { x: 0, y: 0 };
  const T1 = calculateTransformationMatrix(3, 2, 0);
  const T2 = calculateTransformationMatrix(0, 0, 45);

  let transformed = transformPoint(T1, point);
  transformed = transformPoint(T2, transformed);

  const matrixCombined = multiplyMatrices(T2, T1);

  return {
    description: "Ponto p=(0,0,1) após translação (3,2) e rotação de 45°",
    point: transformed,
    matrix: matrixCombined,
    steps: [
      { x: 0, y: 0, label: "Ponto inicial" },
      { x: 3, y: 2, label: "Após translação" },
      { x: transformed.x, y: transformed.y, label: "Após rotação 45°" },
    ],
  };
}

function exercise1b() {
  const point = { x: 0, y: 1 };
  const T1 = calculateTransformationMatrix(0, 0, -45);
  const T2 = calculateTransformationMatrix(3, 2, 0);

  let transformed = transformPoint(T1, point);
  transformed = transformPoint(T2, transformed);

  const matrixCombined = multiplyMatrices(T2, T1);

  const cos45 = Math.cos(-Math.PI / 4);
  const sin45 = Math.sin(-Math.PI / 4);
  const afterRotation = {
    x: point.x * cos45 - point.y * sin45,
    y: point.x * sin45 + point.y * cos45,
  };

  return {
    description: "Ponto p=(0,1,1) após rotação de -45° e translação (3,2)",
    point: transformed,
    matrix: matrixCombined,
    steps: [
      { x: 0, y: 1, label: "Ponto inicial" },
      { x: afterRotation.x, y: afterRotation.y, label: "Após rotação -45°" },
      { x: transformed.x, y: transformed.y, label: "Após translação" },
    ],
  };
}

function exercise2a() {
  const v = 1; // m/s
  const s = 1; // m
  const delta = Math.PI / 4; // 45°
  const gamma = 0;
  const t = bicycleTime;

  const gamma_t = gamma + (v / s) * Math.tan(delta) * t;
  const x_t = (s / Math.tan(delta)) * (Math.sin(gamma_t) - Math.sin(gamma));
  const y_t = (s / Math.tan(delta)) * (-Math.cos(gamma_t) + Math.cos(gamma));

  const steps = generateBicyclePath(0, t, 50, v, s, delta, gamma);

  return {
    description: `Modelo de Bicicleta: Posição em t=${t.toFixed(1)}s`,
    position: { x: x_t, y: y_t, gamma: gamma_t },
    params: {
      v,
      s,
      delta: (delta * 180) / Math.PI,
      gamma: (gamma * 180) / Math.PI,
    },
    steps: steps,
  };
}

function generateBicyclePath(t0, tf, steps, v, s, delta, gamma) {
  const path = [];
  const dt = (tf - t0) / steps;

  for (let i = 0; i <= steps; i++) {
    const t = t0 + i * dt;
    const gamma_t = gamma + (v / s) * Math.tan(delta) * t;
    const x = (s / Math.tan(delta)) * (Math.sin(gamma_t) - Math.sin(gamma));
    const y = (s / Math.tan(delta)) * (-Math.cos(gamma_t) + Math.cos(gamma));
    path.push({ x, y, gamma: gamma_t, t });
  }

  return path;
}

function exercise2b() {
  const v = 1; // 1m/s
  const s = 1; // 1m
  const omega = 1 / 10; // 1/10 rad/s
  const t = 1; // 1s

  const gamma_t = omega * t;
  const delta = Math.atan((s * omega) / v);

  const x_t = (v / omega) * (Math.sin(gamma_t) - 0);
  const y_t = (v / omega) * (-Math.cos(gamma_t) + 1);

  return {
    description: "Posição com ω = 1/10 rad/s em t=1s",
    position: { x: x_t, y: y_t, gamma: gamma_t },
    params: { v, s, omega, delta: (delta * 180) / Math.PI },
  };
}

function exercise2c() {
  const positions = [
    { x: 170, y: 223, target: { x: 190, y: 250 } },
    { x: 190, y: 250, target: { x: 130, y: 170 } },
  ];

  const trajectories = positions.map((pos) => {
    const dx = pos.target.x - pos.x;
    const dy = pos.target.y - pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    return {
      start: pos,
      target: pos.target,
      distance,
      angle: (angle * 180) / Math.PI,
      path: generateLinearPath(pos.x, pos.y, pos.target.x, pos.target.y, 20),
    };
  });

  return {
    description: "Controlador para navegação entre pontos",
    trajectories,
  };
}

function generateLinearPath(x0, y0, xf, yf, steps) {
  const path = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    path.push({
      x: x0 + (xf - x0) * t,
      y: y0 + (yf - y0) * t,
    });
  }
  return path;
}

function exercise3() {
  const start = { x: 200, y: 200 };
  const target = { x: 180, y: 220 };

  const dx = target.x - start.x;
  const dy = target.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  const Kv = 0.5;
  const Kh = 1.0;

  const v_star = Kv * distance;
  const gamma = Kh * angle;

  return {
    description: "Estratégia de Navegação Braitenberg",
    start,
    target,
    distance,
    angle: (angle * 180) / Math.PI,
    control: { v_star, gamma: (gamma * 180) / Math.PI },
    path: generateBraitenbergPath(start, target, 30),
  };
}

function generateBraitenbergPath(start, target, steps) {
  const path = [start];
  let current = { ...start, theta: 0 };
  const dt = 0.1;
  const Kv = 0.5;
  const Kh = 1.0;

  for (let i = 0; i < steps; i++) {
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) break;

    const desired_angle = Math.atan2(dy, dx);
    const angle_error = desired_angle - current.theta;

    const v = Kv * distance;
    const omega = Kh * angle_error;

    current = {
      x: current.x + v * Math.cos(current.theta) * dt,
      y: current.y + v * Math.sin(current.theta) * dt,
      theta: current.theta + omega * dt,
    };

    path.push({ x: current.x, y: current.y });
  }

  return path;
}

// Funções de Renderização
function renderExercise(exercise) {
  clearCanvas();
  drawGrid();

  const scale = 50;
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;

  switch (exercise) {
    case "1a":
      renderExercise1a(scale, centerX, centerY);
      break;
    case "1b":
      renderExercise1b(scale, centerX, centerY);
      break;
    case "2a":
      renderExercise2a(scale, centerX, centerY);
      break;
    case "2b":
      renderExercise2b(scale, centerX, centerY);
      break;
    case "2c":
      renderExercise2c(scale, centerX, centerY);
      break;
    case "3":
      renderExercise3(scale, centerX, centerY);
      break;
  }
}

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawGrid() {
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;
  const scale = 50;

  // Grid
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  for (let i = 0; i <= CANVAS_WIDTH; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, CANVAS_HEIGHT);
    ctx.stroke();
  }
  for (let i = 0; i <= CANVAS_HEIGHT; i += 50) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(CANVAS_WIDTH, i);
    ctx.stroke();
  }

  // Eixos
  ctx.strokeStyle = "#9ca3af";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2, 0);
  ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_HEIGHT / 2);
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
  ctx.stroke();

  // Adicionar coordenadas numéricas
  ctx.fillStyle = "#4b5563";
  ctx.font = "10px Arial";
  ctx.textAlign = "center";

  // Coordenadas no eixo X (horizontal)
  for (let i = 0; i <= CANVAS_WIDTH; i += 50) {
    const coordX = (i - centerX) / scale;
    if (coordX !== 0) {
      // Mostrar todas as coordenadas
      ctx.fillText(coordX.toFixed(0), i, centerY + 18);
      // Marcação no eixo - maior para valores pares
      if (Math.abs(coordX) % 2 === 0) {
        ctx.fillStyle = "#4b5563";
        ctx.fillRect(i - 1, centerY - 5, 2, 10);
      } else {
        ctx.fillStyle = "#9ca3af";
        ctx.fillRect(i - 0.5, centerY - 3, 1, 6);
      }
      ctx.fillStyle = "#4b5563";
    }
  }

  // Coordenadas no eixo Y (vertical)
  ctx.textAlign = "right";
  for (let i = 0; i <= CANVAS_HEIGHT; i += 50) {
    const coordY = (centerY - i) / scale;
    if (coordY !== 0) {
      // Mostrar todas as coordenadas
      ctx.fillText(coordY.toFixed(0), centerX - 8, i + 4);
      // Marcação no eixo - maior para valores pares
      if (Math.abs(coordY) % 2 === 0) {
        ctx.fillStyle = "#4b5563";
        ctx.fillRect(centerX - 5, i - 1, 10, 2);
      } else {
        ctx.fillStyle = "#9ca3af";
        ctx.fillRect(centerX - 3, i - 0.5, 6, 1);
      }
      ctx.fillStyle = "#4b5563";
    }
  }

  // Marcar origem (0,0)
  ctx.textAlign = "right";
  ctx.fillStyle = "#1f2937";
  ctx.font = "bold 12px Arial";
  ctx.fillText("0", centerX - 8, centerY - 8);

  // Círculo na origem
  ctx.fillStyle = "#6b7280";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
  ctx.fill();

  // Labels dos eixos
  ctx.fillStyle = "#1f2937";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  ctx.fillText("X →", CANVAS_WIDTH - 25, centerY - 10);
  ctx.fillText("↑", centerX + 15, 25);
  ctx.fillText("Y", centerX + 15, 38);
}

function renderExercise1a(scale, centerX, centerY) {
  const data = exercise1a();

  data.steps.forEach((step, index) => {
    const x = centerX + step.x * scale;
    const y = centerY - step.y * scale;

    // Desenhar ponto
    ctx.fillStyle = index === data.steps.length - 1 ? "#ef4444" : "#3b82f6";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Label
    ctx.fillStyle = "#1f2937";
    ctx.font = "12px monospace";
    ctx.fillText(step.label, x + 12, y - 12);

    // Desenhar linha
    if (index > 0) {
      const prevStep = data.steps[index - 1];
      const prevX = centerX + prevStep.x * scale;
      const prevY = centerY - prevStep.y * scale;

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Seta
      const angle = Math.atan2(y - prevY, x - prevX);
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x - 10 * Math.cos(angle - Math.PI / 6),
        y - 10 * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        x - 10 * Math.cos(angle + Math.PI / 6),
        y - 10 * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
  });

  updatePanels(
    `Ponto transformado q: (${data.point.x.toFixed(3)}, ${data.point.y.toFixed(
      3
    )})`,
    `<ul>
            <li>Ponto inicial: p = (0, 0, 1)</li>
            <li>Translação: (3, 2)</li>
            <li>Rotação: 45°</li>
            <li>Matriz resultante T₂ × T₁</li>
        </ul>`,
    formatMatrix(data.matrix)
  );
}

function renderExercise1b(scale, centerX, centerY) {
  const data = exercise1b();

  data.steps.forEach((step, index) => {
    const x = centerX + step.x * scale;
    const y = centerY - step.y * scale;

    ctx.fillStyle = index === data.steps.length - 1 ? "#ef4444" : "#3b82f6";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#1f2937";
    ctx.font = "12px monospace";
    ctx.fillText(step.label, x + 12, y - 12);

    if (index > 0) {
      const prevStep = data.steps[index - 1];
      const prevX = centerX + prevStep.x * scale;
      const prevY = centerY - prevStep.y * scale;

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  });

  updatePanels(
    `Ponto transformado q: (${data.point.x.toFixed(3)}, ${data.point.y.toFixed(
      3
    )})`,
    `<ul>
            <li>Ponto inicial: p = (0, 1, 1)</li>
            <li>Rotação: -45°</li>
            <li>Translação: (3, 2)</li>
            <li>Ordem: T₂ × T₁</li>
        </ul>`,
    formatMatrix(data.matrix)
  );
}

function renderExercise2a(scale, centerX, centerY) {
  const data = exercise2a();

  // Desenhar trajetória
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.steps.forEach((point, index) => {
    const x = centerX + point.x * scale;
    const y = centerY - point.y * scale;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Ponto inicial
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
  ctx.fill();

  // Ponto final
  const endPoint = data.steps[data.steps.length - 1];
  const endX = centerX + endPoint.x * scale;
  const endY = centerY - endPoint.y * scale;
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(endX, endY, 8, 0, 2 * Math.PI);
  ctx.fill();

  updatePanels(
    `Posição em t=${bicycleTime.toFixed(1)}s: x=${data.position.x.toFixed(
      3
    )}m, y=${data.position.y.toFixed(3)}m, γ=${(
      (data.position.gamma * 180) /
      Math.PI
    ).toFixed(2)}°`,
    `<ul>
            <li>Modelo cinemático de bicicleta</li>
            <li>v = 1 m/s, s = 1m, δ = 45°</li>
            <li>γ(t) = (v/s)·tan(δ)·t</li>
            <li>Trajetória circular</li>
        </ul>`,
    null
  );
}

function renderExercise2b(scale, centerX, centerY) {
  const data = exercise2b();

  // Ponto inicial
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
  ctx.fill();

  // Ponto final
  const x = centerX + data.position.x * scale;
  const y = centerY - data.position.y * scale;
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fill();

  updatePanels(
    `Posição em t=1s: x=${data.position.x.toFixed(
      3
    )}m, y=${data.position.y.toFixed(3)}m, γ=${(
      (data.position.gamma * 180) /
      Math.PI
    ).toFixed(2)}°, δ=${data.params.delta.toFixed(2)}°`,
    `<ul>
            <li>Velocidade angular: ω = 1/10 rad/s</li>
            <li>v = 1 m/s, s = 1m</li>
            <li>δ = arctan(s·ω/v)</li>
            <li>Posição calculada em t=1s</li>
        </ul>`,
    null
  );
}

function renderExercise2c(scale, centerX, centerY) {
  const data = exercise2c();

  data.trajectories.forEach((traj) => {
    // Desenhar trajetória
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();

    traj.path.forEach((point, index) => {
      const x = centerX + (point.x - 150) * 2;
      const y = centerY - (point.y - 200) * 2;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Pontos
    const startX = centerX + (traj.start.x - 150) * 2;
    const startY = centerY - (traj.start.y - 200) * 2;
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(startX, startY, 8, 0, 2 * Math.PI);
    ctx.fill();

    const endX = centerX + (traj.target.x - 150) * 2;
    const endY = centerY - (traj.target.y - 200) * 2;
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(endX, endY, 8, 0, 2 * Math.PI);
    ctx.fill();
  });

  updatePanels(
    `Trajetória 1: ${data.trajectories[0].distance.toFixed(
      2
    )} pixels a ${data.trajectories[0].angle.toFixed(2)}°`,
    `<ul>
            <li>Controlador de navegação</li>
            <li>(170,223) → (190,250)</li>
            <li>(190,250) → (130,170)</li>
            <li>Trajetória em linha reta</li>
        </ul>`,
    null
  );
}

function renderExercise3(scale, centerX, centerY) {
  const data = exercise3();

  // Desenhar trajetória
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.path.forEach((point, index) => {
    const x = point.x * 2;
    const y = point.y * 2;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Ponto inicial
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(data.start.x * 2, data.start.y * 2, 10, 0, 2 * Math.PI);
  ctx.fill();

  // Alvo
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(data.target.x * 2, data.target.y * 2, 15, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(data.target.x * 2, data.target.y * 2, 5, 0, 2 * Math.PI);
  ctx.fill();

  updatePanels(
    `Distância: ${data.distance.toFixed(2)}, Ângulo: ${data.angle.toFixed(
      2
    )}°, v*=${data.control.v_star.toFixed(3)}`,
    `<ul>
            <li>Estratégia Braitenberg</li>
            <li>Início: (200, 200)</li>
            <li>Alvo: (180, 220)</li>
            <li>Controlador proporcional</li>
        </ul>`,
    null
  );
}

function updatePanels(result, info, matrix) {
  document.getElementById("result-text").textContent = result;
  document.getElementById("info-text").innerHTML = info;

  const matrixPanel = document.getElementById("matrix-panel");
  if (matrix) {
    matrixPanel.classList.remove("hidden");
    document.getElementById("matrix-text").textContent = matrix;
  } else {
    matrixPanel.classList.add("hidden");
  }
}
