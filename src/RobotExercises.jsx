import React, { useState, useRef, useEffect } from "react";
import { Play, RotateCcw, Info, ChevronRight } from "lucide-react";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export const RobotExercises = () => {
  const [selectedExercise, setSelectedExercise] = useState("1a");
  const canvasRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState("");

  // State para exercício 2
  const [bicycleTime, setBicycleTime] = useState(1);
  const [bicycleParams, setBicycleParams] = useState({
    v: 1, // velocidade
    s: 1, // distância entre eixos
    delta: Math.PI / 4, // ângulo de direção (45°)
    gamma: 0, // orientação inicial
  });

  // State para exercício 3 - Navegação Braitenberg
  const [robotPos, setRobotPos] = useState({ x: 200, y: 200 });
  const [targetPos, setTargetPos] = useState({ x: 180, y: 220 });

  // Função para calcular matriz de transformação
  const calculateTransformationMatrix = (dx, dy, dtheta) => {
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
  };

  // Função para multiplicar matrizes
  const multiplyMatrices = (m1, m2) => {
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
  };

  // Função para aplicar transformação a um ponto
  const transformPoint = (matrix, point) => {
    return {
      x: matrix[0][0] * point.x + matrix[0][1] * point.y + matrix[0][2],
      y: matrix[1][0] * point.x + matrix[1][1] * point.y + matrix[1][2],
    };
  };

  // Exercício 1a: Transformação de ponto p=(0,0,1)
  const exercise1a = () => {
    const point = { x: 0, y: 0 };
    // Translação (3, 2)
    const T1 = calculateTransformationMatrix(3, 2, 0);
    // Rotação 45°
    const T2 = calculateTransformationMatrix(0, 0, 45);

    // Aplicar transformações
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
  };

  // Exercício 1b: Transformação de ponto p=(0,1,1)
  const exercise1b = () => {
    const point = { x: 0, y: 1 };
    // Rotação -45°
    const T1 = calculateTransformationMatrix(0, 0, -45);
    // Translação (3, 2)
    const T2 = calculateTransformationMatrix(3, 2, 0);

    // Aplicar transformações
    let transformed = transformPoint(T1, point);
    transformed = transformPoint(T2, transformed);

    const matrixCombined = multiplyMatrices(T2, T1);

    return {
      description: "Ponto p=(0,1,1) após rotação de -45° e translação (3,2)",
      point: transformed,
      matrix: matrixCombined,
      steps: [
        { x: 0, y: 1, label: "Ponto inicial" },
        {
          x:
            point.x * Math.cos(-Math.PI / 4) - point.y * Math.sin(-Math.PI / 4),
          y:
            point.x * Math.sin(-Math.PI / 4) + point.y * Math.cos(-Math.PI / 4),
          label: "Após rotação -45°",
        },
        { x: transformed.x, y: transformed.y, label: "Após translação" },
      ],
    };
  };

  // Exercício 2a: Modelo de Bicicleta - posição em t=1s
  const exercise2a = () => {
    const { v, s, delta, gamma } = bicycleParams;
    const t = bicycleTime;

    // Cálculo da posição do robô usando modelo de bicicleta
    // x(t) = ∫v*cos(γ)dt
    // y(t) = ∫v*sin(γ)dt
    // γ(t) = (v/s)*tan(δ)*t

    const gamma_t = gamma + (v / s) * Math.tan(delta) * t;

    // Posição inicial (0, 0)
    const x_t = (s / Math.tan(delta)) * (Math.sin(gamma_t) - Math.sin(gamma));
    const y_t = (s / Math.tan(delta)) * (-Math.cos(gamma_t) + Math.cos(gamma));

    return {
      description: `Modelo de Bicicleta: Posição em t=${t}s`,
      position: { x: x_t, y: y_t, gamma: gamma_t },
      params: {
        v,
        s,
        delta: (delta * 180) / Math.PI,
        gamma: (gamma * 180) / Math.PI,
      },
      formula: `γ(t) = (v/s)*tan(δ)*t`,
      steps: generateBicyclePath(0, t, 50),
    };
  };

  // Gerar trajetória da bicicleta
  const generateBicyclePath = (t0, tf, steps) => {
    const { v, s, delta, gamma } = bicycleParams;
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
  };

  // Exercício 2b: Modelo de Bicicleta com velocidade angular de 1/10 rad
  const exercise2b = () => {
    const v = 1; // 1m/s
    const s = 1; // 1m
    const omega = 1 / 10; // 1/10 rad/s
    const t = 1; // 1s

    // γ(t) = ω*t
    const gamma_t = omega * t;

    // Para movimento circular: δ = arctan(s*ω/v)
    const delta = Math.atan((s * omega) / v);

    const x_t = (v / omega) * (Math.sin(gamma_t) - 0);
    const y_t = (v / omega) * (-Math.cos(gamma_t) + 1);

    return {
      description: `Posição com ω = 1/10 rad/s em t=1s`,
      position: { x: x_t, y: y_t, gamma: gamma_t },
      params: { v, s, omega, delta: (delta * 180) / Math.PI },
      formula: `ω = (v/s)*tan(δ)`,
    };
  };

  // Exercício 2c: Controlador para deslocar de posições específicas
  const exercise2c = () => {
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
  };

  // Gerar caminho linear
  const generateLinearPath = (x0, y0, xf, yf, steps) => {
    const path = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      path.push({
        x: x0 + (xf - x0) * t,
        y: y0 + (yf - y0) * t,
      });
    }
    return path;
  };

  // Exercício 3: Navegação Braitenberg
  const exercise3 = () => {
    const start = { x: 200, y: 200 };
    const target = { x: 180, y: 220 };

    const dx = target.x - start.x;
    const dy = target.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    // Controlador Braitenberg
    const Kv = 0.5; // Ganho velocidade
    const Kh = 1.0; // Ganho direção

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
  };

  // Gerar trajetória Braitenberg
  const generateBraitenbergPath = (start, target, steps) => {
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
  };

  // Desenhar no canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Desenhar grid
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

    // Desenhar eixos
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

    const scale = 50; // 50 pixels = 1 unidade
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    // Renderizar baseado no exercício selecionado
    if (selectedExercise === "1a") {
      const data = exercise1a();
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

          // Desenhar seta
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
      setResult(
        `Ponto transformado q: (${data.point.x.toFixed(
          3
        )}, ${data.point.y.toFixed(3)})`
      );
    } else if (selectedExercise === "1b") {
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
      setResult(
        `Ponto transformado q: (${data.point.x.toFixed(
          3
        )}, ${data.point.y.toFixed(3)})`
      );
    } else if (selectedExercise === "2a") {
      const data = exercise2a();
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

      // Desenhar posição inicial e final
      const startX = centerX;
      const startY = centerY;
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(startX, startY, 8, 0, 2 * Math.PI);
      ctx.fill();

      const endPoint = data.steps[data.steps.length - 1];
      const endX = centerX + endPoint.x * scale;
      const endY = centerY - endPoint.y * scale;
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(endX, endY, 8, 0, 2 * Math.PI);
      ctx.fill();

      setResult(
        `Posição em t=${bicycleTime}s: x=${data.position.x.toFixed(
          3
        )}m, y=${data.position.y.toFixed(3)}m, γ=${(
          (data.position.gamma * 180) /
          Math.PI
        ).toFixed(2)}°`
      );
    } else if (selectedExercise === "2b") {
      const data = exercise2b();
      setResult(
        `Posição em t=1s: x=${data.position.x.toFixed(
          3
        )}m, y=${data.position.y.toFixed(3)}m, γ=${(
          (data.position.gamma * 180) /
          Math.PI
        ).toFixed(2)}°, δ=${data.params.delta.toFixed(2)}°`
      );

      // Desenhar ponto
      const x = centerX + data.position.x * scale;
      const y = centerY - data.position.y * scale;
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
      ctx.fill();
    } else if (selectedExercise === "2c") {
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

        // Desenhar pontos
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

      setResult(
        `Trajetória 1: ${data.trajectories[0].distance.toFixed(
          2
        )} pixels a ${data.trajectories[0].angle.toFixed(2)}°`
      );
    } else if (selectedExercise === "3") {
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

      // Desenhar ponto inicial
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(data.start.x * 2, data.start.y * 2, 10, 0, 2 * Math.PI);
      ctx.fill();

      // Desenhar alvo
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(data.target.x * 2, data.target.y * 2, 15, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(data.target.x * 2, data.target.y * 2, 5, 0, 2 * Math.PI);
      ctx.fill();

      setResult(
        `Distância: ${data.distance.toFixed(2)}, Ângulo: ${data.angle.toFixed(
          2
        )}°, v*=${data.control.v_star.toFixed(3)}`
      );
    }
  }, [selectedExercise, bicycleTime]);

  const formatMatrix = (matrix) => {
    return matrix
      .map((row) => row.map((val) => val.toFixed(4)).join("  "))
      .join("\n");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Exercícios de Robótica - Cinemática e Navegação
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seletor de Exercícios */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Questões</h2>

            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-semibold text-blue-400 mb-2">
                  1. Transformações
                </h3>
                <button
                  onClick={() => setSelectedExercise("1a")}
                  className={`w-full text-left px-3 py-2 rounded text-sm mb-1 ${
                    selectedExercise === "1a"
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  1a) p=(0,0) → T(3,2) + R(45°)
                </button>
                <button
                  onClick={() => setSelectedExercise("1b")}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    selectedExercise === "1b"
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  1b) p=(0,1) → R(-45°) + T(3,2)
                </button>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-semibold text-green-400 mb-2">
                  2. Modelo de Bicicleta
                </h3>
                <button
                  onClick={() => setSelectedExercise("2a")}
                  className={`w-full text-left px-3 py-2 rounded text-sm mb-1 ${
                    selectedExercise === "2a"
                      ? "bg-green-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  2a) Posição em t={bicycleTime}s
                </button>
                <button
                  onClick={() => setSelectedExercise("2b")}
                  className={`w-full text-left px-3 py-2 rounded text-sm mb-1 ${
                    selectedExercise === "2b"
                      ? "bg-green-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  2b) ω = 1/10 rad, t=1s
                </button>
                <button
                  onClick={() => setSelectedExercise("2c")}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    selectedExercise === "2c"
                      ? "bg-green-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  2c) Controlador de posição
                </button>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-semibold text-purple-400 mb-2">
                  3. Navegação
                </h3>
                <button
                  onClick={() => setSelectedExercise("3")}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    selectedExercise === "3"
                      ? "bg-purple-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  3) Braitenberg (200,200)→(180,220)
                </button>
              </div>
            </div>

            {selectedExercise === "2a" && (
              <div className="mt-4 p-3 bg-gray-700 rounded">
                <label className="text-sm">Tempo (s):</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={bicycleTime}
                  onChange={(e) => setBicycleTime(parseFloat(e.target.value))}
                  className="w-full mt-2"
                />
                <div className="text-center text-lg font-bold mt-2">
                  t = {bicycleTime.toFixed(1)}s
                </div>
              </div>
            )}
          </div>

          {/* Canvas de Visualização */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Visualização</h2>

            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border border-gray-600 rounded bg-white w-full"
            />

            {result && (
              <div className="mt-4 p-4 bg-gray-700 rounded">
                <h3 className="text-sm font-semibold text-yellow-400 mb-2">
                  Resultado:
                </h3>
                <p className="font-mono text-sm">{result}</p>
              </div>
            )}

            <div className="mt-4 p-4 bg-gray-700 rounded">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">
                Informações:
              </h3>
              {selectedExercise === "1a" && (
                <div className="text-sm space-y-2">
                  <p>• Ponto inicial: p = (0, 0, 1)</p>
                  <p>• Translação: (3, 2)</p>
                  <p>• Rotação: 45°</p>
                  <p>• Matriz resultante T₂ × T₁</p>
                </div>
              )}
              {selectedExercise === "1b" && (
                <div className="text-sm space-y-2">
                  <p>• Ponto inicial: p = (0, 1, 1)</p>
                  <p>• Rotação: -45°</p>
                  <p>• Translação: (3, 2)</p>
                  <p>• Ordem: T₂ × T₁</p>
                </div>
              )}
              {selectedExercise === "2a" && (
                <div className="text-sm space-y-2">
                  <p>• Modelo cinemático de bicicleta</p>
                  <p>• v = 1 m/s, s = 1m, δ = 45°</p>
                  <p>• γ(t) = (v/s)·tan(δ)·t</p>
                  <p>• Trajetória circular</p>
                </div>
              )}
              {selectedExercise === "2b" && (
                <div className="text-sm space-y-2">
                  <p>• Velocidade angular: ω = 1/10 rad/s</p>
                  <p>• v = 1 m/s, s = 1m</p>
                  <p>• δ = arctan(s·ω/v)</p>
                  <p>• Posição calculada em t=1s</p>
                </div>
              )}
              {selectedExercise === "2c" && (
                <div className="text-sm space-y-2">
                  <p>• Controlador de navegação</p>
                  <p>• (170,223) → (190,250)</p>
                  <p>• (190,250) → (130,170)</p>
                  <p>• Trajetória em linha reta</p>
                </div>
              )}
              {selectedExercise === "3" && (
                <div className="text-sm space-y-2">
                  <p>• Estratégia Braitenberg</p>
                  <p>• Início: (200, 200)</p>
                  <p>• Alvo: (180, 220)</p>
                  <p>• Controlador proporcional</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotExercises;
